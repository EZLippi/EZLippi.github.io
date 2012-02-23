---
layout: post
title: 使用Github Pages建独立博客
description: Github本身就是不错的代码社区，他也提供了一些其他的服务，比如Github Pages，使用它可以很方便的建立自己的独立博客，并且免费。
category: blog
---
# [{{ page.title }}][1]
2012-02-22 By [BeiYuu][]

[Github][]很好的将代码和社区联系在了一起，于是发生了很多有趣的事情，世界也因为他美好了一点点。Github作为现在最流行的代码仓库，已经得到很多大公司和项目的青睐，比如[jQuery][]、[Twitter][]等。为使项目更方便的被人理解，介绍页面少不了，甚至会需要完整的文档站，Github替你想到了这一点，他提供了[Github Pages][]的服务，不仅可以方便的为项目建立介绍站点，也可以用来建立个人博客。

Github Pages有以下几个优点：

<ul>
    <li>轻量级的博客系统，没有麻烦的配置</li>
    <li>使用标记语言，比如[Markdown][2]</li>
    <li>无需自己搭建服务器</li>
    <li>根据Github的限制，对应的每个站有300MB空间</li>
    <li>可以绑定自己的域名</li>
</ul>

当然他也有缺点：

* 使用[Jekyll][]模板系统，相当于静态页发布，适合博客，文档介绍等。
* 动态程序的部分相当局限，比如没有评论，不过还好我们有解决方案。
* 基于Git，很多东西需要动手，不像Wordpress有强大的后台

大致介绍到此，作为个人博客来说，简洁清爽的表达自己的工作、心得，就已达目标，所以Github Pages是我认为此需求最完美的解决方案了。

## 购买、绑定独立域名
虽说[Godaddy][]曾支持过SOPA，并且首页放着极其不专业的大胸美女，但是作为域名服务商他做的还不赖，选择它最重要的原因是他支持支付宝，没有信用卡有时真的很难过。

域名的购买不用多讲，注册、选域名、支付，有网购经验的都毫无压力，优惠码也遍地皆是。域名的配置需要提醒一下，因为伟大英明的GFW的存在，我们必须多做些事情。

流传Godaddy的域名解析服务器被墙掉，导致域名无法访问，后来这个事情在[BeiYuu][]也发生了，不得已需要把域名解析服务迁移到国内比较稳定的服务商处，这个迁移对于域名来说没有什么风险，最终的控制权还是在Godaddy那里，你随时都可以改回去。

我们选择[DNSPod][]的服务，他们的产品做得不错，易用、免费，收费版有更高端的功能，暂不需要。注册登录之后，按照DNSPod的说法，只需三步（我们插入一步）：

* 首先添加域名记录，可参考DNSPod的帮助文档：[https://www.dnspod.cn/Support](https://www.dnspod.cn/Support)
* 在DNSPod自己的域名下添加一条[A记录][3]，地址就是Github Pages的服务IP地址：207.97.227.245
* 在域名注册商处修改DNS服务:去Godaddy修改Nameservers为这两个地址：f1g1ns1.dnspod.net、f1g1ns2.dnspod.net。如果你不明白在哪里修改，可以参考这里：[https://www.dnspod.cn/support/index/fid/119](https://www.dnspod.cn/support/index/fid/119 "Godaddy注册的域名如何使用DNSPod")
* 等待域名解析生效

域名的配置部分完成，跪谢方校长。

## 配置和使用Github
Git是版本管理的未来，他的优点我不再赘述，相关资料很多。推荐这本[Git中文教程][4]。

要使用Git，需要安装它的客户端，推荐在Linux下使用Git，会比较方便。Windows版的下载地址在这里：[http://code.google.com/p/msysgit/downloads/list](http://code.google.com/p/msysgit/downloads/list "Windows版Git客户端")。其他系统的安装也可以参考官方的[安装教程][5]。

下载安装客户端之后，各个系统的配置就类似了，我们使用windows作为例子，Linux和Mac与此类似。

在Windows下，打开Git Bash，其他系统下面则打开终端（Terminal）：
![Git Bash](/images/githubpages/bootcamp_1_win_gitbash.jpg)

###1、检查SSH keys的设置
首先我们需要检查你电脑上现有的ssh key：
<pre class="prettyprint">
$ cd ~/.ssh
</pre>
如果显示“No such file or directory”，跳到第三步，否则继续。

###2、备份和移除原来的ssh key设置：
因为已经存在key文件，所以需要备份旧的数据并删除：
<pre class="prettyprint">
$ ls
config	id_rsa	id_rsa.pub	known_hosts
$ mkdir key_backup
$ cp id_rsa* key_backup
$ rm id_rsa*
</pre>

###3、生成新的SSH Key：
输入下面的代码，就可以生成新的key文件，我们只需要默认设置就好，所以当需要输入文件名的时候，回车就好。

    $ ssh-keygen -t rsa -C "邮件地址@youremail.com"
    Generating public/private rsa key pair.
    Enter file in which to save the key (/Users/your_user_directory/.ssh/id_rsa):<回车就好>

然后系统会要你输入加密串（[Passphrase][6]）：

    Enter passphrase (empty for no passphrase):<输入加密串>
    Enter same passphrase again:<再次输入加密串>

最后看到这样的界面，就成功设置ssh key了：
![ssh key success](/images/githubpages/ssh-key-set.png)

###4、添加SSH Key到GitHub：
在本机设置SSH Key之后，需要添加到GitHub上，以完成SSH链接的设置。

用文本编辑工具打开id_rsa.pub文件，如果看不到这个文件，你需要设置显示隐藏文件。准确的复制这个文件的内容，才能保证设置的成功。

在GitHub的主页上点击设置按钮：
![github account setting](/images/githubpages/github-account-setting.png)

选择SSH Keys项，把复制的内容粘贴进去，然后点击Add Key按钮即可：
![set ssh keys](/images/githubpages/bootcamp_1_ssh.jpg)

###5、测试一下
可以输入下面的命令，看看设置是否成功，`git@github.com`的部分不要修改：
<pre class="prettyprint">
$ ssh -T git@github.com
</pre>

如果是下面的反应：
<pre class="prettyprint">
The authenticity of host 'github.com (207.97.227.239)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
</pre>

不要紧张，输入`yes`就好，然后会看到：
<pre class="prettyprint">
Hi <em>username</em>! You've successfully authenticated, but GitHub does not provide shell access.
</pre>

###6、设置你的账号信息
现在你已经可以通过SSH链接到GitHub了，还有一些个人信息需要完善的。

Git会根据用户的名字和邮箱来记录提交。GitHub也是用这些信息来做权限的处理，输入下面的代码进行个人信息的设置，把名称和邮箱替换成你自己的，名字必须是你的真名，而不是GitHub的昵称。
<pre class="prettyprint">
$ git config --global user.name "你的名字"
$ git config --global user.email "your_email@youremail.com"
</pre>

####设置GitHub的token
有些工具没有通过SSH来链接GitHub。如果要使用这类工具，你需要找到然后设置你的API Token。

在GitHub上，你可以点击*Account Setting > Account Admin*：
![set ssh keys](/images/githubpages/bootcamp_1_token.jpg)

然后在你的命令行中，输入下面的命令，把token添加进去：
<pre class="prettyprint">
$ git config --global user.name "你的名字"
$ git config --global user.token 0123456789your123456789token
</pre>

如果你改了GitHub的密码，需要重新设置token。

###成功了
好了，你已经可以成功连接GitHub了。

## 使用GitHub Pages建立博客
与GitHub建立好链接之后，就可以方便的使用它提供的Pages服务，GitHub Pages分两种，一种是你的GitHub用户名建立的`username.github.com`这样的用户&组织页（站），另一种是依附项目的pages。

###User & Organization Pages
想建立个人博客是用的第一种，形如`beiyuu.github.com`这样的可访问的站，每个用户名下面只能建立一个，创建之后点击`Admin`进入项目管理，可以看到是这样的：
![user pages](/images/githubpages/user-pages.jpg)
而普通的项目是这样的，即使你也是用的`othername.github.com`：
![other pages](/images/githubpages/other-pages.jpg)

创建好`username.github.com`项目之后，提交一个`index.html`文件，然后`push`到GitHub的`master`分支（也就是普通意义上的主干）。第一次页面生效需要一些时间，大概10分钟左右。

生效之后，访问`username.github.com`就可以看到你上传的页面了，[beiyuu.github.com][7]就是一个例子。

关于第二种项目`pages`，简单提一下，他和用户pages使用的后台程序是同一套，只不过它的目的是项目的帮助文档等跟项目绑定的内容，所以需要在项目的`gh-pages`分支上去提交相应的文件，GitHub会自动帮你生成项目pages。具体的使用帮助可以参考[Github Pages][]的官方文档：

###绑定域名
我们在第一部分就提到了在DNS部分的设置，再来看在GitHub的配置，要想让`username.github.com`能通过你自己的域名来访问，需要在项目的根目录下新建一个名为`CNAME`的文件，文件内容形如：
<pre class="prettyprint">
beiyuu.com
</pre>
你也可以绑定在二级域名上：
<pre class="prettyprint">
blog.beiyuu.com
</pre>
需要提醒的一点是，如果你使用形如`beiyuu.com`这样的一级域名的话，需要在DNS处设置A记录到`207.97.227.245`，而不是在DNS处设置为CNAME的形式，否则可能会对其他服务（比如email）造成影响。

设置成功后，根据DNS的情况，最长可能需要一天才能生效，耐心等待吧。

##Jekyll模板系统

## 使用Disqus管理评论
## 代码高亮插件




[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[Github]:   http://github.com "Github"
[jQuery]:   https://github.com/jquery/jquery "jQuery@github"
[Twitter]:  https://github.com/twitter/bootstrap "Twitter@github"
[Github Pages]: http://pages.github.com/ "Github Pages"
[Godaddy]:  http://www.godaddy.com/ "Godaddy"
[Jekyll]:   https://github.com/mojombo/jekyll "Jekyll"
[DNSPod]:   https://www.dnspod.cn/ "DNSPod"
[1]:    {{ page.url}}  ({{ page.title }})
[2]: http://markdown.tw/    "Markdown语法"
[3]:    http://baike.baidu.com/view/65575.htm "A记录"
[4]: http://progit.org/book/zh/ "Pro Git中文版"
[5]: http://help.github.com/mac-set-up-git/ "Mac下Git安装"
[6]: http://help.github.com/ssh-key-passphrases/
[7]: http://beiyuu.github.com
