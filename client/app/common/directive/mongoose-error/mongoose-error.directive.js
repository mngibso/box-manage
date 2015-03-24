'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('manageBox.common.directive.mongoose-error', [])
  .directive('mongooseError', [ function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  }]);
