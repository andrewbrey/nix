import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { NixCommand, NixMessage, NixSoundConfig } from '../types';
import { noop } from '../util/shared';
import cn from 'classnames';

interface SoundButtonProps {
	name: string;
	icon: string;
	playing: boolean;
}

const SoundButton = ({ name, icon, playing }: SoundButtonProps): React.ReactElement => {
	const [currentlyPlaying, setCurrentlyPlaying] = React.useState(playing);

	const toggleSound = () => {
		const message: NixMessage = {
			nixCommand: currentlyPlaying ? NixCommand.SOUND_STOP : NixCommand.SOUND_PLAY,
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
			Play {name} {icon}
		</button>
	);
};

export const Popup = (): React.ReactElement => {
	const [soundList, setSoundList] = React.useState<NixSoundConfig[]>([]);
	const [muted, setMuted] = React.useState(false);

	React.useEffect(() => {
		const message: NixMessage = { nixCommand: NixCommand.SOUND_LIST };

		browser.runtime
			.sendMessage(message)
			.then(sounds => setSoundList(sounds))
			.catch(noop);
	}, []);

	React.useEffect(() => {
		const message: NixMessage = { nixCommand: NixCommand.GLOBAL_IS_MUTED };

		// TODO this gets out of date, need to listen for the change made from global hotkey...
		browser.runtime
			.sendMessage(message)
			.then(globalIsMuted => setMuted(globalIsMuted))
			.catch(noop);
	}, []);

	return (
		<div className="w-80">
			<img src="/assets/icons/icon-150.png" alt="" />
			<p>
				Muted <b className="font-bold">{muted ? 'true' : 'false'}</b>
			</p>
			<div className="flex flex-col space-y-2">
				{soundList.map(s => (
					<SoundButton key={s.name} name={s.name} icon={s.icon} playing={s.playing} />
				))}
			</div>
		</div>
	);
};
