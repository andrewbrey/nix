/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const chalk = require('chalk');
const { join } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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

module.exports = {
	mode: isDev ? 'development' : 'production',
	devtool: 'source-map',
	target: 'web',
	resolve: {
		alias: {
			'@env': join(srcPath, 'env', isDev ? 'environment.dev' : 'environment'),
			'react-dom': '@hot-loader/react-dom',
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
		new webpack.HotModuleReplacementPlugin(),
	],
	devServer: {
		https: false,
		hot: true,
		injectClient: false,
		writeToDisk: true,
		port: 9090,
		clientLogLevel: 'silent',
		contentBase: outputPath,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		host: '0.0.0.0',
		disableHostCheck: true,
	},
	optimization: {
		minimize: false,
	},
};
