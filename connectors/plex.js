/*
 * Chrome-Last.fm-Scrobbler PLEX connector by Hm
 * https://github.com/j4cknife
 * http://www.last.fm/user/davis1766
 * 
 * (based on google music connector)
 *
 */
// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';

// Timeout to scrobble track after minimum time passes
var scrobbleTimeout = null;

// Global constant for the song container ....
var CONTAINER_SELECTOR = 'div#plex';


$(function(){
	$(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {

		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;
		}

   });

   //console.log("Last.fm Scrobbler: starting Plex/Web connector")

   // first load
   updateNowPlaying();
});

/**
 * Called every time we load a new song
 */
function updateNowPlaying(){
    var parsedInfo = parseInfo();
    artist   = parsedInfo['artist']; 	//global
    track    = parsedInfo['track'];	//global
    album    = parsedInfo['album'];
    duration = parsedInfo['duration']; 	//global

    if (artist == '' || track == '' || duration == 0) {return;}

    // check if the same track is being played and we have been called again
    // if the same track is being played we return
    if (clipTitle == track) {
	return;
    }
    clipTitle = track;

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
      if (response != false) {
          chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, album: album, duration: duration});
      }
      // on failure send nowPlaying 'unknown song'
      else {
         chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
      }
    });
}


function parseInfo() {
    var artist   = '';
    var track    = '';
    var album    = '';
    var duration = 0;

    // Get artist and song names
    var artistValue = $("button.grandparent-title.btn-link.btn-metadata-link").text();
    var trackValue = $("button.item-title.btn-link.btn-metadata-link").text();
    var albumValue = $("h2.album-title").text();
    var durationValue = $("span.player-duration").text();

    try {
        if (null != artistValue) {
            artist = artistValue.replace(/^\s+|\s+$/g,'');
        }
        if (null != trackValue) {
            track = trackValue.replace(/^\s+|\s+$/g,'');
        }
        if (null != albumValue) {
            album = albumValue.replace(/^\s+|\s+$/g,'');
        }
        if (null != durationValue) {
            duration = parseDuration(durationValue);
        }
    } catch(err) {
        return {artist: '', track: '', duration: 0};
    }

    //console.log("artist: " + artist + ", track: " + track + ", album: " + album + ", duration: " + duration);

    return {artist: artist, track: track, album: album, duration: duration};
}

function parseDuration(artistTitle) {
	try {
		match = artistTitle.match(/\d+:\d+/g)[0]

		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	} catch(err){
		return 0;
	}
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Plex/Web song scrobbled'});

   // scrobble
   chrome.runtime.sendMessage({type: 'submit'});
}



/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.type) {
            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
    }
	}
);
