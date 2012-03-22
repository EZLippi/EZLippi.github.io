---
layout: post
title: jQuery解构：面向对象和jQuery - 外观模式
---
# [{{ page.title }}][1]
2012-02-02 By {{ site.author_info }}

在这一部分，我们来讨论一下外观设计模式，用到的地方很多，比如jQuery Event。外观模式用来把一堆功能残缺的接口封装成一个完美的接口。

看jQuery的代码，在event.js中，有[这样一段][3]：

    jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
            if ( elem.removeEventListener ) {
                elem.removeEventListener( type, handle, false );
            }
        } :
        function( elem, type, handle ) {
            if ( elem.detachEvent ) {
                elem.detachEvent( "on" + type, handle );
            }
        };

在这个例子中，如果浏览器支持`removeEventListener`，那么`ele.removeEventListener`就会被使用，对于较古老的IE浏览器，就是用`ele,detachEvent`。所以removeEvent提供了一个对这两种存在兼容性问题的接口的一个封装接口。

而且重命名的接口名字`removeEvent`也让代码更加的易读易懂。

除了解决浏览器兼容性问题的方面，还有一些用来将不同目的的接口封装为一个接口，来简化操作的使用方式，比较好的一个例子就是：

    var myevent = {
    // ...
    stop: function (e) {
  e.preventDefault();
      e.stopPropagation();
    }
    // ...
    };

`stopPropagation()`是用来阻止事件冒泡的，`preventDefault()`是用来阻止浏览器触发元素默认事件的（比如`click`）。虽然是两个不同的事件，但是他们经常一起使用，所以封装在`stop`方法中。

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    https://github.com/jquery/jquery/blob/master/src/event.js#L616-626
