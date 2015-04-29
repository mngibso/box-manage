'use strict';

(function(){

angular.module('manageBox.common.directive.httpError', [])
  .directive('httpError', [ '$rootScope', 'manageBox.common.service.NotificationService', httpError ]);
  function httpError( $rootScope, noty ) {
    return {
      restrict: 'EA',
      link: function ($scope, element, attrs) {
        var unbind = $scope.$on('httpError', httpErrorNotify);
        $scope.$on('$destroy', function () {
         unbind();
        });
      }
    };
    function httpErrorNotify( event, status, errorText, message ){
      noty.error('Error: ' + message);
    }
  }

})();
