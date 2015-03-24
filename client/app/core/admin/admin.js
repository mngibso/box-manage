'use strict';

angular.module('manageBox.core.admin', ['ui.router'])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/core/admin/admin.tpl.html',
        controller: 'manageBox.core.admin.AdminCtrl'
      });
  }]);
