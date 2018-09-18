'use strict';

Connector.playerSelector = '.ctl';

Connector.artistSelector = '#newPlayerArtistName';

Connector.trackSelector = '.tracktitle > a';

Connector.getAlbum = () => {
	return $('.albumtitle');
};

Connector.currentTimeSelector = '.start';

Connector.durationSelector = '.finish';

Connector.isPlaying = () => {
	let btn = $('.btnPlay').first();
	return btn.html() === '�Ͻ�����'; // if text '�Ͻ�����' in button, it means 'pause' because music is playing.
};

Connector.getTrackArt = () => {
	return `http:${$('.thumbnail').find('img').attr('src')}`;
};
