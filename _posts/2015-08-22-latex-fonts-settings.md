---
layout: post
title: Latex中英文环境设置
category: Latex
tag: Latex
---

Latex默认是不支持中文的,后来有人开发了XeLatex来支持非英文字符,xetex是一种使用Unicode的TeX排版引擎,并默认其输入文件为UTF-8编码，也即,英文字符与非英文字符不再有区别，原生支持系统字体，这意味着我们无需再额外编译字体, 故可以在不进行额外配置的情况下直接使用操作系统中安装的字体。

安装完TexLive后,编写下面的tex文件：

{% highlight TeX %}
\documentclass[12pt,a4paper]{article}
\usepackage{xltxtra,fontspec,xunicode}

\setmainfont{WenQuanYi Zen Hei} % 设置文档默认字体
\date{} % 不显示文档生成日期
\title{\XeTeX{} 中英文环境测试}

\begin{document}
\maketitle
\XeTeX{} is a \TeX{} typesetting engine using Unicode and supporting modern font technologies.\\
\XeTeX{} 是一个使用Unicode的\TeX{}排版系统，并支持一些现代字体技术.\\
\end{document}
{% endhighlight %}

使用下面命令编译:`XeLatex test.tex`

输出结果如下：

![](/images/latex1.png)

上面的英文也使用了中文字体, 看上去不是很美观. 于是, xetex 和 CJK 商量了一下, 就有了xeCJK 宏包, 可以分别指定中英文字体, 于是可以很好的排版中英混合的文章了．

当然首先是要使用xeCJK包,添加上`\usepackage[slantfont,boldfont]{xeCJK}`
分别设置中英文字体, 英文字体可以不用设置, xetex会调用默认的字体:`\setCJKmainfont{SimKai}   % 设置缺省中文字体为楷体`
下面是测试文件：

{% highlight TeX %}
	\documentclass[12pt,a4paper]{article}
\usepackage{xltxtra,fontspec,xunicode}
\usepackage[slantfont,boldfont]{xeCJK}
\setCJKmainfont{WenQuanYi Zen Hei}   % 设置缺省中文字体
%\setCJKmonofont{Hei}   % 设置等宽字体

%\setmainfont{Optima}   %% 不指定，使用Tex的默认英文衬线字体
%\setmonofont{Monaco}   % 英文等宽字体
%\setsansfont{Trebuchet MS} % 英文无衬线字体
\date{} % 不显示文档生成日期
\title{\XeTeX{} 中英文环境测试}

\begin{document}
\maketitle
\XeTeX{} is a \TeX{} typesetting engine using Unicode and supporting modern font technologies.\\

\XeTeX{} 是一个使用Unicode的\TeX{}排版系统，并支持一些现代字体技术.\\
\end{document}

 {% endhighlight %}

输出结果如下：
![](/images/latex2.png)

这样效果就好很多了．

