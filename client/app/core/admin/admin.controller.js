'use strict';

(function(){
angular.module('manageBox.core.admin')
  .controller('manageBox.core.admin.AdminCtrl', [ '$scope', '$http', 'manageBox.common.service.AuthService',
     'manageBox.common.service.UserService', AdminController ]);

    function AdminController($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  }
})();
