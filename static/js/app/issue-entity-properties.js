define(['../helpers/MustacheLoader'], function(ML) {
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

   var baseUrl = getUrlParam('xdm_e') + getUrlParam('cp');
   $.getScript(baseUrl + '/atlassian-connect/all.js', function() {
      // your calls to AP here
      console.log("I can use AP now!");
      var templates = ML.load();

      var issueKey = getUrlParam('issueKey');

      getIssueEntityProperties(issueKey).done(function(data) {
         var sortedProperties = data.keys.sort(function(a, b) {
            return a.key.localeCompare(b.key);
         });

         var propertiesDiv = AJS.$(".properties");
         propertiesDiv.empty();
         AJS.$.each(sortedProperties, function(i, property) {
            var data = { propertyKey: property.key };
            var propertyPanel = AJS.$(templates.render('property-panel', data)).appendTo(propertiesDiv);
            getIssueEntityProperty(issueKey, property.key).done(function(data) {
               console.log(data);
               propertyPanel.find('.property-value').text(data.value);
            });
         });

         AP.resize();

         // Render the keys to the screen
      });

      AP.resize();
   });
});

