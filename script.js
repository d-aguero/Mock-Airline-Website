var root_url = "http://comp426.cs.unc.edu:3001/";
let content = $('#content');
var first_name = 0;
var middle_name = 0;
var last_name = 0;
var age = 0;
var gender = 0;
var tickets;
let dep_airport = '';
let all_airpots = [];
let arr_airports = [];
let dep_airport_name;
var location = "Tampa International Airport";

$(document).ready(() => {

$('#login_btn').on('click', () => {

	let user = $('#user').val();
	let pass = $('#pass').val();

	console.log(user);
	console.log(pass);

	$.ajax(root_url + "sessions",
		{
		type: 'POST',
		xhrFields: {withCredentials: true},
		data: {
			user: {
			username: user,
			password: pass
			}
		},
		success: () => {
			$('#infopage_btn').prop('disabled', false);
		$('#booking_btn').prop('disabled', false);
		$('#tickets_btn').prop('disabled', false);
		$('#maps_btn').prop('disabled', false);
			build_infopage();
		},
		error: (jqxhr, status, error) => {
			alert(error);
		}
		});
	});


	
$('#infopage_btn').on('click', () => {build_infopage();});
$('#booking_btn').on('click', () => {build_booking();});
$('#tickets_btn').on('click', () => {
		let var1 = 0;
	let var2 = 0;
		build_tickets(var1, var2);
});
$('#maps_btn').on('click', () => {build_maps();});
});

// Page used to edit user's personal information (for tickets).
// Also serves as a homepage after login.
var build_infopage = function() {
	$('#content').empty();
	$('#content').append("<h2>Info</h2>");
	
	if (!first_name & !middle_name & !last_name & !age & !gender){
		$('#content').append('<p>Edit your personal information here.</p>');
		$('#content').append('<p id="info_paragraph">You are currently known as: </p>');
	} else {
			$('#content').append('<p>Edit your personal information here.</p>');
			$('#content').append('<p id="info_paragraph">You are currently known as: ' + first_name +' '+ middle_name +' '+ last_name +' | '+ age +' | '+ gender + '</p>');
	}
	
	$('#content').append('<textarea id="firstname" rows="1" cols="15" placeholder="First name"></textarea>')
	$('#content').append('<textarea id="middlename" rows="1" cols="15" placeholder="Middle name"></textarea>')
	$('#content').append('<textarea id="lastname" rows="1" cols="15" placeholder="Last name"></textarea>')
	$('#content').append('<textarea id="age" rows="1" cols="15" placeholder="Age"></textarea>')
	$('#content').append('<textarea id="gender" rows="1" cols="15" placeholder="Gender"></textarea>')
	$('#content').append('<br>')
	
	let send_info = $("<button>Submit</button>");
	$('#content').append(send_info);
	send_info.on('click', () => {
			first_name = $('#firstname').val();
		middle_name = $('#middlename').val();
				last_name = $('#lastname').val();
		age = $('#age').val();
		gender = $('#gender').val();
		$('#info_paragraph').html('You are currently known as: ' + first_name +' '+ middle_name +' '+ last_name +' | '+ age +' | '+ gender );
	});
}

var build_booking = function() {
	$('#content').empty();
	$('#content').append("<h2>Book a flight</h2><p id='current_ticket'></p>");
	
	// Menu used for user to specify what flight they want.
	// - User selects airport location to depart from; this updates next dropdown menu
	// - User selects airport location to arrive from; this populates the results div
	let queries = $("<div></div>");
	$('#content').append(queries);
	
	// Section used to display results that match user's specifications
	// Each result includes airline, departure date+time, and arrival.
	// Each result includes a button that, when pressed, sends info to create a ticket,
	// then redirects user to ticket page to view their ticket.
	let results = $("<div></div>");
	$('#content').append(results);
	
	let destination;
	let dest_dropdown = $('<select id="dep_selector"></select>');
	let dest_submit = $('<button id="dep_button">Submit</button>');
	$('#content').append('<p id="stage">Select Departing Airport: </p>');
	$('#content').append(dest_dropdown);
	$('#content').append(dest_submit);

	
	$.ajax(root_url + "airports",
	{
		type: 'GET',
		dataType: 'json',
		xhrFields: {withCredentials: true},
		success: (response) => {
			all_airports = response;
      
			for(var i = 0; i < all_airports.length; i++) {
				$('#dep_selector').append("<option value='"+all_airports[i].id+"'>" + all_airports[i].name + "</option>");
		}
		},
		error: (jqxhr, status, error) => {
			alert(error);
		}
		
	});

	$('#dep_button').on('click', () => {
		dep_airport += $('#dep_selector').val(); // select the id
		build_arrival();	
	});
	
	
	
}

// Builds the arrivals page after departure selected
let build_arrival = (function(){
	$('#content').empty();
	$('#content').append("<h2>Book a flight</h2><p id='current_ticket'></p>");
	$.ajax(root_url + "airports/"+dep_airport,
	{
		type: 'GET',
		dataType: 'json',
		xhrFields: {withCredentials: true},
		success: (response) => {
			dep_airport_name = response.name;
			$('#current_ticket').html('Departing From: ' + dep_airport_name);
	  }, error: (jqxhr, status, error) => {
			alert(error);
		}
	});
	
	$('#stage').html('Select Arriving Airport: ');
	let destination;
	let dest_dropdown = $('<select id="arr_selector"></select>');
	let dest_submit = $('<button id="arr_button">Submit</button>');
	$('#content').append('<p id="stage">Select Arriving Airport: </p>');
	$('#content').append(dest_dropdown);
	$('#content').append(dest_submit);

	$.ajax(root_url + "flights?filter[departure_id]="+dep_airport,
	{
		type: 'GET',
		dataType: 'json',
		xhrFields: {withCredentials: true},
		success: (response) => {
			flights = response;
			arrivals = []
			for(var i = 0; i < flights.length; i++) {
					arr_airports.push(flights[i].arrival_id);
			}
			for(var i=0; i<arr_airports.length;i++){
				list_arrivals(arr_airports[i]);
			}	
		},
		error: (jqxhr, status, error) => {
			alert(error);
		}
		
	});

	$('#arr_button').on('click', () => {
		arr_airport = $('#arr_selector').val();
		$.ajax(root_url + "airports/"+arr_airport,
		{
		type: 'GET',
		dataType: 'json',
		xhrFields: {withCredentials: true},
		success: (response) => {
			arr_airport_name = response.name;
			$('#current_ticket').append('<br><br>');
			$('#current_ticket').append('Arriving To: ' + arr_airport_name);
			$('#stage').empty();
			$('#stage').html("Choose an available flight date:<br><br><select id='date_selector'></select><button id='date_button'>Submit</button>");
			$('#arr_button').remove();
			$('#arr_selector').remove();
		}, error: (jqxhr, status, error) => {
			alert(error);
		}
	});
	});

});

let list_arrivals = function(arrival){
	$.ajax(root_url + "airports/"+arrival,
	{
		type: 'GET',
		dataType: 'json',
		xhrFields: {withCredentials: true},
		success: (response) => {
			$('#arr_selector').append("<option value='"+arrival+"'>" + response.name + "</option>");
		}
	});
}

// If user is being sent to this page because they just booked a flight, then:
// - inid = instance_id
// - itid = itinerary_id
// Page checks to see if these vars are passed with non-null values to pass a message.
var build_tickets = function(inid, itid) {
		$('#content').empty();
	if (!inid & !itid){
			$('#content').append("<h2>View your tickets</h2>");
	} else {
			$('#content').append("<h2>Successfully booked flight!</h2>");
	}
	
}

// Section used to contain Google Maps content.
// Uses Google Maps to look up locations of airport names in database.
var build_maps = function() {
	$('#content').empty();
  $('#content').append("<div id='map_header' class='general_div'></div>")
  
	$('#map_header').append("<h2>Maps</h2>");
  $('#map_header').append("<p>Curious about hotels or areas of interest close to your destination?</p>")
  $('#map_header').append("<p>Preview your airport and the surrounding area with the map tool below!</p>")
  let airports = $('<select id="airports"></select>');
	let airport_btn = $('<button id="airport_btn">Submit</button>');
  $('#map_header').append(airports);
	$('#map_header').append(airport_btn);
  
  $('#content').append("<br>")
  
  $.ajax(root_url + "airports",
	{
		type: 'GET',
		dataType: 'json',
		xhrFields: {withCredentials: true},
		success: (response) => {
    	var response_array = []
      for(var i = 0; i < response.length; i++) {
				response_array[i] = response[i].name;
			}
      response_array.sort();
      response_array = $.unique(response_array);
			for(i = 0; i < response_array.length; i++) {
				$('#airports').append("<option value='"+response_array[i]+"'>" + response_array[i] + "</option>");
			}
		},
		error: (jqxhr, status, error) => {alert(error);}
	});

	$('#airport_btn').on('click', () => {
		location = $('#airports').val(); // select the id
		build_maps();	
	});
  
  $('#content').append("<div id='map_container'></div>");
  $('#map_container').append("<h3>Currently viewing: '"+location+"'");
  $('#map_container').append('<div id="googleMap" style="width:100%;height:500px;"></div>');
$('#map_container').append('<script>function myMap() {var geocoder = new google.maps.Geocoder(); var map = new google.maps.Map(document.getElementById("googleMap"), {center: {lat: 0, lng: 0},zoom: 14});geocoder.geocode({"address": "'+location+'"}, function(results, status) {if (status === "OK") {map.setCenter(results[0].geometry.location);} else {alert("Geocode was not successful for the following reason: " + status);}});}');
$('#map_container').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkUOdZ5y7hMm0yrcCQoCvLwzdM6M8s5qk&callback=myMap">');
}
