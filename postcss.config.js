module.exports = {
	plugins: {
		'precss': {},
		'postcss-cssnext': {
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
		},
		'cssnano': {},
		'lost': {},
		'postcss-strip-inline-comments': {},
	},
};
