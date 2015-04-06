'use strict';

(function(){

  angular.module('manageBox.core.main')
    .controller('manageBox.core.main.MainCtrl',
    ['$scope', 'manageBox.common.service.socket.SocketService','manageBox.common.service.ThingAPIService',
      MainController]);

  function MainController($scope, socket, thing) {
    $scope.awesomeThings = [];

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
    });
  }
})();
