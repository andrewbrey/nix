import cn from 'classnames';
import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey } from '../../types';

interface SoundButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	name: string;
	displayName: string;
	selected: boolean;
	playing: boolean;
}

export const SoundButton: React.FC<SoundButtonProps> = ({ name, displayName, selected, playing }: SoundButtonProps) => {
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
				'bg-gray-100 text-black': !currentlyPlaying && !selected,
				'bg-blue-600 text-white': currentlyPlaying,
				'bg-green-300 text-black': selected && !currentlyPlaying,
			})}
			onClick={toggleSound}
		>
			{currentlyPlaying ? 'Stop' : 'Play'} {displayName}
		</button>
	);
};
