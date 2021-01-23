/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');
const { srcPath } = require('./webpack-paths');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	resolve: {
		alias: {
			'@global/env': join(srcPath, 'global', 'environment'),
		},
	},
	optimization: {
		minimize: false,
	},
	plugins: [],
	module: {
		rules: [],
	},
};
