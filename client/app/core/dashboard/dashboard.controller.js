'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:manageBox.core.dashboard.DashboardCtrl
 * @description
 * # manageBox.core.dashboard.DashboardCtrl
 * Controller of the sbAdminApp
 */
//angular.module('sbAdminApp')
angular.module('manageBox.core.dashboard')
  .controller('manageBox.core.dashboard.DashboardCtrl',
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
     console.log('main.js manageBox.core.dashboard.DashboardCtrl');
     $scope.awesomeThings = [];
     $scope.boxDocuments = [];
    $scope.donutData=[1,1,1];
     $scope.isLoggedIn = function(){
       return auth.isLoggedIn();
     }

    $scope.donut = {
      labels: ["ToDo Items Added", "Files Uploaded", "Other"],
      colours:[
        "#f0ad4e",
       "#337ab7",
        "#d9534f"
      ]
    };
    $scope.refreshData = function(){
      $scope.donutData = [ $scope.awesomeThings.length,$scope.boxDocuments.length, Math.floor(Math.random() * 6) + 1];
      //return [ $scope.awesomeThings.length,$scope.boxDocuments.length, Math.floor(Math.random() * 6) + 1];
    };

    $scope.itemsData =  $scope.refreshData();

     box.contents().then(function(resp){
       $scope.boxDocuments = resp.data.entries;
       socket.syncUpdates('box', $scope.boxDocuments);
         $scope.refreshData();
     });


     thing.get().then(function(things){
       $scope.awesomeThings = things;
       socket.syncUpdates('thing', $scope.awesomeThings);

       $scope.refreshData();
     });

     //Get the doc url from the server, open new page with the doc url

     $scope.addThing = function(text) {
       thing.add(  text ).then(function(){ });
     };

     $scope.deleteThing = function(theThing) {
       if(theThing) thing.delete( theThing._id ).then(function(){ });
     };

    var unbindAdd = $scope.$on('boxAdded', function(event, item){
      $scope.refreshData();
    });
    var unbindDelete = $scope.$on('boxDeleted', function(event, item){
      $scope.refreshData();
    });

    var unbindTAdd = $scope.$on('thingAdded', function(event, item){
      $scope.refreshData();
    });

    var unbindTDelete = $scope.$on('thingDeleted', function(event, item){
      $scope.refreshData();
    });


     $scope.$on('$destroy', function () {
       console.log('destroy -unsync');
       socket.unsyncUpdates('thing');
       socket.unsyncUpdates('box');
       unbindAdd();
       unbindDelete();
       unbindTAdd();
       unbindTDelete();
     });

  };
