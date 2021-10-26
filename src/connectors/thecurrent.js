'use strict';

const filter = new MetadataFilter({
	track: cleanupTrack,
	artist: cleanupArtist,
});

Connector.playerSelector = 'aside.player';
Connector.trackSelector = 'aside.player .player_subhead';
Connector.artistSelector = 'aside.player .player_subhead';
Connector.isPlaying = () => $('aside.player').hasClass('is-playing');
Connector.onReady = Connector.onStateChanged;

Connector.applyFilter(filter);

function cleanupTrack(track) {
	// Extract a track title from a `Track by Artist` string.
	return track.replace(/^(.*?)\s(by)\s(.*?)$/, '$1');
}

function cleanupArtist(artist) {
	// Extract the artist from a `Track by Artist` string.
	return artist.replace(/^(.*?)\s(by)\s(.*?)$/, '$3');
}
