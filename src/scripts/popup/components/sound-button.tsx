import cn from 'classnames';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey, NixSound } from '../../types';
import { noop } from '../../util/shared';
import { useObservable } from '../hooks/useObservable';
import { lastMixStopped, mostRecentMix } from '../store';

interface SoundButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	name: NixSound;
	displayName: string;
}

export const SoundButton: React.FC<SoundButtonProps> = ({ name, displayName }: SoundButtonProps) => {
	const activeMix = useObservable(mostRecentMix, mostRecentMix.initialValue());
	const activeMixStopped = useObservable(lastMixStopped, lastMixStopped.initialValue());

	const toggleSound = () => {
		if (activeMixHas(name) && !activeMixStopped) {
			browser.runtime
				.sendMessage({ message: NixMessageKey.SOUND_STOP_NAMED, payload: name } as NixMessage)
				.then(noop)
				.catch(noop);
		} else {
			browser.runtime
				.sendMessage({ message: NixMessageKey.SOUND_PLAY_NAMED, payload: name } as NixMessage)
				.then(noop)
				.catch(noop);
		}
	};

	const activeMixHas = (sound: NixSound) => {
		return !isEmpty(activeMix.find(a => a.sound === sound));
	};

	return (
		<button
			onClick={toggleSound}
			className={cn('px-4 py-2 rounded ring-2 text-left font-medium focus:outline-none', {
				'bg-gray-200 text-gray-700 ring-gray-100': !activeMixHas(name),
				'bg-blue-900 text-white ring-blue-200 text-blue-50': activeMixHas(name) && !activeMixStopped,
				'bg-gray-200 ring-blue-800 text-blue-800': activeMixHas(name) && activeMixStopped,
			})}
		>
			{displayName}
		</button>
	);
};
