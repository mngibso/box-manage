'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('manageBox.core.dashboard', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
      debug:true,
      events:true
    });

    //$urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        //templateUrl: 'views/dashboard/main.html',
        templateUrl: 'app/core/dashboard/main.tpl.html',
        resolve: {
            loadMyDirectives: [ '$ocLazyLoad', function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'manageBox',
                    files:[
                      //'app/common/directive/header/dashboard-header.directive.js',
                      //'app/common/directive/header/header-notification/header-notification.directive.js',
                      //'app/common/directive/sidebar/dashboard-sidebar.directive.js',
                      //'app/common/directive/sidebar/sidebar-search/sidebar-search.directive.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:[//"bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          //"bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:[]//'bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:[]//'bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:[]//'bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:[]//'bower_components/angular-touch/angular-touch.js']
                })
            }]
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'manageBox.core.dashboard.DashboardCtrl',
        templateUrl:'app/core/dashboard/home.tpl.html',
        resolve: {
          loadMyDirectives: [ '$ocLazyLoad', function($ocLazyLoad){
            return $ocLazyLoad.load({
              name:'manageBox',
              files:[
              //'scripts/controllers/main.js',
              //'scripts/directives/timeline/timeline.js',
              //'scripts/directives/notifications/notifications.js',
              //'scripts/directives/chat/chat.js',
              //'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }]
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })
      /*
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login'
    })
    */
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
            loadMyFile: [ '$ocLazyLoad', function($ocLazyLoad){
            return $ocLazyLoad.load(
                'bower_components/Chart.js/Chart.min.js'
            ),
            $ocLazyLoad.load({
              name:'chart.js',
              files:[
                //'bower_components/angular-chart.js/dist/angular-chart.min.js',
                //'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'manageBox',
                files:[]//'scripts/controllers/chartContoller.js']
            })
          }]
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
  }]);


