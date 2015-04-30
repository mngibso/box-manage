'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('manageBox.common.directive.notifications', [])
	.directive('notifications',function(){
		return {
        templateUrl:'app/common/directive/notifications/notifications.tpl.html',
        restrict: 'E',
        replace: true
    	}
	});


