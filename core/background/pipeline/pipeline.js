'use strict';

/**
 *
 */
define([
	'pipeline/user-input',
	'pipeline/local-cache',
	'pipeline/metadata',
	'pipeline/musicbrainz-coverartarchive'
], function(UserInput, LocalCache, Metadata, MusicBrainz) {
	return {
		processSong: function(song) {
			// list of processors is recreated for every processing call
			var processors = [
				UserInput.loadData, // loads data stored by user
				LocalCache.loadData, // loads data filled by user from storage
				Metadata.loadSong, // loads song metadata and sets validation flag
				MusicBrainz.getCoverArt // looks for fallback cover art via API, in the even that it wasn't found earlier
			];

			var cb = function() {
				if (processors.length > 0) {
					var next = processors.shift();
					next(song, cb);
				} else {
					// processing finished, just set the flag
					song.flags.attr('isProcessed', true);
				}
			};

			// reset possible flag, so we can detect changes on repeated processing of the same song
			song.flags.attr('isProcessed', false);

			cb(song);
		}
	};
});
