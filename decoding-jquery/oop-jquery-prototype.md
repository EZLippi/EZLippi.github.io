---
layout: post
title: jQuery解构：面向对象和jQuery - 原型
---
# [{{ page.title }}][1]
2012-01-30 By [BeiYuu][]

在这一部分中，我们来讨论原型（prototype）。因为Javascript是一个基于原型的语言，所以原型的概念很重要。那么基于class的语言呢？我们会跟基于class的语言做比较吗？不，至少现在不。我不觉得为了理解原型去和class做对比。你给一个人教日语的时候，不需要先介绍中文吧。现在我们来看看到底什么是原型，以及在jQuery中原型是怎么被使用的吧。

###每一个function都有一个原型，原型也是一个对象
我们可以用jQuery的[core.js](https://github.com/jquery/jquery/blob/master/src/core.js)来测试：

    var jQuery = function( selector, context ) {
      //...
    }
    console.log(typeof jQuery.prototype);
     
    // returns object

###给原型添加属性和方法
一般用来给原型添加方法和属性的方式如下：

    jQuery.prototype.constructor = jQuery;
    jQuery.prototype.init = function( selector, context, rootjQuery ) {
      //...
    }

在jQuery的原型中，大概在[78行][5]附近，用来定义原型的方式确是下面这种形式（实际上这是jQuery.fn的定义，他是jQuery.prototype的一个别名，为了简洁，我们直接写prototype）：

    jQuery.prototype = {
      constructor: jQuery,
      init: function( selector, context, rootjQuery ) {
        //...
      }
    }

在jQuery中，完全用一个对象重写了prototype。那么第一种写法和这种写法的区别之处在哪呢？其实就像下面这两段话一样：

> 我又三只猫，他们分别是绿的，蓝的和粉的。
> 我有一只绿猫，我有一只蓝猫，我有一只粉猫。

其实差距也没那么大啦 ^_^

还有第三种写法，你可以使用this关键字来添加方法和属性：

    function jQuery() {
      this.constructor= jQuery;
      this.init= function( selector, context, rootjQuery ) {
        //...
      }
    }

###使用原型的方法和属性
如果要使用方法或者属性，就必须new一个对象。在jQuery中是这样的，大概在[第6行][4]附近：

    new jQuery.fn.init( selector, context, rootjQuery );

你可能会注意到，在[302行][6]附近，还有一句这样的：

    jQuery.fn.init.prototype = jQuery.fn;

那么，jQuery函数，jQuery.fn，prototype和init之间的关系到底是怎么样的呢？

我们在下一部分会讲到他们之间的联系。

    var jQuery = function( selector, context ) {
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init( selector, context, rootjQuery );
    }
    jQuery.fn = jQuery.prototype = {
      init: function( selector, context, rootjQuery ) {
        //...
      }
    }
    // Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    http://beiyuu.com/decoding-jquery/oop-jquery-function "jQuery解构：面向对象和jQuery - 函数"
[4]:    https://github.com/jquery/jquery/blob/master/src/core.js#L6
[5]:    https://github.com/jquery/jquery/blob/master/src/core.js#L78
[6]:    https://github.com/jquery/jquery/blob/master/src/core.js#L302
