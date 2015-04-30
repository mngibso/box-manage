'use strict';

/**
 * @ngdoc directive
 * @name adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('manageBox.common.directive.sidebar', [])
  .directive('dashboardSidebar',['$location',function() {
    return {
      templateUrl:'app/common/directive/sidebar/sidebar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;

        $scope.check = function(x){

          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };

        $scope.multiCheck = function(y){

          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };
      }
    }
  }]);
