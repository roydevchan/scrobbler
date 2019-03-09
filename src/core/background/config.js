'use strict';

define((require) => {
	const connectors = require('connectors');
	const ChromeStorage = require('storage/chrome-storage');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
	const connectorsOptions = ChromeStorage.getStorage(ChromeStorage.CONNECTORS_OPTIONS);

	/**
	 * Object that stores default option values.
	 * @type {Object}
	 */
	const DEFAULT_OPTIONS_MAP = {
		/**
		 * Array of disabled connectors.
		 * @type {Array}
		 */
		disabledConnectors: [],
		/**
		 * Disable Google Analytics.
		 * @type {Boolean}
		 */
		disableGa: false,
		/**
		 * Force song recognition.
		 * @type {Boolean}
		 */
		forceRecognize: false,
		/**
		 * Use now playing notifications.
		 * @type {Boolean}
		 */
		useNotifications: true,
		/**
		 * Notify if song is not recognized.
		 * @type {Boolean}
		 */
		useUnrecognizedSongNotifications: false,
	};

	/**
	 * Object that stores default option values for specific connectors.
	 * @type {Object}
	 */
	const DEFAULT_CONNECTOR_OPTIONS_MAP = {
		GoogleMusic: {
			scrobblePodcasts: true
		},
		YouTube: {
			scrobbleMusicOnly: false,
			scrobbleEntertainmentOnly: false
		}
	};

	/**
	 * Setup default options values.
	 * This function is called on module init.
	 */
	async function setupDefaultConfigValues() {
		let data = await options.get();
		for (let key in DEFAULT_OPTIONS_MAP) {
			if (data[key] === undefined) {
				data[key] = DEFAULT_OPTIONS_MAP[key];
			}
		}
		await options.set(data);
		options.debugLog();

		data = await connectorsOptions.get();
		for (let connectorKey in DEFAULT_CONNECTOR_OPTIONS_MAP) {
			if (data[connectorKey] === undefined) {
				data[connectorKey] = DEFAULT_CONNECTOR_OPTIONS_MAP[connectorKey];
			} else {
				for (let key in DEFAULT_CONNECTOR_OPTIONS_MAP[connectorKey]) {
					if (data[connectorKey][key] === undefined) {
						data[connectorKey][key] = DEFAULT_CONNECTOR_OPTIONS_MAP[connectorKey][key];
					}
				}
			}
		}
		await connectorsOptions.set(data);
		connectorsOptions.debugLog();
	}

	/**
	 * Check if connector is enabled.
	 * @param  {String}  label Connector label
	 * @return {Boolean} Check result
	 */
	async function isConnectorEnabled(label) {
		let data = await options.get();
		return !data.disabledConnectors.includes(label);
	}

	/**
	 * Enable or disable connector.
	 * @param  {String}  label Connector label
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	async function setConnectorEnabled(label, state) {
		let data = await options.get();

		let index = data.disabledConnectors.indexOf(label);
		if (index === -1 && !state) {
			data.disabledConnectors.push(label);
		} else if (state) {
			data.disabledConnectors.splice(index, 1);
		}

		await options.set(data);
	}

	/**
	 * Enable or disable all connectors.
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	async function setAllConnectorsEnabled(state) {
		let data = await options.get();

		data.disabledConnectors = [];
		if (!state) {
			for (let connector of connectors) {
				data.disabledConnectors.push(connector.label);
			}
		}

		await options.set(data);
	}

	setupDefaultConfigValues();

	return {
		isConnectorEnabled, setConnectorEnabled, setAllConnectorsEnabled,
	};
});
