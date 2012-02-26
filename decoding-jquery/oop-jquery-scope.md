---
layout: post
title: jQuery解构：面向对象和jQuery - 作用域
---
# [{{ page.title }}][1]
2012-02-02 By [BeiYuu][]

在这一部分，我们来看一下函数作用域，jQuery的链式调用和jQuery.fn。

###函数作用域
我们看到jQuery对象多次封装在不同的函数里面。为什么我们要用函数来定义作用域呢？因为Javascript不能使用括号来定义作用域。Javascript的变量只有函数的作用域。

比如我们在下面例子中，想让jQuery成为局部变量，我们需要把它封装在函数里面：

    function a() {
      var jQuery = "hellow world";
    }
    console.log(jQuery); // undefined

Javscript的函数有词法作用域，意思就是函数在定义的时候就有了他们的作用域，而不是执行的时候：

    var jQuery = 'hi there';
    var jQuery = (function() {
      console.log(jQuery);
      var jQuery = "hello world";
    })();
    // undefined

如果我们运行上面这段代码，返回值是`undefined`而不是`hi there`。这也就是说，jQuery函数创建了他自己的作用域，没有读取`var jQuery = 'hi there'`。所以对于jQuery函数来说，`jQuery`变量是要（但是还没有）定义在函数内的。

###jQuery的链式调用
我们研究`init`方法的时候，你可能会注意到，总是会出现`return this`：

    var jQuery = function( selector, context ) {
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init( selector, context, rootjQuery );
    }
    jQuery.fn = jQuery.prototype = {
      init: function( selector, context, rootjQuery ) {
        //...
        return this;
        //...
      }
    }

在jQuery中，我们可以通过链式的方式来调用方法，可以这样做，就是因为每个方法都返回了`jQuery`这个对象本身。那么这是怎么做到的呢？

我们先来看看`this`关键字在对象中是怎么运作的：

    var city = {
      name: 'beijing',
      getName: function() {
          return this.name;
        }
    }
    console.log(city.getName());

在上面这个例子中，`city`的名字显示是`beijing`，也就是说在这里`this`指代的是这个对象本身。

如果我们返回对象本身呢？

    var num = {
      value: 1,
      minus: function (n) {
         this.value -= n;
         return this;
        },
      plus: function (n) {
          this.value += n;
          return this;
        },
      getVal: function () {
          console.log(this.value);
        }
    };
     
    num.minus(2).plus(5).getVal();

###jQuery.fn
在core.js里面，我们可以看到这样的一行代码：

    jQuery.fn = jQuery.prototype = {
        //…
    }

当我们开发插件的时候，我们会使用`$.fn`。实际上我们是在通过添加方法来扩展jQuery.prototype。所以通常返回`this`也会非常方便：

    (function( $ ){
      $.fn.fontcolor = function() {
          return this.each(function() {
                $(this).css("color", "orange"); 
              });
        };
    })( jQuery );

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
