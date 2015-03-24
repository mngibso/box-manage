'use strict';

(function(){
angular.module('manageBox.core.main', [
  'ui.router'
])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/core/main/main.tpl.html',
        controller: 'manageBox.core.main.MainCtrl'
      });
  }]);
})();
