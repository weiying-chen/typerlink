const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = merge(config, {
	mode: 'production',
	plugins: [
		new RemovePlugin({
			before: {
				include: [
					'./dist/dummy.html',
				],
			},
		}),
	],
});
