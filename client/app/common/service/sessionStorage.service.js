'use strict';

(function(){

  angular.module('manageBox.common.service.sessionStorage', [])
    .factory('manageBox.common.service.SessionStorageService', ['$window', sessionStorageService]);

  function sessionStorageService( $window ) {
    return {
      set: setSession
      ,get: getSession
    };
  function setSession( key, value ){
    console.log('sessionStorage set ' + key + ': ' + value);
    try{
      if( $window.Storage ){
        $window.sessionStorage.setItem(key, value);
        return true;
      } else {
        return false;
      }
    } catch( error ){
      console.error( error, error.message );
    }
  }
  function getSession( key ){
    console.log('sessionStorage get ' + key);
    try{
      if( $window.Storage ){
        return $window.sessionStorage.getItem( key );
      } else {
        return false;
      }
    } catch( error ){
      console.error( error, error.message );
    }
  }
  }
})();
