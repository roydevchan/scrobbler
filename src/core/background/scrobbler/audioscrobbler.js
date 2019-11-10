'use strict';

define((require) => {
	const MD5 = require('md5');
	const Util = require('util/util');
	const BaseScrobbler = require('scrobbler/base');
	const ServiceCallResult = require('object/service-call-result');

	const AUDIOSCROBBLER_OPTIONS = [
		/**
		 * Service API key.
		 * @type {String}
		 */
		'apiKey',
		/**
		 * Service API secret.
		 * @type {String}
		 */
		'apiSecret'
	];

	class AudioScrobbler extends BaseScrobbler {
		/** @override */
		constructor(options) {
			super(options);

			this.applyOptions(options, AUDIOSCROBBLER_OPTIONS);
		}

		/** @override */
		async getAuthUrl() {
			/*
			 * Stores the new obtained token into storage so it will be traded for
			 * a new session when needed. Because of this it is necessary this method
			 * is called only when user is really going to approve the token and
			 * not sooner. Otherwise use of the token would result in an unauthorized
			 * request.
			 *
			 * See http://www.last.fm/api/show/auth.getToken
			 */

			let params = {
				method: 'auth.gettoken',
			};
			let token = null;
			let data = await this.storage.get();

			try {
				let responseData = await this.sendRequest({ method: 'GET' }, params, false);
				token = responseData.token;
			} catch (err) {
				this.debugLog('Error acquiring a token', 'warn');

				throw new Error('Error acquiring a token');
			}

			data.token = token;

			// set token and reset session so we will grab a new one
			delete data.sessionID;
			delete data.sessionName;
			await this.storage.set(data);

			return `${this.authUrl}?api_key=${this.apiKey}&token=${token}`;
		}

		/** @override */
		async getSession() {
			/*
			 * Load session data from storage. Get new session data if previously
			 * saved session data is missing.
			 *
			 * If there is a stored token it is preferably traded for a new session
			 * which is then returned.
			 */

			let data = await this.storage.get();

			/*
			 * if we have a token it means it is fresh and we
			 * want to trade it for a new session ID
			 */
			let token = data.token || null;
			if (token !== null) {
				let session = {};

				try {
					session = await this.tradeTokenForSession(token);
				} catch (err) {
					this.debugLog('Failed to trade token for session', 'warn');

					await this.signOut();
					throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
				}

				data.sessionID = session.sessionID;
				data.sessionName = session.sessionName;
				delete data.token;
				await this.storage.set(data);

				return session;
			} else if (!data.sessionID) {
				throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
			}

			return {
				sessionID: data.sessionID,
				sessionName: data.sessionName
			};
		}

		/** @override */
		async isReadyForGrantAccess() {
			let data = await this.storage.get();
			return data.token;
		}

		/** @override */
		async sendNowPlaying(song) {
			let { sessionID } = await this.getSession();
			let params = {
				method: 'track.updatenowplaying',
				track: song.getTrack(),
				artist: song.getArtist(),
				api_key: this.apiKey,
				sk: sessionID
			};

			if (song.getAlbum()) {
				params.album = song.getAlbum();
			}

			if (song.getAlbumArtist()) {
				params.albumArtist = song.getAlbumArtist();
			}

			if (song.getDuration()) {
				params.duration = song.getDuration();
			}

			let response = await this.sendRequest({ method: 'POST' }, params, true);
			return AudioScrobbler.processResponse(response);
		}

		/** @override */
		async scrobble(song) {
			let { sessionID } = await this.getSession();
			let params = {
				method: 'track.scrobble',
				'timestamp[0]': song.metadata.startTimestamp,
				'track[0]': song.getTrack(),
				'artist[0]': song.getArtist(),
				sk: sessionID
			};

			if (song.getAlbum()) {
				params['album[0]'] = song.getAlbum();
			}

			if (song.getAlbumArtist()) {
				params['albumArtist[0]'] = song.getAlbumArtist();
			}

			let response = await this.sendRequest({ method: 'POST' }, params, true);

			let result = AudioScrobbler.processResponse(response);
			if (result.isOk()) {
				const scrobbles = response.scrobbles;

				if (scrobbles) {
					let acceptedCount = scrobbles['@attr'].accepted;
					if (acceptedCount === '0') {
						return new ServiceCallResult(ServiceCallResult.IGNORED);
					}
				} else {
					return new ServiceCallResult(ServiceCallResult.ERROR);
				}
			}

			return result;
		}

		/** @override */
		async toggleLove(song, isLoved) {
			let { sessionID } = await this.getSession();
			let params = {
				method: isLoved ? 'track.love' : 'track.unlove',
				track: song.getTrack(),
				artist: song.getArtist(),
				sk: sessionID
			};

			let response = await this.sendRequest({ method: 'POST' }, params, true);
			return AudioScrobbler.processResponse(response);
		}

		/** @override */
		canLoveSong() {
			return true;
		}

		/** Internal functions. */

		/**
		 * Make a call to API to trade token for session ID.
		 * Assume the token was authenticated by the user.
		 *
		 * @param {String} token Token provided by scrobbler service
		 * @return {Object} Session data
		 */
		async tradeTokenForSession(token) {
			let params = { method: 'auth.getsession', token };

			let response = await this.sendRequest({ method: 'GET' }, params, true);
			let result = AudioScrobbler.processResponse(response);
			if (!result.isOk()) {
				throw new ServiceCallResult(ServiceCallResult.ERROR_AUTH);
			}

			let sessionName = response.session.name;
			let sessionID = response.session.key;

			return { sessionID, sessionName };
		}

		/**
		 * Execute asynchronous request.
		 *
		 * API key will be added to params by default and all parameters will be
		 * encoded for use in query string internally.
		 *
		 * @param  {String} options Fetch options
		 * @param  {Object} params Object of key => value url parameters
		 * @param  {Boolean} signed Should the request be signed?
		 * @return {Object} Parsed response
		 */
		async sendRequest(options, params, signed) {
			const url = this.makeRequestUrl(params, signed);

			const promise = fetch(url, options);
			const timeout = BaseScrobbler.REQUEST_TIMEOUT;

			let response = null;
			let responseData = null;
			try {
				response = await Util.timeoutPromise(timeout, promise);
				responseData = await response.json();
			} catch (e) {
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			}

			let responseStr = JSON.stringify(responseData, null, 2);
			let debugMsg = hideUserData(responseData, responseStr);

			if (!response.ok) {
				this.debugLog(`${params.method} response:\n${debugMsg}`, 'error');
				throw new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			}

			this.debugLog(`${params.method} response:\n${debugMsg}`);
			return responseData;
		}

		/**
		 * Create URL of API request based on API params.
		 * @param  {Object} params Object of key => value url parameters
		 * @param  {Boolean} signed Should the request be signed?
		 * @return {String} URL of API request
		 */
		makeRequestUrl(params, signed) {
			params.api_key = this.apiKey;
			params.format = 'json';

			if (signed) {
				params.api_sig = this.generateSign(params);
			}

			const queryStr = Util.createQueryString(params);
			return `${this.apiUrl}?${queryStr}`;
		}

		/**
		 * Compute string for signing request.
		 * See http://www.last.fm/api/authspec#8
		 * @param  {Object} params Parameters of API method
		 * @return {String} Signed parameters
		 */
		generateSign(params) {
			let keys = Object.keys(params).sort();
			let o = '';

			for (let key of keys) {
				if (['format', 'callback'].includes(key)) {
					continue;
				}

				o += key + params[key];
			}

			return MD5(o + this.apiSecret);
		}

		/**
		 * Process response and return service call result.
		 * @param  {Object} responseData Response data
		 * @return {Object} Response result
		 */
		static processResponse(responseData) {
			if (responseData.error) {
				return new ServiceCallResult(ServiceCallResult.ERROR_OTHER);
			}

			return new ServiceCallResult(ServiceCallResult.OK);
		}
	}

	/**
	 * Hide sensitive user data from debug output.
	 * @param  {Object} response Response data
	 * @param  {String} text Debug message
	 * @return {String} Text with hidden data
	 */
	function hideUserData(response, text) {
		let debugMsg = text;

		const sensitiveValues = [response.token];
		const session = response.session;
		if (session) {
			sensitiveValues.push(session.name);
			sensitiveValues.push(session.key);
		}

		for (const value of sensitiveValues) {
			if (value) {
				debugMsg = Util.hideStringInText(value, debugMsg);
			}
		}

		return debugMsg;
	}

	return AudioScrobbler;
});
