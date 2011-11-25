---
layout:         post
title:          mac 安装 macPorts
---
#{{ page.title }}

这里只介绍通过 Source 来安装的方法

    //下载 MacPorts
    wget http://distfiles.macports.org/MacPorts/MacPorts-1.9.2.tar.gz
    //解压
    tar zxvf MacPorts-1.9.2.tar.gz
    //到相应的文件里
    cd MacPorts-1.9.2
    //这行配置和安装
    ./configure && make && sudo make install
    //删除安装文件
    cd ../
    rm -rf MacPorts-1.9.2*

###MacPorts 的使用

更新 ports tree 和 MacPorts 版本
    
    sudo port -v selfupdate

搜索索引中的软件

    port search name //软件名

安装新软件
    
    sudo port install name

卸载软件
        
    sudo port uninstall name

查看更新的软件以及版本

    port outdated

升级可以更新的软件
    
    sudo port upgrade outdated
