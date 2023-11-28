define(function() {
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

   var removeIssueEntityProperty = function(issueKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issue/' + issueKey + '/properties/' + propertyKey,
               type: 'DELETE',
               contentType: 'application/json',
               success: function(data) {
                  self.resolve();
               }, error: function() {
                  self.reject();
               }
            });
         });
      });
   };

   return {
      getProperties: getIssueEntityProperties,
      getProperty: getIssueEntityProperty,
      setProperty: setIssueEntityProperty,
      removeProperty: removeIssueEntityProperty
   };
});
