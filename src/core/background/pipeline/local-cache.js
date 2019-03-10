'use strict';

/**
 * This pipeline stage loads song info from Chrome storage
 * and apply it to given song. This module also provides
 * a function to remove song info from storage.
 */

define((require) => {
	const ChromeStorage = require('storage/chrome-storage');

	const storage = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
	const FIELDS_TO_SAVE = ['artist', 'track', 'album'];

	/**
	 * Load song info from Chrome storage.
	 * @param  {Object} song Song object
	 */
	async function process(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		let data = await storage.get();
		if (data[songId]) {
			let isChanged = false;
			let savedMetadata = data[songId];

			for (let field of FIELDS_TO_SAVE) {
				if (savedMetadata[field]) {
					isChanged = true;
					song.processed[field] = savedMetadata[field];
				}
			}

			if (isChanged) {
				song.flags.isCorrectedByUser = true;
			}
		}
	}

	/**
	 * Remove song info from Chrome storage.
	 * @param  {Object} song Song object
	 */
	async function removeSongFromStorage(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		let data = await storage.get();

		delete data[songId];
		await storage.set(data);
	}

	/**
	 * Apply user data to given song.
	 * @param  {Object} song Song object
	 * @param  {Object} data User data
	 * @return {Boolean} True if data is applied
	 */
	function setUserData(song, data) {
		let isChanged = false;

		for (let field of FIELDS_TO_SAVE) {
			if (data[field]) {
				song.userdata[field] = data[field];
				isChanged = true;
			}
		}

		return isChanged;
	}

	return { process, removeSongFromStorage, setUserData };
});
