'use strict';

/* global Connector, MetadataFilter, Util */

/**
 * Allow or disallow to scrobble videos that are in Music category only.
 * @type {Boolean}
 */
let scrobbleMusicOnly = false;

/**
 * CSS selector of video element. It's common for both players.
 * @type {String}
 */
const videoSelector = '.html5-main-video';

/**
 * Setup connector according to current Youtube design.
 * This function is called on connector inject.
 */
function setupConnector() {
	setupGeneralProperties();
	readConnectorOptions();

	if (isDefaultPlayer()) {

		if (isViewTubeInstalled()) {
			setupDefaultPlayer();
			applyViewTubeFixes();
		} else {
			setupBasePlayer();
			setupDefaultPlayer();
		}
	} else {
		setupBasePlayer();
		setupMaterialPlayer();
	}
}

/**
 * Check if default player on the page.
 * @return {Boolean} True if default player is on the page; false otherwise
 */
function isDefaultPlayer() {
	return $('ytd-app').length === 0;
}

/**
 * Check if ViewTube script is installed.
 * ViewTube script uses another player instead of Youtube default one.
 * @return {Boolean} True if ViewTube script is installed; false otherwise
 */
function isViewTubeInstalled() {
	return $('select[title]').length > 0;
}

/**
 * Setup default Youtube player.
 */
function setupDefaultPlayer() {
	Connector.getArtistTrack = function () {
		let videoTitle = $('.ytp-title-link').text();
		return Util.processYoutubeVideoTitle(videoTitle);
	};

	/**
	 * Check if player is off screen.
	 *
	 * YouTube doesn't really unload the player. It simply moves it outside
	 * viewport. That has to be checked, because our selectors are still able
	 * to detect it.
	 *
	 * @return {Boolean} True if player is off screen; false otherwise
	 */
	Connector.isPlayerOffscreen = function() {
		if (Connector.isFullscreenMode()) {
			return false;
		}

		let $player = $('#player-api');
		if ($player.length === 0) {
			return false;
		}

		let offset = $player.offset();
		return offset.left < 0 || offset.top < 0;
	};
}

let categoryCache = new Map();
const CATEGORY_MUSIC = 10;
const YT_API_KEY = 'AIzaSyApDdf5_bvYEq0CjiwKJ_VRo3CrAT3HscQ';

function getVideoCategory(videoId) {
	if (!categoryCache.has(videoId)) {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;
		$.getJSON(url)
			.then((data) => {
				let category = data.items[0].snippet.categoryId;
				if (typeof category === 'string') {
					categoryCache.set(videoId, parseInt(category));
				}
			});
		return null;
	}
	return categoryCache.get(videoId);

}

/**
 * Setup Material player.
 */
function setupMaterialPlayer() {
	Connector.getArtistTrack = function() {
		/*
		 * Youtube doesn't remove DOM object on AJAX navigation,
		 * so we should not return track data if no song is playing.
		 */
		if (Connector.isPlayerOffscreen()) {
			return Util.emptyArtistTrack;
		}

		let videoTitle = $('.ytp-title-link').text();
		return Util.processYoutubeVideoTitle(videoTitle);
	};

	/**
	 * Check if player is off screen.
	 *
	 * YouTube doesn't really unload the player. It simply moves it outside
	 * viewport. That has to be checked, because our selectors are still able
	 * to detect it.
	 *
	 * @return {Boolean} True if player is off screen; false otherwise
	 */
	Connector.isPlayerOffscreen = function() {
		if (Connector.isFullscreenMode()) {
			return false;
		}

		let $player = $('#player-container');
		if ($player.length === 0) {
			return false;
		}

		let offset = $player.offset();
		return offset.left <= 0 && offset.top <= 0;
	};
}

/**
 * Setup `isPlaying` function if ViewTube player is detected.
 */
function applyViewTubeFixes() {
	Connector.playerSelector = '#page';

	Connector.isPlaying = function() {
		return true;
	};

	Connector.getUniqueID = function() {
		let videoTitle = $('.ytp-title-link').text();
		if (!videoTitle) {
			return null;
		}

		let videoUrl = $('.ytp-title-link').attr('href');
		return Util.getYoutubeVideoIdFromUrl(videoUrl);
	};
}

/**
 * Setup common things for both players.
 */
function setupBasePlayer() {
	setupMutationObserver();

	/*
	 * Because player can be still present in the page, we need to detect
	 * that it's invisible and don't return current time. Otherwise resulting
	 * state may not be considered empty.
	 */
	Connector.getCurrentTime = function() {
		if (Connector.isPlayerOffscreen()) {
			return null;
		}
		return $(videoSelector).prop('currentTime');
	};

	Connector.getDuration = function() {
		if (Connector.isPlayerOffscreen()) {
			return null;
		}
		return $(videoSelector).prop('duration');
	};

	Connector.isPlaying = function() {
		return $('.html5-video-player').hasClass('playing-mode');
	};

	Connector.getUniqueID = function() {
		/*
		 * Youtube doesn't remove DOM object on AJAX navigation,
		 * so we should not return track data if no song is playing.
		 */
		if (Connector.isPlayerOffscreen()) {
			return null;
		}

		/*
		 * Youtube doesn't update video title immediately in fullscreen mode.
		 * We don't return video ID until video title is shown.
		 */
		if (Connector.isFullscreenMode()) {
			let videoTitle = $('.ytp-title-link').text();
			if (!videoTitle) {
				return null;
			}
		}

		let videoUrl = $('.ytp-title-link').attr('href');
		return Util.getYoutubeVideoIdFromUrl(videoUrl);
	};

	Connector.isStateChangeAllowed = function() {
		if ($('.videoAdUi').length > 0) {
			return false;
		}

		if (!scrobbleMusicOnly) {
			return true;
		}

		const params = new URLSearchParams(document.location.search.substring(1));
		const videoId = params.get('v');
		let videoCategory = getVideoCategory(videoId);
		if (videoCategory !== null) {
			return videoCategory === CATEGORY_MUSIC;
		}

		return false;
	};

	function setupMutationObserver() {
		let isStateReset = false;
		let isEventListenerSetUp = false;

		let playerObserver = new MutationObserver(function() {
			if (Connector.isPlayerOffscreen()) {
				if (!isStateReset) {
					Connector.resetState();
					isStateReset = true;
				}
			} else if ($(videoSelector).length > 0) {
				isStateReset = false;

				if (isEventListenerSetUp) {
					return;
				}

				$(videoSelector).on('timeupdate', Connector.onStateChanged);
				isEventListenerSetUp = true;

				console.log('Web scrobbler: setup "timeupdate" event');
			}
		});

		playerObserver.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: false,
			characterData: false
		});
	}
}

function setupGeneralProperties() {
	Connector.filter = MetadataFilter.getYoutubeFilter();

	Connector.isFullscreenMode = function() {
		return $('.html5-video-player').hasClass('ytp-fullscreen');
	};
}

/**
 * Asynchronously read connector options.
 */
function readConnectorOptions() {
	chrome.storage.local.get('Connectors', function(data) {
		if (data && data.Connectors && data.Connectors.YouTube) {
			let options = data.Connectors.YouTube;
			if (options.scrobbleMusicOnly === true) {
				scrobbleMusicOnly = true;
			}

			console.log(`connector options: ${JSON.stringify(options)}`);
		}
	});
}

setupConnector();
