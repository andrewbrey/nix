import { Howl } from 'howler';

export type NixSound =
	| 'fire'
	| 'brook'
	| 'party_chatter'
	| 'fan'
	| 'rain_pouring'
	| 'rain_calm'
	| 'beach_shore'
	| 'rushing_stream'
	| 'thunder_nearby'
	| 'thunder_distant'
	| 'waves_rolling'
	| 'waves_calm';

export interface NixSoundConfig {
	name: string;
	displayName: string;
	file: string;
	howl: Howl | null;
	playing: boolean;
}

export type AvailableNixSounds = Record<NixSound, NixSoundConfig>;

export const enum NixMessageKey {
	SOUND_LIST_ALL = 'sound:list_all',
	SOUND_PLAY_NAMED = 'sound:play_named',
	SOUND_STOP_NAMED = 'sound:stop_named',
	SOUND_STOP_ALL = 'sound:stop_all',
}

export interface NixMessage {
	message: NixMessageKey;
	payload?: unknown;
}

export interface NixActiveSound {
	sound: NixSound;
	level: number;
}

export interface NixState {
	active: NixActiveSound[];
}
