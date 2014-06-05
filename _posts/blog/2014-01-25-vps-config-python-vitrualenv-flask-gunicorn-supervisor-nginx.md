---
layout: post
title: VPS环境搭建详解 (Virtualenv+Gunicorn+Supervisor+Nginx)
description: VPS环境搭建就是去理解各种概念的过程，这篇博客记录了在VPS上搭建Python环境的过程，其中除了Python特性的东西，基本概念是相通的。关键字：Python, Virtualenv, Flask, Gunicorn, Supervisor, Nginx
category: blog
---

新用户注册购买[DigitalOcean][DO]的VPS，使用优惠码`2014SSD`（或请尝试`10TOSHIP`）有$10赠送，可用两个月。DO采取丧心病狂的低价竞争策略，每月$5即可享用全功能的SSD硬盘VPS，具体去看看[这里][DO]吧。

注册，选择套餐、机房、系统(我选默认Ubuntu 12)，付款成功，可以开始配置了。

我们目标实现一个支持多个独立域名网站的线上Python环境，这会用到[Virtualenv][VE]， [Flask][Flask]， [Gunicorn][GU]， [Supervisor][SV]， [Nginx][Nginx]。

##配置用户环境
因为要跑多个站，所以最好将他们完全隔离，每个站对应一个用户，于是我们有了：

     User        Site

     bob         dylan     ##bob用户有一个dylan的站
    michael     jackson    ##michael用户有一个jackson的站

注册成功后，会收到DO发来的`root`账户的密码邮件，`ssh root@你的IP地址`登录上去开始添加用户。

    ##推荐安装zsh作为默认shell
    sudo apt-get update
    sudo apt-get install zsh

    ##安装oh-my-zsh插件
    cd ~/.
    ##自动安装脚本
    wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh

    ##添加用户bob
    ##参数-d：指定用户目录
    ##参数-m：如果目录不存在则创建
    ##参数-s：只用用户使用的 shell
    useradd bob -d /home/bob -m -s /bin/zsh

    #添加用户michael
    useradd michael -d /home/michael -m -s /bin/zsh

    ##以上参数也可以修改passwd文件来调整
    sudo vim /etc/passwd

    ##sudo和用户组管理在
    visudo
    sudo vim /etc/sudoers

新增用户之后，需要解锁：

    ##为新增用户设置一个初始密码即可解锁
    passwd bob
    passwd michael

用ssh-keygen建立信任关系可以方便登录管理：

    ##本地机器
    ##会在~/.ssh目录下生成秘钥文件id_rsa、id_rsa.pub
    ssh-keygen -t [rsa|dsa]

    ##复制公钥文件id_rsa.pub
    scp ~/.ssh/id_rsa.pub bob@digitalocean:~/.ssh

    ##VPS上，添加本地机器的信任关系
    cd ~/.ssh
    cat id_rsa.pub >> ~/.ssh/authorized_keys

    ##OK，从本地机器登录到VPS的bob用户就不需要密码了
    ##同理，也可以添加到michael用户的.ssh目录下

更多资料可以阅读：
<ul>
  <li><a href="http://www.chinaunix.net/old_jh/4/438660.html" target="_blank" class="external">Linux的用户和用户组管理</a></li>
  <li><a href="http://sofish.de/1685" target="_blank" class="external">把 Mac 上的 bash 换成 zsh</a></li>
  <li><a href="http://leeiio.me/bash-to-zsh-for-mac/" target="_blank" class="external">zsh – 给你的Mac不同体验的Terminal</a></li>
  <li><a href="http://blog.csdn.net/kongqz/article/details/6338690" target="_blank" class="external">ssh-keygen的使用方法</a></li>
  <li><a href="http://www.ruanyifeng.com/blog/2014/03/server_setup.html" target="_blank" class="external">Linux服务器的初步配置流程</a></li>
  <li><a href="http://www.ruanyifeng.com/blog/2014/03/server_setup.html" target="_blank" class="external">Linux服务器的初步配置流程</a></li>
</ul>

##为每个APP创建Virtualenv

[Virtualenv][VE]可以为每个Python应用创建独立的开发环境，使他们互不影响，Virtualenv能够做到：
<ul>
  <li>在没有权限的情况下安装新套件</li>
  <li>不同应用可以使用不同的套件版本</li>
  <li>套件升级不影响其他应用</li>
</ul>

安装Virtualenv

    ##先安装Python的包管理pip
    sudo apt-get install pip

    ##用pip安装virtualenv
    sudo pip install virtualenv

    ##建议用bob用户登录操作
    ##bob用户创建dylan的virtualenv
    cd /home/bob
    virtualenv dylan

    ##激活virtualenv
    cd /home/bob/dylan
    source ./bin/activate

    ##取消激活只需
    deactivate

    ##michael用户如法炮制即可

##安装Flask
[Flask][Flask]是Python流行的一个web框架，但是Flask比Django轻量了许多，使用更加直观，这里并不展开讲Flask的细节，当做一个Hello Wordld来用就好了。

    ##安装Flask
    ##依然在virtualenv activate的环境下
    pip install Flask

    ##根目录下
    vim runserver.py

    ##写入Flask的Hello World
    from flask import Flask
    app = Flask(__name__)

    @app.route('/')
    def hello_world():
        return 'Hello World!'

        if __name__ == '__main__':
            app.run()

写入之后，如果在本地机器上可以运行`python runserver.py`，然后打开`127.0.0.1:5000`看到Hello World!了，但在VPS，这样不行，等待后面配置吧。

##安装Gunicorn
[Gunicorn][Gu]是用于部署WSGI应用的，任何支持WSGI的都可以，虽说直接`python runserver.py`这样网站也能跑起来，但那是方便开发而已，在线上环境，还是需要更高效的组件来做。

    ##安装Gunicorn
    ##依然在Virtualenv环境下
    pip install gunicorn

Gunicorn的配置是必须的，因为我们要上两个独立的站，所以不能都用默认的配置：

    ##在bob的dylan项目下
    cd /home/bob/dylan
    vim gunicorn.conf

    ##文件内写入以下内容
    ##指定workers的数目，使用多少个进程来处理请求
    ##绑定本地端口
    workers = 3
    bind = '127.0.0.1:8000'

    ##在michael的jackson项目下
    cd /home/michael/jackson
    vim gunicorn.conf

    ##写入文件内容
    ##与dylan的端口要不一样
    workers = 3
    bind = '127.0.0.1:8100'

最终的目录结构应该是这样的

    /home/
    └── bob  //用户目录
    │   ├── logs
    │   └── dylan  //项目目录
    │       ├── bin
    │       │   ├── activate
    │       │   ├── easy_install
    │       │   ├── gunicorn
    │       │   ├── pip
    │       │   └── python
    │       ├── include
    │       │   └── python2.7 -> /usr/include/python2.7
    │       ├── lib
    │       │   └── python2.7
            ├── local
    │       │   ├── bin -> /home/shenye/shenyefuli/bin
    │       │   ├── include -> /home/shenye/shenyefuli/include
    │       │   └── lib -> /home/shenye/shenyefuli/lib
    │       │
    │       │ //以上目录是Virtualenv生成的
    │       ├── gunicorn_conf.py  //Gunicorn的配置文件
    │       └── runserver.py  //hello_world程序
    │
    │
    └── michael  //用户目录
        ├── logs
        └── jackson //项目目录
            ├── bin
            │   ├── activate
            │   ├── easy_install
            │   ├── gunicorn
            │   ├── pip
            │   └── python
            ├── include
            │   └── python2.7 -> /usr/include/python2.7
            ├── lib
            │   └── python2.7
            ├── local  //以上这些文件都是Virtualenv需要的
            │   ├── bin -> /home/shenye/shenyefuli/bin
            │   ├── include -> /home/shenye/shenyefuli/include
            │   └── lib -> /home/shenye/shenyefuli/lib
            │
            │ //以上目录是Virtualenv生成的
            ├── gunicorn_conf.py  //Gunicorn的配置文件
            └── runserver.py  //hello_world程序

##安装Supervisor
[Supervisor][SV]可以同时启动多个应用，最重要的是，当某个应用Crash的时候，他可以自动重启该应用，保证可用性。

    ##安装Supervisor
    ##sudo安装
    sudo apt-get install supervisor

    ##启动服务
    sudo service supervisor start
    ##终止服务
    sudo service supervisor stop
    ##也可以直接kill pid
    ps -A | grep supervisor

修改了程序代码，或者修改了配置，需要手动重启supervisor服务，尤其是摸不着头脑的错误的时候，重启最能解决问题！

安装好之后，开始配置各应用的supervisor服务：

    ##supervisor的配置文件位置在：
    /etc/supervisor/supervisor.conf

    ##为了代码好看一些，我们分别放置各项目的配置文件
    ##新建bob的dylan项目配置文件
    touch /etc/supervisor/conf.d/dylan.conf

    ##文件内容
    [program:dylan]
    ##注意项目目录和gunicorn的配置文件地址
    command=/home/bob/dylan/bin/gunicorn runserver:app -c /home/bob/dylan/gunicorn.conf
    directory=/home/bob/dylan
    user=bob
    autostart=true
    autorestart=true
    ##log文件的位置
    stdout_logfile=/home/bob/logs/gunicorn_supervisor.log


    ##新建michael的jackson项目配置文件
    touch /etc/supervisor/conf.d/jackson.conf

    ##文件内容
    [program:jackson]
    command=/home/michael/jackson/bin/gunicorn runserver:app -c /home/michael/jackson/gunicorn.conf
    directory=/home/michael/jackson
    user=michael
    autostart=true
    autorestart=true
    stdout_logfile=/home/michael/logs/gunicorn_supervisor.log

写好配置之后：

    ##重新读取配置
    sudo supervisorctl reread

    ##启动服务
    sudo supervisorctl start dylan
    sudo supervisorctl start jackson

    ##停止服务
    sudo supervisorctl stop dylan
    sudo supervisorctl stop jackson

    ##有问题就重启supervisor的总服务
    sudo service supervisor stop
    sudo service supervisor start

##安装Nginx
有了[Gunicorn][GU]、[Supervisor][SV]，本地的环境的算是搭好了，但是我们需要让VPS上的网站从外网可以访问，这时候需要Nginx。

[Nginx][Nginx]是轻量级、性能强、占用资源少，能很好的处理高并发的反向代理软件，是我们的不二选择：

    ##安装Nginxx
    sudo apt-get install nginx

    ##启动服务
    sudo service nginx start

    ##查看VPS的IP地址
    ifconfig eth0 | grep inet | awk '{ print $2  }'

    ##重启和暂停服务
    sudo service nginx restart
    sudo service nginx stop

Nginx的配置文件和Supervisor类似，不同的程序可以分别配置，然后被总配置文件include：

    ##Nginx的配置文件地址
    /etc/nginx/nginx.conf

    ##新建bob的dylan项目配置文件
    ##在sites-available目录下
    touch /etc/nginx/sites-available/dylan.com

    ##文件内容
    server {
            listen   80;             //端口
            server_name dylan.com;   //访问域名

            root /home/bob/dylan/;
            access_log /home/bob/logs/access.log;
            error_log /home/bob/logs/access.log;

            location / {
                    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $http_host;
                    proxy_redirect off;
                    if (!-f $request_filename) {
                            proxy_pass http://127.0.0.1:8000;  //这里是dylan的gunicorn端口
                            break;
                    }
            }
    }


    ##michael的jackson项目
    touch /etc/nginx/sites-available/jackson.com

    ##文件内容
    server {
            listen   80;               //端口
            server_name jackson.com;   //访问域名

            root /home/michael/jackson/;
            access_log /home/michael/logs/access.log;
            error_log /home/michael/logs/access.log;

            location / {
                    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $http_host;
                    proxy_redirect off;
                    if (!-f $request_filename) {
                            proxy_pass http://127.0.0.1:8100;  //这里是jackson的gunicorn端口
                            break;
                    }
            }
    }

配置完成之后，'sudo service nginx restart'重启一下服务，再配置一下本地的Hosts，打开浏览器应该就能看到了。

##完成
至此，一个完整的环境搭建就完成了，推荐试用[DigitalOcean][DO]的VPS看看，`2014SSD`（或请尝试`10TOSHIP`）的优惠码也可以试试看看有没有过期哦~


[DO]: https://www.digitalocean.com/?refcode=f95f7297ed94 "DigitalOcean"
[VE]: http://www.virtualenv.org/en/latest/ "Virtualenv"
[Flask]: http://flask.pocoo.org/docs/ "Flask"
[GU]: http://gunicorn.org/ "Gunicorn"
[SV]: http://supervisord.org/ "Supervisor"
[Nginx]: http://nginx.com/ "Nginx"
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
