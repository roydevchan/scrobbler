'use strict';

/* globals _, MetadataFilter, TestReporter, Util */

/**
 * Connector base object.
 *
 * Handles all communication with the extension background script
 * and provides some convenient methods for parsing song data from the document.
 *
 * @constructor
 */
var BaseConnector = window.BaseConnector || function () {

	/**
	 * Selector of an element containing artist name. The containing string will
	 * be filtered in the background script, if needed.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getArtist} is used.
	 *
	 * @type {String}
	 */
	this.artistSelector = null;

	/**
	 * Selector of an element containing track name. The containing string will
	 * be filtered in the background script, if needed.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getTrack} is used.
	 *
	 * @type {String}
	 */
	this.trackSelector = null;

	/**
	 * Selector of an element containing album name. The containing string will
	 * be filtered in the background script, if needed.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getAlbum} is used.
	 *
	 * @type {String}
	 */
	this.albumSelector = null;

	/**
	 * Selector of an element containing track current time in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getCurrentTime} is used.
	 *
	 * @type {String}
	 */
	this.currentTimeSelector = null;

	/**
	 * Selector of an element containing track duration in h:m:s format.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getDuration} is used.
	 *
	 * @type {String}
	 */
	this.durationSelector = null;

	/**
	 * Selector of an element containing both current time and duration.
	 * {@link BaseConnector#currentTimeSelector} and {@link BaseConnector#durationSelector}
	 * properties have priority over this, and {@link BaseConnector#timeInfoSelector}
	 * is used only if any of the previous returns empty result.
	 *
	 * Only applies when default implementation of {@link BaseConnector#getTimeInfo} is used.
	 *
	 * @type {String}
	 */
	this.timeInfoSelector = null;

	/**
	 * Selector of an element containing both artist and track name.
	 * {@link BaseConnector#artistSelector} and
	 * {@link BaseConnector#trackSelector} properties have priority over this,
	 * and {@link BaseConnector#artistTrackSelector} is used only if any of
	 * the previous returns empty result.
	 *
	 * The containing string will be filtered in the background script,
	 * if needed.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#getArtistTrack} is used.
	 *
	 * @type {string}
	 */
	this.artistTrackSelector = null;

	/**
	 * Selector of an play button element. If the element is not visible,
	 * the playback is considered to be playing.
	 *
	 * Only applies when default implementation of
	 * {@link BaseConnector#isPlaying} is used.
	 *
	 * @type {string}
	 */
	this.playButtonSelector = null;

	/**
	 * Selector of a container closest to the player. Changes on this element
	 * will be observed and dispatched to {@link BaseConnector#onStateChanged}.
	 *
	 * Set this selector to use with default {@link MutationEvent} observing or
	 * set up some custom detection of player state changing.
	 *
	 * @type {string}
	 */
	this.playerSelector = null;

	/**
	 * Selector of image used to represent the track being played. is used for
	 * the notification service.
	 *
	 * If not specified will fall back to Last.fm API.
	 *
	 * @type {string}
	 */
	this.trackArtImageSelector = null;

	/**
	 * Default implementation of artist name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Song artist
	 */
	this.getArtist = function () {
		return $(this.artistSelector).text();
	};

	/**
	 * Default implementation of track name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Song title
	 */
	this.getTrack = function () {
		return $(this.trackSelector).text();
	};

	/**
	 * Default implementation of album name lookup by selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @returns {String} Song album
	 */
	this.getAlbum = function () {
		return $(this.albumSelector).text();
	};

	/**
	 * Default implementation of track duration lookup. If this method returns
	 * an empty result, the track duration loaded from L.FM will be used.
	 *
	 * While it's not generally needed, override this method for more
	 * complex behaviour.
	 *
	 * @return {Number} Track length in seconds
	 */
	this.getDuration = function () {
		var text = $(this.durationSelector).text();
		return Util.stringToSeconds(text);
	};

	/**
	 * Default implementation of track current time lookup by selector with
	 * some basic parsing.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Number} Number of seconds passed from the beginning of the track
	 */
	this.getCurrentTime = function () {
		var text = $(this.currentTimeSelector).text();
		return Util.stringToSeconds(text);
	};

	/**
	 * Default implementation of current time and duration lookup by selector.
	 * This method is called only when {@link BaseConnector#getArtist} and
	 * {@link BaseConnector#getTrack} return an empty result.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Object} Object contains current time and duration info
	 */
	this.getTimeInfo = function () {
		var text = $(this.timeInfoSelector).text();
		return Util.splitTimeInfo(text);
	};

	/**
	 * Default implementation of artist and track name lookup by selector.
	 * This method is called only when either {@link BaseConnector#getArtist} or
	 * {@link BaseConnector#getTrack} returns an empty result.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {Object} Object contain artist and track information
	 */
	this.getArtistTrack = function () {
		var text = $(this.artistTrackSelector).text();
		return Util.splitArtistTrack(text);
	};

	/**
	 * Returns a unique identifier of current track. The identifier does not
	 * have to be in any specific format. The uniqueness is only needed within
	 * the scope of the connector (values are internally namespaced by connector
	 * names).
	 *
	 * The value is used for storing the track metadata and reusing them later.
	 * Connectors which will implement this method will allow its users to store
	 * custom metadata where otherwise the track would be unrecognized.
	 *
	 * It is strongly recommended for connector authors to implement this method
	 * when possible.
	 *
	 * @return {String} Song unique ID
	 */
	this.getUniqueID = function () {
		return null;
	};

	/**
	 * Default implementation of check for active playback by play button
	 * selector. The state of playback allows the core to detect pauses.
	 *
	 * Returns TRUE as default when button selector is not specified. It's
	 * better to assume the playback is always playing than otherwise. :)
	 *
	 * Override this method for custom behaviour.
	 *
	 * @return {Boolean} True if song is now playing; false otherwise
	 */
	this.isPlaying = function () {
		return this.playButtonSelector === null || !$(this.playButtonSelector).is(':visible');
	};

	/**
	 * Default implementation used to get the track art URL from the selector.
	 *
	 * Override this method for more complex behaviour.
	 *
	 * @return {String} Track art URL
	 */
	this.getTrackArt = function () {
		if (this.trackArtImageSelector) {
			let imageUrl = $(this.trackArtImageSelector).attr('src');
			if (imageUrl) {
				return imageUrl;
			}

			let cssProperties = ['background-image', 'background'];
			for (let property of cssProperties) {
				let propertyValue = $(this.trackArtImageSelector).css(property);
				if (propertyValue) {
					return Util.extractUrlFromCssProperty(propertyValue);
				}
			}
		}

		return null;
	};

	/**
	 * Default implementation of a check to see if a state change is allowed.
	 * MutationObserver will ignore mutations while this function returns false.
	 *
	 * Override this method to allow certain states to be ignored, for example
	 * if an advert is playing.
	 *
	 * @return {Boolean} True if state change is allowed; false otherwise
	 */
	this.isStateChangeAllowed = function () {
		return true;
	};

	/**
	 * Filter object used to filter song metadata.
	 *
	 * @see {link MetadataFilter}
	 * @type {MetadataFilter}
	 */
	this.filter = MetadataFilter.getTrimFilter();

	/**
	 * State & API.
	 */

	/**
	 * Gathered info about the current track for internal use of
	 * baseconnector only.
	 */
	var currentState = {
		track: null,
		artist: null,
		album: null,
		uniqueID: null,
		duration: null,
		currentTime: 0,
		isPlaying: true
	};

	/**
	 * Callback set by the reactor to listen on state changes of this connector.
	 *
	 * Custom connectors are NOT supposed to set this property.
	 *
	 * @type {Function}
	 */
	this.reactorCallback = null;

	/**
	 * Function for all the hard work around detecting and updating state.
	 */
	var stateChangedWorker = function () {
		var changedFields = [];

		var newTrack = this.getTrack() || null;
		var newArtist = this.getArtist() || null;

		var artistTrack = this.getArtistTrack() || Util.emptyArtistTrack;
		if (newArtist === null && artistTrack.artist) {
			newArtist = artistTrack.artist;
		}
		if (newTrack === null && artistTrack.track) {
			newTrack = artistTrack.track;
		}

		newTrack = this.filter.filterTrack(newTrack) || null;
		if (newTrack !== currentState.track) {
			currentState.track = newTrack;
			changedFields.push('track');
		}

		newArtist = this.filter.filterArtist(newArtist) || null;
		if (newArtist !== currentState.artist) {
			currentState.artist = newArtist;
			changedFields.push('artist');
		}

		var newAlbum = this.getAlbum();
		newAlbum = this.filter.filterAlbum(newAlbum) || null;
		if (newAlbum !== currentState.album) {
			currentState.album = newAlbum;
			changedFields.push('album');
		}

		var newUID = this.getUniqueID() || null;
		if (newUID !== currentState.uniqueID) {
			currentState.uniqueID = newUID;
			changedFields.push('uniqueID');
		}

		var newDuration = Util.escapeBadTimeValues(this.getDuration());
		var newCurrentTime = Util.escapeBadTimeValues(this.getCurrentTime());

		var timeInfo = this.getTimeInfo();
		if (!newDuration !== null && timeInfo.duration) {
			newDuration = timeInfo.duration;
		}
		if (newCurrentTime !== null && timeInfo.currentTime) {
			newCurrentTime = timeInfo.currentTime;
		}

		if (newDuration !== currentState.duration) {
			currentState.duration = newDuration;
			changedFields.push('duration');
		}

		if (newCurrentTime !== currentState.currentTime) {
			currentState.currentTime = newCurrentTime;
			changedFields.push('currentTime');
		}

		var newIsPlaying = this.isPlaying();
		if (newIsPlaying !== currentState.isPlaying) {
			currentState.isPlaying = newIsPlaying;
			changedFields.push('isPlaying');
		}

		var newTrackArt = this.getTrackArt() || null;
		if (newTrackArt !== currentState.trackArt) {
			currentState.trackArt = newTrackArt;
			changedFields.push('trackArt');
		}

		// take action if needed
		if (changedFields.length > 0) {
			if (this.reactorCallback !== null) {
				this.reactorCallback(currentState, changedFields);
			}

			// @ifdef DEBUG
			var isNewSongPlaying = (changedFields.length > 1) &&
				(currentState.artist && currentState.track);
			// Report for scrobble testing
			if (isNewSongPlaying) {
				TestReporter.reportSongRecognition(currentState);
			}
			// @endif
		}

	}.bind(this);

	/**
	 * Throttled call for state changed worker.
	 */
	var stateChangedWorkerThrottled = _.throttle(stateChangedWorker, 500);

	/**
	 * Listener for the player state changes. Automatically detects the state,
	 * collects the track metadata and communicates with the background script
	 * if needed.
	 *
	 * Connectors are NOT supposed to override this method.
	 */
	this.onStateChanged = function () {
		if (!this.isStateChangeAllowed()) {
			return;
		}

		/**
		 * Because gathering the state from DOM is quite expensive and mutation
		 * events can be emitted REALLY often, we use throttle to set a minimum
		 * delay between two calls of the state change listener.
		 *
		 * Only exception is change in pause/play state which we detect
		 * immediately so we don't miss a quick play/pause/play or
		 * pause/play/pause sequence.
		 */
		var isPlaying = this.isPlaying();
		if (isPlaying !== currentState.isPlaying) {
			stateChangedWorker();
		} else {
			stateChangedWorkerThrottled();
		}
	}.bind(this);

	/**
	 * Send request to core to reset current state. Should be used if connector
	 * has custom state change listener.
	 *
	 * Connectors are NOT supposed to override this method.
	 */
	this.resetState = function() {
		if (this.reactorCallback !== null) {
			// TODO: passs 'changedFields' parameter
			this.reactorCallback({});
		}
	}.bind(this);
};

window.BaseConnector = BaseConnector;

/**
 * Create object to be overridden in specific connector implementation
 * @type {BaseConnector}
 */
let Connector;
if (window.Connector) {
	Connector = window.Connector;
} else {
	Connector = new BaseConnector();
	window.Connector = Connector;
}
