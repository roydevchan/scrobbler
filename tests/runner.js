'use strict';

const path = require('path');
const Mocha = require('mocha');
const options = require('./helpers/options');
const requirejs = require('node-define');

/**
 * Configure RequireJS module,
 */
function configureRequireJs() {
	requirejs.config({
		paths: {
			connectors: 'src/core/connectors',
			wrapper: 'tests/stubs',
			storage: 'src/core/background/storage',
			vendor: 'src/vendor',

			'object/deep-proxy': 'src/core/background/object/deep-proxy',
			'util/util': 'src/core/background/util/util'
		},
		waitSeconds: 0
	});
}

/**
 * Get Mocha test reporter name.
 * @return {String} Test reporter name
 */
function getTestReporter() {
	if (options.getTestMode() === 'core') {
		return 'progress';
	}

	return options.get('debug') ? 'spec' : 'tap';
}

/**
 * Create Mocha object with certain configuration.
 * @return {Object} Mocha instance
 */
function createMocha() {
	let mocha = new Mocha({
		timeout: 120000,
		reporter: getTestReporter()
	});
	switch (options.getTestMode()) {
		case 'core':
			mocha.addFile(path.join(__dirname, 'core-tests.js'));
			break;
		case 'connectors':
			mocha.addFile(path.join(__dirname, 'connectors-tests.js'));
			break;
	}
	return mocha;
}

/**
 * Entry point.
 */
function main() {
	configureRequireJs();
	createMocha().run((failures) => {
		process.on('exit', () => {
			process.exit(failures);
		});
	});
}

main();
