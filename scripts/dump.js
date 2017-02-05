$scope.lng = 77.59456269999998;
        $scope.lat = 12.9715987;

        var bengaluru = { lat: $scope.lat, lng: $scope.lng };

        var mapOptions = {
            zoom: 12,
            center: bengaluru,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);   

        $scope.currentPlace = "Bangalore, Karnataka, India";
        $scope.bounds = new google.maps.LatLngBounds();
        $scope.markers = [];  
        
        
        $scope.inputAutoComplete = (document.getElementById('inputAutoComplete'));
        $scope.autocomplete = new google.maps.places.Autocomplete($scope.inputAutoComplete);
        $scope.autocomplete.bindTo('bounds', $scope.map);
        
        
        
        /*********************/
        /* google map events */

        //place changed on autocomplete event
        google.maps.event.addListener($scope.autocomplete, 'place_changed', function () {
            $scope.placeChosen = $scope.autocomplete.getPlace();        
            //$scope.placeChanged($scope.autocomplete);
        });
        
        $scope.dragendEvent = $scope.map.addListener('dragstart', function () {            
        }); 
        
        $scope.dragendEvent = $scope.map.addListener('idle', function () {
            var bounds = $scope.map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            $scope.updateBounds(ne, sw);
        });
        
        $scope.dragendEvent = $scope.map.addListener('dragend', function () {
            $scope.dragging = false;
        });        
    });
    
    /*if($scope.map) {
        $scope.dragendEvent = $scope.map.addListener('idle', function () {
            alert('map drawn');
        });
    }*/
    var createMarker = function (info, i) {
        var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
          '<div id="bodyContent">'+
          '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
          'sandstone rock formation in the southern part of the '+
          'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
          'south west of the nearest large town, Alice Springs; 450&#160;km '+
          '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
          'features of the Uluru - Kata Tjuta National Park. Uluru is '+
          'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
          'Aboriginal people of the area. It has many springs, waterholes, '+
          'rock caves and ancient paintings. Uluru is listed as a World '+
          'Heritage Site.</p>'+
          '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
          'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
          '(last visited June 22, 2009).</p>'+
          '</div>'+
          '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });