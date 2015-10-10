//https://github.com/bjoerge/route-pattern/blob/master/route-pattern-standalone.js
//route-pattern-standalone.js
//0.0.6
(function(t){if("function"==typeof bootstrap)bootstrap("routepattern",t);else if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeRoutePattern=t}else"undefined"!=typeof window?window.RoutePattern=t():global.RoutePattern=t()})(function(){return function(t,e,r){function n(r,o){if(!e[r]){if(!t[r]){var i="function"==typeof require&&require;if(!o&&i)return i(r,!0);if(a)return a(r,!0);throw Error("Cannot find module '"+r+"'")}var s=e[r]={exports:{}};t[r][0].call(s.exports,function(e){var a=t[r][1][e];return n(a?a:e)},s,s.exports)}return e[r].exports}for(var a="function"==typeof require&&require,o=0;r.length>o;o++)n(r[o]);return n}({1:[function(t,e){function r(){return[].slice.call(arguments).reduce(function(t,e){for(var r in e)t[r]=e[r];return t},{})}function n(t){var e=/([^\?#]*)?(\?[^#]*)?(#.*)?$/,r=e.exec(t);return{path:r[1]||"",queryString:r[2]&&r[2].substring(1)||"",hash:r[3]&&r[3].substring(1)||""}}var a=t("querystring"),o=function(){function t(t){this.params=t.params,this.allowWildcards=t.allowWildcards,this.routeString=t.routeString}return t.prototype.matches=function(t){for(var e,r=(t||"").split("&").reduce(function(t,e){var r=e.split("="),n=r[0],a=r[1];return n&&(t[n]=a),t},{}),n=[].concat(this.params);e=n.shift();){if(!r.hasOwnProperty(e.key))return!1;if(e.value&&r[e.key]!=e.value)return!1}return!this.allowWildcards&&this.params.length&&Object.getOwnPropertyNames(r).length>this.params.length?!1:!0},t.prototype.match=function(t){if(!this.matches(t))return null;var e={params:[],namedParams:{},namedQueryParams:{}};if(!t)return e;var r=this.params.reduce(function(t,e){return t[e.key]=e.name,t},{}),n=a.parse(t);return Object.keys(n).forEach(function(t){var a=n[t];e.params.push(a),r[t]&&(e.namedQueryParams[r[t]]=e.namedParams[r[t]]=a)}),e},t.fromString=function(e){var r={routeString:e,allowWildcards:!1,params:[]};return e.split("&").forEach(function(t){if(t){var e=t.split("="),n=e[0],a=e[1]||"",o=!1,i={key:n};":"==a.charAt(0)?i.name=a.substring(1):"*"==n&&""==a?o=r.allowWildcards=!0:i.value=a,o||r.params.push(i)}}),new t(r)},t}(),i=function(){function t(t){this.regexp=t.regexp,this.params=t.params,this.routeString=t.routeString}var e=/:\w+/g,r=/\*\w+/g,n=/(:[^\/\.]+)|(\*\w+)/g,a=/\*/g,o=/[-[\]{}()+?.,\\^$|#\s]/g;return t.prototype.matches=function(t){return this.regexp.test(t)},t.prototype.match=function(t){if(!this.matches(t))return null;var e={params:[],namedParams:{}};return(this.regexp.exec(t)||[]).slice(1).forEach(function(t,r){void 0!==t&&(t=decodeURIComponent(t)),e.namedParams[this.params[r]]=t,e.params.push(t)},this),e},t.routePathToRegexp=function(t){return t=t.replace(o,"\\$&").replace(e,"([^/]+)").replace(r,"(.*)?").replace(a,".*?").replace(/\/?$/,"/?"),RegExp("^/?"+t+"$")},t.fromString=function(e){e=e.split(/\?|#/)[0];var r={routeString:e,regexp:t.routePathToRegexp(e),params:(e.match(n)||[]).map(function(t){return t.substring(1)})};return new t(r)},t}(),s=function(){function t(t){this.regex=t}return t.prototype.matches=function(t){return this.regex.test(t)},t.prototype.match=function(t){if(!this.matches(t))return null;var e=n(t);return{params:this.regex.exec(t).slice(1),queryParams:a.parse(e.queryString),namedParams:{}}},t}(),u=function(){function t(t){this.pathPattern=t.pathPattern,this.queryStringPattern=t.queryStringPattern,this.hashPattern=t.hashPattern,this.routeString=t.routeString}return t.prototype.matches=function(t){var e=n(t);return!(this.pathPattern&&!this.pathPattern.matches(e.path)||this.queryStringPattern&&!this.queryStringPattern.matches(e.queryString)||this.hashPattern&&!this.hashPattern.matches(e.hash))},t.prototype.match=function(t){if(!this.matches(t))return null;var e,o,i=n(t),s={params:[],namedParams:{},pathParams:{},queryParams:a.parse(i.queryString),namedQueryParams:{},hashParams:{}},u=function(t){s.params=s.params.concat(t.params),s.namedParams=r(s.namedParams,t.namedParams)};return(o=this.pathPattern)&&(e=o.match(i.path),e&&u(e),s.pathParams=e?e.namedParams:{}),(o=this.queryStringPattern)&&(e=o.match(i.queryString),e&&u(e),s.namedQueryParams=e?e.namedQueryParams:{}),(o=this.hashPattern)&&(e=o.match(i.hash),e&&u(e),s.hashParams=e?e.namedParams:{}),s},t.fromString=function(e){var r=n(e),a=r.path,s=r.queryString||e.indexOf("?")>-1,u=r.hash||e.indexOf("#")>-1;return new t({pathPattern:a&&i.fromString(r.path),queryStringPattern:s&&o.fromString(r.queryString),hashPattern:u&&i.fromString(r.hash),routeString:e})},t}();e.exports=u,u.QueryStringPattern=o,u.PathPattern=i,u.RegExpPattern=s},{querystring:2}],2:[function(t,e,r){function n(t,e){if(!e)throw new TypeError("stringify expects an object");return e+"="+encodeURIComponent(t)}function a(t,e){var r=[];if(!e)throw new TypeError("stringify expects an object");for(var n=0;t.length>n;n++)r.push(h(t[n],e+"[]"));return r.join("&")}function o(t,e){for(var r,n=[],a=f(t),o=0,i=a.length;i>o;++o)r=a[o],n.push(h(t[r],e?e+"["+encodeURIComponent(r)+"]":encodeURIComponent(r)));return n.join("&")}function i(t,e,r){var n=t[e];void 0===n?t[e]=r:u(n)?n.push(r):t[e]=[n,r]}function s(t){for(var e,r,n=t.length,a=0;n>a;++a)if(r=t[a],"]"==r&&(e=!1),"["==r&&(e=!0),"="==r&&!e)return a}var u="function"==typeof Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},f=Object.keys||function f(t){if(t!==Object(t))throw new TypeError("Invalid object");var e=[];for(var r in t)t.hasOwnProperty(r)&&(e[e.length]=r);return e};r.version="0.3.1";var p=Object.prototype.toString,c=/[^0-9]/;r.parse=function(t){function e(t,e){if(0==t[e].length)return t[e]={};var r={};for(var n in t[e])r[n]=t[e][n];return t[e]=r,r}return null==t||""==t?{}:(t+"").split("&").reduce(function(t,r){function n(t,r,a){var o=t.shift();o?(obj=r[a]=r[a]||[],"]"==o?u(obj)?""!=m&&obj.push(m):"object"==typeof obj?obj[f(obj).length]=m:obj=r[a]=[r[a],m]:~o.indexOf("]")?(o=o.substr(0,o.length-1),c.test(o)&&u(obj)&&(obj=e(r,a)),n(t,obj,o)):(c.test(o)&&u(obj)&&(obj=e(r,a)),n(t,obj,o))):u(r[a])?r[a].push(m):r[a]="object"==typeof r[a]?m:r[a]===void 0?m:[r[a],m]}try{r=decodeURIComponent(r.replace(/\+/g," "))}catch(a){}var o=r.indexOf("="),p=s(r),h=r.substr(0,p||o),m=r.substr(p||o,r.length),m=m.substr(m.indexOf("=")+1,m.length),l=t;if(""==h&&(h=r,m=""),~h.indexOf("]")){var d=h.split("[");d.length,n(d,l,"base")}else{if(c.test(h)&&u(l.base)){var g={};for(var y in l.base)g[y]=l.base[y];l.base=g}i(l.base,h,m)}return t},{base:{}}).base};var h=r.stringify=function(t,e){return u(t)?a(t,e):"[object Object]"==p.call(t)?o(t,e):"string"==typeof t?n(t,e):e}},{}]},{},[1])(1)});
