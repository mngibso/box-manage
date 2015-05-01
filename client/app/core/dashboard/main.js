'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
//angular.module('sbAdminApp')
angular.module('manageBox.core.dashboard')
  .controller('MainCtrl',
   function($scope,$position) {
     console.log('main.js MainCtrl');
    $scope.duh=function(){alert('duh');}
  });
