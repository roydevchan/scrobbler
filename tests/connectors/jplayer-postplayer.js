'use strict';

module.exports = function(driver, connectorSpec) {
	// Auth is required
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://post-player.org/'
	});
};
