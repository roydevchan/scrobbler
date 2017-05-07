'use strict';

/* global Connector */

if ($('#play_on_youtube')) {
	Connector.playerSelector = '#main';

	Connector.artistSelector = '#now_playing .title_artist .a';

	Connector.trackSelector = '#now_playing .title_artist .t';

	Connector.albumSelector = '#now_playing .album .detail';

	Connector.isPlaying = function() {
		return $('#mix_youtube').hasClass('playing');
	};
} else {
	Connector.playerSelector = '#player';

	Connector.artistSelector = '#now_playing .title_artist .a:first';

	Connector.trackSelector = '#now_playing .title_artist .t:first';

	Connector.albumSelector = '#now_playing .album .detail:first';

	Connector.playButtonSelector = '#player_play_button';
}

Connector.trackArtImageSelector = '#player_mix img';

Connector.getUniqueID = function() {
	let trackId = $('.track_details').attr('id');
	if (trackId) {
		return trackId.replace('track_details_', '');
	}

	return null;
};
