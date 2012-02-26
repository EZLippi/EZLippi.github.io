---
layout: post
title: jQuery解构：jQuery.inArray()
---
# [{{ page.title }}][1]
2012-02-07 By [BeiYuu][]

###jQuery.inArray()
在大多数的编程语言中，都会有`inArray`方法，但是javascript中没有。jQuery实现了该方法，他会在一个数组中查找特定的值，然后返回index（如果没找到返回-1）。

看看怎么使用吧：

    var arr = [ "Nokia", "Android", "Palm", "iPhone" ];
    console.log(jQuery.inArray("Android", arr));
    console.log(jQuery.inArray("Motorola", arr));
    console.log(jQuery.inArray("Nokia", arr));
     
    // returns
    // "Android" found at 1
    // "Motorola" not found, so -1
    // "Nokia" found at 0

源码是这样的：

    inArray: function( elem, array ) {
      if ( indexOf ) {
        return indexOf.call( array, elem );
      }
      for ( var i = 0, length = array.length; i < length; i++ ) {
        if ( array[ i ] === elem ) {
          return i;
        }
      }
      return -1;
    }

`call`我们在之前的文章中有讨论，是一个非产有用的方法，可以借用别的对象的方法作为自己的方法使用。

###检测是否支持indexOf

    if ( indexOf ) {
        //...
    }

###如果支持，直接使用indexOf方法

    if ( indexOf ) {
    return indexOf.call( array, elem );
    }

###如果不支持，就循环元素

    for ( var i = 0, length = array.length; i < length; i++ ) {
      if ( array[ i ] === elem ) {
          return i;
      }
    }

###如果没找到，就返回-1

    return -1;

如果使用原生的indexOf，效率会高一些。

### [回jQuery解构目录][2]

[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
