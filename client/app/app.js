'use strict';

angular.module('manageBox', [
  'manageBox.common.directive.mongoose-error',
  'manageBox.common.navbar',
  'manageBox.common.service.auth',
  'manageBox.common.service.user',
  'manageBox.common.service.socket',
  'manageBox.common.service.modal',
  'manageBox.common.service.thingAPI',
  'manageBox.common.service.boxAPI',
  'manageBox.core.main',
  'manageBox.core.admin',
  'manageBox.core.account',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('httpErrorsInterceptor');
  })
  .factory('httpErrorsInterceptor', function ($q, $rootScope) {
    return {
      responseError: function (response) {
        var config = response.config;
        if (config.bypassErrorInterceptor) {
          return $q.reject(response);
        }
        //ToDo - listen for httpError
        $rootScope.$broadcast('httpError', response.status || 500, response.statusText || 'unknown');
        console.log(response.statusText || 'unknown');
        return $q.reject(response);
      }
    }
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run([ '$rootScope', '$location', 'manageBox.common.service.AuthService', function ($rootScope, $location, AuthService) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      AuthService.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  }]);
