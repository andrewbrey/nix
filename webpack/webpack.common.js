/* eslint-disable @typescript-eslint/no-var-requires */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { outputPath, srcPath, stylesheetsPath } = require('./webpack-paths');

module.exports = {
	target: 'web',
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	entry: {
		background: `${srcPath}/background.ts`,
		popup: `${srcPath}/popup.ts`,
		styles: `${stylesheetsPath}/index.css`,
	},
	output: {
		filename: 'scripts/[name].js',
		path: outputPath,
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin({ silent: true }),
		new MiniCssExtractPlugin({
			filename: 'styles/index.css',
			ignoreOrder: false,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/assets', to: 'assets' },
				{ from: 'src/_locales', to: '_locales' },
				{ from: 'src/*.html', to: '[name].[ext]' },
				{
					from: `src/manifests/${process.env.TARGET}.json`,
					transform(content) {
						const MANIFEST = JSON.parse(content.toString());
						MANIFEST.version = process.env.npm_package_version;

						return Buffer.from(JSON.stringify(MANIFEST, null, 2));
					},
					to: 'manifest.json',
				},
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
						},
					},
				],
				include: srcPath,
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				include: stylesheetsPath,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							importLoaders: 1,
						},
					},
					'postcss-loader',
				],
			},
		],
	},
};
