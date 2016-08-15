'use strict';

define(['chromeStorage'], function(ChromeStorage) {
	const storage = ChromeStorage.getNamespace('LocalCache');
	const fieldsToSave = ['artist', 'track'];

	function fillSongMetadataFromStorage(song, cb) {
		if (!song.parsed.uniqueID) {
			cb();
			return;
		}

		storage.get((chromeData) => {
			let songId = song.parsed.uniqueID;

			if (chromeData[songId]) {
				let isChanged = false;
				let savedMetadata = chromeData[songId];

				for (let field of fieldsToSave) {
					if (savedMetadata[field]) {
						isChanged = true;
						song.processed.attr(field, savedMetadata[field]);
					}
				}

				if (isChanged) {
					song.flags.attr('isCorrectedByUser', true);
				}
			}

			cb();
		});
	}

	return {
		loadData: fillSongMetadataFromStorage
	};
});
