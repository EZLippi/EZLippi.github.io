---
layout: post
title: JavaScript代码片段
category: wiki 
---
# [{{ page.title }}][1]
2012-01-30 By [BeiYuu][]

##导航
[Class](#class)

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


[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[1]:    {{ page.url}}  ({{ page.title }})
