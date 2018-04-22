import {Token} from './token.js';
import {SpotifyControl} from './control.js';

'use strict';

export class Auth {

    constructor() {
        // this.listen();
    }

    login(authToken, spotifyControl) {
        console.log("token at login ", authToken.value);
        authToken.setLastAuthToken(authToken.value);
        //enableAudioPlayer
        if (this.isValidSession(authToken)) {
            spotifyControl.init(authToken);
        }
        else {
            spotifyControl.openHomeTab();
        }
    }

    logout(authToken) {
        authToken.value = '';
        authToken.setLastAuthToken(null);
        console.log('logout');
        //disableOnlinePlayer
    }

    isValidSession(authToken) {
        if (authToken.getLastAuthToken() != authToken.value || !authToken.value) {
            return false;
        }
        return true;
    }

    listen(token, spotifyControl) {
        var chromeCookies = chrome.cookies;

        document.addEventListener("DOMContentLoaded", () => {
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
                token.value = authToken;
                this.login(token, spotifyControl);
                // spotifyControl.init(this);
            });

            chromeCookies.onChanged.addListener((changeInfo) =>
            {
                var cause = changeInfo.cause;
                var cookie = changeInfo.cookie;

                if (/.*spotify\.com/.test(cookie.domain) && cookie.name == 'wp_access_token') {
                    if (cause != "expired_overwrite") {
                        token.value = cookie.value;
                        this.login(token, spotifyControl);
                    } else {
                        this.logout(token);
                    }
                }
            });
        });
    }

}


