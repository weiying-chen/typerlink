const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(config, {
	mode: 'development',
	devtool: 'source-map',
	module: {
		// For dummy.html
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'dummy.html',
			template: './src/dummy.html',
			chunks: ['content'],
		}),
		// For dummy.html
		new MiniCssExtractPlugin(),
	]
})
