---
layout: post
title: Volley源码分析
category: [java, android]
tag: network,　异步, Volley, android
---

说到Android的网络库，比较常用的就是Volley和okHttp了，最近重温了下Volley的源码，感觉应该写点什么．Volley 是 Google 推出的 Android 异步网络请求框架和图片加载框架，适合数据量小通信比较频繁的情形．

先看一下Volley的设计图：

![](/images/volley.png)

##请求Request

Volley里面每一个请求都是继承自Request抽象类，比如图中的StringRequest,JsonRequest,ImageRequest,请求最主要的几个属性有：http请求的方法method,请求资源url,是否应该缓存响应shouldCache,如果缓存的话就会有对应的缓存对象Cache.Entry,以及用来标识请求的序列号mSequence,当然这里的每一个请求是异步的，你还需要注册对应的响应监听器，`private final Listener<String> mListener;`,这个后面再讲．

##请求队列

请求队列是用来管理所有请求的，里面有四个集合类，如下所示：

{% highlight java %}
//这个waitingRequest是因为用户可能重复提交了相同的请求，第一次提交一个请求后
//会在这个Map里添加一个key,表示这个请求已经在处理了，如果再提交相同的请求就会
//把这个请求添加到这个key对应的请求队列里，并把第一次的请求加入到缓存队列里，
//后面再发出这个请求就可以从缓存中获取响应了
 private final Map<String, Queue<Request<?>>> mWaitingRequests =
		new HashMap<String, Queue<Request<?>>>();
//用来存储当前所有的请求
private final Set<Request<?>> mCurrentRequests = new HashSet<Request<?>>();
//这是个优先队列，存储那些需要缓存的请求，处理这类请求时，先从缓存中查询，
//如果缓存miss再把它丢进networkRequest中从网络中获取数据  
private final PriorityBlockingQueue<Request<?>> mCacheQueue =
		new PriorityBlockingQueue<Request<?>>();
//这个队列用于存储需要直接从网络中获取数据的请求
private final PriorityBlockingQueue<Request<?>> mNetworkQueue =
		new PriorityBlockingQueue<Request<?>>();
{% endhighlight %}

上面讲到请求是保存在优先队列中，那么请求按照什么排序呢？自然是优先级了，
如果优先级一样就按照序列号排序，先进先出．请求一共有四个优先级，如下所示：
	
{% highlight java %}
public enum Priority {
        LOW,
	NORMAL,
	HIGH,
	IMMEDIATE
}
{% endhighlight %}

既然是这样那么请求一定实现了java的`Comparable`接口了，没错，而且正如前面所说请求按照优先级和序列号来排序，如下所示：

{% highlight java %}
@Override
public int compareTo(Request<T> other) {
Priority left = this.getPriority();
Priority right = other.getPriority();

// High-priority requests are "lesser" so they are sorted to the front.
// Equal priorities are sorted by sequence number to provide FIFO ordering.
return left == right ?
        this.mSequence - other.mSequence :
        right.ordinal() - left.ordinal();
}
{% endhighlight %}

##请求分派RequestDispatcher

Volley里面有两个`Dispacher`,一个是`CacheDispatcher`,另一个是`NetworkDispatcher`,两个都是继承自线程，`CacheDispatcher`启动后从mCacheQueue里取出请求，根据请求的CacheKey(实际上是url)从缓存中检索数据，如果没有检索到数据就把它重新丢进`mNetworkQueue`中从网络中获取数据，如果缓存命中同时检查下缓存是否过期，如果缓存过期了照样要重新获取数据，否则调用`ResponseDelivery`把响应传递给相应的对象(实际上是调用请求注册的相应监听器)．
Volley默认启动了４个`NetworkDispatcher`线程来处理网络请求，为了避免过多的网络请求造成UI卡死，Volley默认把这些线程的优先级设置为后台线程`Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);`

##HttpStack

Volley的`NetworkDispatcher`线程默认调用的是Network类的`HttpStack`的方法来执行Http请求，HttpStack的实现有两种，如果系统在 Gingerbread 及之后(即 API Level >= 9)，采用基于 `HttpURLConnection` 的 HurlStack，如果小于 9，采用基于 HttpClient 的 `HttpClientStack`。

{% highlight java %}
if (stack == null) {
    if (Build.VERSION.SDK_INT >= 9) {
	stack = new HurlStack();
    } else {
	stack = new HttpClientStack(AndroidHttpClient.newInstance(userAgent));
    }
}
{% endhighlight %}

得到了 HttpStack,然后通过它构造一个代表网络（Network）的具体实现BasicNetwork。

### HttpURLConnection 和 AndroidHttpClient(HttpClient的封装)如何选择

在 Froyo(2.2) 之前，HttpURLConnection 有个重大 Bug，调用 close() 函数会影响连接池，导致连接复用失效，所以在 Froyo 之前使用 HttpURLConnection 需要关闭 keepAlive。
另外在 Gingerbread(2.3) HttpURLConnection 默认开启了 gzip 压缩，提高了 HTTPS 的性能，Ice Cream Sandwich(4.0) HttpURLConnection 支持了请求结果缓存。
再加上 HttpURLConnection 本身 API 相对简单，所以对 Android 来说，在 2.3 之后建议使用 HttpURLConnection，之前建议使用 AndroidHttpClient。

### 关于 User Agent

通过代码我们发现如果是使用 AndroidHttpClient，Volley 还会将请求头中的 User-Agent 字段设置为 App 的 ${packageName}/${versionCode}，如果异常则使用 "volley/0"，不过这个获取 User-Agent 的操作应该放到 if else 内部更合适。而对于 HttpURLConnection 却没有任何操作，为什么呢？
如果用 Fiddler 或 Charles 对数据抓包我们会发现，我们会发现 HttpURLConnection 默认是有 User-Agent 的，类似：

	Dalvik/1.6.0 (Linux; U; Android 4.1.1; Google Nexus 4 - 4.1.1 - API 16 - 768x1280_1 Build/JRO03S)

经常用 WebView 的同学会也许会发现似曾相识，是的，WebView 默认的 User-Agent 也是这个。实际在请求发出之前，会检测 User-Agent 是否为空，如果不为空，则加上系统默认 User-Agent。在 Android 2.1 之后，我们可以通过

	String userAgent = System.getProperty("http.agent");

得到系统默认的 User-Agent，Volley 如果希望自定义 User-Agent，可在自定义 Request 中重写 getHeaders() 函数

{% highlight java %}
@Override
public Map<String, String> getHeaders() throws AuthFailureError {
    // self-defined user agent
    Map<String, String> headerMap = new HashMap<String, String>();
    headerMap.put("User-Agent", "android-open-project-analysis/1.0");
    return headerMap;
}
{% endhighlight %}

##DiskBasedCache

Volley默认是把缓存保存在文件中，并在内存中保存了缓存的头部，缓存头部占的最大内存可以设置，便于快速查询缓存是否存在．CacheHeader的主要属性有
文件大小size,缓存的etag,获取缓存的key,ttl,softTtl以及responseHeader.根据key来查询缓存，先从内存中查询是否存在CacheHeader,如果存在再从文件中把响应的data再读出来．每次向缓存中插入数据时先看看是否达到了缓存的最大大小，如果超过了容量就按照LRU算法从缓存中删除一部分数据直到满足需求，LRU算法实现很简单，直接调用LinkedHashMap来实现，`private final Map<String, CacheHeader> mEntries = new LinkedHashMap<String, CacheHeader>(16,0.75f,true)`.

##ByteArrayPool

ByteArrayPool很有意思，这是一个字节数组池，Volley进行网络操作的时候会把HTTP响应的内容写入到字节数组中，如果频繁的申请大的字节数组可能会对系统性能有所影响，所以Volley采取了对象池的方法来解决频繁申请内存的问题，它的实现也比较简单，用的两个字节数组链表，一个按照使用的先后排序，另一个按照字节数组的大小排序，如下所示：

{% highlight java %}
private List<byte[]> mBuffersByLastUse = new LinkedList<byte[]>();
private List<byte[]> mBuffersBySize = new ArrayList<byte[]>(64);
{% endhighlight %}

池当然也有它的大小限制．申请字节数组的时候从mBuffersBySize中申请一个比请求大小更大的数组给他，如果没找到就调用new从堆中申请一个字节数组返回给它，数组用完之后调用returnBuff返回给数组池中，当数组池的大小超过了规定的大小时，就按照LRU算法删除一些数组．那么这个对象池具体在哪里用上了呢？答案是在BasicNetwork中，调用HttpStack返回了Http响应，然后需要把响应的Entity转换为字节数组，一般我们会用ByteArrayOutputStream来做，但是ByteArrayOutputStream是需要从堆中申请一个字节数组的，所以Volley创建了一个继承自ByteArrayOutputStream的类PoolingByteArrayOutputStream并覆写了相应的方法．不得不佩服谷歌的工程师啊，每个细节都考虑的很周到．

## 关于Http缓存

Volley中对Http缓存作了相应的处理，在使用BasicNetwork执行Request之前，会给请求添加相应的缓存首部，利用`If-None-Match`和`If-Modified-Since`对过期缓存或者不新鲜缓存，进行请求再验证,代码如下所示：

{% highlight java %}
private void addCacheHeaders(Map<String, String> headers, Cache.Entry entry) {
	// If there's no cache entry, we're done.
	if (entry == null) {
	    return;
	}

	if (entry.etag != null) {
	    headers.put("If-None-Match", entry.etag);
	}

	if (entry.serverDate > 0) {
	    Date refTime = new Date(entry.serverDate);
	    headers.put("If-Modified-Since", DateUtils.formatDate(refTime));
	}
    }
{% endhighlight %}

同样，在收到Http响应之后，Volley也会检查响应首部中的缓存字段，根据`Cache-Control`和`Expires`首部来计算缓存的过期时间。如果两个首部都存在情况下，以`Cache-Control`为准。代码如下所示：

{% highlight java %}
public static Cache.Entry parseCacheHeaders(NetworkResponse response) {
long now = System.currentTimeMillis();

Map<String, String> headers = response.headers;

long serverDate = 0;
long serverExpires = 0;
long softExpire = 0;
long maxAge = 0;
boolean hasCacheControl = false;

String serverEtag = null;
String headerValue;

headerValue = headers.get("Date");
if (headerValue != null) {
    serverDate = parseDateAsEpoch(headerValue);
}

headerValue = headers.get("Cache-Control");
if (headerValue != null) {
    hasCacheControl = true;
    String[] tokens = headerValue.split(",");
    for (int i = 0; i < tokens.length; i++) {
        String token = tokens[i].trim();
        if (token.equals("no-cache") || token.equals("no-store")) {
            return null;
        } else if (token.startsWith("max-age=")) {
            try {
                maxAge = Long.parseLong(token.substring(8));
            } catch (Exception e) {
            }
        } else if (token.equals("must-revalidate") || token.equals("proxy-revalidate")) {
            maxAge = 0;
        }
    }
}

headerValue = headers.get("Expires");
if (headerValue != null) {
    serverExpires = parseDateAsEpoch(headerValue);
}

serverEtag = headers.get("ETag");

// Cache-Control takes precedence over an Expires header, even if both exist and Expires
// is more restrictive.
if (hasCacheControl) {
    softExpire = now + maxAge * 1000;
} else if (serverDate > 0 && serverExpires >= serverDate) {
    // Default semantic for Expire header in HTTP specification is softExpire.
    softExpire = now + (serverExpires - serverDate);
}

Cache.Entry entry = new Cache.Entry();
entry.data = response.data;
entry.etag = serverEtag;
entry.softTtl = softExpire;
entry.ttl = entry.softTtl;
entry.serverDate = serverDate;
entry.responseHeaders = headers;

return entry;
}
{% endhighlight %}

读完Volley的源码之后只有一个感觉，就是`谷歌出品，必属精品`.
