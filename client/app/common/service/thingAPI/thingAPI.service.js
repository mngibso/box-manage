'use strict';

(function(){
  angular.module('manageBox.common.service.thingAPI', [])
    .factory('manageBox.common.service.thingAPIService', ['$http', thingAPIService]);

  function thingAPIService( $http ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
       add: addThing
      ,get: getThings
      ,delete: deleteThing
    };

    function addThing( name ) {
      return $http.post( '/api/things', { name: name } );
    }

    function deleteThing( id ) {
      return $http.delete('/api/things/' + id);
    }

    function getThings() {
      return $http.get('/api/things')
        .then(
        function (response) {
          console.log(response.data);
          return response.data;
        });
    }

  }
})();
