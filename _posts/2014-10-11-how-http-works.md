---
layout: post
title:  当我们打开网页时发生了什么
keywords: HTTP
categories : [web]
tags : [http,dns,web]
---
简单地来说，当我们在浏览器上输入URL的敲下回车的时候。

 

 1. 浏览器需要查找域名[domain]的IP，从不同的缓存直至DNS服 务器。
 2. 浏览器会给web服务器发送一个HTTP请求
 3. 服务器“处理”请求
 4. 服务器发回一个HTTP响应
 5. 浏览器渲染HTML到页面。
 比如我们从[http://www.joes-hardware.com:80/power-tools.html](http://www.joes-hardware.com:80/power-tools.html)获取资源的时候，整个过程如下图所示：
 ![](/images/images/http/1.jpeg)
	开始时我们输入的是URI(统一资源标识符,Uniform Resource Identifier)，我们用的比较多的是URI的一个子集叫统一资源定位符(URL,Uniform Resource Locator)。
	
URL组成
-----
  网址算是URL的一个俗称，让我们来看看一个URL的组成，以HTTP版IOT中的URL为例。
大多数URL都建立在这个通用格式

    <scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frgs>

各个部分的介绍如下表：
![](/images/images/http/0.jpeg)
以一个实际例子来说：
当我们在浏览器中输入[http://b.phodal.com/athome/1](http://b.phodal.com/athome/1)按下回车

开始之前，我们需要标出URL的80端口以及json文件的全称，那么上面的网址就会变成

[http://b.phodal.com:80/athome/1.json](http://b.phodal.com:80/athome/1.json)

那么对于这个URL的就有下面几部分组成

 - **http:**// http说的是这个URL用的是HTTP协议，至于//是一个分隔符，用法和C语言中的;一样。这样的协议还可以是coap,https,ftp等等。
 - **b** 是子域名，一个域名在允许的情况下可以有不限数量的子域名。
 - **phodal.com** 代表了一个URL是phodal.com下面的域名
 -  - **80** 80是指80端口，http默认的都是80，对于一个不是80端
   口的URL应该是这样的http://iot-coap.phodal.com:8896/
 - **athome** 指的是虚拟目录部分，或者文件路径
 - **1.json**看上去就是一个文件名，然而也代表着这是一个资源。

对就一个稍微复杂点的例子就是
[http://designiot.phodal.com/#你所没有深入的http](http://designiot.phodal.com/#%E4%BD%A0%E6%89%80%E6%B2%A1%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84http)


这里的#后面是片段部分（frag），如果你打开这个URL就会发现会直接跳转到相应的片段，对就于下面这样的一个例子来说

[http://www.phodal.com/search;sales=false/?q=iot&type=blog](http://www.phodal.com/search;sales=false/?q=iot&type=blog)
**;**后面是**参数部分**，以便正确的与服务器进行交互
**?**后面的q=iot&type=blog的部分是**查询字符串**，通常用于查询或者、搜索。

HTTP报文
------

http客户端向http服务器发送请求报文，请求报文格式如下：
请求行
首部
空行
主体部分

    <method><request-URL><version>
    <headers>
    
    <entity-body>

响应报文的格式如下：
响应行
首部
空行
主体

    <version><status><reason-phase>
    <headers>
    
    <entity-body>

 - 方法method，常见的有get和post，是客户端希望服务器对资源执行的动作
 - 请求URL。所请求资源的完整URL或者相对路径
 - 版本version，报文使用的http版本，比如HTTP1.1
 - 首部header，向请求报文和响应报文添加了一些信息，本质上都是一些名/值对的列表。
 - 状态码（status）描述请求过程发生的情况，比如200，表示OK
 - 原因短语(reason-phase),数字状态码的可读版本
 - 实体的主体部分(entity-body)
 一个可能的请求报文图下：

     GET /java/2014/08/02/java-multithread.html HTTP1.1
     Accept:text/html
     Host: www.lippiouyangonline.info

 可能的响应报文如下：

     HTTP/1.1 200 OK
     content-type: text/plain
     content-length: 19
     
     Hi,I'm a message!
下面是一个POST方法示例：
   ![](/images/images/http/2.jpeg)

连接管理
----
几乎所有的HTTP通信都是由TCP/IP承载的，HTTP要传送一个报文，会以流的形式将报文数据内容通过一条打开的TCP连接按序传输。TCP收到数据流后会将数据流切成小段的数据块，并将段封装在IP分组中，通道因特网进行传输，每个IP分组包括：

     1. 一个IP分组首部(通常为20字节)
     2. 一个TCP段首部(通常为20字节)
     3. 一个TCP数据块(0个或者多个字节)
     

IP首部包括源和目的的的IP地址，长度和其他一些标记，TCP首部包括TCP端口号和控制标记。 端口号和电话分机很类似，就像公司的总机号码能将你接到前台，分机号码帮你找到正确的联系人。IP地址可能将你链接的正确的计算机，端口号将你连接到正确的应用程序上去，端口号就是一个数字，HTTP的默认端口号为80。
TCP连接是通过4个值来识别的：
`<源IP地址、源端口号、目地IP地址、目地端口号>`这4个值唯一定义了一条TCP连接。
 一个TCP分组如下：
  ![](/images/images/http/3.jpeg)
一个典型的TCP客户端和服务器的通信过程如下：
 ![](/images/images/http/4.jpeg)
 
待续...
参考书目：HTTP权威指南