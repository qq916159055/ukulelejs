// Karma configuration
// Generated on Fri Oct 30 2015 22:10:10 GMT+0900 (JST)

module.exports = function (config) {
	config.set({
		browsers: ['PhantomJS'],
		files: [
			{
				pattern: 'test-context.js',
				watched: false
			}
        ],
		frameworks: ['jasmine'],
		preprocessors: {
			'test-context.js': ['webpack']
		},
		webpack: {
			module: {
				loaders: [
					{
						test: /\.js/,
						exclude: /node_modules/,
						loader: 'babel-loader'
					}
                ]
			},
			watch: true
		},
		webpackServer: {
			noInfo: true
		}
	});
}