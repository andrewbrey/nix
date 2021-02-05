import { browser } from 'webextension-polyfill-ts';
import { NIX_LAST_MIX_STOPPED_KEY, noop } from '../util/shared';
import { onInstalled, onMessage, onUpdateAvailable } from './listener';

browser.runtime.onInstalled.addListener(onInstalled);
browser.runtime.onUpdateAvailable.addListener(onUpdateAvailable);
browser.runtime.onMessage.addListener(onMessage);

// When we first boot, it means the browser is coming up from
// closed and we probably didn't have a chance to set our
// "last mix was stopped while playing" flag in the state - set
// it now to pretend we did.
browser.storage.local
	.set({ [NIX_LAST_MIX_STOPPED_KEY]: true })
	.then(noop)
	.catch(console.error);
