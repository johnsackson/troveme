angular.module('clientApp')
   // Google autocomplete
   .directive('googleplace', ['$rootScope', function ($rootScope) {
      return {
         require: 'ngModel'
         , link: function (scope, element, attrs, model) {
                element.ready(function () {
                    $rootScope.$watch('$viewContentLoaded', function () {
                        $rootScope.gPlace = new google.maps.places.Autocomplete(element[0]);
                        google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                            $rootScope.$apply(function () {
                                model.$setViewValue(element.val());
                                $('.locate-btn').tooltip('hide');
                            });
                            $('.icon-search.input').hide();
                            $('.icon-close.clear').show();
                        });
                        
                        if (localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== null) {
                            var searchValues = JSON.parse(localStorage.getItem('user'));
                            if (searchValues.subject) {
                                $rootScope.tutorSearchObj.chosenPlace = searchValues.location.formatted_address;
                                $rootScope.locationFromStorage = searchValues.location;
                                $rootScope.hasValueInStorage = true;
                                $('.icon-search.input').hide();
                                $('.icon-close.clear').show();
                            }
                        }
                    });
                })
            }
        };
    }]).directive('tabbing', function () {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {
                element.click(function () {
                    if ($(this).hasClass('active')) {}
                    else {
                        //$('.profile-viewer').removeClass('active in')
                        //$('.tab-pane').removeClass('show-anyway');
                        /*var activeTabId = $(this).children().attr("aria-controls");
                        $("#" + activeTabId).addClass('active in');
                        $('.profile-viewer').not("#" + activeTabId).removeClass('active');*/
                    }
                });
            }
        };
    }).directive('hello', function () {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {
                element.click(function () {
                    //$('[data-toggle="tooltip"]').tooltip('hide');
                });
            }
        };
    }).directive('isEmptyCheck', function () {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {                
                scope.$watch(attributes.ngModel, function (value) {
                    if(value) {
                        element.parent().find('label').addClass('input--filled');
                    } else {
                        element.parent().find('label').removeClass('input--filled');
                    }                    
                });
            }
        };
    }).directive('tooltip', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                $('#tutorAdded').tooltip({
                    title: '<p class="info-tooltip">Tutor added here in list<a href="javascript:void();" ng-click="closeTooltip()">OK, GOT IT!</a></p>'
                    , html: true
                });
                element.on('mouseenter', function(e) {
                    $('#tutorAdded').tooltip('hide');
                });
                element.on('mouseleave', function(e) {
                    $('#tutorAdded').tooltip('hide');
                });
               var htmlcontent = $('p.info-tooltip');
               //htmlcontent.load('/Pages/Common/contact.html')
               $compile(htmlcontent.contents())(scope);
            }
        }
     }).directive('multiSelectCheckbox', function ($rootScope) {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {
                element.click(function (event) {
                    $rootScope.options = $rootScope.options || [];
                    $rootScope.submitOptions = $rootScope.submitOptions || [];
                    var $target = $(event.currentTarget)
                        , val = $target.attr('data-value')
                        , $inp = $target.find('input')
                        , idx;
                    //val = val.slice(0,3);
                    if ((idx = $rootScope.submitOptions.indexOf(val)) > -1) {
                        $rootScope.options.splice(idx, 1);
                        $rootScope.submitOptions.splice(idx, 1);
                        setTimeout(function () {
                            $inp.prop('checked', false)
                        }, 0);
                    }
                    else {
                        $rootScope.options.push(val.slice(0, 3));
                        $rootScope.submitOptions.push(val);
                        setTimeout(function () {
                            $inp.prop('checked', true)
                        }, 0);
                    }
                    $(event.target).blur();
                    //console.log( $rootScope.options );
                    $rootScope.$apply(function () {
                        $rootScope.subjectValues = $rootScope.options.join();
                        $rootScope.subjectSubmitValues = $rootScope.submitOptions.join();
                        console.log($rootScope.subjectSubmitValues);
                    });
                    return false;
                });
            }
        };
    }).directive('scrollToTop', function () {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes, ngModel) {
                element.click(function () {
                    $('.nav.nav-tabs').first().animate({
                        scrollTop: 0
                    });
                    $('.nav.nav-tabs').first().find('li').removeClass('active');
                    $('.nav.nav-tabs').first().find('li').eq(1).addClass('active');
                });
            }
        };
    }).directive('restrictAlphabets', function () { // restricts alphabets characters
        return {
            restrict: 'A'
            , require: 'ngModel'
            , link: function (scope, element, attributes, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }).directive('restrictNumbers', function () { // restricts alphabets characters
        return {
            restrict: 'A'
            , require: 'ngModel'
            , link: function (scope, element, attributes, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^a-zA-Z ]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }).directive('canvas', function () {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {
                element.click(function () {
                    $('#canvas-callback').toggleClass('show-then');
                    //element.addClass('btn-activated')
                });
            }
        };
    }).directive('closeForm', function ($rootScope) {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {
                element.click(function () {                    
                    $('#canvas-callback').removeClass('show-then');
                    if(element.attr('data-target') === 'findmore') {
                        setTimeout(function () {
                           $('#canvas-success').removeClass('show-me');
                           $('#canvas-callback form').removeClass('hide-me');
                           $('#callbackform-submit').removeClass('clicked');
                           $('.btn-activated').removeClass('btn-activated');
                           $rootScope.tutorCallBackObj = [];
                           $rootScope.count = 0;                           
                           scope.$apply();
                        }, 1000);                        
                    }
                });
            }
        };
    }).directive('retryForm', function () {
        return {
            restrict: 'A'
            , link: function (scope, element, attributes) {
                element.click(function () {
                    $('#canvas-error').removeClass('show-me');
                    $('#canvas-callback form').removeClass('hide-me');
                    $('#callbackform-submit').removeClass('clicked');
                    $('#callbackform-cancel').removeClass('hide-it');
                });
            }
        };
    }).directive('viewChange', function () {
      return {
         restrict: 'A'
         , link: function (scope, element, attributes) {
            element.click(function () {
               $(this).children().find('i').toggleClass('icon-list-view icon-map-view');
               if($(this).children().find('i').hasClass('icon-list-view')) {
                  $('.location-search').removeClass('show');
                  $('.location-search').removeClass('show-on__mobile');
                  $('#listView').hide().removeClass('show-on__mobile');
                  $('#map').show().addClass('show-on__mobile');
               } else {
                  $('.location-search').removeClass('show');
                  $('.location-search').removeClass('show-on__mobile');                  
                  $('#map').hide().removeClass('show-on__mobile');
                  $('#listView').show().addClass('show-on__mobile');
               }
            });
         }
      };
   })
   .directive('restrictAlphabets', function () {  // restricts alphabets characters
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attributes, ngModelCtrl) {
              function fromUser(text) {
                  var transformedInput = text.replace(/[^0-9]/g, '');
                  if (transformedInput !== text) {
                      ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$render();
                  }
                  return transformedInput;
              }
              ngModelCtrl.$parsers.push(fromUser);
          }
      };
   })
   .directive('restrictNumbers', function () {  // restricts alphabets characters
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attributes, ngModelCtrl) {
              function fromUser(text) {
                  var transformedInput = text.replace(/[^a-zA-Z ]/g, '');
                  if (transformedInput !== text) {
                      ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$render();
                  }
                  return transformedInput;
              }
              ngModelCtrl.$parsers.push(fromUser);
          }
      };
   }).directive('imageonload', ['ProfileImageService', function(ProfileImageService) {
      return {
            restrict: 'A',
            link: function (scope, element, attrs) {                
                element.click(function () {
                    var tutorId = element.attr('data-id');
                    ProfileImageService.getProfileImageUrl(tutorId).then(function(data){
                        if (data) {
                            element.src = data;
                            scope.tutorImage = data;
                        }
                    });   
                });
            }
        }
    }]);
