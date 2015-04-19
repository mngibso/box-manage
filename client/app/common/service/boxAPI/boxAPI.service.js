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
    };

    // obtain the access token
    function token() {
      console.log('call /api/box/token');
      return $http.get( '/api/box/token');
    }

    //curl https://api.box.com/2.0/folders/FOLDER_ID/items?limit=2&offset=0  -H "Authorization: Bearer ACCESS_TOKEN"
    //ToDo - add limit and offset for pagination
    function contents(folder_id, token) {
      console.log('call contents');
      //ToDo - put api base url in config
      //var url = self.config.base_url + '/folders/' + folder_id + '/items';
      var url = 'http://localhost:9000' + '/api/box/folders/' + folder_id + '/items';
      var conf = {headers: {
        'Authorization': 'Bearer ' + token
      } };
      console.log('contents');
      console.log(url) ;
      console.log(conf) ;

      //return $http.get( self.config.base_url + '/folders/' + folder_id + '/items', conf);
      return $http.get(url);
    }


  }
})();
