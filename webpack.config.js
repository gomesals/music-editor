const path = require('path');
module.exports = {
	entry: './src/js/app.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'app/js'),
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
		}, ],
	},
};
