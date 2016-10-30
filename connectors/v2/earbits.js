'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '#artist_name';

Connector.trackSelector = '.track_name';

Connector.albumSelector = '.album_name';

Connector.currentTimeSelector = '#time_current';

Connector.durationSelector = '#time_end';

Connector.trackArtImageSelector = '.album_cover';

Connector.isPlaying = function () {
	var playButtonImgFilename = $('#play-pause img').attr('src');
	return playButtonImgFilename.indexOf('pause') !== -1;
};
