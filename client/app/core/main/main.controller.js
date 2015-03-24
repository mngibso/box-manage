'use strict';

(function(){

  angular.module('manageBox.core.main')
    .controller('manageBox.core.main.MainCtrl', ['$scope', '$http', 'manageBox.common.service.socket.SocketService', function ($scope, $http, socket) {


      $scope.awesomeThings = [];

      $http.get('/api/things').success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        socket.syncUpdates('thing', $scope.awesomeThings);
      });

      $scope.addThing = function() {
        if($scope.newThing === '') {
          return;
        }
        $http.post('/api/things', { name: $scope.newThing });
        $scope.newThing = '';
      };

      $scope.deleteThing = function(thing) {
        $http.delete('/api/things/' + thing._id);
      };

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('thing');
      });
    }]);
})();
