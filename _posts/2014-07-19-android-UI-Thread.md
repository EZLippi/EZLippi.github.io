---
layout:     post
title:      Android UI线程和子线程、Service通信
keywords:   [java, thread， Service]   
category:   java
tags:       [java, android]
---
关于Service最基本的用法自然就是如何启动一个Service了，启动Service的方法和启动Activity很类似，都需要借助Intent来实现，下面我们就通过一个具体的例子来看一下。

新建一个Android项目，项目名就叫ServiceTest，这里我选择使用4.0的API。

然后新建一个MyService继承自Service，并重写父类的onCreate()、onStartCommand()和onDestroy()方法，如下所示：

[java] 

    public class MyService extends Service {  
      
        public static final String TAG = "MyService";  
      
        @Override  
        public void onCreate() {  
            super.onCreate();  
            Log.d(TAG, "onCreate() executed");  
        }  
      
        @Override  
        public int onStartCommand(Intent intent, int flags, int startId) {  
            Log.d(TAG, "onStartCommand() executed");  
            return super.onStartCommand(intent, flags, startId);  
        }  
          
        @Override  
        public void onDestroy() {  
            super.onDestroy();  
            Log.d(TAG, "onDestroy() executed");  
        }  
      
        @Override  
        public IBinder onBind(Intent intent) {  
            return null;  
        }  
      
    }  

可以看到，我们只是在onCreate()、onStartCommand()和onDestroy()方法中分别打印了一句话，并没有进行其它任何的操作。
然后打开或新建activity_main.xml作为程序的主布局文件，代码如下所示：

[html] 

    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"  
        android:layout_width="match_parent"  
        android:layout_height="match_parent"  
        android:orientation="vertical" >  
      
        <Button  
            android:id="@+id/start_service"  
            android:layout_width="match_parent"  
            android:layout_height="wrap_content"  
            android:text="Start Service" />  
      
        <Button  
            android:id="@+id/stop_service"  
            android:layout_width="match_parent"  
            android:layout_height="wrap_content"  
            android:text="Stop Service" />  
      
    </LinearLayout>  

我们在布局文件中加入了两个按钮，一个用于启动Service，一个用于停止Service。
然后打开或新建MainActivity作为程序的主Activity，在里面加入启动Service和停止Service的逻辑，代码如下所示：

[java] 

    public class MainActivity extends Activity implements OnClickListener {  
      
        private Button startService;  
      
        private Button stopService;  
      
        @Override  
        protected void onCreate(Bundle savedInstanceState) {  
            super.onCreate(savedInstanceState);  
            setContentView(R.layout.activity_main);  
            startService = (Button) findViewById(R.id.start_service);  
            stopService = (Button) findViewById(R.id.stop_service);  
            startService.setOnClickListener(this);  
            stopService.setOnClickListener(this);  
        }  
      
        @Override  
        public void onClick(View v) {  
            switch (v.getId()) {  
            case R.id.start_service:  
                Intent startIntent = new Intent(this, MyService.class);  
                startService(startIntent);  
                break;  
            case R.id.stop_service:  
                Intent stopIntent = new Intent(this, MyService.class);  
                stopService(stopIntent);  
                break;  
            default:  
                break;  
            }  
        }  
      
    }  

可以看到，在Start Service按钮的点击事件里，我们构建出了一个Intent对象，并调用startService()方法来启动MyService。然后在Stop Serivce按钮的点击事件里，我们同样构建出了一个Intent对象，并调用stopService()方法来停止MyService。代码的逻辑非常简单，相信不需要我再多做解释了吧。
另外需要注意，项目中的每一个Service都必须在AndroidManifest.xml中注册才行，所以还需要编辑AndroidManifest.xml文件，代码如下所示：

[html] 

    <?xml version="1.0" encoding="utf-8"?>  
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"  
        package="com.example.servicetest"  
        android:versionCode="1"  
        android:versionName="1.0" >  
      
        <uses-sdk  
            android:minSdkVersion="14"  
            android:targetSdkVersion="17" />  
      
        <application  
            android:allowBackup="true"  
            android:icon="@drawable/ic_launcher"  
            android:label="@string/app_name"  
            android:theme="@style/AppTheme" >  
              
        ……  
      
            <service android:name="com.example.servicetest.MyService" >  
            </service>  
        </application>  
      
    </manifest> 

 
这样的话，一个简单的带有Service功能的程序就写好了，当启动一个Service的时候，会调用该Service中的onCreate()和onStartCommand()方法。

那么如果我再点击一次Start Service按钮呢？
这次只有onStartCommand()方法执行了，onCreate()方法并没有执行，为什么会这样呢？这是由于onCreate()方法只会在Service第一次被创建的时候调用，如果当前Service已经被创建过了，不管怎样调用startService()方法，onCreate()方法都不会再执行。因此你可以再多点击几次StartService按钮试一次，每次都只会有onStartCommand()方法。

我们还可以到手机的应用程序管理界面来检查一下MyService是不是正在运行，
，MyService确实是正在运行的，即使它的内部并没有执行任何的逻辑。

回到ServiceTest程序，然后点击一下Stop Service按钮就可以将MyService停止掉了。

##Service和Activity通信
上面我们学习了Service的基本用法，启动Service之后，就可以在onCreate()或onStartCommand()方法里去执行一些具体的逻辑了。不过这样的话Service和Activity的关系并不大，只是Activity通知了Service一下：“你可以启动了。”然后Service就去忙自己的事情了。那么有没有什么办法能让它们俩的关联更多一些呢？比如说在Activity中可以指定让Service去执行什么任务。当然可以，只需要让Activity和Service建立关联就好了。

观察MyService中的代码，你会发现一直有一个onBind()方法我们都没有使用到，这个方法其实就是用于和Activity建立关联的，修改MyService中的代码，如下所示：

[java] 

    public class MyService extends Service {  
      
        public static final String TAG = "MyService";  
      
        private MyBinder mBinder = new MyBinder();  
      
        @Override  
        public void onCreate() {  
            super.onCreate();  
            Log.d(TAG, "onCreate() executed");  
        }  
      
        @Override  
        public int onStartCommand(Intent intent, int flags, int startId) {  
            Log.d(TAG, "onStartCommand() executed");  
            return super.onStartCommand(intent, flags, startId);  
        }  
      
        @Override  
        public void onDestroy() {  
            super.onDestroy();  
            Log.d(TAG, "onDestroy() executed");  
        }  
      
        @Override  
        public IBinder onBind(Intent intent) {  
            return mBinder;  
        }  
      
        class MyBinder extends Binder {  
      
            public void startDownload() {  
                Log.d("TAG", "startDownload() executed");  
                // 执行具体的下载任务  
            }  
      
        }  
      
    }  

这里我们新增了一个MyBinder类继承自Binder类，然后在MyBinder中添加了一个startDownload()方法用于在后台执行下载任务，当然这里并不是真正地去下载某个东西，只是做个测试，所以startDownload()方法只是打印了一行日志。
然后修改activity_main.xml中的代码，在布局文件中添加用于绑定Service和取消绑定Service的按钮：

[html] 

        <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"  
            android:layout_width="match_parent"  
            android:layout_height="match_parent"  
            android:orientation="vertical" >  
          
            <Button  
                android:id="@+id/start_service"  
                android:layout_width="match_parent"  
                android:layout_height="wrap_content"  
                android:text="Start Service" />  
          
            <Button  
                android:id="@+id/stop_service"  
                android:layout_width="match_parent"  
                android:layout_height="wrap_content"  
                android:text="Stop Service" />  
          
            <Button  
                android:id="@+id/bind_service"  
                android:layout_width="match_parent"  
                android:layout_height="wrap_content"  
                android:text="Bind Service" />  
              
            <Button   
                android:id="@+id/unbind_service"  
                android:layout_width="match_parent"  
                android:layout_height="wrap_content"  
                android:text="Unbind Service"  
                />  
              
        </LinearLayout>  
    
    接下来再修改MainActivity中的代码，让MainActivity和MyService之间建立关联，代码如下所示：
    [java] 
    public class MainActivity extends Activity implements OnClickListener {  
      
        private Button startService;  
      
        private Button stopService;  
      
        private Button bindService;  
      
        private Button unbindService;  
      
        private MyService.MyBinder myBinder;  
      
        private ServiceConnection connection = new ServiceConnection() {  
      
            @Override  
            public void onServiceDisconnected(ComponentName name) {  
            }  
      
            @Override  
            public void onServiceConnected(ComponentName name, IBinder service) {  
                myBinder = (MyService.MyBinder) service;  
                myBinder.startDownload();  
            }  
        };  
      
        @Override  
        protected void onCreate(Bundle savedInstanceState) {  
            super.onCreate(savedInstanceState);  
            setContentView(R.layout.activity_main);  
            startService = (Button) findViewById(R.id.start_service);  
            stopService = (Button) findViewById(R.id.stop_service);  
            bindService = (Button) findViewById(R.id.bind_service);  
            unbindService = (Button) findViewById(R.id.unbind_service);  
            startService.setOnClickListener(this);  
            stopService.setOnClickListener(this);  
            bindService.setOnClickListener(this);  
            unbindService.setOnClickListener(this);  
        }  
      
        @Override  
        public void onClick(View v) {  
            switch (v.getId()) {  
            case R.id.start_service:  
                Intent startIntent = new Intent(this, MyService.class);  
                startService(startIntent);  
                break;  
            case R.id.stop_service:  
                Intent stopIntent = new Intent(this, MyService.class);  
                stopService(stopIntent);  
                break;  
            case R.id.bind_service:  
                Intent bindIntent = new Intent(this, MyService.class);  
                bindService(bindIntent, connection, BIND_AUTO_CREATE);  
                break;  
            case R.id.unbind_service:  
                unbindService(connection);  
                break;  
            default:  
                break;  
            }  
        }  
      
    }  

可以看到，这里我们首先创建了一个ServiceConnection的匿名类，在里面重写了onServiceConnected()方法和onServiceDisconnected()方法，这两个方法分别会在Activity与Service建立关联和解除关联的时候调用。在onServiceConnected()方法中，我们又通过向下转型得到了MyBinder的实例，有了这个实例，Activity和Service之间的关系就变得非常紧密了。现在我们可以在Activity中根据具体的场景来调用MyBinder中的任何public方法，即实现了Activity指挥Service干什么Service就去干什么的功能。
当然，现在Activity和Service其实还没关联起来了呢，这个功能是在Bind Service按钮的点击事件里完成的。可以看到，这里我们仍然是构建出了一个Intent对象，然后调用bindService()方法将Activity和Service进行绑定。bindService()方法接收三个参数，第一个参数就是刚刚构建出的Intent对象，第二个参数是前面创建出的ServiceConnection的实例，第三个参数是一个标志位，这里传入BIND_AUTO_CREATE表示在Activity和Service建立关联后自动创建Service，这会使得MyService中的onCreate()方法得到执行，但onStartCommand()方法不会执行。

然后如何我们想解除Activity和Service之间的关联怎么办呢？调用一下unbindService()方法就可以了，这也是Unbind Service按钮的点击事件里实现的逻辑。

现在让我们重新运行一下程序吧，在MainActivity中点击一下Bind Service按钮，LogCat里的打印日志如下图所示：

                                         

另外需要注意，任何一个Service在整个应用程序范围内都是通用的，即MyService不仅可以和MainActivity建立关联，还可以和任何一个Activity建立关联，而且在建立关联时它们都可以获取到相同的MyBinder实例。

##如何销毁Service
在Service的基本用法这一部分，我们介绍了销毁Service最简单的一种情况，点击Start Service按钮启动Service，再点击Stop Service按钮停止Service，这样MyService就被销毁了。
那么如果我们是点击的Bind Service按钮呢？由于在绑定Service的时候指定的标志位是BIND_AUTO_CREATE，说明点击Bind Service按钮的时候Service也会被创建，这时应该怎么销毁Service呢？其实也很简单，点击一下Unbind Service按钮，将Activity和Service的关联解除就可以了。

先点击一下Bind Service按钮，再点击一下Unbind Service按钮。

                                     

以上这两种销毁的方式都很好理解。那么如果我们既点击了Start Service按钮，又点击了Bind Service按钮会怎么样呢？这个时候你会发现，不管你是单独点击Stop Service按钮还是Unbind Service按钮，Service都不会被销毁，必要将两个按钮都点击一下，Service才会被销毁。也就是说，点击Stop Service按钮只会让Service停止，点击Unbind Service按钮只会让Service和Activity解除关联，一个Service必须要在既没有和任何Activity关联又处理停止状态的时候才会被销毁。

为了证实一下，我们在Stop Service和Unbind Service按钮的点击事件里面加入一行打印日志：

[java] 

    public void onClick(View v) {  
        switch (v.getId()) {  
        case R.id.start_service:  
            Intent startIntent = new Intent(this, MyService.class);  
            startService(startIntent);  
            break;  
        case R.id.stop_service:  
            Log.d("MyService", "click Stop Service button");  
            Intent stopIntent = new Intent(this, MyService.class);  
            stopService(stopIntent);  
            break;  
        case R.id.bind_service:  
            Intent bindIntent = new Intent(this, MyService.class);  
            bindService(bindIntent, connection, BIND_AUTO_CREATE);  
            break;  
        case R.id.unbind_service:  
            Log.d("MyService", "click Unbind Service button");  
            unbindService(connection);  
            break;  
        default:  
            break;  
        }  
    }  

然后重新运行程序，先点击一下Start Service按钮，再点击一下Bind Service按钮，这样就将Service启动起来，并和Activity建立了关联。然后点击Stop Service按钮后Service并不会销毁，再点击一下Unbind Service按钮，Service就会销毁了。
我们应该始终记得在Service的onDestroy()方法里去清理掉那些不再使用的资源，防止在Service被销毁后还会有一些不再使用的对象仍占用着内存。

##Service和Thread的关系
不少Android初学者都可能会有这样的疑惑，Service和Thread到底有什么关系呢？什么时候应该用Service，什么时候又应该用Thread？答案可能会有点让你吃惊，因为Service和Thread之间没有任何关系！

之所以有不少人会把它们联系起来，主要就是因为Service的后台概念。Thread我们大家都知道，是用于开启一个子线程，在这里去执行一些耗时操作就不会阻塞主线程的运行。而Service我们最初理解的时候，总会觉得它是用来处理一些后台任务的，一些比较耗时的操作也可以放在这里运行，这就会让人产生混淆了。但是，如果我告诉你Service其实是运行在主线程里的，你还会觉得它和Thread有什么关系吗？让我们看一下这个残酷的事实吧。

在MainActivity的onCreate()方法里加入一行打印当前线程id的语句：

[java] 

    Log.d("MyService", "MainActivity thread id is " + Thread.currentThread().getId());  

然后在MyService的onCreate()方法里也加入一行打印当前线程id的语句：
[java] 

    Log.d("MyService", "MyService thread id is " + Thread.currentThread().getId());  

现在重新运行一下程序，并点击Start Service按钮，会看到如下打印日志：

                                 

可以看到，它们的线程id完全是一样的，由此证实了Service确实是运行在主线程里的，也就是说如果你在Service里编写了非常耗时的代码，程序必定会出现ANR的。

你可能会惊呼，这不是坑爹么！？那我要Service又有何用呢？其实大家不要把后台和子线程联系在一起就行了，这是两个完全不同的概念。Android的后台就是指，它的运行是完全不依赖UI的。即使Activity被销毁，或者程序被关闭，只要进程还在，Service就可以继续运行。比如说一些应用程序，始终需要与服务器之间始终保持着心跳连接，就可以使用Service来实现。你可能又会问，前面不是刚刚验证过Service是运行在主线程里的么？在这里一直执行着心跳连接，难道就不会阻塞主线程的运行吗？当然会，但是我们可以在Service中再创建一个子线程，然后在这里去处理耗时逻辑就没问题了。

额，既然在Service里也要创建一个子线程，那为什么不直接在Activity里创建呢？这是因为Activity很难对Thread进行控制，当Activity被销毁之后，就没有任何其它的办法可以再重新获取到之前创建的子线程的实例。而且在一个Activity中创建的子线程，另一个Activity无法对其进行操作。但是Service就不同了，所有的Activity都可以与Service进行关联，然后可以很方便地操作其中的方法，即使Activity被销毁了，之后只要重新与Service建立关联，就又能够获取到原有的Service中Binder的实例。因此，使用Service来处理后台任务，Activity就可以放心地finish，完全不需要担心无法对后台任务进行控制的情况。

一个比较标准的Service就可以写成：

[java] 

    @Override  
    public int onStartCommand(Intent intent, int flags, int startId) {  
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                // 开始执行后台任务  
            }  
        }).start();  
        return super.onStartCommand(intent, flags, startId);  
    }  
      
    class MyBinder extends Binder {  
      
        public void startDownload() {  
            new Thread(new Runnable() {  
                @Override  
                public void run() {  
                    // 执行具体的下载任务  
                }  
            }).start();  
        }  
      
    } 

 
##创建前台Service
Service几乎都是在后台运行的，一直以来它都是默默地做着辛苦的工作。但是Service的系统优先级还是比较低的，当系统出现内存不足情况时，就有可能会回收掉正在后台运行的Service。如果你希望Service可以一直保持运行状态，而不会由于系统内存不足的原因导致被回收，就可以考虑使用前台Service。前台Service和普通Service最大的区别就在于，它会一直有一个正在运行的图标在系统的状态栏显示，下拉状态栏后可以看到更加详细的信息，非常类似于通知的效果。当然有时候你也可能不仅仅是为了防止Service被回收才使用前台Service，有些项目由于特殊的需求会要求必须使用前台Service，比如说墨迹天气，它的Service在后台更新天气数据的同时，还会在系统状态栏一直显示当前天气的信息

                                                   

那么我们就来看一下如何才能创建一个前台Service吧，其实并不复杂，修改MyService中的代码，如下所示：

[java] 

    public class MyService extends Service {  
      
        public static final String TAG = "MyService";  
      
        private MyBinder mBinder = new MyBinder();  
      
        @Override  
        public void onCreate() {  
            super.onCreate();  
            Notification notification = new Notification(R.drawable.ic_launcher,  
                    "有通知到来", System.currentTimeMillis());  
            Intent notificationIntent = new Intent(this, MainActivity.class);  
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,  
                    notificationIntent, 0);  
            notification.setLatestEventInfo(this, "这是通知的标题", "这是通知的内容",  
                    pendingIntent);  
            **startForeground(1, notification);**  
            Log.d(TAG, "onCreate() executed");  
        }  
      
        .........  
      
    }  

这里只是修改了MyService中onCreate()方法的代码。可以看到，我们首先创建了一个Notification对象，然后调用了它的setLatestEventInfo()方法来为通知初始化布局和数据，并在这里设置了点击通知后就打开MainActivity。然后调用startForeground()方法就可以让MyService变成一个前台Service，并会将通知的图片显示出来。
现在重新运行一下程序，并点击Start Service或Bind Service按钮，MyService就会以前台Service的模式启动了，并且在系统状态栏会弹出一个通栏图标，下拉状态栏后可以看到通知的详细内容。


----------


介绍远程Service的用法，如果将MyService转换成一个远程Service，还会不会有ANR的情况呢？让我们来动手尝试一下吧。

将一个普通的Service转换成远程Service其实非常简单，只需要在注册Service的时候将它的android:process属性指定成:remote就可以了，代码如下所示：

[html] 

    <?xml version="1.0" encoding="utf-8"?>  
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"  
        package="com.example.servicetest"  
        android:versionCode="1"  
        android:versionName="1.0" >  
      
        ......  
          
        <service  
            android:name="com.example.servicetest.MyService"  
            android:process=":remote" >  
        </service>  
      
    </manifest>  

现在重新运行程序，并点击一下Start Service按钮，你会看到控制台立刻打印了onCreate() executed的信息，而且主界面并没有阻塞住，也不会出现ANR。大概过了一分钟后，又会看到onStartCommand() executed打印了出来。
为什么将MyService转换成远程Service后就不会导致程序ANR了呢？这是由于，使用了远程Service后，MyService已经在另外一个进程当中运行了，所以只会阻塞该进程中的主线程，并不会影响到当前的应用程序。
为了证实一下MyService现在确实已经运行在另外一个进程当中了，我们分别在MainActivity的onCreate()方法和MyService的onCreate()方法里加入一行日志，打印出各自所在的进程id，如下所示：

[java] 

    Log.d("TAG", "process id is " + Process.myPid());  

再次重新运行程序，然后点击一下Start Service按钮，打印结果如下图所示：
                       

可以看到，不仅仅是进程id不同了，就连应用程序包名也不一样了，MyService中打印的那条日志，包名后面还跟上了:remote标识。

那既然远程Service这么好用，干脆以后我们把所有的Service都转换成远程Service吧，还省得再开启线程了。其实不然，远程Service非但不好用，甚至可以称得上是较为难用。一般情况下如果可以不使用远程Service，就尽量不要使用它。

下面就来看一下它的弊端吧，首先将MyService的onCreate()方法中让线程睡眠的代码去除掉，然后重新运行程序，并点击一下Bind Service按钮，你会发现程序崩溃了！为什么点击Start Service按钮程序就不会崩溃，而点击Bind Service按钮就会崩溃呢？这是由于在Bind Service按钮的点击事件里面我们会让MainActivity和MyService建立关联，但是目前MyService已经是一个远程Service了，Activity和Service运行在两个不同的进程当中，这时就不能再使用传统的建立关联的方式，程序也就崩溃了。

那么如何才能让Activity与一个远程Service建立关联呢？这就要使用AIDL来进行跨进程通信了（IPC）。

`AIDL（Android Interface Definition` Language）是Android接口定义语言的意思，它可以用于让某个Service与多个应用程序组件之间进行跨进程通信，从而可以实现多个应用程序共享同一个Service的功能。

下面我们就来一步步地看一下AIDL的用法到底是怎样的。首先需要新建一个AIDL文件，在这个文件中定义好Activity需要与Service进行通信的方法。新建MyAIDLService.aidl文件，代码如下所示：

[java]

    package com.example.servicetest;  
    interface MyAIDLService {  
        int plus(int a, int b);  
        String toUpperCase(String str);  
    }  

点击保存之后，gen目录下就会生成一个对应的Java文件，如下图所示：
                                             

然后修改MyService中的代码，在里面实现我们刚刚定义好的MyAIDLService接口，如下所示：

[java] 

    public class MyService extends Service {  
      
        ......  
      
        @Override  
        public IBinder onBind(Intent intent) {  
            return mBinder;  
        }  
      
        MyAIDLService.Stub mBinder = new Stub() {  
      
            @Override  
            public String toUpperCase(String str) throws RemoteException {  
                if (str != null) {  
                    return str.toUpperCase();  
                }  
                return null;  
            }  
      
            @Override  
            public int plus(int a, int b) throws RemoteException {  
                return a + b;  
            }  
        };  
      
    }  

这里先是对MyAIDLService.Stub进行了实现，重写里了toUpperCase()和plus()这两个方法。这两个方法的作用分别是将一个字符串全部转换成大写格式，以及将两个传入的整数进行相加。然后在onBind()方法中将MyAIDLService.Stub的实现返回。这里为什么可以这样写呢？因为Stub其实就是Binder的子类，所以在onBind()方法中可以直接返回Stub的实现。
接下来修改MainActivity中的代码，如下所示：

[java] 

    public class MainActivity extends Activity implements OnClickListener {  
      
        private Button startService;  
      
        private Button stopService;  
      
        private Button bindService;  
      
        private Button unbindService;  
          
        private MyAIDLService myAIDLService;  
      
        private ServiceConnection connection = new ServiceConnection() {  
      
            @Override  
            public void onServiceDisconnected(ComponentName name) {  
            }  
      
            @Override  
            public void onServiceConnected(ComponentName name, IBinder service) {  
                myAIDLService = MyAIDLService.Stub.asInterface(service);  
                try {  
                    int result = myAIDLService.plus(3, 5);  
                    String upperStr = myAIDLService.toUpperCase("hello world");  
                    Log.d("TAG", "result is " + result);  
                    Log.d("TAG", "upperStr is " + upperStr);  
                } catch (RemoteException e) {  
                    e.printStackTrace();  
                }  
            }  
        };  
      
        ......  
      
    } 

 
我们只是修改了ServiceConnection中的代码。可以看到，这里首先使用了MyAIDLService.Stub.asInterface()方法将传入的IBinder对象传换成了MyAIDLService对象，接下来就可以调用在MyAIDLService.aidl文件中定义的所有接口了。这里我们先是调用了plus()方法，并传入了3和5作为参数，然后又调用了toUpperCase()方法，并传入hello world字符串作为参数，最后将调用方法的返回结果打印出来。
现在重新运行程序，并点击一下Bind Service按钮，可以看到打印日志如下所示：

                               

由此可见，我们确实已经成功实现跨进程通信了，在一个进程中访问到了另外一个进程中的方法。

不过你也可以看出，目前的跨进程通信其实并没有什么实质上的作用，因为这只是在一个Activity里调用了同一个应用程序的Service里的方法。而跨进程通信的真正意义是为了让一个应用程序去访问另一个应用程序中的Service，以实现共享Service的功能。那么下面我们自然要学习一下，如何才能在其它的应用程序中调用到MyService里的方法。

在上一篇文章中我们已经知道，如果想要让Activity与Service之间建立关联，需要调用bindService()方法，并将Intent作为参数传递进去，在Intent里指定好要绑定的Service，示例代码如下：

[java] 

    Intent bindIntent = new Intent(this, MyService.class);  
    bindService(bindIntent, connection, BIND_AUTO_CREATE);  

这里在构建Intent的时候是使用MyService.class来指定要绑定哪一个Service的，但是在另一个应用程序中去绑定Service的时候并没有MyService这个类，这时就必须使用到隐式Intent了。现在修改AndroidManifest.xml中的代码，给MyService加上一个action，如下所示：
[html] 

    <?xml version="1.0" encoding="utf-8"?>  
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"  
        package="com.example.servicetest"  
        android:versionCode="1"  
        android:versionName="1.0" >  
      
        ......  
      
        <service  
            android:name="com.example.servicetest.MyService"  
            android:process=":remote" >  
            <intent-filter>  
                <action android:name="com.example.servicetest.MyAIDLService"/>  
            </intent-filter>  
        </service>  
      
    </manifest>  

这就说明，MyService可以响应带有com.example.servicetest.MyAIDLService这个action的Intent。

现在重新运行一下程序，这样就把远程Service端的工作全部完成了。
然后创建一个新的Android项目，起名为ClientTest，我们就尝试在这个程序中远程调用MyService中的方法。

ClientTest中的Activity如果想要和MyService建立关联其实也不难，首先需要将MyAIDLService.aidl文件从ServiceTest项目中拷贝过来，注意要将原有的包路径一起拷贝过来，完成后项目的结构如下图所示：

                                     

然后打开或新建activity_main.xml，在布局文件中也加入一个Bind Service按钮：

[html] 

    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"  
        android:layout_width="match_parent"  
        android:layout_height="match_parent"  
        android:orientation="vertical"  
         >  
      
       <Button   
           android:id="@+id/bind_service"  
           android:layout_width="match_parent"  
           android:layout_height="wrap_content"  
           android:text="Bind Service"  
           />  
      
    </LinearLayout>  

接下来打开或新建MainActivity，在其中加入和MyService建立关联的代码，如下所示：
[java]

    public class MainActivity extends Activity {  
      
        private MyAIDLService myAIDLService;  
      
        private ServiceConnection connection = new ServiceConnection() {  
      
            @Override  
            public void onServiceDisconnected(ComponentName name) {  
            }  
      
            @Override  
            public void onServiceConnected(ComponentName name, IBinder service) {  
                myAIDLService = MyAIDLService.Stub.asInterface(service);  
                try {  
                    int result = myAIDLService.plus(50, 50);  
                    String upperStr = myAIDLService.toUpperCase("comes from ClientTest");  
                    Log.d("TAG", "result is " + result);  
                    Log.d("TAG", "upperStr is " + upperStr);  
                } catch (RemoteException e) {  
                    e.printStackTrace();  
                }  
            }  
        };  
      
        @Override  
        protected void onCreate(Bundle savedInstanceState) {  
            super.onCreate(savedInstanceState);  
            setContentView(R.layout.activity_main);  
            Button bindService = (Button) findViewById(R.id.bind_service);  
            bindService.setOnClickListener(new OnClickListener() {  
                @Override  
                public void onClick(View v) {  
                    Intent intent = new Intent("com.example.servicetest.MyAIDLService");  
                    bindService(intent, connection, BIND_AUTO_CREATE);  
                }  
            });  
        }  
      
    } 

 
这部分代码大家一定会非常眼熟吧？没错，这和在ServiceTest的MainActivity中的代码几乎是完全相同的，只是在让Activity和Service建立关联的时候我们使用了隐式Intent，将Intent的action指定成了com.example.servicetest.MyAIDLService。
在当前Activity和MyService建立关联之后，我们仍然是调用了plus()和toUpperCase()这两个方法，远程的MyService会对传入的参数进行处理并返回结果，然后将结果打印出来。

这样的话，ClientTest中的代码也就全部完成了，现在运行一下这个项目，然后点击Bind Service按钮，此时就会去和远程的MyService建立关联，观察LogCat中的打印信息如下所示：

                            

不用我说，大家都已经看出，我们的跨进程通信功能已经完美实现了。

不过还有一点需要说明的是，由于这是在不同的进程之间传递数据，Android对这类数据的格式支持是非常有限的，基本上只能传递Java的基本数据类型、字符串、List或Map等。那么如果我想传递一个自定义的类该怎么办呢？这就必须要让这个类去实现Parcelable接口，并且要给这个类也定义一个同名的AIDL文件。这部分内容并不复杂，而且和Service关系不大，所以就不再详细进行讲解了，感兴趣的朋友可以自己去查阅一下相关的资料


----------
##主线程和子线程通信


###一、Handler的定义:
主要接受子线程发送的数据, 并用此数据配合主线程更新UI.
解释: 当应用程序启动时，Android首先会开启一个主线程 (也就是UI线程) , 主线程为管理界面中的UI控件，进行事件分发, 比如说, 你要是点击一个 Button, Android会分发事件到Button上，来响应你的操作。  如果此时需要一个耗时的操作，例如: 联网读取数据，或者读取本地较大的一个文件的时候，你不能把这些操作放在主线程中，如果你放在主线程中的话，界面会出现假死现象, 如果5秒钟还没有完成的话，会收到Android系统的一个错误提示  "强制关闭".  这个时候我们需要把这些耗时的操作，放在一个子线程中,因为子线程涉及到UI更新，Android主线程是线程不安全的，也就是说，更新UI只能在主线程中更新，子线程中操作是危险的. 这个时候，Handler就出现了来解决这个复杂的问题，由于Handler运行在主线程中(UI线程中)，它与子线程可以通过Message对象来传递数据，这个时候，Handler就承担着接受子线程传过来的(子线程用sedMessage()方法传弟)Message对象，(里面包含数据)  , 把这些消息放入主线程队列中，配合主线程进行更新UI。
 
###二、Handler一些特点
handler可以分发Message对象和Runnable对象到主线程中, 每个Handler实例,都会绑定到创建他的线程中(一般是位于主线程),
它有两个作用:

 1. 安排消息或Runnable 在某个主线程中某个地方执行,
 2. 安排一个动作在不同的线程中执行

      
        Handler中分发消息的一些方法
        post(Runnable)
        postAtTime(Runnable,long)
        postDelayed(Runnable long)
        sendEmptyMessage(int)
        sendMessage(Message)
        sendMessageAtTime(Message,long)
        sendMessageDelayed(Message,long)
        以上post类方法允许你排列一个Runnable对象到主线程队列中,
        sendMessage类方法, 允许你安排一个带数据的Message对象到队列中，等待更新.

###三、Handler实例
      (1) 子类需要继承Handler类，并重写handleMessage(Message msg) 方法, 用于接受线程数据
      以下为一个实例，它实现的功能为 : 通过线程修改界面Button的内容

 

    1 public class MyHandlerActivity extends Activity {
     2     Button button;
     3     MyHandler myHandler;
     4 
     5     protected void onCreate(Bundle savedInstanceState) {
     6         super.onCreate(savedInstanceState);
     7         setContentView(R.layout.handlertest);
     8 
     9         button = (Button) findViewById(R.id.button);
    10         myHandler = new MyHandler();
    11         // 当创建一个新的Handler实例时, 它会绑定到当前线程和消息的队列中,开始分发数据
    12         // Handler有两个作用, (1) : 定时执行Message和Runnalbe 对象
    13         // (2): 让一个动作,在不同的线程中执行.
    14 
    15         // 它安排消息,用以下方法
    16         // post(Runnable)
    17         // postAtTime(Runnable,long)
    18         // postDelayed(Runnable,long)
    19         // sendEmptyMessage(int)
    20         // sendMessage(Message);
    21         // sendMessageAtTime(Message,long)
    22         // sendMessageDelayed(Message,long)
    23       
    24         // 以上方法以 post开头的允许你处理Runnable对象
    25         //sendMessage()允许你处理Message对象(Message里可以包含数据,)
    26 
    27         MyThread m = new MyThread();
    28         new Thread(m).start();
    29     }
    30 
    31     /**
    32     * 接受消息,处理消息 ,此Handler会与当前主线程一块运行
    33     * */
    34 
    35     class MyHandler extends Handler {
    36         public MyHandler() {
    37         }
    38 
    39         public MyHandler(Looper L) {
    40             super(L);
    41         }
    42 
    43         // 子类必须重写此方法,接受数据
    44         @Override
    45         public void handleMessage(Message msg) {
    46             // TODO Auto-generated method stub
    47             Log.d("MyHandler", "handleMessage......");
    48             super.handleMessage(msg);
    49             // 此处可以更新UI
    50             Bundle b = msg.getData();
    51             String color = b.getString("color");
    52             MyHandlerActivity.this.button.append(color);
    53 
    54         }
    55     }
    56 
    57     class MyThread implements Runnable {
    58         public void run() {
    59 
    60             try {
    61                 Thread.sleep(10000);
    62             } catch (InterruptedException e) {
    63                 // TODO Auto-generated catch block
    64                 e.printStackTrace();
    65             }
    66 
    67             Log.d("thread.......", "mThread........");
    68             Message msg = new Message();
    69             Bundle b = new Bundle();// 存放数据
    70             b.putString("color", "我的");
    71             msg.setData(b);
    72 
    73             MyHandlerActivity.this.myHandler.sendMessage(msg); // 向Handler发送消息,更新UI
    74 
    75         }
    76     }
    77 
    78 } 

 
