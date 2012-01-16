---
layout: post
title: jQuery解构：面向对象和jQuery - 函数
---
# [{{ page.title }}][1]
2012-01-16 By [BeiYuu][]

作为[jQeury解构][2]中的一个小系列，面向对象和[jQuery][]主要集中看一下jQuery内部的实现以及一些面向对象的概念。

> 学习面向对象编程的最好的办法就是去研究一个真正的框架
> 学习框架最好的办法就是深入研究面向对象的概念

jQueyr core是jQuery最重要的部分，其中有五个重要的概念：变量、函数、对象、原型和继承。这些相当于大脑中的垂体，也是面向对象的精髓所在。

jQuery所有的功能都包含在jQuery这个全局变量中。在core.js中有两个jQuery变量，一个全局的，一个局部的。我们现在就来分析一下这两个变量，他们存在的形式大致如下：

    // global jQuery
    var jQuery = (function() {
      // local jQuery
      var jQuery = function( selector, context ) {
        // ...
      }
    })();

#### 变量用来存储数据，函数就是数据
下面这个就是局部的变量存在的形式：

      // local jQuery
      var jQuery = function( selector, context ) {
        // ...
      }

函数在Javascript中就是数据。这也就意味着下面这两种定义函数的方法是一样的：

    // local jQuery
    function jQuery( selector, context ){
      //...
    }
    // local jQuery
    var jQuery = function( selector, context ){
      //...
    }

#### 函数可以使匿名的

[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
