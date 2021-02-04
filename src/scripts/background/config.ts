import { AvailableNixSounds, NixSound } from '../types';

function soundFile(name: NixSound, ext = '.webm') {
	return `/assets/sounds/${name}${ext}`;
}

export const allSounds: AvailableNixSounds = {
	fire: { name: 'fire', displayName: 'Fire', file: soundFile('fire'), howl: null, playing: false },
	brook: { name: 'brook', displayName: 'Brook', file: soundFile('brook'), howl: null, playing: false },
	party_chatter: {
		name: 'party_chatter',
		displayName: 'Party Chatter',
		file: soundFile('party_chatter'),
		howl: null,
		playing: false,
	},
	fan: { name: 'fan', displayName: 'Fan', file: soundFile('fan'), howl: null, playing: false },
	rain_pouring: {
		name: 'rain_pouring',
		displayName: 'Pouring Rain',
		file: soundFile('rain_pouring'),
		howl: null,
		playing: false,
	},
	rain_calm: { name: 'rain_calm', displayName: 'Calm Rain', file: soundFile('rain_calm'), howl: null, playing: false },
	beach_shore: {
		name: 'beach_shore',
		displayName: 'Beach Shore',
		file: soundFile('beach_shore'),
		howl: null,
		playing: false,
	},
	rushing_stream: {
		name: 'rushing_stream',
		displayName: 'Rushing Stream',
		file: soundFile('rushing_stream'),
		howl: null,
		playing: false,
	},
	thunder_nearby: {
		name: 'thunder_nearby',
		displayName: 'Nearby Thunder',
		file: soundFile('thunder_nearby'),
		howl: null,
		playing: false,
	},
	thunder_distant: {
		name: 'thunder_distant',
		displayName: 'Distant Thunder',
		file: soundFile('thunder_distant'),
		howl: null,
		playing: false,
	},
	waves_rolling: {
		name: 'waves_rolling',
		displayName: 'Rolling Waves',
		file: soundFile('waves_rolling'),
		howl: null,
		playing: false,
	},
	waves_calm: {
		name: 'waves_calm',
		displayName: 'Calm Waves',
		file: soundFile('waves_calm'),
		howl: null,
		playing: false,
	},
};
