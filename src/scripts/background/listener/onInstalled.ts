import { browser } from 'webextension-polyfill-ts';
import { NixState } from '../../types';
import { DEFAULT_NIX_STATE, noop } from '../../util/shared';

export async function onInstalled() {
	const defaultNixState: NixState = { ...DEFAULT_NIX_STATE };

	await browser.storage.local.set(defaultNixState).then(noop).catch(console.error);
}
