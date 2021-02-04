import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey, NixSelectedSound, NixSoundConfig } from '../types';
import { noop } from '../util/shared';
import { SoundButtonList } from './components/sound-button-list';

export const Popup = (): React.ReactElement => {
	const [fullSoundList, setFullSoundList] = React.useState<NixSoundConfig[]>([]);
	const [selectedSoundList, setSelectedSoundList] = React.useState<NixSelectedSound[]>([]);
	const [alreadyPlaying, setAlreadyPlaying] = React.useState(true);

	React.useEffect(() => {
		setAlreadyPlaying(fullSoundList.filter(s => s.playing).length > 0);
	}, [fullSoundList]);

	React.useEffect(() => {
		browser.runtime
			.sendMessage({ message: NixMessageKey.SOUND_LIST_ALL } as NixMessage)
			.then((sounds: NixSoundConfig[]) => setFullSoundList(sounds))
			.catch(noop);

		browser.runtime
			.sendMessage({ message: NixMessageKey.SOUND_LIST_ACTIVE } as NixMessage)
			.then((sounds: NixSelectedSound[]) => setSelectedSoundList(sounds))
			.catch(noop);
	}, []);

	const restartPreviousMix = () => {
		console.log(selectedSoundList);

		selectedSoundList.forEach(s =>
			browser.runtime.sendMessage({ message: NixMessageKey.SOUND_PLAY_NAMED, payload: s.sound } as NixMessage)
		);

		setAlreadyPlaying(true);
	};

	const stopAll = () => {
		browser.runtime.sendMessage({ message: NixMessageKey.SOUND_STOP_ALL } as NixMessage);
	};

	return (
		<div className="w-80">
			{alreadyPlaying && (
				<button className="px-4 py-2 bg-gray-100" onClick={stopAll}>
					Pause current mix
				</button>
			)}
			{!alreadyPlaying && !!selectedSoundList.length && (
				<div>
					<button className="px-4 py-2 bg-blue-300" onClick={restartPreviousMix}>
						Restart your last mix?
					</button>
				</div>
			)}
			<SoundButtonList
				className="grid grid-cols-2 gap-2"
				alreadyPlaying={alreadyPlaying}
				fullSoundList={fullSoundList}
				selectedSoundList={selectedSoundList}
			/>
		</div>
	);
};
