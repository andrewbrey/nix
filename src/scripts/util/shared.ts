import { NixState } from '../types';

export const NIX_STATE_KEY: keyof Pick<NixState, 'selectedSounds'> = 'selectedSounds';

export function noop(): void {
	/* noop */
}
