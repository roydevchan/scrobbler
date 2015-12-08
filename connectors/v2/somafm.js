'use strict';

/* global Connector */

Connector.playerSelector = '.player-container';
Connector.artistSelector = '#list > div:nth-child(1) > div:nth-child(2) > p';
Connector.trackSelector = '#list > div:nth-child(1) > div:nth-child(3) > p';

Connector.isPlaying = function() {
	return $('#playBtn').hasClass('ng-hide');
};
