'use strict';

define([
	'services/scrobbleService',
	'storage/chromeStorage'
], function(ScrobbleService, ChromeStorage) {
	const options = ChromeStorage.getLocalStorage('Options');

	/**
	 * Get array of functions that return promises.
	 * Used for delayed promise execute.
	 * @param  {Object} song Song instance
	 * @return {Array} Array of promise factories
	 */
	function getLoadSongInfoFactories(song) {
		return ScrobbleService.getRegisteredScrobblers().map((scrobbler) => {
			// Don't execute the promise immediately and return factory function
			return function() {
				return scrobbler.loadSongInfo(song);
			};
		});
	}

	/**
	 * Load song info using scrobblers API.
	 * @param  {Object} song Song instance
	 * @return {Promise} Promise that will be resolved then the first valid song info is fetched
	 */
	function loadSong(song) {
		let factories = getLoadSongInfoFactories(song);
		if (factories.length > 0) {
			/*
			 * Song means invalid if at least one info loader
			 * return 'false' result.
			 */
			let isSongInfoValid = true;
			let loadSongInfoSequence = Promise.resolve();

			// Queue promises
			factories.forEach((loadSongInfoFactory) => {
				loadSongInfoSequence = loadSongInfoSequence.then(() => {
					// Wait for first invalid result
					if (isSongInfoValid) {
						let loadSongInfoPromise = loadSongInfoFactory();
						return loadSongInfoPromise.then((isValid) => {
							isSongInfoValid = isValid;
							return isSongInfoValid;
						}).catch(() => {
							/*
							 * Looks like service is not available.
							 * Assume song is valid, but we don't know actually.
							 */
							return true;
						});
					}

					return false;
				});
			});
			return loadSongInfoSequence.then((isValid) => {
				return options.get().then((data) => {
					song.flags.attr('isLastfmValid', isValid || data.forceRecognize);
				});
			});
		}

		return Promise.resolve().then(() => {
			song.flags.attr('isLastfmValid', true);
		});
	}

	return {
		loadSong: loadSong
	};
});
