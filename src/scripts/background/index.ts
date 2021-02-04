import { browser } from 'webextension-polyfill-ts';
import { onInstalled, onMessage, onUpdateAvailable } from './listener';

browser.runtime.onInstalled.addListener(onInstalled);
browser.runtime.onUpdateAvailable.addListener(onUpdateAvailable);
browser.runtime.onMessage.addListener(onMessage);
