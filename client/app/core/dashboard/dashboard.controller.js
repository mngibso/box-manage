'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
//angular.module('sbAdminApp')
angular.module('manageBox.core.dashboard')
  .controller('MainCtrl',
  ['$scope'
  ,'$window'
  ,'manageBox.common.service.socket.SocketService'
  ,'manageBox.common.service.ThingAPIService'
  ,'manageBox.common.service.BoxAPIService'
  ,'manageBox.common.service.AuthService'
  ,'manageBox.common.service.NotificationService'
  ,MainController]);
  function MainController($scope, $window, socket, thing, box, auth, noty) {
   //function($scope,$position)
     console.log('main.js MainCtrl');
     $scope.awesomeThings = [];
     $scope.boxDocuments = [];
     $scope.isLoggedIn = function(){
       return auth.isLoggedIn();
     }

     box.contents().then(function(resp){
       $scope.boxDocuments = resp.data.entries;
       socket.syncUpdates('box', $scope.boxDocuments);
     });

     thing.get().then(function(things){
       $scope.awesomeThings = things;
       socket.syncUpdates('thing', $scope.awesomeThings);
     });

     //Get the doc url from the server, open new page with the doc url

     $scope.addThing = function(text) {
       thing.add(  text ).then(function(){ });
     };

     $scope.deleteThing = function(theThing) {
       if(theThing) thing.delete( theThing._id ).then(function(){ });
     };

     $scope.$on('$destroy', function () {
       console.log('destroy -unsync');
       socket.unsyncUpdates('thing');
       socket.unsyncUpdates('box');
     });

  };
