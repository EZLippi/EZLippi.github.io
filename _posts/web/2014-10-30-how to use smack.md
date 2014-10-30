---
layout:     post
title:      Smack开发手册
keywords:   Smack, 消息推送, 服务器， 实时聊天
category:   web 
tags:		[android, 消息推送， server， client]
---

这篇文章翻译自Smack的官方文档，[http://www.igniterealtime.org/builds/smack/docs/latest/documentation/](http://www.igniterealtime.org/builds/smack/docs/latest/documentation/)，转载请注明出处。

Smack是一个为使用XMPP服务器聊天和发送即时消息交流而提供的库。
 
## Smack的主要优势： ##

1. 使用简单且拥有强大的API。向用户发送一条文本消息只需用一下三行代码即可完成
    
    
    XMPPConnection connection = new XMPPConnection("jabber.org");
    connection.login("mtucker", "password");
    connection.createChat("jsmith@jivesoftware.com").sendMessage("Howdy!;

           
2. 不像其它库那样，强制你在信息报级（packet level）编码。Smack提供智能的、更高级别的结构，例如：Chat和GroupChat类，这写能让你的程序效率更高。
- 你不需要熟悉XMPP  XML格式，甚至不熟XML。

1. 提供简单的机器到机器的通讯。Smack允许你对每一条消息设置任何数字的属性，包括Java对象的属性。

1.  Apache许可的开放源码，你可将其用于商业的和非商业的应用。
 
## 关于XMPP ##
XMPP (eXtensible Messaging and Presence Protocol)是一个开放的，
 
如何使用本文档
本文档假定你已经熟悉XMPP即时消息的主要特征。我们推荐你在阅读该文档时打开Javadoc API作为参考。
 
**开始Smack**

本文档将向你介绍Smack API，并大概介绍几个重要的类和概念。
必备的条件
你只需要有JDK 1.2或之后的版本1和已经内嵌在smack..jar文件中的XML分析器，不需要第三部分库。
1JDK 1.2 and 1.3的用户若想使用SSL连接必须在他的类路径下有JSSE库。

**建立一个连接**

XMPPConnection类是为XMPP服务器建立连接的类。若要创建SSL连接，需使用SSLXMPPConnection类，以下是创建连接的例子。
     
    // Create a connection to the jabber.org server.
    XMPPConnection conn1 = new XMPPConnection("jabber.org");
     
    // Create a connection to the jabber.org server on a specific port.
    XMPPConnection conn2 = new XMPPConnection("jabber.org", 5222);
     
    // Create an SSL connection to jabber.org.
    XMPPConnection connection = new SSLXMPPConnection("jabber.org");

如果创建了一个连接，你应该使用`XMPPConnection.login(String username, String password)`方法（参数为用户名和密码）进行登陆。一旦登陆成功，你就可以通过创建一个新的Chat 或GroupChat对象与其它用户聊天。
 

----------

## 使用花名册（Working with the Roster） ##
           
- 花名册让你很清楚的知道其它可用的用户。用户可以被分成像“朋友”、“合作者”这样的组，从而知道其它的用户在线还是离线。
      
-  可以使用XMPPConnection.getRoster()方法检索花名册。你可以用花名册（roster）类查找花名册的所有条目，它们所属的组以及每个条目当前呈现的状态。
 
**读、写信息包（Reading and Writing Packets）**
      
-  从客户端发送到XMPP的每一条消息称为一个信息包，并作为XML发送。The org.jivesoftware.smack.packet包含封装了三个XMPP允许的、不同的基本包类型(message, presence, and IQ)的类。像Chat和GroupChat这样的类提供更高级别的结构，它可以自动的创建和发送信息包，当然你也可以直接创建和发送信息包。以下代码是一个将你的当前状态改为“隐身“，从而不被别人看到的例子：
 
    // Create a new presence. Pass in false to indicate we're unavailable.
    Presence presence = new Presence(Presence.Type.UNAVAILABLE);
    presence.setStatus("Gone fishing");
    // Send the packet (assume we have a XMPPConnection instance called "con").
    con.sendPacket(presence);


Smack提供以下两种方法阅读收到的信息包：PacketListener和PacketCollector。它们都使用PacketFilter的实例来决定应该处理哪个信息包。信息包监听器（packet listener）用于事件类型的设计，而信息包收集器（packet collector）有一个信息包的结果队列，你可以对其实施polling和blocking操作。所以，信息包监听器在你收到任何一个信息包，且你想对其进行操作时是有用的，而信息包收集器在你想等待某个特殊的信息包时是有用的。信息包收集器和监听器可以通过XMPPConnection的实例来创建。
 

----------

# Messaging Basics #
## Messaging using Chat and GroupChat ##
互相发送消息是即时通讯的核心，以下是两个在收发消息是用的类：

1. org.jivesoftware.smack.Chat – 用于两个人之间发送消息
1. org.jivesoftware.smack.GroupChat –用于加入聊天室，很多人之间相互发送消息。

Chat和GroupChat类都用org.jivesoftware.smack.packet .Message信息包类发送消息。在某些情况下，也许你希望绕过更高级别的Chat和GroupChat类直接发送和接受消息。
聊天（Chat）
聊天时在两个用户间创建了一个新的线程（使用一个线程ID）。以下程序片示例了如何如何与一个用户进行开始聊天并发送一段文本消息：
 
    // Assume we've created an XMPPConnection name "connection".
    Chat newChat = connection.createChat("jsmith@jivesoftware.com");
    newChat.sendMessage("Howdy!");
 
Chat.sendMessage(String)方法可以很方便的创建一个消息对象，方法体使用字符串类型的参数，然后发送消息。如果想在发送消息前对消息设置额外的只，可以使用Chat.createMessage() and Chat.sendMessage(Message)方法，如下例所示：

    // Assume we've created an XMPPConnection name "connection".
    Chat newChat = connection.createChat("jsmith@jivesoftware.com");
    Message newMessage = newChat.createMessage();
    newMessage.setBody("Howdy!");
    message.setProperty("favoriteColor", "red");
    newChat.sendMessage(newMessage);
 

使用Chat对象可以轻松的收听其它聊天者的回复。以下程序片是parrot-bot，它映射会其它用户类型的所有事情：
    
    // Assume we've created an XMPPConnection name "connection".
    Chat newChat = connection.createChat("jsmith@jivesoftware.com");
    newMessage.setBody("Hi, I'm an annoying parrot-bot! Type something back to me.");
    while (true) {
    // Wait for the next message the user types to us.
    Message message = newChat.nextMessage();
    // Send back the same text the other user sent us.
    newChat.sendMessage(message.getBody());
    }

 
以上代码使用Chat.nextMessage()方法获得下一条消息，它必需一直等待直到收到下一条消息。也有其它的方法可以等待特定的时间来接受下一条消息，或者你也可以增加一个监听器，它可以在每次收到消息时通知你。

**群聊（GroupChat）**

群聊在通过一个服务器连接到聊天室，你可以向一组人发送消息或接收他们的消息。在你能接收和发送消息前，你必须使用一个昵称登陆到聊天室。以下程序段可以连接到一个聊天室并发送消息：
 
    // Assume we've created an XMPPConnection name "connection".
    GroupChat newGroupChat = connection.createGroupChat("test@jivesoftware.com");
    // Join the group chat using the nickname "jsmith".
    newGroupChat.join("jsmith");
    // Send a message to all the other people in the chat room.
    newGroupChat.sendMessage("Howdy!");

 
群聊时收发消息和私聊时工作原理大体一致。同样，也有方法可以获得聊天室里其它用户的列表。

----------

## Roster and  Presence ##
花名册让你很清楚的知道其它可用的用户。用户可以被分成像“朋友”、“合作者”这样的组。其它的即使通讯系统将花名册作为好友列表、联系列表等。

       **当你成功登陆服务器后，可以使用XMPPConnection.getRoster()获得Roster类的实例。**
      
**花名册条目（Roster Entries）**

花名册里的每一个用户都以一条花名册条目的形式呈现，包括以下几部分：

1. 一个XMPP地址(例如：jsmith@example.com).
1. 分配给你的用户名 (例如： "Joe").
该条目在花名册中所属组的列表。如果该条目不属于任何一个组，将被称为“尚未分类的条目。
以下程序段可以打印出花名册中的所有条目：
 
    Roster roster = con.getRoster();
    for (Iterator i=roster.getEntries(); i.hasNext(); ) {
    System.out.println(i.next());
    }
 
也有获得个人条目、尚未分类条目的列表、一个或者所有组的方法。

**呈现（Presence）**

花名册中的每一个条目都有相关的呈现方式。Roster.getPresence(String user)方法将通过用户的状态或当用户不在线或不同意将其在线状态显示出来时使用空对象（null）返回一个Presence对象。

注意：一般情况下，用户是否同意显示其状态依赖于用户所在的花名册，但这不是在所有情况下都成立的。

用户也有一个在线或离线的状态，如果用户在线，他们的显示信息中将会有一些扩展的信息，例如他当前正在做什么，是否希望被打扰等等，详细内容可以参看Presence类。
 
**Listening for Roster and Presence Changes**

Roster类的典型用途是用树状形式显示组和每一个条目以及它的当前状态。如下图所示是 Exodus XMPP客户端的花名册。
 
显示的信息很可能会经常改变，也有可能是花名册的条目被改变甚至被删除。为了监视花名册的改变和显示的信息，应该使用一个花名册监听器（RosterListener）。以下代码使用Roster（它可以打印出花名册中的任何变化）注册了一个RosterListener。标准的客户端应该使用相似的代码更新花名册的用户信息（roster UI）以正确显示变化的信息。
 

    final Roster roster = con.getRoster();
    roster.addRosterListener(new RosterListener() {
    public void rosterModified() {
    // Ignore event for this example.
    }
     
    public void presenceChanged(String user) {
    // If the presence is unavailable then "null" will be printed,
    // which is fine for this example.
    System.out.println("Presence changed: " + roster.getPresence(user));
    }
    });
 
 
**向花名册中添加条目（Adding Entries to the Roster）**

花名册和显示使用基于许可的模型，这要求用户在加入别人的花名册前必须得到允许。这样，确保只有被允许的人才可以看到自己所显示的信息，从而保护了用户的隐私。因此，在你想添加一个新的条目，且对方没有接受你的请求前，该条目将处于等待状态。

如果另一个用户请求同意显示，从而你他们可以将你加入他们的花名册，你必须接受或拒绝请求。Smack通过以下三种方式之一操作同意显示请求：

1. 自动接受所有的同意显示请求。
1. 自动拒绝所有的同意显示请求。
1. 手动处理同意显示请求。

可以使用Roster.setSubscriptionMode(int subscriptionMode)方法设置模式。简单的客户通常使用一个自动接受或拒绝同意显示请求的模式，而用更多特征的用户应该使用手动处理同意显示请求的模式，并让终端用户接受或拒绝每一个请求。如果使用手动模式，应该声明一个信息包监听器（PacketListener）来监听有Presence.Type.SUBSCRIBE类型的显示信息包。

**处理收到的信息包(Processing Incoming Packets)**
Smack提供一个使用以下两个结构的灵活框架来处理收到的信息包：

org.jivesoftware.smack.PacketCollector – 一个允许你同步的等待新的信息包的类

org.jivesoftware.smack.PacketListener – 一个异步的通知你收到信息包的接口

信息包监听器（packet listener）用于事件类型的设计，而信息包收集器（packet collector）有一个信息包的结果队列，你可以对其实施polling和blocking操作。所以，信息包监听器在你收到任何一个信息包，且你想对其进行操作时是有用的，而信息包收集器在你想等待某个特殊的信息包时是有用的。信息包收集器和监听器可以通过
XMPPConnection的实例来创建。

由org.jivesoftware.smack.filter.PacketFilter接口来决定哪个特殊的信息包将被转交给信息包收集器（PacketCollector）或信息包监听器（PacketListener）。可以在org.jivesoftware.smack.filter包中找到许多预先定义的过滤器。
以下代码阐释了如何注册一个信息包收集器（packet collector）和信息包监听器（packet listener）：
 
    // Create a packet filter to listen for new messages from a particular
    // user. We use an AndFilter to combine two other filters.
    PacketFilter filter = new AndFilter(new PacketTypeFilter(Message.class),
    new FromContainsFilter("mary@jivesoftware.com"));
    // Assume we've created an XMPPConnection name "connection".
     
    // First, register a packet collector using the filter we created.
    PacketCollector myCollector = connection.createPacketCollector(filter);
    // Normally, you'd do something with the collector, like wait for new packets.
     
    // Next, create a packet listener. We use an anonymous inner class for brevity.
    PacketListener myListener = new PacketListener() {
    public void processPacket(Packet packet) {
    // Do something with the incoming packet here.
    }
    };
    // Register the listener.
    connection.addPacketListener(myListener, filter);
 
 
**标准信息包过滤器（Standard Packet Filters）**

Smack包含一套丰富的信息包过滤器，你也可以通过信息包过滤器接口（PacketFilter interface）编写程序来创建自己的过滤器。缺省的过滤器集包括：

- PacketTypeFilter – 某个特殊的类类型的信息包过滤器
- PacketIDFilter – 拥有特殊的信息包ID（packet ID）的过滤器
- ThreadFilter – 拥有特殊线程ID（thread ID）的信息包的过滤器
- ToContainsFilter –发送到某个特殊地址的信息包的过滤器
- FromContainsFilter --发送到某个特殊地址的信息包的过滤器  
- PacketExtensionFilter – 拥有特殊的信息包扩展的信息包的过滤器
- AndFilter –对两个过滤器实施逻辑与操作的过滤器
- OrFilter --对两个过滤器实施逻辑或操作的过滤器
- NotFilter --对一个过滤器实施逻辑非操作的过滤器

Provider Architecture: Packet Extensions and Custom IQ's
Smack提供的体系是堵塞自定义的XML信息包扩展和IQ包分析器的系统（The Smack provider architecture is a system for plugging in custom XML parsing of packet extensions and IQ packets）。标准的Smack扩展（Smack Extensions）是使用提供者的体系结构搭建的。存在以下两种类型的提供者：

- IQProvider –将IQ请求（ IQ requests）解析成Java对象（Java objects）

- PacketExtension – 将附属在信息包上的XML子文档解析成信息包扩展实例（PacketExtension instances）

**IQProvider**

默认情况下，Smack致知道如何处理只有类似以下几个名字空间的子信息包的IQ信息包（IQ packets）：

- jabber:iq:auth
- jabber:iq:roster
- jabber:iq:register

因为许多IQ类型是XMPP及其扩展部分的一部分，所以提供一个可插入的IQ分析机制。IQ Providers被程序自动的注册或通过创建在你的JAR 文件的META-INF目录下创建一个mack.providers文件。该文件是一个包含一个或多个iqProvider条目（iqProvider entries）的XML文档，如下例所示：
 
    <?xml version="1.0"?>
    <smackProviders>
     <iqProvider>
     <elementName>query</elementName>
     <namespace>jabber:iq:time</namespace>
     <className>org.jivesoftware.smack.packet.Time</className>
     </iqProvider>
    </smackProviders>

 
每一个IQ provider都和一个元素名（element name）和名字空间（ namespace）相联系。在上面的例子中，元素名是query，名字空间是abber:iq:time。如果有多重提供者条目（multiple provider entries）尝试注册并控制相同的名字空间，那么从类路径（classpath）载入的第一个条目将有优先权。

IQ provider类可以实现IQProvide接口，或者继承IQ类。在前面的例子中，每一个IQProvider负责解析原始的XML流从而创建一个IQ实例。在下面的例子中，bean introspection将被用于尝试自动使用在IQ packet XML中发现的值设置IQ实例的属性。一个XMPP时间信息包如下所示：
    <iq type='result' to='joe@example.com' from='mary@example.com' id='time_1'>
    <query xmlns='jabber:iq:time'>
    <utc>20020910T17:58:35</utc>
    <tz>MDT</tz>
    <display>Tue Sep 10 12:58:35 2002</display>
    </query>
    </iq>
 

为了让这个信息包自动的映射成上面的providers file中所列的时间对象（Time object），它必须有以下几个方法：setUtc(String), setTz(String), 和 setDisplay(String)。自动检查（introspection）的服务将试着自动的将字符串值转化成a boolean, int, long, float, double,或 Class 类型。转化成何种类型由IQ实例的需要来决定。

**PacketExtensionProvider**

信息包插件提供者（Packet extension providers）为信息包提供一个可插入的系统，这些信息包是一个IQ, message和presence packets的自定义名字空间的子元素。每一个插件提供者（extension provider）使用一个元素名（element name）和名字空间（namespace）在smack.providers文件中注册，如下例所示：

    <?xml version="1.0"?>
    <smackProviders>
    <extensionProvider>
    <elementName>x</elementName>
    <namespace>jabber:iq:event</namespace>
    <className>org.jivesoftware.smack.packet.MessageEvent</className>
    </extensionProvider>
    </smackProviders>
 

如果有多重提供者条目（multiple provider entries）尝试注册并控制相同的名字空间，那么从类路径（classpath）载入的第一个条目将有优先权。

一旦在一个信息包中发现信息包插件，解析器将传递到正确的提供者。每一个提供者可以实现PacketExtensionProvider接口或者是一个标准的Java Bean。在前面的例子中，每一个插件提供者（extension provider）负责解析原始的XML流去构造一个实例。在下面的例子中，bean introspection将被用于尝试自动使用在信息包插件子元素（packet extension sub-element）中的值设置类的属性。

当一个插件提供者（extension provider）没有用元素名（element name）和名字空间（namespace）对注册是，Smack将存储所有在缺省信息包插件（DefaultPacketExtension）对象中的最高级别元素（top-level elements），并匹配到信息包上。
 
**信息包属性（Packet Properties）**

Smack提供简单的机制来将任意的属性附加到信息包上。每一个属性有个字符串类型的名字和一个值，这个值或者是Java原始数据类型（int, long, float, double, boolean）的，或者是任何可序列化的对象（Serializable object）（当一个java对象实现了Serializable接口时，它就是可序列化的）。

**使用API（Using the API）**

所有主要对象都有属性支持，例如消息对象（Message objects）。以下代码阐释了如何设置属性：
 
    Message message = chat.createMessage();
    // Add a Color object as a property.
    message.setProperty("favoriteColor", new Color(0, 0, 255));
    // Add an int as a property.
    message.setProperty("favoriteNumber", 4);
    chat.sendMessage(message);
 
获得这些相同的属性要用到以下的代码：
 
    Message message = chat.nextMessage();
    // Get a Color object property.
    Color favoriteColor = (Color)message.getProperty("favoriteColor");
    // Get an int property. Note that properties are always returned as
    // Objects, so we must cast the value to an Integer, then convert
    // it to an int.
    int favoriteNumber = ((Integer)message.getProperty("favoriteNumber")).intValue();
 
**将对象作为属性（Objects as Properties）**

将对象作为属性值是改变数据的一个非常有力和简单的方法。但是，你应该记住以下几点：


- 信息包插件（Packet extensions）是向XMPP增加额外数据的更权威的方式。使用属性在某种情况下也许会比较方便，但是，Smack将会控制XML。
- 当你将Java对象（Java object）作为属性发送时，只有在客户机运行的Java能够解释数据。所以，可以考虑使用一系列的原始值来传递数据。
- 作为属性值发送的对象必须实现序列化接口（Serialiable）。
- 除此之外，发送者和接受者都必须由相同版本的类，否则在反序列化（de-serializing the object）对象时将发生序列化异常。
- 序列化的对象将会非常大，将会占用很多的服务器资源和带宽。

 
**XML格式（XML Format）**

当前的用于发送属性的XML格式不是标准的，所以可能不会得到使用Smack的客户的认可。XML如下所示（为了更清晰添加了注释）：
 
    <!-- All properties are in a x block. -->
    <properties xmlns="http://www.jivesoftware.com/xmlns/xmpp/properties">
    <!-- First, a property named "prop1" that's an integer. -->
    <property>
    <name>prop1</name>
    <value type="integer">123</value>
    <property>
    <!-- Next, a Java object that's been serialized and then converted
     from binary data to base-64 encoded text. --> 
    <property>
    <name>blah2</name>
    <value type="java-object">adf612fna9nab</value>
    <property>
    </properties>

 
当前支持的数据类型有：integer, long, float, double, boolean, string, 和java-object。
 
**使用Smack调试（Debugging with Smack）**

Smack包含两个内置的调试控制台，他们允许你在服务器和客户机建跟踪XML的踪迹。简单的调试器（lite debugger）是smack.jar的一部分，加强的调试器（enhanced debugger）包含在（smackx-debug.jar）中。

可以用两种不同的方法激活调试模式：

1．在创建连接前加入以下一行代码：

    XMPPConnection.DEBUG_ENABLED = true;

2．将Java的系统属性smack.debugEnabled设置为true。这一系统属性可通过下一命令行设置：

    java -Dsmack.debugEnabled=true SomeApp
在你的应用程序中，如果你想明确的禁用调试模式，包括使用命令行参数，则在打开新的连接前在你的应用程序中添加以下一行代码：

    XMPPConnection.DEBUG_ENABLED = false;

Smack使用一下的逻辑来决定使用哪个调制控制台：

1.       它将首先尝试使用Java系统属性smack.debuggerClass 所指定的调试类（debugger class）。如果你需要开发自己的调试器 I，可以实现SmackDebugger 接口然后使用下面的命令行设置系统属性：

    java -Dsmack.debuggerClass=my.company.com.MyDebugger SomeApp

2.       如果第一步失败了，Smack就会尝试使用增强的调试器（enhanced debugger）。 文件 smackx-debug.jar 包含，因此你要把jar文件放到类路径（classpath）下。如果空间确定你只是想要配置smack.jar文件，这种情况下增强的调试器（enhanced debugger）将不可用。

3.      最后一种是前面两种都失败后使用简单的调试器（ite debugger）。在你的内存很小的时候，简单的调试器（ite debugger）是一个很好的选择。


**增强的调试器（enhanced debugger）**

当调试模式可用时，将出现一个包含每一个创建的连接的标签调试窗口，该窗口包含以下信息：

- 连接标签（Connection tabs） -每一个标签显示连接相关的调试信息
- Smack信息标签（Smack info tab） -显示关于Smack的信息 (例如： Smack的版本（Smack version）, 安装的组件（installed components）,等等)。
- 连接标签包含以下信息:
- 所有的信息包（All Packets） -显示由Smack解析的发送和收到的信息包的信息。
- 未经处理的发送信息包（Raw Sent Packets） -未经处理的XML traffic（raw XML traffic）由Smack生成并发送至服务器 。
- 未经处理的接收信息包（Raw Received Packets） --未经处理的XML traffic（raw XML traffic）由服务器发送给客户机。
- Ad-hoc 消息（Ad-hoc message） -允许发送各种类型的ad-hoc信息包（ad-hoc packets）。


**信息—显示连接状态和统计信息。**

简单的调试器（Lite Debugger ）
当调试模式可用时，每创建一个连接将出现调试窗口，该窗口包含以下信息：

客户端的流量（Client Traffic） (红色的文本) --未经处理的XML traffic（raw XML traffic）由Smack生成并发送至服务器 。

服务器端的流量（Server Traffic）(蓝色的文本) --未经处理的XML traffic（raw XML traffic）由服务器发送给客户机。

解释的信息包（Interpreted Packets）(绿色的文本) – 显示来自服务器的由Smack解析的XML信息包（XML packets）
