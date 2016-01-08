'use strict';

/* global Connector */

Connector.playerSelector = '.leftmusicplayer';

Connector.artistSelector = '.leftmusicplayer .player-artist-name';

Connector.trackSelector = '.leftmusicplayer .musicname a:first';

Connector.playButtonSelector = '.leftmusicplayer .section-controls .btn-play';

Connector.currentTimeSelector = '.leftmusicplayer .songDuration.s-progress';

Connector.durationSelector = '.leftmusicplayer .s-total';

Connector.getTrackArt = function() {
	var backgroundStyle = $('div.bgimge').css('background'),
		backgroundUrl = /url\((['"]?)(.*)\1\)/.exec(backgroundStyle);
	return backgroundUrl ? backgroundUrl[2] : null;
};
