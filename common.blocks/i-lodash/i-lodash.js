/**
 * @license
 * lodash 3.10.1 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash include="isEmpty,get,assign,forEach,isUndefined,defaultsDeep,debounce,pick" -p`
 */
;(function(){function u(a){return!!a&&typeof a=="object"}function c(){}function U(a,b){for(var d=-1,h=a.length;++d<h&&false!==b(a[d],d,a););return a}function ga(a,b,d){d||(d={});for(var h=-1,e=b.length;++h<e;){var q=b[h];d[q]=a[q]}return d}function ha(a,b,d,h){h||(h=[]);for(var e=-1,q=a.length;++e<q;){var g=a[e];if(u(g)&&w(g)&&(d||t(g)||y(g)))if(b)ha(g,b,d,h);else for(var x=h,c=-1,k=g.length,m=x.length;++c<k;)x[m+c]=g[c];else d||(h[h.length]=g)}return h}function V(a,b){return ia(a,b,M)}function ja(a,
b,d,h,e){if(!z(a))return a;var q=w(b)&&(t(b)||W(b)),g=q?k:A(b);U(g||b,function(x,c){g&&(c=x,x=b[c]);if(u(x)){h||(h=[]);e||(e=[]);a:{for(var f=c,m=h,l=e,n=m.length,v=b[f];n--;)if(m[n]==v){a[f]=l[n];break a}var n=a[f],r=d?d(n,v,f,a,b):k,s=r===k;if(s)if(r=v,w(v)&&(t(v)||W(v)))if(t(n))r=n;else if(w(n)){var r=void 0,p=-1,z=n.length;for(r||(r=Array(z));++p<z;)r[p]=n[p]}else r=[];else X(v)||y(v)?r=y(n)?ka(n):X(n)?n:{}:s=false;m.push(v);l.push(r);if(s)a[f]=ja(r,v,d,m,l);else if(r===r?r!==n:n===n)a[f]=r}}else f=
a[c],m=d?d(f,x,c,a,b):k,(l=m===k)&&(m=x),m===k&&(!q||c in a)||!l&&(m===m?m===f:f!==f)||(a[c]=m)});return a}function Y(a,b,d){if(typeof a!="function")return la;if(b===k)return a;switch(d){case 1:return function(d){return a.call(b,d)};case 3:return function(d,e,q){return a.call(b,d,e,q)};case 4:return function(d,e,q,g){return a.call(b,d,e,q,g)};case 5:return function(d,e,q,g,c){return a.call(b,d,e,q,g,c)}}return function(){return a.apply(b,arguments)}}function ma(a){return N(function(b,d){var h=-1,
e=null==b?0:d.length,q=2<e?d[e-2]:k,g=2<e?d[2]:k,c=1<e?d[e-1]:k;typeof q=="function"?(q=Y(q,c,5),e-=2):(q=typeof c=="function"?c:k,e-=q?1:0);if(c=g){var c=d[0],f=d[1];if(z(g)){var l=typeof f;("number"==l?w(g)&&Z(f,g.length):"string"==l&&f in g)?(g=g[f],c=c===c?c===g:g!==g):c=false}else c=false}c&&(q=3>e?k:q,e=1);for(;++h<e;)(g=d[h])&&a(b,g,q);return b})}function $(a,b){var d=null==a?k:a[b];return na(d)?d:k}function w(a){return null!=a&&B(oa(a))}function Z(a,b){a=typeof a=="number"||ya.test(a)?+a:-1;b=null==
b?pa:b;return-1<a&&0==a%1&&a<b}function B(a){return typeof a=="number"&&-1<a&&0==a%1&&a<=pa}function qa(a,b){return a===k?b:aa(a,b,qa)}function za(a,b){var d={};V(a,function(a,e,c){b(a,e,c)&&(d[e]=a)});return d}function ra(a){for(var b=M(a),d=b.length,h=d&&a.length,e=!!h&&B(h)&&(t(a)||y(a)||H(a)),c=-1,g=[];++c<d;){var f=b[c];(e&&Z(f,h)||s.call(a,f))&&g.push(f)}return g}function C(a){if(c.support.unindexedChars&&H(a)){for(var b=-1,d=a.length,h=Object(a);++b<d;)h[b]=a.charAt(b);return h}return z(a)?
a:Object(a)}function Aa(a){if(t(a))return a;var b=[];(null==a?"":a+"").replace(Ba,function(a,h,e,c){b.push(e?c.replace(Ca,"$1"):h||a)});return b}function N(a,b){if(typeof a!="function")throw new TypeError(sa);b=ba(b===k?a.length-1:+b||0,0);return function(){for(var d=arguments,h=-1,e=ba(d.length-b,0),c=Array(e);++h<e;)c[h]=d[b+h];switch(b){case 0:return a.call(this,c);case 1:return a.call(this,d[0],c);case 2:return a.call(this,d[0],d[1],c)}e=Array(b+1);for(h=-1;++h<b;)e[h]=d[h];e[b]=c;return a.apply(this,
e)}}function y(a){return u(a)&&w(a)&&s.call(a,"callee")&&!O.call(a,"callee")}function I(a){return z(a)&&D.call(a)==ca}function z(a){var b=typeof a;return!!a&&("object"==b||"function"==b)}function na(a){return null==a?false:I(a)?ta.test(ua.call(a)):u(a)&&(va(a)?ta:Da).test(a)}function X(a){var b;if(!u(a)||D.call(a)!=J||va(a)||y(a)||!(s.call(a,"constructor")||(b=a.constructor,typeof b!="function"||b instanceof b)))return false;var d;if(c.support.ownLast)return V(a,function(a,b,c){d=s.call(c,b);return false}),
!1!==d;V(a,function(a,b){d=b});return d===k||s.call(a,d)}function H(a){return typeof a=="string"||u(a)&&D.call(a)==P}function W(a){return u(a)&&B(a.length)&&!!f[D.call(a)]}function ka(a){return ga(a,M(a))}function M(a){if(null==a)return[];z(a)||(a=Object(a));for(var b=a.length,d=c.support,b=b&&B(b)&&(t(a)||y(a)||H(a))&&b||0,h=a.constructor,e=-1,h=I(h)&&h.prototype||E,f=h===a,g=Array(b),k=0<b,xa=d.enumErrorProps&&(a===Q||a instanceof Error),p=d.enumPrototypes&&I(a);++e<b;)g[e]=e+"";for(var m in a)p&&
"prototype"==m||xa&&("message"==m||"name"==m)||k&&Z(m,b)||"constructor"==m&&(f||!s.call(a,m))||g.push(m);if(d.nonEnumShadows&&a!==E)for(b=a===Ea?P:a===Q?da:D.call(a),d=l[b]||l[J],b==J&&(h=E),b=ea.length;b--;)m=ea[b],e=d[m],f&&e||(e?!s.call(a,m):a[m]===h[m])||g.push(m);return g}function la(a){return a}var k,sa="Expected a function",da="[object Error]",ca="[object Function]",J="[object Object]",P="[object String]",Ba=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,Ca=/\\(\\)?/g,
Da=/^\[object .+?Constructor\]$/,ya=/^\d+$/,ea="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),f={};f["[object Float32Array]"]=f["[object Float64Array]"]=f["[object Int8Array]"]=f["[object Int16Array]"]=f["[object Int32Array]"]=f["[object Uint8Array]"]=f["[object Uint8ClampedArray]"]=f["[object Uint16Array]"]=f["[object Uint32Array]"]=true;f["[object Arguments]"]=f["[object Array]"]=f["[object ArrayBuffer]"]=f["[object Boolean]"]=f["[object Date]"]=
f[da]=f[ca]=f["[object Map]"]=f["[object Number]"]=f[J]=f["[object RegExp]"]=f["[object Set]"]=f[P]=f["[object WeakMap]"]=false;var F={"function":true,object:true},K=F[typeof exports]&&exports&&!exports.nodeType&&exports,L=F[typeof module]&&module&&!module.nodeType&&module,R=F[typeof self]&&self&&self.Object&&self,p=F[typeof window]&&window&&window.Object&&window,F=L&&L.exports===K&&K,R=K&&L&&typeof global=="object"&&global&&global.Object&&global||p!==(this&&this.window)&&p||R||this,va=function(){try{Object({toString:0}+"")}catch(a){return function(){return false}}return function(a){return typeof a.toString!="function"&&typeof(a+"")=="string"}}(),p=Array.prototype,Q=Error.prototype,E=Object.prototype,Ea=String.prototype,ua=Function.prototype.toString,s=E.hasOwnProperty,D=E.toString,ta=RegExp("^"+ua.call(s).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),O=E.propertyIsEnumerable,Fa=p.splice,S=$(Array,"isArray"),wa=$(Object,"keys"),ba=Math.max,fa=$(Date,"now"),pa=9007199254740991,l={};l["[object Array]"]=l["[object Date]"]=l["[object Number]"]=
{constructor:true,toLocaleString:true,toString:true,valueOf:true};l["[object Boolean]"]=l[P]={constructor:true,toString:true,valueOf:true};l[da]=l[ca]=l["[object RegExp]"]={constructor:true,toString:true};l[J]={constructor:true};U(ea,function(a){for(var b in l)if(s.call(l,b)){var d=l[b];d[a]=s.call(d,a)}});var G=c.support={};(function(a){var b=function(){this.x=a},d={0:a,length:a},c=[];b.prototype={valueOf:a,y:a};for(var e in new b)c.push(e);G.enumErrorProps=O.call(Q,"message")||O.call(Q,"name");G.enumPrototypes=O.call(b,
"prototype");G.nonEnumShadows=!/valueOf/.test(c);G.ownLast="x"!=c[0];G.spliceObjects=(Fa.call(d,0,1),!d[0]);G.unindexedChars="xx"!="x"[0]+Object("x")[0]})(1,0);var p=function(a,b){return function(d,c){var e=d?oa(d):0;if(!B(e))return a(d,c);for(var f=b?e:-1,g=C(d);(b?f--:++f<e)&&false!==c(g[f],f,g););return d}}(function(a,b){return ia(a,b,A)}),ia=function(a){return function(b,d,c){var e=C(b);c=c(b);for(var f=c.length,g=a?f:-1;a?g--:++g<f;){var k=c[g];if(false===d(e[k],k,e))break}return b}}(),oa=function(a){return function(b){return null==
b?k:C(b)[a]}}("length"),p=function(a,b){return function(d,c,e){return typeof c=="function"&&e===k&&t(d)?a(d,c):b(d,Y(c,e,3))}}(U,p),T=fa||function(){return(new Date).getTime()},t=S||function(a){return u(a)&&B(a.length)&&"[object Array]"==D.call(a)},aa=ma(ja),S=ma(function(a,b,d){if(d)for(var c=-1,e=A(b),f=e.length;++c<f;){var g=e[c],x=a[g],l=d(x,b[g],g,a,b);(l===l?l===x:x!==x)&&(x!==k||g in a)||(a[g]=l)}else a=null==b?a:ga(b,A(b),a);return a}),fa=function(a,b){return N(function(d){var c=d[0];if(null==
c)return c;d.push(b);return a.apply(k,d)})}(aa,qa),A=wa?function(a){var b=null==a?k:a.constructor;return typeof b=="function"&&b.prototype===a||(typeof a=="function"?c.support.enumPrototypes:w(a))?ra(a):z(a)?wa(a):[]}:ra,Ga=N(function(a,b){if(null==a)return{};var d;if("function"==typeof b[0])d=za(a,Y(b[0],b[1],3));else{d=a;var c=ha(b);d=C(d);for(var e=-1,f=c.length,g={};++e<f;){var k=c[e];k in d&&(g[k]=d[k])}d=g}return d});c.assign=S;c.debounce=function(a,b,d){function c(b,d){d&&clearTimeout(d);p=
n=v=k;b&&(r=T(),s=a.apply(t,l),n||p||(l=t=k))}function e(){var a=b-(T()-m);0>=a||a>b?c(v,p):n=setTimeout(e,a)}function f(){c(w,n)}function g(){l=arguments;m=T();t=this;v=w&&(n||!y);if(false===u)var d=y&&!n;else{p||y||(r=m);var c=u-(m-r),g=0>=c||c>u;g?(p&&(p=clearTimeout(p)),r=m,s=a.apply(t,l)):p||(p=setTimeout(f,c))}g&&n?n=clearTimeout(n):n||b===u||(n=setTimeout(e,b));d&&(g=true,s=a.apply(t,l));!g||n||p||(l=t=k);return s}var l,p,s,m,t,n,v,r=0,u=false,w=true;if(typeof a!="function")throw new TypeError(sa);b=
0>b?0:+b||0;if(true===d)var y=true,w=false;else z(d)&&(y=!!d.leading,u="maxWait"in d&&ba(+d.maxWait||0,b),w="trailing"in d?!!d.trailing:w);g.cancel=function(){n&&clearTimeout(n);p&&clearTimeout(p);r=0;p=n=v=k};return g};c.defaultsDeep=fa;c.forEach=p;c.keys=A;c.keysIn=M;c.merge=aa;c.pick=Ga;c.restParam=N;c.toPlainObject=ka;c.each=p;c.extend=S;c.get=function(a,b,d){if(null==a)a=k;else{var c=Aa(b);b+="";if(null==a)a=void 0;else{a=C(a);b!==k&&b in a&&(c=[b]);b=0;for(var e=c.length;null!=a&&b<e;)a=C(a)[c[b++]];
a=b&&b==e?a:k}}return a===k?d:a};c.identity=la;c.isArguments=y;c.isArray=t;c.isEmpty=function(a){return null==a?true:w(a)&&(t(a)||H(a)||y(a)||u(a)&&I(a.splice))?!a.length:!A(a).length};c.isFunction=I;c.isNative=na;c.isObject=z;c.isPlainObject=X;c.isString=H;c.isTypedArray=W;c.isUndefined=function(a){return a===k};c.now=T;c.VERSION="3.10.1";typeof define=="function"&&typeof define.amd=="object"&&define.amd?(R._=c, define(function(){return c})):K&&L?F?(L.exports=c)._=c:K._=c:R._=c}.call(this));