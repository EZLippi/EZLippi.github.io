---
layout: post
title: jQuery解构：面向对象和jQuery - 对象
---
# [{{ page.title }}][1]
2012-01-29 By [BeiYuu][]

在[第一部分][3]中，我们介绍了**变量**和**函数**的概念，这一部分，我们来看看对象的概念。

####对象就是对象，就像一个人或者一把椅子
我们一直在说面向对象编程，那么到底什么是对象呢？对象就是对象，我就是一个对象，一个人类。一只狗也是一个对象，一个动物的对象。所以面向对象编程就是对象在编程语言中的一个表达。

所以在面向对象编程中，可以用一个对象来表示我：

<pre class="prettyprint">
var shichuan= {}
</pre>

对于没一个对象来说，都有他的属性和方法（行为）。比如，我是黑头发，这就是我的属性。它不是一个方法，因为我不需要经常把它染黑。他就是黑的。所以我可以把这个属性添在对象上。

<pre class="prettyprint">
var shichuan = {
    hair:'black'
};
</pre>

然后呢我还有个爱好，就是喜欢骑独角兽，所以骑独角兽就是我的一个方法。放在对象中，就是：

<pre class="prettyprint">
var shichuan = {
    hair:'black',
    ridingUnicorn:function(){
        //how i ride unicorn
    }
}
</pre>

总结一下就是：

1. 这个对象的变量名是`chichuan`
1. 用`{`和`}`包裹起来
1. 对象里面的元素（属性、方法）用逗号分隔
1. 对象元素的名称和值用冒号分隔
1. 方法其实就是函数，比如`ridingUnicore`就是`shichuan`对象的一个方法

####jQuery中的对象
那么jQuery中的对象是怎样的呢，还记得我们在第一部分中讨论过的局部变量jQuery吗？我们来看看这个jQuery函数（在[第四行][4]），只有一行代码和一行解释：jQuery对象只是一个初始化构造器的扩展。

<pre class="prettyprint">
var jQuery = function( selector, context ) {
  // The jQuery object is actually just the init constructor 'enhanced'
  return new jQuery.fn.init( selector, context, rootjQuery );
}
</pre>

如果你搜索jQuery.fn，差不多在[78行][5]附近，可以看到：
<pre class="prettyprint">
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
  ...
  },
  ...
}
</pre>

jQuery prototype（我们后面会讨论）是一个非常大的对象。有很多很多的属性和方法。比如：`constructor`、`selector`、`jquery`、`length`等等的属性。也有类似`init`、`size`、`toArray`、`get`、`pushStack`这样的方法。

####函数是数据，也是对象
在第一部分，我们说函数是数据，而且下面这两种写法是一样的：
<pre class="prettyprint">
// local jQuery
function jQuery( selector, context ){
  //...
}
// local jQuery
var jQuery = function( selector, context ){
  //...
}
</pre>

其实还有第三种方法：
<pre class="prettyprint">
// local jQuery
var jQuery = new Function('selector', 'context', '//...');
</pre>

虽说这样子也可以定义函数，但是不推荐，因为如果这样写，javascript会想处理eval一样把你传入的源码执行。

下一部分我们就来讨论prototype。


### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    http://beiyuu.com/decoding-jquery/oop-jquery-function "jQuery解构：面向对象和jQuery - 函数"
[4]:    https://github.com/jquery/jquery/blob/master/src/core.js#L4
[5]:    https://github.com/jquery/jquery/blob/master/src/core.js#L78
