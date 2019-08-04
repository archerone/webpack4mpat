'use strict';

const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const baseconfig = require('./webpack.base.js');
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const frienderror = require('friendly-errors-webpack-plugin');
const projectRoot = process.cwd();
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(baseconfig,{
	output:{
		path: path.join(projectRoot, 'dist'),
		filename: '[name]_[chunkhash:8].js'
	},
	mode: 'production',
	module:{
		rules:[
			{
				test: /.js$/,
				include: path.resolve("src"),
				use: [
					{
						loader:'thread-loader',
						options:{
							workers:3
						}
					}
				]
			}
		]
	},
	plugins:[
		new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
            reportFilename: 'bundle-analyzer-report.html'
        }),
		new OptimizeCSSAssetsPlugin({   //css压缩
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano')
		}),
		/* new webpack.ProvidePlugin({     //不需要import $,可以直接用$
            $: 'jquery',
            jQuery: 'jquery'
        }) */
		new HtmlWebpackExternalsPlugin({   //本地jquery不打包,页面上被添加cdn引用
			externals:[
				{
					module: 'jquery',
					entry: 'http://res12.iblimg.com/respc-1/resources/v4.2/unit/jquery-1.8.2.min.js',
					global: 'jQuery'
				}
			]
		}),
		new frienderror()
	],
	optimization:{
		runtimeChunk: {
			name: "manifest"
		},
		splitChunks: {
			chunks: 'all',
			minSize: 10,
			minChunks: 2,
			maxAsyncRequests: 2,
			maxInitialRequests: 2,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
			  vendors: {
				name:'vendor',
				test: /[\\/]node_modules[\\/]/,
				priority: -10
			  },
			  default: {
				minChunks: 2,
				priority: -20,
				reuseExistingChunk: true
			  }
			}
		  }
	},
	devtool:'cheap-module-source-map',
	//stats: 'errors-only'
}));