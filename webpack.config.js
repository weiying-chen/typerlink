const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: {
		popup: './src/popup.tsx',
		content: './src/content.tsx',
		background: './src/background.ts',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.ts(x)?$/,
			use: 'ts-loader',
			exclude: /node_modules/
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/popup.html',
			filename: 'popup.html'
		}),
		new CopyPlugin({
			patterns: [
				{ from: "public" }
			]
		})
	]
}