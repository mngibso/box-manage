'use strict';

(function(){
  angular.module('manageBox.common.navbar', [])
    .controller('manageBox.common.navbar.NavbarCtrl',
    ['$scope', '$location', 'manageBox.common.service.AuthService', 'manageBox.common.service.BoxAPIService'
      , 'manageBox.common.service.SessionStorageService', NavbarCtrl ]);

  function NavbarCtrl($scope, $location, AuthService, BoxService, SessionService) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = AuthService.isLoggedIn;
    $scope.isAdmin = AuthService.isAdmin;
    $scope.getCurrentUser = AuthService.getCurrentUser;

    $scope.logout = function() {
      AuthService.logout();
      $location.path('/login');
    };

    $scope.refreshToken = function() {
      BoxService.token().then( function(response){
        console.log('called BoxService.token');
        SessionService.set( 'box_access_token', response.data.token );
        console.log(response.data);
        console.log(response.status);
        console.log(response.headers);
        console.log(response.config);
        console.log(response.statusText);
      });
    };

    $scope.boxContents = function() {
      if(! SessionService.get('box_access_token') ) console.log('ERRR - no access token');
      BoxService.contents('3405819366', SessionService.get('box_access_token')).then( function(response){
        console.log('called BoxService.contents');
        //SessionService.set( 'box_access_token', data );
        console.log(response.data);
        console.log(response.status);
        console.log(response.headers);
        console.log(response.config);
        console.log(response.statusText);
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }
})();
