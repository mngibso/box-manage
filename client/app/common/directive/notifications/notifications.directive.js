'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
//Todo - separate out notification panel from general notifications
angular.module('manageBox.common.directive.notifications', [])
	.directive('notifications',
  [ 'manageBox.common.service.NotificationService' , function(noty){
		return {
        templateUrl:'app/common/directive/notifications/notifications.tpl.html',
        restrict: 'E',
        replace: true,
        controller: notificationsController,
      controllerAs: 'NotCtrl',
        link: notificationsLink
    	};
    function notificationsController($scope){
      console.log('notificationsController');
      //this.notificationsList = [{text: 'one', created:new Date(), type:'file'}];
      this.notificationsList = [];
      this.now = new Date();
    }

    function notificationsLink($scope){

      console.log('notificationsLink');
      //this.notificationsList = [{text: 'one', created:new Date(), type:'file'}];

      var unbindAdd = $scope.$on('boxAdded', function(event, item){
        noty.alert("'" + item.name +"' added", {timeout: 3000});
        $scope.NotCtrl.notificationsList.push( {
          text: "'" + item.name + "' added"
          ,action:'add'
         ,created: new Date()
         ,type:'file '
        });
      });
      var unbindDelete = $scope.$on('boxDeleted', function(event, item){
        noty.alert("File deleted", {timeout: 3000});
        $scope.NotCtrl.notificationsList.push( {
          text: "'" + item.name + "' deleted"
          ,action:'delete'
          ,created: new Date()
          ,type:'file '
        });
      });

      var unbindTAdd = $scope.$on('thingAdded', function(event, item){
        noty.alert("ToDo added", {timeout: 3000});
        $scope.NotCtrl.notificationsList.push( {
          text: "ToDo added"
          ,action:'add'
          ,created: new Date()
          ,type:'todo'
        });
      });

      var unbindTDelete = $scope.$on('thingDeleted', function(event, item){
        console.log('thingDeleted registered');
        noty.alert("ToDo deleted", {timeout: 3000});
        $scope.NotCtrl.notificationsList.push( {
          text:"ToDo deleted"
          ,action:'delete'
          ,created: new Date()
          ,type:'todo '
        });
      });

      $scope.$on('$destroy', function () {
        unbindAdd();
        unbindDelete();
        unbindTAdd();
        unbindTDelete();
      });

    }
	}]);

/*
.controller('manageBox.core.main.MainCtrlXXX',
  ['$scope'
    ,'$window'
    ,'manageBox.common.service.socket.SocketService'
    ,'manageBox.common.service.ThingAPIService'
    ,'manageBox.common.service.BoxAPIService'
    ,'manageBox.common.service.AuthService'
    ,'manageBox.common.service.NotificationService'
    ,MainController]);

function MainController($scope, $window, socket, thing, box, auth, noty) {

*/
