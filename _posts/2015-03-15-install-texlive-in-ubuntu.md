---
layout:     post
title:      在Ubuntu下安装和编译LaTex
keywords: LaTex, TexLive
categories : [other, programming]
description: LaTeX 是由美国计算机学家Lamport博士于1985年开发成功的,它是当今世界上最流行和使用最为广泛,以 TeX 为引擎的高质量格式化排版系统。
tags : [编程, 学习]
---

*  目录
{:toc}

<p><strong>LaTex简介?</strong>
<p>1、LaTeX 是由美国计算机学家Lamport博士于1985年开发成功的。</p>
<p>2、它是当今世界上最流行和使用最为广泛,
以 TeX 为引擎的高质量格式化排版系统。</p>
<p>3、它构筑在 TeX 的基础之上,并且加进了很多新功能,
使得使用者可以更为方便的利用 TeX 的强大功能。
即使使用者并不是很了解 TeX,也可以在很短的时间内制成高质量的文件。</p>
</p>
<p>LaTex有很多发行版，Linux下的发行版为TexLive，本文安装环境为 Ubuntu 14.04.1 64 位系统，软件版本为 TeXLive 2014，更详细的教程请看官方 <a href="http://tug.org/texlive/doc/texlive-zh-cn/texlive-zh-cn.pdf">TeXLive 指南</a>。</p>

<h2>安装前准备</h2>

<h4>下载 TeXLive 2014 镜像文件</h4>

<p>下载地址：<a href="http://www.ctan.org/tex-archive/systems/texlive/Images">TeXLive 2014</a></p>
<p>推荐厦门大学开源软件镜像，下载速度很可观:
         <a href="http://mirrors.xmu.edu.cn/CTAN/systems/texlive/Images/">TEXLive</a></p>
<h4>删除旧版</h4>

<pre><code>$ sudo apt-get purge tex-common
</code></pre>

<h4>安装 Perl::TK 模块</h4>

<p>install-tl 是一个 Perl 脚本，要在专家 GUI 模式下安装，需要加入 XFT 支持的 Perl::TK 模块，可用以下方法添加：</p>

<pre><code>$ sudo apt-get install perl-tk
</code></pre>

<h2>安装主程序</h2>

<h4>挂载 iso 镜像文件</h4>

<pre><code>$ sudo mount -o loop path_to.iso /mnt
$ cd /mnt
</code></pre>

<h3>启动安装程序</h3>

<p>在加入了 XFT 支持的 Perl::TK 模块后，可以用以下方法启动专家 GUI 模式进行安装：</p>

<pre><code>$ sudo ./install-tl -gui
</code></pre>

<p>在图形界面中将 <code>Create symlinks in system directories</code> 选项更改为 <code>Yes</code>，点击 <code>Install TeX Live</code> 开始安装。</p>

<h2>配置环境变量</h2>

<p>可根据安装结束时的文本提示进行相应的环境变量配置，我在安装时进行了如下配置。</p>

<p>在 ～/.bashrc 和 ～/.profile 文件结尾添加如下代码：</p>

<pre><code># 自己为texlive配置的环境变量
PATH=/usr/local/texlive/2014/bin/x86_64-linux:$PATH; export PATH
MANPATH=/usr/local/texlive/2014/texmf-dist/doc/man:$MANPATH; export MANPATH
INFOPATH=/usr/local/texlive/2014/texmf-dist/doc/info:$INFOPATH; export INFOPATH
</code></pre>

<p>为了配置全局的环境变量，可在 /etc/manpath.config 文件的 <em># set up PATH to MANPATH mapping.</em> 下添加:</p>

<pre><code>MANPATH_MAP /usr/local/texlive/2014/bin/x86_64-linux /usr/local/texlive/2014/texmf-dist/doc/man
</code></pre>

<p>之后注销即可。</p>

<p><strong>注：</strong>如果环境变量配置出错导致无法登录，可以参见最下面的Linux配置环境变量后无法登录的解决方案</a></p>

<h2>测试安装是否成功</h2>

<ol>
<li><p>首先确认你可以执行 tex 程序:</p>

<blockquote><p>  tex --version<br/>
    TeX 3.14159265 (TeX Live ...)<br/>
    Copyright ... D.E. Knuth.<br/>
    ...</p></blockquote></li>
<li><p>如果你安装了 xetex 包,可以按如下步骤测试它能否访问系统字体（会生成文件，可在无用目录下执行）:</p>

<blockquote><p>  xetex opentype-info.tex<br/>
    This is XeTeX, Version 3.14...<br/>
    ...<br/>
    Output written on opentype-info.pdf (1 page).<br/>
    Transcript written on opentype-info.log.</p></blockquote>

<p>如果你收到 “Invalid fontname ‘Latin Modern Roman/ICU’...” 这样的错误信息,就说明需要配置系统才能找到 TEX Live 自带的字体。</p></li>
<li><p>XeTEX 和 LuaTEX 的系统字体配置</p>

<p>XeTEX 和 LuaTEX 可以使用任何系统安装的字体,而不只是 TEX 目录树中的那些。它们使用类似但不完全一致的方式实现这一功能。</p>

<p>在 Windows 下 TEX Live 提供的字体会自动为 XeTEX 所用。但如果你在 Unix 兼容的系统中安装了 xetex 软件包,则需要把系统配置一番 XeTEX 才能找到随 TEX Live 安装的那些字体。</p>

<p>要在整个系统中使用 TEX Live 的字体 (假定你有足够的权限),请依照下面的步骤来做:</p>

<ol>
<li><p>将 texlive-fontconfig.conf 文件复制到 /etc/fonts/conf.d/09-texlive.conf。</p>

<pre><code>    $ sudo cp /usr/local/texlive/2014/texmf-var/fonts/conf/texlive-fontconfig.conf /etc/fonts/conf.d/09-texlive.conf
</code></pre></li>
<li><p>运行 fc-cache -fsv。</p></li>
</ol>


<p>如果你没有足够的权限执行上述操作,或者只需要把 TEX Live 字体提供给你自己,可以这么做:</p>

<ol>
<li>将 texlive-fontconfig.conf 文件复制到 ~/.fonts.conf,其中 ~ 是你的主目录。</li>
<li>运行 fc-cache -fv。</li>
</ol>


<p>此时执行第2步，问题已经解决。</p></li>
</ol>


<h2>中文字体安装与配置</h2>

<h4>中文字体安装</h4>

<p>先写一个简单的测试 tex 文件。起名为 test.tex</p>

<pre><code>\documentclass[UTF8]{ctexart}
\begin{document}
我爱中国！
\end{document}
</code></pre>

<p>然后执行如下命令编译</p>

<pre><code>$ xelatex test.tex
</code></pre>

<p>系统会报错，大致信息如下：</p>

    ! fontspec error: "font-not-found"

    ! The font "SimSun" cannot be found.
    ! See the fontspec documentation for further information.
 
    ! For immediate help type H 
    !...............................................

<p>下面就要解决这个问题，错误里说了，"font-not-found"!</p>

<p>首先创建字体文件夹</p>

<pre><code>$ sudo mkdir /usr/share/fonts/winfonts
</code></pre>

<p>然后把 Windows 下的六种中意字体复制到该文件夹，比如从Windows的C:/Windows/Fonts下拷贝最常使用的几种字体：
msyh.ttf（微软雅黑）  simfang.ttf（仿宋）  simhei.ttf（黑体）  simkai.ttf（楷体）  simsun.ttc（宋体）,并更改字体权限</p>

<pre><code>$ sudo chmod 644 /usr/share/fonts/winfonts/*
</code></pre>

<p>刷新字体库</p>

<pre><code>$ sudo mkfontscale
$ sudo mkfontdir
$ sudo fc-cache -fsv
</code></pre>

<h4>xeLaTeX 中文字体配置</h4>

<p>如果使用 xeLaTeX 的话，需要 xeCJK 宏包的支持，需要修改 /usr/local/texlive/2014/texmf-dist/tex/latex/ctex/fontset 下的 ctex-xecjk-winfonts.def 文件。</p>

<p>下面，打开新的终端，执行如下命令：</p>

<pre><code>$ fc-list :lang=zh-cn
</code></pre>

<p>输出大约如下</p>

    NSimSun,新宋体:style=Regular  
    KaiTi,楷             体:style=Regular,Normal,obyčejné,Standard,Κανονικά,Normaali,Normál,Normale,Standaard,Normalny,Обычный,Normálne,Navadno,Arrunta  
    SimSun,宋体:style=RegularUnibit:style=Regular  
WenQuanYi Zen Hei,文泉驛正黑,文泉驿正黑:style=Regular  
    ......

<p>下面需要做的就是将 ctex-xecjk-winfonts.def 中的字体名字改成上面四行的行首的内容，注意，要将原文件中的 [SIMKAI.TTF] 中括号同时删去。</p>

<p>重新编译以下，发现成功了。</p>

<p>另外，若想添加 Adobe 字体，设置方法与 Windows 字体大致相同，此处不再赘述。</p>

<h4>pdfLaTeX 中文字体配置</h4>

<p>在上边添加了 Windows 字体的基础之上可以为 pdfLaTeX 添加中文字体支持</p>

<p>在 /usr/local/texlive/2014/texmf.cnf 文件中设置 OSFONTDIR 变量，即添加如下信息：
    自己为pdflatex设置的OSFONTDIR变量指向中文字体文件
    OSFONTDIR=/usr/share/fonts/winfonts

	<h4>论文中正常显示中文</h4>

新建一个.tex文件，在文件里面添加下面两句就能正常显示中文了：
	\usepackage{xeCJK}
	\setCJKmainfont{STSong}
	
<h2>LaTeX 学习文档下载：</h2>
[http://download.csdn.net/detail/longerzone/4703133](http://download.csdn.net/detail/longerzone/4703133)

<h2>Linux 配置环境变量后无法登录的解决方案</h2>
<section>
<h2>Linux 的环境变量读取机制</h2>

<ul>
<li>在登陆时，操作系统定制用户环境时读取的第一个文件是 /etc/profile，此文件为系统的每个用户设置环境信息，当用户第一次登陆时，该文件被执行。</li>
<li>在登陆时操作系统读取的第二个文件是 /etc/environment，系统在读取用户自己的 profile 前，设置环境文件的环境变量。</li>
<li>在登陆时用到的第三个文件是 ～/.profile 文件，每个用户都可使用该文件输入专用于自己使用的 shell 信息，该文件仅仅执行一次。默认情况下，它设置一些环境变量，执行用户的 .bashrc 文件。/etc/bashrc 为每一个运行 bash shell 的用户执行此文件，当 bash shell 被打开时，该文件被读取。</li>
</ul>


<h2>无法登录的原因</h2>

<p>由上可知，系统启动时会先读取 /etc/profile，然后读取 /etc/environment，最后才是 ～/.profile 文件，而在 /etc/environment 中也设置有环境变量 PATH，如果你在 ~/.profile 中也设置了环境变量 PATH，那么就会覆盖原来的 /etc/environment 中设置的环境变量 PATH。</p>

<p>因此，～/.profile 文件中的环境变量设置一定不可大意，且在其设置的环境变量中要重新载入之前的环境变量，即添加 $PATH，且以冒号分割。</p>

<p>比如以我安装的 TeXLive 为例，正确的环境变量设置应该为:</p>

<pre><code>PATH=/usr/local/texlive/2014/bin/x86_64-linux:$PATH; export PATH
MANPATH=/usr/local/texlive/2014/texmf-dist/doc/man:$MANPATH; export MANPATH
INFOPATH=/usr/local/texlive/2014/texmf-dist/doc/info:$INFOPATH; export INFOPATH
</code></pre>

<h2>解决方法一</h2>

<p>在登录界面可以通过 <code>Ctrl + Alt + F1～F6</code> 的方式进入命令行，再通过 <code>Ctrl + Alt + F7</code> 的方式进入图形界面。</p>

<p>因此我们可以进入图形界面登录 root 账户，将之前修改的环境变量删除或者更正即可。</p>

<p>注意事项：我们在登录不同的账户时，<strong>～</strong> 所对应的目录是不同的，例如 John 用户对应 /home/John/，而 root 用户对应 /root/，因此在以 root 用户登陆时，一定要注意环境变量文件的路径。</p>

<h2>解决方法二</h2>

<p>若命令行下打开文件乱码，可考虑新建用户并登录，然后以 root 权限修改之前用户的配置文件，关于如何新建用户此处不再赘述。</p>
 
  
