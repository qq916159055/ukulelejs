
module.exports = {
	entry: "./src/ukulele/core/Ukulele.js",
	output: {
		path: './dist',
		filename: "Ukulele.js",
		libraryTarget: "amd"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components|test)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
        ]
	}
}