---
layout:     post
title:      java同步容器与并发容器
keywords:   java,同步，并发
category:   java
description: 在编程的时候经常会用到容器，当容器被多线程读取的时候我们就要考虑线程安全的问题，哪些容器是线程是线程安全的，容器的哪些操作又是线程安全的，这些安全机制是怎么实现的，本文将一一介绍。
tags:		[java]
---

在编程的时候经常会用到容器，当容器被多线程读取的时候我们就要考虑线程安全的问题，哪些容器是线程是线程安全的，容器的哪些操作又是线程安全的，这些安全机制是怎么实现的，本文将一一介绍。

----------
# 同步容器 #

**1. vector和hashtable**

jdk很早的时候就支持vector和hashtable，vector内部是一个数组，它的同步是在所有对元素的存取操作上进行synchronized的，也就是说每个时刻只能由一个线程可以访问容器的元素，这种线程安全是比较粗粒度的。
比如你在进行vector容器的迭代操作(iterator.next())时再调用vector.put(object o)时会抛出ConcurrentModificationException

----------

hashtable的内部实现：
  首先回顾下hashmap的实现，我们初始化一个hashmap时有两个参数inital capacity用来定义hashmap的初始化buckets数，reload factor加载因子，初始值为0.75，当hashmap中entry的数量超过这个比值时hashmap就会进行扩容，然后所有的entry进行rehash，这两个初始参数都必须选择合适的值，如果inital capacity选择太小，由于容器是开链的，会给查找元素增加额外的负担，reload factor不能选的过大，否则插入元素时出现碰撞的几率会增大。
hashtable就是在hashmap的基础上对所有元素的访问和插入操作用synchronized关键字同步，同样，在对容器元素迭代访问时进行插入操作会抛出ConcurrentModificationException。

----------
**2. collections.synchronizedXXX工厂方法创建**

  collections.synchronizedXXX是在jdk2引入的，和vector,hashtable一样，都是在整个容器上进行同步操作。
举个例子，下面这个是jdk7种collections.synchronizedMap的实现，这里只列出部分代码：

	private static class SynchronizedMap<K,V>
        implements Map<K,V>, Serializable {
        private static final long serialVersionUID = 1978198479659022715L;

        private final Map<K,V> m;     // Backing Map
        final Object      mutex;        // Object on which to synchronize

        SynchronizedMap(Map<K,V> m) {
            this.m = Objects.requireNonNull(m);
            mutex = this;
        }

        SynchronizedMap(Map<K,V> m, Object mutex) {
            this.m = m;
            this.mutex = mutex;
        }
		//所有的操作都是在同一个监视器上进行同步
        public int size() {
            synchronized (mutex) {return m.size();}
        }
        public boolean isEmpty() {
            synchronized (mutex) {return m.isEmpty();}
        }
        public boolean containsKey(Object key) {
            synchronized (mutex) {return m.containsKey(key);}
        }
        public boolean containsValue(Object value) {
            synchronized (mutex) {return m.containsValue(value);}
        }
        public V get(Object key) {
            synchronized (mutex) {return m.get(key);}
        }

        public V put(K key, V value) {
            synchronized (mutex) {return m.put(key, value);}
        }
        public V remove(Object key) {
            synchronized (mutex) {return m.remove(key);}
        }
        public void putAll(Map<? extends K, ? extends V> map) {
            synchronized (mutex) {m.putAll(map);}
        }
        public void clear() {
            synchronized (mutex) {m.clear();}
        }

----------
# 并发容器 #
JDK5中添加了新的concurrent包，其中包含了很多并发容器，这些容器针对多线程环境进行了优化，大大提高了容器类在并发环境下的执行效率。
下面所有的代码都是来源于jdk7。

## CopyOnWriteArrayList ##

CopyOnWriteArrayList类是一个线程安全的List接口的实现，在该类的内部进行元素的**写操作时，底层的数组将被完整的复制**，这对于读操作远远多于写操作的应用非常适合。在CopyOnWriteArrayList上进行操作时，**读操作不需要加锁，而写操作类实现中对其进行了加锁**。

底层实现如下：

    public class CopyOnWriteArrayList<E>  
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable {  
  
    /** The lock protecting all mutators */
    final transient ReentrantLock lock = new ReentrantLock();

    /** The array, accessed only via getArray/setArray. */
    private transient volatile Object[] array;
	 final Object[] getArray() {
        return array;
    }

      ...  
    }  

读写操作：

	 @SuppressWarnings("unchecked")
    private E get(Object[] a, int index) {
        return (E) a[index];
    }

    public E get(int index) {
        return get(getArray(), index);
    }
	//使用ReentrantLock加锁保护
	 public E set(int index, E element) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] elements = getArray();
            E oldValue = get(elements, index);

            if (oldValue != element) {
                int len = elements.length;
	//创建一个新的数组，复制原来的元素
                Object[] newElements = Arrays.copyOf(elements, len);
	//set的元素
                newElements[index] = element;
                setArray(newElements);
            } else {
    // 替换底层的数组
                setArray(elements);
            }
            return oldValue;
        } finally {
            lock.unlock();
        }
    }

 特别注意：在CopyOnWriteArrayList上获得的Iterator是不能进行set和remove操作的，否则会抛出ConcurrentModificationException。

----------
## BlockingQueue ##
BlockingQueue接口定义了一种阻塞的FIFO queue，基于生产者消费者模式，每一个BlockingQueue都有一个容量，让容量满时往BlockingQueue中添加数据时会造成阻塞，当容量为空时取元素操作会阻塞。

ArrayBlockingQueue是对BlockingQueue的一个数组实现，它使用一把全局的锁并行对queue的读写操作，同时使用两个Condition阻塞容量为空时的取操作和容量满时的写操作。
底层实现：

	public class ArrayBlockingQueue<E> extends AbstractQueue<E>  
        implements BlockingQueue<E>, java.io.Serializable {  
  
    // 使用循环数组来实现queue，初始时takeIndex和putIndex均为0  
    private final E[] items;  
    private transient int takeIndex;  
    private transient int putIndex;  
    private int count;  
  
    // 用于并发的锁和条件  
    private final ReentrantLock lock;  
    private final Condition notEmpty;  
    private final Condition notFull;  
  
    /** 
     * 循环数组 
     * Circularly increment i. 
     */  
    final int inc(int i) {  
        return (++i == items.length)? 0 : i;  
    }  
  
    public ArrayBlockingQueue(int capacity, boolean fair) {  
        if (capacity <= 0)  
            throw new IllegalArgumentException();  
        this.items = (E[]) new Object[capacity];  
        // 分配锁及该锁上的condition  
        lock = new ReentrantLock(fair);  
        notEmpty = lock.newCondition();  
        notFull =  lock.newCondition();  
    }  
  
      ...  
    }  

 ArrayBlockingQueue的取操作：
	
	public class ArrayBlockingQueue<E> extends AbstractQueue<E>  
        implements BlockingQueue<E>, java.io.Serializable {  
  
    private E extract() {  
        final E[] items = this.items;  
        E x = items[takeIndex];  
        items[takeIndex] = null;  
        takeIndex = inc(takeIndex);  
        --count;  
       // 激发notFull条件  
        notFull.signal();  
        return x;  
    }  
  
     /** 
     * condition的await的语义如下： 
     *　与condition相关的锁以原子方式释放，并禁用该线程 
     *　方法返回时，线程必须获得与该condition相关的锁 
     */  
    public E take() throws InterruptedException {  
        final ReentrantLock lock = this.lock;  
        lock.lockInterruptibly();  
        try {  
            try {  
                  // 等待notEmpty的条件  
                while (count == 0)  
                    notEmpty.await();  
            } catch (InterruptedException ie) {  
			// 唤醒其他正在等待的线程  
                notEmpty.signal(); 
	  
                throw ie;  
            }  
            E x = extract();  
            return x;  
        } finally {  
            lock.unlock();  
        }  
    }  
      
      ...  
    }  

ArrayBlockingQueue的写操作：

	public class ArrayBlockingQueue<E> extends AbstractQueue<E>  
        implements BlockingQueue<E>, java.io.Serializable {  
  
    private void insert(E x) {  
        items[putIndex] = x;  
        putIndex = inc(putIndex);  
        ++count;  
        notEmpty.signal();  
    }  
  
    public void put(E o) throws InterruptedException {  
        if (o == null) throw new NullPointerException();  
        final E[] items = this.items;  
        final ReentrantLock lock = this.lock;  
        lock.lockInterruptibly();  
        try {  
            try {  
                  // 等待notFull条件  
           while (count == items.length)  
                    notFull.await();  
            } catch (InterruptedException ie) {  
        // 唤醒其他正在等待的线程      
				  notFull.signal(); 
	
                throw ie;  
            }  
            insert(o);  
        } finally {  
            lock.unlock();  
        }  
    }  
  
      ...  
    }  

注意：ArrayBlockingQueue**在读写操作上都需要锁住整个容器**，因此吞吐量与一般的实现是相似的，适合于实现“生产者消费者”模式。

## LinkedBlockingQueue ##

LinkedBlockingQueue是BlockingQueue的一种使用Link List的实现，它**对头和尾（取和添加操作）采用两把不同的锁**，相对于ArrayBlockingQueue提高了吞吐量。它也是一种阻塞型的容器，适合于实现“消费者生产者”模式。

  LinkedBlockingQueue底层的定义如下：

	public class LinkedBlockingQueue<E> extends AbstractQueue<E>  
        implements BlockingQueue<E>, java.io.Serializable {  
  
    static class Node<E> {  
        /** The item, volatile to ensure barrier separating write and read */  

        volatile E item;  
        Node<E> next;  
        Node(E x) { item = x; }  
    }  
  
    // 支持原子操作  
    private final AtomicInteger count = new AtomicInteger(0);  
  
    // 链表的头和尾  
    private transient Node<E> head;  
    private transient Node<E> last;  
  
    // 针对取和添加操作的两把锁及其上的条件  
    private final ReentrantLock takeLock = new ReentrantLock();  
    private final Condition notEmpty = takeLock.newCondition();  

    private final ReentrantLock putLock = new ReentrantLock();  
    private final Condition notFull = putLock.newCondition();  
  
       ...  
    } 

  LinkedBlockingQueue的添加操作：

	public class LinkedBlockingQueue<E> extends AbstractQueue<E>  
        implements BlockingQueue<E>, java.io.Serializable {  
  
    private void insert(E x) {  
        last = last.next = new Node<E>(x);  
    }  
  
    /** 
     * signal方法在被调用时，当前线程必须拥有该condition相关的锁! 
     * Signal a waiting take. Called only from put/offer (which do not otherwise ordinarily lock takeLock.) 
     */  
    private void signalNotEmpty() {  
        final ReentrantLock takeLock = this.takeLock;  
        takeLock.lock();  
        try {  
            notEmpty.signal();  
        } finally {  
            takeLock.unlock();  
        }  
    }  
  
    public void put(E o) throws InterruptedException {  
        if (o == null) throw new NullPointerException();  
        int c = -1;  
        final ReentrantLock putLock = this.putLock;  
        final AtomicInteger count = this.count;  
        // 使用putLock  
        putLock.lockInterruptibly();  
        try {  
            try {  
                  // 当容量已满时，等待notFull条件  
            while (count.get() == capacity)  
                    notFull.await();  
            } catch (InterruptedException ie) {  
                notFull.signal(); // propagate to a non-interrupted thread  
                throw ie;  
            }  
            insert(o);  
            // 取出当前值，并将原数据增加1  
            c = count.getAndIncrement();  
            // 容量不满，再次激活notFull上等待的put线程  
        if (c + 1 < capacity)  
                notFull.signal();  
        } finally {  
            putLock.unlock();  
        }  
        // 必须先释放putLock再在notEmpty上signal，否则会造成死锁  
     if (c == 0)  
            signalNotEmpty();  
    }  
      
      ...  
    }   

 LinkedBlockingQueue的取操作：

	public class LinkedBlockingQueue<E> extends AbstractQueue<E>  
        implements BlockingQueue<E>, java.io.Serializable {  
  
    private E extract() {  
        Node<E> first = head.next;  
        head = first;  
        E x = first.item;  
        first.item = null;  
        return x;  
    }  
  
    private void signalNotFull() {  
        final ReentrantLock putLock = this.putLock;  
        putLock.lock();  
        try {  
            notFull.signal();  
        } finally {  
            putLock.unlock();  
        }  
    }  
  
    public E take() throws InterruptedException {  
        E x;  
        int c = -1;  
        final AtomicInteger count = this.count;  
        final ReentrantLock takeLock = this.takeLock;  
        // 使用takeLock  
        takeLock.lockInterruptibly();  
        try {  
            try {  
                  // 若容量为空，等待notEmpty  
                while (count.get() == 0)  
                    notEmpty.await();  
            } catch (InterruptedException ie) {  
                notEmpty.signal(); // propagate to a non-interrupted thread  
                throw ie;  
            }  
  
            x = extract();  
            c = count.getAndDecrement();  
            // 再次激活notEmpty  
            if (c > 1)  
                notEmpty.signal();  
        } finally {  
            takeLock.unlock();  
        }  
        // take执行之前容量已满，则激活notFull  
        if (c == capacity)  
            signalNotFull();  
        return x;  
    }  
      
      ...  
    }  

----------

## ConcurrentHashMap ##

 ConcurrentHashMap是Map的一种并发实现，在该类中**元素的read操作都是无锁了，而write操作需要被同步**。这非常适合于读操作远大于写操作的情况。在实现过程中，ConcurrentHashMap将所有元素分成了若干个segment，每个segment是独立的，在一个segment上加锁并不影响其他segment的操作。segment本身是一个hashtable，对于一个加入ConcurrentHashMap的<key, value>对，key的hash值中的高位被用来索引segment，而低位用于segment中的索引。

虽然读操作不阻塞，但是读到的值可能不是最新的值，因为可能有其他线程又更新了元素，Iterator操作也是一样，包括size(),isEmpty(),containValue()返回的结果可能是错误的，而且每个时刻只有一个线程可以访问迭代器。

  segment是ConcurrentHashMap存储元素的基本段，它本身是一个hashtable的实现，read操作时无锁的，write需要同步，定义如下：
	
	public class ConcurrentHashMap<K, V> extends AbstractMap<K, V>  
        implements ConcurrentMap<K, V>, Serializable {  
  
  
    /** 
     *  key, hash, next都是不可改的 
    *  value值可被重写 
    */  
    static final class HashEntry<K,V> {  
        final K key;  
        final int hash;  
        volatile V value;  
        final HashEntry<K,V> next;  
  
        ...  
     }  
  
       static final class Segment<K,V> extends ReentrantLock   implements Serializable {  
  
        transient volatile int count;  
        transient volatile HashEntry[] table;  
        // 当segment中元素个数达到threshold时，需要rehash  
        transient int threshold;  
    }  
      
      ...  
    }

 segment的read操作：

	static final class Segment<K,V> extends ReentrantLock implements Serializable {  
  
      HashEntry<K,V> getFirst(int hash) {  
          HashEntry[] tab = table;  
          return (HashEntry<K,V>) tab[hash & (tab.length - 1)];  
      }  
      
     V get(Object key, int hash) { // 该操作是无锁的  
          if (count != 0) { // read-volatile  
              HashEntry<K,V> e = getFirst(hash);  
              while (e != null) {  
                  if (e.hash == hash && key.equals(e.key)) {  
                      V v = e.value;  
                      if (v != null)  
                          return v;  
						// recheck  
                      return readValueUnderLock(e);
 
                  }  
                  e = e.next;  
              }  
          }  
          return null;  
      }  
  
    ...  
    } 

  由于HashEntry当中的key和next都是final的，所以segment之上的操作不可能影响HashEntry列表之间相对的顺序，而value是可变的，当第一次读值失败时，尝试加锁读。
  segment的replace操作：  

	static final class Segment<K,V> extends ReentrantLock implements Serializable {  
  
       /** 
       * replace操作是就地替换，HashEntry的value是非final的 
       */  
        boolean replace(K key, int hash, V oldValue, V newValue) {  
            lock();  // replace操作是同步的  
        try {  
                // 得到该hash值对应的entry列表  
           HashEntry<K,V> e = getFirst(hash);  
           while (e != null && (e.hash != hash || !				key.equals(e.key)))  
                 e = e.next;  
 
                boolean replaced = false;  
                if (e != null && oldValue.equals(e.value)) { 	// 替换  
             		 replaced = true;  
                     e.value = newValue;  
                }  
                return replaced;  
            } finally {  
                unlock();  
            }  
        }  
      
      ...  
    }  

segment的remove操作一种copy on write 的方法，保留被删元素之后的列表，copy被删元素之前的hashEntry：

	static final class Segment<K,V> extends ReentrantLock implements Serializable {  
  
        V remove(Object key, int hash, Object value) {  
            lock();  
            try {  
                int c = count - 1;  
                HashEntry[] tab = table;  
                int index = hash & (tab.length - 1);  
                HashEntry<K,V> first = (HashEntry<K,V>)tab[index];  
                HashEntry<K,V> e = first;  
                while (e != null && (e.hash != hash || !key.equals(e.key)))  
                    e = e.next;  
  
                V oldValue = null;  
                if (e != null) {  
                    V v = e.value;  
                    if (value == null || value.equals(v)) { // copy on write  
                        oldValue = v;  
                        ++modCount;  
                        // e之后的列表可以保留，只需要重新创建e之前的HashEntry即可  
                 HashEntry<K,V> newFirst = e.next;  
                        // copy on write e之前的HashEntry  
                        for (HashEntry<K,V> p = first; p != e; p = p.next)  
                            newFirst = new HashEntry<K,V>(p.key, p.hash,    
                                                          newFirst, p.value);  
                        tab[index] = newFirst;  
                        count = c; // write-volatile  
                    }  
                }  
                return oldValue;  
            } finally {  
                unlock();  
            }  
        }  
  
      ...  
    }  

segment的rehash操作实现比较特别，为了保证rehash过程中copy的元素尽可能少，segment在rehash时Entry入口的个数是以2的倍数增长，这可以保证一个entry在rehash之后要么在原来的列表中，要么在下一个列表中：

	static final class Segment<K,V> extends ReentrantLock implements Serializable {  
  
        void rehash() {  
            // 局部变量引用table  
            HashEntry[] oldTable = table;              
            int oldCapacity = oldTable.length;  
            if (oldCapacity >= MAXIMUM_CAPACITY)  
                return;  
  
            // 右移1位相当于乘以2  
            HashEntry[] newTable = new HashEntry[oldCapacity << 1];  
            threshold = (int)(newTable.length * loadFactor);  
            int sizeMask = newTable.length - 1;  
            for (int i = 0; i < oldCapacity ; i++) {  
                // 第i个entry列表  
           HashEntry<K,V> e = (HashEntry<K,V>)oldTable[i];  
  
                if (e != null) {  
                    HashEntry<K,V> next = e.next;  
                    // 在新table上的索引  
                    int idx = e.hash & sizeMask;  
  
                    if (next == null)  
                        newTable[idx] = e;  
                    else {  
                        // 寻找该entry列表末端，rehash之后idx相同的元素  
                        // 这些元素不需要被copy  
                        HashEntry<K,V> lastRun = e;  
                        int lastIdx = idx;  
                        for (HashEntry<K,V> last = next;  
                             last != null;  
                             last = last.next) {  
                            int k = last.hash & sizeMask;  
                            if (k != lastIdx) {  
                                lastIdx = k;  
                                lastRun = last;  
                            }  
                        }  
                        // 将lastRun之后的整个列表挂到新位置上  
                        newTable[lastIdx] = lastRun;  
  
                        // Clone all remaining nodes  
                        for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {  
                            int k = p.hash & sizeMask;  
                            HashEntry<K,V> n = (HashEntry<K,V>)newTable[k];  
                            newTable[k] = new HashEntry<K,V>(p.key, p.hash,  
                                                             n, p.value);  
                        }  
                    }  
                }  
            }  
            table = newTable;  
        }  
  
      ...  
    }


 ConcurrentHashMap在Segment的基础上，通过首先将<key, value>对hash到一个segment，再由segment实现对entry的管理。

ConcurrentHashMap的get实现：
	
	public class ConcurrentHashMap<K, V> extends AbstractMap<K, V>  
        implements ConcurrentMap<K, V>, Serializable {  
  
    final Segment<K,V> segmentFor(int hash) {  
        return (Segment<K,V>) segments[(hash >>> segmentShift) & segmentMask];  
    }  
  
    public V get(Object key) {  
        int hash = hash(key); // throws NullPointerException if key null  
        return segmentFor(hash).get(key, hash);  
    }  
  
      ...  
    }  

ConcurrentHashMap的put和get方法：


	public class ConcurrentHashMap<K, V> extends AbstractMap<K, V>  
        implements ConcurrentMap<K, V>, Serializable {  
  
    public V put(K key, V value) {  
        if (value == null)  
            throw new NullPointerException();  
        int hash = hash(key);  
        return segmentFor(hash).put(key, hash, value, false);  
    }  
  
    public V remove(Object key) {  
        int hash = hash(key);  
        return segmentFor(hash).remove(key, hash, null);  
    }  
  
  ...  
}

----------

## ConcurrentLinkedQueue ##

ConcurrentLinkedQueue充分使用了atomic包的实现**打造了一个无锁并发线程安全的队列**。对比锁机制的实现，个人认为使用无锁机制的难点在于要充分考虑线程间的协调。简单的说就是多个线程对内部数据结构进行访问时，如果其中一个线程执行的中途因为一些原因出现故障，其他的线程能够检测并帮助完成剩下的操作。这就需要把对数据结构的操作过程精细的划分成多个状态或阶段，考虑每个阶段或状态多线程访问会出现的情况。上述的难点在此次分析的并发Queue的实现中有很好的说明。

对于多线程同时访问容器元素的情况，concurrentLinkedQueue是一个很好的选择，因为所有的操作都是非阻塞的，所以它的迭代操作返回的结果并不是最新的，不会出现concurrentmodificationException。

而且不像很多其他容器，ConcurrentLinkedQueue的size()操作不是常量时间，返回的结果也不一定是准确的。

	public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>  
        implements Queue<E>, java.io.Serializable {  
    private static final long serialVersionUID = 196745693267521676L;  
  
    private static class Node<E> {  
        private volatile E item;  
        private volatile Node<E> next;  
  
        private static final  
            AtomicReferenceFieldUpdater<Node, Node>  
            nextUpdater =  
            AtomicReferenceFieldUpdater.newUpdater  
            (Node.class, Node.class, "next");  
        private static final  
            AtomicReferenceFieldUpdater<Node, Object>  
            itemUpdater =  
            AtomicReferenceFieldUpdater.newUpdater  
            (Node.class, Object.class, "item");  
  
        Node(E x) { item = x; }  
  
        Node(E x, Node<E> n) { item = x; next = n; }  
  
        E getItem() {  
            return item;  
        }  
  
        boolean casItem(E cmp, E val) {  
            return itemUpdater.compareAndSet(this, cmp, val);  
        }  
  
        void setItem(E val) {  
            itemUpdater.set(this, val);  
        }  
  
        Node<E> getNext() {  
            return next;  
        }  
  
        boolean casNext(Node<E> cmp, Node<E> val) {  
            return nextUpdater.compareAndSet(this, cmp, val);  
        }  
  
        void setNext(Node<E> val) {  
            nextUpdater.set(this, val);  
        }  
  
    }  
  
    private static final  
        AtomicReferenceFieldUpdater<ConcurrentLinkedQueue, Node>  
        tailUpdater =  
        AtomicReferenceFieldUpdater.newUpdater  
        (ConcurrentLinkedQueue.class, Node.class, "tail");  
    private static final  
        AtomicReferenceFieldUpdater<ConcurrentLinkedQueue, Node>  
        headUpdater =  
        AtomicReferenceFieldUpdater.newUpdater  
        (ConcurrentLinkedQueue.class,  Node.class, "head");  
  
    private boolean casTail(Node<E> cmp, Node<E> val) {  
        return tailUpdater.compareAndSet(this, cmp, val);  
    }  
  
    private boolean casHead(Node<E> cmp, Node<E> val) {  
        return headUpdater.compareAndSet(this, cmp, val);  
    }  
  
    private transient volatile Node<E> head = new Node<E>(null, null);  
  
    private transient volatile Node<E> tail = head;  
    ...  
    }  


先看看其内部数据结构Node的实现。由于使用了原子字段更新器`AtomicReferenceFieldUpdater<T,V>`（其中T表示持有字段的类的类型，V表示字段的类型），所以其对应的需要更新的字段要使用volatile进行声明。其`newUpdater(Class<U> tclass, Class<W> vclass, String fieldName)`方法实例化一个指定字段的更新器，参数分别表示：持有需要更新字段的类，字段的类，要更新的字段的名称。Node的内部变量item，next分别有对应自己的字段更新器，并且包含了对其原子性操作的方法`compareAndSet(T obj, V expect, V update)`，其中T是持有被设置字段的对象，后两者分别是期望值和新值。 


对于ConcurrentLinkedQueue自身也有**两个volatile的线程共享变量：head，tail分别对应队列的头指针和尾指针**。要保证这个队列的线程安全就是保证对这两个Node的引用的访问（更新，查看）的原子性和可见性，由于volatile本身能够保证可见性，所以就是对其修改的原子性要被保证：

	public boolean offer(E e) {  
    if (e == null) throw new NullPointerException();  
    Node<E> n = new Node<E>(e, null);  
    for (;;) {  
        Node<E> t = tail;  
        Node<E> s = t.getNext();  
        if (t == tail) { //-----------------------------a  
            if (s == null) { //-------------------------b  
                if (t.casNext(s, n)) { //---------------c  
                    casTail(t, n); //-------------------d  
                    return true;  
                }  
            } else {  
                casTail(t, s); //-----------------------e  
            }  
        }  
    }  
}  

offer()方法都很熟悉了，就是入队的操作。涉及到改变尾指针的操作，所以要看这个方法实现是否保证了原子性。CAS操作配合循环是原子性操作的保证，这里也不例外。此方法的循环内首先获得尾指针和其next指向的对象，由于tail和Node的next均是volatile的，所以保证了获得的分别都是最新的值。 

----------


- 代码a：`t==tail`是最上层的协调，如果其他线程改变了tail的引用，则说明现在获得不是最新的尾指针需要重新循环获得最新的值。 

- 代码b：`s==null`的判断。静止状态下tail的next一定是指向null的，但是多线程下的另一个状态就是中间态：tail的指向没有改变，但是其next已经指向新的结点，即完成tail引用改变前的状态，这时候`s!=null`。这里就是协调的典型应用，直接进入代码e去协调参与中间态的线程去完成最后的更新，然后重新循环获得新的tail开始自己的新一次的入队尝试。另外值得注意的是a,b之间，其他的线程可能会改变tail的指向，使得协调的操作失败。从这个步骤可以看到无锁实现的复杂性。
 
- 代码c：`t.casNext(s, n)`是入队的第一步，因为入队需要两步：更新Node的next，改变tail的指向。代码c之前可能发生tail引用指向的改变或者进入更新的中间态，这两种情况均会使得t指向的元素的next属性被原子的改变，不再指向null。这时代码c操作失败，重新进入循环。
 
- 代码d：这是完成更新的最后一步了，就是更新tail的指向，最有意思的协调在这儿又有了体现。从代码看`casTail(t, n)`不管是否成功都会接着返回true标志着更新的成功。首先如果成功则表明本线程完成了两步的更新，返回true是理所当然的；如果 `casTail(t, n)`不成功呢？要清楚的是完成代码c则代表着更新进入了中间态，代码d不成功则是tail的指向被其他线程改变。意味着对于其他的线程而言：它们得到的是中间态的更新，`s!=null`，进入代码e帮助本线程执行最后一步并且先于本线程成功。这样本线程虽然代码d失败了，但是是由于别的线程的协助先完成了，所以返回true也就理所当然了。 
 

----------
   
通过分析这个入队的操作，可以清晰的看到无锁实现的每个步骤和状态下多线程之间的协调和工作。理解了入队的整个过程，出队的操作`poll()`的实现也就变得简单了。基本上是大同小异的，无非就是同时牵涉到了head和tail的状态，在改变head的同时照顾到tail的协调，在此不多赘述。下面介绍一下其无锁下的查看访问，其内部不单单是查看更包含了线程间的协调，这是无锁实现的一个特点。不管是`contains()，size()`还是isEmpty()，只要获得了head后面第一个最新的Node就可以很轻松的实现，毕竟Node的`getNext()和getItem()`返回的都是对应的最新值。所以先看看这些方法内部的first()如何获得最新的第一个Node： 

	Node<E> first() {  
    for (;;) {  
        Node<E> h = head;  
        Node<E> t = tail;  
        Node<E> first = h.getNext();  
        if (h == head) { //----------------  ---------a  
            if (h == t) { //--------------------------b  
                if (first ==null) --------------------c  
                    return null;  
                else  
                    casTail(t, first); //-------------d  
            } else {  
                if (first.getItem() != null) //-------e  
                    return first;  
                else
				 // remove deleted node and continue  
                    casHead(h, first); //-------------f  
            }  
        }  
    }  
}  

此方法在尝试获得最新的第一个非head结点的时候，在不同的阶段同样在协调着head和tail的更新任务，让人感觉无锁的世界没有纯粹的工作，呵呵。 
- 代码a：还是最上层的协调，head指向没改变的情况下才继续下面的操作。这时侯head只可能是静止的，因为`poll()`出队操作的步骤是反着的：首先更新head的指向进入中间态，然后更新原head的next的item为null。 

- 代码b：之所以`h==t`的情况独立于其他的情况(在出队`poll()`方法中同样)，主要是因为`first!=null`时可能对应着某一个更新的中间态，而产生中间态的的必要条件就是代码b成立。如果`h==t`则表示当前线程获得的首尾指针指向同一个结点，当然代码b执行之后可能其他线程会进行head或者tail的更新。
 
- 代码c：`first==null`表明tail并没有进入更新的中间态而是处于静止状态，并且由于tail指向的是head的指向，所以返回null是唯一的选择。但是这美好的一切都是建立在代码b和代码c之间没有其他的线程更新tail。一旦有其他的线程执行了入队的操作并至少进入中间态的话，`h==t和first==null`都遗憾的成立，这就造成了取得幻象值，而实际上h.getNext()已经不再为null。个人认为代码c改成`if((first = h.getNext()) == null)`更能提高命中率。 

- 代码d：只要`first!=null，本线程则去尝试协调其他的线程先完成tail的更新，等待循环再次获取最新的head和tail。 

- 代码e：此处first一定不为null，tail更新与否不影响first的item的获取，但是head的更新会有影响。如果head正在被另一个线程更新并进入中间态，既是poll()内的`else if (casHead(h, first))` 成功，但是并没有执行first.setItem(null)之前。此时代码e是满足的，返回的也是当前的first的，但是随后head全部更新成功则first的item为null。所以此处返回的first的item并不一定是`item!=null`的结点，在使用此方法获得的结点的item时一定要再次的进行判断，这点在contains(...)等方法内都有体现。 

- 代码f：如果first的`item==null`，则更新head的指向。直观上看似乎多余，因为出队的操作是先更新head的指向再更新item为null的。但是另一个方法remove(...)则仅仅更新item的值而不改变head的指向，所以针对这样的多线程调用，代码f变得非常的必需了。 

----------------
这样通过这两个方法的分析可以推及对ConcurrentLinkedQueue共享变量的其他操作的实现，这样的无锁的实现印象最深的就是要考虑线程间的协调。不像锁机制的实现虽然牺牲了一定的性能，但是至少操作这些非线程安全的共享变量时不用过多的考虑其他线程的操作。