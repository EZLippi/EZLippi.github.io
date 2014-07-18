---
layout:     post
title:      从android.os.NetworkOnMainThreadException引发的思考
keywords:   java   
category:   java
tags:       [java, android]
---

最近在写一个网络通信的程序，运行的时候抛出了这样一个异常，`android.os.NetworkOnMainThreadException`，找了很久没发现原因，后来查了下资料才知道是android的UI线程不能直接进行网络访问的操作。
##什么是UI线程？

> The concept and importance of the application's main **UI thread** is
> something every Android developer should understand. Each time an
> application is launched, the system creates a thread called "main" for
> the application. The main thread (also known as the "UI thread") is in
> charge of dispatching events to the appropriate views/widgets and thus
> is very important. It's also the thread where your application
> interacts with running components of your application's UI. For
> instance, if you touch a button on the screen, the UI thread
> dispatches the touch event to the view, which then sets its pressed
> state and posts an invalidate request to the event queue. The UI
> thread dequeues this request and then tells the view to redraw itself.
> 
> This single-thread model can yield poor performance unless Android
> applications are implemented properly. Specifically, if the UI thread
> was in charge of running everything in your entire application,
> performing long operations such as network access or database queries
> on the UI thread would block the entire user interface. No event would
> be able to be dispatched—including drawing and touchscreen
> events—while the long operation is underway. From the user's
> perspective, the application will appear to be frozen.
> 
> In these situations, instant feedback is vital. Studies show that **0.1**
> seconds is about the limit for having the user feel that the system is
> reacting instantaneously. Anything slower than this limit will
> probably be considered as **lag** (Miller 1968; Card et al. 1991). While a
> fraction of a second might not seem harmful, even a tenth of a second
> can be the difference between a good review and a bad review on Google
> Play. Even worse, if the UI thread is blocked for more than about five
> seconds, the user is presented with the notorious "application not
> responding" (ANR) dialog and the app is force closed.


----------


##为什么你的App Crashes？
The reason why your application crashes on Android versions 3.0 and above, but works fine on Android 2.x is because Honeycomb and Ice Cream Sandwich are much stricter about abuse against the UI Thread. For example, when an Android device running HoneyComb or above detects a network access on the UI thread, a NetworkOnMainThreadException will be thrown:

    E/AndroidRuntime(673): java.lang.RuntimeException: Unable to start activity
        ComponentInfo{com.example/com.example.ExampleActivity}:android.os.NetworkOnMainThreadException
在Android developer网站对NetworkOnMainThreadException是这样解释的：

> A NetworkOnMainThreadException is thrown when an application attempts
> to perform a networking operation on its main thread. This is only
> thrown for applications targeting the Honeycomb SDK or higher.
> Applications targeting earlier SDK versions are allowed to do
> networking on their main event loop threads, but it's heavily
> discouraged.

**安卓3.0以上不允许在UI线程执行以下操作：**

 1. 打开一个Socket连接(比如new Socket()).
 2. HTTP请求(比如HTTPClient and HTTPUrlConnection).
 3. 尝试访问远程MySQL数据库.
 4. 下载文件(Downloader.downloadFile()).

If you are attempting to perform any of these operations on the UI thread, you must wrap them in a worker thread. The easiest way to do this is to use of an AsyncTask, which allows you to perform asynchronous work on your user interface. An AsyncTask will perform the blocking operations in a worker thread and will publish the results on the UI thread, without requiring you to handle threads and/or handlers yourself.

##Android AsyncTask完全解析
我们都知道，Android UI是线程不安全的，如果想要在子线程里进行UI操作，就需要借助Android的异步消息处理机制。

不过为了更加方便我们在子线程中更新UI元素，Android从1.5版本就引入了一个AsyncTask类，使用它就可以非常灵活方便地从子线程切换到UI线程，我们本篇文章的主角也就正是它了。

AsyncTask很早就出现在Android的API里了，所以我相信大多数朋友对它的用法都已经非常熟悉。不过今天我还是准备从AsyncTask的基本用法开始讲起，然后我们再来一起分析下AsyncTask源码，看看它是如何实现的，最后我会介绍一些关于AsyncTask你所不知道的秘密。

AsyncTask的基本用法
首先来看一下AsyncTask的基本用法，由于AsyncTask是一个抽象类，所以如果我们想使用它，就必须要创建一个子类去继承它。在继承时我们可以为AsyncTask类指定三个泛型参数，这三个参数的用途如下：

 - Params

在执行AsyncTask时需要传入的参数，可用于在后台任务中使用。

 - Progress

后台任务执行时，如果需要在界面上显示当前的进度，则使用这里指定的泛型作为进度单位。

 - Result

当任务执行完毕后，如果需要对结果进行返回，则使用这里指定的泛型作为返回值类型。

因此，一个最简单的自定义AsyncTask就可以写成如下方式：

[java] 

    class DownloadTask extends AsyncTask<Void, Integer, Boolean> {  
        ……  
    }  

这里我们把AsyncTask的第一个泛型参数指定为Void，表示在执行AsyncTask的时候不需要传入参数给后台任务。第二个泛型参数指定为Integer，表示使用整型数据来作为进度显示单位。第三个泛型参数指定为Boolean，则表示使用布尔型数据来反馈执行结果。
当然，目前我们自定义的DownloadTask还是一个空任务，并不能进行任何实际的操作，我们还需要去重写AsyncTask中的几个方法才能完成对任务的定制。经常需要去重写的方法有以下四个：

 - onPreExecute()

这个方法会在后台任务开始执行之间调用，用于进行一些界面上的初始化操作，比如显示一个进度条对话框等。

 - doInBackground(Params...)

这个方法中的所有代码都会在子线程中运行，我们应该在这里去处理所有的耗时任务。任务一旦完成就可以通过return语句来将任务的执行结果进行返回，如果AsyncTask的第三个泛型参数指定的是Void，就可以不返回任务执行结果。注意，在这个方法中是不可以进行UI操作的，如果需要更新UI元素，比如说反馈当前任务的执行进度，可以调用publishProgress(Progress...)方法来完成。

 - onProgressUpdate(Progress...)

当在后台任务中调用了publishProgress(Progress...)方法后，这个方法就很快会被调用，方法中携带的参数就是在后台任务中传递过来的。在这个方法中可以对UI进行操作，利用参数中的数值就可以对界面元素进行相应的更新。

 - onPostExecute(Result)

当后台任务执行完毕并通过return语句进行返回时，这个方法就很快会被调用。返回的数据会作为参数传递到此方法中，可以利用返回的数据来进行一些UI操作，比如说提醒任务执行的结果，以及关闭掉进度条对话框等。

因此，一个比较完整的自定义AsyncTask就可以写成如下方式：

[java] 

    class DownloadTask extends AsyncTask<Void, Integer, Boolean> {  
      
        @Override  
    protected void onPreExecute() {  
        progressDialog.show();  
    }  
  
    @Override  
    protected Boolean doInBackground(Void... params) {  
        try {  
            while (true) {  
                int downloadPercent = doDownload();  
                publishProgress(downloadPercent);  
                if (downloadPercent >= 100) {  
                    break;  
                }  
            }  
        } catch (Exception e) {  
            return false;  
        }  
        return true;  
    }  
  
    @Override  
    protected void onProgressUpdate(Integer... values) {  
        progressDialog.setMessage("当前下载进度：" + values[0] + "%");  
    }  
  
    @Override  
    protected void onPostExecute(Boolean result) {  
        progressDialog.dismiss();  
        if (result) {  
            Toast.makeText(context, "下载成功", Toast.LENGTH_SHORT).show();  
        } else {  
            Toast.makeText(context, "下载失败", Toast.LENGTH_SHORT).show();  
        }  
    }  
}  
这里我们模拟了一个下载任务，在doInBackground()方法中去执行具体的下载逻辑，在onProgressUpdate()方法中显示当前的下载进度，在onPostExecute()方法中来提示任务的执行结果。如果想要启动这个任务，只需要简单地调用以下代码即可：
[java] 

    new DownloadTask().execute();  

以上就是AsyncTask的基本用法，怎么样，是不是感觉在子线程和UI线程之间进行切换变得灵活了很多？我们并不需求去考虑什么异步消息处理机制，也不需要专门使用一个Handler来发送和接收消息，只需要调用一下publishProgress()方法就可以轻松地从子线程切换到UI线程了。
分析AsyncTask的源码
虽然AsyncTask这么简单好用，但你知道它是怎样实现的吗？那么接下来，我们就来分析一下AsyncTask的源码，对它的实现原理一探究竟。注意这里我选用的是Android 4.0的源码，如果你查看的是其它版本的源码，可能会有一些出入。

从之前DownloadTask的代码就可以看出，在启动某一个任务之前，要先new出它的实例，因此，我们就先来看一看AsyncTask构造函数中的源码，如下所示：

[java] 

    public AsyncTask() {  
        mWorker = new WorkerRunnable<Params, Result>() {  
            public Result call() throws Exception {  
                mTaskInvoked.set(true);  
                Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);  
                return postResult(doInBackground(mParams));  
            }  
        };  
        mFuture = new FutureTask<Result>(mWorker) {  
            @Override  
            protected void done() {  
                try {  
                    final Result result = get();  
                    postResultIfNotInvoked(result);  
                } catch (InterruptedException e) {  
                    android.util.Log.w(LOG_TAG, e);  
                } catch (ExecutionException e) {  
                    throw new RuntimeException("An error occured while executing doInBackground()",  
                            e.getCause());  
                } catch (CancellationException e) {  
                    postResultIfNotInvoked(null);  
                } catch (Throwable t) {  
                    throw new RuntimeException("An error occured while executing "  
                            + "doInBackground()", t);  
                }  
            }  
        };  
    }  

这段代码虽然看起来有点长，但实际上并没有任何具体的逻辑会得到执行，只是初始化了两个变量，mWorker和mFuture，并在初始化mFuture的时候将mWorker作为参数传入。mWorker是一个Callable对象，mFuture是一个FutureTask对象，这两个变量会暂时保存在内存中，稍后才会用到它们。
接着如果想要启动某一个任务，就需要调用该任务的execute()方法，因此现在我们来看一看execute()方法的源码，如下所示：

[java] 

    public final AsyncTask<Params, Progress, Result> execute(Params... params) {  
        return executeOnExecutor(sDefaultExecutor, params);  
    }  

简单的有点过分了，只有一行代码，仅是调用了executeOnExecutor()方法，那么具体的逻辑就应该写在这个方法里了，快跟进去瞧一瞧：
[java]

    public final AsyncTask<Params, Progress, Result> executeOnExecutor(Executor exec,  
            Params... params) {  
        if (mStatus != Status.PENDING) {  
            switch (mStatus) {  
                case RUNNING:  
                    throw new IllegalStateException("Cannot execute task:"  
                            + " the task is already running.");  
                case FINISHED:  
                    throw new IllegalStateException("Cannot execute task:"  
                            + " the task has already been executed "  
                            + "(a task can be executed only once)");  
            }  
        }  
        mStatus = Status.RUNNING;  
        onPreExecute();  
        mWorker.mParams = params;  
        exec.execute(mFuture);  
        return this;  
    }  

果然，这里的代码看上去才正常点。可以看到，在第15行调用了onPreExecute()方法，因此证明了onPreExecute()方法会第一个得到执行。可是接下来的代码就看不明白了，怎么没见到哪里有调用doInBackground()方法呢？别着急，慢慢找总会找到的，我们看到，在第17行调用了Executor的execute()方法，并将前面初始化的mFuture对象传了进去，那么这个Executor对象又是什么呢？查看上面的execute()方法，原来是传入了一个sDefaultExecutor变量，接着找一下这个sDefaultExecutor变量是在哪里定义的，源码如下所示：
[java]

    public static final Executor SERIAL_EXECUTOR = new SerialExecutor();  
    ……  
    private static volatile Executor sDefaultExecutor = SERIAL_EXECUTOR;  

可以看到，这里先new出了一个SERIAL_EXECUTOR常量，然后将sDefaultExecutor的值赋值为这个常量，也就是说明，刚才在executeOnExecutor()方法中调用的execute()方法，其实也就是调用的SerialExecutor类中的execute()方法。那么我们自然要去看看SerialExecutor的源码了，如下所示：
[java] 

    private static class SerialExecutor implements Executor {  
        final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();  
        Runnable mActive;  
      
        public synchronized void execute(final Runnable r) {  
            mTasks.offer(new Runnable() {  
                public void run() {  
                    try {  
                        r.run();  
                    } finally {  
                        scheduleNext();  
                    }  
                }  
            });  
            if (mActive == null) {  
                scheduleNext();  
            }  
        }  
      
        protected synchronized void scheduleNext() {  
            if ((mActive = mTasks.poll()) != null) {  
                THREAD_POOL_EXECUTOR.execute(mActive);  
            }  
        }  
    }  

SerialExecutor类中也有一个execute()方法，这个方法里的所有逻辑就是在子线程中执行的了，注意这个方法有一个Runnable参数，那么目前这个参数的值是什么呢？当然就是mFuture对象了，也就是说在第9行我们要调用的是FutureTask类的run()方法，而在这个方法里又会去调用Sync内部类的innerRun()方法，因此我们直接来看innerRun()方法的源码：
[java] 

    void innerRun() {  
        if (!compareAndSetState(READY, RUNNING))  
            return;  
        runner = Thread.currentThread();  
        if (getState() == RUNNING) { // recheck after setting thread  
            V result;  
            try {  
                result = callable.call();  
            } catch (Throwable ex) {  
                setException(ex);  
                return;  
            }  
            set(result);  
        } else {  
            releaseShared(0); // cancel  
        }  
    } 

 
可以看到，在第8行调用了callable的call()方法，那么这个callable对象是什么呢？其实就是在初始化mFuture对象时传入的mWorker对象了，此时调用的call()方法，也就是一开始在AsyncTask的构造函数中指定的，我们把它单独拿出来看一下，代码如下所示：
[java]

    public Result call() throws Exception {  
        mTaskInvoked.set(true);  
        Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);  
        return postResult(doInBackground(mParams));  
    } 

 
在postResult()方法的参数里面，我们终于找到了doInBackground()方法的调用处，虽然经过了很多周转，但目前的代码仍然是运行在子线程当中的，所以这也就是为什么我们可以在doInBackground()方法中去处理耗时的逻辑。接着将doInBackground()方法返回的结果传递给了postResult()方法，这个方法的源码如下所示：
[java] 

    private Result postResult(Result result) {  
        Message message = sHandler.obtainMessage(MESSAGE_POST_RESULT,  
                new AsyncTaskResult<Result>(this, result));  
        message.sendToTarget();  
        return result;  
    } 

 
如果你已经熟悉了异步消息处理机制，这段代码对你来说一定非常简单吧。这里使用sHandler对象发出了一条消息，消息中携带了MESSAGE_POST_RESULT常量和一个表示任务执行结果的AsyncTaskResult对象。这个sHandler对象是InternalHandler类的一个实例，那么稍后这条消息肯定会在InternalHandler的handleMessage()方法中被处理。InternalHandler的源码如下所示：
[java] 

    private static class InternalHandler extends Handler {  
        @SuppressWarnings({"unchecked", "RawUseOfParameterizedType"})  
        @Override  
        public void handleMessage(Message msg) {  
            AsyncTaskResult result = (AsyncTaskResult) msg.obj;  
            switch (msg.what) {  
                case MESSAGE_POST_RESULT:  
                    // There is only one result  
                    result.mTask.finish(result.mData[0]);  
                    break;  
                case MESSAGE_POST_PROGRESS:  
                    result.mTask.onProgressUpdate(result.mData);  
                    break;  
            }  
        }  
    }

  
这里对消息的类型进行了判断，如果这是一条MESSAGE_POST_RESULT消息，就会去执行finish()方法，如果这是一条MESSAGE_POST_PROGRESS消息，就会去执行onProgressUpdate()方法。那么finish()方法的源码如下所示：
[java] 

    private void finish(Result result) {  
        if (isCancelled()) {  
            onCancelled(result);  
        } else {  
            onPostExecute(result);  
        }  
        mStatus = Status.FINISHED;  
    }  

可以看到，如果当前任务被取消掉了，就会调用onCancelled()方法，如果没有被取消，则调用onPostExecute()方法，这样当前任务的执行就全部结束了。
我们注意到，在刚才InternalHandler的handleMessage()方法里，还有一种MESSAGE_POST_PROGRESS的消息类型，这种消息是用于当前进度的，调用的正是onProgressUpdate()方法，那么什么时候才会发出这样一条消息呢？相信你已经猜到了，查看publishProgress()方法的源码，如下所示：

[java] 

    protected final void publishProgress(Progress... values) {  
        if (!isCancelled()) {  
            sHandler.obtainMessage(MESSAGE_POST_PROGRESS,  
                    new AsyncTaskResult<Progress>(this, values)).sendToTarget();  
        }  
    }

  
非常清晰了吧！正因如此，在doInBackground()方法中调用publishProgress()方法才可以从子线程切换到UI线程，从而完成对UI元素的更新操作。其实也没有什么神秘的，因为说到底，AsyncTask也是使用的异步消息处理机制，只是做了非常好的封装而已。
读到这里，相信你对AsyncTask中的每个回调方法的作用、原理、以及何时会被调用都已经搞明白了吧。

**关于AsyncTask你所不知道的秘密**
不得不说，刚才我们在分析SerialExecutor的时候，其实并没有分析的很仔细，仅仅只是关注了它会调用mFuture中的run()方法，但是至于什么时候会调用我们并没有进一步地研究。其实SerialExecutor也是AsyncTask在3.0版本以后做了最主要的修改的地方，它在AsyncTask中是以常量的形式被使用的，因此在整个应用程序中的所有AsyncTask实例都会共用同一个SerialExecutor。下面我们就来对这个类进行更加详细的分析，为了方便阅读，我把它的代码再贴出来一遍：

[java] 

    private static class SerialExecutor implements Executor {  
        final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();  
        Runnable mActive;  
      
        public synchronized void execute(final Runnable r) {  
            mTasks.offer(new Runnable() {  
                public void run() {  
                    try {  
                        r.run();  
                    } finally {  
                        scheduleNext();  
                    }  
                }  
            });  
            if (mActive == null) {  
                scheduleNext();  
            }  
        }  
      
        protected synchronized void scheduleNext() {  
            if ((mActive = mTasks.poll()) != null) {  
                THREAD_POOL_EXECUTOR.execute(mActive);  
            }  
        }  
    } 

 
可以看到，SerialExecutor是使用ArrayDeque这个队列来管理Runnable对象的，如果我们一次性启动了很多个任务，首先在第一次运行execute()方法的时候，会调用ArrayDeque的offer()方法将传入的Runnable对象添加到队列的尾部，然后判断mActive对象是不是等于null，第一次运行当然是等于null了，于是会调用scheduleNext()方法。在这个方法中会从队列的头部取值，并赋值给mActive对象，然后调用THREAD_POOL_EXECUTOR去执行取出的取出的Runnable对象。之后如何又有新的任务被执行，同样还会调用offer()方法将传入的Runnable添加到队列的尾部，但是再去给mActive对象做非空检查的时候就会发现mActive对象已经不再是null了，于是就不会再调用scheduleNext()方法。
那么后面添加的任务岂不是永远得不到处理了？当然不是，看一看offer()方法里传入的Runnable匿名类，这里使用了一个try finally代码块，并在finally中调用了scheduleNext()方法，保证无论发生什么情况，这个方法都会被调用。也就是说，每次当一个任务执行完毕后，下一个任务才会得到执行，SerialExecutor模仿的是单一线程池的效果，如果我们快速地启动了很多任务，同一时刻只会有一个线程正在执行，其余的均处于等待状态。Android照片墙应用实现，再多的图片也不怕崩溃 这篇文章中例子的运行结果也证实了这个结论。

不过你可能还不知道，在Android 3.0之前是并没有SerialExecutor这个类的，那个时候是直接在AsyncTask中构建了一个sExecutor常量，并对线程池总大小，同一时刻能够运行的线程数做了规定，代码如下所示：

[java] 

    private static final int CORE_POOL_SIZE = 5;  
    private static final int MAXIMUM_POOL_SIZE = 128;  
    private static final int KEEP_ALIVE = 10;  
    ……  
    private static final ThreadPoolExecutor sExecutor = new ThreadPoolExecutor(CORE_POOL_SIZE,  
            MAXIMUM_POOL_SIZE, KEEP_ALIVE, TimeUnit.SECONDS, sWorkQueue, sThreadFactory);  

可以看到，这里规定同一时刻能够运行的线程数为5个，线程池总大小为128。也就是说当我们启动了10个任务时，只有5个任务能够立刻执行，另外的5个任务则需要等待，当有一个任务执行完毕后，第6个任务才会启动，以此类推。而线程池中最大能存放的线程数是128个，当我们尝试去添加第129个任务时，程序就会崩溃。
因此在3.0版本中AsyncTask的改动还是挺大的，在3.0之前的AsyncTask可以同时有5个任务在执行，而3.0之后的AsyncTask同时只能有1个任务在执行。为什么升级之后可以同时执行的任务数反而变少了呢？这是因为更新后的AsyncTask已变得更加灵活，如果不想使用默认的线程池，还可以自由地进行配置。比如使用如下的代码来启动任务：

[java] 

    Executor exec = new ThreadPoolExecutor(15, 200, 10,  
            TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());  
    new DownloadTask().executeOnExecutor(exec); 

 
这样就可以使用我们自定义的一个Executor来执行任务，而不是使用SerialExecutor。上述代码的效果允许在同一时刻有15个任务正在执行，并且最多能够存储200个任务。
好了，到这里我们就已经把关于AsyncTask的所有重要内容深入浅出地理解了一遍，相信在将来使用它的时候能够更加得心应手。

参考：

 1. [Why Ice Cream Sandwich Crashes your App][1]
 2. [AsyncTask][2]
 3. [Multithreading For Performance][3]


  [1]: http://www.androiddesignpatterns.com/2012/06/app-force-close-honeycomb-ics.html
  [2]: http://developer.android.com/reference/android/os/AsyncTask.html
  [3]: http://android-developers.blogspot.com/2010/07/multithreading-for-performance.html