'use strict';


const path = require('path');
const merge = require('webpack-merge');
const baseconfig = require('./webpack.base.js');
const webpack = require('webpack');
const frienderror = require('friendly-errors-webpack-plugin');
const projectRoot = process.cwd();

module.exports = merge(baseconfig,{
	output:{
		path: path.join(projectRoot, 'dist'),
		filename: '[name].js'
	},
	mode: 'development',
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new frienderror()
	],
	devtool:'cheap-module-eval-source-map',
	devServer:{
		contentBase: './dist',
		hot: true,
		port: 8000,
		stats:'errors-only',
		overlay: true  //代码出错时弹出浮层
	}
})