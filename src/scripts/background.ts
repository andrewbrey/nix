import { browser } from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener(() => console.log('installed!'));
browser.runtime.onUpdateAvailable.addListener(() => browser.runtime.reload());

browser.commands.onCommand.addListener(async (command = 'UNKNOWN') => {
	switch (command) {
		case 'dev:popup':
			await browser.browserAction.openPopup();
			break;
		default:
			console.warn(`Ignoring unknown command [${command}]`);
			break;
	}
});
