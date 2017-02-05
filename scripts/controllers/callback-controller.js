'use strict';
angular.module('clientApp').controller('callBackController', function ($window, $rootScope, $scope, $cookies, $location, $http, $timeout, $compile, ModalService) {
    $rootScope.tutorCallBackObj;
    /*$scope.contactName;*/
   $rootScope.contactMessage;
   $rootScope.contactName;
   $rootScope.contactEmail;
   if($rootScope.callbackdataObj){
      if($rootScope.callbackdataObj.parentName == "") {
         $rootScope.callbackdataObj = {
            studentName: "",
            parentName: "",
            parentEmail: "",
            parentPhone: ""
         };
      }
   }   
    $scope.isEmpty = function(e, value) {
       if(e.target.value != '') {
           $(e.target).parent().find('label').addClass('input--filled');
       } else {
           $(e.target).parent().find('label').removeClass('input--filled');
       }
    };
    
    $scope.submitContact = function () {
        $('#callbackform-submit').addClass('clicked');
        $('#callbackform-cancel').addClass('hide-it');
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
        //$scope.processingData.TutorId, $scope.processingData.Email, $scope.processingData.FullName
        $scope.enquiryData = {
            "LeadEnquiry": {
                "StudentEmailId": $rootScope.callbackdataObj.parentEmail
                , "Name": $rootScope.callbackdataObj.studentName
                , "ParentsName": $rootScope.callbackdataObj.parentName
                , "ContactNumber": $rootScope.callbackdataObj.parentPhone
                , "Board": $scope.tutorSearchObj.board
                , "Class": $scope.tutorSearchObj.standard
                , "Subject": subject
                , "TutorId": ""
                , "TutorEmail": ""
                , "CreatedDate": ""
                , "TutorName": ""
                , "DIDNumber": ""
            }
            , "ParentCRMID": ""
            , "TutorSelected": []
        };
        angular.forEach($rootScope.tutorCallBackObj, function (value, key) {
            var objData = {
                "TutorId": value.TutorId
                , "TutorEmail": value.Email
                , "TutorName": value.FullName
                , "DIDNumber": ""
                , "Product": subject
                , "StudentName": $scope.callbackdataObj.studentName
                , "StudentClass": $scope.tutorSearchObj.standard
                , "StudentBoard": $scope.tutorSearchObj.board
                , "TutionType": "CCH"
            }
            if(value.Type == 'Center') {
               objData.TutionType = "CVC";
            }
            $scope.enquiryData.TutorSelected.push(objData);
        });
        //"LeadType=Student&LeadName=" + $scope.contactName + "&LeadEmail=" + $scope.contactEmail + "&ContactNumber=" + $scope.contactNumber + "&RelatedCRMId=" + $scope.processingData.CRMID + "&StudentEmailId=" + $scope.contactEmail + "&Name=" + $scope.contactName + "&Board=" + $scope.tutorSearchObj.board + "&Class=" + $scope.tutorSearchObj.standard + "&Subject=" + subject + "&TutorID=" + $scope.processingData.TutorId + "&TutorEmail=" + $scope.processingData.Email + "&ParentsName=" + $scope.contactMessage
        $.ajax({
            type: "POST"
            , url: contactURL
            , data: $scope.enquiryData
            , success: function () {
                //$('#request-callback :input').attr('disabled', 'disabled');
                /*$('#request-callback').fadeTo("fast", 0.15, function () {
                    $(this).find(':input').attr('disabled', 'disabled');
                    $(this).find('label').css('cursor', 'default');
                    $('#canvas-success').fadeIn();
                });*/
                $timeout(function() {
                    $('#canvas-callback form').addClass('hide-me');
                    $('#canvas-success').addClass('show-me');
                }, 2000);
                $rootScope.contactName = $scope.contactName;
                $rootScope.contactEmail = $scope.contactEmail;
                $rootScope.contactNumber = $scope.contactNumber;
                $rootScope.contactMessage = $scope.contactMessage;
                  $rootScope.callbackdataObj = {
                     studentName: $rootScope.callbackdataObj.studentEmail,
                     parentName: $rootScope.callbackdataObj.parentName,
                     parentEmail: $rootScope.callbackdataObj.parentEmail,
                     parentPhone: $rootScope.callbackdataObj.parentPhone
                  };
                $('.modal-backdrop').remove();
                //success function
                /*dataLayer.push({
                    'TutorCRMID': $scope.processingData.CRMID
                    , 'location': 'location'
                    , 'board': 'board'
                    , 'standard': 'standard'
                    , 'subject': 'subject'
                    , 'event': 'requestCallBackCompleted'
                });*/
            }
            , error: function (x, y, z) {
                $timeout(function() {
                    $('#canvas-callback form').addClass('hide-me');
                    $('#canvas-error').addClass('show-me');
                }, 2000);
                
            }
        });
    };
});