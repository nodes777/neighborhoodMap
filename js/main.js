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
        content: 'Hello World!'
    }, {
        title: "Iron Bar",
        position: {
            lat: -16.481341,
            lng: 145.462643
        },
        map: map,
        content: 'Hello World!'
    }, {
        title: "Marina",
        position: {
            lat: -16.484315,
            lng: 145.460206
        },
        map: map,
        content: 'Hello World!'
    }, {
        title: "The Point",
        position: {
            lat: -16.482847,
            lng: 145.467855
        },
        map: map,
        content: 'Hello World!'
    }, {
        title: "The Beach",
        position: {
            lat: -16.493202,
            lng: 145.467472
        },
        map: map,
        content: 'Hello World!'
    }

]

var Place = function(data) {
    this.title = ko.observable(data.title);
    this.position = ko.observable(data.position);
    this.map = ko.observable(data.map);
    this.content = ko.observable(data.content)
    this.marker = null;
}

var ViewModel = function() {
    addNewMarkers(places, map, places);
    var self = this; //self always maps to ViewModel

     self.allPlaces = [];
      places.forEach(function(place) {
        self.allPlaces.push(new Place(place));
      });

    self.visiblePlaces = ko.observableArray();

 self.allPlaces.forEach(function(place) {//push allPlaces into visible places
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
            places[i].marker = marker;
            var infoWindow = new google.maps.InfoWindow({
                content: markers[i].content
            });
            google.maps.event.addListener(marker, 'click', function(pointer, bubble) {
                return function() {
                    bubble.open(map, pointer);
                };
            }(marker, infoWindow));

        }
    }



console.log(self.visiblePlaces);
self.userInput = ko.observable('');

  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    self.visiblePlaces.removeAll();

    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);

      if (place.title.toLowerCase().indexOf(searchInput) !== -1) {//how does indexOf work?
        self.visiblePlaces.push(place);
      }
    });


    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };


};