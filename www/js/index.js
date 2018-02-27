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

function getResults(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../../sampleJson/sample.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null); 
}

function init() {
    getResults(function (response) {
        // Parse JSON string into object
        console.log(response);
        var parsed = JSON.parse(response);
        generateCards(parsed);
    });
}

function generateTag(iteration, returnedLocation) {
    console.log(returnedLocation);
    return `
<div class="col-3">
    <div class="content_tag_div">
        <p class="content_tag_text">${returnedLocation.types[iteration]}</p>
    </div>
</div>
`;
}

function generateCard(returnedLocation) {
    var tags = "";
    for (var i = 0; i < 3; i++) {
        tags += generateTag(i, returnedLocation);
    }
    const contentCard = `
<div class="content_card">
    <div class="content_name_photo">
        <div class="content_photo_div">
            <div class="content_name_div">
                <h4 class="content_name">${returnedLocation.name}</h4>
            </div>
            <div class="content_distance_div">
                <h4 class="content_distance">2.6mi</h4>
            </div>
            <img src="${returnedLocation.photo}" class="content_photo" />
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
    console.log(contentCard);
    return contentCard;
}

function generateCards(parsed) {
    //var returnedLocation = new Array();
    var generatedContent = "";
    for (var key in parsed) {
        //returnedLocation.push = sampleData[key];
        console.log(parsed[key]);
        generatedContent += generateCard(parsed[key]);
    }
    //for (var i = 0; i < 20; i++){
    //    generatedContent += generateCard(returnedLocation);
    //}
    document.getElementById("generated_content").innerHTML = generatedContent;
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