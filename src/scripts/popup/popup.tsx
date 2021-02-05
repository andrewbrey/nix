import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { NixMessage, NixMessageKey, NixSound } from '../types';
import { noop } from '../util/shared';
import { useObservable } from './hooks/useObservable';
import { allSounds, mostRecentMix, lastMixStopped } from './state';
import cn from 'classnames';

export const Popup = (): React.ReactElement => {
	const availableSounds = useObservable(allSounds, allSounds.initialValue());
	const activeMix = useObservable(mostRecentMix, mostRecentMix.initialValue());
	const activeMixStopped = useObservable(lastMixStopped, lastMixStopped.initialValue());

	const playSound = (payload: NixSound) => {
		browser.runtime
			.sendMessage({ message: NixMessageKey.SOUND_PLAY_NAMED, payload } as NixMessage)
			.then(noop)
			.catch(noop);
	};

	const stopSound = (payload: NixSound) => {
		browser.runtime
			.sendMessage({ message: NixMessageKey.SOUND_STOP_NAMED, payload } as NixMessage)
			.then(noop)
			.catch(noop);
	};

	const stopAll = () => {
		browser.runtime
			.sendMessage({ message: NixMessageKey.SOUND_STOP_ALL } as NixMessage)
			.then(noop)
			.catch(noop);
	};

	const restartMix = () => {
		activeMix.forEach(s =>
			browser.runtime
				.sendMessage({ message: NixMessageKey.SOUND_PLAY_NAMED, payload: s.sound } as NixMessage)
				.then(noop)
				.catch(console.error)
		);
	};

	const canStop = React.useMemo<boolean>(() => {
		return activeMix.length && !activeMixStopped;
	}, [activeMix, activeMixStopped]);

	const canRestart = React.useMemo<boolean>(() => {
		return activeMix.length && activeMixStopped;
	}, [activeMix, activeMixStopped]);

	return (
		<div className="w-80 grid grid-cols-2 gap-2 p-2">
			{canStop ? (
				<button className="col-span-2 px-4 py-2 bg-red-300 rounded" onClick={stopAll}>
					stop all
				</button>
			) : null}
			{canRestart ? (
				<button className="col-span-2 px-4 py-2 bg-blue-300 rounded" onClick={restartMix}>
					restart mix?
				</button>
			) : null}
			{availableSounds.map(s => (
				<button
					key={s.name}
					onClick={() => (activeMix.find(a => a.sound === s.name) ? stopSound(s.name) : playSound(s.name))}
					className={cn('px-4 py-2 rounded ring-1 focus:outline-none', {
						'bg-gray-100 ring-gray-100': !activeMix.find(a => a.sound === s.name),
						'bg-green-200 text-white ring-green-300 text-green-800':
							activeMix.find(a => a.sound === s.name) && !activeMixStopped,
						'bg-gray-100 ring-blue-400 text-blue-800': activeMix.find(a => a.sound === s.name) && activeMixStopped,
					})}
				>
					{s.displayName}
				</button>
			))}
		</div>
	);
};
