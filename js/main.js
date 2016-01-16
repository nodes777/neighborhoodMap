var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -16.4936, lng: 145.4653},
    zoom: 14
  });
addNewMarkers(model, map);
}

var model = [
	{
		title: "Dougies",
	    position: {lat: -16.495539, lng: 145.462699},
	    map: map,
	    content: 'Hello World!'
	},
	{
		title: "Iron Bar",
	    position: {lat: -16.481341, lng: 145.462643},
	    map: map,
	    content: 'Hello World!'
	},
	{
		title: "Marina",
	    position: {lat: -16.484315, lng: 145.460206},
	    map: map,
	    content: 'Hello World!'
	},
	{
		title: "The Point",
	    position: {lat: -16.482847, lng: 145.467855},
	    map: map,
	    content: 'Hello World!'
	},
	{
		title: "The Beach",
	    position: {lat: -16.493202, lng: 145.467472},
	    map: map,
	    content: 'Hello World!'
	}

]

function addNewMarkers (markers, map) {
	var markersAmnt = markers.length;
	for ( var i = 0; i < markersAmnt; i++ ) {
		var markerPos = new google.maps.LatLng( markers[i].position.lat, markers[i].position.lng );
		markers[i].marker = new google.maps.Marker({
			position: markerPos,
			map: map,
			title: markers[i].title,
		});
		var infoWindow = new google.maps.InfoWindow({
			content: markers[i].content
		});
	}
}
