---
layout: post
title: jQuery解构：.toArray()
---
# [{{ page.title }}][1]
2012-02-07 By [BeiYuu][]

###.toArray()
就像方法的名字一样，`.toArray()`用来把jQuery集合中的DOM元素按照数组的形式返回。

在core.js中，代码是这样的：

    toArray: function() {
      return slice.call( this, 0 );
    }

看起来只有一行，但是还有很多东西需要挖掘的。

###slice是什么
我们翻到core.js的63行，就会看到：

    slice = Array.prototype.slice

所以`slice`是Array一个原型方法，所以函数就可以改为：

    toArray: function() {
      return Array.prototype.slice.call( this, 0 );
    }

`slice()`方法是javascript原生的方法，用来选择返回一个数组中的一些元素。第一个参数是确定从哪里开始选取，第二个是确定从哪里结束。

    ["ESPN", "Discovery", "CNN", "BBC"].slice(1,3);
    //returns ["Discovery", "CNN"]

如果我们忽略第二个参数，就会选择从开始到最后一个的所有元素：

    ["ESPN", "Discovery", "CNN", "BBC"].slice(0);
    //returns ["ESPN", "Discovery", "CNN", "BBC"]

###call是什么
`call`是javascript原生的一个非常有用的方法，一个对象可以通过使用这个方法，将其他对象的方法当做自己的方法一样使用。

    var meeting = {
      name: 'jsconf',
      attend: function(status) {
        return 'I ' + status + 'attending ' + this.name + 'tomorrow';
      }
    }
     
    var otherMeeting = {
      name: 'pycon'
    }
     
    meeting.attend.call(otherMeeting , 'not attending');
    // returns: I am not attending pycon tomorrow

在`.toArray`方法中，我们从`Array`对象中借用了`slice`方法，然后第一个参数设为0。所以就会返回所有元素。

###其他的使用小技巧
这种使用方法在很多地方都有用到。

在plugin.js中，会看到：

    var newarr = [].slice.call(arguments);

[]是数组字面量。为什么使用[]而不是Array.prototype呢，因为Array.prototype很可能被别人重写，但是[]不会。

再看看另外一个例子。如果你在没用jQuery的情况下写一个toArray方法，可以这样：

    // jQuery version
    $('li').toArray()
    // querySelectorAll version
    [].slice.call(document.querySelectorAll('li'), 0)


### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
