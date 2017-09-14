const path = require('path');
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
		}]
	}
};
