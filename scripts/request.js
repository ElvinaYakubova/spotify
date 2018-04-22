'use strict';

export class request {
    constructor(token) {
        this.token = token;
    }

    getTrack() {
        // fetch('https://api.spotify.com/v1/tracks/'+trackId, {
        return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                method: 'get',
                headers: {
                    "Authorization": 'Bearer ' + this.token
                }
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // console.log("track ", data);
                    return data;
                })
                .catch((error) => {
                    console.log('Request failed', error);
                });
    }

    getPlaylist() {
        return fetch('https://api.spotify.com/v1/me/player', {
            method: 'get',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }

    nextTrack() {
        return fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'post',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }

    prevTrack() {
        return fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'post',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }

    repeatTrack(state) {
        return fetch('https://api.spotify.com/v1/me/player/repeat?state='+state, {
            method: 'put',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }

    shuffleTracks(state) {
        return fetch('https://api.spotify.com/v1/me/player/shuffle?state='+state, {
            method: 'put',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }

    StartResume() {
        return fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'put',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }

    PausePlayback() {
        return fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'put',
            headers: {
                "Authorization": 'Bearer ' + this.token
            }
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log('Request failed', error);
            });
    }
}