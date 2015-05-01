'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
(function(){
angular.module('manageBox.common.directive.todo-panel', [])
	.directive('todoPanel', [
    'manageBox.common.service.socket.SocketService'
    ,'manageBox.common.service.ThingAPIService'
    , function( socket, thing ){
		return {
      templateUrl: 'app/common/directive/todo-panel/todo-panel.tpl.html'
      , restrict: 'E'
      , replace: true
      //, scope: true
      , scope: { todos: '='
                ,itemDelete: '&'
                ,itemAdd: '&'
                }
      , controller: todoPanelController
      , link: todoPanelLink
    };

    function todoPanelLink(scope, element) {
      console.log('todoPanelLink');
      scope.idt = function(){ alert('sss');}
      scope.blah = function(){ alert('lbah'); }
      scope.addTodo = function(event){
        var input = jQuery('#todo-input')
        //console.log(event);
        scope.itemAdd()(input.val());
        input.val('');
      }
    }

    function todoPanelController( $scope, $element){
      console.log('todoPanelController');
      //console.log($scope.todos);
      $scope.todoDelete = function(thing){
        console.log('Delete');
        $scope.itemDelete(thing);
      };
      $scope.idt = function(){ console.log('DELETE');}
      this.dt = function(){ console.log('DELETE');}
      $scope.xxx='yyy';
      $scope.zzz='xxx';
    }

	}]);
})();


