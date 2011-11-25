---
layout:         post
title:          安装 node.js
---
#{{ page.title }}
2011-11-24 By PIZn @杭州

今天开始折腾 Node.js. 第一步，如何安装。

###Mac 上的安装方法

如果你已经安装好了 homebrew ，直接在终端输入这样一个命令: brew install node

如果没有，可以采用下面的方法：

1. 安装 Xcode (开发者工具，里面有很多需要的软件包，最基础的一些环境等)
2. 安装 git2. 安装 git (之前已经有文章介绍过)
3. 在终端输入下面命令：

        git clone git://github.com/ry/node.git
        cd node
        ./configure
        make
        sudo make install

接着就可以通过后面的一个 Hello world 的例子来测试是否运行了。

###Ubuntu 上面的安装方法

1.  安装一些依赖包

        sudo apt-get install g++ curl libssl-dev apache2-utils
        sudo apt-git install git-core

2.  在终端下运行下面命令：

        git clone git://github.com/ry/node.git
        cd node
        ./configure
        make
        sudo make install

接着就可以通过后面的一个 Hello world 的例子来测试是否运行了。

###Windows 上面的安装方法

在 Windows 上，你得使用 cygwin 来安装 node，具体的安装方法如下：

1. 安装 cygwin
2. 点击 cygwin 里面的 setup.exe 来安装如下的包：

    * devel -> openssl
    * devel -> g++-gcc
    * devel -> make
    * python -> python
    * devel -> git

3. 依照 start -> cygwin -> cygwin bash shell 打开终端
4. 输入下面命令：


        git clone git://github.com/ry/node.git
        cd node
        ./configure
        make
        sudo make install

接着就可以通过后面的一个 Hello world 的例子来测试是否运行了。

PS: 其实在 windows 下，还有其他的安装方法。具体百度一下就有。
