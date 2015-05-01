'use strict';

//ToDo - use 'controllerAs'
(function(){
angular.module('manageBox.core.mainxxx', [
  'ui.router'
  ,'ui.bootstrap'
  ,'manageBox.common.directive.boxFile'
  ,'angularFileUpload'
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
