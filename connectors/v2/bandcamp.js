'use strict';

/* global Connector */

/** note: the discover page doesn't display the track artist for compilation albums.  This connector
    currently passes 'Various Artist' (or other variant) as the artist name so tracks on albums with
    various artists played on the discover page will most likely not be recognized.*/

// wire audio element to fire state changes
$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

/**
 * remove zero width characters & trim
 * @param  {string} text to clean up
 * @return {string} cleaned up text
 */
function cleanText(input) {
	if (input === null) {
		return input;
	}
	return input.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function getArtist() {
	var artist = $('.detail_item_link_2').text() ||
				$('span[itemprop=byArtist]').text() ||
				$('.detail-artist a').text() ||
				null;
	if (artist === null) {
		artist = $('.waypoint-artist-title').text().substr(3);
	}
	return cleanText(artist);
}

function getTrack() {
	var track = $('.track_info .title').first().text() ||
				$('.trackTitle').first().text() ||
				$('.waypoint-item-title').text() ||
				$('.track_info .title') ||
				null;
	return cleanText(track);
}

function artistIsVarious() {
	// album page: true if all tracks contain a hyphen or vertical bar (pipe symbol)
	// example of pipe usage: http://tigersmilkrecords.bandcamp.com/album/peru-maravilloso-vintage-latin-tropical-cumbia
	if ($('meta[property="og:type"]').attr('content') === 'album') {
		var allDashed = true;
		$('.track_list span[itemprop="name"]').each(function () {
			if (!/\||-/.test($(this).text())) {
				allDashed = false;
				return false;
			}
		});
		return allDashed;
	}
	// discover & song pages: true if artist name is 'Various' or 'Various Artists'
	// and track contains a hyphen or vertical bar.
	// Also takes into account misspelling of various as varios
	//    http://krefeld8ung.bandcamp.com/album/krefeld-8ung-vol-1
	return (/^Variou?s(\sArtists)?$/.test(getArtist()) && /\||-/.test(getTrack()));
}

/* @returns {{artist, track}} */
Connector.getArtistTrack = function () {
	var artist = getArtist(),
		track = getTrack(),
		separatorIndex;
	if (artistIsVarious()) {
		separatorIndex = Math.max(track.indexOf('-'), track.indexOf('|'));
		artist = cleanText(track.substring(0, separatorIndex));
		track = cleanText(track.substring(separatorIndex + 1));
	}
	return {
		artist: artist,
		track: track
	};
};

Connector.getAlbum = function () {
	var album = $('.detail_item_link').text() ||
				$('h2.trackTitle').text() ||
				$('[itemprop="inAlbum"] [itemprop="name"]').text() ||
				null;
	return cleanText(album);
};

Connector.playButtonSelector = 'div.playbutton:not(.playing)';

Connector.getTrackArt = function() {
	return $('#tralbumArt > a > img').attr('src') ||
	$('#detail_gallery_container img').attr('src') ||
	$('.discover-detail-inner img').attr('src');
};

Connector.getCurrentTime = function () {
	return Math.round($('audio')[0].currentTime);
};

Connector.getDuration = function () {
	return Math.round($('audio')[0].duration);
};

/** Returns a unique identifier of current track.
 *  @returns {String|null} */
Connector.getUniqueID = function () {
	var match = /&id=(\d+)&/.exec($('audio').first().attr('src'));
	if (match) {
		return match[1];
	}
	return null;
};
