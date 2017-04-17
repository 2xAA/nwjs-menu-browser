const path = require('path');

module.exports = {
	entry: {
		app: './src-app/app.js',
		menu: './src/index.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist'),
		libraryTarget: 'umd'
	},
	resolve: {
		alias: {
			'nwjs-browser-menu': path.resolve(__dirname, './src/index.js')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [[ 'es2015', { modules: false } ]]
				}
			}
		]
	},
	devServer: {
		open: true,
		contentBase: __dirname,
		overlay: true
	}
};