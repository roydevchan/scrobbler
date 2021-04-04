'use strict';

const filter = new MetadataFilter({
	track: cleanupTrack,
	artist: cleanupArtist,
});

Connector.playerSelector = 'div.playerUI';
Connector.artistSelector = 'div.playerUI div.marqueeContent div';
Connector.trackSelector = 'div.playerUI div.marqueeContent div';
Connector.currentTimeSelector = 'div.scrubControlCurrentTime';
Connector.durationSelector = 'div.scrubControlDuration';
Connector.isPlaying = () => {
	return $('button.playButton').hasClass('playButton--pause');
};

Connector.onReady = Connector.onStateChanged;

Connector.applyFilter(filter);

function cleanupTrack(track) {
	// Extract a track title from a `Track by Artist` string.
	return track.replace(/^(.*?)\s(by)\s(.*?)$/s, '$1');
}

function cleanupArtist(artist) {
	// Extract the artist from a `Track by Artist` string.
	return artist.replace(/^(.*?)\s(by)\s(.*?)$/s, '$3');
}
