define(function() {
   var getProjectEntityProperties = function(projectKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/project/' + projectKey + '/properties',
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

   var getProjectEntityProperty = function(projectKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/project/' + projectKey + '/properties/' + propertyKey,
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

   var setProjectEntityProperty = function(projectKey, propertyKey, propertyValue) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/project/' + projectKey + '/properties/' + propertyKey,
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

   var removeProjectEntityProperty = function(projectKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/project/' + projectKey + '/properties/' + propertyKey,
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
      getProperties: getProjectEntityProperties,
      getProperty: getProjectEntityProperty,
      setProperty: setProjectEntityProperty,
      removeProperty: removeProjectEntityProperty
   };
});
