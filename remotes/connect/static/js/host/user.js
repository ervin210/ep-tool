define(function() {
   var getUserEntityProperties = function(userKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/user/properties',
               data: {
                  userKey: userKey
               },
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

   var getUserEntityProperty = function(userKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/user/properties/' + encodeURI(propertyKey),
               data: {
                  userKey: userKey
               },
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

   var setUserEntityProperty = function(userKey, propertyKey, propertyValue) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/user/properties/' + encodeURI(propertyKey) + '?userKey=' + encodeURIComponent(userKey),
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

   var removeUserEntityProperty = function(userKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: '/rest/api/2/user/properties/' + encodeURI(propertyKey) + '?userKey=' + encodeURIComponent(userKey),
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
      getProperties: getUserEntityProperties,
      getProperty: getUserEntityProperty,
      setProperty: setUserEntityProperty,
      removeProperty: removeUserEntityProperty
   };
});
