import { NixState } from '../types';

export const NIX_SELECTED_SOUNDS_KEY: keyof Pick<NixState, 'selectedSounds'> = 'selectedSounds';
export const NIX_LAST_MIX_STOPPED_KEY: keyof Pick<NixState, 'lastMixStopped'> = 'lastMixStopped';

export const DEFAULT_NIX_STATE: NixState = {
	lastMixStopped: false,
	selectedSounds: [],
};

export function noop(): void {
	/* noop */
}
