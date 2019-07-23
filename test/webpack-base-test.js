const assert = require('assert');
describe('webpack.base.js test case', ()=>{
	const baseConfig = require('../config/webpack.base.js');
	//console.log(baseConfig);
	it('entry',()=>{
		assert.equal(baseConfig.entry.index,'/Users/yuanchao/work/webpack/packd4/src/index/index.js');
		assert.equal(baseConfig.entry.search,'/Users/yuanchao/work/webpack/packd4/src/search/index.js');
		assert.equal(baseConfig.entry.user,'/Users/yuanchao/work/webpack/packd4/src/user/index.js');
	})
});