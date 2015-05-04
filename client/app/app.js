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
  'manageBox.common.service.sessionStorage',
  'manageBox.common.service.notification',
  'manageBox.common.directive.header',
  'manageBox.common.directive.sidebar',
  'manageBox.common.directive.httpError',
  'manageBox.common.directive.timeline',
  'manageBox.common.directive.notifications',
  'manageBox.common.directive.boxFile',

  'manageBox.common.directive.todo-panel',
  'manageBox.common.directive.dashboard.stats',
  'manageBox.core.dashboard',
  'manageBox.core.admin',
  'manageBox.core.account',
  'angular-loading-bar',
  'oc.lazyLoad',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'angularMoment',
  'chart.js',
  'ui.bootstrap'
])
  .config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$ocLazyLoadProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $ocLazyLoadProvider) {

      $locationProvider.html5Mode(true);
      //make req.xhr == true in node
      $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
      $httpProvider.interceptors.push('authInterceptor');
      $httpProvider.interceptors.push('httpErrorsInterceptor');
      //$httpProvider.defaults.useXDomain = true;
      //delete $httpProvider.defaults.headers.common['X-Requested-With'];

      $ocLazyLoadProvider.config({
        debug:false,
        events:true
      });

      $urlRouterProvider.otherwise('/dashboard/home');

    }])
  .factory('httpErrorsInterceptor', function ($q, $rootScope) {
    return {
      responseError: function (response) {
        console.log('httpErrorsInterceptor');
        var errObj = response && response.data && response.data.error || {};
        var config = response.config;
        if (config.bypassErrorInterceptor) {
          return $q.reject(response);
        }
        //ToDo - listen for httpError
        $rootScope.$broadcast('httpError', response.status || 500, response.statusText || 'unknown', errObj.message || 'Unknown server error.');
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
          console.log('Add auth token');
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        console.log('401 error');
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
