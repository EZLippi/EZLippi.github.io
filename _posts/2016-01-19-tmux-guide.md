---
layout: post
title: 终端复用软件之tmux简介
category: Unix/Linux
tag: [shell, linux]
---

  Tmux是一个优秀的终端复用软件，支持多标签，也支持窗口内部面板的分割，更重要的是，Tmux提供了窗体随时保存和恢复的功能。想象一下假如你在公司的服务器上开了许多窗口调试程序，回到家时通过SSH连接公司电脑又要打开一堆繁琐的窗口，而且还忘记了当时调试到哪一步了，那Tmux可以帮你解决这个难题，当SSH连接断开重新连接后能够恢复到原来的工作环境。

##安装 

	sudo apt-get install tmux

安装完成后输入tmux进入软件，界面类似一个下方带有状态栏的终端。

##基本概念

  Tmux基于典型的c/s模型，主要分为会话、窗口和面板三个元素：

* Session：输入tmux后就创建了一个会话，一个会话是一组窗体的集合。
* Window：会话中一个可见的窗口。
* Pane:一个窗口可以分成多个面板。

![](/images/images/tmux.jpg)

图中左下角的3显示为当前会话，随后1 vim,2 bash,3 ssh 分别是3个窗口，蓝色bash表示当前窗口，图中用蓝色数字标记的1,2,3分别是bash窗口的三个面板。你还可以在tmux配置文件中给状态栏添加时间、天气等信息。

##Tmux基本操作

Tmux的所有操作必须使用一个前缀进入命令模式，默认前缀为Ctrl+b，很多人会改为Ctrl+a,你可以修改tmux.conf配置文件来修改默认前缀：

{% highlight Vim Script %}
#前缀设置为<Ctrl-a>
set -g prefix C-a
#解除<Ctrl-b>
ubind C-b
{% endhighlight Vim Script %}


修改之后重启Tmux生效，或者先按Ctrl+b，然后输入：，进入命令行模式， 在命令行模式下输入：

{% highlight Vim Script %}
source-file ~/.tmux.conf
{% endhighlight Vim Script %}

你也可以在配置文件中加入下面这句话，以后改了配置文件只需要按前缀+r了。

{% highlight Vim Script %}
#将r 设置为加载配置文件，并显示"reloaded!"信息
bind r source-file ~/.tmux.conf \; display "Reloaded!"
{% endhighlight Vim Script %}
	
加入如下几条语句， 现在切换面板就和vim一样了：

{% highlight Vim Script %}
# map Vi movement keys as pane movement keys
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
{% endhighlight Vim Script %}

##复制/粘贴

1. 按前缀+[ 进入复制模式
2. 按 space 开始复制，移动光标选择复制区域
3. 按 Enter 复制并退出copy-mode。
4. 将光标移动到指定位置，按前缀+ ] 粘贴

如果把tmux比作vim的话，那么我们大部分时间都是处于编辑模式，只需要在配置文件(~/.tmux.conf)中加入如下行即可以像 vim一样使用hjkl移动:

{% highlight Vim Script %}
#copy-mode 将快捷键设置为vi 模式
setw -g mode-keys vi
{% endhighlight Vim Script %}

##会话的创建和保存

* 终端运行tmux + 会话名，创建或打开会话
* 前缀 + d 退出并保存会话

##窗口操作

* 前缀 + c 创建一个新的window
* 前缀 + b 重命名当前window
* 前缀 + & 关闭当前window
* 前缀 + n 移动到下一个窗口
* 前缀 + p 移动到前一个窗口
* 前缀 + l 切换到上一个窗口

##面板操作

在配置文件中添加下面两行就可以使用`前缀+ |-`来水平和垂直分割窗口：

{% highlight Vim Script %}
# use PREFIX | to split window horizontally and PREFIX - to split vertically
bind | split-window -h
bind - split-window -v
{% endhighlight Vim Script %}

添加如下命令到配置文件后后可以使用HJKL来调整窗口大小:

{% highlight Vim Script %}	
# resize panes using PREFIX H, J, K, L
bind H resize-pane -L 5
bind J resize-pane -D 5
bind K resize-pane -U 5
bind L resize-pane -R 5	
{% endhighlight Vim Script %}
	 
其他操作：

* <Ctrl-b> + 方向键，切换窗口
* <Ctrl-b> + q 显示所有面板
* <Ctrl-b> + !/x 关闭当前面板

查看所有的按键，使用`<Ctrl-b> + ?`

##Tmux个性化

你可以使用[tmux-powerline](https://github.com/erikw/tmux-powerline)来美化你的状态栏。

美化之后的效果是这样的：

![](/images/images/tmux2.jpg)

最后附上我的tmux配置文件：[.tmux.conf](https://github.com/LippiOuYang/Profiles/blob/master/tmux.conf)




