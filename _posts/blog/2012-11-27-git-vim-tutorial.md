---
layout: post
title: Git时代的VIM不完全使用教程
description: 在Git流行的时代，VIM的生态环境也有了长足的进步，令人感动。
category: blog
---

# [{{ page.title }}][1]
2012-11-27 By {{ site.author_info }}

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

    Bundle 'ctrlp.vim'
    Bundle 'AutoClose'
    Bundle 'ZenCoding.vim'
    Bundle 'matchit.zip'
    Bundle 'ShowTrailingWhitespace'
    Bundle '_jsbeautify'
    Bundle 'EasyMotion'
    Bundle 'FencView.vim'
    Bundle 'The-NERD-tree'
    Bundle 'The-NERD-Commenter'
    Bundle 'snipMate'

以上插件都可以在[vim-script.org][3]找到源码和详细的使用文档，简单说明下：

###The NERDTree
这是我认为VIM最不能缺少的插件，在VIM的编辑窗口树状显示文件目录，没什么好多说的，必需品。

###ctrlp.vim
相比于Command-T之类的查找文件的插件，ctrlp.vim最大的好处在于，无需安装其他的包，只要他自己，就可以很好的工作了，恩，就是需要这样干净利落的解决问题。

###ZenCoding.vim
[ZenCoding][10]是一个神级的插件，用他可以让你一种神奇而无比爽快的感觉写HTML、CSS，官网上有动画演示，你一定会心动的。

###EasyMotion
最近看到别人介绍，开始使用的一个插件，用全新的方式在文档中高效的移动光标，和ZenCoding一样，属于革命性的方便好用，[这里][11]有教程,你一定也会心动的。

###snipMate
又一个解放生产力的神奇，简单配置，就可以按照自己的风格快速输入大段代码。

###其他
- AutoClose 可以在你输入一个(或者"之类的配对符号时，自动帮你补全剩余半个；
- matchit.zip 在()、""、甚至HTML标签之间快速跳转；
- ShowTrailingWhitespace 显示行末的空格；
- _jsbeautify JS代码格式化插件；
- FencView.vim 自动识别文件编码；
- The-NERD-Commenter NERD出品的快速给代码加注释插件，选中，`ctrl+h`即可注释多种语言代码；

##.vimrc配置
贴一下我的vimrc配置，注释都有，仅供参考：

    "必须的设置：
    filetype off
    filetype plugin indent on
    "打开高亮
    syntax enable
    "不要兼容vi
    set nocompatible

    "使用color solarized
    set background=dark
    colorscheme solarized
    "terminal下面的背景问题
    let g:solarized_termtrans=1
    let g:solarized_termcolors=256
    let g:solarized_contrast="high"
    let g:solarized_visibility="high"

    set modelines=0


    "tab键的设定
    set tabstop=4
    set shiftwidth=4
    set softtabstop=4
    set expandtab

    "一些其他的设定
    "字符设置
    set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5
    "set encoding=utf-8
    set scrolloff=3
    "新建文件编码
    set fenc=utf-8
    set autoindent
    set hidden
    "设置光标高亮显示
    set cursorline
    set cursorcolumn
    set ttyfast
    set ruler
    set backspace=indent,eol,start
    "set laststatus=2
    "相对行号 要想相对行号起作用要放在显示行号后面
    set relativenumber
    "显示行号
    "set number
    "无限undo
    "set undofile
    "自动换行
    set wrap
    "禁止自动换行
    "set nowrap
    "GUI界面里的字体，默认有抗锯齿
    set guifont=Inconsolata:h12
    "自动载入配置文件不需要重启
    "autocmd! bufwritepost _vimrc source %
    "将-连接符也设置为单词
    set isk+=-

    "设置大小写敏感和聪明感知(小写全搜，大写完全匹配)
    set ignorecase
    set smartcase
    "set gdefault
    set incsearch
    set showmatch
    set hlsearch

    "加入html标签配对
    "runtime macros/matchit.vim 

    "以下设置用来是vim正确显示过长的行
    "set textwidth=80
    "set formatoptions=qrnl
    "彩色显示第85行
    set colorcolumn=85
    "设置256色显示
    set t_Co=256

    "行号栏的宽度
    set numberwidth=4
    "初始窗口的宽度
    "set columns=135
    "初始窗口的高度
    "set lines=50
    "初始窗口的位置
    "winpos 620 45 

    "匹配括号的规则，增加针对html的<>
    "set matchpairs=(:),{:},[:],<:>
    "让退格，空格，上下箭头遇到行首行尾时自动移到下一行（包括insert模式）
    set whichwrap=b,s,<,>,[,]

    "插入模式下移动
    inoremap <c-j> <down>
    inoremap <c-k> <up>
    inoremap <c-l> <right>
    inoremap <c-h> <left>

    "===================================================
    "leader键的功能设置
    "修改leader键为逗号
    let mapleader=","
    "esc的映射
    imap jj <esc>
    "屏蔽掉讨厌的F1键
    inoremap <F1> <ESC>
    nnoremap <F1> <ESC>
    vnoremap <F1> <ESC>
    "修改vim的正则表达
    nnoremap / /\v
    vnoremap / /\v
    "使用tab键来代替%进行匹配跳转
    nnoremap <tab> %
    vnoremap <tab> %
    "折叠html标签 ,fold tag
    nnoremap <leader>ft vatzf
    "使用,v来选择刚刚复制的段落，这样可以用来缩进
    nnoremap <leader>v v`]
    "使用,w来垂直分割窗口，这样可以同时查看多个文件,如果想水平分割则<c-w>s
    nnoremap <leader>w <c-w>v<c-w>l
    nnoremap <leader>wc <c-w>c
    nnoremap <leader>ww <c-w>w
    "使用<leader>t来控制Tab的切换
    nnoremap <leader>t gt
    nnoremap <leader>r gT
    "使用<leader>空格来取消搜索高亮
    nnoremap <leader><space> :noh<cr>
    "html中的js加注释 取消注释
    nmap <leader>h I//jj
    nmap <leader>ch ^xx
    "切换到当前目录
    nmap <leader>q :execute "cd" expand("%:h")<CR>
    "搜索替换
    nmap <leader>s :,s///c

    "取消粘贴缩进
    nmap <leader>p :set paste<CR>
    nmap <leader>pp :set nopaste<CR>

    "文件类型切换
    nmap <leader>fj :set ft=javascript<CR>
    nmap <leader>fc :set ft=css<CR>
    nmap <leader>fx :set ft=xml<CR>
    nmap <leader>fm :set ft=mako<CR>

    "设置隐藏gvim的菜单和工具栏 F2切换
    set guioptions-=m
    set guioptions-=T
    "去除左右两边的滚动条
    set go-=r
    set go-=L

    map <silent> <F2> :if &guioptions =~# 'T' <Bar>
            \set guioptions-=T <Bar>
            \set guioptions-=m <bar>
        \else <Bar>
            \set guioptions+=T <Bar>
            \set guioptions+=m <Bar>
        \endif<CR>

    "===================================================
    "插件的设置

    "Indent Guides设置
    let g:indent_guides_guide_size=1


    set rtp+=~/.vim/bundle/vundle/
    call vundle#rc()

    " let Vundle manage Vundle
    " required!
    Bundle 'gmarik/vundle'

    " vim-scripts repos
    Bundle 'ctrlp.vim'
    Bundle 'AutoClose'
    Bundle 'ZenCoding.vim'
    Bundle 'matchit.zip'
    Bundle 'ShowTrailingWhitespace'

    "jsbeautify的设置
    Bundle '_jsbeautify'
    nnoremap <leader>_ff :call g:Jsbeautify()<CR>  

    "EasyMotion设置
    Bundle 'EasyMotion'
    let g:EasyMotion_leader_key = '<Leader><Leader>' 

    "Fencview的初始设置
    Bundle 'FencView.vim'
    let g:fencview_autodetect=1

    "NerdTree的设置 并且相对行号显示
    Bundle 'The-NERD-tree'
    nmap <leader>nt :NERDTree<cr>:set rnu<cr>
    let NERDTreeShowBookmarks=1
    let NERDTreeShowFiles=1
    let NERDTreeShowHidden=1
    let NERDTreeIgnore=['\.$','\~$']
    let NERDTreeShowLineNumbers=1
    let NERDTreeWinPos=1

    "对NERD_commenter的设置
    Bundle 'The-NERD-Commenter'
    let NERDShutUp=1
    "支持单行和多行的选择，//格式
    map <c-h> ,c<space>

##更多
VIM在一开始会觉得非常不习惯，一定要坚持下去，收获的会更多，不仅仅是在装大侠方面的哦~

关于VIM的使用，这篇博客仅仅介绍了很小的一部分，网络上还有大量朋友总结的心得，常学常有收获：

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
