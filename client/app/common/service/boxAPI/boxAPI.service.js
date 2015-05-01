'use strict';

(function(){
  angular.module('manageBox.common.service.boxAPI', ['angularFileUpload'])
    .factory('manageBox.common.service.BoxAPIService',
    ['$http'
      ,'$upload'
      ,boxAPIService]);

  function boxAPIService( $http, $upload ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var base_url = '/api/box/';
    return {
       token: token
      ,contents: contents
      ,get: download
      ,delete: destroy
      ,upload: upload
    };

    // obtain the access token
    function token() {
      return $http.get( base_url + 'token');
    }

    //ToDo - add limit and offset for pagination
    function contents() {
      return $http.get(base_url);
    }

    function destroy(file_id) {
      var url = base_url + file_id;
      return $http.delete(url);
    }

    function download(file_id) {
      var url = base_url + file_id;
      return $http.get(url);
    }

    function upload(file) {
      var url = base_url;
      return $upload.upload({
        url: base_url,
        fields: {
          'name': file.name || 'unknown'
        },
        file: file
      });
    }
  }
})();
