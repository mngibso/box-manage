'use strict';

(function(){
  angular.module('manageBox.common.service.boxAPI', [])
    .factory('manageBox.common.service.BoxAPIService', ['$http', boxAPIService]);

  function boxAPIService( $http ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.config = {};
    this.config.base_url = 'https://api.box.com/2.0';
    this.config.upload_url = 'https://upload.box.com/api/2.0';

    return {
       token: token
    };

    // obtain the access token
    function token() {
      console.log('call /api/box/token');
      return $http.get( '/api/box/token');
    }


  }
})();
