import { Howl, Howler } from 'howler';
import { Runtime } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey, NixSound, NixSoundConfig } from '../../types';
import { stopNixSound } from '../../util/howler';
import { allSounds } from '../config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onMessage(runtimeMsg: unknown, _sender: Runtime.MessageSender): Promise<unknown> {
	const { message, payload } = runtimeMsg as NixMessage;

	switch (message as NixMessageKey) {
		case NixMessageKey.SOUND_LIST_ALL: {
			return Promise.resolve(
				Object.keys(allSounds).map(
					(k): NixSoundConfig => {
						const sound = allSounds[k as NixSound];

						return {
							name: sound.name,
							displayName: sound.displayName,
							file: '',
							howl: null,
							playing: sound.playing,
						} as NixSoundConfig;
					}
				)
			);
		}
		case NixMessageKey.SOUND_PLAY_NAMED: {
			const nixSound: NixSoundConfig = allSounds[payload as NixSound];

			if (nixSound) {
				if (!nixSound.howl) {
					nixSound.howl = new Howl({ src: nixSound.file, loop: true });
				}

				nixSound.playing = true;
				nixSound.howl.play();
			}

			break;
		}
		case NixMessageKey.SOUND_STOP_NAMED: {
			stopNixSound(allSounds[payload as NixSound]);
			break;
		}
		case NixMessageKey.SOUND_STOP_ALL: {
			Howler.mute(true);
			Object.values(allSounds).forEach(stopNixSound);
			break;
		}
		default:
			break;
	}

	return Promise.resolve();
}
