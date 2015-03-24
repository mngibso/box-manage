'use strict';

(function(){
  angular.module('manageBox.core.account')
    .controller('manageBox.core.account.settings.SettingsCtrl',
    ['$scope', 'manageBox.common.service.UserService', 'manageBox.common.service.AuthService', SettingsController]);

  function SettingsController($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then( function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  };
})();
