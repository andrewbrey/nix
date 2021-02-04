import * as React from 'react';
import { NixSelectedSound, NixSoundConfig } from '../../types';
import { SoundButton } from './sound-button';

interface SoundButtonListProps extends React.HTMLAttributes<HTMLDivElement> {
	alreadyPlaying: boolean;
	fullSoundList: NixSoundConfig[];
	selectedSoundList: NixSelectedSound[];
}

export const SoundButtonList: React.FC<SoundButtonListProps> = ({ fullSoundList, selectedSoundList, className }) => {
	const checkSoundSelected = (name: string) => {
		return selectedSoundList.findIndex(s => s.sound === name) > -1;
	};

	return (
		<div className={className}>
			{fullSoundList.map(s => (
				<SoundButton
					key={s.name}
					name={s.name}
					displayName={s.displayName}
					selected={checkSoundSelected(s.name)}
					playing={s.playing}
				/>
			))}
		</div>
	);
};
