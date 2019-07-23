import { helloworld } from './helloworld';
import utils from '../../util/pa.js';
import treesk from '../../util/treesk.js';
document.write(helloworld());
utils.pa();
console.log($("img").length,'ddcd');
$('body').click(function(){
  import(/* webpackChunkName: "pb" */ '../../util/pb.js').then(mod=>{
    mod.default.pb();
  });
});