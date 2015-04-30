'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('manageBox.common.directive.timeline',[])
	.directive('timeline',function() {
    return {
        templateUrl:'app/common/directive/timeline/timeline.tpl.html',
        restrict: 'E',
        replace: true
    }
  });
