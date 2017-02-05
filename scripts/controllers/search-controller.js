'use strict';
angular.module('clientApp').controller('SearchController', function ($window, $rootScope, $scope, $cookies, $location, $http, $timeout, $compile, $localStorage, ModalService) {
    $rootScope.gPlace;
    $rootScope.searchValue = false;
    $scope.showNameSearch = false;
    $rootScope.searchByName = false;
    //empty tutor search object
    $rootScope.tutorSearchObj = {
        chosenPlace: ""
        , board: ""
        , subject: $scope.grossSubjects[0]
        , standard: ""
    };

    if ($rootScope.callbackdataObj == undefined || $rootScope.callbackdataObj == null) {
        $rootScope.callbackdataObj = {};
    }

    $scope.placeChanged = function (autoComplete) {
        if (autoComplete) {
            var place = autoComplete.getPlace();
            if (!place) {
                place = $scope.locationFromStorage;
            }
            
            $scope.currentPlace = place.formatted_address;
            if(!$scope.currentPlace) {              
               $scope.currentPlace = $rootScope.tutorSearchObj.chosenPlace;
               return;
           }
       }
       else {            
        var place = $scope.locationFromStorage;            
    }
    if (!place.geometry) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': place.name
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                    //$('.location-search').addClass('fadeOut').hide();
                    if (!$('.location-search').hasClass('page-filter')) {
                        $('.location-search').addClass('page-filter');
                        $('.header-less-height').addClass('minus-fb');
                    }
                    $('.view-options').addClass('show-options');
                    $scope.locateMe(results[0].geometry.location);
                }
                else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        return;
    }
    else {
        if (autoComplete) {
            if (!$('.location-search').hasClass('page-filter')) {
                $('.location-search').addClass('page-filter');
                $('.header-less-height').addClass('minus-fb');
            }
            $('.view-options').addClass("show-options");
        }
    }
        //$scope.updateFilterKeys();
        if (place.geometry.viewport) {
            //$scope.map.fitBounds(place.geometry.viewport);
            $scope.locateMe(place.geometry.location);
        }
        else {
            $scope.locateMe(place.geometry.location);
        }
        /*$scope.lat = place.geometry.location.lat();
        $scope.lng = place.geometry.location.lng();*/
    };
    $rootScope.locationMessage = "Locate me!";
    
    $scope.errorFunction = function() {
       //$rootScope.locationMessage = "Please check your browser's location settings!";
       $('.locate-btn').attr("data-original-title", "Please check your location settings!");
       $('.locate-btn').tooltip('show');
       $('.tooltip').addClass('not-supported');
   };

   $scope.geolocate = function (position) {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition($scope.getPosition, $scope.errorFunction);
     }
     else{
         $scope.geolocation = new google.maps.LatLng(51.5072, 0.1275);
     }
 };

 $scope.getPosition = function (position){
   if(position) {
     var geocoder = new google.maps.Geocoder();
     var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

     geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
             $rootScope.tutorSearchObj.chosenPlace = results[1].formatted_address;
             $scope.$apply();

                     /*if (!$('.location-search').hasClass('page-filter')) {
                        $('.location-search').addClass('page-filter');
                        $('.header-less-height').addClass('minus-fb');
                     }
                     $('.view-options').addClass('show-options');
                     $scope.pleaseFindMe(results[0].geometry.location);*/
                     $scope.ifMyLocationEnabled = true;
                     $scope.myLocationData = results[0].geometry.location;
                     /*$('#inputAutoComplete').val(results[1].formatted_address);
                     var autoComplete = new google.maps.places.Autocomplete(inputAutoComplete);
                     $scope.placeChanged(autoComplete);*/
                     //console.log(results[1].formatted_address); // details address
                 } else {
                  console.log('Location not found');
              }
          } else {
              console.log('Geocoder failed due to: ' + status);
          }
      });
 }
};

$scope.findMeInMap = function() {
   $scope.geolocate();
   $('.locate-btn').tooltip('hide');
};

$scope.closeInfoWindow = function () {
    if ($scope.infoWindow) {
        $scope.infoWindow.close();
        $scope.infoWindow.setMap(null);
        $scope.infoWindow = null;
    }
};
$scope.showSearch = function () {
    if (!$('location-search').hasClass('show')) {
        $('location-search').addClass('show');
    }
    else {
        $('location-search').removeClass('show');
    }
};
$scope.findProfileImage = function (tutorId, gender) {
    $http({
        method: 'GET'
        , url: profileImgURL + "" + tutorId
    }).success(function (data) {
        var elem = document.getElementById('imgM-' + data.TutorId);
        if (elem) {
            if (data.ImageData) {
                elem.src = data.ImageData;
                $scope.tutorImage = data.ImageData;
                $scope.clickedData['imgSrc'] = data.ImageData;
                $scope.$apply();
            }
            else if (data.ImageData == null) {
                if (gender == "Male") {
                    $scope.tutorImage = "images/avatar-male.png"
                }
                else if (gender == "Female") {
                    $scope.tutorImage = "images/avatar-female.png"
                }
                else {
                    $scope.tutorImage = "images/avatar-neutral.png"
                }
                elem.removeAttribute('src');
                $scope.clickedData['imgSrc'] = "";
            }
        }
        $scope.downloading = false;
    }).error(function (data, status, headers, config) {
        $scope.downloading = false;
            //$scope.clickedData['imgSrc'] = $('#foo img').attr('src');
        });
};
$scope.createMarker = function (info, i) {
    var icon;
    if (info.Type !== "Center") {
        if (info.CRMStatus === "Activated") {
            icon = 'images/vn-tutor-pin-active.png';
        }
        else {
            icon = 'images/vn-tutor-pin-inprocess.png';
        }
    }
    else {
        icon = 'images/vn-center-pin.png';
    }
    var largest = Math.max.apply(Math, info.CourseOfferings);
    var marker = new google.maps.Marker({
        id: info.CRMID
        , map: $scope.map
        , position: new google.maps.LatLng(info.Latitude, info.Longitude)
        , icon: icon
        , TutorId: info.TutorId
        , Gender: info.Gender
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
    if (info.Type === "Center") {
        marker.content = '<div id="foo" class="map-info centre">';
        var gradeArray = info.Grades.split(/(\s+)/);
    }
    else {
        marker.content = '<div id="foo" class="map-info">';
    }
    marker.content += '<div class="media"><div class="media-left">';
    marker.content += '<img id="imgM-' + info.TutorId + '" alt="Profile Image" ng-src="{{tutorImage}}"/></div> <!-- /media left -->';
    marker.content += '<div class="media-body"><a href="javascript:void(0)" class="infowindow-closebtn" ng-click="closeInfoWindow()"><i class="icon icon-close"></i></a><h3 class="media-heading">' + info.FullName + '</h3>';
    marker.content += '<p><i class="icon icon-pin"></i>' + info.Distance + 'km (Approximately)</p><p>' + (info.Gender != null ? info.Gender : 'N/A') + '</p>';
    marker.content += '<ul class="list-inline tags hidden-xs">';
    if (info.Subjects != null && info.Subjects != undefined && info.Subjects != "") {
        for (i = 0; i < info.Subjects.split(',').length; i++) {
            marker.content += '<li><span>' + info.Subjects.split(',')[i] + '</span></li>';
        }
    }
    else {
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
    }
    else {
        marker.content += '<li>N/A</li>';
    }
    marker.content += '</ul></div>';
    marker.content += '<div class="row values block"><div class="col-md-7 col-sm-7 col-xs-8"><div class="row custom-row__6 custom-row__4_xs"><div class="col-md-6 col-sm-6 col-xs-6">';
    if (info.Type === "Center") {
        marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-class-teach"></i></div><div style="display:inline-block"><h1>' + (gradeArray[0] != "0" ? gradeArray[0] : 'N/A') + '</h1></div></div><h5>Classes taught</h5>';
    }
    else {
        marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-t-exp"></i></div><div style="display:inline-block"><h1>' + (info.YearsOfTeachingExperience != "0" ? info.YearsOfTeachingExperience : 'N/A') + '</h1></div></div><h5>Tuition exp(Yrs)</h5>';
    }
    marker.content += '</div>';
    marker.content += '<div class="col-md-6 col-sm-6 col-xs-6">';
    marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-class-size"></i></div><div style="display:inline-block"><h1>' + (info.NumberOfCurrentStudents != "0" ? info.NumberOfCurrentStudents : 'N/A') + '</h1></div></div><h5>Class size</h5>';
    marker.content += '</div></div></div>';
    marker.content += '<div class="col-md-5 col-sm-5 col-xs-4">';
    /*marker.content += '<h5>Rates starts from</h5><div class="value-wrap"><div class="pull-left"><i class="icon icon-rate"></i></div><div class="pull-left"><h1>' + ((info.RateStartsFrom !== 0 && info.RateStartsFrom !== -999) ? info.RateStartsFrom: 'N/A') + '</h1></div></div>';*/
        if (info.Type === "Center") { //if centre display Student-Teacher Ratio else display Rate starts from
            marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-t-ratio"></i></div><div style="display:inline-block"><h1>' + (info.NumberOfTeachers != "0" ? info.NumberOfTeachers : 'N/A') + '</h1></div></div><h5>Teachers</h5></div></div>';
        }
        else {
            marker.content += '<div class="value-wrap"><div style="display:inline-block"><i class="icon icon-rate"></i></div><div style="display:inline-block"><h1>' + ((info.RateStartsFrom !== 0 && info.RateStartsFrom !== -999) ? info.RateStartsFrom : 'N/A') + '</h1></div></div><h5>Rates <span class="hidden-xs">starts</span> from</h5></div></div>';
        }
        marker.content += '</div>';
        if (info.Type === "Center") {
            var ifHttp = info.CenterUrl.match("https://");
            if (ifHttp === null) {
                info.CenterUrl = "https://" + info.CenterUrl;
            }
            marker.content += '<a target="_blank" href="' + info.CenterUrl + '" class="btn btn-tertiary btn-lg btn-block" style="margin-top:6px;">View Profile</button>';
        }
        else {
            marker.content += '<button type="button" class="btn btn-tertiary btn-lg btn-block" ng-click="showProfile(' + info.TutorId + ')" style="margin-top:6px;">View Profile</button>';
        }
        marker.content += '</div></div>';
        //map click function
        google.maps.event.addListener(marker, 'click', function () {
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
            var rateCardUrl = apiTutorDirURL + '/RateInfo?username=' + $scope.clickedData.Email;
            $http({
                method: 'GET'
                , url: rateCardUrl
            }).success(function (data) {
                console.log('success');
            }).error(function (data, status, headers, config) {
                console.log('failure')
            });
            $scope.activeSubjects = [];
            if ($scope.clickedData.Subjects != null) {
                for (i = 0; i < $scope.clickedData.Subjects.split(',').length; i++) {
                    if (subjects.split(',')[i] != null && subjects.split(',')[i] != undefined) {
                        $scope.activeSubjects.push(subjects.split(",")[i]);
                    }
                }
            }
            $scope.allSubjects = ["Biology", "Chemistry", "Maths"];
            $scope.findProfileImage(info.TutorId, info.Gender);
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
                var iwOuterParent = $('.gm-style-iw').parent();
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
            });
            for (var i = 0; i < $scope.markers.length; i++) {
                if ($scope.markers[i].Type !== "Center") {
                    if ($scope.markers[i].CRMStatus === "Activated") {
                        $scope.markers[i].setIcon('images/vn-tutor-pin-active.png');
                    }
                    else {
                        $scope.markers[i].setIcon('images/vn-tutor-pin-inprocess.png');
                    }
                }
                else {
                    $scope.markers[i].setIcon('images/vn-center-pin.png');
                }
                $scope.markers[i].setZIndex(google.maps.Marker.MAX_ZINDEX);
            }
            if ($scope.clickedData.Type !== "Center") {
                if ($scope.clickedData.CRMStatus === "Activated") {
                    marker.setIcon('images/vn-tutor-pin-active-select.png');
                }
                else {
                    marker.setIcon('images/vn-tutor-pin-inprocess-select.png');
                }
            }
            else {
                marker.setIcon('images/vn-center-pin-select.png');
            }
            marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
        });
$scope.markers.push(marker);
};

$scope.updateFilterKeys = function () {
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
$scope.setMapOnAll = function (map) {
    for (var i = 0; i < markers.length; i++) {
        $scope.markers[i].setMap(map);
    }
};
$scope.clearInput = function () {
    $rootScope.tutorSearchObj.chosenPlace = "";
};
$scope.clearMarkersOnMap = function () {
    $scope.setMapOnAll(null)
};

$scope.updateBounds = function (ne, sw) {
    var subject;
    if ($rootScope.tutorSearchObj.subject == "Any Subject") {
        subject = "";
    }
    else {
        subject = $rootScope.tutorSearchObj.subject;
    }
        //console.log("update bounds ::" + $scope.initialised + "::" + arguments.callee.caller.toString());
        if ($scope.initialised) {
            $scope.showFilter = false;
            $http({
                method: 'GET'
                , url: fetchURL + '?latitude=' + $scope.lat + '&longitude=' + $scope.lng + '&' + 'swlatitude=' + sw.lat() + '&swlongitude=' + sw.lng() + '&nelatitude=' + ne.lat() + '&nelongitude=' + ne.lng() + '&board=' + $rootScope.tutorSearchObj.board + '&subject=' + subject + '&level=' + $rootScope.tutorSearchObj.standard + ''
            }).success(function (data) {
                $('.scrollY').animate({
                    scrollTop: 0
                }, 0);
                $scope.data = data;
                $rootScope.filteredData = data;
                for (var i = 0; i < $rootScope.filteredData.length; i++) {
                    $scope.activeSubjectsList = [];
                    for (var j = 0; j < $rootScope.filteredData[i].Subjects.split(',').length; j++) {
                        if (subjects.split(',')[j] != null && subjects.split(',')[j] != undefined) {
                            $scope.activeSubjectsList.push(subjects.split(",")[j]);
                        }
                    }
                    $rootScope.filteredData[i]['subjectsArray'] = $scope.activeSubjectsList;
                }
                //$scope.createMarkerPointers(data, $scope.lat, $scope.lng);
                $scope.clearMarkersOnMap();
                $scope.updateFilterKeys();
            }).error(function () {
                //debugger;
            });
        }
        else {
            $scope.initialised = true;
        }
    };
    if ($scope.map) {
        $scope.dragendEvent = $scope.map.addListener('idle', function () {
            //if (!$scope.dragging && (!$scope.infoWindow || $scope.infoWindow == null || $scope.infoWindow == undefined) && !$rootScope.viewChange) {
                var bounds = $scope.map.getBounds();
                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();
                $scope.updateBounds(ne, sw);
            //}
        });
    }
    $scope.load = function () {
        $rootScope.tutorSearchObj = angular.fromJson(window.localStorage.tutorSearchObject);
        $scope.placeChanged($rootScope.gPlace);
    };
    if ($rootScope.tutorSearchObjectValue == true) {
        $scope.load();
    }
    
    if($location.search()['access'] == '1571d0e3c5d3cc02'){
      $scope.showNameSearch = true;
      $rootScope.searchByName = true;
  }
  
    //localStorage.clear();
    /*if (localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== null) {
        var searchValues = JSON.parse(localStorage.getItem('user')),
            phoneNumber = searchValues.phone, 
            pattern = /(\+91[\-\s]?)/i;
        phoneNumber = phoneNumber.replace(pattern, "");
        
        $rootScope.contactMessage = searchValues.parentName;
        $rootScope.contactNumber = searchValues.phone;
        $rootScope.contactEmail = searchValues.parentEmail;
        if (searchValues.subject) {
            $rootScope.tutorSearchObj.subject = searchValues.subject;
            $rootScope.tutorSearchObj.standard = searchValues.class;
            $scope.locationFromStorage = searchValues.location;
            $scope.placeChanged();
        }
        else if (searchValues.studentName) {
            $rootScope.contactName = searchValues.studentName;
        }
    }*/
    
    
    // getting the location
    $scope.findAndUseLocation = function (position) {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition($scope.getPostalCode);
     }
     else {
         alert('Geolocation is not supported by this browser.');
     }
 };

    // getting the postcode
    $scope.getPostalCode = function (position)
    {
        geocodeservice.getPostalCode(position,
            $scope.updatepostcode, $scope.alertfunc);
    };
    
    // updating the ui after getting the results from service
    $scope.updatepostcode = function (postcode)
    {
        $scope.mydeliveryuser.postCodeValue = postcode;
        $scope.$apply();
    };

    $scope.findUseMyLocation = function(locationData) {
      if (!$('.location-search').hasClass('page-filter')) {
         $('.location-search').addClass('page-filter');
         $('.header-less-height').addClass('minus-fb');
     }
     $('.view-options').addClass('show-options');
     $scope.locateMe(locationData);
 };

 $window.onbeforeunload = function (e) {
   if($scope.ifGoBack) {
     $scope.ifGoBack.ifReferrerTutorDirectory = true;
     localStorage.setItem('user', JSON.stringify($scope.ifGoBack));
     history.go(-2);
         //window.location = "../TutorDirectory/"
     }
 }

   //localStorage.clear();
   if (localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== null) {
      var searchValues = JSON.parse(localStorage.getItem('user')),
      phoneNumber = searchValues.phone, 
      pattern = /(\+91[\-\s]?)/i;
      if(phoneNumber) {
         phoneNumber = phoneNumber.replace(pattern, "");
     }
     $scope.ifGoBack = searchValues;      
      /*$rootScope.contactMessage = searchValues.parentName;
      $rootScope.contactNumber = phoneNumber;
      $rootScope.contactEmail = searchValues.parentEmail;*/
      $rootScope.callbackdataObj = {
         studentName: "",
         parentName: searchValues.parentName,
         parentEmail: searchValues.parentEmail,
         parentPhone: phoneNumber
     };
     if (searchValues.subject) {

          //browser back handling
          window.onpopstate = function() {
              searchValues.ifReferrerTutorDirectory = true;
              localStorage.setItem('user', JSON.stringify(searchValues));
              //history.go(-2);
          }
          $rootScope.tutorSearchObj.subject = searchValues.subject;
          $rootScope.tutorSearchObj.standard = searchValues.class;
          $scope.locationFromStorage = searchValues.location;
          $scope.placeChanged();

          $rootScope.options = $rootScope.options || [];
          $rootScope.submitOptions = $rootScope.submitOptions || [];
          $rootScope.options.push(searchValues.subject.slice(0, 3));
          $rootScope.submitOptions.push(searchValues.subject);
          $rootScope.subjectValues = $rootScope.options.join();
          $rootScope.subjectSubmitValues = $rootScope.submitOptions.join();
          $timeout(function () {
            var $inp = $( '[data-subject=' + searchValues.subject +']' );
            $inp.prop('checked','true')
        }, 2000);
      } else if (searchValues.studentName) {
          //$rootScope.contactName = searchValues.studentName;
          $rootScope.callbackdataObj.studentName = searchValues.studentName
      }
  } else {
      /*$rootScope.contactMessage = "";
      $rootScope.contactName;
      $rootScope.contactEmail;  */    
  }

    //find tutor/center search function
    $scope.findTutorCenterSearch = function (isValid, hello) {
        if (!isValid) {
            return;
        }
        //var place = autoComplete.getPlace();
        $('.preloader-wrap').addClass('show-loader');
        $rootScope.tutorSearchObj;
        window.localStorage.setItem("tutorSearchObject", angular.toJson($rootScope.tutorSearchObj));
        //window.localStorage.setItem("googlePlace", angular.toJson($rootScope.gPlace));
        $timeout(function () {
            if(!$scope.ifMyLocationEnabled) {
               $scope.placeChanged($rootScope.gPlace);
           } else {
               $scope.findUseMyLocation($scope.myLocationData);
           }
           $rootScope.searchValue = true;
       }, 2000);
        if (!$scope.dragging) {
            var bounds = $scope.map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
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
          $http({method: 'GET', url: fetchURL + '?latitude=' + $scope.lat + '&longitude=' + $scope.lng + '&' + 'swlatitude=' + sw.lat() + '&swlongitude=' + sw.lng() + '&nelatitude=' + ne.lat() + '&nelongitude=' + ne.lng() + '&board=' + $rootScope.tutorSearchObj.board + '&subject=' + subject + '&level=' + $rootScope.tutorSearchObj.standard + ''
      }).success(function (data) {
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
                $('#map').show().addClass('show-on__mobile');
                $('.view-options li').removeClass('active');
                $('.location-search').removeClass('show');
                $('.location-search').removeClass('show-on__mobile');
                $('.mapView').addClass('active');
            }).error(function () {
                //debugger;
            });
        }
        dataLayer.push({
            'location': 'location'
            , 'board': 'board'
            , 'standard': 'standard'
            , 'subject': 'subject'
            , 'event': 'newSearch'
        });
    };

    //find tutor/center search function
    $scope.findTutorProfilesSearch = function (isValid, name) {
        if (!isValid) {
            return;
        }
        //var place = autoComplete.getPlace();
        $('.preloader-wrap').addClass('show-loader');
        var searchUrl = apiTutorDirURL + '/SearchTutorProfiles';

        $http({method: 'GET', url: searchUrl + '?profileName=' + name
    }).success(function (data) {
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
                $('#map').show().addClass('show-on__mobile');
                $('.view-options li').removeClass('active');
                $('.location-search').removeClass('show');
                $('.location-search').removeClass('show-on__mobile');
                $('.mapView').addClass('active');
                if (!$('.location-search').hasClass('page-filter')) {
                    $('.location-search').addClass('page-filter');
                    $('.header-less-height').addClass('minus-fb');
                }
                $('.view-options').addClass('show-options');

            }).error(function () {
                //debugger;
            });
            dataLayer.push({
                'location': 'location'
                , 'board': 'board'
                , 'standard': 'standard'
                , 'subject': 'subject'
                , 'event': 'newSearch'
            });
        };
    });