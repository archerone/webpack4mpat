const path  = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
	timeout: "10000ms"
});


rimraf('../dist',()=>{
	const prodConfig = require('../config/webpack.prod.js');
	webpack(prodConfig,(err,stats)=>{
		if(err){
			console.error(err);
			process.exit(2);
		}
		console.log(stats.toString({
			color:true,
			modules:false,
			children:false
		}));

		console.log('webpack build ok,begin test');

		mocha.addFile('smoke/html-test.js');
		mocha.addFile('./smoke/css-js-test.js');

		mocha.run();
	})
});