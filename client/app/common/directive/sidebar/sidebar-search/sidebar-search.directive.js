'use strict';

/**
 * @ngdoc directive
 * @name
 * @description
 * # adminPosHeader
 */

angular.module('manageBox.common.directive.sidebar')
  .directive('sidebarSearch',function() {
    return {
      templateUrl:'app/common/directive/sidebar/sidebar-search/sidebar-search.tpl.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope){
        $scope.selectedMenu = 'home';
      }
    }
  });
