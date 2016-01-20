---
layout: post
title: Ubuntu下Apache服务器的配置
category: Unix/Linux
tag: [web, linux]
---

##安装Apache

{% highlight Apache config files %}
sudo apt-get update
sudo apt-get install apache2
{% endhighlight Apache config files %}

打开浏览器输入你的IP地址或者localhost,就会进入到Apache服务器的默认Index页面。结果如下所示：

> It works!
> This is the default web page for this server.
> The web server software is running but no content has been added, yet.

##配置文件

在Ubuntu系统下Apache的主要配置文件在/etc/apache2文件夹下：

{% highlight Apache config files %}
cd /etc/apache2
ls -F
{% endhighlight Apache config files %}

> apache2.conf  envvars     magic            mods-enabled/  sites-available/
> conf.d/       httpd.conf  mods-available/  ports.conf     sites-enabled/

这个目录下有许多纯文本文件和子目录，基本作用如下：

* apache2.conf:这是服务器的主要配置文件，几乎所有的配置都通过这个文件来完成，但是为了简洁推荐使用单独的指定的文件来配置不同的模块。
* ports.conf:这个文件用来指定虚拟主机监听的端口号，如果你配置了SSL的时候要检查这个文件是否正确。
* conf.d/:这个目录用来控制Apache的一些特殊配置，比如SSL配置。
* sites-available/:这个目录包括所有不同web站点的虚拟主机文件，不同的请求对应不同的内容，这些都是已有的，并不是正在使用的。
* sites-enabled/:这个目录包含正在使用的虚拟主机的定义，通常只包含到sites-available目录下文件的符号链接。
* mods-[enabled,available]/:和上面的类似，只不过这里面包含的是可用的模块。

从Apache的配置目录结构可以知道，它并不是通过单一的文件来配置，贰拾通过模块化来把整个系统拆分成不同的功能，从而能够动态地增加和修改功能。

##深入Apache2.conf文件内容

文件主要分成三部分，全局配置、默认服务器配置和虚拟主机配置，在Ubuntu系统下，这个文件主要负责全局配置，默认服务器和虚拟主机可以通过Include语句来处理。

Include语句允许Apache读取其他配置文件的内容到当前位置，结果就是Apache启动的时候动态生成一个配置文件，如果拉到文件底部会看到很多Include语句，比如ports.conf等。

###全局配置

####Timeout

这个参数默认设置为300，意思是服务器有300s来处理每个请求。

####KeepAlive

如果设置为On，将允许同个客户端每个连接一直保持来处理多个请求(HTTP长连接)

####MaxKeepAliveRequests

这个参数用来设置每个连接最多能处理多少个单独的请求

####KeepAliveTimeout

这个参数设置下一个请求来之前来等待多久，超过这个时间自动关闭这个connection。

##MPM配置

Ubuntu 14.04下MPM(Multi-Processing Module)配置默认采用了event module,如果你系统采用的是prefork module,可以通过如下方法来切换：

{% highlight Apache config files %}
sudo a2dismod mpm_prefork
sudo a2enmod mpm_event
sudo service apache2 restart
{% endhighlight Apache config files %}

##配置虚拟主机

1.首先禁用默认的Apache虚拟主机：

{% highlight Apache config files%}
sudo a2dissite 000-default.conf
{% endhighlight Apache config files %}

2.在/etc/apache2/sites-available目录下创建一个example.com.conf文件，把example.com替换成你的域名：

文件：/etc/apache2/sites-available/example.com.conf

{% highlight Apache config files %}
<VirtualHost *:80> 
  ServerAdmin webmaster@example.com
  ServerName example.com
  ServerAlias www.example.com
  DocumentRoot /var/www/example.com/public_html/
  ErrorLog /var/www/example.com/logs/error.log 
  CustomLog /var/www/example.com/logs/access.log combined
 </VirtualHost>
{% endhighlight Apache config files %}

 3.给你的网站内容和日志文件创建目录，把example.com替换成你的域名：

{% highlight Apache config files %}
sudo mkdir -p /var/www/example.com/public_html
sudo mkdir /var/www/example.com/logs
{% endhighlight Apache config files %}

 4.启用这个站点：

{% highlight Apache config files %}
sudo a2ensite example.com.conf
{% endhighlight Apache config files %}

 5.重启Apache

{% highlight Apache config files %}
sudo service apache2 restart
{% endhighlight Apache config files %}


 *安装对脚本语言的支持*

 * Perl support:

{% highlight Bash shell scripts %}
sudo apt-get install libapache2-mod-perl2 
{% endhighlight Bash shell scripts %}

 * Python support:

{% highlight Bash shell scripts %}
sudo apt-get install libapache2-mod-python 
{% endhighlight Bash shell scripts %}

 * PHP support:

{% highlight Bash shell scripts %}
sudo apt-get install libapache2-mod-php5 php5 php-pear php5-xcache
{% endhighlight Bash shell scripts %}

 ###Apache中启用和禁用网站和模块

1.启用和禁用网站：

{% highlight Apache config files %}
sudo a2ensite 虚拟主机文件名(example.com.conf)
sudo a2dissite 虚拟主机文件名(example.com.conf)
{% endhighlight Apache config files %}

2.启用和禁用模块

{% highlight Apache config files %}
sudo a2enmod 模块配置文件名
sudo a2dismod  模块配置文件名
{% endhighlight Apache config files %}

##启用用户文件夹实现文件服务器的功能

1.使用如下命令启用userdir模块:

{% highlight Bash shell scripts %}
sudo a2enmod userdir
{% endhighlight Bash shell scripts %}

2.编辑userdir.conf配置userdir模块:

{% highlight Bash shell scripts %}
sudo vim /etc/apache2/mods-enabled/userdir.conf
{% endhighlight Bash shell scripts %}

内容如下，把public_html改为你的个人文件夹名称，如果不存在则创建：

{% highlight Apache config files %}
<IfModule mod_userdir.c>
        UserDir public_html
        UserDir disabled root
 
        <Directory /home/*/public_html>
		AllowOverride All
		Options MultiViews Indexes SymLinksIfOwnerMatch
		<Limit GET POST OPTIONS>
			# Apache <= 2.2:
		        Order allow,deny
		        Allow from all
 
		        # Apache >= 2.4:
		        #Require all granted
		</Limit>
		<LimitExcept GET POST OPTIONS>
			# Apache <= 2.2:
		        Order deny,allow
		        Deny from all
 
			# Apache >= 2.4:
			#Require all denied
		</LimitExcept>
        </Directory>
</IfModule>
{% endhighlight Apache config files %}

3.创建个人文件夹并重启APache

{% highlight Bash shell scripts %}
sudo service apache2 restart
mkdir /home/$USER/public_html 
{% endhighlight Bash shell scripts %}

接下来在浏览器中输入http://localhost/~username/就可以访问你的个人文件夹了，把username替换为你的用户名。

###给你的文件添加访问权限

把上面的AllowOverride All改为AllowOverride AuthConfig,然后给你的服务器添加认证用户，认证用户保存在/var/www/passwd/中，需要使用htpasswd命令来添加用户，如下所示：

{% highlight Apache config files %}
htpasswd -c /var/www/passwd/public_html lippi 
New password: mypassword
Re-type new password: mypassword
Adding password for user lippi 
{% endhighlight Apache config files %}

最后的userdir.conf是这样的：

{% highlight Apache config files %}
<IfModule mod_userdir.c>
	UserDir public_html 
	UserDir disabled root

	<Directory /home/*/public_html>
		AllowOverride FileInfo AuthConfig Limit Indexes
		Options MultiViews Indexes SymLinksIfOwnerMatch IncludesNoExec
		<Limit GET POST OPTIONS>
#		Require all granted
			AuthType Basic
			AuthName "lippi"
			AuthUserFile /var/www/passwd/public_html
			Require valid-user
		</Limit>
		<LimitExcept GET POST OPTIONS>
			Require all denied
		</LimitExcept>
	</Directory>
</IfModule>
{% endhighlight Apache config files %}

