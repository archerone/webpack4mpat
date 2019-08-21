'use strict';

const glob = require('glob');
const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const baseconfig = require('./webpack.base.js');
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const frienderror = require('friendly-errors-webpack-plugin');
const projectRoot = process.cwd();
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const smp = new SpeedMeasurePlugin();

const PATHS = {
	src: path.join(projectRoot, 'src')
}

module.exports = smp.wrap(merge(baseconfig,{
	output:{
		path: path.join(projectRoot, 'dist'),
		filename: '[name]_[chunkhash:8].js',
		//chunkFilename: 'js/[chunkhash:8].chunk.js'
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
        }) 
		new HtmlWebpackExternalsPlugin({   //本地jquery不打包,页面上被添加cdn引用
			externals:[
				{
					module: 'jquery',
					entry: 'http://res12.iblimg.com/respc-1/resources/v4.2/unit/jquery-1.8.2.min.js',
					global: 'jQuery'
				}
			]
		}),*/
		new CleanWebpackPlugin({ 
			cleanOnceBeforeBuildPatterns:['**/*','!build','!build/library','!build/library/*']
		}),
		new webpack.DllReferencePlugin({
			context: __dirname, 
			manifest: require('../dist/build/library/library.json')
		}),
		new HardSourceWebpackPlugin(),
		// new PurgecssPlugin({
		// 	paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
		// }),
		new frienderror(),
		function(){
			this.hooks.done.tap('done',(stats)=>{
				if(stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch')==-1){
					console.log('build error');
					process.exit(110);
				}
			});
		}
	],
	optimization:{
		runtimeChunk: {
			name: "manifest"
		},
		splitChunks: {
			chunks: 'all',
			minSize: 10,
			minChunks: 2,
			maxAsyncRequests: 5,  //按需加载时，并行请求的最大数量，默认是 5
			maxInitialRequests: 3, //一个入口最大的并行请求数，默认是 3
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
		},
		minimizer: [
			new TerserPlugin({
			  parallel: true,
			  cache: true
			}),
		]
	},
	devtool:'cheap-module-source-map',
	//stats: 'errors-only'
}));

