'use strict';

(function(){

  angular.module('manageBox.common.service.notification', [])
    .factory('manageBox.common.service.NotificationService',
    notyNotificationService);

  function notyNotificationService() {
    var settings = {
      dismissQueue: true,
      layout: 'topCenter',
      theme: 'defaultTheme',
      maxVisible: 10
    };

    return {
      error: errorNotification(settings)
      ,alert: alertNotification(settings)
      ,closeAll: closeAll
    };

    function errorNotification(settings) {
      return function(message, config) {
        var c = {type: 'error', text: message};
        $.extend(c, settings, config || {});
        noty(c)
      };
    }

    function alertNotification(settings) {
      return function(message, config){
        var c = { type: 'alert', text: message };
        $.extend(c, settings, config || {});
        noty(c)
      };
    }
    function closeAll(){
      noty.closeAll();
    }
  }
})();
