/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { join } from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ExtensionReloader from 'webpack-extension-reloader';
import { readJsonSync } from 'fs-extra';
import { merge } from 'lodash';

const isDev = process.env.NODE_ENV === 'development';
const assetPath = process.env.ASSET_PATH || '/';
const outputPath = join(__dirname, 'extensions', `${process.env.TARGET}`);
const srcPath = join(__dirname, 'src', 'scripts');

console.log(
	chalk.bold(
		`Webpack building for ${chalk.bold.underline.green(process.env.TARGET)} with ${chalk.bold.underline.green(
			isDev ? 'dev' : 'prod'
		)} configuration!\n`
	)
);

export default {
	mode: isDev ? 'development' : 'production',
	devtool: false, // Can't use sourcemaps with the extension reloader :/
	target: 'web',
	resolve: {
		alias: {
			'@env': join(srcPath, 'env', isDev ? 'environment.dev' : 'environment'),
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
	},
	entry: {
		background: `${srcPath}/background.ts`,
		popup: `${srcPath}/popup/index.tsx`,
	},
	output: {
		path: outputPath,
		filename: '[name].js',
		publicPath: assetPath,
		pathinfo: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
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
			{
				test: /\.html$/,
				loader: 'html-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(ts|tsx)$/,
				use: [
					{
						loader: 'source-map-loader',
					},
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
		],
	},
	plugins: [
		isDev &&
			new ExtensionReloader({
				port: 9090,
				entries: {
					background: 'background',
					extensionPage: ['popup'],
				},
				reloadPage: false,
			}),
		new webpack.ProgressPlugin(),
		new webpack.EnvironmentPlugin(['NODE_ENV']),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			ignoreOrder: false,
		}),
		new HtmlWebpackPlugin({
			template: `${srcPath}/popup/index.html`,
			filename: 'popup.html',
			chunks: ['popup'],
			cache: false,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/assets', to: 'assets' },
				{ from: 'src/_locales', to: '_locales' },
				{
					from: 'src/manifests/default.json',
					transform(content) {
						const MANIFEST = JSON.parse(content.toString());
						const TARGET_OVERRIDES = readJsonSync(`src/manifests/${process.env.TARGET}.json`);

						merge(MANIFEST, TARGET_OVERRIDES);

						MANIFEST.version = process.env.npm_package_version;

						delete MANIFEST.$schema;
						if (!isDev) {
							Object.keys(MANIFEST.commands)
								.filter(k => k.startsWith('dev:'))
								.forEach(k => delete MANIFEST.commands[k]);
						}

						return Buffer.from(JSON.stringify(MANIFEST, null, 2));
					},
					to: 'manifest.json',
				},
			],
		}),
		new webpack.HotModuleReplacementPlugin(),
	].filter(Boolean),
	optimization: {
		minimize: false,
	},
};
