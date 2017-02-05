'use strict';

angular.module('clientApp')
   .controller('HeaderController', function ($window, $rootScope, $scope, $location, $http, $timeout, $compile, ModalService) {
      
      $scope.showSearch = function () {
         if (!$('.location-search').hasClass('show')) {
            
            $('.location-search').addClass('show');
            $('.location-search').addClass('show-on__mobile');
            $('.view-options li').removeClass('active');
            $('.searchView').addClass('active');
            $('#listView').hide().removeClass('show-on__mobile');
            //$('#map').hide().removeClass('show-on__mobile');
            //document.getElementById("inputAutoComplete").focus();
         } else {
            //$('.location-search').removeClass('show');
         }
      };

      $scope.showMap = function () {
         $('.view-options li').removeClass('active');
         $('.location-search').removeClass('show');
         $('.location-search').removeClass('show-on__mobile');
         $('.mapView').addClass('active');
         $('#listView').hide().removeClass('show-on__mobile');
         $('#map').show().addClass('show-on__mobile');
      };
      $scope.showList = function () {
         $('.view-options li').removeClass('active');
         $('.location-search').removeClass('show');
         $('.location-search').removeClass('show-on__mobile');
         $('.listView').addClass('active');
         $('#map').hide().removeClass('show-on__mobile');
         $('#listView').show().addClass('show-on__mobile');
      };
   });