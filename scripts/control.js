import {request} from './request.js';

'use strict';

export class SpotifyControl {

    constructor() {
    }
    init(authToken) {
        let token = authToken.value;
        this.request = new request(token);
        console.log("request created");
        //this.request.getPlaylist();
    };

    openHomeTab() {
        chrome.tabs.getAllInWindow(undefined, function(tabs) {
            for (var i = 0, tab; tab = tabs[i]; i++) {
                var url = new URL(tab.url);
                if (url.hostname == 'play.spotify.com' || url.hostname == 'open.spotify.com') {
                    return;
                }
            }
            console.log(tabs);
            chrome.tabs.create({url: 'https://open.spotify.com'});
        });
    };

    updateTab() {
        chrome.tabs.getAllInWindow(undefined, function(tabs) {
            let tabId = 0;
            for (var i = 0, tab; tab = tabs[i]; i++) {
                var url = new URL(tab.url);
                if (url.hostname == 'play.spotify.com' || url.hostname == 'open.spotify.com') {
                    tabId = tab.id;
                    break;
                }
            }
            console.log(tabId);
            chrome.tabs.update(tabId, {url: 'https://open.spotify.com'});
            this.tabId = tabId;
        });
    };


}

