import * as React from 'react';
import { MixControlButton } from './components/mix-control-button';
import { SoundButton } from './components/sound-button';
import { useObservable } from './hooks/useObservable';
import { allSounds } from './store';

export const Popup: React.FC = () => {
	const availableSounds = useObservable(allSounds, allSounds.initialValue());

	return (
		<div className="w-80 bg-gray-100">
			<div className="px-4 py-3 text-white bg-gradient-to-br from-blue-900 to-blue-800 border-b-4 border-blue-200">
				<div className="flex justify-between items-center">
					<h1 className="font-bold italic text-4xl">Nix</h1>
					<MixControlButton />
				</div>
				<p className="text-base font-light">The simple noise mixer</p>
			</div>
			<div className="p-4 grid grid-cols-2 gap-2">
				{availableSounds.map(s => (
					<SoundButton key={s.name} name={s.name} displayName={s.displayName} />
				))}
			</div>
		</div>
	);
};
