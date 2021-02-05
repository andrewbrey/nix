import { Howl, Howler } from 'howler';
import { Runtime } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey, NixSound, NixSoundConfig } from '../../types';
import { saveCurrentMix, stopNixSound } from '../../util/sounds';
import { allSounds } from '../config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function onMessage(runtimeMsg: unknown, _sender: Runtime.MessageSender): Promise<unknown> {
	const { message, payload } = runtimeMsg as NixMessage;

	switch (message as NixMessageKey) {
		case NixMessageKey.SOUND_LIST_ALL: {
			const completeList = Object.values(allSounds).map(
				(sound): NixSoundConfig =>
					({
						name: sound.name,
						displayName: sound.displayName,
						file: '',
						howl: null,
						playing: sound.playing,
					} as NixSoundConfig)
			);

			return Promise.resolve(completeList);
		}
		case NixMessageKey.SOUND_PLAY_NAMED: {
			Howler.mute(false);

			const nixSound: NixSoundConfig = allSounds[payload as NixSound];

			if (nixSound) {
				if (!nixSound.howl) {
					nixSound.howl = new Howl({ src: nixSound.file, loop: true });
				}

				if (!nixSound.playing) {
					nixSound.playing = true;
					nixSound.howl.play();
				}

				await saveCurrentMix(allSounds);
			}

			break;
		}
		case NixMessageKey.SOUND_STOP_NAMED: {
			const nixSound: NixSoundConfig = allSounds[payload as NixSound];

			stopNixSound(nixSound);
			await saveCurrentMix(allSounds);
			break;
		}
		case NixMessageKey.SOUND_STOP_ALL: {
			Howler.mute(true);
			await saveCurrentMix(allSounds, true);
			Object.values(allSounds).forEach(stopNixSound);
			break;
		}
		default:
			break;
	}

	return Promise.resolve();
}
