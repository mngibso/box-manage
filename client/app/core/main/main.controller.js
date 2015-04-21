'use strict';

(function(){

  angular.module('manageBox.core.main')
    .controller('manageBox.core.main.MainCtrl',
    ['$scope'
      ,'$upload'
      ,'manageBox.common.service.socket.SocketService'
      ,'manageBox.common.service.ThingAPIService'
      ,'manageBox.common.service.BoxAPIService'
      ,MainController]);

  function MainController($scope, $upload, socket, thing, box) {
    $scope.awesomeThings = [];
    $scope.boxDocuments = [];

    box.contents().then(function(resp){
      $scope.boxDocuments = resp.data.entries;
      socket.syncUpdates('box', $scope.boxDocuments);
    });

    thing.get().then(function(things){
      $scope.awesomeThings = things;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

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
      console.log('destroy');
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('box');
    });

    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          $upload.upload({
            url: '/api/box/',
            fields: {
              'username': '$scope.username'
            },
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' +
              evt.config.file.name);
          }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' +
              JSON.stringify(data));
          });
        }
      }
    };

  }
})();
