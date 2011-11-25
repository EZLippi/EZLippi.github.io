---
layout:     post
title:      为博客添加 DisQus 评论
category:   blog
---
# {{ page.title }}
2011-11-15 By PIZn @杭州

昨晚小试了下 DisQus ，觉得很好用。做下总结。

###如何开始

首先，你需要有一个 DisQus 的账号，非常简单，有个邮箱就可以了。
当你注册一个邮箱之后，只有3个步骤，就能完成添加评论的功能。

####1，注册你的网站

需要填写的地方分别是：Site URL，Site Name，Site Shortname。
注意：这3个都是必须要填写的，而且，短域名将会在最后的 install 中使用到。

####2，一些简单的设置

在这里，你需要设置的是你的评论的语言（这里在你生成的代码中，会有一条语言格式的
js请求）；如果你有一些社交化工具，例如twitter，也可以填上；还有一些评论重要的选
项，例如过滤垃圾评论，回调评论等。

####3，将 DisQus 安装到你的网站。

选择你需要安装的类型。假如你是 wordpress 博客，那你就可以方便地使用一个插件就行
了。类似的还有其他很多种博客的插件。
假如没有你需要的，在下面还有一步“Universal Code”来安装。现在我的 GitHub 博客，
就是直接安装代码来完成的。

###如何安装

因为我还没试过其他插件式的安装，在这里就先讲一下如何安装源代码吧。说是安装，其实
也就是将一段 Js 代码嵌入到你的博客源代码里面。但也有很多地方需要注意的。

####在你开始之前

1,    你需要确定你已经注册了 DisQus
2,    有权限编辑网站上的代码
3,    获取你的短域名，就是上面说的那个 Shortname

####获取代码

很愉快的是，DisQus 已经为我们生成了这样的一段代码：

      <div id="disqus_thread"></div>
      <script type="text/javascript">
      var disqus_shortname = 'example'; // 注意，这里的 example 要替换为你自己的短域名
      /* * * 下面这些不需要改动 * * */
      (function() {
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
      </script>
      <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
      <a href="http://disqus.com" class="dsq-brlink">blog comments powered by <span class="logo-disqus">Disqus</span></a>


####嵌入到网页里面去

对于一般的博客来说，评论都是放在文章页面的。嗯。你懂的。
对于 GitHub Page 来说，你可以把上面这段代码，嵌入到你的 layout 里面的 post.html
里面，放在最后就好了。( 当然，每个人的命名方式不同，post 可以是 article 什么的。)

###完成了？

嗯，很简单的。基本完成了。
有些什么你需要关注的呢？

####还有其他功能的

DisQus 还有其他功能的。例如你可以手动配置你的评论；例如你可以将评论计数加到你的
博客里面去。就如同上面一样，也是添加一段 Js 。

####不满意你的评论主题

假如你对 DisQus 的显示效果不是很满意的话，好像还有切换主题功能的（我还没看到，等
研究下）。再没有的话，写 CSS 覆盖掉吧。DisQus 返回的 Js 数据生成的 DOM 结构是不
变的，你可以像禅意花园一样去设计你喜欢的评论。

###我还关注的

为什么要使用 DisQus 呢？因为它可以统一管理很多个网站的评论，还可以做一些统计。而
且对于那些痛恨的 spam ，DisQus 也可以拦截掉，个人感觉很方便，使用起来也是不错的。

安装好了 DisQus 之后，虽然功能上实现了，但我觉得 Js 请求数还是稍微多了一些。不下
10条请求，网络不好的话，要使评论模块渲染出来还是比较久的等待时间。

我还想有个功能，就是关闭评论的功能，还没研究有没有。哈哈。

Ok，今天到这，欢迎留言。

