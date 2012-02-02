---
layout: post
title: jQuery解构：面向对象和jQuery - 工厂模式
---
# [{{ page.title }}][1]
2012-02-02 By [BeiYuu][]

在这一部分，我们来看工厂设计模式（Factory Design Pattern），也是jQuery core中使用的一种设计模式。

###对象的创建
在经典的设计模式理论[(Design Patterns: Elements of Reusable Object-Oriented Software)][3]中，面向对象的设计模式总结为三种类型：

* 创建模式－创建对象的方法
* 结构模式－组合不同对象提供新的函数功能
* 行为模式－对象间交互的模式

工厂模式属于创建模式，用来处理对象的创建方法。

我们先看下普通的对象创建方法:

<pre class="prettyprint">
var taskManager = {};
taskManager.update = function() {
    console.log("update");
}
taskManager.read = function() {
    console.log("read");
}
</pre>

如果我们想基于`taskManager`创建一个新的`task`对象，并且通过一个变量来控制到底是生成`update`还是`read`的话，我们会这样做：

<pre class="prettyprint">
var type = "update";
var task;
if (type === 'update') {
  task = new taskManager.update();
}
 
if (type === 'read') {
  task = new taskManager.read();
}
</pre>

看见了吧，如果我们有10中不同的类型，那就杯具了，工厂模式就是用来解决这个问题的。

###工厂模式
为了简化对象的创建，我们在`taskManager`里面创建一个`factory`方法：

<pre class="prettyprint">
taskManager.factory = function (typeType) {
  return new taskManager[typeType];
}
</pre>

我们就可以这样用了：

<pre class="prettyprint">
task = new taskManager[type];
</pre>

###jQuery中的工厂模式
在jQuery的core.js中也有一个类似的用法：

<pre class="prettyprint">
var jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
}
</pre>

这样用的理由很简单，jQuery不知道用户会输入什么样的选择符，也可能是`$('p')`也可能是`$('#hooker')`。所以这个方法就很管用了。

关于设计模式的内容，也可以看看这个：[Essential JavaScript Design Patterns For Beginners, Volume 1][4]。


### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    http://en.wikipedia.org/wiki/Design_Patterns
[4]:    http://addyosmani.com/resources/essentialjsdesignpatterns/book/
