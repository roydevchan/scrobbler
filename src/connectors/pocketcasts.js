'use strict';

Connector.playerSelector = '.player-controls';
Connector.artistSelector = '.podcast-title';
Connector.trackSelector = '.episode-title';
Connector.playButtonSelector = '.play_button';
Connector.currentTimeSelector = '.current-time';
Connector.remainingTimeSelector = '.time-remaining';
Connector.trackArtSelector = '.player-image img';

const origGetRemainingTime = Connector.getRemainingTime;

// PocketCasts displays time as -MM:SS, so we return the negative
Connector.getRemainingTime = () => -origGetRemainingTime();
Connector.isPodcast = () => true;
