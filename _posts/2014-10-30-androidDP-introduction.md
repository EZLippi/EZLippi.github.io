---
layout:     post
title:      AndroidPN消息推送
keywords:   Smack, 消息推送, 服务器， 实时聊天
category:   web 
tags:		[android, 消息推送， server， client]
---

Androidpn是韩国Sehwan No写的开源消息推送项目，很多大公司都用这个消息推送方式构建自己的消息推送服务，缺点是导致客户端比较耗电。通信机制分别由客户端和服务器完成。

客户端采用基于java的XMPP协议包asmack（该包依赖于openfire下的开源项目smack）。通过该协议包提供的XMPPConnetcion类与服务器建立持久连接，并通过该连接进行用户注册和登录认证，以及接受服务器消息。

   服务器是基于开源的openfire工程，采用java语言实现和Spring框架提供Web服务。主要有两个部分，一个是侦听在5222端口上的XMPP服务，负责与客户端的XMPPConnection类进行通信，作用是用户注册和身份认证，并推送消息。另外是Web服务器，采用一个轻量级的HTTP服务器，负责接收用户的Web请求。

   整个基于XMPP的通信中，服务器端和客户端的通信是基于一个session（会话）过程，会话开始，首先客户端会指定端口号，然后把准备的连接信息发送到服务器端，客户端通过XMPP协议做的只有接收消息，其他的管理连接和保存消息等都由服务器负责。消息的传递是以根节点<stream>为起始，以</stream>为结束。

   服务器和客户端建立Tcp连接过程如下。首先，建立会话协商，Client 准备connecting to server (127.0.0.1:5222)。其次，服务器询问Client所支持的安全认证。再者，Client发送给服务器要注册的用户。然后，Client根据服务器的要求提交用户信息。最后，Client关闭注册的STREAM元素。

----------

# 客户端 #
Client这边包含有消息的收发，解析以及持久连接的发起，重连等功能呢，十分强大，我们开发时完全不用管底层的连接，也不用担心断线，可以专注于业务部分的开发。

## 控制器 ##
XmppManager是Client的主控制器，主要用来管理连接信息，包括XMPP端口、IP地址、登录的用户名和密码，以及对连接的维护。

## 消息解析处理 ##
NotificationIQ、NotificationPackerListener以及NotificationIQProvider三个类负责对收到的Notification格式的消息进行解析和处理。

## 手机状态监听 ##
PersistentConnetcionListener、PhoneStateChangeListener以及ReconnectionThread三个类负责监听手机状态和断线重连。

同时，代码结构也很简单。去除android的Service和BroadCast类以及一些工具类和常量类不谈：

1.NotificationIQ,NotificationIQProvider,NotificationPacketListener三个类负责对收到的Notification格式的消息进行解析和处理，

2.XmppManager是主控制器，NotificationService通过这个类，在后台维护androidpn连接。

3.PersistentConnectionListener，PhoneStateChangeListener，ReconnectionThread.java三个类则负责监听手机的状态并进行断线重连。

我们自定义消息时需要定义3个类：在NotificationIQ中定义消息的实体，在NotificationIQProvider中将消息转化为NotificationIQ实体，在NotificationPacketListener中对实体进行处理，具体的实现可参考NotificationIQ,NotificationIQProvider,NotificationPacketListener三个类。在定义这些类之后，还需要在XmppManager中将这3个类中注册到connection中，代码如下：

    connection.connect();
    Log.i(LOGTAG, "XMPP connected successfully");
    // packet provider
    ProviderManager.getInstance().addIQProvider("message",
    Constants.NOTIFICATION_NAMESPACE,
    new NotificationIQProvider());
    //packet filter
    PacketFilter packetFilter = new PacketTypeFilter(
    NotificationIQ.class);
    // packet listener
    PacketListener packetListener = xmppManager.getNotificationPacketListener();
    connection.addPacketListener(packetListener, packetFilter);

需要注意的是，注册NotificationIQProvider时，传入的namespace需要和服务端组装消息时使用的namespace一致，才能正确的收到。
## 注册 ##

Client在与服务器建立connection后，首先会提交注册任务，在Androidpn项目中，用户注册是采用UUID（通用唯一标识码）来实现的，其每次登录都会利用这个UUID.randomUUID()来产生一个用户名和密码，而且不会重复。

注册方法根据Server的格式要求组装注册消息，发送到服务器，同时使用在connection中添加监听，来获取服务器返回的消息packet。Client会根据消息的类型来判断是否注册成功。

服务端收到Client的注册请求，会通过路由类router来转发到相应的Handler处理，router首先会读取Client发来包Packet的Namespace部分，根据XMPP RFC协议注册packet的namespace为jabber:iq:register，授权packet的namespace为jabber:iq:auth，由此转发到IQRegisterHandler处理注册请求。

如果注册成功，Client会把相应的用户名、密码通过SharePerence保存在Client的共享文件AndroidpnClient中。此外，AndroidpnClient还保存了当前应用的包名、类名、服务器地址、端口、客户端版本、设备ID等。

## 登录 ##

Client的登录是在注册之后进行的，在Client的XmppManager类中，建立连接的时候首先会提交登录任务，然而在提交登录任务的时候都有一个submitRegisterTask()方法，可知，每次登录都会首先提交一个注册任务。

登录的时候，要先通过isAuthenticated()方法判断是否授权，授权处理同样会通过connection发送到服务端，服务端会根据packet的namespace部分进行解析，然后路由类router会根据namespace转发到IQAuthHandler处理。

Client收到服务端返回的消息packet，会使用connection的监听器异步接收消息，并通过XmppManager的context的sendBroadcast(Intentintent)以广播发送出去。

基于tomcat的项目源码[http://pan.baidu.com/s/1kTDUQWJ](http://pan.baidu.com/s/1kTDUQWJ)

----------

# 服务器 #

服务端架构依赖spring、mina框架，spring完成java Ben管理，mina完成网络通信。另外，服务端还通过jetty潜入了Admin Console Web界面功能。对于spring的依赖导致要把androidpn-server整合潜入项目中时，要考虑和自己项目本身spring环境的整合问题，可能要改造androidpn-server源代码，具体要看项目中spring的环境。对于mina的依赖不存在这个问题，因为mina是类库型框架，而spring是容器型框架。androidpn-server对jetty的使用不是可选的，而是和jetty绑定的，所以要不使用jetty就必须对androidpn-server的源代码进行改造。

另外，对数据的存储使用hibernate框架，androidpn-server在使用hibernate时配置通过ehcache实现二级缓存。官方默认使用的数据库是HSQLDB数据库，你可以改用其他数据库。HSQLDB是用java语言实现的数据库，对其使用请自己学习。Androidpn-server通过In-Process模式（作为应用程序的一部分潜入应用程序）使用HSQLDB的。


  服务器主要由以下几个包组成：

  
- org.androidpn.server.xmpp异常类型定义，包含程序入口类XmppServer。

-   org.androidpn.server.util加载配置文件，获取主机和端口等信息。

-   org.androidpn.server.xmpp.codec是XMPP协议的XML文件解析包，server  


收到和发送的消息都要通过这个包来进行xmpp协议编码和解码。

-   org.androidpn.server.xmpp.handler负责对不同类型的消息进行处理

-   org.androidpn.server.xmpp.net负责维护与client之间的持久连接，并实现了一些传输方式供发送xmpp消息时使用。

-   org.androidpn.server.xmpp.ssl是对连接进行ssl认证的工具包。

-   org.androidpn.server.xmpp.router包负责将收到的信息包发送到相应的handler进行处理，是一个路由包。

-   org.androidpn.server.xmpp.presence里面只包含PresenceManager类，用来维护client的在线状态。

-   org.androidpn.server.xmpp.push包里面的NotificationManager类包含有向client发送消息的接口。

    **服务器中使用ServerStarter类启动服务，服务启动后使用XmppServer来管理连接、加载配置等。**

服务器接收处理消息流程

① connection接收到来着Client的packet，使用包codec解码。

② 路由包router根据packet的namespace等信息，将packet路由到相应的Handler。

③ Handler开始处理。

开发中只要根据client发送消息的格式，定义自己的router和handler类，然后在PacketRouter中注册router，在IQRouter中注册handler即可。

**服务器发送消息的流程**

① 使用NotificationManager接口的push方法。

② 使用SessionManager在Session集合查找相应的client连接。

③ 定义和组装XMPP消息，通过session向client发送。

在这个流程中我们需要修改的是步骤3，也就是需要定义和组装自己的xmpp消息，以便于将适当的信息传到客户端并便于客户端解析。一个简单的消息组装例子如下：

    private IQ  createMessageIQ(String title, String message, String userId,String json) {
    Element notification =  DocumentHelper.createElement(QName.get(
    "message",  INQURIE_NAMESPACE));
    notification.addElement("title").setText(title);
    notification.addElement("text").setText(message);
    notification.addElement("userId").setText(userId);
    notification.addElement("json").setText(json);
    IQ iq = new IQ();
    iq.setType(IQ.Type.set);
    iq.setChildElement(notification);
    return iq;
    }
要注意的是在创建element的时候，传入的namespace要和client解析使用的namespace相匹配。

**独立部署使用**



独立部署使用不需要对androidpn-server源代码进行任何改造，目录结构见上图，只需要修改好配置文件即可，配置文件在conf文件夹下，下面对需要注意的配置项进行说明，其他配置项目使用默认配置就可。

对于config.properties的配置说明如下：

apiKey=1234567890 #暂时发现没什么用处

admin.console.host=127.0.0.1 #web管理控制界面jetty服务监听的地址

admin.console.port=7070 #web管理控制界面jetty服务监听的端口

对于spring-config.xml的配置说明：

    <bean id="ioAcceptor" class="org.apache.mina.transport.socket.nio.NioSocketAcceptor"init-method="bind" destroy-method="unbind">
    
    <property name="defaultLocalAddress" value=":5222" /> <!--mina Socekt服务端监听端口，客户端配置和此配置一致-->
    
    <property name="handler" ref="xmppHandler" />
    
    <property name="filterChainBuilder" ref="filterChainBuilder" />
    
    <property name="reuseAddress" value="true" />
    
    </bean>

启动脚本在bin下，windowns和linux的脚本都有，需要配置系统环境变量JAVA_HOME，或者修改启动脚本将JAVA_HOME指定为你本机的具体地址，运行run脚本androidpn启动成功，通过浏览器访问http://127.0.0.1:7070/就可看到console界面。

其他项目通过http方式将需要发送的消息提交给androidpn-server服务，由androidpn-server完成客户端消息推送。

具体应用可以通过程序代码编写方式访问http://192.168.1.24:7070/notification.do地址，将需要的参数以post方式提交。

嵌入项目使用
若要将androidpn作为应用程序的一部分潜入项目中使用，需要对androidpn-server源代码进行改造。

**情况一：若你的项目中没有用到spring**

这种情况不用考虑androidpn的spring和你项目中spring配置的融合问题，直接因为spring就可以了，配置文件使用androidpn默认配置文件名称spring-config.xml。配置文件都放在classpath下。

需要在config.properties配置文件中增加配置server.home.dir选项，值指向一个目录，如：server.home.dir=F:\\android\\download\\androidpn-server-0.5.0，该目录下要有子目录conf\security，目录下要放两个文件keystore和truststore，用来进行SSL安全传输用的密钥和证书，利用androdpn-server自带的就可以。

接下来就是修改org.androidpn.server.xmpp. XmppServer类，将启动admin console的代码注释掉，如下截图红框框住的部分。如果你需要启动admin console的话，需要将原始androidpn中console文件夹放到合适的路径下，这个还没有试。




**Androidpn-server主启动类**

org.androidpn.server.xmpp.XmppServer修改完后，你就可以在你的应用程序这样调用：

XmppServerserver = XmppServer.getInstance();

这样XmppServer通过加载spring启动了mina监听服务，这时手机客户端应用已经可以连接服务端了。

你的应用程序需要推送消息时，实例化

org.androidpn.server.xmpp.push.NotificationManager，调用其提供的sendBroadcast和sendNotifcationToUser方法，如下代码调用：

    NotificationManager notificationManager = new NotificationManager();
    notificationManager.sendBroadcast("1234567890", "Hello","Hello BalanceJia!", "uri");
    或
    notificationManager.sendNotifcationToUser(apiKey,username, title, message, uri);


**情况二：若你的项目中用到spring**

和你的项目中spring配置融合，需要注意spring容器不能重复启动的问题。所以要将androidpn-server的spring配置增加到你的spring配置中，需要修改XmppServer启动spring的地方，另外androidpn-server spring中配置的ben名字和你项目中的本名字不能重复，因为androidpn-server中用到的ben  id有：dataSource、dataSource、transactionManager、userDao、userService。还有数据源冲突的问题。

**情况三：基于tomcat部署**

1.依据ServerStart类写一个servlet，在servlet中启动时创建XmppServer实例。然后在web.xml中配置为自启动。

2.将androidpn自带的配置目录conf拷贝到WEB-INF下面，并且把spring-config.xml文件从conf目录移动到WEB-INF目录。

3.修改默认的spring-config.xml文件，在文件schema的头部<beans>下面加入如下内容<import resource="applicationContext.xml"/>，其中，加载顺序会默认先加载applicationContext文件，然后会加载spring-config文件后面的内容。

原因是spring-config文件中有个<bean id="xmppHandler" .../>组件会在web服务启动的时候加载，该组件也会初始化XmppServer，导致与servlet的加载发生冲突。

由于未使用使用hibernate-cfg.xml文件，需要在spring-config文件加入如下内容：
    
    <bean id="sessionFactory"
       class="org.springframework.orm.hibernate3.LocalSessionFactoryBean">
       <property name="dataSource" ref="dataSource" />
       <property name="mappingResources" >
      <list>
    <value>org/androidpn/server/model/User.hbm.xml</value>
      </list>
    </property>
    <property name="hibernateProperties">
       <props>
     <prop key="hibernate.dialect">
      org.hibernate.dialect.SQLServerDialect
     </prop>
     <prop key="hibernate.show_sql">true</prop>
     <prop key="hibernate.hbm2ddl.auto">update</prop>
      </props>
     </property>
     </bean>

在spring-config.xml文件中，配置组件<bean: id="ioAcceptor">的listenrPort属性

    <bean id="listenrPort" class="java.net.InetSocketAddress">
     <constructor-arg value="localhost"/>
     <constructor-arg value="5222"/>
    </bean>

此外，Androidpn默认采用spring-mvc方式配置，所以需要修改action指向。修改org.androidpn.server.console.controller包下面的三个类，改为继承自struct2的ActionSupport方式，并修改默认的调用方法，然后配置struct.xml文件。
