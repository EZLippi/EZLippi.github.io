---
layout: post
title: jQuery解构：jQuery.globalEval() - 在全局上下文中执行脚本
---
# [{{ page.title }}][1]
2012-02-07 By [BeiYuu][]

###jQuery.globalEval()
jQuery有一个`jQuery.globalEval()`方法，这个方法跟javascript原生的`eval()`方法的不同之处在于，`globalEval()`是在全局的上下文环境中执行代码，可以在全局的域上动态加载代码。

看看代码吧；

<pre class="prettyprint">
globalEval: function( data ) {
  if ( data && rnotwhite.test( data ) ) {
    // We use execScript on Internet Explorer
    // We use an anonymous function so that context is window
    // rather than jQuery in Firefox
    ( window.execScript || function( data ) {
      window[ "eval" ].call( window, data );
    } )( data );
  }
}
</pre>

Jim Driscoll发现对于大多数浏览器，你可以使用`eval.call(window,data)`，但是对于chrome和IE还是有点不同。

Internet Explorer：
在IE下面需要使用window.exeScript(data)

在Chrome下：
`eval.call(widnow,data)`在Chrome下面不起作用，但是`window['eval'].call(window,data)`管用，所以最终的解决办法就是上面代码那样子了。

下面是个简单的测试：

<pre class="prettyprint">
    <div id="log">&#60;</div>
    <script>
    function test(){
      jQuery.globalEval("var drinkType = 'absinthe';")
    }
    test();
    if (drinkType == 'absinthe') {
      $('#log').html('live healthly, drink ' + drinkType+'');
    }
    </script>
</pre>

相关参考：
[https://github.com/jquery/jquery/blob/master/src/core.js#L571][3]
Jim Driscoll的文章：[http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context][4]

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    https://github.com/jquery/jquery/blob/master/src/core.js#L571
[4]:    http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
