'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://hypem.com/artist/Violet+Days+x+Win+and+Woo',
		playButtonSelector: '.tools .playdiv'
	});
};
