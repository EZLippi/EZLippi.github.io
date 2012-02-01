---
layout: post
title: JavaScript代码片段
category: wiki 
---
# [{{ page.title }}][1]
2012-01-30 By [BeiYuu][]

##导航
[Class](#class)
[Tricks](#tricks)

<h2 id="class">Class</h2>
<pre class="prettyprint">
hasClass = function (el, cl) {
    var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
    return !!el.className.match(regex);
},

addClass = function (el, cl) {
    el.className += ' ' + cl;
},

removeClass = function (el, cl) {
    var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
    el.className = el.className.replace(regex, ' ');
},

toggleClass = function (el, cl) {
    hasClass(el, cl) ? removeClass(el, cl) : addClass(el, cl);

};
</pre>

<h2 id="tricks">Tricks</h2>
取整同时转成数值型：
<pre class="prettyprint">
'10.567890'|0 //结果: 10
'10.567890'^0 //结果: 10
-2.23456789|0 //结果: -2
~~-2.23456789 //结果: -2
</pre>

日期转数值
<pre class="prettyprint">
var d = +new Date(); //1295698416792
</pre>

漂亮的随机码：
<pre class="prettyprint">
Math.random().toString(16).substring(2); //14位
Math.random().toString(36).substring(2); //11位
</pre>

用0补全位数：
<pre class="prettyprint">
function prefixInteger(num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2);
}
</pre>

将一个数组插入另一个数组的指定位置：
<pre class="prettyprint">
var a = [1,2,3,7,8,9];
var b = [4,5,6];
var insertIndex = 3;
a.splice.apply(a, Array.concat(insertIndex, 0, b));
// a: 1,2,3,4,5,6,7,8,9
</pre>

最短的IE判断：
<pre class="prettyprint">
var ie = !-'\v1' ;
alert(ie);
</pre>




[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[1]:    {{ page.url}}  ({{ page.title }})
