define(['../helpers/PageContext', '../host/addon', '../host/user'], function(PC, Addon, User) {
   "using strict";

   var globalProperty = 'ep-tool.disabled-for-all';
   var userProperty = 'ep-tool.enabled-for-me';

   var pageContext = PC.load();

   var descriptorRequest = AJS.$.ajax({
      url: '/jira/atlassian-connect.json',
      type: 'GET',
      cache: true
   });

   $.getScript('https://connect-cdn.atl-paas.net/all.js', function() {
      AP.resize();

      descriptorRequest.done(function(descriptor) {
         var addonKey = descriptor.key;
         console.log(addonKey);

         var globalPropertyRequest = Addon.getProperty(addonKey, globalProperty);
         var userPropertyRequest = User.getProperty(pageContext.user.key, userProperty);

         var enabledForAllCheckbox = AJS.$("#enabledForAll");
         var enabledForMeCheckbox = AJS.$("#enabledForMe");

         globalPropertyRequest.done(function(property) {
            console.log(property);
            enabledForAllCheckbox.prop('checked', !property.value);
         });

         userPropertyRequest.done(function(property) {
            console.log(property);
            enabledForMeCheckbox.prop('checked', property.value);
         });

         enabledForAllCheckbox.change(function() {
            var isChecked = AJS.$(this).is(':checked');

            Addon.setProperty(addonKey, globalProperty, !isChecked).fail(function() {
               // TODO if this fails then revert the check action
            });
         });

         enabledForMeCheckbox.change(function() {
            var isChecked = AJS.$(this).is(':checked');

            User.setProperty(pageContext.user.key, userProperty, isChecked).fail(function() {
               // TODO if this fails then revert the check action
            });
         });

         // TODO load the global settings
         // TODO load the per user settings

         // Ensure that we show all content
      });
   });
});
