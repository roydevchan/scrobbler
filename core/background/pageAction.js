'use strict';

/**
 * Defines an object for access to page action of a single controller (tab)
 */
define([], function() {

	/**
	 * Constructor
	 *
	 * @param {Number} tabId
	 */
	return function(tabId) {

		var icons = {
			BASE: '/icons/page_action_base.png',
			RECOGNIZED: '/icons/page_action_note.png',
			DISABLED: '/icons/page_action_disabled.png',
			SCROBBLED: '/icons/page_action_tick.png',
			UNKNOWN: '/icons/page_action_question.png'
		};

		var documents = {
			BASE: '/popups/go_play_music.html'
		};

		/**
		 * Helper function to set icon, title and popup in single call
		 */
		function setPageAction(icon, title, popup) {
			chrome.pageAction.hide(tabId);
			chrome.pageAction.setIcon({
				tabId: tabId,
				path: icon
			});
			chrome.pageAction.setTitle({
				tabId: tabId,
				title: title
			});
			chrome.pageAction.setPopup({
				tabId: tabId,
				popup: popup
			});
			chrome.pageAction.show(tabId);
		}



		this.onClicked = function() {
			console.log('Page action clicked in tab ' + tabId);
		};


		this.setSiteSupported = function() {
			setPageAction(icons.BASE, 'This site is supported for scrobbling', documents.BASE);
		};

		/**
		 * @param {can.Map} songObj
		 */
		this.setSongRecognized = function(songObj) {
			setPageAction(icons.RECOGNIZED, 'Now playing ' + songObj.getArtist() + ' - ' + songObj.getTrack(), '');
		};

		this.setSongRecognizedDisabled = function() {
			setPageAction(icons.DISABLED, 'Current song will not be scrobbled', '');
		};

		this.setSongScrobbled = function(song) {
			setPageAction(icons.SCROBBLED, 'Scrobbled ' + song.getArtist() + ' - ' + song.getTrack(), '');
		};

		this.setSongNotRecognized = function() {
			setPageAction(icons.UNKNOWN, 'The song was not recognized. Click to enter correct info', 'popup.html');
		};

	};

});
