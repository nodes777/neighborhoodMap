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
        content: 'Dougies!'
    }, {
        title: "Iron Bar",
        position: {
            lat: -16.481341,
            lng: 145.462643
        },
        map: map,
        content: 'Iron Bar'
    }, {
        title: "Marina",
        position: {
            lat: -16.484315,
            lng: 145.460206
        },
        map: map,
        content: 'Marina'
    }, {
        title: "The Point",
        position: {
            lat: -16.482847,
            lng: 145.467855
        },
        map: map,
        content: 'The Point'
    }, {
        title: "The Beach",
        position: {
            lat: -16.493202,
            lng: 145.467472
        },
        map: map,
        content: 'The Beach'
    }

]

var Place = function(data) {
    this.title = ko.observable(data.title);
    this.position = ko.observable(data.position);
    this.map = ko.observable(data.map);
    this.content = ko.observable(data.content)
    this.marker = data.marker;
}

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

    console.log(self.allPlaces);

    function addNewMarkers(markers, map, places) {
        var markersAmnt = markers.length;
        for (var i = 0; i < markersAmnt; i++) {
            var markerPos = new google.maps.LatLng(markers[i].position.lat, markers[i].position.lng);
            var marker = new google.maps.Marker({
                position: markerPos,
                map: map,
                title: markers[i].title,
                animation: google.maps.Animation.DROP,
            });
            places[i].marker = marker; // adds marker property to places js array. Very important

            var infoWindow = new google.maps.InfoWindow({
                content: markers[i].content
            });
            google.maps.event.addListener(marker, 'click', function(pointer, bubble) {
                return function() {
                    bubble.open(map, pointer);
                };
            }(marker, infoWindow));

            (function(marker) {
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
    var $weatherMain = $('#weatherMain');
    var $weatherDescription = $('#weatherDescription')
    var $temp = $('#temp')
    var $weatherDiv = $('#weather');
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?id=2152681&appid=51bdd38ab0bc0b12282355d5e5f57c74";
    $.getJSON( weatherURL, function( data )  {
        console.log(data);
        var weatherData = data.weather;
        var conditions = data.weather[0].main;
        var description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        var kelvin = data.main.temp;//JSON temp is given in Kelvin
        var temperature = kelvin * 9/5 - 459.67;
        console.log(weatherData);
        console.log(conditions);
        console.log(description);

        $weatherMain.text(conditions);
        $weatherDescription.text(description);
        $temp.text(temperature.toFixed(1))//toFixed returns a string to a given decimal place
}).error(function(e){
    $weatherText.text("Weather Could Not Be Loaded");
});

};
//51bdd38ab0bc0b12282355d5e5f57c74 openWeatherMap API key
//http://api.openweathermap.org/data/2.5/weather?id=2152681&appid=51bdd38ab0bc0b12282355d5e5f57c74 call for Port Douglas