'use strict';

angular.module('manageBox.core.account', [
  'ui.router'
])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/core/account/login/login.tpl.html',
        controller: 'manageBox.core.account.login.LoginCtrl'
      })
      /*
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/core/account/signup/signup.tpl.html',
        controller: 'manageBox.core.account.signup.SignupCtrl'
      })
      */
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/core/account/settings/settings.tpl.html',
        controller: 'manageBox.core.account.settings.SettingsCtrl',
        authenticate: true
      });
  }]);
