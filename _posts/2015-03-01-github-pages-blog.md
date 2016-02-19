---
layout:     post
title:      利用github-pages建立个人博客 
keywords:	blog
description: Github很好的将代码和社区联系在了一起，于是发生了很多有趣的事情，世界也因为他美好了一点点。Github作为现在最流行的代码仓库，已经得到很多大公司和项目的青睐，比如jQuery、Twitter等。为使项目更方便的被人理解，介绍页面少不了，甚至会需要完整的文档站，Github替你想到了这一点，他提供了Github Pages的服务，不仅可以方便的为项目建立介绍站点，也可以用来建立个人博客。
categories : [other, programming,]
tags:		[blog]
---

*  目录
{:toc}

##前言

Github很好的将代码和社区联系在了一起，于是发生了很多有趣的事情，世界也因为他美好了一点点。Github作为现在最流行的代码仓库，已经得到很多大公司和项目的青睐，比如jQuery、Twitter等。为使项目更方便的被人理解，介绍页面少不了，甚至会需要完整的文档站，Github替你想到了这一点，他提供了Github Pages的服务，不仅可以方便的为项目建立介绍站点，也可以用来建立个人博客。

Github Pages有以下几个优点：

 - 轻量级的博客系统，没有麻烦的配置
 - 使用标记语言，比如Markdown 无需自己搭建服务器
 - 根据Github的限制，对应的每个站有300MB空间
 - 可以绑定自己的域名

当然他也有缺点：

 - 使用Jekyll模板系统，相当于静态页发布，适合博客，文档介绍等。
 - 动态程序的部分相当局限，比如没有评论，不过还好我们有解决方案。
 - 基于Git，很多东西需要动手，不像Wordpress有强大的后台

大致介绍到此，作为个人博客来说，简洁清爽的表达自己的工作、心得，就已达目标，所以Github Pages是我认为此需求最完美的解决方案了。

##购买、绑定独立域名 

虽说Godaddy曾支持过SOPA，并且首页放着极其不专业的大胸美女，但是作为域名服务商他做的还不赖，选择它最重要的原因是他支持支付宝，没有信用卡有时真的很难过。

域名的购买不用多讲，注册、选域名、支付，有网购经验的都毫无压力，优惠码也遍地皆是。域名的配置需要提醒一下，因为伟大英明的GFW的存在，我们必须多做些事情。

流传Godaddy的域名解析服务器被墙掉，导致域名无法访问，后来这个事情在BeiYuu也发生了，不得已需要把域名解析服务迁移到国内比较稳定的服务商处，这个迁移对于域名来说没有什么风险，最终的控制权还是在Godaddy那里，你随时都可以改回去。

我们选择DNSPod的服务，他们的产品做得不错，易用、免费，收费版有更高端的功能，暂不需要。注册登录之后，按照DNSPod的说法，只需三步（我们插入一步）：

首先添加域名记录，可参考DNSPod的帮助文档：[https://www.dnspod.cn/Support](https://www.dnspod.cn/Support)
在DNSPod自己的域名下添加一条A记录，地址就是Github Pages的服务IP地址：`192.30.252.153`
在域名注册商处修改DNS服务:去Godaddy修改Nameservers为这两个地址： `f1g1ns1.dnspod.net、f1g1ns2.dnspod.net`。

##配置和使用Github 

git是版本管理的未来，他的优点我不再赘述，相关资料很多。推荐这本[Git中文教程](http://git-scm.com/book/zh)。

要使用Git，需要安装它的客户端，推荐在Linux下使用Git，会比较方便。下载地址在这里：[http://code.google.com/p/msysgit/downloads/lis
](http://code.google.com/p/msysgit/downloads/list)。其他系统的安装也可以参考官方的安装教程。

安装完成后，还需要最后一步设置，在命令行输入：

	$ git config --global user.name "Your Name"
	$ git config --global user.email "email@example.com"

###检查SSH keys的设置

首先我们需要检查你电脑上现有的ssh key：
{% highlight java%}
$ cd ~/.ssh
{% endhighlight %}

如果显示“No such file or directory”，跳到第三步，否则继续。

###备份和移除原来的ssh key设置

因为已经存在key文件，所以需要备份旧的数据并删除：

{% highlight Bash shell scripts %}
ls
config  id_rsa  id_rsa.pub  known_hosts
mkdir key_backup
cp id_rsa* key_backup
rm id_rsa*
{% endhighlight %} 

###生成新的SSH Key 

输入下面的代码，就可以生成新的key文件，我们只需要默认设置就好，所以当需要输入文件名的时候，回车就好。

{% highlight Bash shell scripts%}
$ ssh-keygen -t rsa -C "邮件地址@youremail.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/	your_user_directory/.ssh/id_rsa):<回车就好>
{% endhighlight %}

然后系统会要你输入加密串（Passphrase）：

{% highlight Bash shell scripts%}
Enter passphrase (empty for no passphrase):<输入加密串>
Enter same passphrase again:<再次输入加密串>
{% endhighlight %}

最后看到ssh key success，就成功设置ssh key了. 

###添加SSH Key到GitHub 

在本机设置SSH Key之后，需要添加到GitHub上，以完成SSH链接的设置。

用文本编辑工具打开id_rsa.pub文件，如果看不到这个文件，你需要设置显示隐藏文件。准确的复制这个文件的内容，才能保证设置的成功。

在GitHub的主页上点击设置按钮： github account setting

选择SSH Keys项，把复制的内容粘贴进去，然后点击Add Key按钮即可： 
![set ssh keys](/images/images/githubpages/bootcamp_1_ssh.jpg)

PS：如果需要配置多个GitHub账号，可以参看这个[多个github帐号的SSH key切换](http://ju.outofmemory.cn/entry/16775)，不过需要提醒一下的是，如果你只是通过这篇文章中所述配置了Host，那么你多个账号下面的提交用户会是一个人，所以需要通过命令`git config --global --unset user.email`删除用户账户设置，在每一个repo下面使用`git config --local user.email '你的github邮箱@mail.com' `命令单独设置用户账户信息

###测试一下 

可以输入下面的命令，看看设置是否成功，git@github.com的部分不要修改：

    {% highlight Bash shell scripts%}

    $ ssh -T git@github.com

    {% endhighlight %}

如果是下面的反应：

    The authenticity of host 'github.com (207.97.227.239)' can't be established.
    RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
    Are you sure you want to continue connecting (yes/no)?


不要紧张，输入yes就好，然后会看到：

    Hi <em>username</em>! You've successfully authenticated, but GitHub does not provide shell access.

###设置你的账号信息 

现在你已经可以通过SSH链接到GitHub了，还有一些个人信息需要完善的。

Git会根据用户的名字和邮箱来记录提交。GitHub也是用这些信息来做权限的处理，输入下面的代码进行个人信息的设置，把名称和邮箱替换成你自己的，名字必须是你的真名，而不是GitHub的昵称。

{% highlight Bash shell scripts %}
$ git config --global user.name "你的名字"
$ git config --global user.email "your_email@youremail.com"
{% endhighlight %}

好了，你已经可以成功连接GitHub了。



##快速开始

###帐号注册

在创建博客之前，当然必须有GitHub的帐号，该帐号将用来创建项目，默认的域名`username.github.com/projectName`中的username也要用到这个帐号。

注意：下面涉及到的一些命令凡是更用户名和项目名有关的一律会用这里的username和projectName代替，注意替换
访问：[http://www.github.com/ ](http://www.github.com/ )sign up for free的意思就是“免费注册登录”，注册你的username和邮箱，邮箱十分重要，GitHub上很多通知都是通过邮箱的。比如你的主页上传并构建成功会通过邮箱通知，更重要的是，如果构建失败的话也会在邮件中说明原因。

 

###创建项目仓库 

在创建博客之前，还需要用已有的帐号创建一个项目，上面那个链接的projectName将是这里即将创建的项目名称。在Git中，项目被称为仓库(Repository)，仓库顾名思义，当然可以包含代码或者非代码。将来我们的网页或者模板实际上都是保存在这个仓库中的。

登录后，访问[https://github.com/new](https://github.com/new)，创建仓库如下图：
![image1](/images/images/githubpages/build-github-blog-page-02-img0.png)


创建了仓库后，我们就需要管理它，无论是管理本地仓库还是远程仓库都需要Git客户端。Git客户端实际上十分强大，它本身就可以offline的创建本地仓库，而本地仓库和远程仓库之间的同步也是通过Git客户端完成的。

这里省略了windows下安装和使用Git客户端的基本技巧，您应该已经掌握此技能了。虽然，您仍然可以按照本教程的指引完成一个简单的网站，但是后期的维护工作无论如何都不能少了这项技能。

下面的步骤假设您已经安装好了Git客户端，安装和使用技巧请参见：Git学习资源

 

###本地编辑及上传 

在磁盘上创建一个目录，该目录与上面的项目名同名，在该目录下启用Git Bash命令行，并输入如下命令

	

    {% highlight Bash shell scripts%}

    $git init

    {% endhighlight %}

该命令实际上是在该目录下初始化一个本地的仓库，会在目录下新建一个.git的隐藏文件夹，可以看成是一个仓库数据库。

创建一个没有父节点的分支gh-pages，并自动切换到这个分支上。

    	
    {% highlight Bash shell scripts%}

    $git checkout --orphan gh-pages

    {% endhighlight %}

在Git中，分支(branch)的概念非常重要，Git之所以强大，很大程度上就是因为它强大的分支体系。这里的分支名字必须是gh-pages，因为github规定，只有该分支中的页面，才会生成网页文件。

在该目录下手动创建如下文件和文件夹，最终形成这样的结构：

![](/images/images/githubpages/build-github-blog-page-02-img1.png)

- _includes：默认的在模板中可以引用的文件的位置，后面会提到
- _layouts：默认的公共页面的位置，后面会提到
- _posts：博客文章默认的存放位置
- .gitignore：git将忽略这个文件中列出的匹配的文件或文件夹，不将这些纳入源码管理
- _config.yml：关于jekyll模板引擎的配置文件
- index.html：默认的主页

在_layouts目录下创建一个default.html，在其中输入如下内容，注意：文件本身要以UTF-8 without BOM的格式保存，以防止各种编码问题，建议使用notepad++或者VIM编辑

default.html
    	
    <!DOCTYPE html>
    <html>
    <head>
    　<meta http-equiv="content-type" content="text/html; charset=utf-8" />
    　<title>一步步在GitHub上创建博客主页(2)</title>
    </head>
    <body>
    　
    </body>
    </html>

编辑index.html

    ---
    layout: default
    title: test title
    ---
    <p>Hello world!</p>

再次打开Git Bash，先后输入如下命令：

{% highlight Bash shell scripts %}
$ git add .
$ git commit -m "first post"
$ git remote add origin https://github.com/username/projectName.git
$ git push origin gh-pages
{% endhighlight %}

据网友反应，如果是初次安装git的话，在commit的时候会提示需要配置username和email，请读者注意根据提示配置一下，至于username和email可以随便填

- 将当前的改动暂存在本地仓库
- 将暂存的改动提交到本地仓库，并写入本次提交的注释是”first post“
- 将远程仓库在本地添加一个引用：origin
- 向origin推送gh-pages分支，该命令将会将本地分支gh-pages推送到github的远程仓库，并在远程仓库创建一个同名的分支。该命令后会提示输入用户名和密码。

现在，你只需要稍等半分钟时间，访问`http://username.github.com/projectName`就可以看到生成的博客了

另外上面提到的，如果生成失败，Github会向你的邮箱发送一封邮件说明，请注意查收。

##域名扫盲

说实话，虽然明白什么是域名以及域名解析的原理，但是在实际的互联网环境中，域名的问题其实比理论上说的要复杂些。这里对一些概念稍作整理。

###A（Address）记录

是用来指定主机名（或域名）对应的IP地址记录。用户可以将该域名下的网站服务器指向到自己的web server上。同时也可以设置您域名的二级域名。

###CNAME

也被称为规范名字。这种记录允许您将多个名字映射到同一台计算机。 通常用于同时提供WWW和MAIL服务的计算机。例如，有一台计算机名为`“host.mydomain.com”`（A记录）。 它同时提供WWW和MAIL服务，为了便于用户访问服务。可以为该计算机设置两个别名（CNAME）：WWW和MAIL。 这两个别名的全称就是`“www.mydomain.com”`和`“mail.mydomain.com”`。实际上他们都指向`“host.mydomain.com”`。 同样的方法可以用于当您拥有多个域名需要指向同一服务器IP，此时您就可以将一个域名做A记录指向服务器IP然后将其他的域名做别名到之前做A记录的域名上，那么当您的服务器IP地址变更时您就可以不必麻烦的一个一个域名更改指向了 只需要更改做A记录的那个域名其他做别名的那些域名的指向也将自动更改到新的IP地址上了。

###TTL

TTL值全称是“生存时间（Time To Live)”，简单的说它表示DNS记录在DNS服务器上缓存时间。要理解TTL值，请先看下面的一个例子：
假设，有这样一个域名`myhost.cnMonkey.com`（其实，这就是一条DNS记录，通常表示在abc.com域中有一台名为myhost的主机）对应IP地 址为1.1.1.1，它的TTL为10分钟。这个域名或称这条记录存储在一台名为dns.cnMonkey.com的DNS服务器上。
现在有一个用户键入一下地址（又称URL）：`http://myhost.cnMonkey.com` 这时会发生什么呢？
该 访问者指定的DNS服务器（或是他的ISP,互联网服务商, 动态分配给他的)8.8.8.8就会试图为他解释myhost.cnMonkey.com，当然8.8.8.8这台DNS服务器由于没有包含 myhost.cnMonkey.com这条信息，因此无法立即解析，但是通过全球DNS的递归查询后，最终定位到dns.cnMonkey.com这台DNS服务器， dns.cnMonkey.com这台DNS服务器将myhost.cnMonkey.com对应的IP地址1.1.1.1告诉8.8.8.8这台DNS服务器，然有再由 8.8.8.8告诉用户结果。8.8.8.8为了以后加快对myhost.cnMonkey.com这条记录的解析，就将刚才的1.1.1.1结果保留一段时间，这 就是TTL时间，在这段时间内如果用户又有对myhost.cnMonkey.com这条记录的解析请求，它就直接告诉用户1.1.1.1，当TTL到期则又会重复 上面的过程。

###域名分级

子域名是个相对的概念，是相对父域名来说的。域名有很多级，中间用点分开。例如中国国家顶级域名CN，所有以 CN 结尾的域名便都是它的子域。例如：www.zzy.cn 便是 zzy.cn 的子域，而 zzy.cn 是 cn 的子域。

“二级域名”：目前有很多用户认为“二级域名”是自己所注册域名的下一级域名，实际上这里所谓的“二级域名”并非真正的“二级”，而应该称为“次级”(相对次级)

例如您注册的域名是abc.cn来说：CN为顶级域，abc.cn为二级域，www.abc.cn、mail.abc.cn、help.zzy.cn为三级域。

还有一些特殊的二级域被用来作顶级域使用，例如：com.cn、net.cn、org.cn、gov.cn（包括地区域名bj.cn、fj.cn等）。那么此时用户所注册的就应该是三级域了，例如114.com.cn。（备注：www.gov.cn实际上是以gov.cn为后缀的www域名，就是说如果您在域名Whois信息查询中输入gov.cn是查询不到注册信息的因为gov.cn是作为顶级域来使用的域名后缀，真正开放注册的是www.gov.cn）。然而当前有很多用户还是习惯地将可以允许用户注册的域名称为顶级域名，而所注册域名的下一级域名称为“二级域名”，其实从严格意义上来讲这是不对的，所以我们前面会说“子域名”、“二级域名”是相对的概念，准确的应该称为“次级域名”。

###域名购买

众所周知，域名是要购买的，国内用域名访问主机大概是要备案的，有些麻烦。所以现在很多人从国外的域名注册商那儿买域名，比如goddady。如果是新手想在国外买域名的话，最好准备一张VISA信用卡，并用paypal来支付（可以省手续费）。goddady现在也支持支付宝，支付起来也很方便。



###绑定域名到GitHub-Page

其实十分简单，假设我们购买了域名[coolshell.info](coolshell.info)，想用coolshell.info访问你的站点`http://username.github.com/projectname`，你可以参考这个链接：[Setting up a custom domain with Pages](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/)

在你的域名提供商那边，设置一条A记录：

colshell.info  204.232.175.78（注意：这个IP难保不会变，所以要及时关注上面这个链接中给出的IP，并及时更新A记录）。下面这个截图是goddady上的A记录配置：

![](/images/images/githubpages/build-github-blog-page-03-img0.png)

然后在你的gh-pages分支的根目录中创建一个CNAME文件，其中只能有一行，就是coolshell.info，用Git客户端上传更改，大约等十几分钟就能生效了。

可以先ping一下coolshell.info，如果返回的IP地址更配置的A记录一样的话，说明域名已经注册好了，就等GitHub生效了。不过别急，你还需要把_config.yml中的baseurl设置如下

    {% highlight Bash shell scripts%}
	baseurl : /
    {% endhighlight %}
或者是

    {% highlight Bash shell scripts%}
	baseurl :
    {% endhighlight %}
这取决于你的模板如何引用baseurl，总之指向根目录就好了。

刚开始的时候我比较困惑的是，为什么A记录都指向的是同一个IP，GitHub是如何知道应该返回哪个用户的页面的。其实很简单，秘密就是上面提到的CNAME文件，GitHub应该会缓存所有gh-pages分支中的CNAME文件，用户对域名的请求被定向到GitHub住服务器的IP地址后，再根据用户请求的域名，判断对应哪个gh-pages，而且它会自动带上项目名，所以baseurl需要改为根目录。

##jekyll的安装

前几篇介绍了GitHub-Page的基本原理和使用方法，还介绍了如何将购买的域名绑定博客主页。然而，当需要正儿八经的将一个博客构建起来，不仅要知道如何上传我们的文件，还要能够高效的更好的设计博客。因此，必须能够在上传之前在本地完成测试；另一方面，完全靠html来编辑博客，显然工作量太大，随着博客越来越复杂，简直不可能维护，因此，需要用jekyll这个模板引擎来帮忙。本篇先介绍如何搭建一个本地的测试环境。

 

###更新 

1. 根据网友的反应，需要注意的是Ruby的版本和RubyDevKit的版本要对应，不要装错；
2. 另外，目前新版的Ruby自带gem了，所以gem安装可以跳过；
3. 由于国内的网络（你们懂的），gem官方的源基本上是没法用了，参考文中的链接，使用淘宝的镜像比较靠谱；
4. jekyll有一个问题，可能需要修改下面这个文件，否则会出现GBK错误
`D:\Ruby193\lib\ruby\gems\1.9.1\gems\jekyll-1.2.1\lib\jekyll\convertible.rb`
将它改成
`self.content = File.read(File.join(base, name),:encoding => "utf-8")`
`D:\Ruby193\lib\ruby\gems\1.9.1\gems\jekyll-1.2.1\lib\jekyll\tags\include.rb`中的最后几行的地方改成
`File.read_with_options(file,:encoding => "utf-8")`
		
5. 最新的jekyll修改了命令行参数，需使用如下命令行 `jekyll serve --safe --watch`
6. jekyll 1.4.3在windows下本地生成的时候可能会出现`'fileutils.rb:247:in mkdir Invalid argument'`的错误
7. jekyll 1.4.3在--watch参数的情况下可能会出现`'cannot load such file -- wdm (LoadError)'`的错误，用gem安装wdm就好了： 	gem install wdm

###Ruby安装 

jekyll本身基于Ruby开发，因此，想要在本地构建一个测试环境需要具有Ruby的开发和运行环境。在windows下，可以使用Rubyinstaller安装

ruby安装说明：[http://www.ruby-lang.org/zh_cn/downloads/](http://www.ruby-lang.org/zh_cn/downloads/)

ruby安装下载(windows)：[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/
)
windows的安装还是一如既往的“无脑”，不多说了。

如果想要快速体验ruby开发，可以参考：[20分钟体验 Ruby](https://www.ruby-lang.org/zh_cn/documentation/quickstart/)
 

###RubyDevKit安装 

从这个页面下载DevKit：[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)

下载下来的是一个很有意思的sfx文件，如果你安装有7-zip吧，可以直接双击，它会自解压到你所选择的目录。

解压完成之后，用cmd进入到刚才解压的目录下，运行下面命令，该命令会生成config.yml。（这种安装方式让我想起了，linux下安装三步走`config->make->make install中的config`）

    {% highlight Bash shell scripts %}
    $ruby dk.rb init
    {% endhighlight %}

config.yml文件实际上是检测系统安装的ruby的位置并记录在这个文件中，以便稍后使用。但上面的命令只针对使用rubyinstall安装的ruby有效，如果是其他方式安装的话，需要手动修改config.yml。我生成的config.yml文件内容如下：（注意路径用的是linux的斜杠方向）

{% highlight Bash shell scripts %}
# This configuration file contains the absolute path locations of all
# installed Rubies to be enhanced to work with the DevKit. This config
# file is generated by the 'ruby dk.rb init' step and may be modified
# before running the 'ruby dk.rb install' step. To include any installed
# Rubies that were not automagically discovered, simply add a line below
# the triple hyphens with the absolute path to the Ruby root directory.
#
# Example:
#
# ---
# - C:/ruby19trunk
# - C:/ruby192dev
#
---
- C:/Ruby193
{% endhighlight %}

最后，执行如下命令，执行安装：

    {% highlight Bash shell scripts%}
    $ruby setup.rb
    {% endhighlight %}

如果没有setup.rb的话，执行：

    {% highlight Bash shell scripts%}
	$ruby dk.rb install
    {% endhighlight %}

 

###Rubygems

Rubygems是类似Radhat的RPM、centOS的Yum、Ubuntu的apt-get的应用程序打包部署解决方案。Rubygems本身基于Ruby开发，在Ruby命令行中执行。我们需要它主要是因为jekyll的执行需要依赖很多Ruby应用程序，如果一个个手动安装比较繁琐。jekyll作为一个Ruby的应用，也实现了Rubygems打包标准。只要通过简单的命令就可以自动下载其依赖。

gems下载地址：[http://rubyforge.org/frs/?group_id=126](http://rubyforge.org/frs/?group_id=126)

解压后，用cmd进入到解压后的目录，执行命令即可：

    {% highlight Bash shell scripts%}
    $ruby setup.rb
    {% endhighlight %}

就像yum仓库一样，仓库本身有很多，如果希望加快应用程序的下载速度，特别绕过“天朝”的网络管理制度，可以选择国内的仓库镜像，taobao有一个：[http://ruby.taobao.org/](http://ruby.taobao.org/)。配置方法这个链接里面很完全。

 

###安装jekyll

有了上面的基础，安装jekyll就十分轻松了，在此之前，建议国内用户换成淘宝服务器，速度更快：

    {% highlight Bash shell scripts%}
    $ sudo gem sources --remove http://rubygems.org/
    $ sudo gem sources -a http://ruby.taobao.org/
    {% endhighlight %}
执行下面gem命令即可全自动搞定：

    {% highlight Bash shell scripts%}
	$gem install jekyll
    {% endhighlight %}
jekyll依赖的组件如下：

- directory_watcher
- liquid
- open4
- maruku
- classifier

测试jekyll服务

安装好之后就可以测试我们的环境了。用cmd进入到上一节我们创建的目录，执行下面命令：

    {% highlight Bash shell scripts%}
    $jekyll --server --safe
    {% endhighlight %}


jekyll此时会在localhost的4000端口监听http请求，用浏览器访问[http://localhost:4000/index.html](http://localhost:4000/index.html)，之前的页面出现了！

**更新**
jekyll最新的动态和文档现在可以在[jekyllrb](http://jekyllrb.com/)上找到

##jekyll介绍

在前几篇中，多多少少对jekyll有所涉及，在这篇中将带读者进一步了解jekyll以及模板引擎liquid。

jekyll是一个基于ruby开发的，专用于构建静态网站的程序。它能够将一些动态的组件：模板、liquid代码等构建成静态的页面集合，Github-Page全面引入jekyll作为其构建引擎，这也是学习jekyll的主要动力。同时，除了jekyll引擎本身，它还提供一整套功能，比如web server。我们用jekyll --server启动本地调试就是此项功能。读者可能已经发现，在启动server后，之前我们的项目目录下会多出一个_site目录。jekyll默认将转化的静态页面保存在_site目录下，并以某种方式组织。使用jekyll构建博客是十分适合的，因为其内建的对象就是专门为blog而生的，在后面的逐步介绍中读者会体会到这一点。但是需要强调的是，jekyll并不是博客软件，跟workpress之类的完全两码事，它仅仅是个一次性的模板解析引擎，它不能像动态服务端脚本那样处理请求。

更多关于jekyll请看[这里](https://github.com/jekyll/jekyll/wiki/Liquid-Extensions)

###jekyll是如何工作的

在jekyll解析你的网站结构前，需要确保网站目录像下面那样：

    	
    |-- _config.yml
    |-- _includes
    |-- _layouts
    |   |-- default.html
    |   |-- post.html
    |-- _posts
    |   |-- 20011-10-25-open-source-is-good.html
    |   |-- 20011-04-26-hello-world.html
    |-- _site
    |-- index.html
    |-- images
       |-- css
           |-- style.css
       |-- javascripts

-  _config.yml：保存配置，该配置将影响jekyll构造网站的各种行为。

- _includes：该目录下的文件可以用来作为公共的内容被其他文章引用，就跟C语言include头文件的机制完全一样，jekyll在解析时会对`{ % include file.ext %}`标记扩展成对应的在_includes文件夹中的文件

- _layouts：该目录下的文件作为主要的模板文件

- _posts：文章或网页应当放在这个目录中，但需要注意的是，文章的文件名必须是YYYY-MM-DD-title

- _site：上面提到过，这是jekyll默认的转化结果存放的目录

- images：这个目录没有强制的要求，主要目的是存放你的资源文件，图片、样式表、脚本等。

###一个例子 

完成一个例子总是最快的入门方式。

对于基于静态页面的网站，你显然不希望每篇文章都要写html、head等与文章本身无关的重复的东西，那么容易想到的是将这些东西作为模板提取出来，以便复用，_layouts文件夹中的文件可以作为这样的模板。现在我们在_layouts文件夹中创建一个模板文件，default.html：

default.html

    <html>
       <head>
           <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
           <title>My blog</title>
       </head>
       <body>
       {{content }}
       </body>
    <html>

default.html包含了每个html都需要的一些标记，以及一个个liquid标记。`{ { … }}`是liquid中用来表示“内容”的标记，其中的对象在解析时会被替换成文件到页面中

content：表示在这里的地方用子页面的内容替换。

现在我们来实现一个主页，在根目录下，创建一个index.html

index.html

    ---
    layout: default
    ---
    <h1>Hello jekyll</h1>
    <p>This is the index page</p>

除了普通的html标记外，开头这一段称为YAML格式，以一行“---”开头，一行“---”结尾，在虚线的中间以key-value的形式对一些全局变量进行赋值。

layout变量表示该文章应当使用_layouts/default这个文件作为父模板，并将index.html中的内容替换父模板中的`{ { content }}`标记。

在根目录中启动jekyll --server，并访问http://localhost:4000/index.html，你将得到下面页面

![](/images/images/githubpages/build-github-blog-page-05-img0.png)

该页面的Html源码如下，可以看到，index.html中的内容替换了default.html中的`{ { content }}`

    <html>
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>My blog</title>
      </head>
      <body>
      <h1>Hello jekyll</h1>
    <p>This is the index page</p>
      </body>
    <html>

现在请观察一下_site中的index.html，就是上面的Html代码！OK，现在你明白jekyll的工作方式了吧，它仅仅一次性的完成静态页面的转化，其余的事情全都交给普通的web server了！

需要注意的是，如果你失败了，请确保你的文件都是UTF-8 without BOM的格式。

在windows中，为了甄别UTF-8编码格式的文本文件，默认会在文件头插入两个字节的标识，被称为BOM。事实证明这是个“歪门邪道”，jekyll不识别这种特殊的标记，所以可以使用Notepad++或其他的工具将UTF-8编码文件开头的BOM去掉。
 

###第一篇文章 

现在我们来创建一篇博客文章，并在index.html页面添加文章的链接。

在 _posts目录下创建2014-06-21-first-post.html

2014-06-21-first-post.html

    ---
    layout: default
    title: my first post
    ---
    <h1>{{ page.title }}</h1>
    <p>This is my first post.Click the link below to go back to index:</p>
    <a href="{{ site.baseurl }}/index.html">Go back</a>

修改index.html

index.html

    ---
    layout: default
    ---
    <h1>Hello jekyll</h1>
    <p>This is the index page</p>
    <p>My post list:</p>
    

最终效果如下：

![](/images/images/githubpages/build-github-blog-page-05-img1.png)

这个是略微复杂的例子，这里涉及到两个主要的对象

1. site：全局站点对象。比如site.posts返回当前站点所有在_post目录下的文章，上面的例子结合for循环来罗列所有的文章
2. page：文章对象。比如page.url将返回page对象的url，上面的例子用该对象和属性返回了文章的链接
另外要补充的是site.baseurl，该值就是我们在_config.yml中配置的baseurl啦！

这些对象被称为“模板数据API”，更多API文档请参见[这里](http://jekyllbootstrap.com/api/template-data-api.html)



###liquid

liquid是jekyll底层用于解析的引擎，我们用到的`{ { .. }}`亦或是`{ % … %}`标记其实是靠liquid去解析的。本节将详细介绍liquid的使用。

liquid包含两种标记，理解他们的机理是十分重要的：

`{ { .. }}`：输入标记，其中的内容将被文本输出
`{ % … %}`：操作标记，通常包含控制流代码
例如：

    {% highlight Bash shell scripts%}
     {% if user.age > 18 %}
       Login here
     {% else %}
       Sorry, you are too young
     {% endif %}
     
     {% for item in array %}
     {{item }}
     {% endfor %}
    {% endhighlight %}

另外liquid还包含一种叫filter的机制。这是种对输出标记的扩展，通过它可以对输出标记中的内容进行更细致的处理，例如：

 

    {% highlight Bash shell scripts%}
     Hello {{'tobi' | upcase }}
     Hello tobi has {{'tobi' | size }} letters!
     Hello {{'now' | date: "%Y %h" }}
    {% endhighlight %}

返回字符串大写的结果：TOBI
返回字符串的长度：4
将当前时间格式化输出
liquid内置了一些filter，并且该机制可以被扩展，jekyll便扩展了liquid的filter。

更多关于liquid的使用方法，请参见[这里](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)

更多关于jekyll对liquid的扩展，请参见[这里](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)

##样式、分类、标签

在前一篇中我们实际使用jekyll做了一个略微“复杂”的模板。并用它生成了站点。但是这样的blog显然太粗糙了，别说不能吸引别人了，自己都看不下去啊。作为自己的“门户”，当然要把美化工作放在第一位啦。

网站的美观十分重要，这当然要依靠CSS咯。因为完全基于静态页面，所以没有现成的动态模板可以使用，我们只能手写CSS了，这里不介绍CSS了，因为这是设计师的范畴了，屌丝程序员搞不来了。我的blog的样式是从网上找过来改的。

从功能的角度blog除了文章以外，对文章的分类、标签、归档都是主流的功能。

分类和标签功能是jekyll的yaml-format的内置功能，在每篇文章上方可以设置：这里需要注意的是如果多个分类或者tag的话，用逗号分隔，并且要紧跟一个空格。分类可以任意添加，Jekyll在解析网站的时候会统计所有的分类，并放到site.categories中；换句话说，不能脱离文章而设置分类。

    ---
    layout: default
    title: Title
    description: 这里的description是自定义属性。
    categories: [web-build]
    tags: [github-page, jekyll, liquid]
    ---

下面是本站罗列分类的代码，供大家参考

    <div id="categories-3" class="left">
         <h3>Categories</h3>
         <ul>
             {% for cat in site.categories %}
             <li class="cat-item cat-item-6">
             	<a href="{{ site.baseurl }}/categories/{{ cat[0] }}.html">{{ cat[0] }}</a></li>
             {% endfor %}
         </ul>
     </div>

注意到分类的url链接，这里的categories目录以及其中的html不会自动生成，需要手动添加的，也就是说每增加一个分类，都需要在categories下添加一个该分类的html。当然你可以选择其他目录，甚至考虑其他解决方案，不过我还没想到更简单的方法。Tag的处理方式类似，这里就省略了。

推荐大家下载jekyll原作者推荐的简单例子来学习：

    $git clone https://github.com/plusjade/jekyll-bootstrap.git

下载的目录里面是一个完整的网站，可以使用我们本地的jekyll --server启动。另外，作者的网站：[http://jekyllbootstrap.com/
](http://jekyllbootstrap.com/)

###代码高亮

参考<a href="http://jekyllrb.com/docs/templates/">Jekyll官网文档</a>里<em>Code snippet highlighting</em>一节。玩颜色魔法的大魔术师是<a href="http://pygments.org/">Pygments</a>。

###安装Python Pygments

Ubtuntu下：sudo apt-get install python-pygments

###设置代码高亮的样式

通过下面的命令可以查看当前支持的样式
	from pygments.styles import STYLE_MAP
	STYLE_MAP.keys()
输出：
    	['monokai', 'manni', 'rrt', 'perldoc', 'borland', 'colorful', 		'default', 'murphy', 'vs', 'trac', 'tango', 'fruity', 'autumn', 	'bw', 'emacs', 'vim', 'pastie', 'friendly', 'native'] 

###生成指定样式的css文件

    pygmentize -S native -f html > pygments.css

将生成的css文件拷贝到主题的css目录下，如：

   	 %github pages project folder%\assets\themes\twitter\css\

引入default.html中引入css文件：

    // default目录如
    	%github pages project folder%\includes\themes\twitter\

    // 引入如下代码
    	<link href='/css/pygments.css' rel="stylesheet" media="all">

在文章中高亮代码:

	{% highlight java %}

    	public class HelloWorld { 
        public static void main(String args[]) { 
       	 System.out.println("Hello World!"); 
		} 
    	} 

	{% endhighlight %} 

###给文章添加目录

如你所见，我的这个博客里，稍长点的文章，都会生成目录树（Table of Content），并且配合有Bootstrap的[affix](http://www.zfanw.com/blog/twitter-bootstrap-affix-js.html)、[ScrollSpy](http://www.zfanw.com/blog/bootstrap-scrollspy.html) 效果。同样地，在Jekyll构建的静态博客上，我一样想生成目录树。
Jekyll的Plugins页面中有提到一个插件 [jekyll-toc-generator](https://github.com/dafi/jekyll-toc-generator)，但其实没有必要使用插件，因为 Jekyll 的 Markdown 渲染器 [kramdown](http://kramdown.gettalong.org/converter/html.html#toc) 已经具备这个功能。我们只需要启用它即可。

**启用 kramdown**

打开 _config.yml 文件，确保以下一行存在：
	markdown: kramdown

**生成 TOC**

接下来是在文章中标识 toc 的生成位置：
	* 目录
	{:toc}
	# 陈三
	## 陈三的博客

1. 请注意，`* 目录`这一行是必需的，它表示目录树列表，至于星号后面写什么请随意
2. 如果要把某标题从目录树中排除，则在该标题的下一行写上 `{:.no_toc}`
3. 目录深度可以通过 config.yml 文件中添加 `toc_levels` 选项来定制，默认为 `1..6`，表示标题一至标题六全部渲染
4. {:toc} 默认生成的目录列表会添加 id 值 `markdown-toc`，我们可以自定义 id 值，比如 {:toc #chen}，生成的目录列表添加的 id 将会是 chen。

###评论功能

静态的网站不可能自己存放评论，于是只能考虑外挂评论了，查了一下比较靠谱和广泛的就是DISQUS了;
Disqus是一个社会化的评论解决方案，请允许我使用这个烂透了的词，调用它的接口非常简单，在自己的页面加载他的一段JS代码即可，如果别人注册了Disqus，那么就可以方便的留言，交流，一处登录，处处方便，而且Disqus也提供了一些spam等策略，不用自己操心了，并且可以和一些现有的博客系统很好的转换对接。越来越多的网站开始使用Disqus的服务了，这是一个非常不错的趋势，Jekyll配合[Disqus][]实在是完美了。我别无所求了。

点击![](/images/images/githubpages/build-github-blog-page-06-img0.png)，在下面的页面中填写相关的信息，注意先在右侧注册登录信息，然后再在左侧增加一个站点：

![](/images/images/githubpages/build-github-blog-page-06-img1.png)

填写完成后点击“Continue”，在接下来的页面中选择Universal Code，然后根据提示完成接下来的操作，后面的操作就十分简单了：主要就是把产生的脚本文件复制到你的站点页面中即可。

DISQUS还有一个Dashboard，可以用来管理评论，这里就不再详述了。最后的效果就是本blog文章下方的评论咯，还是挺好看的，国内的还有个多说的评论引擎，支持国内的各大网站帐号。

 

###站内搜索

blog当然不能缺少站内搜索功能。主流的站内搜索都是主流的搜索引擎提供的。作为一个google控，当然必须选择google啊。当然你必须拥有一个google帐号。

google的站内搜索叫：custome search engine：[http://www.google.com/cse](http://www.google.com/cse)

创建一个自定义搜索与添加评论类似只要三步：



1. 填写自定义搜索的名字、描述、语言、站点信息，这些信息中唯一需要注意的是站点信息，建议使用mydomain.com作为搜索范围，因为这样的话，会自动转化成*.mydomain.com/*，能包含全站的内容
2. 选择样式和尝试搜索。尝试搜索有时不能成功，但是不要紧
3. 将生成脚本写到网页中

这时，可能搜索功能仍然无法使用，尤其是你的网站没有什么名气，也没有什么外链。因为google的爬虫不可能很快的抓到你的网站。但这里有个技巧可以让你的网站立刻被google收录（姑且不论排名），那就是google的Webmaster Tools工具，该工具是免费的，而且还集成了站点流量统计功能，十分强大。

进入地址：[https://www.google.com/webmasters/tools/home](https://www.google.com/webmasters/tools/home)

![](/images/images/githubpages/build-github-blog-page-06-img5.png)
它会要你认证你对网站的所有权，下载一个HTML文件，把它上传到你的网站上，
设置完成之后基本上立刻就生效了，无需等待一天。

认证成功后，进入[sitemaps网站](http://www.xml-sitemaps.com/),在下面填入你的网站后点击start，
![](/images/images/githubpages/sitemap.jpg)
接下来下载sitemap文件，把它上传到你的域名根目录，
打开Optimization->Sitemaps，点击Add/TEST SITEMAP，输入指向你的站点的sitemap地址，本博客的sitemap是：[http://coolshell.info/sitemap.xml](http://coolshell.info/sitemap.xml),过几分钟就看到下面的结果：
！[](/images/images/githubpages/sitemap2.jpg)



sitemap是网站所有链接的集合，最简单的sitemap可以是一个文本文件，其中只存放你网站的所有可用资源的链接，这有利于搜索引擎收录你的网站内容。复杂的sitemap还可以利用sitemap的专用格式来标注资源的形式，更多关于sitemap可以参考：http://www.sitemaps.org/
完成站点认证和sitemap测试后，我们回到自定义搜索的页面，进入到control panel->Indexing，在其中使用sitemap来迫使google索引你的网站。这样，你的网站就算被google收录了。

至于我们的站内搜索应该是可以用的了，试试本站点上方的搜索就知道啦～

 

###站点统计

这里介绍的站点统计是google的analytics，analytics的使用十分简单，同样的原理，利用注入脚本来实现流量统计的外挂，统计功能十分强大，谁用谁知道。这里就不再唠叨了。。

##GoDaddy & DNSPod

[GoDaddy][]是一家非常不错的域名注册商，良好的用户体验，飞快的生效速度，给力的优惠码，也支持支付宝，永远不用担心国内那些流氓厂商的流氓行为，注册了域名，就可以放心不会被别人抢走。在Godaddy注册域名是一件很简单的事情，按照提示走就完全没有问题，唯一需要动脑筋的可能是，你要想一个既有个人标识，又没有被别人注册的域名了。

Godaddy一切都很完美，直到遇到了GFW，原因你肯定懂。前段时间推上风传Godaddy的DNS服务器被墙，导致域名不能解析，看起来好像自己的站被墙了一样，这个确实是个闹心的事情，还好国内有DNS服务的替代产品，而且做得还非常的不错，也是免费的，功能强大，速度快，不用担心被和谐，所以隆重推荐[DNSPod][]给大家，可以试用一下，把DNS服务迁移到DNSPod来，解决后顾之忧，配置比较简单，不懂的可以等我后面的博客啦，哈。

##GitHub & Jekyll

[GitHub][]是一个非常优秀的产品，爆发式的增长，各大优质开源软件的蜂涌而至，只能说明人们太需要他了。**Social Coding**是他的Slogan，产品的设计确实解决了很多代码交流的难题，让世界更平，让交流更畅，关于Git的学习，大家可以移步这里[Pro Git中文版][7]，这也是一个本身就在Github维护的一个项目，高质量的翻译了Git入门书，讲解详细，是学习Git的好资料。

GitHub是一个伟大的产品，[GitHub Pages][]是他伟大的一部分，GitHub Pages基于[Jekyll][]博客引擎，当我深入的研究了他之后，我深深的想给Jekyll的作者一个拥抱，列举一下Jekyll的优点：

- 可以单独放在自己的服务器上，他也是GitHub Pages的基础，质量可靠
- 将博客最重要的功能抽取出来，去除了[WordPress][]的复杂、烦躁的东西，一切都是清晰可控的 
- 可以方便的使用[Markdown][8]等其他标记语言 
<li>清晰、简洁的文件组织，完美的永久链接方案，既漂亮、又可定制</li>
<li>博客静态化，速度快</li>
- [Jekyll][]是完美的 


写到这里，基本的点已经介绍完毕，现在介绍下怎么获取别人的博客模板来建立自己的博客。

**获取并修改别人的博客**

<p>Jekyll官方建立了一个<a href="https://github.com/mojombo/jekyll/wiki/sites">页面</a>，里面有许多的模板可供参考。接下来我们就要奉行“拿来主义”了，将别人的模板为我们所用。</p>

<p>我自己用了Yukang’s Page</a>，他采用了一个叫做<a href="http://themes.jekyllbootstrap.com/preview/twitter/">twitter</a>的Jekyll Bootstrap的模板。下面假设你已经安装了git，我们把他人的网站代码clone下来，为了举例方便，还是选取了Yukang’s Page：</p>

<pre><code>git clone https://github.com/chenyukang/chenyukang.github.com.git
</code></pre>

<p>然后删去别人的.git文件夹：</p>

<pre><code>rm -rf .git
</code></pre>

<p>接着，我们参考<a href="http://jekyllrb.com/docs/structure/">jekyll的文件目录</a>，可以把他人的博客删去，并且做一些小的调整。接下来，我们把改头换面的博客上传到自己的GitHub帐号中去。一般情况下，假设你的帐号名是USERNAME，你需要建一个名为USERNAME.github.io的帐号，分支为master。这样，在你将本地的网站push上去之后，不到10分钟，访问USERNAME.github.io，就可以看到你新鲜出炉的网站了：</p>

<pre><code>git init
git add -A
git commit -m "first commit"
git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
git push -u origin master
</code></pre>

<p>Git博大精深，我还没有熟练掌握。具体的命令可以参考下面一些参考资料：</p>

<ul>
  <li>
    <p>入门：<a href="http://rogerdudler.github.io/git-guide/index.zh.html">git - 简易指南</a></p>
  </li>
  <li>
    <p>进阶：<a href="http://think-like-a-git.net/epic.html">Think Like (a) Git</a></p>
  </li>
  <li>
    <p>参考图解：<a href="http://marklodato.github.io/visual-git-guide/index-en.html">A Visual Git Reference</a></p>
  </li>
</ul>

<p>如果你想要在push之前就在本地预览一下网站，可以使用
<code>jekyll serve --watch</code>
命令。默认设置下，可以在浏览器中访问localhost:4000预览。详细情况请<a href="http://jekyllrb.com/docs/usage/">点击这里</a>。</p>

<p>那么，我们如何撰写新的博客呢？下面，我们隆重推出Markdown。</p>

##Markdown语法

<p>根据<a href="http://zh.wikipedia.org/zh-cn/Markdown">维基百科上的介绍</a></p>

<blockquote>
  <p>Markdown 是一种轻量级标记语言，创始人为约翰·格鲁伯（John Gruber）和亚伦·斯沃茨（Aaron Swartz）。</p>
</blockquote>

<p>想到<a href="http://zh.wikipedia.org/wiki/%E4%BA%9A%E4%BC%A6%C2%B7%E6%96%AF%E6%B2%83%E8%8C%A8">Aaron Swartz</a>已经故去，不禁一阵伤感。</p>

<p>Markdown的介绍有许多，个人推荐：</p>

<ul>
  <li>
    <p>入门：<a href="http://jianshu.io/p/q81RER">献给写作者的 Markdown 新手指南</a></p>
  </li>
  <li>
    <p>另一份入门文档：<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">Markdown Cheatsheet</a></p>
  </li>
  <li>
    <p>进阶：<a href="http://wowubuntu.com/markdown/">Markdown 语法说明 (简体中文版) </a></p>
  </li>
  <li>
    <p>kramdown使用心得：<a href="http://mindspill.net/computing/web-development-notes/kramdown-notes/">Kramdown notes</a></p>
  </li>
</ul>

<p>备注：如何在Markdown中写注释呢？<a href="https://twitter.com/denialduan/status/180532937358454784">这里</a>提供了最原始的一种解决方法：</p>

<blockquote>
  <p>看来在Markdown文件里写注释的唯一方法就是用&lt;!– –&gt;了，好吧。</p>
</blockquote>

[GoDaddy]:  http://godaddy.com  "Godaddy"
[GitHub]: http://github.com "Github:social coding"
[Jekyll]:   https://github.com/mojombo/jekyll
[Disqus]: http://disqus.com "Disqus"
[DNSPod]: http://dnspod.cn "DNSPod"
[GitHub Pages]: http://pages.github.com "GitHub Pages"
[WordPress]:    http://wordpress.org    "WordPress"
[LippiOuYang]: coolshell.info  "coolshell"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:  http://stevelosh.com/blog/2011/09/writing-vim-plugins/ "Write Vim Plugins"
[3]: http://sivers.org/sharing   "The co-op business model: share whatever you've got"
[4]: http://artificialrecords.com
[5]: http://sivers.org/below-average    "probably below average"
[6]: http://mindhacks.cn/2011/11/04/how-to-interview-a-person-for-two-years/    "怎样花两年时间去面试一个人"
[7]: http://progit.org/book/zh/    "Pro Git"
[8]: http://markdown.tw/    "Markdown语法"
[9]: http://www.cnblogs.com/bangerlee/archive/2011/09/11/2173632.html   "Why I Blog翻译版"

