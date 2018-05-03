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
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume", onResume, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');

    },



    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function onResume() {
}

function onLoad() {
    getData();
}

function getResults(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'test-data/sample-data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var data;
var tempNumber = 0;

function getData() {
    $.getJSON('https://hapcat.tenaisenma.com/api/v0/suggestions', function (response) {
        data = response;
        init();
    });
}

function init() {
    //--------------For local data testing purposes---------------
    //getResults(function (response) {
    //    // Parse JSON string into object
    //    parsed = JSON.parse(response);
    //    data = parsed;
    //    var node = data['order'][0];
    //    constructCard(node['section'], node['id']);
    //    constructStackCards();
    //    hammer();
    //});
    
    if (tempNumber % 13 == 0) {
        tempNumber = 0;
    }
    var node = data['order'][tempNumber];
    constructCard(node['section'], node['id']);
    constructStackCards()
    hammer();
    tempNumber++;
    //$("#node_detail").animate({ "opacity": 1 });

}

function constructStackCards() {
    var html =`<div id="card_2" class="card_2 blank_card"></div>
        <div id="card_3" class="card_3 blank_card"></div>
        <div id="card_4" class="card_4 blank_card"></div>`

    document.getElementById("node_detail_generation").innerHTML += html;
    //$("#card_2").animate({ "opacity": 1 });
    //$("#card_3").animate({ "opacity": 1 });

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

function constructCard(nodeSection, nodeId) {
    var columnSplit = 4;
    var use = "card";
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
    const cardHTML = `
<div id="node_detail" class="card">
    <div id="content" class="card_content">
        <div class="card_name_photo">
            <div class="card_photo_div">
                <div class="card_name_div">
                    <h4 class="card_name">${data[nodeSection][nodeId].name}</h4>
                    <p class="card_paragraph">You were here Last Saturday from 2:13PM to 7:36PM</p>
                </div>
                <div class="card_weather_div">
                    <p class="card_paragraph">Sunny</p>
                    <h3 class="card_h3">78&#176;</h3>
                </div>
                <div class="card_distance_div">
                    <h4 class="card_distance">2.6mi</h4>
                </div>
                <img src="${data[nodeSection][nodeId].photos[0]}" class="card_photo" />
            </div>
        </div>
        <div class="container">
            <div class="row">
                ${tags}
            </div>
        </div>
        <div class="card_about">
            <p class="lato card_paragraph">${location.address}</p>
            <p class="lato card_paragraph">1741 Likes</p>
            <p class="lato card_paragraph">24 Dislikes</p>
            <p class="lato card_paragraph">Liked by you</p>
            <p class="lato card_paragraph">Trending Now</p>
        </div>
        <div class="card_description">
            <p class="lato card_paragraph">${lorem}</p>
        </div>
    </div>
</div>
`;
    
    document.getElementById("node_detail_generation").innerHTML = cardHTML;
    // Get the card
   
}

function getLorem() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}

//hammer.js functions

function hammer() {
    var card = $('#content').hammer();
    card.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    card.on('panleft panright', dragCard);
    card.on('panend', dragEnd);
    var isSwiped = false;
    //card.on('swiperight', swipeRight);
    //card.on('swipeleft', swipeLeft);

    
    var isDragging = false;
    var posX = 0;

    

    function dragCard(ev) {
        var elem = ev.target;
        if (ev.gesture.velocityX >= 2 && ev.gesture.deltaX > 50) {
            vote("right");
            swipeRight(ev);
        } else if (ev.gesture.velocityX <= -2 && ev.gesture.deltaX < 50) {
            vote("left");
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
        if (!isSwiped && posX >= 200) {
            isSwiped = true;
            console.log("Right");
            card.animate({ left: '500px' },
                {
                    complete: function () {
                        ev.target.parentNode.remove();
                        transition();
                    }
                });
        }
    }

    function swipeLeft(ev) {
        if (!isSwiped && posX <= -200) {
            isSwiped = true;
            console.log("Left");
            card.animate({ left: '-500px' },
                {
                    complete: function () {
                        ev.target.parentNode.remove();
                        transition();
                    }
                });
        }
    }

    //function offScreen(ev) {
    //    console.log("Offscreen called")
    //    var id = setInterval(frame, 1);
    //    var elem = ev.target
    //    var parent = elem.parentElement;
    //    function frame() {
    //        if (posX > 400 || posX < -400) {
    //            clearInterval(id);
    //            console.log("Entered removal");
    //            parent.removeChild(ev.target);
    //            card.off('panleft panright', dragCard);
    //            card.off('panend', dragEnd);
               
    //        } else if (posX >= 150) {
    //            console.log("Entered right move");
    //            posX += 2;
    //            ev.target.style.left = posX + "px";
    //        } else if (posX <= -150) {
    //            console.log("Entered left move");
    //            posX -= 2;
    //            ev.target.style.left = posX + "px";
    //        } 
    //    }
    //}
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

function transition() {
    console.log("transition");

    $("#card_2").toggleClass('card_2_animate');

    $("#card_2").animate({
        "z-index": 8,
        "opacity": 1,
        "position": "relative",
        "width": "85%",
        "border-radius": "25px",
        "height": "76vh",
        margin: "14.25vh auto 9vh auto"
    },
        function() {
            console.log("async called")
            init();
        });

    $("#card_3").toggleClass('card_3_animate');

    $("#card_3").animate({
        "z-index": 7,
        "opacity": 0.9,
        "width": "75%",
        "border-radius": "23px",
        "height": "76vh",
        "background-color": "#7D3988",
        margin: "11.5vh auto"
    },
        function () {
            console.log("async called")
        });

    $("#card_4").animate({
        "z-index": 6,
        "opacity": 0.5,
        "width": "68%",
        "border-radius": "21px",
        "height": "76vh",
        margin: "9.5vh auto"
    },
        function () {
            console.log("async called")
        });



}

function vote(direction) {
    var voteResult = {
        swipe: direction//,
        //node: data[nodeSection][nodeId]
    }
    $.post("http://hapcat.tenaisenma.com:8080/api/v0/voting/",
        voteResult,
        function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
            console.log(data);
        });
}





app.initialize();
