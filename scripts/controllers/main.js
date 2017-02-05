'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp').controller('MainCtrl', function ($window, $rootScope, $scope, $cookies, $location, $http, $timeout, $compile, ModalService, ProfileImageService) { // check 

    //If url has a referer (From email)
    var hasReferer = $location.search();
    //window.localStorage.clear();
    if (Object.keys(hasReferer).length > 0) {
      var phoneNumber = hasReferer.phone, 
      pattern = /(\+91[\-\s]?)/i;
      if(phoneNumber != undefined){
       phoneNumber = phoneNumber.replace(pattern, "");
     }
     if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify({
        parentName: hasReferer.name
        , parentEmail: hasReferer.email
        , phone: hasReferer.phone
      }));
    }
  }

    $scope.initialised = false; //unknown
    $scope.dragging = false; //value will be false till user drags a map
    $scope.infoWindow;
    $scope.downloading = false;
    $rootScope.searchValue = false;
    $scope.allSubjects = ["Biology", "Chemistry", "Maths", "Physics"];
    $scope.allBoards = ["CBSE", "ICSE", "KAStateBoard"];
    $scope.filterCRMStat = "Any";
    $scope.markers = [];
    $rootScope.count = 0;
    $rootScope.tutorCallBackObj = [];
    $scope.isMobileDevice = false;
    
    var isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      }
      , BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      }
      , iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      }
      , Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      }
      , Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      }
      , any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };
    if (isMobile.any()) {
      $scope.isMobileDevice = true;
    }
    /* Prepares gross standards array */
    //$scope.grossStandards = ["Any"];
    $scope.grossStandards = [];
    for (var i = 0; i < classes.split(',').length; i++) {
      if (classes.split(',')[i] != null && classes.split(',')[i] != undefined) {
        $scope.grossStandards.push(classes.split(",")[i]);
      }
    }

    /* Prepares gross boards array */
      //$scope.grossBoards = ["Any"];
      $scope.grossBoards = [];
      for (var i = 0; i < boards.split(',').length; i++) {
       if (boards.split(',')[i] != null && boards.split(',')[i] != undefined) {
        $scope.grossBoards.push(boards.split(',')[i]);
      }
    }

    /* Prepares gross subjects array */
    $scope.grossSubjects = ["Any Subject"];
    for (i = 0; i < subjects.split(',').length; i++) {
     if (subjects.split(',')[i] != null && subjects.split(',')[i] != undefined) {
      $scope.grossSubjects.push(subjects.split(",")[i]);
    }
  }

      //$scope.configurations = configService.initialFecthURL;



      $scope.markersArray = [];
      $scope.clearMarkers = function () {
       if ($scope.markersArray.length) {
        for (i in $scope.markersArray) {
         $scope.markersArray[i].setMap(null);
       }
       $scope.markersArray.length = 0;
     }
   };

   $scope.locateMe = function (location) {
     $scope.clearMarkers();
         //        var marker = new google.maps.Marker({
         //            map: $scope.map,
         //            position: location
         //        });
         //$scope.markersArray.push(marker);
         if ($scope.map) {
          $scope.map.setCenter(location);
          $scope.map.setZoom(14);
        }
      };

      $scope.closeInfoWindow  = function () {
       if ($scope.infoWindow) {
        $scope.infoWindow.close();
        $scope.infoWindow.setMap(null);
        $scope.infoWindow = null;
      }
    };

    $scope.showProfile = function (tutorId) {   
     var tutorId = tutorId;
     
     angular.forEach($rootScope.filteredData, function (value, key) {
      if (value.TutorId == tutorId) {
       $scope.clickedData = value;
     }
   });

     ModalService.showModal({
      templateUrl: "views/modal/profile.html"
      , controller: "ModalController"
      , inputs: {
       title: "Show Profile"
       , data: $scope.clickedData
     }
   }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (result, callBackObj) {
     if(result.callBackObj) {
      $scope.addTutorCallBack(result.tutorId);
    }
               //alert();
               //$scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
             });
  });
 };

 $scope.addTutorCallBack = function (tutorId) {
  $rootScope.count++;
  $('.input_' + tutorId + '_button').text("Tutor Added");
  if ($scope.infoWindow) {
    $scope.infoWindow.close();
    $scope.infoWindow.setMap(null);
    $scope.infoWindow = null;
    $('.mapView .count').addClass('show-me');
  }
  if ($rootScope.tutorCallBackObj.length) {
    $('#tutorAdded').tooltip('show');            
    var htmlcontent = $('.info-tooltip');
            //htmlcontent.load('/Pages/Common/contact.html')
            $compile(htmlcontent.contents())($scope);
            var presentInArray = false;
            //checks whether the object exists
            angular.forEach($rootScope.tutorCallBackObj, function (value, key) {
              if ($rootScope.tutorCallBackObj[key]["TutorId"] === $scope.clickedData.TutorId) {
                presentInArray = true;
              }
            });
            if (!presentInArray) {
              $rootScope.tutorCallBackObj.push($scope.clickedData);
            }
          }
          else {
            $rootScope.tutorCallBackObj.push($scope.clickedData);
            $('#canvas-callback').addClass('show-then');
            $('.btn-animate').addClass('btn-activated');
          }
        };
        $scope.closeTooltip = function() {
         $('#tutorAdded').tooltip('hide');
       };
       $scope.removeTutorCallBack = function (TutorId, e) {
        var elem = $(e.target).parent().parent();
        elem.addClass('remove');
        if ($scope.infoWindow) {
          $scope.infoWindow.close();
          $scope.infoWindow.setMap(null);
          $scope.infoWindow = null;
        }
        $rootScope.count--;
        var currentTutorId = TutorId;
        angular.forEach($rootScope.tutorCallBackObj, function (value, key) {
          if (value.TutorId == currentTutorId) {                
            $timeout(function() {
              $rootScope.tutorCallBackObj.splice(key, 1);
            }, 100);
          }
        });
        if (!$rootScope.tutorCallBackObj.length || $rootScope.tutorCallBackObj.length <= 1) {
          $('.btn-animate').removeClass('btn-activated');
          $('.mapView .count').removeClass('show-me');
        }
      };
      $scope.placeChanged = function (autoComplete) {
        var place = autoComplete.getPlace();
        $scope.currentPlace = place.formatted_address;
        if (!place.geometry) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
           'address': place.name
         }, function (results, status) {
           if (status === google.maps.GeocoderStatus.OK) {
                  //$('.location-search').addClass('fadeOut').hide();
                  $scope.locateMe(results[0].geometry.location);
                } else {
                  alert('Geocode was not successful for the following reason: ' + status);
                }
              });
          return;
        } else {
            //$('.location-search').addClass('fadeOut').hide();
          }

         //$scope.updateFilterKeys();
         if (place.geometry.viewport) {
            //$scope.map.fitBounds(place.geometry.viewport);
            $scope.locateMe(place.geometry.location);
          } else {
            $scope.locateMe(place.geometry.location);
          }
          $scope.lat = place.geometry.location.lat();
          $scope.lng = place.geometry.location.lng();
        };
    /*$scope.showSearch = function() {
       if(!$('location-search').hasClass('show')) {
          $('location-search').addClass('show');
       } else {
          $('location-search').removeClass('show');
       }
     };*/

    //waits till the view gets completely loaded
    $rootScope.$on('$viewContentLoaded', function () {

        //$('#myModal1').modal('show');
        $scope.lng = 77.59456269999998;
        $scope.lat = 12.9715987;
        var bengaluru = {
          lat: $scope.lat
          , lng: $scope.lng
        };
        
        var mapStyles = [{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#999999"}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#f2f2f2"}]},{featureType:"landscape.natural",elementType:"all",stylers:[{visibility:"on"},{color:"#e6e6e6"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#fafafa"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{color:"#fafafa"},{visibility:"on"}]},{featureType:"road",elementType:"all",stylers:[{saturation:-100},{lightness:45}]},{featureType:"road",elementType:"geometry.fill",stylers:[{visibility:"on"},{hue:"#a1cdfc"}]},{featureType:"road.highway",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.highway",elementType:"labels.text",stylers:[{visibility:"simplified"}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{hue:"#ff0000"},{saturation:"1"}]},{featureType:"road.arterial",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit.station",elementType:"all",stylers:[{visibility:"simplified"},{hue:"#ff0000"},{saturation:"-100"}]},{featureType:"transit.station.airport",elementType:"all",stylers:[{visibility:"on"}]},{featureType:"transit.station.bus",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"transit.station.rail",elementType:"all",stylers:[{visibility:"simplified"},{hue:"#ff7e00"},{saturation:"-100"},{lightness:"19"}]},{featureType:"water",elementType:"all",stylers:[{color:"#a1cdfc"},{visibility:"on"}]}];

        var styledMap = new google.maps.StyledMapType(mapStyles,
         {name: "Styled Map"});
        
        
        var mapOptions = {
         zoom: 11,
         center: new google.maps.LatLng(55.6468, 37.581),
         mapTypeControlOptions: {
           mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
         }
       };
        //by dea
        /*var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: bengaluru
        });*/
        if ($rootScope.viewChange == false) {
          $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12
            , center: bengaluru
            , mapTypeId: google.maps.MapTypeId.ROADMAP
            , mapTypeControl: false
            , streetViewControl: false
            , minZoom: 4
            , mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
          });
          $scope.map.mapTypes.set('map_style', styledMap);
          $scope.map.setMapTypeId('map_style');

          $scope.dragendEvent = $scope.map.addListener('dragstart', function () {
               $scope.dragging = true; //dragging is set to true when user tries to drag
               if ($scope.infoWindow) {}
             });
          $scope.dragendEvent = $scope.map.addListener('dragend', function () {
               $scope.dragging = false; //dragging is set to false when user stops dragging 
             });

          $scope.dragendEvent = $scope.map.addListener('idle', function () {                
            if (!$scope.dragging && (!$scope.infoWindow || $scope.infoWindow == null || $scope.infoWindow == undefined) && !$rootScope.viewChange) {
              var bounds = $scope.map.getBounds();
              var ne = bounds.getNorthEast();
              var sw = bounds.getSouthWest();
                    //$scope.updateBounds(ne, sw);
                  }
                });

          $scope.map.addListener('zoom_changed', function () {
           if ($scope.infoWindow) {
            $scope.infoWindow.close();
            $scope.infoWindow.setMap(null);
            $scope.infoWindow = null;
          } else if($scope.infoWindow == null) {
            $('.show-iw').hide();
          }
        });
        }       
        $timeout(function() {
         $('.locate-btn').tooltip('show');
       }, 1000);
      });
    //empty tutor search object
    $rootScope.tutorSearchObj = {
      chosenPlace: ""
      , board: ""
      , subject: $scope.grossSubjects[0]
      , standard: ""
    };
    
    //find tutor/center search function
    $scope.findTutorCenterSearch = function (isValid, hello) {
      if (!isValid) {
        return;
      }

      $('.preloader-wrap').addClass('show-loader');
      $timeout(function() {
        $rootScope.searchValue = true;
        $rootScope.tutorSearchObj;
        $scope.placeChanged($scope.gPlace);
      }, 2000);
      dataLayer.push({
        'location': 'location'
        , 'board': 'board'
        , 'standard': 'standard'
        , 'subject': 'subject'
        , 'event': 'newSearch'
      });
    };
    
    $scope.findProfileImage = function (tutorId, gender) {
        //ProfileImageService.getProfileImageUrl(tutorId, gender);
        /*$http({
>>>>>>> Stashed changes
            method: 'GET'
            , url: profileImgURL + "" + tutorId
         }).success(function (data) {
            var elem = document.getElementById('imgM-' + data.TutorId);
            if (elem) {
               if (data.ImageData) {
                  elem.src = data.ImageData;
                  $scope.tutorImage = data.ImageData;
                  $scope.clickedData['imgSrc'] = data.ImageData;
               } else if(data.ImageData == null) {
                  if(gender == "Male") {
                     $scope.tutorImage = "images/avatar-male.png";
                  } else if(gender == "Female") {
                     $scope.tutorImage = "images/avatar-female.png";
                  } else {
                     $scope.tutorImage = "images/avatar-neutral.png";
                  }
                  elem.removeAttribute('src');
                  $scope.clickedData['imgSrc'] = "";
               }
            } 

            $scope.downloading = false;

         }).error(function (data, status, headers, config) {
            $scope.downloading = false;
            $scope.tutorImage = "images/avatar-neutral.png";
<<<<<<< Updated upstream
            //$scope.clickedData['imgSrc'] = $('#foo img').attr('src');
         });
      };


      $scope.createMarker = function (info, i) {
         var icon;

         if(info.Type !== "Center") {
=======
            $scope.clickedData['imgSrc'] = $('#foo img').attr('src');
          });*/
        };
        $scope.goo = function (tutorId) {
          var tutorId = tutorId;
          $scope.isAddedTutorCallback = false;
          if ($rootScope.tutorCallBackObj.length) {
            //checks whether the object exists
            angular.forEach($rootScope.tutorCallBackObj, function (value, key) {
              if ($rootScope.tutorCallBackObj[key]["TutorId"] === tutorId) {
                $scope.isAddedTutorCallback = true;
              }
            });
          }
        };
        $scope.checkCallbackObject = function () {
          if($rootScope.searchByName){
            $('.add_button').attr("disabled", true);
          }else{
            if ($scope.isAddedTutorCallback) {
              $('.add_button').text("Tutor Added").attr("disabled", true).removeClass('btn-tertiary').addClass('btn-default disabled');
            }
            else {
              $('.add_button').text("Add to tutor call back").removeAttr("disabled").addClass('btn-tertiary').removeClass('btn-default disabled');
            }
          }

        };
        $scope.createMarker = function (info, i) {
          var icon;
          if (info.Type !== "Center") {
            if (info.CRMStatus === "Activated") {
             icon = 'images/vn-tutor-pin-active.png';
           } else {
             icon = 'images/vn-tutor-pin-inprocess.png';
           }
         } else {
          icon = 'images/vn-center-pin.png';
        }

        var largest = Math.max.apply(Math, info.CourseOfferings);

        var marker = new google.maps.Marker({
          id: info.CRMID
          , map: $scope.map
          , position: new google.maps.LatLng(info.Latitude, info.Longitude)
          , icon: icon
          , optimized: false
          , TutorId: info.TutorId
          , Gender: info.Gender
          , CRMStatus: info.CRMStatus
          , Type: info.Type
        });
        info.Distance = Math.round(info.Distance / 100) / 10;

        $scope.activeSubjectsArray = [];
        if (info.Subjects != null) {
          for (i = 0; i < info.Subjects.split(',').length; i++) {
           if (info.Subjects.split(',')[i] != null && info.Subjects.split(',')[i] != undefined) {
            $scope.activeSubjectsArray.push(info.Subjects.split(",")[i]);
          }
        }
      }

      if(info.Type === "Center") {
        marker.content = '<div id="foo" class="map-info centre">';
        var gradeArray = info.Grades.split(/(\s+)/);
      } else {
        marker.content = '<div id="foo" class="map-info">';
      }
      /*<div class="loader loader--style3" title="2"><svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.3s" repeatCount="indefinite" /></path></svg></div>*/
      marker.content += '<div class="preloader-wrap"><span class="preloader"><i class="icon icon-loader"></i></span></div><div class="map-marker-content"><div class="media"><div class="media-left">';
      marker.content += '<img id="imgM-' + info.TutorId + '" alt="Profile Image" imageonload src="{{tutorImage}}" data-id="'+ info.TutorId +'" /></div> <!-- /media left -->';
      marker.content += '<div class="media-body"><a href="javascript:void(0)" class="infowindow-closebtn" ng-click="closeInfoWindow()"><i class="icon icon-close"></i></a><h3 class="media-heading">' + info.FullName + '</h3>';
      marker.content += '<p><i class="icon icon-pin"></i>' + info.Distance + 'km (Approximately)</p><p>' + (info.Gender != null ? info.Gender : 'N/A') + '</p>';
      marker.content += '<ul class="list-inline tags hidden-xs">';
      if (info.Subjects != null && info.Subjects != undefined && info.Subjects != "") {
        for (i = 0; i < info.Subjects.split(',').length; i++) {
         marker.content += '<li><span>' + info.Subjects.split(',')[i] + '</span></li>';
       }
     } else {
      marker.content += '<li>N/A</li>';
    }
    marker.content += '</ul>';
    marker.content += '</div><!-- /media body -->';
    marker.content += '</div><!-- /media -->';
    marker.content += '<div class="container-fluid"><div class="row">';
    marker.content += '<ul class="list-inline tags visible-xs">';
    if (info.Subjects != null && info.Subjects != undefined && info.Subjects != "") {
      for (i = 0; i < info.Subjects.split(',').length; i++) {
       marker.content += '<li><span>' + info.Subjects.split(',')[i] + '</span></li>';
     }
   } else {
    marker.content += '<li>N/A</li>';
  }
  marker.content += '</ul></div>';
  marker.content += '<div class="row values block"><div class="col-md-7 col-sm-7 col-xs-8"><div class="row custom-row__6 custom-row__4_xs"><div class="col-md-6 col-sm-6 col-xs-6">';
  if(info.Type === "Center") {
    marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-class-teach"></i></div><div style="display:inline-block"><h1>' + (gradeArray[0] != "0" ? gradeArray[0] : 'N/A') + '</h1></div></div><h5>Classes taught</h5>';
  } else {
    marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-t-exp"></i></div><div style="display:inline-block"><h1>' + (info.YearsOfTeachingExperience != "0" ? info.YearsOfTeachingExperience : 'N/A') + '</h1></div></div><h5>Tuition exp(Yrs)</h5>';
  }

  marker.content += '</div>';
  marker.content += '<div class="col-md-6 col-sm-6 col-xs-6">';
  marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-class-size"></i></div><div style="display:inline-block"><h1>' + (info.NumberOfCurrentStudents != "0" ? info.NumberOfCurrentStudents : 'N/A') + '</h1></div></div><h5>Class size</h5>';
  marker.content += '</div></div></div>';
  marker.content += '<div class="col-md-5 col-sm-5 col-xs-4">';
  /*marker.content += '<h5>Rates starts from</h5><div class="value-wrap"><div class="pull-left"><i class="icon icon-rate"></i></div><div class="pull-left"><h1>' + ((info.RateStartsFrom !== 0 && info.RateStartsFrom !== -999) ? info.RateStartsFrom: 'N/A') + '</h1></div></div>';*/
         if(info.Type === "Center") { //if centre display Student-Teacher Ratio else display Rate starts from
          marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-t-ratio"></i></div><div style="display:inline-block"><h1>' + (info.NumberOfTeachers != "0" ? info.NumberOfTeachers : 'N/A') + '</h1></div></div><h5>Teachers</h5></div></div>';
        } else {
          marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-rate"></i></div><div style="display:inline-block"><h1>' + ((info.RateStartsFrom !== 0 && info.RateStartsFrom !== -999) ? info.RateStartsFrom: 'N/A') + '</h1></div></div><h5>Rates <span class="hidden-xs">starts</span> from</h5></div></div>';
        } 
        marker.content += '</div>';

        if(info.Type === "Center") {
          var ifHttp = info.CenterUrl.match("https://");
          if (ifHttp === null) {
            info.CenterUrl = "https://" + info.CenterUrl;
          }
          marker.content += '<a target="_blank" href="' + info.CenterUrl + '" class="btn btn-tertiary btn-lg centre-url first">View Profile</a><a class="btn btn-tertiary btn-lg centre-url" ng-click="addTutorCallBack(' + info.TutorId + ')">Request callback</a>';
        }
        else {
          marker.content += '<button type="button" class="btn btn-tertiary btn-lg centre-url first" ng-click="showProfile(' + info.TutorId + ')" >View Profile</button>';
          if (!$rootScope.searchByName) {
            marker.content+='<a class="btn btn-tertiary btn-lg centre-url add_button input_' + info.TutorId + '_button"  ng-click="addTutorCallBack(' + info.TutorId + ')">Request callback</a>'
          }
        }
        marker.content += '</div></div></div>';
        
       /* ProfileImageService.getProfileImageUrl(info.TutorId, info.Gender).then(function(data){
            var elem = document.getElementById('imgM-' + info.TutorId);
            if (elem) {
                if (data) {
                    elem.src = data;
                    $scope.clickedData['imgSrc'] = data.ImageData;
                } else {
                    //$scope.clickedData['imgSrc'] = "";
                }
            }
          });*/
        //map click function
        google.maps.event.addListener(marker, 'click', function () {
          $scope.tutorImage = "";
          if($('#canvas-callback').hasClass('show-then')) {
           $('#canvas-callback').removeClass('show-then');
         }

         $scope.goo(info.TutorId);
         if ($scope.infoWindow) {
           $scope.infoWindow.close();
           $scope.infoWindow.setMap(null);
           $scope.infoWindow = null;
         }

         angular.forEach($rootScope.filteredData, function (value, key) {
           if (value.TutorId == marker.TutorId) {
            $scope.clickedData = value;
          }
        });

            /*var rateCardUrl = apiTutorDirURL + '/RateInfo?username=' +  $scope.clickedData.Email;            
            $http({
                  method: 'GET'
                  , url: rateCardUrl
               }).success(function (data) {
                  console.log('success');

               }).error(function (data, status, headers, config) {
                  console.log('failure')
                });*/



                $scope.activeSubjects = [];
                if ($scope.clickedData.Subjects != null) {
                 for (i = 0; i < $scope.clickedData.Subjects.split(',').length; i++) {
                  if (subjects.split(',')[i] != null && subjects.split(',')[i] != undefined) {
                   $scope.activeSubjects.push(subjects.split(",")[i]);
                 }
               }
             }
             $scope.allSubjects = ["Biology", "Chemistry", "Maths"];

            //$scope.findProfileImage(info.TutorId, info.Gender);
            /*if (!$scope.downloading) {

               $scope.downloading = true;

               $http({
                  method: 'GET'
                  , url: profileImgURL + "" + info.TutorId
               }).success(function (data) {
                  var elem = document.getElementById('imgM-' + data.TutorId);
                  if (elem) {
                     if (data.ImageData) {
                        elem.src = data.ImageData;
                        $scope.clickedData['imgSrc'] = data.ImageData;
                     } else if(data.ImageData == null) {
                        $scope.clickedData['imgSrc'] = "";
                     }
                  }

                  $scope.downloading = false;

               }).error(function (data, status, headers, config) {
                  $scope.downloading = false;
                  //$scope.clickedData['imgSrc'] = $('#foo img').attr('src');
               });
             }*/

             $scope.contactTutor = info.CRMID;

             $scope.infoWindow = new google.maps.InfoWindow({
               maxWidth: 1050
             });

             if(info.Type !== 'Center') {
              ProfileImageService.getProfileImageUrl(info.TutorId).then(function(data){
                var elem = document.getElementById('imgM-' + info.TutorId);
                if (data) {
                  if (elem) {
                    elem.src = data;
                    $scope.tutorImage = data;
                    $scope.clickedData['imgSrc'] = data;           
                  } else {
                   $scope.clickedData['imgSrc'] = "";
                 }
               } else if (data == null) {
                if (info.Gender == "Male") {
                  $scope.tutorImage = "images/avatar-male.png";
                }
                else if (info.Gender == "Female") {
                  $scope.tutorImage = "images/avatar-female.png";
                }
                else {
                  $scope.tutorImage = "images/avatar-neutral.png";
                }
                        //  elem.removeAttr('src');
                        $scope.clickedData['imgSrc'] = "";
                      }
                      $timeout(function() {
                        $('.map-marker-content').addClass('fade-in');
                        $('.map-info').addClass('loaded');
                      }, 200);                
                    }, function(error) {
                      console.log('There seems to be a problem in getting the profile image');
                      $timeout(function() {
                        $('.map-marker-content').addClass('fade-in');
                        $('.map-info').addClass('loaded');
                      }, 500);
                    //alert(error);
                  });
            } else {
              $scope.tutorImage = "images/center-avatar.jpg";
              $timeout(function() {
                $('.map-marker-content').addClass('fade-in');
                $('.map-info').addClass('loaded');
              }, 500);
            }
            
            var compiled = $compile(marker.content)($scope); //to attach ng-click for the info window button
            $scope.infoWindow = new google.maps.InfoWindow({
             map: $scope.map
             , position: new google.maps.LatLng(info.Latitude, info.Longitude)
             , content: compiled[0]
           });
            
            if (!$scope.isMobileDevice) {
             $scope.infoWindow.open($scope.map, marker);
           }

           google.maps.event.addListener($scope.infoWindow, 'domready', function () {
            $scope.checkCallbackObject();
            var iwOuterParent = $('.gm-style-iw > div');
            iwOuterParent.addClass('show-iw')
            var iwOuter = $('.gm-style-iw');
            if ($('#foo').hasClass('centre')) {
              iwOuter.prepend('<div class="centre-bar"></div>')
            }
            var iwBackground = iwOuter.prev();
            iwBackground.children(':nth-child(2)').css({
              'display': 'none'
            });
            iwBackground.children(':nth-child(4)').css({
              'display': 'none'
            });
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.find('img').css({
              display: 'none'
            });
            if ($('.iw-content').height() < 140) {
              $('.iw-bottom-gradient').css({
                display: 'none'
              });
            }
            iwCloseBtn.mouseout(function () {
              $(this).css({
                opacity: '1'
              });
            });
            iwOuter.addClass('showit');
          });

           for (var i = 0; i < $scope.markers.length; i++) {
             if($scope.markers[i].Type !== "Center") {
              if ($scope.markers[i].CRMStatus === "Activated") {
               $scope.markers[i].setIcon('images/vn-tutor-pin-active.png');
             } else {
               $scope.markers[i].setIcon('images/vn-tutor-pin-inprocess.png');
             }
           } else {
            $scope.markers[i].setIcon('images/vn-center-pin.png');
          }
          $scope.markers[i].setZIndex(google.maps.Marker.MAX_ZINDEX);
        }
        if($scope.clickedData.Type !== "Center") {
         if ($scope.clickedData.CRMStatus === "Activated") {
          marker.setIcon('images/vn-tutor-pin-active-select.png');
        } else {
          marker.setIcon('images/vn-tutor-pin-inprocess-select.png');
        }
      } else {
       marker.setIcon('images/vn-center-pin-select.png');
     }

     marker.setZIndex(google.maps.Marker.MAX_ZINDEX);

   });
$scope.markers.push(marker);
        //var markerCluster = new MarkerClusterer($scope.map, $scope.markers, {imagePath: 'images/m'});
      };
    /*$scope.submitContact = function () {

       $.ajax({
          type: "POST"
          , url: contactURL
          , data: "LeadType=Student&LeadName=" + $scope.contactName + "&LeadEmail=" + $scope.contactEmail + "&ContactNumber=" + $scope.contactNumber + "&RelatedCRMId=" + $scope.contactTutor + "&StudentEmailId=" + $scope.contactEmail + "&Name=" + $scope.contactName + "&Board=" + $scope.filterBoard + "&Class=" + $scope.filterStandard + "&Subject=" + $scope.filterSubject + "&TutorID=" + $scope.contactTutor + "&TutorEmail=" + $scope.TutorEmail + "&ParentsName=" + $scope.contactMessage
          , success: function () {
             $('.modal-backdrop').remove();
             //success function
             //ga('send', 'event', 'Parent', 'NewLeadForm', $scope.contactTutor, $scope.noOfCallbacks, 'submit');
             alert("Thank you for contacting VidyaNext. We will get back to you shortly.");
             $scope.noOfCallbacks = $scope.noOfCallbacks + 1;
             $('#profileDetails').show();
             $('#callBackForm').hide();
          }
          , error: function (x, y, z) {
             //error function
          }
       });

     };*/
     $scope.gPlace;
     $scope.createMarkerPointers = function (data, lat, lng) {
      $scope.filterBoard = $rootScope.tutorSearchObj.board;
      $scope.filterSubject = $rootScope.tutorSearchObj.subject;
      $scope.filterStandard = $rootScope.tutorSearchObj.standard;
      var boardFiltered = $rootScope.filteredData.filter(function (row) {
        if ($scope.filterBoard != "Any" && row.Type != "Center") {
         if (row.Boards != null && row.Boards != undefined) {
          var boardArr = row.Boards.split(",");
          for (i = 0; i < boardArr.length; i++) {
           if (boardArr[i].trim() == $scope.filterBoard) {
            return true;
          } else {
            continue;
          }
          return false;
        }
      }
    } else {
     return true;
   }
 });

      var subjectFiltered = boardFiltered.filter(function (row) {

        if ($scope.filterSubject != "Any" && row.Type != "Center") {
         if (row.Subjects != null && row.Subjects != undefined) {
          var subArr = row.Subjects.split(",");
          for (i = 0; i < subArr.length; i++) {
           if (subArr[i].trim() == $scope.filterSubject) {
            return true;
          } else {
            continue;
          }
          return false;
        }
      }
    } else {
     return true;
   }

 });

      var stdFiltered = subjectFiltered.filter(function (row) {
        if ($scope.filterStandard != "Any" && row.Type != "Center") {
         if (row.Classes != null && row.Classes != undefined) {
          var stdArr = row.Classes.split(",");
          for (i = 0; i < stdArr.length; i++) {
           if (stdArr[i].trim() == $scope.filterStandard.trim()) {
            return true;
          } else {
            continue;
          }
        }
        return false;
      }
    } else {
     return true;
   }
 });

         /*var crmFiltered = stdFiltered.filter(function (row) {
             if ($scope.filterCRMStat != "Any" && row.Type != "Center") {
                 var stdArr = row.CRMStatus;
                 if (stdArr == $scope.filterCRMStat.trim()) {
                     return true;
                 } else {
                     return false;
                 }
             } else {
                 return true;
             }
           });*/

           $rootScope.filteredData;

           for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null);
          }

          $scope.markers = [];

          for (i = 0; i < $rootScope.filteredData.length; i++) {
            $scope.createMarker($rootScope.filteredData[i], lat, lng);
          }
        };

        $scope.updateFilterKeys = function () {

         /*$scope.uniqueBoard = [];
         $scope.uniqueBoard.push("Any");

         for (i = 0; i < boards.split(',').length; i++) {
             if (boards.split(',')[i] != null && boards.split(',')[i] != undefined) {
                 $scope.uniqueBoard.push(boards.split(',')[i]);
             }
         }

         $scope.uniqueStandard = [];
         $scope.uniqueStandard.push("Any");

         for (i = 0; i < classes.split(',').length; i++) {
             if (classes.split(',')[i] != null && classes.split(',')[i] != undefined) {
                 $scope.uniqueStandard.push(classes.split(",")[i]);
             }
         }

         $scope.uniqueSubject = [];
         $scope.uniqueSubject.push("Any");

         for (i = 0; i < subjects.split(',').length; i++) {
             if (subjects.split(',')[i] != null && subjects.split(',')[i] != undefined) {
                 $scope.uniqueSubject.push(subjects.split(",")[i]);
             }
           }*/


           $scope.uniqueCRMStat = [];
           $scope.uniqueCRMStat.push("Any");
           if ($scope.data) {
            for (i = 0; i < $scope.data.length; i++) {

             if ($scope.data[i].CRMStatus != null && $scope.data[i].CRMStatus != undefined) {
              for (var j = 0; j < $scope.data[i].CRMStatus.split(",").length; j++) {
               if ($scope.uniqueCRMStat.indexOf($scope.data[i].CRMStatus.split(",")[j].trim()) === -1) {
                $scope.uniqueCRMStat.push($scope.data[i].CRMStatus.split(",")[j].trim());
              }
            }
          }
        }
      }
    };

    $scope.updateBounds = function (ne, sw) {
     var subject;
     if (!$rootScope.subjectSubmitValues) {
       subject = "";
     }
     else {
       if (!$rootScope.subjectSubmitValues.length) {
         subject = "";
       }
       else {
         subject = $rootScope.subjectSubmitValues;
       }
     }
         //console.log("update bounds ::" + $scope.initialised + "::" + arguments.callee.caller.toString());
         if ($scope.initialised) {
          $scope.showFilter = false;

          if($rootScope.searchValue) {
           $http({
            method: 'GET'
            , url: fetchURL + '?latitude=' + $scope.lat + '&longitude=' + $scope.lng + '&' + 'swlatitude=' + sw.lat() + '&swlongitude=' + sw.lng() + '&nelatitude=' + ne.lat() + '&nelongitude=' + ne.lng() + '&board=' + $rootScope.tutorSearchObj.board + '&subject=' + subject + '&level=' + $rootScope.tutorSearchObj.standard + ''
          }).success(function (data) {
               /*$http({
                  method: 'GET'
                  , url: '/scripts/json/data.json'
                }).success(function (data) {*/

                  $('.scrollY').animate({
                   scrollTop: 0
                 }, 0);

                  $scope.data = data;
                  $rootScope.filteredData = data;
                  for (var i = 0; i < $rootScope.filteredData.length; i++) {
                    $scope.activeSubjectsList = [];
                    if ($rootScope.filteredData[i].Subjects) {
                      for (var j = 0; j < $rootScope.filteredData[i].Subjects.split(',').length; j++) {
                        if (subjects.split(',')[j] != null && subjects.split(',')[j] != undefined) {
                          $scope.activeSubjectsList.push(subjects.split(",")[j]);
                        }
                      }
                    }
                    $rootScope.filteredData[i]['subjectsArray'] = $scope.activeSubjectsList;
                  }
                  $scope.createMarkerPointers(data, $scope.lat, $scope.lng);
                    //$scope.updateFilterKeys();
                    //$('#map').show().addClass('show-on__mobile');
                    $('.view-options li').removeClass('active');
                    $('.location-search').removeClass('show');
                    //$('.location-search').removeClass('show-on__mobile');
                    $('.mapView').addClass('active');
                  }).error(function () {
                    //debugger;
                  });
                }
              } else {
                $scope.initialised = true;
              }
            };


          });