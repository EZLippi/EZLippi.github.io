---
layout: post
title: jQuery解构：jQuery.isWidow() - 检测window对象
---
# [{{ page.title }}][1]
2012-02-07 By [BeiYuu][]

###jQuery.isWindow()
jQuery有一个`isWindow()`方法，在jQuery中的很多地方都有用到，用来检测操作对象是否为浏览器窗口（比如当前的窗口，或者iframe）。

    <!doctype html>
    <html>
    <head>
      <script src="http://code.jquery.com/jquery-latest.js"></script>
    </head>
    <body>
      Is 'window' a window? <b></b>
    <script>$("b").append( "" + $.isWindow(window) );</script>
     
    </body>
    </html>

那么代码是怎样的呢：

    // A crude way of determining if an object is a window
    isWindow:function( obj ) {
      return obj && typeof obj === "object" && "setInterval" in obj;
    }

他的工作原理是：
<ul>
	<li>他会检测是否返回一个对象</li>
	<li>他会检测返回的对象是否为<code>object</code></li>
	<li>检测返回的对象是否有<code>setInterval</code>方法，该方法只在<code>window</code>对象中存在</li>
</ul>

相关参考：

* [http://api.jquery.com/jQuery.isWindow/][3]
* [https://github.com/jquery/jquery/blob/master/src/core.js#L480][4]
* [https://developer.mozilla.org/En/Window.setInterval][5]

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    http://api.jquery.com/jQuery.isWindow/
[4]:    https://github.com/jquery/jquery/blob/master/src/core.js#L480
[5]:    https://developer.mozilla.org/En/Window.setInterval
