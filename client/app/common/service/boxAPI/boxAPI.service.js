'use strict';

(function(){
  angular.module('manageBox.common.service.boxAPI', [])
    .factory('manageBox.common.service.BoxAPIService',
    ['$http', boxAPIService]);

  function boxAPIService( $http, sessionStorage ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.config = {};
    this.config.base_url = 'https://api.box.com/2.0';
    this.config.upload_url = 'https://upload.box.com/api/2.0';
    var self = this;

    return {
       token: token
      ,contents: contents
      ,get: download
    };

    // obtain the access token
    function token() {
      console.log('call /api/box/token');
      return $http.get( '/api/box/token');
    }

    //curl https://api.box.com/2.0/folders/FOLDER_ID/items?limit=2&offset=0  -H "Authorization: Bearer ACCESS_TOKEN"
    //ToDo - add limit and offset for pagination
    function contents(folder_id, token) {
      var url = '/api/box/';
      return $http.get(url);
    }

    //curl -L https://api.box.com/2.0/files/FILE_ID/content
    function download(file_id) {
      console.log('call contents');
      var url = '/api/box/' + file_id;
      return $http.get(url);
    }
  }
})();
