define(['../helpers/MustacheLoader', '../lib/ace'], function(ML) {
   var getUrlParam = function (param) {
      var codedParam = (new RegExp(param + '=([^&]+)')).exec(window.location.search)[1];
      return decodeURIComponent(codedParam);
   };

   var getIssueEntityProperties = function(issueKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issue/' + issueKey + '/properties',
               type: 'GET',
               success: function(data) {
                  self.resolve(JSON.parse(data));
               }, error: function() {
                  self.reject();
               }
            });
         });
      });
   };

   var getIssueEntityProperty = function(issueKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issue/' + issueKey + '/properties/' + propertyKey,
               type: 'GET',
               success: function(data) {
                  self.resolve(JSON.parse(data));
               }, error: function() {
                  self.reject();
               }
            });
         });
      });
   };

   var setIssueEntityProperty = function(issueKey, propertyKey, propertyValue) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issue/' + issueKey + '/properties/' + propertyKey,
               type: 'PUT',
               contentType: 'application/json',
               data: JSON.stringify(propertyValue),
               success: function(data) {
                  self.resolve();
               }, error: function() {
                  self.reject();
               }
            });
         });
      });
   };
   
   var getAddonProperties = function(pKey) {
      return $.Deferred(function(deferred) {
         request({
            url: '/rest/atlassian-connect/1/addons/' + pluginKey + '/properties/' + propertyKey + "?jsonValue=true",
            type: 'GET',
            success: function(response) {
               response = JSON.parse(response);
               deferred.resolve(response);
            },
            error: function(response) {
               console.log("Error loading API (" + uri + ")");
               console.log(arguments);
               deferred.reject();
            },
            contentType: "application/json"
         });
      });
   };

   ace.config.set('themePath', '/static/ace/themes');
   ace.config.set('modePath', '/static/ace/mode');

   var setAddonProperties = function(pKey, data) {
      return $.Deferred(function(deferred) {
         request({
            url: '/rest/atlassian-connect/1/addons/' + pluginKey + '/properties/' + pKey,
            type: 'PUT',
            data: JSON.stringify(data),
            success: function(response) {
               response = JSON.parse(response);
               deferred.resolve(response);
            },
            error: function(response) {
               console.log("Error loading API (" + uri + ")");
               console.log(arguments);
               deferred.reject();
            },
            contentType: "application/json"
         });
      });
   };

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
      console.log("I can use AP now!");
      var templates = ML.load();

      var issueKey = getUrlParam('issueKey');

      // TODO make it so that we can press a refresh button and get a refreshed copy of all of these
      // properties...or maybe just a refresh button per property
      getIssueEntityProperties(issueKey).done(function(data) {
         var sortedProperties = data.keys.sort(function(a, b) {
            return a.key.localeCompare(b.key);
         });

         var propertiesDiv = AJS.$(".properties");
         propertiesDiv.empty();
         var requests = [];
         AJS.$.each(sortedProperties, function(i, property) {
            var propertyPanel = AJS.$(templates.render('property-panel', property)).appendTo(propertiesDiv);
            var request = getIssueEntityProperty(issueKey, property.key);

            requests.push(request.then(function(data) {
               console.log(data);
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
                  // TODO get the value, check to see if it is valid JSON, then attempt to post it
                  // back to the 
                  console.log(e);
                  // TODO debounce this by 500ms
                  var status = propertyPanel.find('.status');
                  var rawData = editor.getValue();
                  if(isValidJson(rawData)) {
                     // TODO update the entity properties
                     updateStatus(status, statuses.saving);

                     if(updateTimeout) {
                        clearTimeout(updateTimeout);
                     }

                     var updateProperty = function() {
                        setIssueEntityProperty(issueKey, property.key, JSON.parse(rawData)).done(function() {
                           updateStatus(status, statuses.saved);
                           setTimeout(function() {
                              updateStatus(status, statuses.blank);
                           }, 3000);
                        });
                     };

                     updateTimeout = setTimeout(updateProperty, 400);
                  } else {
                     console.log("Data invalid");
                     updateStatus(status, statuses.error);
                     // TODO show an error state highlighting that the errors need to be cleaned up
                  }
               });
            }));
         });

         AJS.$.when(requests).done(function() {
            console.log("all done");
            AP.resize();
         });
      });

      AP.resize();
   });
});

