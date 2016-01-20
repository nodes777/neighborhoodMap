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

var markers = [{
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

var Marker = function(data) {
    this.title = ko.observable(data.title);
    this.position = ko.observable(data.position);
    this.map = ko.observable(data.map);
    this.content = ko.observable(data.content)
}

var ViewModel = function() {
    addNewMarkers(markers, map);
    addSearchBox(map);
    var self = this; //self always maps to ViewModel
    self.markerList = ko.observableArray([]);


    markers.forEach(function(markerItem) { // pushes items into observableArray
        self.markerList.push(new Marker(markerItem));
    });
    console.log(markerList);

    self.query = ko.observable(''); // instead of "var query = ko.observable('');"

    function addNewMarkers(markers, map) {
        var markersAmnt = markers.length;
        for (var i = 0; i < markersAmnt; i++) {
            var markerPos = new google.maps.LatLng(markers[i].position.lat, markers[i].position.lng);
            var marker = new google.maps.Marker({
                position: markerPos,
                map: map,
                title: markers[i].title,
                animation: google.maps.Animation.DROP,
            });
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

    function addSearchBox(map) {
        var searchBox = new google.maps.places.SearchBox(document.getElementById('search'));
        //place change event on search box
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();
            var bounds = new google.maps.LatLngBounds();
            console.log(searchBox.getPlaces());
            if (places.length == 0) {
                return;
            }

        })
    }

};