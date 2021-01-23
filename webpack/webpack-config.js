/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk');
const { merge } = require('webpack-merge');

module.exports = () => {
	const CONFIG_VARIANT = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

	console.log(
		chalk.bold(
			`Webpack building for ${chalk.bold.underline.green(process.env.TARGET)} with ${chalk.bold.underline.green(
				CONFIG_VARIANT
			)} configuration!\n`
		)
	);

	return merge(require('./webpack.common'), require(`./webpack.${CONFIG_VARIANT}.js`));
};
