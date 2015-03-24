'use strict';

angular.module('manageBox.common.navbar', [])
  .controller('manageBox.common.navbar.NavbarCtrl', ['$scope', '$location', 'manageBox.common.service.AuthService',
    function ($scope, $location, AuthService) {
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

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
