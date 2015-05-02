'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('manageBox.common.directive.timeline',[])
	.directive('timeline',[ 'manageBox.common.service.BoxAPIService',
    'manageBox.common.service.NotificationService',
    function(box, noty) {
    return {
        templateUrl:'app/common/directive/timeline/timeline.tpl.html',
        restrict: 'E',
        replace: true
      , scope: { items: '='
      , loggedIn: '&'
      }
      , link: timelineLink
    }
    function timelineLink($scope){
      $scope.LoggedIn = function(){
       return $scope.loggedIn;
      }

      $scope.downloadDocument = function(doc){
        console.log('Download  ' + doc.id) ;
        box.get(doc.id).then(function(resp){
          var url = resp.data.url;
          $window.open(url);
        });
      };

      $scope.deleteDocument = function(doc){
        console.log('Delete  ' + doc.id) ;
        box.delete(doc.id).then(function(resp){
        });
      };

      var unbindAdd = $scope.$on('boxAdded', function(event, item){
        noty.alert("'" + item.name +"' added", {timeout: 3000});
      });

      var unbindDelete = $scope.$on('boxDeleted', function(event, item){
        noty.alert("File deleted", {timeout: 3000});
      });

      var unbind = $scope.$watch('files', function () {
        $scope.upload($scope.files);
      });

      $scope.upload = function (files) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            box.upload(file)
              .progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' +
                  evt.config.file.name);
              }).success(function (data, status, headers, config) {
                console.log('file ' + config.file.name + 'uploaded. ');
              });
          }
        }
      };

      $scope.$on('$destroy', function () {
        console.log('destroy timeline.directive');
        unbind();
        unbindAdd();
        unbindDelete();
      });
    }
  }]);
