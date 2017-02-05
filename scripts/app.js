'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
   .module('clientApp', [
        'ngAnimate'        
      , 'ngCookies'        
      , 'ngResource'        
      , 'ngRoute'        
      , 'ngSanitize'        
      , 'ngTouch'
      , 'ngStorage'
      , 'angularModalService'
   ])
   .run(function ($rootScope, $cookies, $location, $timeout, $window, $routeParams) {
      $rootScope.$on("$routeChangeStart", function (event, current, next) {         
         $rootScope.viewChange = false;
         if(next) {
            if((current.controller == "MainCtrl") && (next.controller == "ListController")) {
               $rootScope.tutorSearchObjectValue = true;
            } else {
               $rootScope.tutorSearchObjectValue = false;
            }
         } else {
            
         }
      });
   
      $rootScope.$on("$routeChangeSuccess", function (event, current) {         
         if(current.controller === "ListController") {
            $rootScope.viewChange = true;
         } else if(current.controller === "") {
            
         }        
      });
   })
   .config(function ($routeProvider, $locationProvider) {
      $routeProvider
         .when('/', {
            templateUrl: 'views/main.html'
            , controller: 'MainCtrl'
            , controllerAs: 'main'
         })
         .when('/list', {
            templateUrl: 'views/list-view.html'
            , controller: 'ListController'
            , controllerAs: 'list'
         })
         .otherwise({
            redirectTo: '/'
         });
         $locationProvider.html5Mode(true);
   })
   .controller('ModalController', function ($scope, close) {
      // when you need to close the modal, call close
      //close("Success!");
      alert($scope.clickedData);
   });