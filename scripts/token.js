import {SpotifyControl} from './control.js';

'use strict';

let instance = null;

export class Token {

    constructor() {
        if(!instance){
            instance = this;
        }
        this.value = null;
        return instance;
    }

    getLastAuthToken()  {
        return window.localStorage.getItem('authToken');
    }

    setLastAuthToken(authToken) {
        window.localStorage.setItem('authToken', authToken);
    }

    validToken(spotifyControl) {
        let chromeCookies = chrome.cookies;
        chromeCookies.getAll({
            domain: 'spotify.com'
        }, (cookies) => {
            var authToken = '';
            for (var i = 0, l = cookies.length; i < l; ++i)
            {
                var cookie = cookies[i];
                if (cookie.name == 'wp_access_token')
                {
                    authToken = cookie.value;
                    break;
                }
            }
            if (authToken == '') {
                this.value = '';
                spotifyControl.openHomeTab();
            }
        });
    }

}
