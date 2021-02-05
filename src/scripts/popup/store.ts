import { BoolUnit, ListUnit } from '@activejs/core';
import { isArray, isBoolean } from 'lodash';
import { browser, Storage } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey, NixSelectedSound, NixSoundConfig, NixState } from '../types';
import { DEFAULT_NIX_STATE, NIX_LAST_MIX_STOPPED_KEY, NIX_SELECTED_SOUNDS_KEY, noop } from '../util/shared';

export const allSounds = new ListUnit<NixSoundConfig>();
export const mostRecentMix = new ListUnit<NixSelectedSound>();
export const lastMixStopped = new BoolUnit();

export const stopActiveMix = () => {
	browser.runtime
		.sendMessage({ message: NixMessageKey.SOUND_STOP_ALL } as NixMessage)
		.then(noop)
		.catch(noop);
};

export const restartActiveMix = () => {
	mostRecentMix.forEvery(s =>
		browser.runtime
			.sendMessage({ message: NixMessageKey.SOUND_PLAY_NAMED, payload: s.sound } as NixMessage)
			.then(noop)
			.catch(console.error)
	);
};

browser.runtime
	.sendMessage({ message: NixMessageKey.SOUND_LIST_ALL } as NixMessage)
	.then((sounds: NixSoundConfig[]) => allSounds.dispatch(sounds))
	.catch(noop);

browser.storage.local
	.get({ ...DEFAULT_NIX_STATE })
	.then(nixState => {
		mostRecentMix.dispatch((nixState as NixState).selectedSounds);
		lastMixStopped.dispatch((nixState as NixState).lastMixStopped);
	})
	.catch(console.error);

browser.storage.onChanged.addListener((changes: Record<string, Storage.StorageChange>) => {
	if (isArray(changes[NIX_SELECTED_SOUNDS_KEY]?.newValue)) {
		mostRecentMix.dispatch(changes[NIX_SELECTED_SOUNDS_KEY]?.newValue as NixSelectedSound[]);
	}

	if (isBoolean(changes[NIX_LAST_MIX_STOPPED_KEY]?.newValue)) {
		lastMixStopped.dispatch(changes[NIX_LAST_MIX_STOPPED_KEY]?.newValue);
	}
});
