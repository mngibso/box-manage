'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
(function() {
  angular.module('manageBox.common.directive.timeline', [])
    .directive('timeline', ['$window', 'manageBox.common.service.BoxAPIService',
      'manageBox.common.service.NotificationService',
      function ($window, box, noty) {
        return {
          templateUrl: 'app/common/directive/timeline/timeline.tpl.html',
          restrict: 'E',
          replace: true
          , scope: {
            items: '='
            , loggedIn: '&'
          }
          , link: timelineLink
        };
        function timelineLink($scope) {
          $scope.then = moment().subtract(2, 'hours');

          $scope.LoggedIn = function () {
            return $scope.loggedIn();
          }

          $scope.downloadDocument = function (doc) {
            console.log('Download  ' + doc.id);
            box.get(doc.id).then(function (resp) {
              var url = resp.data.url;
              var page = $window.open(url);
              popupBlockerChecker.check(page);

            });
          };

          $scope.deleteDocument = function (doc) {
            console.log('Delete  ' + doc.id);
            box.delete(doc.id).then(function (resp) {
            });
          };

          var unbindAdd = $scope.$on('boxAdded', function (event, item) {
            noty.alert("'" + item.name + "' added", {timeout: 3000});
          });

          var unbindDelete = $scope.$on('boxDeleted', function (event, item) {
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

  var popupBlockerChecker = {
    check: function(popup_window){
      var _scope = this;
      if (popup_window) {
        if(/chrome/.test(navigator.userAgent.toLowerCase())){
          setTimeout(function () {
            _scope._is_popup_blocked(_scope, popup_window);
          },200);
        }else{
          popup_window.onload = function () {
            _scope._is_popup_blocked(_scope, popup_window);
          };
        }
      }else{
        _scope._displayError();
      }
    },
    _is_popup_blocked: function(scope, popup_window){
      if ((popup_window.innerHeight > 0)==false){ scope._displayError(); }
    },
    _displayError: function(){
      alert("Popup Blocker is enabled! Please add this site to your exception list.");
    }
  };
})();
