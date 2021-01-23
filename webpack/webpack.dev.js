/* eslint-disable @typescript-eslint/no-var-requires */
const ExtensionReloader = require('webpack-extension-reloader');
const { join } = require('path');
const { srcPath } = require('./webpack-paths');

module.exports = {
	mode: 'development',
	devtool: false,
	resolve: {
		alias: {
			'@global/env': join(srcPath, 'global', 'environment.dev'),
		},
	},
	output: {
		pathinfo: true,
	},
	plugins: [
		new ExtensionReloader({
			port: 9090,
			entries: {
				background: 'background',
				extensionPage: ['popup'],
			},
			reloadPage: false,
		}),
	],
	module: {
		rules: [],
	},
};
