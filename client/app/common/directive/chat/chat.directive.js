'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('manageBox.common.directive.chat', [])
	.directive('chat',function(){
		return {
        templateUrl:'app/common/directive/chat/chat.tpl.html',
        restrict: 'E',
        replace: true
    	}
	});


