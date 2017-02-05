'use strict';

angular.module('clientApp')
  .controller('ListController', function ($window, $rootScope, $scope, $cookies, $location, $http, $timeout, $compile, ModalService) {
   
   $rootScope.filteredData;
   /*for (var i = 0; i < $rootScope.filteredData.Subjects.split(',').length; i++) {
      $rootScope.filteredData += $rootScope.filteredData.Subjects.split(',')[i];
   }
   debugger;*/
   
   $scope.Subjects = ['Chemistry','Maths','Physics'];
   $scope.listViewShowProfile = function(data) {
      ModalService.showModal({
         templateUrl: "views/modal/profile.html"
         , controller: "ModalController"
         , inputs: {
            title: "Show Profile"
            , data: data
         }
      }).then(function (modal) {
         modal.element.modal();
         modal.close.then(function (result) {
            //$scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
         });
      });
   };

});