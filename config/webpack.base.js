'use strict';

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV === 'development';
const projectRoot = process.cwd();

const setMPA = () => {
	const entry = {};
	const htmlWebpackPlugin = [];
	const entryFiles = glob.sync(path.join(projectRoot,'./src/*/index.js'));
	Object.keys(entryFiles).map(
		(item)=>{
			const entryFile = entryFiles[item];
			const match = entryFile.match(/src\/(.*)\/index\.js/)
			const pageName = match && match[1];
			console.log(pageName)
			entry[pageName] = entryFile;   
			htmlWebpackPlugin.push(
				new HtmlWebpackPlugin({
					template:path.join(projectRoot,`src/${pageName}/index.html`),
					filename: `${pageName}.html`,
					chunks: [pageName,'manifest','vendor','default'],
					inject: true,
					minify:{
						html5: true,
						collapseWhitespace: true,
						preserveLineBreaks: false,
						minifyCSS: true,
						minifyJS: true,
						removeComments: false
					}
				})
			);
		}
	);

	return {
		entry,
		htmlWebpackPlugin
	}
}
const { entry, htmlWebpackPlugin} = setMPA();

module.exports = {
	entry: entry,
	module:{
		rules:[
			{
				test: /.js$/,
				use: ['babel-loader']
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				enforce: "pre",
				include: [path.resolve(__dirname, '../src')], // 指定检查的目录
				options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
					formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
				}
			},
			{
				test: /.(sc|sa|c)ss$/,
				use: [
					{
						//loader: 'style-loader'
						loader:MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options:{
							sourceMap:true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							sourceMap:true,
							plugins: loader => [
								require('autoprefixer')({
									overrideBrowserslist: [' > 0.15% in CN ']
								})
							]
						}
					},
					{
						loader: 'sass-loader',
						options:{
							sourceMap:true
						}
					}
				]
			},
			{
				test: /.(png|jpg|gif|jpeg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit:10240,
							name: devMode?'[name].[ext]':'[name]_[contenthash:8].[ext]'
						}
					}
				]
			},
			{
				test: /.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: devMode?'[name].[ext]':'[name]_[contenthash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins:[
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename:devMode?'[name].css':'[name]_[contenthash:8].css',
			chunkFilename:devMode?'[id].css':'[id]_[contenthash:8].css'
		})
	].concat(htmlWebpackPlugin)
}