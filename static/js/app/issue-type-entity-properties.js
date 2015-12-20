define(['underscore', '../helpers/MustacheLoader', '../host/issue-type', '../lib/ace'], function(_, ML, IssueType) {
   function isBlank(str) {
      return (!str || /^\s*$/.test(str));
   }

   var getUrlParam = function (param) {
      var codedParam = (new RegExp(param + '=([^&]+)')).exec(window.location.search)[1];
      return decodeURIComponent(codedParam);
   };

   ace.config.set('themePath', '/static/ace/themes');
   ace.config.set('modePath', '/static/ace/mode');
   ace.config.set('workerPath', '/static/ace/worker');

   var ID = function () {
     // Math.random should be unique because of its seeding algorithm.
     // Convert it to base 36 (numbers + letters), and grab the first 9 characters
     // after the decimal.
     return '_' + Math.random().toString(36).substr(2, 9);
   };

   var isValidJson = function(rawData) {
      try {
         JSON.parse(rawData);
         return true;
      } catch (error) {
         return false;
      }
   };

   var statuses = {
      blank: -1,
      saved: 0,
      saving: 1,
      invalid: 2
   };

   var updateStatus = function(e, status) {
      switch(status) {
         case statuses.blank:
            e.text("");
            break;

         case statuses.saving:
            e.text("Saving...");
            break;

         case statuses.invalid:
            e.text("Property value is not valid json. Please fix for autosave to continue.");
            break;

         case statuses.saved:
            e.text("Saved!");
            break;
      }

      e.toggleClass("hidden", status === statuses.blank);
      e.toggleClass("pending", status === statuses.saving);
      e.toggleClass("error", status === statuses.invalid);
      e.toggleClass("success", status === statuses.saved);
      AP.resize();
   };

   var baseUrl = getUrlParam('xdm_e') + getUrlParam('cp');
   $.getScript(baseUrl + '/atlassian-connect/all.js', function() {
      // your calls to AP here
      var templates = ML.load();

      var currentIssueTypeId;

      var setupCurrentUserSelector = function() {
         var selector = AJS.$("#current-user-selector");

         // TODO load all of the issue types into the selector

         selector.auiSelect2({
            placeholder: "Choose issue type...",
            minimumInputLength: 1,
            multiple: false,
            maximumSelectionSize: 1,
            escapeMarkup: function(x) { return x; },
            initSelection: function(element, callback) {
               callback({id: initialUserKey, text: initialUserKey});
            },
            query: function(query) {
               IssueType.getAll().done(function(issuetypes) {
                  var lowerQueryTerm = query.term.toLowerCase();
                  var filteredIssueTypes = _.filter(issuetypes, function(it) { return it.name.toLowerCase().indexOf(lowerQueryTerm) >= 0; });
                  query.callback({
                     results: filteredIssueTypes.map(function(it) { return { id: it.id, text: it.name }; })
                  });
               });
            }
         });

         selector.change(function() {
            currentIssueTypeId = parseInt(selector.val());
            refreshPropertiesList(currentIssueTypeId);
            AJS.$("#add-property-button").removeAttr('aria-disabled').removeAttr('disabled');
         });
      };

      setupCurrentUserSelector();

      // TODO make it so that we can press a refresh button and get a refreshed copy of all of these
      // properties...or maybe just a refresh button per property
      var refreshPropertiesList = function(issueTypeId) {
         IssueType.getProperties(issueTypeId).done(function(data) {
            var sortedProperties = data.keys.sort(function(a, b) {
               return a.key.localeCompare(b.key);
            });

            var propertiesDiv = AJS.$(".properties");
            propertiesDiv.empty();
            var requests = [];
            AJS.$.each(sortedProperties, function(i, property) {
               var propertyPanel = AJS.$(templates.render('property-panel', property)).appendTo(propertiesDiv);
               var request = IssueType.getProperty(issueTypeId, property.key);

               requests.push(request.then(function(data) {
                  var editorObject = propertyPanel.find('.editor');
                  editorObject.text(JSON.stringify(data.value, null, 2));
                  var editorId = "editor" + ID();
                  editorObject.attr('id', editorId);

                  // Create this editor and start manipulating it
                  var editor = ace.edit(editorId);
                  editor.setTheme("ace/theme/monokai");
                  editor.getSession().setMode("ace/mode/json");

                  var updateTimeout;

                  editor.getSession().on('change', function(e) {
                     var status = propertyPanel.find('.status');
                     var rawData = editor.getValue();
                     if(isValidJson(rawData)) {
                        updateStatus(status, statuses.saving);

                        if(updateTimeout) {
                           clearTimeout(updateTimeout);
                        }

                        var updateProperty = function() {
                           IssueType.setProperty(issueTypeId, property.key, JSON.parse(rawData)).done(function() {
                              updateStatus(status, statuses.saved);
                              setTimeout(function() {
                                 updateStatus(status, statuses.blank);
                              }, 3000);
                           });
                        };

                        updateTimeout = setTimeout(updateProperty, 400);
                     } else {
                        updateStatus(status, statuses.invalid);
                     }
                  });
               }));
            });

            AJS.$.when(requests).done(function() {
               AP.resize();
            });
         });
      };

      AJS.$("#property-filter").keyup(function() {
         var filterText = AJS.$(this).val();
         AJS.$(".properties .property").each(function(i, element) {
            var self = AJS.$(this);
            var shouldShow = self.data('property-key').indexOf(filterText) >= 0;
            self.toggleClass('hidden', !shouldShow);
         });
         AP.resize();
      });

      AJS.$(".properties").on('click', '.property .delete-button', function(e) {
         var deleteButton = AJS.$(this);
         var propertyDiv = deleteButton.closest('.property');
         var propertyKey = propertyDiv.data('property-key');
         console.log("Deleting: " + propertyKey);
         IssueType.removeProperty(currentIssueTypeId, propertyKey).done(function() {
            propertyDiv.remove();
            AP.resize();
         });
      });

      var addPropertyEditor;

      AJS.$("#add-property-button").click(function() {
         console.log("Add clicked...");
         var addButton = AJS.$(this);
         var addPropertyForm = AJS.$("#add-property-form");
         // Stop hiding the form
         addPropertyForm.removeClass("hidden");

         // Load the editor if required
         if(!addPropertyEditor) {
            var editorObject = addPropertyForm.find('.editor');
            var editorId = "editor" + ID();
            editorObject.attr('id', editorId);

            // Create this editor and start manipulating it
            addPropertyEditor = ace.edit(editorId);
            addPropertyEditor.setTheme("ace/theme/monokai");
            addPropertyEditor.getSession().setMode("ace/mode/json");
         }

         // Resize the form
         AP.resize();
         addButton.addClass("hidden");
      });

      var closeAddProperty = function() {
         AJS.$("#add-property-form").addClass("hidden");
         AJS.$("#add-property-button").removeClass("hidden");
      };

      AJS.$("#add-property-cancel").click(function(e) {
         e.preventDefault();
         closeAddProperty();
         AP.resize();
      });

      AJS.$("#add-property-save").click(function(e) {
         e.preventDefault();

         // Verify that the data is correct
         var propertyKey = AJS.$("#add-property-key").val();
         var propertyValue = addPropertyEditor.getValue();
         if(isBlank(propertyKey)) {
            AP.require("messages", function(messages){
               messages.error('Property key is blank', 'Please provide a property key that is not blank. Blank property keys cannot be saved', {
                  fadeout: true,
                  delay: 5000
               });
            });
         } else {
            if(isValidJson(propertyValue)) {
               // Send the post to the rest resource
               var request = IssueType.setProperty(currentIssueTypeId, propertyKey, JSON.parse(propertyValue));
               
               request.done(function() {
                  // Show a message saying that the save succeeded
                  AP.require("messages", function(messages){
                     messages.success("Saved property '" + propertyKey + "'", '', {
                        fadeout: true,
                        delay: 2000
                     });
                  });
                  // Close the add property form
                  closeAddProperty();
                  // Refresh the list of properties
                  refreshPropertiesList(currentIssueTypeId);
               });

               request.fail(function() {
                  AP.require("messages", function(messages){
                     messages.error('Failed to save property', 'Please ensure that the data that you are trying to save is correct.', {
                        fadeout: true,
                        delay: 5000
                     });
                  });
               });

            } else {
               AP.require("messages", function(messages){
                  messages.error('Property value is not valid JSON', 'Please ensure that you provide valid JSON before trying to save the property.', {
                     fadeout: true,
                     delay: 5000
                  });
               });
            }
         }
      });

      //refreshPropertiesList(currentUserKey);
      AP.resize();
   });
});

