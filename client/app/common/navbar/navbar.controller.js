'use strict';

(function(){
  angular.module('manageBox.common.navbar', [])
    .controller('manageBox.common.navbar.NavbarCtrl',
    ['$scope', '$location', 'manageBox.common.service.AuthService', 'manageBox.common.service.BoxAPIService', NavbarCtrl ]);

  function NavbarCtrl($scope, $location, AuthService, BoxService) {
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
