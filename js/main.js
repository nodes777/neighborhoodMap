var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -16.4936, lng: 145.4653},
    zoom: 14
  });
}

var model = [
	{
		name: "Dougies",
	    position: {lat: -16.495539, lng: 145.462699},
	    map: map,
	    title: 'Hello World!'
	},
	{
		name: "Iron Bar",
	    position: {lat: -16.481341, lng: 145.462643},
	    map: map,
	    title: 'Hello World!'
	},
	{
		name: "Marina",
	    position: {lat: -16.484315, lng: 145.460206},
	    map: map,
	    title: 'Hello World!'
	},
	{
		name: "The Point",
	    position: {lat: -16.482847, lng: 145.467855},
	    map: map,
	    title: 'Hello World!'
	},
	{
		name: "The Beach",
	    position: {lat: -16.493202, lng: 145.467472},
	    map: map,
	    title: 'Hello World!'
	}

]