---
layout:     post
title:      值得推荐的android开源框架
keywords:   Android, openSource
category:   Android
tags:		[android, 开源]
---
 
## 1、volley  ##

项目地址[https://github.com/smanikandan14/Volley-demo](https://github.com/smanikandan14/Volley-demo)

-  (1)  JSON，图像等的异步下载；
-  (2)  网络请求的排序（scheduling）
-  (3)  网络请求的优先级处理
-  (4)  缓存
-  (5)  多级别取消请求
-  (6)  和Activity和生命周期的联动（Activity结束时同时取消所有网络请求）

## 2、android-async-http  ##
项目地址：[https://github.com/loopj/android-async-http](https://github.com/loopj/android-async-http)

文档介绍：[http://loopj.com/android-async-http/ ](http://loopj.com/android-async-http/ )

-  (1) 在匿名回调中处理请求结果
-  (2) 在UI线程外进行http请求
-  (3) 文件断点上传
-  (4) 智能重试
-  (5) 默认gzip压缩
-  (6) 支持解析成Json格式
-  (7) 可将Cookies持久化到SharedPreferences

## 3、Afinal框架 ##

项目地址：[https://github.com/yangfuhai/afinal](https://github.com/yangfuhai/afinal)

主要有四大模块：

 - (1) 数据库模块：android中的orm框架，使用了线程池对sqlite进行操作。
-  (2) 注解模块：android中的ioc框架，完全注解方式就可以进行UI绑定和事件绑定。无需findViewById和setClickListener等。
-  (3) 网络模块：通过httpclient进行封装http数据请求，支持ajax方式加载，支持下载、上传文件功能。
-  (4) 图片缓存模块：通过FinalBitmap，imageview加载bitmap的时候无需考虑bitmap加载过程中出现的oom和android容器快速滑动时候出现的图片错位等现象。

FinalBitmap可以配置线程加载线程数量，缓存大小，缓存路径，加载显示动画等。FinalBitmap的内存管理使用lru算法，
没有使用弱引用（android2.3以后google已经不建议使用弱引用，android2.3后强行回收软引用和弱引用，详情查看android官方文档），
更好的管理bitmap内存。

FinalBitmap可以自定义下载器，用来扩展其他协议显示网络图片，比如ftp等。同时可以自定义bitmap显示器，
在imageview显示图片的时候播放动画等（默认是渐变动画显示）。

## 4、xUtils框架 ##
项目地址：[https://github.com/wyouflf/xUtils](https://github.com/wyouflf/xUtils)

主要有四大模块：

 (1) 数据库模块：android中的orm框架，一行代码就可以进行增删改查；

- 支持事务，默认关闭；
- 可通过注解自定义表名，列名，外键，唯一性约束，NOT NULL约束，CHECK约束等（需要混淆的时候请注解表名和列名）；
- 支持绑定外键，保存实体时外键关联实体自动保存或更新；
- 自动加载外键关联实体，支持延时加载；
- 支持链式表达查询，更直观的查询语义，参考下面的介绍或sample中的例子. 
           
         
 (2) 注解模块：android中的ioc框架，完全注解方式就可以进行UI，资源和事件绑定；

- 新的事件绑定方式，使用混淆工具混淆后仍可正常工作；
- 目前支持常用的20种事件绑定，参见ViewCommonEventListener类和包com.lidroid.xutils.view.annotation.event。

(3) 网络模块：支持同步，异步方式的请求；

- 支持大文件上传，上传大文件不会oom；
- 支持GET，POST，PUT，MOVE，COPY，DELETE，HEAD，OPTIONS，TRACE，CONNECT请求；
- 下载支持301/302重定向，支持设置是否根据Content-Disposition重命名下载的文件；
- 返回文本内容的请求(默认只启用了GET请求)支持缓存，可设置默认过期时间和针对当前请求的过期时间。  
          
  (4) 图片缓存模块：加载bitmap的时候无需考虑bitmap加载过程中出现的oom和android容器快速滑动时候出现的图片错位等现象；

- 支持加载网络图片和本地图片；
- 内存管理使用lru算法，更好的管理bitmap内存；
- 可配置线程加载线程数量，缓存大小，缓存路径，加载显示动画等...

## 5、ThinkAndroid ##
项目地址：[https://github.com/white-cat/ThinkAndroid](https://github.com/white-cat/ThinkAndroid)

主要有以下模块：

- (1)  MVC模块：实现视图与模型的分离。
-   (2)  ioc模块：android中的ioc模块，完全注解方式就可以进行UI绑定、res中的资源的读取、以及对象的初始化。 
-   (3)  数据库模块：android中的orm框架，使用了线程池对sqlite进行操作。  
-   (4)  http模块：通过httpclient进行封装http数据请求，支持异步及同步方式加载。
-   (5)  缓存模块：通过简单的配置及设计可以很好的实现缓存，对缓存可以随意的配置
-   (6)  图片缓存模块：imageview加载图片的时候无需考虑图片加载过程中出现的oom和android容器快速滑动时候出现的图片错位等现象。
-   (7)  配置器模块：可以对简易的实现配对配置的操作，目前配置文件可以支持Preference、Properties对配置进行存取。
-   (8)  日志打印模块：可以较快的轻易的是实现日志打印，支持日志打印的扩展，目前支持对sdcard写入本地打印、以及控制台打印
-   (9)  下载器模块:可以简单的实现多线程下载、后台下载、断点续传、对下载进行控制、如开始、暂停、删除等等。
-   (10) 网络状态检测模块：当网络状态改变时，对其进行检

## 6、LoonAndroid  ##
项目地址：[https://github.com/gdpancheng/LoonAndroid](https://github.com/gdpancheng/LoonAndroid)

主要有以下模块：

 -  (1)  自动注入框架（只需要继承框架内的application既可）
-   (2)  图片加载框架（多重缓存，自动回收，最大限度保证内存的安全性）
-   (3)  网络请求模块（继承了基本上现在所有的http请求）
-   (4)  eventbus（集成一个开源的框架）
-   (5)  验证框架（集成开源框架）
-   (6)  json解析（支持解析成集合或者对象）
-   (7)  数据库（不知道是哪位写的 忘记了）
-   (8)  多线程断点下载（自动判断是否支持多线程，判断是否是重定向）
-   (9)  自动更新模块
-   (10) 一系列工具类

其中的 volley扩展性非常好，个人比较喜欢的风格。其他如 android-async-http、Afinal 也相当不错。 

## 7、AndroidAnnotations ##

项目地址：

[AndroidAnnotations首页](http://androidannotations.org/)

[github上的项目地址](https://github.com/excilys/androidannotations/wiki)

主要有以下特点：

- 使用依赖注入(DI)、控制反转(IOC)来简化开发过程
- 简化的线程模型（Simplified  threading model)  
- 事件绑定（Event binding）
- REST Client
- No Magic  
- 类似框架：[Bufferknife](http://jakewharton.github.io/butterknife/)


## 8、RoboGuice ##

项目地址：[https://github.com/roboguice/roboguice](https://github.com/roboguice/roboguice)

RoboGuice 使得进行Android开发更加方便，使得开发变得更加简单也更有乐趣。当你调用getIntent().getExtras()是不是经常检查是否为null？RoboGuice可以帮助你。想想调用findViewById()并映射到TextView确实有必要么？RoboGuice也可以帮你。

RoboGuice 可以帮助解决这类的判断工作。你再也不用记住，是通过调用bindService获取一个用户service，调用getSystemService获取一个系统service。注入你的view、service、或者其他对象，然后让RoboGuice来处理剩下的事宜。

RoboGuice 精简了你的应用代码。更少的代码意味着bug也会更少。也使得阅读代码更加容易，不在纠缠于Android平台的各种特性，而是关注于应用实际的业务逻辑。

没什么很难的，你所需要做的仅仅是配置RoboGuice。

##　9、Dagger ##

项目地址[https://github.com/square/dagger](https://github.com/square/dagger)

android的依赖注入框架（DI框架），感觉跟Spring 的IOC差不多吧。这个框架它的好处是它没有采用反射技术（Spring是用反射的）,而是用预编译技术，因为基于反射的DI非常地耗用资源（空间，时间）

## 10、Fresco　##

中文文档[http://fresco-cn.org/](http://fresco-cn.org/)
项目地址[https://github.com/facebook/fresco](https://github.com/facebook/fresco)

Fresco 是一个强大的图片加载组件。

Fresco 中设计有一个叫做 image pipeline 的模块。它负责从网络，从本地文件系统，本地资源加载图片。为了最大限度节省空间和CPU时间，它含有3级缓存设计（2级内存，1级文件）。

Fresco 中设计有一个叫做 Drawees 模块，方便地显示loading图，当图片不再显示在屏幕上时，及时地释放内存和空间占用。

特性：

* 内存管理
* 图片的渐进式呈现
* 支持加载Gif图，支持WebP格式

## 11、ActiveAndroid ##

项目地址：[https://github.com/pardom/ActiveAndroid](https://github.com/pardom/ActiveAndroid)

ActiveAndroid是一个活跃的记录风格的ORM（对象关系映射）库。ActiveAndroid可以让您保存和检索的SQLite数据库记录而没有写一个SQL语句。每个数据库记录被整齐包裹成一个model类,像保存方法（）和delete（）。

## 12、Android-Universal-Image-Loader ##

项目地址：[https://github.com/nostra13/Android-Universal-Image-Loader](https://github.com/nostra13/Android-Universal-Image-Loader)

Android-Universal-Image-Loader是一个开源的UI组件程序，该项目的目的是提供一个可重复使用的仪器为异步图像加载，缓存和显示。所以，如果你的程序里需要这个功能的话，那么不妨试试它。因为已经封装好了一些类和方法。我们 可以直接拿来用了。而不用重复去写了。其实，写一个这方面的程序还是比较麻烦的，要考虑多线程，缓存，内存溢出等很多方面。但是，你也可以参考这个例子来自己写出更好的程序。 

## 12、KJFrameForAndroid ##
项目地址：[https://github.com/kymjs/KJFrameForAndroid](https://github.com/kymjs/KJFrameForAndroid)  
一个强大的Android开发库，KJFrameForAndroid的设计思想是通过封装Android原生SDK中复杂的复杂操作而达到简化Android应用级开发，最终实现快速而又安全的开发APP。功能包含
* 数据库： javabean直接转换为sqlite表存储  
* Activity继承链：用最快捷的方法实现MVC分层  
* KJHttp：自带缓存功能的网络请求库，同时可选用HttpurlConnection(默认)或HttpClient实现
* KJBitmap：加载网络图片只需要一行代码，使用内存+磁盘双缓存，完美适配任何版本系统不会出现OOM。

## 13、CJFrameForAndroid ##  
项目地址：[https://github.com/kymjs/CJFrameForAndroid](https://github.com/kymjs/CJFrameForAndroid)  
一个完善的Android插件化开发框架的开源实现，只需要一行代码就可以启动一个存在于asset目录或sd卡上的没有安装的apk。  
对于插件apk没有任何的编码限制。
