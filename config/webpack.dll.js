const path = require('path');
const webpack = require('webpack');
module.exports = {
	entry:{
		library:[
			'weixin-js-sdk'
		]
	},
	output:{
		filename:'[name]_[hash].dll.js',
		path:path.join(__dirname, '../dist/build/library'),
		library:'[name]_[hash]'
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]_[hash]',
			path: path.join(__dirname, '../dist/build/library/[name].json'),
			context: __dirname 
		})
	]
}