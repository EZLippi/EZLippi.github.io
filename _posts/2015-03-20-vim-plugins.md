---
layout: post
title: 一些强大的Vim插件
keyword: Vim
tags: Vim
date: 2015-03-20 09:20:26 +800
category:   other
---

*  目录
{:toc}

除了一些常用的插件比如ctags，taglist，bufexplorer,winmamager之外，这里介绍一些很强大的插件。

1.*Vundle* [Github主页](https://github.com/gmarik/Vundle.vim)，一个强大的插件管理器

###Vundle可以：

1.在Vimrc文件里跟踪和配置你的插件

2.只需敲一条命令就可以安装、更新、搜索、清除插件


###安装Vundle

    $ git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
    
配置Vundle插件：

    {% highlight Vim Script%}
    set nocompatible              " be iMproved, required
    filetype off                  " required
    
    " set the runtime path to include Vundle and initialize
    set rtp+=~/.vim/bundle/Vundle.vim
    call vundle#begin()
    " alternatively, pass a path where Vundle should install plugins
    "call vundle#begin('~/some/path/here')
    "在下面添加你需要安装的插件
    " let Vundle manage Vundle, required
    Plugin 'gmarik/Vundle.vim'
    
    " The following are examples of different formats supported.
    " Keep Plugin commands between vundle#begin/end.
    "在Github仓库的插件
    Plugin 'tpope/vim-fugitive'
    " http://vim-scripts.org/vim/scripts.html网站上的插件直接写插件名称
    Plugin 'L9'
    " Git plugin not hosted on GitHub
    Plugin 'git://git.wincent.com/command-t.git'
    " 本机目录下的插件
    Plugin 'file:///home/gmarik/path/to/plugin'
    " The sparkup vim script is in a subdirectory of this repo called vim.
    " Pass the path to set the runtimepath properly.
    Plugin 'rstacruz/sparkup', {'rtp': 'vim/'}
    " Avoid a name conflict with L9
    Plugin 'user/L9', {'name': 'newL9'}
    
    " 所有的插件需要在这一行之前添加
    call vundle#end()            " required
    filetype plugin indent on    " required
    " To ignore plugin indent changes, instead use:
    "filetype plugin on
    {% endhighlight %}

###如何使用Vundle

     {% highlight Vim Script%}
    " Brief help
    " :PluginList       - lists configured plugins
    " :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
    " :PluginSearch foo - searches for foo; append `!` to refresh local cache
    " :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal

    " 使用:h vundle 显示帮助文档

      {% endhighlight %}

------------------------------------

2.*neocomplete* [github主页](https://github.com/Shougo/neocomplete.vim)，一个比VIm自带补全更强大的自动补全插件，支持更多的特性。


###安装

确保你的系统安装了下列之一：

* vim-nox
* vim-gtk
* vim-gnome
* vim-athena

然后再Vundle中添加一句：Plugin 'Shougo/neocomplete.vim'，重新打开Vim就自动安装了

###ScreenShots

![](https://camo.githubusercontent.com/2135f9b37963594325b304a7a57163b5b6ab8b11/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f3231343438382f3632333135312f32383461643836652d636635622d313165322d383238652d3235376433316266303537322e706e67)

![](https://camo.githubusercontent.com/4a4d1893ce150863dd815fa6967e5f526ac84727/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f3231343438382f3632333439362f39346564313961322d636636382d313165322d386433332d3361616438613339643763312e676966)

###配置
    
      {% highlight Vim Script%}
        "Note: This option must set it in .vimrc(_vimrc).  NOT IN .gvimrc(_gvimrc)!
        " Disable AutoComplPop.
        let g:acp_enableAtStartup = 0
        " Use neocomplete.
        let g:neocomplete#enable_at_startup = 1
        " Use smartcase.
        let g:neocomplete#enable_smart_case = 1
        " Set minimum syntax keyword length.
        let g:neocomplete#sources#syntax#min_keyword_length = 3
        let g:neocomplete#lock_buffer_name_pattern = '\*ku\*'
        
        " Define dictionary.
        let g:neocomplete#sources#dictionary#dictionaries = {
            \ 'default' : '',
            \ 'vimshell' : $HOME.'/.vimshell_hist',
            \ 'scheme' : $HOME.'/.gosh_completions'
                \ }
        
        " Define keyword.
        if !exists('g:neocomplete#keyword_patterns')
            let g:neocomplete#keyword_patterns = {}
        endif
        let g:neocomplete#keyword_patterns['default'] = '\h\w*'
        
        " Plugin key-mappings.
        inoremap <expr><C-g>     neocomplete#undo_completion()
        inoremap <expr><C-l>     neocomplete#complete_common_string()
        
        " Recommended key-mappings.
        " <CR>: close popup and save indent.
        inoremap <silent> <CR> <C-r>=<SID>my_cr_function()<CR>
        function! s:my_cr_function()
          return neocomplete#close_popup() . "\<CR>"
          " For no inserting <CR> key.
          "return pumvisible() ? neocomplete#close_popup() : "\<CR>"
        endfunction
        " <TAB>: completion.
        inoremap <expr><TAB>  pumvisible() ? "\<C-n>" : "\<TAB>"
        " <C-h>, <BS>: close popup and delete backword char.
        inoremap <expr><C-h> neocomplete#smart_close_popup()."\<C-h>"
        inoremap <expr><BS> neocomplete#smart_close_popup()."\<C-h>"
        inoremap <expr><C-y>  neocomplete#close_popup()
        inoremap <expr><C-e>  neocomplete#cancel_popup()
        " Close popup by <Space>.
        "inoremap <expr><Space> pumvisible() ? neocomplete#close_popup() : "\<Space>"
        
        " For cursor moving in insert mode(Not recommended)
        "inoremap <expr><Left>  neocomplete#close_popup() . "\<Left>"
        "inoremap <expr><Right> neocomplete#close_popup() . "\<Right>"
        "inoremap <expr><Up>    neocomplete#close_popup() . "\<Up>"
        "inoremap <expr><Down>  neocomplete#close_popup() . "\<Down>"
        " Or set this.
        "let g:neocomplete#enable_cursor_hold_i = 1
        " Or set this.
        "let g:neocomplete#enable_insert_char_pre = 1
        
        " AutoComplPop like behavior.
        "let g:neocomplete#enable_auto_select = 1
        
        " Shell like behavior(not recommended).
        "set completeopt+=longest
        "let g:neocomplete#enable_auto_select = 1
        "let g:neocomplete#disable_auto_complete = 1
        "inoremap <expr><TAB>  pumvisible() ? "\<Down>" : "\<C-x>\<C-u>"
        
        " Enable omni completion.
        autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
        autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
        autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
        autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
        autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
        
        " Enable heavy omni completion.
        if !exists('g:neocomplete#sources#omni#input_patterns')
          let g:neocomplete#sources#omni#input_patterns = {}
        endif
        "let g:neocomplete#sources#omni#input_patterns.php = '[^. \t]->\h\w*\|\h\w*::'
        "let g:neocomplete#sources#omni#input_patterns.c = '[^.[:digit:] *\t]\%(\.\|->\)'
        "let g:neocomplete#sources#omni#input_patterns.cpp = '[^.[:digit:] *\t]\%(\.\|->\)\|\h\w*::'
        
        " For perlomni.vim setting.
        " https://github.com/c9s/perlomni.vim
        let g:neocomplete#sources#omni#input_patterns.perl = '\h\w*->\h\w*\|\h\w*::'
         {% endhighlight %}
         
         
3.*CtrlP插件* [github主页](https://github.com/kien/ctrlp.vim)

快速查找文件、缓冲区、tag的Vim插件，可以同时打开多个文件，创建文件和目录


基本操作：

	在Vim中按下Ctrl+p打开Ctrlp插件
	<c-d>在路径搜索和文件名搜索之间切换
	 <c-r>在字符串搜索和正则表达式搜索中切换
	<c-f>和<c-b>forward和backward，搜索结果在不同搜索模式中切换
	<c-j><c-k>在结果中切换
	<c-n><c-p>在搜索历史中切换
	<c-t>在新Tab中打开选中的文件
	<c-v>在垂直分屏中打开选中的文件
	<c-s>在水平分屏中打开选中的文件
	<c-y>创建新的文件和目录
	<c-z>标记将要打开的文件
	<c-o>打开被<c-z>标记的文件


4*surround* [github主页](https://github.com/tpope/vim-surround)

大多数编程语言的语法都用到了配对符号surrounding: (), [], {}, <>, ‘’, “”，标记语言xml html 等更是完全依赖与这种语法。正常输入时，所有的编辑器都能胜任，大部分会在你输入一个括号时帮你补全另一半。vim 也有这样的插件auto-pair, 但是这个不是重点，真正的难题是当你需要为已一些存在的代码加上括号，删除一对括号但保留其中的内容，或者把一对()改成[]。

使用surround，你将很容易添加和修改配对符号，比如：

        {% highlight Vim Script%}
	     Old text                  Command		 New text ~
      "Hello *world!"				 ds"         Hello world!
      [123+4*56]/2					cs])        (123+456)/2
      "Look ma, I'm *HTML!"			cs"<q>      <q>Look ma, I'm HTML!</q>
      if *x>3 {						ysW(        if ( x>3 ) {
      my $str = *whee!;				vlllls'     my $str = 'whee!';
      <div>Yo!*</div>				dst         Yo!
      <div>Yo!*</div>				cst<p>      <p>Yo!</p>
          {% endhighlight %}
          
上面*代表当前光标位置，添加替换时使用后半括号)]}，添加的括号和内容间就没有空格（如第2个示例），反之会在内容前后添加一个空格（如第4个实例）。第6个示例中的t代表一对HTML或者xml tag。其他表示范围的符号：w代表word, W代表WORD(被空格分开的连续的字符窜），p代表paragraph。

###命令列表     

    {% highlight Vim Script%}
        Normal mode
    -----------
    ds  - delete a surrounding
    cs  - change a surrounding
    ys  - add a surrounding
    yS  - add a surrounding and place the surrounded text on a new line + indent it
    yss - add a surrounding to the whole line
    ySs - add a surrounding to the whole line, place it on a new line + indent it
    ySS - same as ySs
    
    Visual mode
    -----------
    s   - in visual mode, add a surrounding
    S   - in visual mode, add a surrounding but place text on new line + indent it
    
    Insert mode
    -----------
    <CTRL-s> - in insert mode, add a surrounding
    <CTRL-s><CTRL-s> - in insert mode, add a new line + surrounding + indent
    <CTRL-g>s - same as <CTRL-s>
    <CTRL-g>S - same as <CTRL-s><CTRL-s>
    {% endhighlight %}
    

    
5.*syntastic*  [githun主页](https://github.com/scrooloose/syntastic#installation)

来看一下官方给的图片：
![](http://foocoder.qiniudn.com/blog/syntasticsyntastic.png?token=hYfsyKwhHPe-Ga-1Hypx5F8CwimEywvTI8XdNpEm:z6zQYbdezgOYcKfzok7LEkuRDkg=:eyJTIjoiZm9vY29kZXIucWluaXVkbi5jb20vYmxvZy9zeW50YXN0aWNzeW50YXN0aWMucG5nIiwiRSI6MTQwMDA2ODU2N30=)

* 图片很清楚的介绍了插件功能：
* 用location list 列出所有错误。
* 命令行窗口显示当前错误。
* 错误标记，有警告和错误。
* 鼠标悬停可以出现错误提示框
* 状态栏标记。

###配置

当然也可以做一些简单的配置，比如设置为每次打开buffer就执行语法检查，而不只是在保存时：
    let g:syntastic_check_on_open = 1
如果想使用多个检查器，可以这样写：
    let g:syntastic_php_checkers = ['php', 'phpcs', 'phpmd']
    
###错误跳转

syntastic使用location list来显示所有的错误，location list和quificfix 类似，包含了位置信息。
调起这个location list
    :Errors 或者 :lopen
使用:lne[xt]和:lp[revious]就可以在错误间跳转。当然，如果用的多，可以做个mapping,更多内容可以参考帮助文档:help syntastic.


6.*fugitive*[github主页](https://github.com/tpope/vim-fugitive)

>If you don't know GIT, learn it right now!If you use GIT and VIM, use Fugitive right now!
 
fugitive.vim插件是由Tim Pope创建的VIM插件。该插件与命令行git工具相辅相成，可以无缝的插入到工作流程中。

在VIM的命令行中，%符号具有特殊的含义：他将扩展为当前文件的全路径。可以使用该命令来运行使用文件名作为参数的任意git命令，从而使得命令作用于当前的文件。但是fugitive也提供了一些便利的方法，其中的一些总结如下：

        {% highlight Vim Script%}

      git	             fugitive	      action
    :Git add %	        :Gwrite  	     Stage the current file to the index
    :Git checkout %	    :Gread	         Revert current file to last checked in version
    :Git rm %	        :Gremove	     Delete the current file and the corresponding Vim buffer
    :Git mv %	        :Gmove	         Rename the current file and the corresponding Vim buffer
     {% endhighlight %}



















