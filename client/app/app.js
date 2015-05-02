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

  //'manageBox.common.directive.chat',
  'manageBox.common.directive.todo-panel',
  'manageBox.common.directive.dashboard.stats',
  //'manageBox.core.main',
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
  'ui.bootstrap'
])
  .config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$ocLazyLoadProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $ocLazyLoadProvider) {
      /*
    $urlRouterProvider
      .otherwise('/');
      */


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

      /*
    $stateProvider
      .state('dashboardXXX', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
          loadMyDirectives:function($ocLazyLoad){
            return $ocLazyLoad.load(
              {
                name:'sbAdminApp',
                files:[
                  'app/common/directive/header/header.js',
                  'app/common/directive/header/header-notification/header-notification.js',
                  'app/common/directive/sidebar/sidebar.js',
                  'app/common/directive/sidebar/sidebar-search/sidebar-search.js'
                ]
              }),
              $ocLazyLoad.load(
                {
                  name:'toggle-switch',
                  files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                    "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                  ]
                }),
              $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                }),
            $ocLazyLoad.load(
              {
                name:'ngCookies',
                files:['bower_components/angular-cookies/angular-cookies.js']
              }),
            $ocLazyLoad.load(
              {
                name:'ngResource',
                files:['bower_components/angular-animate/angular-animate.js']
              }),
            $ocLazyLoad.load(
              {
                name:'ngSanitize',
                files:['bower_components/angular-sanitize/angular-sanitize.js']
              }),
            $ocLazyLoad.load(
              {
                name:'ngTouch',
                files:['bower_components/angular-touch/angular-touch.js']
              })
          }
        }
      })
      .state('dashboard.homeXXX',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
                'scripts/controllers/main.js',
                'scripts/directives/timeline/timeline.js',
                'scripts/directives/notifications/notifications.js',
                'scripts/directives/chat/chat.js',
                'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      });
      */
      /*
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
      })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
      })
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login'
      })
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load(
              'bower_components/Chart.js/Chart.min.js'
            ),
              $ocLazyLoad.load({
                name:'chart.js',
                files:[
                  'bower_components/angular-chart.js/dist/angular-chart.min.js',
                  'bower_components/angular-chart.js/dist/angular-chart.css'
                ]
              }),
              $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
              })
          }
        }
      })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
      })
      .state('dashboard.panels-wells',{
        templateUrl:'views/ui-elements/panels-wells.html',
        url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
      })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
      })
      .state('dashboard.typography',{
        templateUrl:'views/ui-elements/typography.html',
        url:'/typography'
      })
      .state('dashboard.icons',{
        templateUrl:'views/ui-elements/icons.html',
        url:'/icons'
      })
      .state('dashboard.grid',{
        templateUrl:'views/ui-elements/grid.html',
        url:'/grid'
      })
    */
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
