'use strict';

let currentState = {};
let isPlaying = false;

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getCurrentState = () => currentState;

Connector.onScriptEvent = (event) => {
	switch (event.data.type) {
		case 'start':
			isPlaying = true;
			break;
		case 'stop':
		case 'pause':
			isPlaying = false;
			break;
	}

	currentState = event.data.trackInfo;
	currentState.isPlaying = isPlaying;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/vk-dom-inject.js');
