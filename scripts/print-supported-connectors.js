'use strict';

require('node-define');

function printSupportedConnectors() {
	let connectors = require('../core/connectors').sort(function(a, b) {
		return a.label.localeCompare(b.label);
	});

	for (let connector of connectors) {
		console.log(` ‒ ${connector.label}`);
	}
}

printSupportedConnectors();
