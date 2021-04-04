'use strict';

Connector.playerSelector = '#footerPlayer';

Connector.playButtonSelector = `${Connector.playerSelector} button[data-test="play"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} button[data-test="pause"]`;

Connector.isScrobblingAllowed = () => !!$(Connector.playButtonSelector);

Connector.trackSelector = `${Connector.playerSelector} div[data-test="footer-track-title"]`;

Connector.getUniqueID = () => {
	const trackUrl = $(`${Connector.trackSelector} a`).attr('href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.artistSelector = `${Connector.playerSelector} span.artist-link`;

Connector.albumSelector = ['#nowPlaying table[class^="infoTable--"] a[href^="/album/"]', `${Connector.playerSelector} a[href^="/album/"]`];

Connector.trackArtSelector = `${Connector.playerSelector} figure[data-test="current-media-imagery"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} time[data-test="current-time"]`;

Connector.durationSelector = `${Connector.playerSelector} time[data-test="duration-time"]`;

Connector.applyFilter(MetadataFilter.getTidalFilter());
