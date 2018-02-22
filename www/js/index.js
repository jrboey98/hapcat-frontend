/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume", onResume, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

    },

    

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//Global variables
var currentdate = new Date();
var hour = currentdate.getHours();

// Handle the resume event
function onResume() {
    changeWelcomeText();
}

function onLoad() {
    changeWelcomeText();
    console.log(hour);
}

function changeWelcomeText() {
    var welcomeText = new String();
    var timeOfDay = new String();
    if ((hour > 21 && hour <= 24) || (hour >= 0 && hour <= 4)) {
        welcomeText = "Ready for a night out?";
        timeOfDay = "Good Evening, ";
    } else if (hour > 4 && hour < 12) {
        welcomeText = "Ready for breakfast?";
        timeOfDay = "Good Morning, ";
    } else if (hour >= 12 && hour <= 15) {
        welcomeText = "Ready for lunch?";
        timeOfDay = "Good Afternoon, ";
    } else if (hour > 15 && hour <= 21) {
        welcomeText = "Ready for dinner?";
        timeOfDay = "Good Evening, ";
    } else {
        welcomeText = "Ready for some fun?";
        timeOfDay = "Hello, ";
    }

    document.getElementById("welcome_text").innerHTML = welcomeText;
    document.getElementById("time_of_day").innerHTML = timeOfDay + "User!"; //hardcoded username, replace with actual username when auth set up
    

}


//Places API stuff starts right here 
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var newplace = 'university';
var place;

/*
function searchTest() {
    newplace = document.getElementById('myText').value;

    initMap();

}
*/

//gets user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initPlace);
        initMap();
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//sets search location to user location
function initPlace(position) {
    place = { lat: position.coords.latitude, lng: position.coords.longitude };
}



function initMap() {

    //set current place
    map = new google.maps.Map(document.getElementById('map'), {
        center: place,
        zoom: 15
    });

    //create map
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: place,
        radius: 500,
        //add type here to filter by type
    }, callback);
}

//results found here in results array
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }

        //create a string of name, types & address
        placeList = results[0].name + ";       " + results[0].types + ": " + results[0].formatted_address;
        document.getElementById('output').innerHTML = placeList;
        //get photo
        var photos = results[0].photos;
        if (photos) { pic = photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 }); }

        placeList = results[1].name + ";       " + results[1].types + ": " + results[1].formatted_address;
        document.getElementById('output2').innerHTML = placeList;
        photos = results[1].photos;
        if (photos) { var pic2 = photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 }); }

        placeList = results[2].name + ";       " + results[2].types + ": " + results[2].formatted_address;
        document.getElementById('output3').innerHTML = placeList;
        photos = results[2].photos;
        if (photos) { var pic3 = photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 }); }

        //send photos to html
        document.getElementById('placeOut').src = pic;
        document.getElementById('placeOut2').src = pic2;
        document.getElementById('placeOut3').src = pic3;
    }
}
//end places stuff


//marks places in map don't worry about this stuff
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

/*
 * Replace all SVG images with inline SVG
 */
//jQuery('img.svg').each(function () {
//    var $img = jQuery(this);
//    var imgID = $img.attr('id');
//    var imgClass = $img.attr('class');
//    var imgURL = $img.attr('src');

//    jQuery.get(imgURL, function (data) {
//        // Get the SVG tag, ignore the rest
//        var $svg = jQuery(data).find('svg');

//        // Add replaced image's ID to the new SVG
//        if (typeof imgID !== 'undefined') {
//            $svg = $svg.attr('id', imgID);
//        }
//        // Add replaced image's classes to the new SVG
//        if (typeof imgClass !== 'undefined') {
//            $svg = $svg.attr('class', imgClass + ' replaced-svg');
//        }

//        // Remove any invalid XML tags as per http://validator.w3.org
//        $svg = $svg.removeAttr('xmlns:a');

//        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
//        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
//            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
//        }

//        // Replace image with new SVG
//        $img.replaceWith($svg);

//    }, 'xml');

//});

app.initialize();