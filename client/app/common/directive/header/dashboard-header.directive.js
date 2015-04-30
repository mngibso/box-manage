'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('manageBox.common.directive.header',[])
	.directive('dashboardHeader',function(){
		return {
        templateUrl:'app/common/directive/header/header.tpl.html',
        restrict: 'E',
        replace: true
    	}
	});


