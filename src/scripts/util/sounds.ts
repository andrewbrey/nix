import { browser } from 'webextension-polyfill-ts';
import { AvailableNixSounds, NixSelectedSound, NixSoundConfig, NixState } from '../types';
import { noop } from './shared';

export function stopNixSound(nixSound: NixSoundConfig): void {
	if (nixSound) {
		nixSound.howl?.unload();
		nixSound.playing = false;
		nixSound.howl = null;
	}
}

export async function saveCurrentMix(availableSounds: AvailableNixSounds, stopCalled = false) {
	const nixState: NixState = {
		lastMixStopped: stopCalled,
		selectedSounds: Object.values(availableSounds)
			.filter(s => s.playing)
			.map(s => ({ sound: s.name, level: 100 } as NixSelectedSound)),
	};

	await browser.storage.local.set(nixState).then(noop).catch(console.error);
}
