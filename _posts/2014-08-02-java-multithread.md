---
layout: post
title:  java并发和多线程
keywords: java, MultiThread
categories : [java]
tags : [java, 多线程]
---
注：本文的内容翻译自[http://tutorials.jenkov.com/java-concurrency/deadlock.html][1]

在过去单CPU时代，单任务在一个时间点只能执行单一程序。之后发展到多任务阶段，计算机能在同一时间点并行执行多任务或多进程。虽然并不是真正意义上的“同一时间点”，而是多个任务或进程共享一个CPU，并交由操作系统来完成多任务间对CPU的运行切换，以使得每个任务都有机会获得一定的时间片运行。

随着多任务对软件开发者带来的新挑战，程序不在能假设独占所有的CPU时间、所有的内存和其他计算机资源。一个好的程序榜样是在其不再使用这些资源时对其进行释放，以使得其他程序能有机会使用这些资源。

再后来发展到多线程技术，使得在一个程序内部能拥有多个线程并行执行。一个线程的执行可以被认为是一个CPU在执行该程序。当一个程序运行在多线程下，就好像有多个CPU在同时执行该程序。

多线程比多任务更加有挑战。多线程是在同一个程序内部并行执行，因此会对相同的内存空间进行并发读写操作。这可能是在单线程程序中从来不会遇到的问题。其中的一些错误也未必会在单CPU机器上出现，因为两个线程从来不会得到真正的并行执行。然而，更现代的计算机伴随着多核CPU的出现，也就意味着不同的线程能被不同的CPU核得到真正意义的并行执行。
本文将会介绍java多线程编程的一些要点：
##如何创建并运行java线程
###创建Thread的子类

创建Thread子类的一个实例并重写run方法，run方法会在调用start()方法之后被执行。例子如下：

    public class MyThread extends Thread {
       public void run(){
         System.out.println("MyThread running");
       }
    }

可以用如下方式创建并运行上述Thread子类

    MyThread myThread = new MyThread();
    myTread.start();

一旦线程启动后start方法就会立即返回，而不会等待到run方法执行完毕才返回。就好像run方法是在另外一个cpu上执行一样。当run方法执行后，将会打印出字符串MyThread running。

你也可以如下创建一个Thread的匿名子类：


    Thread thread = new Thread(){
       public void run(){
         System.out.println("Thread Running");
       }
    };
    thread.start();

当新的线程的run方法执行以后，计算机将会打印出字符串”Thread Running”。
###实现Runnable接口

第二种编写线程执行代码的方式是新建一个实现了java.lang.Runnable接口的类的实例，实例中的方法可以被线程调用。下面给出例子：

    public class MyRunnable implements Runnable {
       public void run(){
        System.out.println("MyRunnable running");
       }
    }

为了使线程能够执行run()方法，需要在Thread类的构造函数中传入 MyRunnable的实例对象。示例如下：

    Thread thread = new Thread(new MyRunnable());
    thread.start();
当线程运行时，它将会调用实现了Runnable接口的run方法。上例中将会打印出”MyRunnable running”。

同样，也可以创建一个实现了Runnable接口的匿名类，如下所示：


    Runnable myRunnable = new Runnable(){
       public void run(){
         System.out.println("Runnable running");
       }
    }
    Thread thread = new Thread(myRunnable);
    thread.start();

##java同步块
ava中的同步块用synchronized标记。同步块在Java中是同步在某个对象上。所有同步在一个对象上的同步块在同时只能被一个线程进入并执行操作。所有其他等待进入该同步块的线程将被阻塞，直到执行该同步块中的线程退出。

有四种不同的同步块：

 1. 实例方法 
 2. 静态方法 
 3. 实例方法中的同步块 
 4. 静态方法中的同步块

上述同步块都同步在不同对象上。实际需要那种同步块视具体情况而定。

**实例方法同步**

下面是一个同步的实例方法：

    public synchronized void add(int value){
    this.count += value;
     }

注意在方法声明中同步（synchronized ）关键字。这告诉Java该方法是同步的。

Java实例方法同步是同步在拥有该方法的对象上。这样，每个实例其方法同步都同步在不同的对象上，即该方法所属的实例。只有一个线程能够在实例方法同步块中运行。如果有多个实例存在，那么一个线程一次可以在一个实例同步块中执行操作。一个实例一个线程。

**静态方法同步**

静态方法同步和实例方法同步方法一样，也使用synchronized 关键字。Java静态方法同步如下示例：

    public static synchronized void add(int value){
     count += value;
     }

同样，这里synchronized 关键字告诉Java这个方法是同步的。

静态方法的同步是指同步在该方法所在的类对象上。因为在Java虚拟机中一个类只能对应一个类对象，所以同时只允许一个线程执行同一个类中的静态同步方法。

对于不同类中的静态同步方法，一个线程可以执行每个类中的静态同步方法而无需等待。不管类中的那个静态同步方法被调用，一个类只能由一个线程同时执行。

**实例方法中的同步块**

有时你不需要同步整个方法，而是同步方法中的一部分。Java可以对方法的一部分进行同步。

在非同步的Java方法中的同步块的例子如下所示：

    public void add(int value){
        synchronized(this){
           this.count += value;
        }
      }

示例使用Java同步块构造器来标记一块代码是同步的。该代码在执行时和同步方法一样。

注意Java同步块构造器用括号将对象括起来。在上例中，使用了“this”，即为调用add方法的实例本身。在同步构造器中用括号括起来的对象叫做监视器对象。上述代码使用监视器对象同步，同步实例方法使用调用方法本身的实例作为监视器对象。

一次只有一个线程能够在同步于同一个监视器对象的Java方法内执行。

下面两个例子都同步他们所调用的实例对象上，因此他们在同步的执行效果上是等效的。


    public class MyClass {
       public synchronized void log1(String msg1, String msg2){
          log.writeln(msg1);
          log.writeln(msg2);
       }
       
       public void log2(String msg1, String msg2){
          synchronized(this){
             log.writeln(msg1);
             log.writeln(msg2);
          }
       }
     }

在上例中，每次只有一个线程能够在两个同步块中任意一个方法内执行。

如果第二个同步块不是同步在this实例对象上，那么两个方法可以被线程同时执行。

**静态方法中的同步块**

和上面类似，下面是两个静态方法同步的例子。这些方法同步在该方法所属的类对象上。

    public class MyClass {
        public static synchronized void log1(String msg1, String msg2){
           log.writeln(msg1);
           log.writeln(msg2);
        }
        public static void log2(String msg1, String msg2){
           synchronized(MyClass.class){
              log.writeln(msg1);
              log.writeln(msg2);
           }
        }
      }

这两个方法不允许同时被线程访问。

如果第二个同步块不是同步在MyClass.class这个对象上。那么这两个方法可以同时被线程访问。

##Java同步实例

在下面例子中，启动了两个线程，都调用Counter类同一个实例的add方法。因为同步在该方法所属的实例上，所以同时只能有一个线程访问该方法。

    public class Counter{
         long count = 0;
         public synchronized void add(long value){
           this.count += value;
         }
      }
      public class CounterThread extends Thread{
     
         protected Counter counter = null;
     
         public CounterThread(Counter counter){
            this.counter = counter;
         }
     
         public void run() {
        for(int i=0; i<10; i++){
               counter.add(i);
            }
         }
      }
      public class Example {
        public static void main(String[] args){
          Counter counter = new Counter();
          Thread  threadA = new CounterThread(counter);
          Thread  threadB = new CounterThread(counter);
          threadA.start();
          threadB.start();
        }
      }

创建了两个线程。他们的构造器引用同一个Counter实例。Counter.add方法是同步在实例上，是因为add方法是实例方法并且被标记上synchronized关键字。因此每次只允许一个线程调用该方法。另外一个线程必须要等到第一个线程退出add()方法时，才能继续执行方法。

如果两个线程引用了两个不同的Counter实例，那么他们可以同时调用add()方法。这些方法调用了不同的对象，因此这些方法也就同步在不同的对象上。这些方法调用将不会被阻塞。如下面这个例子所示：

    public class Example {
       public static void main(String[] args){
         Counter counterA = new Counter();
         Counter counterB = new Counter();
         Thread  threadA = new CounterThread(counterA);
         Thread  threadB = new CounterThread(counterB);
         threadA.start();
         threadB.start();
       }
     }

注意这两个线程，threadA和threadB，不再引用同一个counter实例。CounterA和counterB的add方法同步在他们所属的对象上。调用counterA的add方法将不会阻塞调用counterB的add方法。

##线程间通信
线程通信的目标是使线程间能够互相发送信号。另一方面，线程通信使线程能够等待其他线程的信号。

例如，线程B可以等待线程A的一个信号，这个信号会通知线程B数据已经准备好了。本文将讲解以下几个JAVA线程间通信的主题：

1、通过共享对象通信
       2、忙等待
       3、wait(),notify()和notifyAll()
       4、丢失的信号
       5、假唤醒
       6、多线程等待相同信号
       7、不要对常量字符串或全局对象调用wait()

**1、通过共享对象通信**
线程间发送信号的一个简单方式是在共享对象的变量里设置信号值。线程A在一个同步块里设置boolean型成员变量hasDataToProcess为true，线程B也在同步块里读取hasDataToProcess这个成员变量。这个简单的例子使用了一个持有信号的对象，并提供了set和check方法:

    public class MySignal{
    
      protected boolean hasDataToProcess = false;
    
      public synchronized boolean hasDataToProcess(){
        return this.hasDataToProcess;
      }
      public synchronized void setHasDataToProcess(boolean hasData){
        this.hasDataToProcess = hasData;
      }
    }

线程A和B必须获得指向一个MySignal共享实例的引用，以便进行通信。如果它们持有的引用指向不同的MySingal实例，那么彼此将不能检测到对方的信号。需要处理的数据可以存放在一个共享缓存区里，它和MySignal实例是分开存放的。

**2、忙等待(Busy Wait)**
准备处理数据的线程B正在等待数据变为可用。换句话说，它在等待线程A的一个信号，这个信号使hasDataToProcess()返回true。线程B运行在一个循环里，以等待这个信号：

    protected MySignal sharedSignal = ...
    ...
    while(!sharedSignal.hasDataToProcess()){
      //do nothing... busy waiting
    }

**3、wait(),notify()和notifyAll()**
忙等待没有对运行等待线程的CPU进行有效的利用，除非平均等待时间非常短。否则，让等待线程进入睡眠或者非运行状态更为明智，直到它接收到它等待的信号。

Java有一个内建的等待机制来允许线程在等待信号的时候变为非运行状态。java.lang.Object 类定义了三个方法，wait()、notify()和notifyAll()来实现这个等待机制。

一个线程一旦调用了任意对象的wait()方法，就会变为非运行状态，直到另一个线程调用了同一个对象的notify()方法。为了调用wait()或者notify()，线程必须先获得那个对象的锁。也就是说，线程必须在同步块里调用wait()或者notify()。以下是MySingal的修改版本——使用了wait()和notify()的MyWaitNotify：


    public class MonitorObject{
    }
    public class MyWaitNotify{
      MonitorObject myMonitorObject = new MonitorObject();
      public void doWait(){
        synchronized(myMonitorObject){
          try{
            myMonitorObject.wait();
          } catch(InterruptedException e){...}
        }
      }
      public void doNotify(){
        synchronized(myMonitorObject){
          myMonitorObject.notify();
        }
      }
    }

等待线程将调用doWait()，而唤醒线程将调用doNotify()。当一个线程调用一个对象的notify()方法，正在等待该对象的所有线程中将有一个线程被唤醒并允许执行（校注：这个将被唤醒的线程是随机的，不可以指定唤醒哪个线程）。同时也提供了一个notifyAll()方法来唤醒正在等待一个给定对象的所有线程。

如你所见，不管是等待线程还是唤醒线程都在同步块里调用wait()和notify()。这是强制性的！一个线程如果没有持有对象锁，将不能调用wait()，notify()或者notifyAll()。否则，会抛出IllegalMonitorStateException异常。

（校注：JVM是这么实现的，当你调用wait时候它首先要检查下当前线程是否是锁的拥有者，不是则抛出IllegalMonitorStateExcept，参考JVM源码的 1422行。）

但是，这怎么可能？等待线程在同步块里面执行的时候，不是一直持有监视器对象（myMonitor对象）的锁吗？等待线程不能阻塞唤醒线程进入doNotify()的同步块吗？答案是：的确不能。一旦线程调用了wait()方法，它就释放了所持有的监视器对象上的锁。这将允许其他线程也可以调用wait()或者notify()。

一旦一个线程被唤醒，不能立刻就退出wait()的方法调用，直到调用notify()的线程退出了它自己的同步块。换句话说：被唤醒的线程必须重新获得监视器对象的锁，才可以退出wait()的方法调用，因为wait方法调用运行在同步块里面。如果多个线程被notifyAll()唤醒，那么在同一时刻将只有一个线程可以退出wait()方法，因为每个线程在退出wait()前必须获得监视器对象的锁。

**4、丢失的信号（Missed Signals）**
notify()和notifyAll()方法不会保存调用它们的方法，因为当这两个方法被调用时，有可能没有线程处于等待状态。通知信号过后便丢弃了。因此，如果一个线程先于被通知线程调用wait()前调用了notify()，等待的线程将错过这个信号。这可能是也可能不是个问题。不过，在某些情况下，这可能使等待线程永远在等待，不再醒来，因为线程错过了唤醒信号。
为了避免丢失信号，必须把它们保存在信号类里。在MyWaitNotify的例子中，通知信号应被存储在MyWaitNotify实例的一个成员变量里。以下是MyWaitNotify的修改版本：


    public class MyWaitNotify2{
    
      MonitorObject myMonitorObject = new MonitorObject();
      boolean wasSignalled = false;
      public void doWait(){
        synchronized(myMonitorObject){
          if(!wasSignalled){
            try{
              myMonitorObject.wait();
             } catch(InterruptedException e){...}
          }
         //clear signal and continue running.
          wasSignalled = false;
        }
      }
    
      public void doNotify(){
        synchronized(myMonitorObject){
          wasSignalled = true;
          myMonitorObject.notify();
        }
      }
    }

留意doNotify()方法在调用notify()前把wasSignalled变量设为true。同时，留意doWait()方法在调用wait()前会检查wasSignalled变量。事实上，如果没有信号在前一次doWait()调用和这次doWait()调用之间的时间段里被接收到，它将只调用wait()。

（校注：为了避免信号丢失， 用一个变量来保存是否被通知过。在notify前，设置自己已经被通知过。在wait后，设置自己没有被通知过，需要等待通知。）

**5、假唤醒**
由于莫名其妙的原因，线程有可能在没有调用过notify()和notifyAll()的情况下醒来。这就是所谓的假唤醒（spurious wakeups）。无端端地醒过来了。

如果在MyWaitNotify2的doWait()方法里发生了假唤醒，等待线程即使没有收到正确的信号，也能够执行后续的操作。这可能导致你的应用程序出现严重问题。

为了防止假唤醒，保存信号的成员变量将在一个while循环里接受检查，而不是在if表达式里。这样的一个while循环叫做自旋锁（校注：这种做法要慎重，目前的JVM实现自旋会消耗CPU，如果长时间不调用doNotify方法，doWait方法会一直自旋，CPU会消耗太大）。被唤醒的线程会自旋直到自旋锁(while循环)里的条件变为false。以下MyWaitNotify2的修改版本展示了这点：

    public class MyWaitNotify3{
      MonitorObject myMonitorObject = new MonitorObject();
      boolean wasSignalled = false;
      public void doWait(){
        synchronized(myMonitorObject){
          while(!wasSignalled){
            try{
              myMonitorObject.wait();
             } catch(InterruptedException e){...}
          }
          //clear signal and continue running.
          wasSignalled = false;
        }
      }
      public void doNotify(){
        synchronized(myMonitorObject){
          wasSignalled = true;
          myMonitorObject.notify();
        }
      }
    }

留意wait()方法是在while循环里，而不在if表达式里。如果等待线程没有收到信号就唤醒，wasSignalled变量将变为false,while循环会再执行一次，促使醒来的线程回到等待状态。

**6、多个线程等待相同信号**
如果你有多个线程在等待，被notifyAll()唤醒，但只有一个被允许继续执行，使用while循环也是个好方法。每次只有一个线程可以获得监视器对象锁，意味着只有一个线程可以退出wait()调用并清除wasSignalled标志（设为false）。一旦这个线程退出doWait()的同步块，其他线程退出wait()调用，并在while循环里检查wasSignalled变量值。但是，这个标志已经被第一个唤醒的线程清除了，所以其余醒来的线程将回到等待状态，直到下次信号到来。

**7、不要在字符串常量或全局对象中调用wait()**
（校注：这里说的字符串常量指的是值为常量的变量）

本文早期的一个版本在MyWaitNotify例子里使用字符串常量（””）作为管程对象。以下是那个例子：

    public class MyWaitNotify{
      String myMonitorObject = "";
      boolean wasSignalled = false;
      public void doWait(){
        synchronized(myMonitorObject){
          while(!wasSignalled){
            try{
              myMonitorObject.wait();
             } catch(InterruptedException e){...}
          }
          //clear signal and continue running.
          wasSignalled = false;
        }
      }
      public void doNotify(){
        synchronized(myMonitorObject){
          wasSignalled = true;
          myMonitorObject.notify();
        }
      }
    }

在空字符串作为锁的同步块(或者其他常量字符串)里调用wait()和notify()产生的问题是，JVM/编译器内部会把常量字符串转换成同一个对象。这意味着，即使你有2个不同的MyWaitNotify实例，它们都引用了相同的空字符串实例。同时也意味着存在这样的风险：在第一个MyWaitNotify实例上调用doWait()的线程会被在第二个MyWaitNotify实例上调用doNotify()的线程唤醒。这种情况可以画成以下这张图：

起初这可能不像个大问题。毕竟，如果doNotify()在第二个MyWaitNotify实例上被调用，真正发生的事不外乎线程A和B被错误的唤醒了 。这个被唤醒的线程（A或者B）将在while循环里检查信号值，然后回到等待状态，因为doNotify()并没有在第一个MyWaitNotify实例上调用，而这个正是它要等待的实例。这种情况相当于引发了一次假唤醒。线程A或者B在信号值没有更新的情况下唤醒。但是代码处理了这种情况，所以线程回到了等待状态。记住，即使4个线程在相同的共享字符串实例上调用wait()和notify()，doWait()和doNotify()里的信号还会被2个MyWaitNotify实例分别保存。在MyWaitNotify1上的一次doNotify()调用可能唤醒MyWaitNotify2的线程，但是信号值只会保存在MyWaitNotify1里。

问题在于，由于doNotify()仅调用了notify()而不是notifyAll()，即使有4个线程在相同的字符串（空字符串）实例上等待，只能有一个线程被唤醒。所以，如果线程A或B被发给C或D的信号唤醒，它会检查自己的信号值，看看有没有信号被接收到，然后回到等待状态。而C和D都没被唤醒来检查它们实际上接收到的信号值，这样信号便丢失了。这种情况相当于前面所说的丢失信号的问题。C和D被发送过信号，只是都不能对信号作出回应。

如果doNotify()方法调用notifyAll()，而非notify()，所有等待线程都会被唤醒并依次检查信号值。线程A和B将回到等待状态，但是C或D只有一个线程注意到信号，并退出doWait()方法调用。C或D中的另一个将回到等待状态，因为获得信号的线程在退出doWait()的过程中清除了信号值(置为false)。

看过上面这段后，你可能会设法使用notifyAll()来代替notify()，但是这在性能上是个坏主意。在只有一个线程能对信号进行响应的情况下，没有理由每次都去唤醒所有线程。

所以：在wait()/notify()机制中，不要使用全局对象，字符串常量等。应该使用对应唯一的对象。例如，每一个MyWaitNotify3的实例（前一节的例子）拥有一个属于自己的监视器对象，而不是在空字符串上调用wait()/notify()。

校注：

管程 (英语：Monitors，也称为监视器) 是对多个工作线程实现互斥访问共享资源的对象或模块。这些共享资源一般是硬件设备或一群变量。管程实现了在一个时间点，最多只有一个线程在执行它的某个子程序。与那些通过修改数据结构实现互斥访问的并发程序设计相比，管程很大程度上简化了程序设计。

##死锁


死锁是两个或更多线程阻塞着等待其它处于死锁状态的线程所持有的锁。死锁通常发生在多个线程同时但以不同的顺序请求同一组锁的时候。

例如，如果线程1锁住了A，然后尝试对B进行加锁，同时线程2已经锁住了B，接着尝试对A进行加锁，这时死锁就发生了。线程1永远得不到B，线程2也永远得不到A，并且它们永远也不会知道发生了这样的事情。为了得到彼此的对象（A和B），它们将永远阻塞下去。这种情况就是一个死锁。


该情况如下：

    Thread 1  locks A, waits for B
    Thread 2  locks B, waits for A

这里有一个TreeNode类的例子，它调用了不同实例的synchronized方法：

    public class TreeNode {
        TreeNode parent   = null; 
        List children = new ArrayList();
     
        public synchronized void addChild(TreeNode child){
            if(!this.children.contains(child)) {
                this.children.add(child);
                child.setParentOnly(this);
            }
        }
        public synchronized void addChildOnly(TreeNode child){
            if(!this.children.contains(child){
                this.children.add(child);
            }
        }
        public synchronized void setParent(TreeNode parent){
            this.parent = parent;
            parent.addChildOnly(this);
        }
        public synchronized void setParentOnly(TreeNode parent){
            this.parent = parent;
        }
    }

如果线程1调用parent.addChild(child)方法的同时有另外一个线程2调用child.setParent(parent)方法，两个线程中的parent表示的是同一个对象，child亦然，此时就会发生死锁。下面的伪代码说明了这个过程：

    Thread 1: parent.addChild(child); //locks parent
              --> child.setParentOnly(parent);
    
    Thread 2: child.setParent(parent); //locks child
              --> parent.addChildOnly()

首先线程1调用parent.addChild(child)。因为addChild()是同步的，所以线程1会对parent对象加锁以不让其它线程访问该对象。

然后线程2调用child.setParent(parent)。因为setParent()是同步的，所以线程2会对child对象加锁以不让其它线程访问该对象。

现在child和parent对象被两个不同的线程锁住了。接下来线程1尝试调用child.setParentOnly()方法，但是由于child对象现在被线程2锁住的，所以该调用会被阻塞。线程2也尝试调用parent.addChildOnly()，但是由于parent对象现在被线程1锁住，导致线程2也阻塞在该方法处。现在两个线程都被阻塞并等待着获取另外一个线程所持有的锁。

注意：像上文描述的，这两个线程需要同时调用parent.addChild(child)和child.setParent(parent)方法，并且是同一个parent对象和同一个child对象，才有可能发生死锁。上面的代码可能运行一段时间才会出现死锁。

这些线程需要同时获得锁。举个例子，如果线程1稍微领先线程2，然后成功地锁住了A和B两个对象，那么线程2就会在尝试对B加锁的时候被阻塞，这样死锁就不会发生。因为线程调度通常是不可预测的，因此没有一个办法可以准确预测什么时候死锁会发生，仅仅是可能会发生。

**更复杂的死锁**

死锁可能不止包含2个线程，这让检测死锁变得更加困难。下面是4个线程发生死锁的例子：

    Thread 1  locks A, waits for B
    Thread 2  locks B, waits for C
    Thread 3  locks C, waits for D
    Thread 4  locks D, waits for A

线程1等待线程2，线程2等待线程3，线程3等待线程4，线程4等待线程1。

**数据库的死锁**

更加复杂的死锁场景发生在数据库事务中。一个数据库事务可能由多条SQL更新请求组成。当在一个事务中更新一条记录，这条记录就会被锁住避免其他事务的更新请求，直到第一个事务结束。同一个事务中每一个更新请求都可能会锁住一些记录。

当多个事务同时需要对一些相同的记录做更新操作时，就很有可能发生死锁，例如：

    Transaction 1, request 1, locks record 1 for update
    Transaction 2, request 1, locks record 2 for update
    Transaction 1, request 2, tries to lock record 2 for update.
    Transaction 2, request 2, tries to lock record 1 for update.

因为锁发生在不同的请求中，并且对于一个事务来说不可能提前知道所有它需要的锁，因此很难检测和避免数据库事务中的死锁。


  [1]: http://tutorials.jenkov.com/java-concurrency/deadlock.html