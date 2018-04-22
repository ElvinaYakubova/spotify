// import css from '../styles/popup.css';
require("../styles/popup.css");
require("../styles/controlPanel.css");
require("../styles/common.css");


'use strict';

var prevName = '';


(function ()
{
    var _window = window;

    function initPopup(arg)
    {
        console.log(chrome.extension.getBackgroundPage());
        _window.bgWindow = chrome.extension.getBackgroundPage();

        //listeners
        let shuffleState = false;
        let repeatState = 'off';

        let status = '';

        chrome.runtime.sendMessage({command: "loader"});
        // chrome.runtime.sendMessage({command: "track"});
        changeIcon();

        document.getElementById("play").addEventListener("click", function() {
            console.log(status);
            let name = document.getElementById("play");
            let currentClass = document.getElementById("play").classList;
            if (currentClass.contains('fa-play-circle-o')) {
                if (status == 'play') {
                    chrome.runtime.sendMessage({command: "update"});
                    status = '';
                }
                else {
                    status = 'play';
                }
                console.log('play ', status);
                // name.classList.remove('fa-play-circle-o');
                // name.classList.add('fa-pause-circle-o');
                chrome.runtime.sendMessage({command: "play"});
            }
            else {

                if (status == 'pause') {
                    chrome.runtime.sendMessage({command: "update"});
                    status = '';
                }
                else {
                    status = 'pause';
                }
                console.log('pause ', status);
                // name.classList.remove('fa-pause-circle-o');
                // name.classList.add('fa-play-circle-o');
                chrome.runtime.sendMessage({command: "pause"});
            }
        });
        document.getElementById("prev").addEventListener("click", function(){
            let name = document.getElementById("play");
            name.className = 'control-panel__button fa fa-pause-circle-o';
            chrome.runtime.sendMessage({command: "prev"});
            status = '';
        });
        document.getElementById("next").addEventListener("click", function(){
            let name = document.getElementById("play");
            name.className = 'control-panel__button fa fa-pause-circle-o';
            chrome.runtime.sendMessage({command: "next"});
            status = '';
        });
        document.getElementById("shuffle").addEventListener("click", function(){
            let name = document.getElementById("shuffle");
            let currentClass = name.classList;
            if (currentClass.contains('disable')) {
                name.classList.remove('disable');
                name.classList.add('active');
                // chrome.runtime.sendMessage({command: "play"});
            }
            else {
                name.classList.remove('active');
                name.classList.add('disable');
            }
            shuffleState = !shuffleState;
            chrome.runtime.sendMessage({command: "shuffle", state: shuffleState});
            status = '';
        });
        document.getElementById("repeat").addEventListener("click", function(){
            let name = document.getElementById("repeat");
            let currentClass = name.classList;
            if (currentClass.contains('disable')) {
                name.classList.remove('disable');
                name.classList.add('active');
                // chrome.runtime.sendMessage({command: "play"});
            }
            else {
                name.classList.remove('active');
                name.classList.add('disable');
            }
            repeatState == 'off' ? repeatState = 'track' : repeatState = 'off';
            chrome.runtime.sendMessage({command: "repeat", state: repeatState});
            status = '';
        });


        //listen messages from bg
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            switch(message.command) {
                case "updateInfo":
                    updateTitle(message.data.name);
                    let singers = '';
                    for (var i in message.data.artists) {
                        i == 0 ? singers += message.data.artists[i].name : singers += ', ' + message.data.artists[i].name;
                    }
                    updateSinger(singers);
                    updateCover(message.data.album.images[0].url, singers + ' : ' + message.data.name);
                    updateStatus(message.status, message.duration);

                    document.getElementById('player').style.display = 'block';
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('message').style.display = 'none';
                    document.getElementById('play').style.display = 'block';
                    document.getElementById('play').classList.remove('loading');
                    //updateDuration(message.duration);
                    break;
                case "initControlPanel":
                    document.getElementById('player').style.display = 'block';
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('message').style.display = 'none';
                    document.getElementById('play').style.display = 'block';
                    // document.getElementById('play').classList.remove('loading');
                    break;
                case "login":
                    document.getElementById('login').style.display = 'block';
                    document.getElementById('player').style.display = 'none';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('message').style.display = 'none';
                    document.getElementById('play').classList.remove('loading');
                    break;
                case "choosePlaylist":
                    document.getElementById('message').style.display = 'block';
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('player').style.display = 'none';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('play').classList.remove('loading');
                    break;
                case "loader":
                    document.getElementById('loader').style.display = 'block';
                    document.getElementById('message').style.display = 'none';
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('player').style.display = 'none';
                    document.getElementById('play').classList.remove('loading');
                    break;
                case "updatePage":
                    document.getElementById('play').classList.add('loading');
                    break;
            }
            return true;
        });

    }
    initPopup();
})();


function updateTitle(value) {
    prevName = value;
    document.getElementById("track").innerHTML = value;
}

function updateSinger(value) {
    document.getElementById("singer").innerHTML = value;
}

function updateCover(url, title) {
    document.getElementById("cover").src = url;
    document.getElementById("cover-large").src = url;
    document.getElementById("cover").title = title;
}

function updateStatus(value, duration) {
    let name = document.getElementById("play");
    if (value) {
        name.classList.remove('fa-play-circle-o');
        name.classList.add('fa-pause-circle-o');
        //temp variable
        let startPos = {
            seconds: 0,
            minutes: 0
        };
        // updateTime(startPos, duration);
    }
    else {
        name.classList.remove('fa-pause-circle-o');
        name.classList.add('fa-play-circle-o');
    }
}

function updateDuration(value) {
    document.getElementById("duration").innerHTML = value;
}

function updateTime(value, duration) {
    setInterval(
        function () {
            let minutes = value.minutes;
            let seconds = (value.seconds < 10) ? "0" + value.seconds : value.seconds;
            let str = minutes + ":" + seconds;
            document.getElementById("startTime").innerHTML = str;
            // 100% = duration
            // ? px = currentTime

            // document.getElementById("timeline").style.width =
            // document.getElementById("slider").style.left =
            value.seconds++;
            if (value.seconds == 60) {
                values.minutes++;
                value.seconds = 0;
            }
        }, 1000);
}

(function main() {
    var port = chrome.runtime.connect({name: "popupConnect"});
    port.onMessage.addListener(function(msg) {
    });
    // SpotifyControl.init();
})();

function changeIcon() {
    chrome.browserAction.setIcon({
        path: 'img/spotify.png'
    });
    chrome.browserAction.setBadgeBackgroundColor({color: '#1ed760'});
}





