'use strict';

(function(){

  angular.module('manageBox.core.main')
    .controller('manageBox.core.main.MainCtrl',
    ['$scope'
      ,'$window'
      ,'manageBox.common.service.socket.SocketService'
      ,'manageBox.common.service.ThingAPIService'
      ,'manageBox.common.service.BoxAPIService'
      ,'manageBox.common.service.AuthService'
      ,'manageBox.common.service.NotificationService'
      ,MainController]);

  function MainController($scope, $window, socket, thing, box, auth, noty) {
    $scope.awesomeThings = [];
    $scope.boxDocuments = [];
    $scope.isLoggedIn = auth.isLoggedIn;

    var unbindeAdd = $scope.$on('boxAdded', function(event, item){
      noty.alert("'" + item.name +"' added", {timeout: 3000});
    });
    var unbindeDelete = $scope.$on('boxDeleted', function(event, item){
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
    $scope.downloadDocument = function(doc){
     console.log('Download  ' + doc.id) ;
      box.get(doc.id).then(function(resp){
        console.log(resp.data)
        var url = resp.data.url;
        $window.open(url);
      });
    };

    $scope.deleteDocument = function(doc){
      console.log('Delete  ' + doc.id) ;
      box.delete(doc.id).then(function(resp){
        console.log(resp);
      });
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      thing.add( $scope.newThing).then(function(){ console.log('add thing');});
      $scope.newThing = '';
    };

    $scope.deleteThing = function(theThing) {
      thing.delete( theThing._id ).then(function(){ console.log('delete thing');});
    };

    $scope.$on('$destroy', function () {
      console.log('destroy -unsync');
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('box');
      unbind();
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

  }
})();
