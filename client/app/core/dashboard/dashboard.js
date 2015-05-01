'use strict';

//ToDo - use 'controllerAs'
(function(){
angular.module('manageBox.core.dashboard', [
  'ui.router'
  ,'ui.bootstrap'
  ,'manageBox.common.directive.boxFile'
  ,'manageBox.common.service.thingAPI'
  ,'oc.lazyLoad'
  ,'angularFileUpload'
])
  /*
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/core/main/main.tpl.html',
        controller: 'manageBox.core.main.MainCtrl'
      });
  }]);
  */
  .config(['$stateProvider', '$ocLazyLoadProvider',
    function ($stateProvider, $ocLazyLoadProvider) {
    $stateProvider
      /*
       .state('main', {
       url: '/',
       templateUrl: 'app/core/main/main.tpl.html',
       controller: 'manageBox.core.main.MainCtrl'
       });

       */
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'app/core/dashboard/main.tpl.html',
        resolve: {
          loadMyDirectives:function($ocLazyLoad){
            return $ocLazyLoad.load(
              {
                name:'manageBox',
                files:[
                  'app/common/directive/header/dashboard-header.directive.js',
                  'app/common/directive/header/header-notification/header-notification.directive.js',
                  'app/common/directive/sidebar/dashboard-sidebar.directive.js',
                  'app/common/directive/sidebar/sidebar-search/sidebar-search.directive.js'
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
      .state('dashboard.home',{
        url:'/home',
        controller: 'manageBox.core.dashboard.MainCtrl',
        templateUrl:'app/core/dashboard/home.tpl.html'
        /*
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            console.log('laodmyfiles');
            return $ocLazyLoad.load({
              name:'manageBox',
              files:[
                'app/core/dashboard/dashboard.js',
                'app/core/dashboard/dashboard.controller.js',
                'app/common/directive/timeline/timeline.directive.js',
                'app/common/directive/notifications/notifications.directive.js',
                'app/common/directive/chat/chat.directive.js',
                'app/common/directive/dashboard/stats/stats.directive.js'
              ]
            })
          }
        }*/
      });
  }]);

})();
