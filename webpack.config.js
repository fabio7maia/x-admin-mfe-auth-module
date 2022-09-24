const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const Webpack5RemoteTypesPlugin = require('webpack5-remote-types-plugin').default;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const packageJson = require('./package.json');
const webpack = require('webpack');
const dotEnv = require('dotenv');
const federationConfig = require('./federation.config.json');

const env = process.env.NODE_ENV || 'development';
const envVars = dotEnv.config().parsed || process.env;
// const hostAuthModule = (envVars ? envVars.REACT_APP_HOST_AUTH_MODULE : process.env.REACT_APP_HOST_AUTH_MODULE) || '';
const publicUrl = (envVars ? envVars.PUBLIC_URL : process.env.PUBLIC_URL) || '/public';

const transformEnvVars = (envVars) => {
	const transformEnvVars = {};

	Object.keys(envVars).forEach((key) => {
		transformEnvVars[key] = JSON.stringify(envVars[key]);
	});

	return transformEnvVars;
};

const transformDependencies = (deps) => {
	const transformDependencies = {};

	Object.keys(deps).forEach((key) => {
		transformDependencies[key] = {
			eager: true,
			requiredVersion: deps[key],
		};
	});

	return transformDependencies;
};

module.exports = {
	entry: './src/index',
	mode: env,
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		port: 3001,
	},
	output: {
		publicPath: 'auto',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		plugins: [new TsconfigPathsPlugin()],
	},
	module: {
		rules: [
			{
				test: /bootstrap\.tsx$/,
				loader: 'bundle-loader',
				options: {
					lazy: true,
				},
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					// disable type checker - we will use it in fork plugin
					transpileOnly: true,
				},
			},
		],
	},
	plugins: [
		new ModuleFederationPlugin({
			...federationConfig,
			filename: 'remoteEntry.js',
			// remotes: {
			// 	xAdminAuthModule: `xAdminAuthModule@${hostAuthModule}`,
			// },
			shared: {
				...transformDependencies(packageJson.dependencies),
			},
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			templateParameters: {
				PUBLIC_URL: publicUrl,
			},
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'public/**/*',
					globOptions: {
						ignore: ['**/index.html'],
					},
				},
			],
		}),
		new FileManagerPlugin({
			events: {
				onStart: {
					delete: [
						{
							source: '..webpack-federation-modules-types',
							options: {
								force: true,
							},
						},
					],
				},
				onEnd: {
					archive: [
						{
							source: '.webpack-federation-modules-types',
							destination: './dist/xAdminAuthModule-dts.tgz',
							format: 'tar', // optional
							options: {
								// see https://www.archiverjs.com/docs/archiver
								gzip: true,
							},
						},
					],
				},
			},
		}),
		new ForkTsCheckerWebpackPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
				...transformEnvVars(envVars),
			},
		}),
	],
};
