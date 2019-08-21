import './search.scss';
import types from './search.css';
import logo from '../../static/images/logo.jpg';
import spic from '../../static/images/smallpic.jpg';
import wx from 'weixin-js-sdk';
let str = "search page22<br><img src="+logo+"><br><img src="+spic+"><br><div id='box1'>123</div><input type='text' placeholder='hh'>";
//debugger;  //source-map相关测试

console.log(wx);
document.write(str);
console.log(jQuery('img').length,jQuery);
console.log($('img').length,3911);

$('img').click(function(){
  import(/* webpackChunkName: "pb" */ '../../util/pb.js').then(mod=>{
    mod.default.pb();
  });
});

var obox = document.querySelector("#box1");
obox.innerHTML = `<p class="${types.red}">就哈哈</p>`;