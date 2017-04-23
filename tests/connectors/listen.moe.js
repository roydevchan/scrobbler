'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://listen.moe/',
		playButtonSelector: '.player-icon'
	});
};
