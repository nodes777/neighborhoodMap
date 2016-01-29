var map;
var CLIENT_ID = "M2QLVQ4S0SIBXW3N0TVJZTBAOHXBIO0YZEOQKBPLUWWL3DMV";
var CLIENT_SECRET = "WVJUWGQ01YKFCJLHEZQLXWOYMYIBUFJVSRXVRBW10EDKPAJK";


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
        placeId: "ChIJhQF9mcSngmkRUy9GSdF0ULA",
        content: 'Home base for backpackers. A comfortable friendly place to lay your head.'
    }, {
        title: "Iron Bar",
        position: {
            lat: -16.481341,
            lng: 145.462643
        },
        map: map,
        placeId: "ChIJySELinaogmkRMCSNz9OsHfw",
        content: "The only bar in town open after midnight. You'll end up here"
    }, {
        title: "Marina",
        position: {
            lat: -16.484315,
            lng: 145.460206
        },
        map: map,
        placeId: "ChIJ34AbhNingmkR2A0tV7JObX4",
        content: 'Rent a boat to go fishing in the Estuaries for $40 an hour. You can hire a grill for the boat too.'
    }, {
        title: "The Point",
        position: {
            lat: -16.482847,
            lng: 145.467855
        },
        map: map,
        placeId: "ChIJKww3InWogmkRKNm0x-qauog",
        content: 'The place where all the post card pictures are taken'
    }, {
        title: "The Beach",
        position: {
            lat: -16.493202,
            lng: 145.467472
        },
        map: map,
        placeId: "ChIJz3klot2ngmkRwQ8Uv2_xsHQ",
        content: "Four Mile Beach, go paddle boarding, read a book, I don't know I'm not your mom"
    }

];

var Place = function(data) {
    this.title = ko.observable(data.title);
    this.position = ko.observable(data.position);
    this.map = ko.observable(data.map);
    this.content = ko.observable(data.content);
    this.marker = data.marker;
};

var ViewModel = function() {
    addNewMarkers(places, map, places);
    var self = this; //self always maps to ViewModel

    self.allPlaces = [];
    places.forEach(function(place) {
        self.allPlaces.push(new Place(place));
    });

    self.visiblePlaces = ko.observableArray();

    self.allPlaces.forEach(function(place) { //push allPlaces into visible places
        self.visiblePlaces.push(place);
    });


    function addNewMarkers(markers, map, places) {
        var markersAmnt = markers.length;
        for (var i = 0; i < markersAmnt; i++) {
        var placesURL = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ places[i].placeId +"&key=AIzaSyB5m4FwYzZ7tHxkhWW8-DdRIw3Gi0tfweM";
        $.ajax({
            url: placesURL,
            dataType: "jsonp",
            success: function(data){
            var result = data.result;
            var address = formatted_address;
            console.log(address);
    }
})




            var markerPos = new google.maps.LatLng(markers[i].position.lat, markers[i].position.lng);
            var marker = new google.maps.Marker({
                position: markerPos,
                map: map,
                title: markers[i].title,
                animation: google.maps.Animation.DROP,
            });
            places[i].marker = marker; // adds marker property to places js array. Very important for access later

            var infoWindow = new google.maps.InfoWindow({
                content: markers[i].content
            });
            //Opens infoWindow
            google.maps.event.addListener(marker, 'click', function(pointer, bubble) {
                return function() {
                    bubble.open(map, pointer);
                };
            }(marker, infoWindow));


            //Places API details
            
            (function(marker) { //nice closure
                marker.addListener('click', toggleBounce);

                function toggleBounce() {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }


            })(marker);
        }
    }


    self.userInput = ko.observable('');

    self.filterMarkers = function() {
        var searchInput = self.userInput().toLowerCase();

        self.visiblePlaces.removeAll();

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

    self.listClick = function() { //links list click to map marker click
        google.maps.event.trigger(this.marker, 'click');
    };

    //OpenWeatherMap API
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?id=2152681&appid=51bdd38ab0bc0b12282355d5e5f57c74";

self.weatherMain = ko.observable();
    self.weatherDescription = ko.observable();
    self.temp = ko.observable();
    self.iconURL = ko.observable();

    $.getJSON(weatherURL, function(data) {
        console.log(data);
        var weatherData = data.weather;
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
        //var $map = $('#map');
        //$map.text("Oh No! Google Maps isn't working right now!");
        var h = document.createElement("H1"); // Create a <h1> element
        var errorMessage = document.createTextNode("Oh No! Google Maps isn't working right now!"); // Create a text node
        h.appendChild(errorMessage);

        var search = document.getElementById("search-list");
        row.insertBefore(h, search);
    };