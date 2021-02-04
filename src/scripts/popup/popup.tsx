import cn from 'classnames';
import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { NixMessageKey, NixMessage, NixSoundConfig } from '../types';
import { noop } from '../util/shared';
import { Bonfire } from './components/sound-icons';

interface SoundButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	name: string;
	displayName: string;
	playing: boolean;
}

const SoundButton: React.FC<SoundButtonProps> = ({ name, displayName, playing }: SoundButtonProps) => {
	const [currentlyPlaying, setCurrentlyPlaying] = React.useState(playing);

	const toggleSound = () => {
		const message: NixMessage = {
			message: currentlyPlaying ? NixMessageKey.SOUND_STOP_NAMED : NixMessageKey.SOUND_PLAY_NAMED,
			payload: name,
		};

		browser.runtime.sendMessage(message).then(() => setCurrentlyPlaying(!currentlyPlaying));
	};

	return (
		<button
			className={cn('px-4 py-2 rounded', {
				'bg-gray-100 text-black': !currentlyPlaying,
				'bg-blue-600 text-white': currentlyPlaying,
			})}
			onClick={toggleSound}
		>
			{currentlyPlaying ? 'Stop' : 'Play'} {displayName} <Bonfire className="w-10 h-10" />
		</button>
	);
};

export const Popup = (): React.ReactElement => {
	const [soundList, setSoundList] = React.useState<NixSoundConfig[]>([]);
	const [muted, setMuted] = React.useState(false);

	React.useEffect(() => {
		const message: NixMessage = { message: NixMessageKey.SOUND_LIST_ALL };

		browser.runtime
			.sendMessage(message)
			.then(sounds => setSoundList(sounds))
			.catch(noop);
	}, []);

	React.useEffect(() => {
		const storageChangeHandler = (...args) => {
			console.log(args);
			browser.storage.local.get(null).then(console.log);
			setMuted(!muted);
		};

		browser.storage.onChanged.addListener(storageChangeHandler);

		return () => browser.storage.onChanged.removeListener(storageChangeHandler);
	}, [muted]);

	return (
		<div className="w-80">
			<img src="/assets/icons/icon-150.png" alt="" />
			<p>
				Muted <b className="font-bold">{muted ? 'true' : 'false'}</b>
			</p>
			<div className="flex flex-col space-y-2">
				{soundList.map(s => (
					<SoundButton key={s.name} name={s.name} displayName={s.displayName} playing={s.playing} />
				))}
			</div>
		</div>
	);
};
