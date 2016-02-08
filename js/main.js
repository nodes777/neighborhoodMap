var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -16.4936,
            lng: 145.4653
        },
        zoom: 14
    });

    ko.applyBindings(new ViewModel());
}

var places = [{
        title: "Dougies",
        position: {
            lat: -16.495539,
            lng: 145.462699
        },
        map: map,
        marker: null,
        placeId: "4e0b34d6aeb7a4da430a2606",
        content: 'Home base for backpackers. A comfortable friendly place to lay your head.'
    }, {
        title: "Iron Bar",
        position: {
            lat: -16.481341,
            lng: 145.462643
        },
        marker: null,
        map: map,
        placeId: "4b5d4c14f964a520215929e3",
        content: "The only bar in town open after midnight. You'll end up here"
    }, {
        title: "Marina",
        position: {
            lat: -16.484315,
            lng: 145.460206
        },
        marker: null,
        map: map,
        placeId: "4bb687672ea195217cd8ab2f",
        content: 'Rent a boat to go fishing in the Estuaries for $40 an hour. You can hire a grill for the boat too.'
    }, {
        title: "The Point",
        position: {
            lat: -16.482847,
            lng: 145.467855
        },
        marker: null,
        map: map,
        placeId: "4dc72cab7d8b14fb4655abc9",
        content: 'The place where all the post card pictures are taken'
    }, {
        title: "The Beach",
        position: {
            lat: -16.493202,
            lng: 145.467472
        },
        marker: null,
        map: map,
        placeId: "4b847c85f964a520493831e3",
        content: "Four Mile Beach, go paddle boarding, read a book, I don't know I'm not your mom"
    }

];

var Place = function(data) {
    this.title = ko.observable(data.title);
    this.placeId = data.placeId;
    this.position = data.position;
    this.map = data.map;
    this.content = data.content;
    this.marker = data.marker;
};

var ViewModel = function() {

    var self = this; //self always maps to ViewModel

    self.allPlaces = [];//init allPlaces array
    places.forEach(function(placeData) {//for each obj in places, create a new Place object and push that into allPlaces array
        self.allPlaces.push(new Place(placeData));
        });

    self.visiblePlaces = ko.observableArray([]);

    self.allPlaces.forEach(function(placeData) { //push allPlaces into visible places ko array
        self.visiblePlaces.push(placeData);
        });


    addNewMarkers();
    console.log(self.allPlaces);

    function addNewMarkers() {
     self.allPlaces.forEach(function(place) {
         var foursquareURL = 'https://api.foursquare.com/v2/venues/' + place.placeId + '?client_id=M2QLVQ4S0SIBXW3N0TVJZTBAOHXBIO0YZEOQKBPLUWWL3DMV&client_secret=WVJUWGQ01YKFCJLHEZQLXWOYMYIBUFJVSRXVRBW10EDKPAJK&v=20140806';
         $.ajax({
             url: foursquareURL,
             dataType: "json",
             jsonp: "callback",
             success: function(data) {
                     var name = data.response.venue.name;
                     var lat = data.response.venue.location.lat;
                     var lng = data.response.venue.location.lng;
                     var address = data.response.venue.location.formattedAddress[0];
                     /* create google marker obj*/
                     var markerPos = new google.maps.LatLng(lat, lng);
                     var marker = new google.maps.Marker({
                         position: markerPos,
                         map: map,
                         title: name,
                         animation: google.maps.Animation.DROP,
                     });
                     /* add marker to current place of allPlace array*/
                     place.marker = marker;
                     var infoWindow = new google.maps.InfoWindow({
                         content: name+ "<br>" + address
                     });
                     /* add infowindow*/
                     google.maps.event.addListener(marker, 'click', function(pointer, bubble) {
                         return function() {
                             bubble.open(map, pointer);
                         };
                     }(marker, infoWindow));
                     /* add bounce animation when clicked*/
                     (function(marker) { //nice closure
                         marker.addListener('click', toggleBounce);

                         function toggleBounce() {

                             if (marker.getAnimation() !== null) {
                                 marker.setAnimation(null);
                             } else {
                                 marker.setAnimation(google.maps.Animation.BOUNCE);
                                 setTimeout(function(){ marker.setAnimation(null); }, 750);
                             }
                         }
                 })(marker);
             },//end of success func
             error: function(){
                $('#error').css('visibility', 'visible');
             }
         });//end of ajax
     });//end of forEach loop
 }//end of addNewMarkers

    self.userInput = ko.observable('');
    /* filter markers on keydown in input area*/
    self.filterMarkers = function() {
        var searchInput = self.userInput().toLowerCase();
        /* remove all visible places*/
        self.visiblePlaces.removeAll();
        /* for each in allPlace, turn invisible unless title matches input*/
        self.allPlaces.forEach(function(place) {
            place.marker.setVisible(false);

            if (place.title().toLowerCase().indexOf(searchInput) !== -1) {
                self.visiblePlaces.push(place);
            }
        });


        self.visiblePlaces().forEach(function(place) {
            place.marker.setVisible(true);
        });
    };
/*links list click to map marker click*/
    self.listClick = function() {
        google.maps.event.trigger(this.marker, 'click');
    };

    //OpenWeatherMap API
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?id=2152681&appid=51bdd38ab0bc0b12282355d5e5f57c74";

    self.weatherMain = ko.observable();
    self.weatherDescription = ko.observable();
    self.temp = ko.observable();
    self.iconURL = ko.observable();

    $.getJSON(weatherURL, function(data) {
        self.weatherMain(data.weather[0].main);
        var description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1); //The JSON doesn't capitalize the first letter of the description, doing it here manually
       self.weatherDescription(description);
        var kelvin = data.main.temp; //JSON temp is given in Kelvin
        var temperature = kelvin * 9 / 5 - 459.67;
        self.temp(temperature.toFixed(1));//toFixed returns a string to a given decimal place
        var icon = data.weather[0].icon;
        var icoPath = "http://openweathermap.org/img/w/" + icon + ".png";
       self.iconURL(icoPath);

    }).error(function(e) {
        self.weatherMain("Weather Could Not Be Loaded, Sorry about that :(");
    });

};

var reportGoogleMapsIsNotResponding = function() {
        var h = document.createElement("H1"); // Create a <h1> element
        var errorMessage = document.createTextNode("Oh No! Google Maps isn't working right now!"); // Create a text node
        h.appendChild(errorMessage);

        var search = document.getElementById("search-list");
        row.insertBefore(h, search);
    };