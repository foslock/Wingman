var fieldscorner = new google.maps.LatLng(42.300093,-71.061667);
var myOptions = {
	zoom: 6, // The larger the zoom number, the bigger the zoom
	center: fieldscorner,	// center south station while your location loads
	mapTypeId: google.maps.MapTypeId.HYBRID
	};
var map;
var myLat = 0;
var myLng = 0;
var myLoc = new google.maps.LatLng(0,0);
var request = new XMLHttpRequest();

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

function geo(){ //draw the map
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

function findnearbyplanes(){

	if (navigator.geolocation) {
		document.getElementById("status").innerHTML = "Attempting geolocation <br/>";
		navigator.geolocation.getCurrentPosition(function(position) {
			document.getElementById("status").innerHTML += "Found you<br/>";
			geolat = position.coords.latitude;
			geolng = position.coords.longitude;
			geoloc = position.coords.latitude;
			
			myLoc = new google.maps.LatLng(geolat,geolng);
			map.setCenter(myLoc);
			meMarker = new google.maps.Marker({
				position: myLoc,
			});
			meMarker.setMap(map);

			// now search for nearby planes, sending longitude and latitude as args
			// to a get request that respons with json planes
			
			//change this to wingmanapi.herokuapp whatever

			var url = "http://wingmanapi.herokuapp.com/api/nearbyplanes?latitude=" + myLoc.lat() + "&longitude=" + myLoc.lng() + "&token=" + logged_user.token;
			console.log(url);
			$.get(url, function(data){ 
				// data comes back as an array of flight strings
				if (JSON.stringify(data).indexOf('flight') == -1){ //if theres no substring flight, no flights found
					document.getElementById("status").innerHTML += "Cound not find any flights around you";
				}
				else{
					// now split results into array of strings of flights
					jsondata = data;
						
					// now remove duplicate flights from the list; they sometimes show up twice
					cleanjsondata = [];
					$.each(jsondata, function(i, el){
						if($.inArray(el, cleanjsondata) === -1) cleanjsondata.push(el);
					});

					document.getElementById("status").innerHTML += "These planes are near you: <br/>";
					
					//put all nearby planes in a drop down form
					formstring = "<form action=''><select name='flights'>";
					for (var j = 0; j < cleanjsondata.length; j++){
						var formoption = "<option value = '" + cleanjsondata[j] + "'>" + cleanjsondata[j] + "</option>";     
						formstring += formoption;
					}
					formstring += "</select></form>";
					document.getElementById("status").innerHTML += formstring;
					
				}
			}).done(function(data) {
				console.log(data);
			});			
		});	
	}
	else {
		document.getElementById("status").innerHTML = "Geolocation not supported";
	}
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

function addflight(){
	var paramobj = new Object;
	paramobj.token = logged_user.token;
	flight = prompt("flight ex american airlines flight 123");
	if (flight != null && flight != ""){
		flight = encodeHTML(flight);
		// now convert spaces to +
		flight = flight.replace(/ /g, "+");
		console.log(flight);
		paramobj.flight = flight;
		$.post("http://wingmanapi.herokuapp.com/api/user/addflight", paramobj);	
	}
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 


