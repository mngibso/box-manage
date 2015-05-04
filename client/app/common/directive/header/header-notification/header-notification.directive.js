'use strict';

/**
 * @ngdoc directive
 * @name headerNotification
 * @description
 * # headerNotification
 */
(function() {
angular.module('manageBox.common.directive.header')
    .directive('headerNotification', ['manageBox.common.service.AuthService', function (Auth) {
		return {
        templateUrl:'app/common/directive/header/header-notification/header-notification.tpl.html'
        ,restrict: 'E'
        ,replace: true
      ,link: headerNotificationLink
    };
    function headerNotificationLink($scope) {
      $scope.loggedIn = function () {
        return Auth.isLoggedIn();
      };
      $scope.logOut = function () {
        Auth.logout();
      };
    }
  }]);

})();


