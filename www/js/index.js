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
    if ((hour > 21 && hour <= 24) || (hour >= 0 && hour <= 4)) {
        welcomeText = "Ready for a night out?"
    } else if (hour > 4 && hour <= 11) {
        welcomeText = "Ready for breakfast?"
    } else if (hour > 11 && hour <= 15) {
        welcomeText = "Ready for lunch?"
    } else if (hour > 15 && hour <= 21) {
        welcomeText = "Ready for dinner?"
    } else {
        welcomeText = "Ready for some fun?"
    }

    document.getElementById("welcome_text").innerHTML = welcomeText;

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