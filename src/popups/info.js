'use strict';

require(['util'], (Util) => {
	const EDITED_TRACK_FIELDS = ['artist', 'track', 'album'];
	const FIELD_URL_MAP = {
		artist: 'artistUrl',
		track: 'trackUrl',
		album: 'albumUrl'
	};

	let isEditModeEnabled = false;
	let song = null;

	function getCurrentSong() {
		return sendMessageToCurrentTab('REQUEST_GET_SONG');
	}

	function sendMessageToCurrentTab(type, data) {
		return Util.getCurrentTab().then((tab) => {
			let tabId = tab.id;
			return new Promise((resolve) => {
				chrome.runtime.sendMessage({ type, data, tabId }, resolve);
			});
		});
	}

	function onSongLoaded() {
		if (song === null) {
			return;
		}

		updatePopupView();

		let isSongValid = song.flags.isValid || song.flags.isCorrectedByUser;
		setEditMode(!isSongValid);
	}

	function setEditMode(flag) {
		isEditModeEnabled = flag;

		$('#info').attr('data-hide', isEditModeEnabled);
		$('#edit').attr('data-hide', !isEditModeEnabled);
		if (isEditModeEnabled) {
			fillMetadataInputs();
			$('input').first().focus();
		}

		updateControls();
	}

	function isSongMetadataChanged() {
		if (!song.flags.isValid) {
			return true;
		}

		let trackInfo = getTrackInfo();
		for (let field in trackInfo) {
			let fieldInputSelector = `#${field}-input`;
			let inputText = $(fieldInputSelector).val();
			if (!inputText) {
				continue;
			}

			let fieldValue = trackInfo[field];
			if (fieldValue !== inputText) {
				return true;
			}
		}

		return false;
	}

	function fillMetadataLabels(trackInfo) {
		for (let field of EDITED_TRACK_FIELDS) {
			let fieldValue = trackInfo[field];
			let fieldLabelSelector = `#${field}`;

			let fieldUrl = song.metadata[FIELD_URL_MAP[field]];
			if (fieldUrl) {
				let fieldTitleTag;
				switch (field) {
					case 'artist':
						fieldTitleTag = 'infoViewArtistPage';
						break;
					case 'track':
						fieldTitleTag = 'infoViewTrackPage';
						break;
					case 'album':
						fieldTitleTag = 'infoViewAlbumPage';
						break;
				}

				$(fieldLabelSelector).attr('href', fieldUrl);
				$(fieldLabelSelector).attr('title', i18n(fieldTitleTag));
			} else {
				$(fieldLabelSelector).removeAttr('href');
			}

			$(fieldLabelSelector).text(fieldValue);
			$(fieldLabelSelector).attr('data-hide', !fieldValue);
		}
	}

	function fillMetadataInputs() {
		let trackInfo = getTrackInfo();
		for (let field of EDITED_TRACK_FIELDS) {
			let fieldValue = trackInfo[field];
			let fieldInputSelector = `#${field}-input`;

			$(fieldInputSelector).val(fieldValue);
		}
	}

	function fillAlbumCover() {
		$('#album-art').css('background-image', `url("${getCoverArt()}")`);
	}

	function getTrackInfo() {
		let trackInfo = {};

		for (let field of EDITED_TRACK_FIELDS) {
			trackInfo[field] = song.processed[field] || song.parsed[field];
		}

		return trackInfo;
	}

	function getEditedTrackInfo() {
		let trackInfo = {};

		for (let field of EDITED_TRACK_FIELDS) {
			let fieldInputSelector = `#${field}-input`;
			trackInfo[field] = $(fieldInputSelector).val().trim();
		}

		return trackInfo;
	}

	function configControls() {
		$('#love').off('click');
		$('#love').on('click', function() {
			let currentLoveStatus = $('#love').attr('last-fm-loved') === 'true';
			let desiredLoveStatus = !currentLoveStatus;

			sendMessageToCurrentTab('REQUEST_TOGGLE_LOVE', {
				isLoved: desiredLoveStatus
			}).then((isLoved) => {
				updateLovedIcon(isLoved);
			});
		});

		$('#album-art').off('click');
		$('#album-art').on('click', () => {
			chrome.tabs.create({ url: getCoverArt() });
		});

		if (song.flags.isScrobbled) {
			return;
		}

		if (song.flags.isCorrectedByUser) {
			$('#revert-link').off('click');
			$('#revert-link').on('click', () => {
				sendMessageToCurrentTab('REQUEST_RESET_SONG');
				window.close();
			});
		}

		$('#edit-link').off('click');
		$('#swap-link').off('click');
		$('#skip-link').off('click');

		if (!song.flags.isSkipped) {
			$('#edit-link').on('click', () => {
				if (isEditModeEnabled) {
					setEditMode(false);
					correctSongInfo();
				} else {
					setEditMode(true);
				}
			});
			$('#swap-link').on('click', () => {
				swapTitleAndArtist();
			});
			$('#skip-link').on('click', () => {
				skipSong();

				configControls();
				updateControls();
			});
		}

		$('#edit input').off('keyup');
		$('#edit input').on('keyup', (e) => {
			let isDataComplete = isSongDataComplete();
			let isEnterKey = e.which === 13;

			if (isEnterKey && isDataComplete) {
				setEditMode(false);
				correctSongInfo();

				return;
			}

			setControlEnabled('#edit-link', !isDataComplete);
			setControlEnabled('#swap-link', !isDataComplete);
		});
	}

	function updateLovedIcon(isLoved) {
		$('#love').attr('last-fm-loved', isLoved);
		$('#love').attr('title', i18n(isLoved ? 'infoUnlove' : 'infoLove'));
	}

	function updatePopupView() {
		fillMetadataLabels(getTrackInfo());
		fillAlbumCover();

		configControls();
		updateControls();

		updateLovedIcon(song.metadata.userloved);
	}

	function updateControls() {
		$('#edit-link').text(i18n(isEditModeEnabled ? 'infoSubmit' : 'infoEdit'));
		setControlEnabled('#edit-link', song.flags.isSkipped ||
			song.flags.isScrobbled);

		$('#swap-link').text(i18n('infoSwap'));
		$('#swap-link').attr('data-hide', !isEditModeEnabled);
		setControlEnabled('#swap-link', song.flags.isScrobbled ||
			song.flags.isSkipped);

		$('#revert-link').text(i18n('infoRevert'));
		$('#revert-link').attr('data-hide', !song.flags.isCorrectedByUser
			|| isEditModeEnabled);
		setControlEnabled('#revert-link', song.flags.isScrobbled ||
			!song.flags.isCorrectedByUser);

		$('#skip-link').text(i18n('infoSkip'));
		$('#skip-link').attr('data-hide', isEditModeEnabled);
		setControlEnabled('#skip-link', song.flags.isSkipped ||
			song.flags.isScrobbled);

		if (song.flags.isScrobbled) {
			$('#edit-link').attr('title', i18n('infoEditUnableTitle'));
			$('#swap-link').attr('title', i18n('infoSwapUnableTitle'));
			$('#revert-link').attr('title', i18n('infoRevertUnableTitle'));
			$('#skip-link').attr('title', i18n('infoSkipUnableTitle'));
		} else if (song.flags.isSkipped) {
			$('#edit-link').attr('title', i18n('infoEditSkippedTitle'));
			$('#swap-link').attr('title', i18n('infoSwapSkippedTitle'));
			$('#skip-link').attr('title', i18n('infoSkipAlreadyTitle'));
		} else {
			$('#edit-link').attr('title', i18n('infoEditTitle'));
			$('#swap-link').attr('title', i18n('infoSwapTitle'));
			$('#revert-link').attr('title', i18n('infoRevertTitle'));
			$('#skip-link').attr('title', i18n('infoSkipTitle'));
		}
	}

	function correctSongInfo() {
		if (isSongMetadataChanged()) {
			let trackInfo = getEditedTrackInfo();

			fillMetadataLabels(trackInfo);
			sendMessageToCurrentTab('REQUEST_CORRECT_SONG', trackInfo);
		}
	}

	function skipSong() {
		song.flags.isSkipped = true;
		sendMessageToCurrentTab('REQUEST_SKIP_SONG');
	}

	function setupMessageListener() {
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type !== 'EVENT_SONG_UPDATED') {
				return;
			}

			Util.getCurrentTab().then((tab) => {
				if (tab.id !== request.tabId) {
					return;
				}

				song = request.data;
				updatePopupView();
			});
		});
	}

	function getCoverArt() {
		return song.parsed.trackArt || song.metadata.artistThumbUrl ||
			'/icons/cover_art_default.png';
	}

	function swapTitleAndArtist() {
		if (song.flags.isSkipped || song.flags.isScrobbled ||
			!isEditModeEnabled) {
			return;
		}

		let title = $('#track-input').val();
		let artist = $('#artist-input').val();

		$('#track-input').val(artist);
		$('#artist-input').val(title);

		setEditMode(false);
		correctSongInfo();
	}

	function i18n(tag, ...context) {
		return chrome.i18n.getMessage(tag, context);
	}

	function isSongDataComplete() {
		let title = $('#track-input').val();
		let artist = $('#artist-input').val();

		return artist && title;
	}

	function setControlEnabled(selector, state) {
		$(selector).attr('data-disable', state);
		$(selector).prop('disabled', state);
	}

	function main() {
		setupMessageListener();
		getCurrentSong().then((result) => {
			song = result;
			onSongLoaded();
		});
	}

	$(document).ready(main);
});
