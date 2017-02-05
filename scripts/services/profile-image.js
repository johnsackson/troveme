'use strict';

angular.module('clientApp').factory('ProfileImageService', function($rootScope, $http, $q){

    var ProfileImageService  = { 
        getProfileImageUrl: function(tutorId){
            var url;
            var user = $rootScope.loggedUser;
            var deferred = $q.defer();
            var promise = deferred.promise;
            profileImgURL;
            $http({method: 'GET', url: profileImgURL + "" + tutorId
                }).success(function (data) {
                    url = data.ImageData;
                    deferred.resolve(url);
                }).error(function (data, status, headers, config) {
                    deferred.reject(url);
            });              
            return deferred.promise;
        }        
    };
    return ProfileImageService;
});