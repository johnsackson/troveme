var clientApp = angular.module('clientApp');

clientApp.controller('ModalController', ['$rootScope', '$scope', '$element', 'title', 'data', 'close', '$http', function ($rootScope, $scope, $element, title, data, close, $http) {
  $scope.canAddCallback = !$rootScope.searchByName;
  $scope.processingData = data;
   $scope.isRateInfo = false; // by default all tutors has a ratecard.
   $scope.activeSubjectsArray = [];
   if ($scope.processingData.Subjects != null) {
    for (i = 0; i < $scope.processingData.Subjects.split(',').length; i++) {
     if ($scope.processingData.Subjects.split(',')[i] != null && $scope.processingData.Subjects.split(',')[i] != undefined) {
      $scope.activeSubjectsArray.push($scope.processingData.Subjects.split(",")[i]);
    }
  }
}
$scope.activeBoardsArray = [];
if ($scope.processingData.Boards != null) {
  for (i = 0; i < $scope.processingData.Boards.split(',').length; i++) {
   if ($scope.processingData.Boards.split(',')[i] != null && $scope.processingData.Boards.split(',')[i] != undefined) {
    $scope.activeBoardsArray.push($scope.processingData.Boards.split(",")[i]);
  }
}
}
   /*$scope.activeBoards = $scope.processingData.Boards; //["CBSE","ICSE"];  
   $scope.activeSubjects = $scope.processingData.Subjects; //["Chemistry","Maths","Physics"];*/
   if($scope.processingData.RateStartsFrom !== 0 && $scope.processingData.RateStartsFrom !== -999) {
    $scope.isRateInfo = true;
  } 
  
  if($scope.isRateInfo) {
    var rateCardUrl = apiTutorDirURL + "/RateInfo?username=" + $scope.processingData.Email;
    $http.get(rateCardUrl)
    .success(function (data, status, headers, config) {
      $scope.rateData = data.TutorRateInfo.Rates;
      $scope.activeBoards = data.TutorRateInfo.Boards;
      $scope.activeSubjects = data.TutorRateInfo.Subjects;
    })
    .error(function (data, status, header, config) {
            //failure
          });  
  }   

  $scope.name = null;
  $scope.age = null;
  $scope.title = title;

  $scope.showCallBackForm = function (crmId) {
    $('.profileDetails').hide();
    $('.callBackForm').show();
    dataLayer.push({
      'TutorCRMID': crmId,
      'location': 'location',
      'board': 'board',
      'standard':'standard',
      'subject': 'subject',
      'event': 'requestCallBackStarted'
    });
  };

  $scope.moveBack = function () {
    $('.profileDetails').show();
    $('.callBackForm').hide();
  };

   /*$("#content-1").mCustomScrollbar({
       theme:"minimal"
     });*/
     
     $scope.addTutor = function () {
      $scope.callBackObj = true;
      close({tutorId: $scope.processingData.TutorId, callBackObj: $scope.callBackObj});
      $('.modal-backdrop').remove();
    };

    $scope.closeModal = function () {
      close($scope.processingData.TutorId);
      $('.modal-backdrop').remove();
      $('.profileDetails').show();
      $('.callBackForm').hide();
    };
    
   //  This close function doesn't need to use jQuery or bootstrap, because
   //  the button has the 'data-dismiss' attribute.
   $scope.close = function () {

    close({
     name: $scope.name
     , age: $scope.age
      }, 500); // close, but give 500ms for bootstrap to animate
  };

   //  This cancel function must use the bootstrap, 'modal' function because
   //  the doesn't have the 'data-dismiss' attribute.
   $scope.cancel = function () {

      //  Manually hide the modal.
      $element.modal('hide');

      //  Now call close, returning control to the caller.
      close({
       name: $scope.name
       , age: $scope.age
      }, 500); // close, but give 500ms for bootstrap to animate
    };
    
    $scope.submitContact = function () {
      var subject;
      if ($scope.tutorSearchObj.subject == "Any Subject") {
       subject = "All";
     } else {
       subject = $scope.tutorSearchObj.subject;
     }
     
     var enquiryData = {
      "LeadEnquiry": {
        "StudentEmailId": $scope.contactEmail,
        "Name": $scope.contactName,
        "ParentsName": $scope.contactMessage,
        "ContactNumber": $scope.contactNumber ,
        "Board": $scope.tutorSearchObj.board,
        "Class": $scope.tutorSearchObj.standard,
        "Subject": subject,
        "TutorId": $scope.processingData.TutorId,
        "TutorEmail": $scope.processingData.Email,
        "CreatedDate": "",
        "TutorName": $scope.processingData.FullName,
        "DIDNumber": ""
      },
      "ParentCRMID": "",
      "TutorSelected": [
      {
        "TutorId": $scope.processingData.TutorId,
        "TutorEmail": $scope.processingData.Email,
        "TutorName": $scope.processingData.FullName,
        "DIDNumber": "",
        "Product": subject,
        "StudentName": $scope.contactName,
        "StudentClass": $scope.tutorSearchObj.standard,
        "StudentBoard": $scope.tutorSearchObj.board,
        "TutionType": "CCH"
      }
      ]
    };
    
    if($scope.processingData.Type == 'Center') {
     enquiryData.TutorSelected[0].TutionType = "CVC";
   }
   
       // Tuition type (centre - CVC and others - CCH)
       
      //"LeadType=Student&LeadName=" + $scope.contactName + "&LeadEmail=" + $scope.contactEmail + "&ContactNumber=" + $scope.contactNumber + "&RelatedCRMId=" + $scope.processingData.CRMID + "&StudentEmailId=" + $scope.contactEmail + "&Name=" + $scope.contactName + "&Board=" + $scope.tutorSearchObj.board + "&Class=" + $scope.tutorSearchObj.standard + "&Subject=" + subject + "&TutorID=" + $scope.processingData.TutorId + "&TutorEmail=" + $scope.processingData.Email + "&ParentsName=" + $scope.contactMessage
      
      $.ajax({
       type: "POST"
       , url: contactURL
       , data: enquiryData
       , success: function () {
        localStorage.setItem('user', JSON.stringify({
          studentName: $scope.contactName,
          parentName: $scope.contactMessage,                
          parentEmail: $scope.contactEmail,
          phone: $scope.contactNumber
        })); 
        
        $('.modal-backdrop').remove();
            //success function
            dataLayer.push({
              'TutorCRMID': $scope.processingData.CRMID,
              'location': 'location',
              'board': 'board',
              'standard':'standard',
              'subject': 'subject',
              'event': 'requestCallBackCompleted'
            });
            alert("Thank you for contacting VidyaNext. We will get back to you shortly.");
            $scope.noOfCallbacks = $scope.noOfCallbacks + 1;            
            if ($scope.processingData.Type == 'Center') {
              close();
            } else {
              $('.profileDetails').show();
              $('.callBackForm').hide();
            }
          }
          , error: function (x, y, z) {
            alert("Something went wrong. Please try again later!");
          }
        });

    };

  }]);