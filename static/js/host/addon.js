define(function() {
   "use strict";

   var restBase = "/rest/atlassian-connect/1/addons/";

   var getAddonProperties = function(addonKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: restBase + addonKey + '/properties',
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

   var getAddonProperty = function(addonKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: restBase + addonKey + '/properties/' + propertyKey,
               data: {
                  jsonValue: true
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

   var setAddonProperty = function(addonKey, propertyKey, propertyValue) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: restBase + addonKey + '/properties/' + propertyKey,
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

   var removeAddonProperty = function(addonKey, propertyKey) {
      return $.Deferred(function(self) {
         AP.require(['request'], function(request) {
            request({
               url: restBase + addonKey + '/properties/' + propertyKey,
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
      getProperties: getAddonProperties,
      getProperty: getAddonProperty,
      setProperty: setAddonProperty,
      removeProperty: removeAddonProperty
   };
});
