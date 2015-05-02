'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
(function(){
angular.module('manageBox.common.directive.todo-panel', [])
	.directive('todoPanel',  function(){
		return {
      templateUrl: 'app/common/directive/todo-panel/todo-panel.tpl.html'
      , restrict: 'E'
      , replace: true
      , scope: { todos: '='
                ,itemDelete: '&'
                ,itemAdd: '&'
                }
      , link: todoPanelLink
    };

    function todoPanelLink(scope, element) {
      console.log('todoPanelLink');
      scope.addTodo = function(event){
        var input = jQuery('#todo-input')
        //console.log(event);
        scope.itemAdd()(input.val());
        input.val('');
      }
    }

	});
})();


