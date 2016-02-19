---
layout: post
title: 解决百度爬虫无法抓取github pages 
category: Unix/Linux
tag: [github]
---

由于Github Pages禁止了百度爬虫，导致自己的博客无法被百度索引到，使用七牛云和又拍云做镜像存储能解决问题，但是要求域名要备案，由于我的域名从Godaddy上购买的，国内备案手续太复杂，故放弃了CDN的办法，琢磨了一段时间找到了Gitcafe的解决办法。

##解决方案

既然不想放弃Github，唯一的办法就是不让百度爬虫直接抓取GIthub的内容，而是抓取自己网站的一个镜像，将网站的内容镜像到[gitcafe](www.gitcafe.com),步骤如下：

* 注册 gitcafe 帐号
* 创建一个跟用户名一样的项目,比如我的[https://gitcafe.com/ezlippi/ezlipp](https://gitcafe.com/ezlippi/ezlippi)
* 把 github 的项目推到 gitcafe 上面去，步骤如下：

{% highlight bash shell %}
git remote add gitcafe https://gitcafe.com/ezlippi/ezlippi.git
git checkout -b gitcafe-pages
切换到一个新分支 'gitcafe-pages'
git push gitcafe master:gitcafe-pages
Username for 'https://gitcafe.com':ezlippi 
Password for 'https://ezlippi@gitcafe.com'
Counting objects: 17, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (10/10), done.
Writing objects: 100% (10/10), 1.06 KiB | 0 bytes/s, done.
Total 10 (delta 8), reused 0 (delta 0)
To https://gitcafe.com/ezlippi/ezlippi.git
   f0d0296..51611d7  master -> gitcafe-pages
{% endhighlight %}

* gitcafe绑定自己的域名

1. 点击项目的右上角的 项目配置
2. 在项目的 基础设置 中配置项目主页
3. 在 page服务 中添加自己的域名，比如我这里是[coolshell.info](coolshell.info)和[www.coolshell.info](www.coolshell.info).

* DNS的配置中增加一项 CNAME.
 
我使用 dnspod 这个提供商来管理DNS.CNAME一般可以按解析路线或者网络类型来单独配置,网络类型选择国内或者联通，设置之后等待一段时间百度的抓取就 恢复正常了，如下图所示：

![](/images/dnspod.png)


