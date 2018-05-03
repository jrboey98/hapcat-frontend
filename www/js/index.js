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
var parsed;

// Handle the resume event
function onResume() {
    changeWelcomeText();
}

function onLoad() {
    changeWelcomeText();
    console.log(hour);
    init();
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


//Google Places

// Places API stuff starts right here 
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var data;
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

function getResults(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'test-data/test-suggestions.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null); 
}

function init() {
    //--------------For local data testing purposes---------------
    //getResults(function (response) {
    //    // Parse JSON string into object
    //    parsed = JSON.parse(response);
    //    data = parsed;
    //    generateCards();
    //});
    $.getJSON('https://hapcat.tenaisenma.com/api/v0/suggestions/', function (response) {
        data = response;
        generateCards();
    });
}

function generateTag(iteration, tag, colors, columnSplit, use) {
    var random = Math.floor((Math.random() * colors.length));
    var tag_color = colors[random];
    colors.splice(random, 1);
    if (tag) {
        return `
<div class="${use}_tag_column_div col-${columnSplit}">
    <div class="${use}_tag_div" style="background-color: ${tag_color};">
        <p class="${use}_tag_text">${tag.name}</p>
    </div>
</div>
`;
    }
    else {
        return `
<div class="${use}_tag_column_div col-${columnSplit}">
</div>
`;
    }
}

function generateCard(nodeSection, nodeId) {
    var columnSplit = 3;
    var use = "content";
    var colors = [
        "#D0B554",
        "#7D3988",
        "#D05754",
        "#337E7B"
    ]
    var node = data[nodeSection][nodeId];
    var numTags = node['tags'].length;
    var numShownTags = Math.min(3, numTags);
    var tags = "";
    for (var i = 0; i < numShownTags; i++) {
        tags += generateTag(i, data['tags'][node['tags'][i]], colors, columnSplit, use);
    }
    for (var i = numShownTags; i < 3; i++) {
        tags += generateTag(i, "", colors, columnSplit, use);
    }
    const contentCard = `
<div class="content_card" onClick="openNodeDetail('${nodeId}', '${nodeSection}')">
    <div class="content_name_photo">
        <div class="content_photo_div">
            <div class="content_name_div">
                <h4 class="content_name">${data[nodeSection][nodeId].name}</h4>
                <p class="content_datetime">Open Today from 4:00pm to 9:30pm</p>
            </div>
            <div class="content_distance_div">
                <h4 class="content_distance">2.6mi</h4>
            </div>
            <img src="${data[nodeSection][nodeId].photos[0]}" class="content_photo" />
        </div>
    </div>
    <div class="container">
        <div class="row">
            ${tags}
            <div class="col-3">
                <p class=" content_tag_text" style="font-size:1.5em;">. . .</p>
            </div>
        </div>
    </div>
</div>
`;
    return contentCard;
}

function getPlace(placeId) {
    for (var key in parsed) {
        if (parsed[key].placeId == placeId) {
            return parsed[key];
        }
    }
}

function generateCards() {
    //var returnedLocation = new Array();
    var generatedContent = "";
    for (var i in data['order']) {
        //returnedLocation.push = sampleData[key];
        var node = data['order'][i];
        generatedContent += generateCard(node['section'], node['id']);
    }
    //for (var i = 0; i < 20; i++){
    //    generatedContent += generateCard(returnedLocation);
    //}
    document.getElementById("generated_content").innerHTML = generatedContent;
}

function openNodeDetail(nodeId, nodeSection) {
    var messageText = "Opening node detail for " + data[nodeSection][nodeId].name;
    console.log(messageText);
    console.log(data[nodeSection][nodeId].name);
    constructModal(nodeId, nodeSection);
    $("#main").css("overflow", "hidden");
    $("#content").css("overflow", "hidden");
    $("#generated_content").css("overflow", "hidden");
    $("#app").css("overflow", "hidden");
}

function closeNodeDetail() {
    var modal = document.getElementById('nodeDetail');
    modal.style.display = "none";
    var messageText = "Closing node detail";
    console.log(messageText);
    $("#main").css("overflow", "scroll");
    $("#content").css("overflow", "scroll");
    $("#generated_content").css("overflow", "scroll");
    $("#app").css("overflow", "scroll");
}

function constructModal(nodeId, nodeSection) {
    var returnedLocation = getPlace(data[nodeSection][nodeId]);
    var columnSplit = 4;
    var use = "modal";
    var lorem = getLorem();
    var colors = [
        "#D0B554",
        "#7D3988",
        "#D05754",
        "#337E7B"
    ]
    var tags = "";
    var node = data[nodeSection][nodeId];
    var numTags = node['tags'].length;
    var numShownTags = Math.min(3, numTags);
    var tags = "";
    for (var i = 0; i < numShownTags; i++) {
        tags += generateTag(i, data['tags'][node['tags'][i]], colors, columnSplit, use);
    }
    for (var i = numShownTags; i < 3; i++) {
        tags += generateTag(i, "", colors, columnSplit, use);
    }
    var location;
    if (data[nodeSection] == 'event') {
        location = data[nodeSection][nodeId][location];
    } else {
        location = data[nodeSection][nodeId];
    }
    const modalHTML = `
<div id="nodeDetail" class="modal">
    <div class="modal_content">
        <div class="modal_name_photo">
            <div class="modal_photo_div">
                <div class="modal_name_div">
                    <h4 class="modal_name">${data[nodeSection][nodeId].name}</h4>
                    <p class="modal_paragraph">Open Today from 4:00pm to 9:30pm</p>
                </div>
                <div class="modal_weather_div">
                    <p class="modal_paragraph">Sunny</p>
                    <h3 class="modal_h3">78&#176;</h3>
                </div>
                <div class="modal_distance_div">
                    <h4 class="modal_distance">2.6mi</h4>
                </div>
                <img src="${data[nodeSection][nodeId].photos[0]}" class="modal_photo" />
            </div>
        </div>
        <div class="container">
            <div class="row">
                ${tags}
            </div>
        </div>
        <div class="modal_about">
            <p class="lato modal_paragraph">${location.address}</p>
            <p class="lato modal_paragraph">1741 Likes</p>
            <p class="lato modal_paragraph">24 Dislikes</p>
            <p class="lato modal_paragraph">Liked by you</p>
            <p class="lato modal_paragraph">Trending Now</p>
        </div>
        <div class="modal_description">
            <p class="lato modal_paragraph">${lorem}</p>
        </div>
    </div>
</div>
`;
    document.getElementById("node_detail_generation").innerHTML = modalHTML;
    // Get the modal
    var modal = document.getElementById('nodeDetail');
    modal.style.display = "block";
    hammer();
}

function hammer() {
    var card = $('.modal_content').hammer();
    console.log(card);
    card.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    card.on('panleft panright', dragCard);
    card.on('panend', dragEnd);
    //card.on('swiperight', swipeRight);
    //card.on('swipeleft', swipeLeft);

    console.log("Hammer called")
    var isDragging = false;
    var posX = 0;



    function dragCard(ev) {
        var elem = ev.target;
        console.log("DragCard entered");
        if (ev.gesture.velocityX >= 1 && ev.gesture.deltaX > 50) {
            swipeRight(ev);
        } else if (ev.gesture.velocityX <= -1 && ev.gesture.deltaX < -50) {
            swipeLeft(ev);
        }

        if (!isDragging && !ev.gesture.isFinal) {
            isdragging = true;
            console.log("Currently Dragging...");
            posX = ev.gesture.deltaX;
            elem.style.left = posX + "px";
        }
    }

    function swipeRight(ev) {
        if (posX >= 200) {
            console.log("Right");
            card.animate({ left: '500px' },
                {
                    complete: function () {
                        closeNodeDetail();
                    }
                });
        }
    }

    function swipeLeft(ev) {
        if (posX <= -200) {
            console.log("Left");
            card.animate({ left: '-500px' },
                {
                    complete: function () {
                        closeNodeDetail();
                    }
                });
        }
    }

    function dragEnd(ev) {
        isDragging = false;
        console.log("Dragging Completed.")
        console.log("dragEnd posX: " + posX);
        //if (posX >= 150 || posX <= -150) {
        //    offScreen(ev);
        //}
        ev.target.style.left = "0px";
        posX = 0;
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == $("#nodeDetail")) {
        $("#nodeDetail").style.display = "none";
    }
}

function getLorem() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}




app.initialize();
