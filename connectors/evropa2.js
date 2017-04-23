'use strict';

/* global Connector, Util */

Connector.playerSelector = '.e2-player';

Connector.artistTrackSelector = '.e2-player-meta-song';

Connector.isPlaying = function() {
	return $('.e2-player-control-stop').is(':visible');
};

Util.separators = ['·'];
