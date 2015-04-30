'use strict';

/**
 * @ngdoc directive
 * @name headerNotification
 * @description
 * # headerNotification
 */
angular.module('manageBox.common.directive.header')
	.directive('headerNotification',function(){
		return {
        templateUrl:'app/common/directive/header/header-notification/header-notification.tpl.html',
        restrict: 'E',
        replace: true
    	}
	});


