---
layout:     post
title:      Androidpn 消息推送总结
keywords:   Android, 消息推送, 服务器， 实时聊天
category:   web 
tags:		[android, 消息推送]
---


Androidpn 开源项目托管地址：http://sourceforge.net/projects/androidpn/

Androidpn 开源项目自身描述：This is an open source project to provide push notification support for Android, a xmpp based notification server and a client tool kit.

 

# 源码分析 #

在程序的入口 DemoAppActivity 中设置通知的 icon 并开启消息接收服务，代码如下：

    Number：1-1 
    ServiceManager serviceManager = new ServiceManager(this);
    serviceManager.setNotificationIcon(R.drawable.notification);
    serviceManager.startService();

在上面的代码中可以看到程序对 ServiceManager 进行了初始化操作，在 ServiceManager 类的构造函数中我们可以看到程序对传递过来的 context 进行了判断，如果这个 context 是一个 Activity 实例，紧接着会获取对应的包名和类名。之后再去加载 res/raw/androidpn.properties 配置文件中的参数信息，并将读取到的信息和之前从 context 中获取的包名和类名一起存入首选项中。

    
    Number：2-1 
    public ServiceManager(Context context) {
    this.context = context;
    
    if (context instanceof Activity) {
    Activity callbackActivity = (Activity) context;
    callbackActivityPackageName = callbackActivity.getPackageName();
    callbackActivityClassName = callbackActivity.getClass().getName();
    }
    
    props = loadProperties();
    apiKey = props.getProperty("apiKey", "");
    xmppHost = props.getProperty("xmppHost", "127.0.0.1");
    xmppPort = props.getProperty("xmppPort", "5222");
    
    sharedPrefs = context.getSharedPreferences(Constants.SHARED_PREFERENCE_NAME, Context.MODE_PRIVATE);
    Editor editor = sharedPrefs.edit();
    editor.putString(Constants.API_KEY, apiKey);
    editor.putString(Constants.VERSION, version);
    editor.putString(Constants.XMPP_HOST, xmppHost);
    editor.putInt(Constants.XMPP_PORT, Integer.parseInt(xmppPort));
    editor.putString(Constants.CALLBACK_ACTIVITY_PACKAGE_NAME, callbackActivityPackageName);
    editor.putString(Constants.CALLBACK_ACTIVITY_CLASS_NAME, callbackActivityClassName);
    editor.commit();
    }
 
完成上述操作之后，紧接着调用 `ServiceManager.startService()` 方法来开启服务，实际上 ServiceManager 只是一个普通的类，方法 ServiceManager.startService() 只是开启一个子线程来开启真正的服务类 NotificationService ，许多人认为开一个线程不停的去开启服务会不会消耗相当一部分资源？答案是不会的，因为服务的生命周期决定了onCreate() 方法在服务被创建时调用，该方法只会被调用一次，无论调用多少次 startService() 方法，服务也只被创建一次，细心的读者会发现 Androidpn 的作者在 NotificationService 类的 `onStart(Intent intent, int startId)` 方法中没有做任何事，而是在onCreate() 方法中完成了诸多操作。



    Number：3-1
    public void startService() {
    Thread serviceThread = new Thread(new Runnable() {
    public void run() {
    Intent intent = NotificationService.getIntent();
    context.startService(intent);
    }
    });
    serviceThread.start();
    }


下面我们来看 NotificationService 类的onCreate() 方法中都完成什么操作？



    Number：4-1
    public void onCreate() {
    telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
    sharedPrefs = getSharedPreferences(Constants.SHARED_PREFERENCE_NAME, Context.MODE_PRIVATE);
    
    deviceId = telephonyManager.getDeviceId();
    Editor editor = sharedPrefs.edit();
    editor.putString(Constants.DEVICE_ID, deviceId);
    editor.commit();
    
    if (deviceId == null || deviceId.trim().length() == 0 || deviceId.matches("0+")) {
    if (sharedPrefs.contains("EMULATOR_DEVICE_ID")) {
    deviceId = sharedPrefs.getString(Constants.EMULATOR_DEVICE_ID, "");
    } else {
    deviceId = (new StringBuilder("EMU")).append((new Random(System.currentTimeMillis())).nextLong()).toString();
    editor.putString(Constants.EMULATOR_DEVICE_ID, deviceId);
    editor.commit();
    }
    }
    xmppManager = new XmppManager(this);
    taskSubmitter.submit(new Runnable() {
    public void run() {
    NotificationService.this.start();
    }
    });
    }


在上面的方法中作者获取了设备号并将设备号存入了首选项中，同时还对在模拟器下运行的情况做了处理，这些操作是次要的。真正的核心的操作是 taskSubmitter 里调用了NotificationService.this.start()，这里的 NotificationService.this 完成了 NotificationService 的实例化，我们可以看到 NotificationService 类的构造方法中完成了 NotificationReceiver、ConnectivityReceiver、PhoneStateChangeListener、Executors、TaskSubmitter、TaskTracker 等类的实例化。



    Number：5-1
    public NotificationService() {
    notificationReceiver = new NotificationReceiver();
    connectivityReceiver = new ConnectivityReceiver(this);
    phoneStateListener = new PhoneStateChangeListener(this);
    executorService = Executors.newSingleThreadExecutor();
    taskSubmitter = new TaskSubmitter(this);
    taskTracker = new TaskTracker(this);
    }



NotificationService 的实例化完成后调用的start() 方法中注册了一个广播接收者 NotificationReceiver 用来处理从服务器推送过来的消息；同时还注册了一个广播接收者来监听网络连接状况，如果有网络连接，则执行 xmppManager.connect()，如果没有网络连接，则执行 xmppManager.disconnect()。但是在start() 方法中最终还是会执行 xmppManager.connect()。

    Number：6-1
    private void start() {
    registerNotificationReceiver();
    registerConnectivityReceiver();
    xmppManager.connect();
    }

再来看看 xmppManager.connect() 方法中都做了些什么？程序在这个方法中提交了一个登录任务：submitLoginTask()，在提交的登录任务中又提交了一个注册任务：submitRegisterTask()，同时将新建的登录任务添加到任务集合中并交由 TaskTracker 来对添加的任务进行监视，此时 TaskTracker 的计数加一。

    Number：7-1
    public void connect() {
     submitLoginTask();
    }

    Number：7-2
    private void submitLoginTask() {
     submitRegisterTask();
     addTask(new LoginTask());
    }

下面继续来看新添加的登录任务 new LoginTask() 具体做了什么？看 Number：8-2 代码，程序在登录任务线程的 run() 方法中首先去判断当前客户端是否已经经过身份验证，验证身份的代码请看 Number：8-1 。

如果没有通过身份验证：xmppManager 会获取当前连并接携带着从首选项中读取的 username 和password 执行登录操作，登录成功后 xmppManager 会在登录成功的连接上添加连接监听器`PersistentConnectionListener`，这个监听器可以监听连接关闭和和连接错误，并在连接错误的情况下执行重连操作。接下来会在当前连接上添加包过滤器 PacketFilter packetFilter 和包监听器 `NotificationPacketListener packetListener`，包过滤器用来校验从服务器发送过来的数据包是否符合 NotificationIQ 格式，打开 NotificationIQ 类我们可以看到这个类中定义了数据包中需要封装的信息：id、apiKey、title、message、uri。包监听器则是用来真正处理从服务器发过来的数据。

请看 Number：8-3 代码，在 NotificationPacketListener 类的 `processPacket(Packet packet)` 方法中程序首先会判断获得的数据包是否是 NotificationIQ 的一个实例，如果是程序会调用 NotificationIQ 的`getChildElementXML()` 方法将数据包中携带的信息拼装为一个字符串进行判断动作是否为发送广播，如果动作为发送广播，程序会将数据包的信息填充到 Intent 中并发送广播，注意这个广播中填充到 Intent 的动作名称 Constants.ACTION_SHOW_NOTIFICATION 为显示广播，这个动作被另一个广播接收者 NotificationReceiver (该广播接收者在之前的` NotificationService 的start()` 方法中已经注册)所监听。


另外需要注意的是，如果客户端在登录过程中出现INVALID_CREDENTIALS_ERROR_CODE = "401" 错误，在 Number：8-2 的代码中我们可以看到程序执行了 `xmppManager.reregisterAccount()` 操作和 `xmppManager.startReconnectionThread() `操作。在 `xmppManager.reregisterAccount()` 操作中程序会删除保存在首选项中的 username 和password 并重新提交登录任务 submitLoginTask()，在这个登录任务中依次再嵌套执行注册、连接任务。这些任务执行完毕之后程序继续调用 xmppManager.startReconnectionThread() 执行重连操作。如果客户端在登录过程中出现不可预知的错误，在 Number：8-2 的代码中我们可以看到程序执直接调用 `xmppManager.startReconnectionThread()` 来执行重连操作。

如果已经通过身份验证：意味着客户端已经登录成功，程序直接调用 xmppManager.runTask() 方法来执行之前添加到任务集合中的任务 new LoginTask()，同时 TaskTracker 的计数减一。

Number：8-1
private boolean isAuthenticated() {
return connection != null && connection.isConnected() && connection.isAuthenticated();
}


    Number：8-2
    private class LoginTask implements Runnable {
    final XmppManager xmppManager;
    private LoginTask() {
    this.xmppManager = XmppManager.this;
    }
    public void run() {
    if (!xmppManager.isAuthenticated()) {
    Log.d(LOGTAG, "username=" + username);
    Log.d(LOGTAG, "password=" + password);
    try {
    xmppManager.getConnection().login(xmppManager.getUsername(), xmppManager.getPassword(), XMPP_RESOURCE_NAME);
    Log.d(LOGTAG, "Loggedn in successfully");
    if (xmppManager.getConnectionListener() != null) {
    xmppManager.getConnection().addConnectionListener(xmppManager.getConnectionListener());
    }
    PacketFilter packetFilter = new PacketTypeFilter(NotificationIQ.class);
    PacketListener packetListener = xmppManager.getNotificationPacketListener();
    connection.addPacketListener(packetListener, packetFilter);
    xmppManager.runTask();
    } catch (XMPPException e) {
    Log.e(LOGTAG, "LoginTask.run()... xmpp error");
    Log.e(LOGTAG, "Failed to login to xmpp server. Caused by: " + e.getMessage());
    String INVALID_CREDENTIALS_ERROR_CODE = "401";
    String errorMessage = e.getMessage();
    if (errorMessage != null && errorMessage.contains(INVALID_CREDENTIALS_ERROR_CODE)) {
    xmppManager.reregisterAccount();
    return;
    }
    xmppManager.startReconnectionThread();
    } catch (Exception e) {
    Log.e(LOGTAG, "LoginTask.run()... other error");
    Log.e(LOGTAG, "Failed to login to xmpp server. Caused by: " + e.getMessage());
    xmppManager.startReconnectionThread();
    }
    } else {
    Log.i(LOGTAG, "Logged in already");
    xmppManager.runTask();
    }
    }
    }


    Number：8-3
    public class NotificationPacketListener implements PacketListener {
    
    private static final String LOGTAG = LogUtil.makeLogTag(NotificationPacketListener.class);
    
    private final XmppManager xmppManager;
    
    public NotificationPacketListener(XmppManager xmppManager) {
    this.xmppManager = xmppManager;
    }
    
    public void processPacket(Packet packet) {
    Log.d(LOGTAG, "NotificationPacketListener.processPacket()...");
    Log.d(LOGTAG, "packet.toXML()=" + packet.toXML());
    
    if (packet instanceof NotificationIQ) {
    NotificationIQ notification = (NotificationIQ) packet;
    
    if (notification.getChildElementXML().contains("androidpn:iq:notification")) {
    String notificationId = notification.getId();
    String notificationApiKey = notification.getApiKey();
    String notificationTitle = notification.getTitle();
    String notificationMessage = notification.getMessage();
    String notificationUri = notification.getUri();
    
    Intent intent = new Intent(Constants.ACTION_SHOW_NOTIFICATION);
    intent.putExtra(Constants.NOTIFICATION_ID, notificationId);
    intent.putExtra(Constants.NOTIFICATION_API_KEY, notificationApiKey);
    intent.putExtra(Constants.NOTIFICATION_TITLE, notificationTitle);
    intent.putExtra(Constants.NOTIFICATION_MESSAGE, notificationMessage);
    intent.putExtra(Constants.NOTIFICATION_URI, notificationUri);
    
    xmppManager.getContext().sendBroadcast(intent);
    }
    }
    }
    }


    Number：8-4
    public void reregisterAccount() {
    removeAccount();
    submitLoginTask();
    runTask();
    }

NotificationReceiver 在接收到NotificationPacketListener 中发出的广播后，先判断Intent 中携带的动作和自己所收听的动作是否一致，如果一致，则继续从Intent 中取出Intent 所携带的信息并调用 Notifier 的`notify(String notificationId, String apiKey, String title, String message, String uri)` 来发送通知。


    Number：9-1
    public final class NotificationReceiver extends BroadcastReceiver {
    
    private static final String LOGTAG = LogUtil.makeLogTag(NotificationReceiver.class);
    
    public NotificationReceiver() {
    }
    
    public void onReceive(Context context, Intent intent) {
    Log.d(LOGTAG, "NotificationReceiver.onReceive()...");
    String action = intent.getAction();
    Log.d(LOGTAG, "action=" + action);
    
    if (Constants.ACTION_SHOW_NOTIFICATION.equals(action)) {
    String notificationId = intent.getStringExtra(Constants.NOTIFICATION_ID);
    String notificationApiKey = intent.getStringExtra(Constants.NOTIFICATION_API_KEY);
    String notificationTitle = intent.getStringExtra(Constants.NOTIFICATION_TITLE);
    String notificationMessage = intent.getStringExtra(Constants.NOTIFICATION_MESSAGE);
    String notificationUri = intent.getStringExtra(Constants.NOTIFICATION_URI);
    
    Notifier notifier = new Notifier(context);
    notifier.notify(notificationId, notificationApiKey, notificationTitle, notificationMessage, notificationUri);
    }
    }
    }


Notifier 在发送通知之前会先去首选项中读取用户的配置信息，如果配置信息中` Constants.SETTINGS_NOTIFICATION_ENABLED` 的值为 true，然后开始组装通知并为通知进行参数配置，这些操作完成后再调用 NotificationManager 将组装好的通知发送出去。至此，在客户端已经注册的前提下，执行的登录、接收服务器数据包、发送广播、发送通知的流程就结束了，添加在当前连接上的NotificationPacketListener 会一直监听从服务器发送过来的数据包并重复执行数据包解析、发送广播、发送通知的操作。

但是需要注意的是从代码 Number：7-1 至代码 Number：9-1 的流程是以客户端已经完成注册为前提的；如果客户端是第一次执行消息推送的服务，显然不会直接进入到登录的逻辑中来，让我们继续跳到 Number：7-2 中的岔路口，程序在提交登录任务的内部嵌套着提交了一个注册任务 submitRegisterTask()，继续来看这个注册任务做了什么操作。在这个注册任务中继续将新建的注册任务添加到任务集合中并交由 TaskTracker 来对添加的任务进行监视，此时 TaskTracker 的计数加一；与此同时内嵌提交了一个连接任务`submitConnectTask()`。

    Number：10-1
    private void submitRegisterTask() {
    submitConnectTask();
    addTask(new RegisterTask());
    }

先来看登录任务中做了什么操作？参看代码 Number：11-1。

如果没有注册：则使用UUID生成2个随机数作为 username 和 password，同时实例化 Registration，将创建的包过滤器和包监听器添加到当前连接上，然后使用 Registration 实例将生成的 username 和 password 作为属性添加到 Registration 实例上，再由当前连接调用` connection.sendPacket(registration)` 向服务器发送数据包执行注册操作。创建的包监听器会监听并处理服务器会送的数据包，PacketListener 在接收到服务器会送的数据包后，同样会判断数据包的格式是否符合包过滤器中定义的格式，只有格式匹配的情况下进行后续处理。在格式匹配的情况下，程序继续进行判断：如果服务器返回信息的类型是 `IQ.Type.ERROR` 则进行报错处理；如果服务器返回信息的类型是 `IQ.Type.RESULT `证明在服务器注册成功，这时程序会将 username 和 password 存储到首选项中，之后程序直接调用 `xmppManager.runTask() `方法来执行之前添加到任务集合中的任务 `new LoginTask()`，同时 TaskTracker 的计数减一。

如果已经注册：意味着首选项中已经有了配置信息，程序直接调用 `xmppManager.runTask() `方法来执行之前添加到任务集合中的任务 `new LoginTask()`，同时 TaskTracker 的计数减一。



	Number：11-1
	private class RegisterTask implements Runnable {

    final XmppManager xmppManager;
    private RegisterTask() {
        xmppManager = XmppManager.this;
    }

    public void run() {
        if (!xmppManager.isRegistered()) {
            final String newUsername = newRandomUUID();
            final String newPassword = newRandomUUID();

            Registration registration = new Registration();
            PacketFilter packetFilter = new AndFilter(new PacketIDFilter(registration.getPacketID()), new PacketTypeFilter(IQ.class));

            PacketListener packetListener = new PacketListener() {

                public void processPacket(Packet packet) {
                    Log.d("RegisterTask.PacketListener", "processPacket().....");
                    Log.d("RegisterTask.PacketListener", "packet=" + packet.toXML());
                    if (packet instanceof IQ) {
                        IQ response = (IQ) packet;
                        if (response.getType() == IQ.Type.ERROR) {
                            if (!response.getError().toString().contains("409")) {
                                Log.e(LOGTAG, "Unknown error while registering XMPP account! " + response.getError().getCondition());
                            }
                        } else if (response.getType() == IQ.Type.RESULT) {
                            xmppManager.setUsername(newUsername);
                            xmppManager.setPassword(newPassword);
                            Log.d(LOGTAG, "username=" + newUsername);
                            Log.d(LOGTAG, "password=" + newPassword);
                            Editor editor = sharedPrefs.edit();
                            editor.putString(Constants.XMPP_USERNAME, newUsername);
                            editor.putString(Constants.XMPP_PASSWORD, newPassword);
                            editor.commit();
                            Log.i(LOGTAG, "Account registered successfully");
                            xmppManager.runTask();
                        }
                    }
                }
            };
            connection.addPacketListener(packetListener, packetFilter);
            registration.setType(IQ.Type.SET);
            registration.addAttribute("username", newUsername);
            registration.addAttribute("password", newPassword);
            connection.sendPacket(registration);
        } else {
            Log.i(LOGTAG, "Account registered already");
            xmppManager.runTask();
        }
    }
}


至此，在客户端已经连接到服务器的前提下，执行的注册、登录、接收服务器数据包、发送广播、发送通知的流程就结束了，添加在当前连接上的 `NotificationPacketListener` 会一直监听从服务器发送过来的数据包并重复执行数据包解析、发送广播、发送通知的操作。

同样需要注意的是从代码 Number：10-1 至代码 Number：11-1 的流程是以客户端已经连接到服务器为前提的；如果客户端是第一次执行消息推送的服务，显然也不会直接进入到注册的逻辑中来，让我们继续跳到 Number：10-1 中的岔路口，程序在提交注册任务的内部嵌套着提交了一个连接任务 `submitConnectTask()`，继续来看这个连接任务做了什么操作。在这个连接任务中程序直接将新建的连接任务添加到任务集合中并交由 TaskTracker 来对添加的任务进行监视，此时 TaskTracker 的计数加一。

    Number：12-1
    private void submitConnectTask() {
    addTask(new ConnectTask());
    }
继续来看连接任务中做了什么操作？参看代码 Number：13-1。

如果没有连接到服务器：程序会从首选项中读取 xmppHost 和 xmppPort 并使用 XMPPConnection 通过配置信息实例化一个连接，然后再由该连接执行连接操作。连接成功后，程序调用`xmppManager.runTask() `方法来执行之前添加到任务集合中的任务 `new RegisterTask()`，同时 TaskTracker 的计数减一。

如果已经连接到服务器：程序直接调用` xmppManager.runTask()` 方法来执行之前添加到任务集合中的任务 new RegisterTask()，同时 TaskTracker 的计数减一。



	Number：13-1
	private class ConnectTask implements Runnable {

    final XmppManager xmppManager;

    private ConnectTask() {
        this.xmppManager = XmppManager.this;
    }

    public void run() {
        if (!xmppManager.isConnected()) {
            // Create the configuration for this new connection
            ConnectionConfiguration connConfig = new ConnectionConfiguration(xmppHost, xmppPort);
            connConfig.setSecurityMode(SecurityMode.required);
            connConfig.setSASLAuthenticationEnabled(false);
            connConfig.setCompressionEnabled(false);

            XMPPConnection connection = new XMPPConnection(connConfig);
            xmppManager.setConnection(connection);

            try {
                // Connect to the server
                connection.connect();
                Log.i(LOGTAG, "XMPP connected successfully");
                // packet provider
                ProviderManager.getInstance().addIQProvider("notification", "androidpn:iq:notification", new NotificationIQProvider());
            } catch (XMPPException e) {
                Log.e(LOGTAG, "XMPP connection failed", e);
            }
            xmppManager.runTask();
        } else {
            Log.i(LOGTAG, "XMPP connected already");
            xmppManager.runTask();
        }
    }
}


至此，在客户端执行的连接、注册、登录、接收服务器数据包、发送广播、发送通知的流程就结束了，添加在当前连接上的 `NotificationPacketListener `会一直监听从服务器发送过来的数据包并重复执行数据包解析、发送广播、发送通知的操作。

 

----------

## 二、后续问题 ##

▐ 关于服务器重启客户端自动重连服务器的问题？

▐ 在 XmppManager 的 `addTask(Runnable runnable)` 方法中添加 `runTask() `方法即可解决。



	private void addTask(Runnable runnable) {
    taskTracker.increase();
    synchronized (taskList) {
        if (taskList.isEmpty() && !running) {
            running = true;
            futureTask = taskSubmitter.submit(runnable);
            if (futureTask == null) {
                taskTracker.decrease();
            }
        } else {
            /**
             * runTask(); 解决服务器端重启后,客户端不能成功连接  Androidpn 服务器
             */
            runTask();
                
            taskList.add(runnable);
        }
    }
}


▐ 关于使用设备ID或 MAC替换源码中的 UUID作为 username 和 password 带来的问题？

如果把客户端随机生成的UUID代码，替换为设备的ID或者MAC作为用户名，服务器端会出现重复插入的错误。

把客户端的数据清除(或卸载后重新安装)，那么 SharedPreferences 里的数据也会被清除，然而服务器端又有我们手机的设备 ID，这时客户端启动程序从首选项中读取不到 username 和 password 会重新拿着相同的设备 ID 提交给服务器进行注册，这时服务器端就会出现重复插入的问题。

▐ 在服务器端保存用户信息的时候，检查数据库中是否存在该用户。

▐ Android 消息推送的其他途径

▐ 极光推送

网站参考地址 : http://www.jpush.cn/

▐ Google Cloud Messaging for Android

网站参考地址 : http://developer.android.com/google/gcm/index.html

▐ MQTT 协议推送

客户端下载地址 : https://github.com/tokudu/AndroidPushNotificationsDemo

服务器下载地址 : https://github.com/tokudu/PhpMQTTClient

 
