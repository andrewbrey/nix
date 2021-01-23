import { browser } from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener(() => console.log('installed!'));
browser.runtime.onUpdateAvailable.addListener(() => browser.runtime.reload());
