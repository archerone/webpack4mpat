import { helloworld } from './helloworld';
import utils from '../../util/pa.js';
alert(helloworld());
utils.pa();
console.log($('img').length,'ddcd');
$('body').click(function(){
  import(/* webpackChunkName: "pb" */ /* webpackPrefetch: true */ '../../util/pb.js').then(mod=>{
    mod.default.pb();
  });
});