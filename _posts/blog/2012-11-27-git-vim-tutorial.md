---
layout: post
title: Git时代的VIM不完全使用教程
description: 在Git流行的时代，VIM的生态环境也有了长足的进步，令人感动。
category: blog
---

最近整理了VIM的配置，换上插件管理的神器-----[Vundle][2]，由他引发的VIM生态环境的改善，堪称完美。遂打算写一份简单的教程，分享Git时代VIM新世界的美丽动人之处。**对VIM有基础的同学，可直接跳至插件管理部分。**

##VIM的模式
第一次使用VIM，会觉得无所适从，他并不像记事本，你敲什么键就显示什么，理解VIM的需要明白他的两种模式：
- 命令模式 (Command Mode)
- 编辑模式 (Insert Mode)

命令模式下，可以做移动、编辑操作；编辑模式则用来输入。键入`i`,`o`,`s`,`a`等即可进入编辑模式，后面解释原因。

模式的设计是VIM和其他编辑器最不同的地方，优势和劣势也全基于此而生。

##基本操作
以下介绍的键盘操作，都是大小写敏感的，并且要在**命令模式**下完成，需注意：

###以字为单位的移动
- `h` 向左移动一个字
- `j` 向下移动一行
- `k` 向上
- `l` 向右

这四个键在右手最容易碰到几个位置，最为常用。

###以词为单位的移动
- `w` 下一個word w(ord)
- `W` 下一個word(跳过标点)
- `b` 前一個word b(ackward)
- `B` 前一个word(跳过标点)
- `e` 跳到当前word的尾端 e(nd)

###行移动
- `0` 跳到当前行的开头
- `^` 跳到当前行第一个非空字符
- `$` 跳到行尾

助记：0(第0个字符),`^`和`$`含义同正则表达式

###段落移动
- `{` 上一段(以空白行分隔)
- `}` 下一段(以空白行分隔)
- `%` 跳到当前对应的括号上(适用各种配对符号)

###跳跃移动
- `/xxxx` 搜索xxxx，然后可以用`n`下一个，`N`上一个移动
- `#` 向前搜索光标当前所在的字
- `*` 向后搜索光标当前所在的字
- `fx` 在当前行移动到光标之后第一个字符x的位置 f(ind)x
- `gd` 跳到光标所在位置词(word)的定义位置 g(o)d(efine)
- `gg` 到文档顶部
- `G` 到文档底部
- `:x` 跳到第x行(x是行号)
- `ctrl+d` 向下翻页 d(down)
- `ctrl+u` 向上翻页 u(p)

###基本编辑
####修改
- `i` 在光标当前位置向前插入 i(nsert)
- `I` 在本行第一个字符前插入
- `a` 在光标当前位置向后插入 a(fter)
- `A` 在本行末尾插入
- `o` 向下插入一行
- `O` 向上插入一行
- `:w` 保存
- `:q` 退出
- `:wq` 保存并退出

####删除
- `x` 删除当前字符
- `dd` 删除当前行 d(elete)
- `dw` 删除当前光标下的词 d(elete)w(ord)

####复制粘贴
- `yy` 复制当前行 y(ank)
- `yw` 复制当前光标下的词 y(ank)w(ord)
- `p` 粘贴 p(aste)
- `P` 粘贴在当前位置之前

##进阶操作

限于篇幅，在这里我仅介绍下我非常常用的几个操作。

###重复操作
因为VIM所有的操作都是原子化的，所以把这些操作程序化就非常简单了：

- `5w` 相当于按五次`w`键；
- `6j` 下移6行，相当于按六次j；
- `3J` 大写J,本来是将下一行与当前行合并，加上数量，就是重复操作3次；
- `6dw`和`d6w` 结果是一样，就是删除6个word；
- 剩下的无数情况，自己类推吧。

###高效编辑

- `di"` 光标在""之间，则删除""之间的内容
- `yi(` 光标在()之间，则复制()之间的内容
- `vi[` 光标在[]之间，则选中[]之间的内容
- 以上三种可以自由组合搭配，效率奇高，i(nner)
- `dtx` 删除字符直到遇见光标之后的第一个`x`字符
- `ytx` 复制字符直到遇见光标之后的第一个`x`字符

###标记和宏(macro)

- `ma` 将当前位置标记为a，26个字母均可做标记，`mb`、`mc`等等；
- `'a` 跳转到a标记的位置；
- 这是一组很好的文档内标记方法，在文档中跳跃编辑时很有用；
- `qa` 将之后的所有键盘操作录制下来，直到再次在命令模式按下`q`，并存储在`a`中；
- `@a` 执行刚刚记录在`a`里面的键盘操作；
- `@@` 执行上一次的macro操作；
- 宏操作是VIM最为神奇的操作之一，需要慢慢体会其强大之处；

VIM的基本操作，可以挖掘的东西非常多，不仅仅需要记忆，更需要自己去探索总结，熟练之后，效率会大幅度提升。后面会给出一些参考链接。

##插件管理
###Vundle
终于到这篇Blog我最想讨论的部分了。VIM的强大不仅仅体现在操作的高效率，更有强大而充沛的插件做支援，插件丰富了之后，就面临查找和管理的问题。

在遇见[Vundle][vundle]之前，我用[Pathogen][pathogen]管理插件。Pathogen还算方便，只需要把相应插件，放在`bundle`目录下即可，不需要再像以前那样逐个放置单独的文件到相应目录，大大节省了劳动力，管理起来也一目了然，觉得还不错，至少比vimball那种需要执行命令安装的方式好一些。

我真希望我早些遇见Vundle。Vundle受到Pathogen和Vimball的启发，于是有了现在的模样。Vundle的逻辑是这样的：

- 在[Vim Script][3]选好你想要的插件；
- 在VIM的配置文件中写一句 `Bundle plugin_name`；
- 执行一下Vundle的初始化命令，插件就装好了；
- 升级和卸载也是同样的简单；

完美的世界！

###Vundle的配置
[Vundle][vundle]的安装很简单：
    
    git clone http://github.com/gmarik/vundle.git ~/.vim/bundle/vundle

然后写配置文件`.vimrc`：

    set nocompatible    " be iMproved
    filetype off        " required!

    set rtp+=~/.vim/bundle/vundle/
    call vundle#rc()

    " let Vundle manage Vundle
    " required!
    Bundle 'gmarik/vundle'

    " vim-scripts repos
    Bundle 'vim-plugin-foo'
    Bundle 'vim-plugin-bar'

    filetype plugin indent on    " required!

其中`Bundle`后面的内容，就是插件的名字，插件维护在[Vim-Script.org][3]。

然后，打开VIM之后，可以输入以下命令：

    "安装插件:
    :BundleInstall

    "更新插件:
    :BundleInstall!

    "卸载不在列表中的插件:
    :BundleClean

现在大部分的插件都已经从[Vim.org][4]迁移到了[Vim-Script.org][3]，而且很多作者也认领了自己的插件，直接在这个Github的项目下更新，一个比Vim.org更科学更有效的生态环境，就这样完美的形成了。

在此非常严重的感谢vim-scripts.org的创建者[Scott Bronson][5]，和[Vundle][vundle]的作者[gmarik][6]。他们的创新和分享精神，让这个世界又美好了一些。

也感谢业界良心[Github][7]。Vim-Scripts.org整站就是用[Github Pages][8]建立维护的，对于个人来说，这是很好的选择，有兴趣的同学可以参看我之前的博客：[使用Github Pages建独立博客][9]。

##插件介绍
有了Vundle，再装插件就是件享受的事情了。我常用的插件有：

    #相较于Command-T等查找文件的插件，ctrlp.vim最大的好处在于没有依赖，干净利落
    Bundle 'ctrlp.vim'

    #在输入()，""等需要配对的符号时，自动帮你补全剩余半个
    Bundle 'AutoClose'

    #神级插件，ZenCoding可以让你以一种神奇而无比爽快的感觉写HTML、CSS
    Bundle 'ZenCoding.vim'

    #在()、""、甚至HTML标签之间快速跳转；
    Bundle 'matchit.zip'

    #显示行末的空格；
    Bundle 'ShowTrailingWhitespace'

    #JS代码格式化插件；
    Bundle '_jsbeautify'

    #用全新的方式在文档中高效的移动光标，革命性的突破
    Bundle 'EasyMotion'

    #自动识别文件编码；
    Bundle 'FencView.vim'

    #必不可少，在VIM的编辑窗口树状显示文件目录
    Bundle 'The-NERD-tree'

    #NERD出品的快速给代码加注释插件，选中，`ctrl+h`即可注释多种语言代码；
    Bundle 'The-NERD-Commenter'

    #解放生产力的神器，简单配置，就可以按照自己的风格快速输入大段代码。
    Bundle 'UltiSnips'

    #让代码更加易于纵向排版，以=或,符号对齐
    Bundle 'Tabular'

    #迄今位置最好的自动VIM自动补全插件了吧
    #Vundle的这个写法，是直接取该插件在Github上的repo
    Bundle 'Valloric/YouCompleteMe'


以上插件可以在[vim-script.org][3]找到源码和文档，[ZenCoding][10]和[EasyMotion][11]演示点链接,你会心动的。

##.vimrc配置
因为配置不断在更新，所以放上我的配置的链接：[.vimrc配置][vimrc]

##更多
VIM在一开始会觉得非常不习惯，一定要坚持下去，收获的会更多，不仅仅是在装大侠方面的哦~

关于VIM的使用，这篇博客仅仅介绍了很小的一部分，网络上还有大量朋友总结的心得，常学常有收获：

- [Practical Vim][p-vim]，强烈推荐的一本系统介绍VIM的书籍
- [Vim Cheat Sheet][vim-cs]，有VIM的各种助记图，可以作为桌面
- [Vimer的程序世界][14]，不错的站，博主持续钻研VIM各种技巧
- [网友狂人收集的vim资料链接][16]
- [Best of Vim Tips][17]
- [面向前端开发者和TextMate粉丝的vim配置][15]
- [Vim代码折叠简介][12]
- [挑選 Vim 顏色(Color Scheme)][13]
- [vimium][18]，用VIM的操作习惯来控制Chrome的插件


[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    https://github.com/gmarik/vundle
[vim-cs]:  http://overapi.com/vim/
[vundle]:  https://github.com/gmarik/vundle
[pathogen]:  https://github.com/tpope/vim-pathogen
[3]:  http://vim-scripts.org/vim/scripts.html
[4]:  http://www.vim.org/scripts/index.php
[5]:  https://github.com/bronson
[6]:  https://github.com/gmarik
[7]:  https://github.com/
[8]:  https://pages.github.com/
[9]:  http://beiyuu.com/github-pages/
[10]:  http://mattn.github.com/zencoding-vim/
[11]:  http://net.tutsplus.com/tutorials/other/vim-essential-plugin-easymotion/
[12]:  http://scmbob.org/vim_fdm.html
[13]:  http://blog.longwin.com.tw/2009/03/choose-vim-color-scheme-2009/
[14]:  http://www.vimer.cn/
[15]:  http://www.limboy.com/2009/05/30/vim-setting/
[16]:  http://hi.baidu.com/whqvzhjoixbbdwd/item/11315a5073667d0de6c4a5e9
[17]:  http://www.rayninfo.co.uk/vimtips.html
[18]:  https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb
[vimrc]: https://github.com/beiyuu/vimfiles/blob/master/_vimrc
[p-vim]: http://book.douban.com/subject/10599776/
