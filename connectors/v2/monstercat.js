'use strict';

/* global Connector */

Connector.playerSelector = '.controls';

Connector.artistTrackSelector = '.scroll-title';

Connector.isPlaying = function() {
	return $('.controls .fa-pause').length > 0;
};
