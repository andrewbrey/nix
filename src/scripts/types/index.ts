import { Howl } from 'howler';

export type NixSound =
	| 'bonfire'
	| 'brook'
	| 'cocktail_voices'
	| 'fan'
	| 'rain_pouring'
	| 'rain'
	| 'shore'
	| 'stream'
	| 'thunder_close'
	| 'thunder_distant'
	| 'waves_large'
	| 'waves_ocean';

export interface NixSoundConfig {
	name: string;
	icon: string;
	file: string;
	howl: Howl | null;
	playing: boolean;
}

export interface NixState {
	muted: boolean;
	sounds: Record<NixSound, NixSoundConfig>;
}

export const enum NixCommand {
	SOUND_PLAY = 'sound:play',
	SOUND_STOP = 'sound:stop',
	SOUND_LIST = 'sound:list',
	GLOBAL_TOGGLE_MUTE = 'global:toggle_mute',
	GLOBAL_IS_MUTED = 'global:is_muted',
}

export interface NixMessage {
	nixCommand: NixCommand;
	payload?: unknown;
}
