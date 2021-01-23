/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

module.exports = {
	outputPath: resolve(__dirname, '../', `extensions/${process.env.TARGET}`),
	srcPath: resolve(__dirname, '../src/scripts'),
	stylesheetsPath: resolve(__dirname, '../src/styles'),
};
