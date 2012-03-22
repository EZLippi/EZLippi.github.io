---
layout: post
title: jQuery解构：jQuery.extend() - 从对象继承的对象
---
# [{{ page.title }}][1]
2012-02-07 By {{ site.author_info }}

###jQuery.extend()

当新生成一个对象的时候，通常有两种方式，一种是浅复制，一种是深复制。在浅复制中，如果你在拷贝中修改这个对象，源对象同样会被修改。在深复制中，修改新对象不会对源对象造成影响，下面看看深浅复制的例子：

    var artist = {
        name: 'Serge Gainsbourg',
        tags: ['french', 'chanson francaise', 'chanson'],
        similar: {
            name: 'Jane Birkin'
        }
    };
    var myShallow = {};
    $.extend(myShallow, artist);
    myShallow.tags.push('pop');
    console.log(myShallow.tags);
    console.log(artist.tags);
     
    var myDeep = {};
    $.extend(true, myDeep, artist);
    myDeep.tags.push('french pop');
    console.log(myDeep.tags);
    console.log(artist.tags);

你会得到下面的结果：

    ["french", "chanson francaise", "chanson", "pop"]
    extend.html:46["french", "chanson francaise", "chanson", "pop"]
    extend.html:51["french", "chanson francaise", "chanson", "pop", "french pop"]
    extend.html:52["french", "chanson francaise", "chanson", "pop"]

在jQuery的代码中，你会看待有个`deep`变量用来确定到底是用浅复制还是深复制，如果是浅复制，就会一个一个的循环对象的属性。

如果是深复制，也会一个属性一个属性的循环，但是当属性指向一个对象的时候，并不会移动原来的对象，而是拷贝一份。看代码吧：

    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
        if (copyIsArray) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];
     
        } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
        }
     
        // Never move original objects, clone them
        target[name] = jQuery.extend(deep, clone, copy);
     
        // Don't bring in undefined values
    } else if (copy !== undefined) {
        target[name] = copy;
    }

还有一些资料：

* jQuery源码：[https://github.com/jquery/jquery/blob/master/src/core.js#L304][3]
* $.extend的用法：[http://api.jquery.com/jQuery.extend/][4]
* 深复制的概念：[http://javascript.about.com/od/objectorientedjavascript/a/oop17.htm][5]


### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    https://github.com/jquery/jquery/blob/master/src/core.js#L304
[4]:    http://api.jquery.com/jQuery.extend/
[5]:    http://javascript.about.com/od/objectorientedjavascript/a/oop17.htm
