define(function() {
   var getIssueTypes = function() {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issuetype',
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

   var getIssueTypeEntityProperties = function(issueTypeId) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issuetype/' + issueTypeId + '/properties',
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

   var getIssueTypeEntityProperty = function(issueTypeId, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issuetype/' + issueTypeId + '/properties/' + encodeURI(propertyKey),
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

   var setIssueTypeEntityProperty = function(issueTypeId, propertyKey, propertyValue) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issuetype/' + issueTypeId + '/properties/' + encodeURI(propertyKey),
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

   var removeIssueTypeEntityProperty = function(issueTypeId, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/issuetype/' + issueTypeId + '/properties/' + encodeURI(propertyKey),
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
      getAll: getIssueTypes,
      getProperties: getIssueTypeEntityProperties,
      getProperty: getIssueTypeEntityProperty,
      setProperty: setIssueTypeEntityProperty,
      removeProperty: removeIssueTypeEntityProperty
   };
});
