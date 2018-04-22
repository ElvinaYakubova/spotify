import {Token} from './token.js';
import {Auth} from './auth.js';
import {SpotifyControl} from './control.js';

//initialize authentication, then initialize spotifyControl
var token = new Token();
var auth = new Auth();
var spotifyControl = new SpotifyControl();
//watching cookies with token and init spotify controller
auth.listen(token, spotifyControl);

// setInterval(function() {
//     auth.validToken();
//     auth.openHomeTab();
//     // This will be executed every 5 seconds
// }, 5000);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (watchTab()) {
        switch (request.command) {
            case "play":
                console.log("play ", val);
                spotifyControl.request.StartResume().then(val => {
                        console.log("play ", val);
                        updateTrackInfo(0);
                    }
                );
                break;
            case "pause":
                console.log("pause ", val);
                spotifyControl.request.PausePlayback().then(val => {
                        updateTrackInfo(0);
                    }
                );
                break;
            case "prev":
                spotifyControl.request.prevTrack().then(val => {
                        console.log("prev ", val);
                        updateTrackInfo(0);
                    }
                );
                break;
            case "next":
                spotifyControl.request.nextTrack().then(val => {
                        console.log("next ", val);
                        updateTrackInfo(0);
                    }
                );
                break;
            case "shuffle":
                spotifyControl.request.shuffleTracks(request.state);
                break;
            case "repeat":
                spotifyControl.request.repeatTrack(request.state);
                break;
            case "track":
                updateTrackInfo(0);
                break;
            case "update":
                spotifyControl.updateTab();
                chrome.runtime.sendMessage({
                    command: "updatePage"
                });
                updateTrackInfo(0, 'update');
                break;
            case "loader":
                chrome.browserAction.setBadgeText({text: ""});
                console.log('loader');
                chrome.runtime.sendMessage({
                    command: "loader"
                });
                updateTrackInfo(0);
        }
        return true;
    }
});

function watchTab() {
    token.validToken(spotifyControl);
    if (token.value != '') {
        chrome.runtime.sendMessage({
            command: "initControlPanel"
        });
        spotifyControl.openHomeTab();
        return true;
    }
    else {
        chrome.browserAction.setBadgeText({text: ""});
        chrome.runtime.sendMessage({
            command: "login"
        });
        return false;
    }
}


function updateTrackInfo(cnt, status) {
    spotifyControl.request.getTrack().then(val => {
        if (cnt < 10)  {
            updateTrackInfo(++cnt, status);
        }
        // watchTrackUpdate(val.item.duration_ms, val.progress_ms);
        // console.log('val ', val);
        if (val == undefined) {
            chrome.browserAction.setBadgeText({text: ""});
            chrome.runtime.sendMessage({
                command: "choosePlaylist"
            });
            return;
        }
		if (val.item == null) {
            spotifyControl.updateTab();
		}
        if (status && status == 'update') {
            if (!val.is_playing) {
                spotifyControl.request.StartResume().then(val => {
                        updateTrackInfo(0, 'update');
                    }
                );
            }
        }

        val.is_playing ? chrome.browserAction.setBadgeText({text: "▶"}) : chrome.browserAction.setBadgeText({text: "▮▮"});
        if (cnt == 10) {
            chrome.runtime.sendMessage({
                command: "updateInfo",
                data: val.item,
                status: val.is_playing,
                duration: convertTime(val.item.duration_ms)
            });
        }
    });

}

function watchTrackUpdate(allTime, startTime) {
    setInterval(function() {
        updateTrackInfo();
    }, allTime - startTime);
    updateTrackInfo();
}

function convertTime(duration) {
    let seconds = parseInt((duration/1000)%60);
    let minutes = parseInt((duration/(1000*60))%60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return  minutes + ":" + seconds;

}


