'use strict';

/* <box-file doc="<file object>"></box-file>
  Displays a file existing on the Box.com service.  Allow download and delete.
 */
(function(){
  angular.module('manageBox.common.directive.boxFile', [])
    .directive('boxFile',
    [  '$window'
      ,'manageBox.common.service.BoxAPIService'
      , boxFile ]);

  function boxFile( $window, box ) {
    return {
      restrict: 'EA'
      , scope: { doc: '='}
      , templateUrl: 'app/common/directive/box-file/box-file.tpl.html'
      , controller: boxFileController
      , controllerAs: 'boxFileCtrl'
      , link: boxFileLink
    };
    function boxFileLink($scope, element, attrs) {
      console.log('boxFileLink');
    }
    function boxFileController( $scope ){
      console.log('boxFileController');
      this.doc = $scope.doc;

      this.downloadDocument = function(doc){
        console.log('Download  ' + doc.id) ;
        box.get(doc.id).then(function(resp){
          var url = resp.data.url;
          $window.open(url);
        });
      };

      this.deleteDocument = function(doc){
        console.log('Delete  ' + doc.id) ;
        box.delete(doc.id).then(function(resp){
        });
      };
    }
  }

})();
