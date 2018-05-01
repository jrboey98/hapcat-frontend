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

//Global variables

// Handle the resume event
function onResume() {
}

function onLoad() {
    showDatePicker();
}

function showDatePicker() {
    var options = {
        date: new Date(),
        mode: 'date'
    };

    function onSuccess(date) {
        alert('Selected date: ' + date);
    }

    function onError(error) { // Android only 
        alert('Error: ' + error);
    }

    datePicker.show(options, onSuccess, onError);
}


function validate() {
    console.log("validate called")
    var password = document.forms['registration_form'][2].value;
    var confPassword = document.forms['registration_form'][3].value;
    if (password.length < 6) {
        document.getElementById("password_length_alert").style.display = "block";
        return;
    } else {
        document.getElementById("password_length_alert").style.display = "none";
    }
    if (password != confPassword) {
        document.getElementById("password_match_alert").style.display = "block"
        return;
    } else {
        document.getElementById("password_match_alert").style.display = "none"
    }
    var user = {
        username: document.forms['registration_form'][0].value,
        email: document.forms['registration_form'][1].value,
        password: document.forms['registration_form'][2].value,
        date_of_birth: document.forms['registration_form'][4].value
    }

    $.post("http://hapcat.tenaisenma.com:8080/api/v0/registration/",
        user,
        function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
            console.log(data);
        });
    if (/*PSEUDO: response returns username is already taken*/false) {
        document.getElementById("username_alert").style.display = "block";
    } else {
        document.getElementById("username_alert").style.display = "none";
    }
}

