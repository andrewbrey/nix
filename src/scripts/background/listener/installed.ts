import { NixState } from '../../types';
import { NIX_STATE_KEY } from '../../util/shared';
import { browser } from 'webextension-polyfill-ts';

export function onInstalled(): void {
	const defaultNixState: NixState = { [NIX_STATE_KEY]: [] };

	browser.storage.local.set(defaultNixState);
}
