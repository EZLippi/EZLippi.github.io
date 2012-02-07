---
layout: post
title: jQuery解构：$.support() - DOM2级的事件冒泡和捕获
---
# [{{ page.title }}][1]
2012-02-07 By [BeiYuu][]

###$.support()
jQuery.support是一系列浏览器的差别的属性的集合。所有支持的方法都在[support.js][3]。

###事件类型
DOM2有5种事件类型，下面是他们的分类：
* 用户接口事件：DOMFocusIn、DOMFocusOut、DOMActive
* 鼠标事件：click、mousedown、mouseup、mouseover、mousemove、mouseout
* 键盘事件：在DOM2中没有定义
* 变化事件：DOMSubtreeModified、DOMNodeInserted、DOMNodeRemoved、DOMNodeRemovedFromDocument、DOMNodeInsertedIntoDocument、DOMAttrModified、DOMCharacterDataModified
* HTML事件：load、unload、abort、error、select、change、submit、reset、focus、blur、resize、scroll

###事件支持测试
DOM标准并没有提供如何去检测事件。之前一般都是通过浏览器的识别来解决，但是这个很不可靠。后来Juriy Zaytsev提出另一种检测DOM2的事件的方法。这个技巧的原理是，元素会包含所支持的事件名。

<pre class="prettyprint">
'onclick' in document.documentElement; // true
'onclick2' in document.documentElement; // false
</pre>

但是这个方法的问题是，FireFox不支持，而且浏览器也不是支持对所有元素进行这样的检测。后来发现，创建一个元素之后，元素所支持的事件名也会被设置在这个元素上。

<pre class="prettyprint">
var el = document.createElement('div');
 
el.setAttribute('onclick', 'return;');
typeof el.onclick; // "function"
 
el.setAttribute('onclick2', 'return;');
typeof el.onclick2; // "undefined"
</pre>

比较完善的方法应该是综合上面两种，也就是jQuery的实现方法：

<pre class="prettyprint">
function isMouseEventSupported(eventName) {
    var el = document.createElement('div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = typeof el[eventName] == 'function';
    }
    el = null;
    return isSupported;
}
</pre>

###jQuery.support和事件冒泡
DOM2的规范建议事件分三个步骤：捕获、目标、冒泡。FireFox、Opera和Safari对这个支持的很好，但是IE只支持冒泡。我们不用关心捕获和目标阶段了。重点在冒泡。submit、change和focusin在W3C的DOM事件模型中也是规定需要冒泡的DOM树的。

<pre class="prettyprint">
if ( div.attachEvent ) {
  for( i in {
    submit: 1,
    change: 1,
    focusin: 1
  } ) {
    eventName = "on" + i;
    isSupported = ( eventName in div );
    if ( !isSupported ) {
      div.setAttribute( eventName, "return;" );
      isSupported = ( typeof div[ eventName ] === "function" );
    }
    support[ i + "Bubbles" ] = isSupported;
  }
}
</pre>

你可以这样测试：

<pre class="prettyprint">
console.log(
  'submitBubbles: ' + jQuery.support.submitBubbles+'\n' + 'changeBubbles: ' + jQuery.support.changeBubbles+'\n' + 'focusinBubbles: ' + jQuery.support.focusinBubbles+''
  );
</pre>

相关参考：

* DOM事件：[http://www.w3.org/TR/DOM-Level-2-Events/events.html][4]
* jQuery.support API：[http://api.jquery.com/jQuery.support/][5]
* jQUery.support on github：[https://github.com/jquery/jquery/blob/master/src/support.js][3]

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    https://github.com/jquery/jquery/blob/master/src/support.js
[4]:    http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
[5]:    http://api.jquery.com/jQuery.support/
