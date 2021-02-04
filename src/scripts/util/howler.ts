import { NixSoundConfig } from '../types';

export function stopNixSound(nixSound: NixSoundConfig): void {
	if (nixSound) {
		nixSound.howl?.unload();
		nixSound.playing = false;
		nixSound.howl = null;
	}
}
