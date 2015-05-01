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
    $scope.duh=function(){alert('duh');}
     $scope.awesomeThings = [];
     $scope.boxDocuments = [];
     $scope.isLoggedIn = auth.isLoggedIn;

     $scope.blah = function(){ console.log('blah'); } ;
     $scope.duh = function(){ console.log('duh2'); } ;
     var unbindAdd = $scope.$on('boxAdded', function(event, item){
       noty.alert("'" + item.name +"' added", {timeout: 3000});
     });
     var unbindDelete = $scope.$on('boxDeleted', function(event, item){
       noty.alert("File deleted", {timeout: 3000});
     });

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
       console.log('DElete thing');
       if(theThing) thing.delete( theThing._id ).then(function(){ });
     };

     $scope.$on('$destroy', function () {
       console.log('destroy -unsync');
       socket.unsyncUpdates('thing');
       socket.unsyncUpdates('box');
       unbind();
       unbindAdd();
       unbindDelete();
     });

     var unbind = $scope.$watch('files', function () {
       $scope.upload($scope.files);
     });

     $scope.upload = function (files) {
       if (files && files.length) {
         for (var i = 0; i < files.length; i++) {
           var file = files[i];
           box.upload(file)
             .progress(function (evt) {
               var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
               console.log('progress: ' + progressPercentage + '% ' +
                 evt.config.file.name);
             }).success(function (data, status, headers, config) {
               console.log('file ' + config.file.name + 'uploaded. ');
             });
         }
       }
     };

  };
