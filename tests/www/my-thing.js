/* eslint-disable no-unused-vars, handle-callback-err */
window.mocha = {};
window.mocha.run = function () {
    'use strict';

    var chrome = window.chrome;

    // File globals
    var session;
    var media;

    var output = document.createElement('div');
    output.innerText = 'waiting';
    document.body.appendChild(output);

    function addButtons () {
        var b = document.createElement('button');
        b.innerText = 'Request Session';
        b.onclick = requestSession;
        document.body.appendChild(b);

        b = document.createElement('button');
        b.innerText = 'Start Session';
        b.onclick = startSession;
        document.body.appendChild(b);
    }

    initialize();

    function initialize () {
        // use default app id
        var appId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        var apiConfig = new chrome.cast.ApiConfig(new chrome.cast.SessionRequest(appId), function sessionListener (session) {
                // The session listener is only called under the following conditions:
                // * will be called shortly chrome.cast.initialize is run
                // * if the device is already connected to a cast session
                // Basically, this is what allows you to re-use the same cast session
                // across different pages and after app restarts
            window.session = session;
            addMediaListener(session);
        }, function receiverListener (receiverAvailable) {
                // receiverAvailable is a boolean.
                // True = at least one chromecast device is available
                // False = No chromecast devices available
                // You can use this to determine if you want to show your chromecast icon
        });

        // initialize chromecast, this must be done before using other chromecast features
        chrome.cast.initialize(apiConfig, function () {
            // Initialize complete
            // Let's start casting
            addButtons();
        }, function (err) {
            // Initialize failure
            console.log(err);
        });
    }

    function requestSession () {
        // This will open a native dialog that will let
        // the user choose a chromecast to connect to
        // (Or will let you disconnect if you are already connected)
        chrome.cast.requestSession(function (sess) {
            // Got a session!
            session = sess;
            doSomething();
        }, function (err) {
            // Failed, or if err is cancel, the dialog closed
            console.log(err);
        });
    }

    function startSession () {
        output.innerHTML = 'Scanning';
        chrome.cast.cordova.startRouteScan(function routeUpdate (routes) {
            var route;
            for (var i = 0; i < routes.length; i++) {
                route = routes[i];
                if (!route.isNearbyDevice && !route.isCastGroup) {
                    chrome.cast.cordova.stopRouteScan(function () {
                        output.innerHTML = 'Joining';
                        chrome.cast.cordova.selectRoute(route.id, function (sess) {
                            output.innerHTML = 'Joined';
                            session = sess;
                            doSomething();
                        }, function (err) {
                        });
                    }, function (err) {
                    });
                    break;
                }
            }
        }, function (err) {
        });
    }

    function doSomething () {
        window.session = session;

        session.addUpdateListener(function listener (isAlive) {
            console.log('session.status: ' + session.status + ' isAlive: ' + isAlive);
        });

        addMediaListener(session);
        var startTime = new Date();
        // Load a video
        loadMedia(function () {
            media.addUpdateListener(function listener (isAlive) {
                if (media.playerState === chrome.cast.media.PlayerState.PLAYING) {
                    media.removeUpdateListener(listener);
                    console.log((new Date() - startTime) / 1000 + 's until played');
                }
            });
        });
        // loadQueue();
    }

    function addMediaListener (session) {
        session.addMediaListener(function listener (m) {
        });
    }

    // function getStreamUrl (callback) {
    //     // https://pwn.sh/tools/twitchlive.py

    //     var oReq = new XMLHttpRequest();
    //     oReq.addEventListener('load', function () {
    //         var liveStream = [];
    //         try {
    //             liveStream = JSON.parse(this.responseText);
    //         } catch (e) {
    //             callback(e);
    //         }
    //         if (liveStream.length === 0) {
    //             callback('No live streams found');
    //         }

    //         var oReq2 = new window.XMLHttpRequest();
    //         oReq2.addEventListener('load', function () {
    //             var res = JSON.parse(this.responseText);
    //             if (!res.urls) {
    //                 return callback('Found no urls for stream');
    //             }
    //             return callback(res.urls['360p'] || res.urls['480p'] || res.urls['720p'] || res.urls['720p60'] || res.urls['1080p60'] || res.urls['audio_only']);
    //         });
    //         oReq2.open('GET', 'https://pwn.sh/tools/twitchlive.py');
    //         oReq2.send({url: x});
    //     });
    //     oReq.open('GET', 'https://pwn.sh/tools/twitchlive.py');
    //     oReq.send();

    // }

    function loadQueue (callback) {
        callback = callback || function () {};
        var videos = [{'url': 'https://player.vimeo.com/external/241978638.hd.mp4?s=2484e26a47a814c4402242a96f13cde99ec9e484&profile_id=174&oauth2_token_id=1007584238', 'vimeo_id': 241978638, 'name': 'S1 EP 01 - Wahed', 'id': 7277}, {'url': 'https://player.vimeo.com/external/241978610.hd.mp4?s=cb02fc98ebf44ae38e09bb460588dfe1da5c386b&profile_id=174&oauth2_token_id=1007584238', 'vimeo_id': 241978610, 'name': 'S1 EP 02 -Aethnan', 'id': 7268}, {'url': 'https://player.vimeo.com/external/241978630.hd.mp4?s=afef8ec055c35cb8ddcd47483d18870e5ebfb034&profile_id=174&oauth2_token_id=1007584238', 'vimeo_id': 241978630, 'name': 'S1 EP 03 - Thalatha', 'id': 7274}, {'url': 'https://player.vimeo.com/external/241978607.hd.mp4?s=1fa8208290d3d7e8e5d7e2449eae0c9098dbe7e3&profile_id=174&oauth2_token_id=1007584238', 'vimeo_id': 241978607, 'name': 'S1 EP 04 - Aarbaa', 'id': 7267}, {'url': 'https://player.vimeo.com/external/241978619.hd.mp4?s=a1c986ce2265b69ccb131bfc473fc1cb83e542d2&profile_id=174&oauth2_token_id=1007584238', 'vimeo_id': 241978619, 'name': 'S1 EP 05 -Khamsa', 'id': 7271}, {'url': 'https://player.vimeo.com/external/241978628.hd.mp4?s=82cd7d190b86756ecf81f8ce1e1ee747d0f79b5f&profile_id=174&oauth2_token_id=1007584238', 'vimeo_id': 241978628, 'name': 'S1 EP 06 - Sittah', 'id': 7273}];
        var video;
        var item;
        var queue = [];

        // Build the queue
        for (var i = 0; i < videos.length; i++) {
            video = videos[i];
            item = new chrome.cast.media.MediaInfo(video.url, video.format);
            // TODO add support for fancier metadata
            item.metadata = new chrome.cast.media.GenericMediaMetadata();
            // item.metadata = new chrome.cast.media.TvShowMediaMetadata();
            item.metadata.title = video.name;
            // item.metadata.subtitle = 'DaSubtitle';
            // videoItem.metadata.episode = 15;
            // videoItem.metadata.season = 2;
            // videoItem.metadata.seriesTitle = 'DaSeries';
            // videoItem.metadata.images = [new chrome.cast.Image(imageUrl)];
            item = new chrome.cast.media.QueueItem(item);
            item.preloadTime = 2;
            queue.push(item);
        }

        // Build the queue request
        var request = new chrome.cast.media.QueueLoadRequest(queue);
        request.repeatMode = chrome.cast.media.RepeatMode.ALL;
        request.startIndex = 5;

        // Play the queue
        session.queueLoad(request, function onMediaLoaded (m) {
            media = m;
            callback();
            // Wait a couple seconds
            setTimeout(function () {
                // Lets pause the media
                pauseMedia();
            }, 2000);
        }, function (err) {
            if (err.code === chrome.cast.ErrorCode.INVALID_PARAMETER && err.description === 'No active session') {
                return callback(chrome.cast.ERROR_NOT_CONNECTED);
            }
            callback(err);
        });
    }

    function loadMedia (callback) {
        callback = callback || function () {};
        var url = 'http://relay.publicdomainproject.org/classical.mp3';
        // var url = 'https://ia801302.us.archive.org/1/items/TheWater_201510/TheWater.mp4';
        var mediaInfo = new chrome.cast.media.MediaInfo(url, 'video/mp4');
        mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
        // mediaInfo.duration = null;

        session.loadMedia(new chrome.cast.media.LoadRequest(mediaInfo), function (m) {
            // You should see the video playing now!
            // Got media!
            media = m;
            callback();
        }, function (err) {
            // Failed (check that the video works in your browser)
            console.log(err);
        });
    }

    function pauseMedia () {
        session.media[0].pause({}, function () {
            // Success

            // Wait a couple seconds
            setTimeout(function () {
                // stop the session
                // stopSession();
            }, 2000);

        }, function (err) {
            // Fail
            console.log(err);
        });
    }

    function stopSession () {
        // Also stop the session (if )
        session.stop(function () {
            // Success
        }, function (err) {
            // Fail
            console.log(err);
        });
    }

};
