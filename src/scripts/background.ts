import { Howl, Howler } from 'howler';
import { browser } from 'webextension-polyfill-ts';
import { NixCommand, NixSound, NixSoundConfig, NixState } from './types';

const nixState: NixState = {
	muted: false,
	sounds: {
		bonfire: { name: 'bonfire', icon: '', file: '/assets/sounds/bonfire.webm', howl: null, playing: false },
		brook: { name: 'brook', icon: '', file: '/assets/sounds/brook.webm', howl: null, playing: false },
		cocktail_voices: {
			name: 'cocktail_voices',
			icon: '',
			file: '/assets/sounds/cocktail_voices.webm',
			howl: null,
			playing: false,
		},
		fan: { name: 'fan', icon: '', file: '/assets/sounds/fan.webm', howl: null, playing: false },
		rain_pouring: {
			name: 'rain_pouring',
			icon: '',
			file: '/assets/sounds/rain_pouring.webm',
			howl: null,
			playing: false,
		},
		rain: { name: 'rain', icon: '', file: '/assets/sounds/rain.webm', howl: null, playing: false },
		shore: { name: 'shore', icon: '', file: '/assets/sounds/shore.webm', howl: null, playing: false },
		stream: { name: 'stream', icon: '', file: '/assets/sounds/stream.webm', howl: null, playing: false },
		thunder_close: {
			name: 'thunder_close',
			icon: '',
			file: '/assets/sounds/thunder_close.webm',
			howl: null,
			playing: false,
		},
		thunder_distant: {
			name: 'thunder_distant',
			icon: '',
			file: '/assets/sounds/thunder_distant.webm',
			howl: null,
			playing: false,
		},
		waves_large: { name: 'waves_large', icon: '', file: '/assets/sounds/waves_large.webm', howl: null, playing: false },
		waves_ocean: { name: 'waves_ocean', icon: '', file: '/assets/sounds/waves_ocean.webm', howl: null, playing: false },
	},
};

function toggleGlobalMute() {
	nixState.muted = !nixState.muted;
	Howler.mute(nixState.muted);
}

browser.runtime.onInstalled.addListener(() => console.log('installed!'));
browser.runtime.onUpdateAvailable.addListener(() => browser.runtime.reload());
browser.commands.onCommand.addListener((command = 'UNKNOWN') => {
	switch (command) {
		case 'toggle_mute':
			toggleGlobalMute();
			break;
		default:
			console.warn(`Ignoring unknown command [${command}]`);
			break;
	}
});

browser.runtime.onMessage.addListener(
	(message): Promise<unknown> => {
		const { nixCommand, payload } = message;

		switch (nixCommand) {
			case NixCommand.SOUND_PLAY: {
				// Unmute globally if we are currently muted
				if (nixState.muted) {
					nixState.muted = false;
					Howler.mute(false);
				}

				const nixSound: NixSoundConfig = nixState.sounds[payload as NixSound];

				if (nixSound) {
					if (!nixSound.howl) {
						nixSound.howl = new Howl({ src: nixSound.file, loop: true });
					}

					nixSound.playing = true;
					nixSound.howl.play();
				}

				break;
			}
			case NixCommand.SOUND_STOP: {
				const nixSound: NixSoundConfig = nixState.sounds[payload as NixSound];

				if (nixSound && nixSound.howl) {
					nixSound.howl.unload();
					nixSound.playing = false;
					nixSound.howl = null;
				}

				break;
			}
			case NixCommand.SOUND_LIST: {
				return Promise.resolve(
					Object.keys(nixState.sounds).map(
						(k): NixSoundConfig => {
							const sound = nixState.sounds[k as NixSound];

							return { name: sound.name, icon: sound.icon, file: '', howl: null, playing: sound.playing };
						}
					)
				);
			}
			case NixCommand.GLOBAL_TOGGLE_MUTE: {
				toggleGlobalMute();

				break;
			}
			case NixCommand.GLOBAL_IS_MUTED: {
				return Promise.resolve(nixState.muted);
			}
			default:
				console.warn(`Ignoring unknown nixCommand [${nixCommand}]`);
				break;
		}

		return Promise.resolve();
	}
);
