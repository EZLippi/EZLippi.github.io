---
layout:     post
title:      XMPP协议分析-具体分析
keywords:   XMPP, Jabber
category:   web 
tags:		[xmpp, jabber, openfire]
---

通过WireShark抓包来具体分析XMPP协议，下面用人人桌面版演示了，XMPP客户端从登录到获取新鲜事的过程，通过分析具体的数据包能够更容易的理解协议。

**Step1.TCP三次握手建立连接**
![](/images/images/openfire/xmpp2.jpeg)
图1.xmpp客户端使用5222端口，设置SYN请求连接

![](/images/images/openfire/xmpp3.jpeg)
图2.服务器返回ACK，确认请求，同样设置SYN请求连接

![](/images/images/openfire/xmpp4.jpeg)
图3.客户端确认服务器连接请求，连接建立完毕。

**Step2.客户端请求，服务器响应。**

![](/images/images/openfire/xmpp5.jpeg)
图4.客户端发送Jabber/x Request请求，

**客户端初始化流给服务器**

![](/images/images/openfire/xmpp6.jpeg)
图5.服务器返回Jabber/x Response，服务器发送一个流标签给客户端作为应答

![](/images/images/openfire/xmpp7.jpeg)
图5.5服务器发送 STARTTLS 范围给客户端（包括验证机制和任何其他流特性）

![](/images/images/openfire/xmpp8.jpeg)
图6.客户端发送请求，发送，请求使用传输层加密协议[TLS]

![](/images/images/openfire/xmpp9.jpeg)
图7.服务器端响应，返回元素，确认传输加密

![](/images/images/openfire/xmpp10.jpeg)
图8.之后的请求，数据均已经加密

![](/images/images/openfire/xmpp11.jpeg)
图9.之后的响应，返回数据也是加密的

这次抓包分析，可以看到，xml文档的安全性有了一定的保障，加密过的数据无法看到。