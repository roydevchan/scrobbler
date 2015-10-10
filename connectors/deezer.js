/**
 * Chrome-Last.fm-Scrobbler Deezer.com Connector by @damienalexandre
 *
 * v1.0, 5 march 2012
 *
 * The difficulty here is that the song duration can appear a long time after the
 * song starts playing.
 * We use the title change to know when a song is played.
 *
 * @todo Handle the song "pause"? (do we have to cancel the scrobble?)
 * @todo Improve the way we deal with the first played song. I have made it lazy for perf purpose.
 */

var currentDeezerTimeout = null;

$(document).ready(function() {

    $("title").bind('DOMSubtreeModified', function()
    {
        cancel(); // In case we switch song before the scrobble (as the duration is async, we may warn the extension too late)

        if (currentDeezerTimeout) // Handle song fast zapping
        {
            window.clearTimeout(currentDeezerTimeout);
        }

        currentDeezerTimeout = window.setTimeout(sendTrack, 1000); // As the duration may be not available.
    });

    sendTrack(); // We maybe have a song playing right away. There is no retry if this call fails.

    $(window).unload(function()
    {
        cancel();
        return true;
    });
});

/**
 * Handle the chrome.extension
 * and can retry itself too.
 */
function sendTrack()
{
    if (currentDeezerTimeout)
    {
        window.clearTimeout(currentDeezerTimeout);
    }

    var deezerSong = getCurrentTrack();

    if (deezerSong && deezerSong.duration > 0)
    {
		console.log(deezerSong);
        chrome.runtime.sendMessage({type: 'validate', artist: deezerSong.artist, track: deezerSong.track}, function(response)
        {
            if (response != false)
            {
                var song = response; // contains valid artist/track now

                chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: deezerSong.duration});
            }
            else
            {
                chrome.runtime.sendMessage({type: 'nowPlaying', duration: deezerSong.duration});
            }
        });
    }
    else if (currentDeezerTimeout)
    {
        // Retry to fetch the song infos later
        currentDeezerTimeout = window.setTimeout(sendTrack, 1000);
    }
}

/**
 * Try to get the song infos (track, artist, duration)
 * @return object|boolean
 */
function getCurrentTrack()
{
	// for old design
    if ($('#player_control_play').is(":hidden")) {
        return {
            track: $('.track-info .title').text(),
            artist: $('.track-info .artist').text(),
            duration: parseDuration($('#player_track_length').text())
        }
    }
	// for new 10/2014 design
    else if ($('.player .control-pause').size() > 0) {
        return {
            track: $('.player-track-title').text(),
            artist: $('.player-track-artist').text().replace($('.player-track-artist').children().first().text(), '').trim().replace(/,$/, ''),
            duration: parseDuration($('.player-progress .progress-length').text())
        }
    }

    return false;
}

/**
 * Binded on the unload
 */
function cancel()
{
    // reset the background scrobbler song data
    chrome.runtime.sendMessage({type: 'reset'});
}

/**
 * Maybe this kind of common method should be in the Core
 *
 * @param durationString Like "13;37".
 * @return int The duration string translated to seconds
 */
function parseDuration(durationString)
{
    try
    {
        var match = durationString.match(/\d+:\d+/g);

        if (match)
        {
            var mins    = match[0].substring(0, match[0].indexOf(':'));
            var seconds = match[0].substring(match[0].indexOf(':')+1);
            return parseInt(mins*60, 10) + parseInt(seconds, 10);
        }
        else
        {
            return 0;
        }
    }
    catch(err)
    {
        return 0;
    }
}
