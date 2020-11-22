'use strict';

const trackItemSelector = '.sc-c-basic-tile';

setupConnector();

function setupConnector() {
	if (isLiveRadio()) {
		setupPropertiesForLiveRadio();
	} else {
		setupPropertierForOfflineRecord();
	}
}

function isLiveRadio() {
	return document.querySelector(trackItemSelector) === null;
}

function setupPropertiesForLiveRadio() {
	Connector.playerSelector = '.radio-main';

	Connector.artistSelector = '.sc-c-track__artist';

	Connector.trackSelector = '.sc-c-track__title';
}

function setupPropertierForOfflineRecord() {
	const equalizerIconSelector = '.sc-c-equalizer';

	const artistSelector = '.sc-c-basic-tile__artist';
	const trackSelector = '.sc-c-basic-tile__title';

	Connector.playerSelector = '.sc-o-scrollable';

	Connector.getArtistTrack = () => {
		const artistTrackElement = document.querySelector(
			equalizerIconSelector
		);
		if (!artistTrackElement) {
			return null;
		}

		const trackItem = artistTrackElement.closest(trackItemSelector);
		const artist = trackItem.querySelector(artistSelector).textContent;
		const track = trackItem.querySelector(trackSelector).textContent;

		return { artist, track };
	};
}
