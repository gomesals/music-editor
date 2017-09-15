const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: './src/index',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'app/js'),
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
		}, {
			test: /\.scss$/,
			exclude: /node_modules/,
			use: ['style-loader', {
				loader: 'css-loader',
				options: {
					importLoaders: 1
				}
			}, 'postcss-loader']
		}, {
			test: /\.pug$/,
			exclude: /node_modules/,
			loader: "pug-loader",
		}, ],
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.pug',
		}),
	],
};
