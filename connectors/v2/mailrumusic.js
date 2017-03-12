'use strict';

/* global Connector, Util */

const DEFAULT_COVER = 'empty-cover.svg';

Connector.playerSelector = '.l-music__player';

Connector.artistSelector = '.l-music__player__song__author';

Connector.trackSelector = '.l-music__player__song__name';

Connector.currentTimeSelector = '.l-music__player__song__time.current';

Connector.durationSelector = '.l-music__player__song__time.duration';

Connector.getTrackArt = function() {
	let backgroundImage = $('.l-music__player__song__cover')
		.css('background-image');
	let backgroundUrl = Util.extractUrlFromCssProperty(backgroundImage);
	if (backgroundUrl) {
		let coverFileName = backgroundUrl.split('/').pop();
		if (coverFileName !== DEFAULT_COVER) {
			return backgroundUrl;
		}
	}

	return null;
};

Connector.isPlaying = function() {
	return $('.l-music__player').hasClass('playing');
};
