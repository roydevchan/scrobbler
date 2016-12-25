require('node-define');
var fs = require('fs');
var driver = require('./helpers/chromeSpoofing').getDriver();
var connectors = require('../core/connectors');
global.async = require('async');
global.siteSpec = require('./generic_test_components/site');
global.connectorSpec = require('./generic_test_components/connector');
global.expect = require('chai').expect;

describe('Web-Scrobbler Extension', function() {

	before(function(done) {
		driver.sleep(1000).then(function() {
			done();
		});
	});

	/**
	 * Loop through all the connectors currently enabled,
	 * look for explicitly defined tests first,
	 * falling back to a generic test if none are found.
	*/
	async.each(connectors, function(connector, next) {
		describe('Connector: '+connector.label, function() {
			var jsPathArr = connector.js[0].split('/');
			var jsName = jsPathArr[jsPathArr.length-1];
			var testPath = '/connectors/'+jsName;
			if(fs.existsSync(__dirname+testPath)) {
				console.log("	Running EXPLICIT test ",testPath);
				require('.'+testPath)(driver, connector, next);
			} else {
				// Generic test here - will rely on a defined test URL for each connector
				it('has no tests', function() {});
				next();
			}
		});
	});

	after(function() {
		driver.quit();
	});

});
