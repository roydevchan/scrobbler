'use strict';

/* global Connector */

Connector.playerSelector = '#div_player_wrapper';

Connector.artistSelector = '#span_information_artist';

Connector.trackSelector = '#span_information_title';

Connector.albumSelector = '#span_information_album';

Connector.durationSelector = '#durationLabel';

Connector.trackArtSelector = '#img_cover_1';

Connector.isPlaying = function () {
	return $('#statusLabel').text() === 'Playing';
};
