import { browser } from 'webextension-polyfill-ts';

export function onUpdateAvailable(): void {
	browser.runtime.reload();
}
