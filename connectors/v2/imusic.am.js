'use strict';

/* global Connector */

Connector.playerSelector = '.player-block';

Connector.artistSelector = '#p_songTitle .f_artist';

Connector.trackSelector = '#p_songTitle .f_album';

Connector.isPlaying = function () {
	return $('#pauseBtn').is(':visible');
};
