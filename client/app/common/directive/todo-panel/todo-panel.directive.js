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
    ,'manageBox.common.service.ThingAPIService', function( socket, thing ){
		return {
      //templateUrl: 'app/common/directive/todo-panel/todo-panel.tpl.html'
      //templateUrl: 'app/common/directive/todo-panel/todo.html'
      template:'<button ng-click="blah()"> ZZZ </button>'
      , restrict: 'E'
      //, replace: true
      //, scope: true
      /*
      , scope: { todos: '='
                ,itemDelete: '&'
                }
                */
      //, controller: todoPanelController
      , link: todoPanelLink
    };

    function todoPanelLink(scope, element) {
      console.log('todoPanelLink');
      scope.idt = function(){ alert('sss');}
      scope.blah = function(){ alert('lbah'); }
    }

    function todoPanelController( $scope, $element){
      console.log('todoPanelController');
      //console.log($scope.todos);
      $scope.idt = function(){ console.log('DELETE');}
      this.dt = function(){ console.log('DELETE');}
      $scope.xxx='yyy';
      $scope.zzz='xxx';
    }

	}]);
})();


