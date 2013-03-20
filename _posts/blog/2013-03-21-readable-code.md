---
layout: post
title: 编写可读代码的艺术
description: 将《The Art of Readable Code》的读书笔记和一点自己的认识总结起来写就这么一篇博客，强烈推荐此书。
category: blog
---

这是《The Art of Readable Code》的读书笔记，再加一点自己的认识。强烈推荐此书：

- 英文版：[《The Art of Readable Code》][RCEN]
- 中文版：[编写可读代码的艺术][RCCN]

##代码为什么要易于理解

> "Code should be written to minimize the time it would take for someone else to understand it."

日常工作的事实是：

<ul>
<li>写代码前的思考和看代码的时间远大于真正写的时间</li>
<li>读代码是很平常的事情，不论是别人的，还是自己的，半年前写的可认为是别人的代码</li>
<li>代码可读性高，很快就可以理解程序的逻辑，进入工作状态</li>
<li>行数少的代码不一定就容易理解</li>
<li>代码的可读性与程序的效率、架构、易于测试一点也不冲突</li>
</ul>

整本书都围绕“如何让代码的可读性更高”这个目标来写。这也是好代码的重要标准之一。

##如何命名

###变量名中应包含更多信息

####使用含义明确的词，比如用`download`而不是`get`，参考以下替换方案：

     send -> deliver, dispatch, announce, distribute, route
     find -> search, extract, locate, recover
    start -> lanuch, create, begin, open
     make -> create,set up, build, generate, compose, add, new

####避免通用的词
像`tmp`和`retval`这样词，除了说明是临时变量和返回值之外，没有任何意义。但是给他加一些有意义的词，就会很明确：

    tmp_file = tempfile.NamedTemporaryFile() 
    ...
    SaveData(tmp_file, ...)

不使用retval而使用变量真正代表的意义：

    sum_squares += v[i]; // Where's the "square" that we're summing? Bug!

嵌套的for循环中,`i`、`j`也有同样让人困惑的时候：

    for (int i = 0; i < clubs.size(); i++)
        for (int j = 0; j < clubs[i].members.size(); j++)
            for (int k = 0; k < users.size(); k++) if (clubs[i].members[k] == users[j])
                cout << "user[" << j << "] is in club[" << i << "]" << endl;

换一种写法就会清晰很多：

     if (clubs[ci].members[mi] == users[ui])  # OK. First letters match.

所以，当使用一些通用的词，要有充分的理由才可以。

####使用具体的名字
`CanListenOnPort`就比`ServerCanStart`好，can start比较含糊，而listen on port确切的说明了这个方法将要做什么。

`--run_locally`就不如`--extra_logging`来的明确。

####增加重要的细节，比如变量的单位`_ms`，对原始字符串加`_raw`
如果一个变量很重要，那么在名字上多加一些额外的字就会更加易读，比如将`string id; // Example: "af84ef845cd8"`换成`string hex_id;`。

                 Start(int delay)  -->  delay → delay_secs
            CreateCache(int size)  -->  size → size_mb
    ThrottleDownload(float limit)  -->  limit → max_kbps
              Rotate(float angle)  -->  angle → degrees_cw

更多例子：

    password  ->  plaintext_password
     comment  ->  unescaped_comment
        html  ->  html_utf8
        data  ->  data_urlenc

####对于作用域大的变量使用较长的名字
在比较小的作用域内，可以使用较短的变量名，在较大的作用域内使用的变量，最好用长一点的名字，编辑器的自动补全都可以很好的减少键盘输入。对于一些缩写前缀，尽量选择众所周知的(如str)，一个判断标准是，当新成员加入时，是否可以无需他人帮助而明白前缀代表什么。

####合理使用`_`、`-`等符号，比如对私有变量加`_`前缀。

    var x = new DatePicker(); // DatePicker() 是类的"构造"函数，大写开始
    var y = pageHeight(); // pageHeight() 是一个普通函数

    var $all_images = $("img"); // $all_images 是jQuery对象
    var height = 250; // height不是

    //id和class的写法分开
    <div id="middle_column" class="main-content"> ...

###命名不能有歧义
命名的时候可以先想一下，我要用的这个词是否有别的含义。举个例子：

    results = Database.all_objects.filter("year <= 2011")

现在的结果到底是包含2011年之前的呢还是不包含呢？

####使用`min`、`max`代替`limit`

    CART_TOO_BIG_LIMIT = 10
        if shopping_cart.num_items() >= CART_TOO_BIG_LIMIT:
            Error("Too many items in cart.")

    MAX_ITEMS_IN_CART = 10
        if shopping_cart.num_items() > MAX_ITEMS_IN_CART:
         Error("Too many items in cart.")

对比上例中`CART_TOO_BIG_LIMIT`和`MAX_ITEMS_IN_CART`，想想哪个更好呢？

####使用`first`和`last`来表示闭区间

    print integer_range(start=2, stop=4)
    # Does this print [2,3] or [2,3,4] (or something else)?

    set.PrintKeys(first="Bart", last="Maggie")

`first`和`last`含义明确，适宜表示闭区间。

####使用`beigin`和`end`表示前闭后开([2,9))区间

    PrintEventsInRange("OCT 16 12:00am", "OCT 17 12:00am")

    PrintEventsInRange("OCT 16 12:00am", "OCT 16 11:59:59.9999pm")

上面一种写法就比下面的舒服多了。

####Boolean型变量命名

    bool read_password = true;

这是一个很危险的命名，到底是需要读取密码呢，还是密码已经被读取呢，不知道，所以这个变量可以使用`user_is_authenticated`代替。通常，给Boolean型变量添加`is`、`has`、`can`、`should`可以让含义更清晰，比如：

                 SpaceLeft()  -->  hasSpaceLeft()
    bool disable_ssl = false  -->  bool use_ssl = true

####符合预期

    public class StatisticsCollector {
        public void addSample(double x) { ... }
        public double getMean() {
            // Iterate through all samples and return total / num_samples
        }
        ...
    }

在这个例子中，`getMean`方法遍历了所有的样本，返回总额，所以并不是普通意义上轻量的`get`方法，所以应该取名`computeMean`比较合适。

##漂亮的格式
写出来漂亮的格式，充满美感，读起来自然也会舒服很多，对比下面两个例子：

    class StatsKeeper {
       public:
       // A class for keeping track of a series of doubles
          void Add(double d);  // and methods for quick statistics about them
         private:   int count;        /* how many so    far
       */ public:
               double Average();
       private:   double minimum;
       list<double>
         past_items
             ;double maximum;
    };

什么是充满美感的呢：

    // A class for keeping track of a series of doubles
    // and methods for quick statistics about them.
    class StatsKeeper {
      public:
        void Add(double d);
        double Average();
      private:
        list<double> past_items;
        int count;  // how many so far
        double minimum;
        double maximum;
    };

###考虑断行的连续性和简洁
这段代码需要断行，来满足不超过一行80个字符的要求，参数也需要注释说明：

    public class PerformanceTester {
        public static final TcpConnectionSimulator wifi = new TcpConnectionSimulator(
            500, /* Kbps */
            80, /* millisecs latency */
            200, /* jitter */
            1 /* packet loss % */);

        public static final TcpConnectionSimulator t3_fiber = new TcpConnectionSimulator(
            45000, /* Kbps */
            10, /* millisecs latency */
            0, /* jitter */
            0 /* packet loss % */);

        public static final TcpConnectionSimulator cell = new TcpConnectionSimulator(
            100, /* Kbps */
            400, /* millisecs latency */
            250, /* jitter */
            5 /* packet loss % */);
    }

考虑到代码的连贯性，先优化成这样：

    public class PerformanceTester {
        public static final TcpConnectionSimulator wifi =
            new TcpConnectionSimulator(
                500, /* Kbps */
                80, /* millisecs latency */ 200, /* jitter */
                1 /* packet loss % */);

        public static final TcpConnectionSimulator t3_fiber =
            new TcpConnectionSimulator(
                45000, /* Kbps */
                10,    /* millisecs latency */
                0,     /* jitter */
                0      /* packet loss % */);

        public static final TcpConnectionSimulator cell =
            new TcpConnectionSimulator(
                100,   /* Kbps */
                400,   /* millisecs latency */
                250,   /* jitter */
                5      /* packet loss % */);
    }

连贯性好一点，但还是太罗嗦，额外占用很多空间：

    public class PerformanceTester {
        // TcpConnectionSimulator(throughput, latency, jitter, packet_loss)
        //                            [Kbps]   [ms]    [ms]    [percent]
        public static final TcpConnectionSimulator wifi =
            new TcpConnectionSimulator(500,    80,     200,     1);

        public static final TcpConnectionSimulator t3_fiber =
            new TcpConnectionSimulator(45000,  10,     0,       0);

        public static final TcpConnectionSimulator cell =
            new TcpConnectionSimulator(100,    400,    250,     5);
    }

###用函数封装

    // Turn a partial_name like "Doug Adams" into "Mr. Douglas Adams".
    // If not possible, 'error' is filled with an explanation.
    string ExpandFullName(DatabaseConnection dc, string partial_name, string* error);

    DatabaseConnection database_connection;
    string error;
    assert(ExpandFullName(database_connection, "Doug Adams", &error)
            == "Mr. Douglas Adams");
    assert(error == "");
    assert(ExpandFullName(database_connection, " Jake Brown ", &error)
            == "Mr. Jacob Brown III");
    assert(error == "");
    assert(ExpandFullName(database_connection, "No Such Guy", &error) == "");
    assert(error == "no match found");
    assert(ExpandFullName(database_connection, "John", &error) == "");
    assert(error == "more than one result");

上面这段代码看起来很脏乱，很多重复性的东西，可以用函数封装：

    CheckFullName("Doug Adams", "Mr. Douglas Adams", "");
    CheckFullName(" Jake Brown ", "Mr. Jake Brown III", "");
    CheckFullName("No Such Guy", "", "no match found");
    CheckFullName("John", "", "more than one result");

    void CheckFullName(string partial_name,
                       string expected_full_name,
                       string expected_error) {
        // database_connection is now a class member
        string error;
        string full_name = ExpandFullName(database_connection, partial_name, &error);
        assert(error == expected_error);
        assert(full_name == expected_full_name);
    }

###列对齐
列对齐可以让代码段看起来更舒适：

    CheckFullName("Doug Adams"   , "Mr. Douglas Adams" , "");
    CheckFullName(" Jake  Brown ", "Mr. Jake Brown III", "");
    CheckFullName("No Such Guy"  , ""                  , "no match found");
    CheckFullName("John"         , ""                  , "more than one result");

    commands[] = {
        ...
        { "timeout"      , NULL              , cmd_spec_timeout},
        { "timestamping" , &opt.timestamping , cmd_boolean},
        { "tries"        , &opt.ntry         , cmd_number_inf},
        { "useproxy"     , &opt.use_proxy    , cmd_boolean},
        { "useragent"    , NULL              , cmd_spec_useragent},
        ...
    };

###代码用块区分

    class FrontendServer {
        public:
            FrontendServer();
            void ViewProfile(HttpRequest* request);
            void OpenDatabase(string location, string user);
            void SaveProfile(HttpRequest* request);
            string ExtractQueryParam(HttpRequest* request, string param);
            void ReplyOK(HttpRequest* request, string html);
            void FindFriends(HttpRequest* request);
            void ReplyNotFound(HttpRequest* request, string error);
            void CloseDatabase(string location);
            ~FrontendServer();
    };

上面这一段虽然能看，不过还有优化空间：

    class FrontendServer {
        public:
            FrontendServer();
            ~FrontendServer();
            // Handlers
            void ViewProfile(HttpRequest* request);
            void SaveProfile(HttpRequest* request);
            void FindFriends(HttpRequest* request);

            // Request/Reply Utilities
            string ExtractQueryParam(HttpRequest* request, string param);
            void ReplyOK(HttpRequest* request, string html);
            void ReplyNotFound(HttpRequest* request, string error);

            // Database Helpers
            void OpenDatabase(string location, string user);
            void CloseDatabase(string location);
    };

再来看一段代码：

    # Import the user's email contacts, and match them to users in our system.
    # Then display a list of those users that he/she isn't already friends with.
    def suggest_new_friends(user, email_password):
        friends = user.friends()
        friend_emails = set(f.email for f in friends)
        contacts = import_contacts(user.email, email_password)
        contact_emails = set(c.email for c in contacts)
        non_friend_emails = contact_emails - friend_emails
        suggested_friends = User.objects.select(email__in=non_friend_emails)
        display['user'] = user
        display['friends'] = friends
        display['suggested_friends'] = suggested_friends
        return render("suggested_friends.html", display)

全都混在一起，视觉压力相当大，按功能化块：

    def suggest_new_friends(user, email_password):
        # Get the user's friends' email addresses.
        friends = user.friends()
        friend_emails = set(f.email for f in friends)

        # Import all email addresses from this user's email account.
        contacts = import_contacts(user.email, email_password)
        contact_emails = set(c.email for c in contacts)

        # Find matching users that they aren't already friends with.
        non_friend_emails = contact_emails - friend_emails
        suggested_friends = User.objects.select(email__in=non_friend_emails)

        # Display these lists on the page. display['user'] = user
        display['friends'] = friends
        display['suggested_friends'] = suggested_friends

        return render("suggested_friends.html", display)

让代码看起来更舒服，需要在写的过程中多注意，培养一些好的习惯，尤其当团队合作的时候，代码风格比如大括号的位置并没有对错，但是不遵循团队规范那就是错的。

##如何写注释
当你写代码的时候，你会思考很多，但是最终呈现给读者的就只剩代码本身了，额外的信息丢失了，所以注释的目的就是让读者了解更多的信息。

###应该注释什么
####不应该注释什么
这样的注释毫无价值：

    // The class definition for Account
    class Account {
        public:
            // Constructor
            Account();
            // Set the profit member to a new value
            void SetProfit(double profit);
            // Return the profit from this Account
            double GetProfit();
    };

####不要像下面这样为了注释而注释：

    // Find a Node with the given 'name' or return NULL.
    // If depth <= 0, only 'subtree' is inspected.
    // If depth == N, only 'subtree' and N levels below are inspected.
    Node* FindNodeInSubtree(Node* subtree, string name, int depth);

####不要给烂取名注释

    // Enforce limits on the Reply as stated in the Request,
    // such as the number of items returned, or total byte size, etc. 
    void CleanReply(Request request, Reply reply);

注释的大部分都在解释clean是什么意思，那不如换个正确的名字：

    // Make sure 'reply' meets the count/byte/etc. limits from the 'request' 
    void EnforceLimitsFromRequest(Request request, Reply reply);

####记录你的想法
我们讨论了不该注释什么，那么应该注释什么呢？注释应该记录你思考代码怎么写的结果，比如像下面这些：

    // Surprisingly, a binary tree was 40% faster than a hash table for this data.
    // The cost of computing a hash was more than the left/right comparisons.

    // This heuristic might miss a few words. That's OK; solving this 100% is hard.

    // This class is getting messy. Maybe we should create a 'ResourceNode' subclass to
    // help organize things.

也可以用来记录流程和常量：

    // TODO: use a faster algorithm
    // TODO(dustin): handle other image formats besides JPEG

    NUM_THREADS = 8 # as long as it's >= 2 * num_processors, that's good enough.

    // Impose a reasonable limit - no human can read that much anyway.
    const int MAX_RSS_SUBSCRIPTIONS = 1000;

可用的词有：

    TODO  : Stuff I haven't gotten around to yet
    FIXME : Known-broken code here
    HACK  : Adimittedly inelegant solution to a problem
    XXX   : Danger! Major problem here

####站在读者的角度去思考
当别人读你的代码时，让他们产生疑问的部分，就是你应该注释的地方。

    struct Recorder {
        vector<float> data;
        ...
        void Clear() {
            vector<float>().swap(data); // Huh? Why not just data.clear()? 
        }
    };

很多C++的程序员啊看到这里，可能会想为什么不用`data.clear()`来代替`vector.swap`，所以那个地方应该加上注释：

    // Force vector to relinquish its memory (look up "STL swap trick")
    vector<float>().swap(data);

####说明可能陷阱
你在写代码的过程中，可能用到一些hack，或者有其他需要读代码的人知道的陷阱，这时候就应该注释：

    void SendEmail(string to, string subject, string body);

而实际上这个发送邮件的函数是调用别的服务，有超时设置，所以需要注释：

    // Calls an external service to deliver email.  (Times out after 1 minute.)
    void SendEmail(string to, string subject, string body);

####全景的注释
有时候为了更清楚说明，需要给整个文件加注释，让读者有个总体的概念：

    // This file contains helper functions that provide a more convenient interface to our
    // file system. It handles file permissions and other nitty-gritty details.

####总结性的注释
即使是在函数内部，也可以有类似文件注释那样的说明注释：

    # Find all the items that customers purchased for themselves.
    for customer_id in all_customers:
        for sale in all_sales[customer_id].sales:
            if sale.recipient == customer_id:
                ...
或者按照函数的步进，写一些注释：

    def GenerateUserReport():
        # Acquire a lock for this user
        ...
        # Read user's info from the database
        ...
        # Write info to a file
        ...
        # Release the lock for this user

很多人不愿意写注释，确实，要写好注释也不是一件简单的事情，也可以在文件专门的地方，留个写注释的区域，可以写下你任何想说的东西。

###注释应简明准确
前一个小节讨论了注释应该写什么，这一节来讨论应该怎么写，因为注释很重要，所以要写的精确，注释也占据屏幕空间，所以要简洁。

####精简注释

    // The int is the CategoryType.
    // The first float in the inner pair is the 'score',
    // the second is the 'weight'.
    typedef hash_map<int, pair<float, float> > ScoreMap;

这样写太罗嗦了，尽量精简压缩成这样：

    // CategoryType -> (score, weight)
    typedef hash_map<int, pair<float, float> > ScoreMap;

####避免有歧义的代词

    // Insert the data into the cache, but check if it's too big first.

这里的`it's`有歧义，不知道所指的是`data`还是`cache`，改成如下：

    // Insert the data into the cache, but check if the data is too big first.

还有更好的解决办法，这里的`it`就有明确所指：

    // If the data is small enough, insert it into the cache.

####语句要精简准确

    # Depending on whether we've already crawled this URL before, give it a different priority.

这句话理解起来太费劲，改成如下就好理解很多：

    # Give higher priority to URLs we've never crawled before.

####精确描述函数的目的

    // Return the number of lines in this file.
    int CountLines(string filename) { ... }

这样的一个函数，用起来可能会一头雾水，因为他可以有很多歧义：

-  "" 一个空文件，是0行还是1行？
-  "hello" 只有一行，那么返回值是0还是1？
-  "hello\n" 这种情况返回1还是2？
-  "hello\n world" 返回1还是2？
-  "hello\n\r cruel\n world\r" 返回2、3、4哪一个呢？

所以注释应该这样写：

    // Count how many newline bytes ('\n') are in the file.
    int CountLines(string filename) { ... }

####用实例说明边界情况

    // Rearrange 'v' so that elements < pivot come before those >= pivot;
    // Then return the largest 'i' for which v[i] < pivot (or -1 if none are < pivot)
    int Partition(vector<int>* v, int pivot);

这个描述很精确，但是如果再加入一个例子，就更好了：

    // ...
    // Example: Partition([8 5 9 8 2], 8) might result in [5 2 | 8 9 8] and return 1
    int Partition(vector<int>* v, int pivot);

####说明你的代码的真正目的

    void DisplayProducts(list<Product> products) {
        products.sort(CompareProductByPrice);
        // Iterate through the list in reverse order
        for (list<Product>::reverse_iterator it = products.rbegin(); it != products.rend();
                ++it)
            DisplayPrice(it->price);
        ... 
    }

这里的注释说明了倒序排列，单还不够准确，应该改成这样：

    // Display each price, from highest to lowest
    for (list<Product>::reverse_iterator it = products.rbegin(); ... )

####函数调用时的注释
看见这样的一个函数调用，肯定会一头雾水：

    Connect(10, false);

如果加上这样的注释，读起来就清楚多了：

    def Connect(timeout, use_encryption):  ...

    # Call the function using named parameters
    Connect(timeout = 10, use_encryption = False)

####使用信息含量丰富的词 

    // This class contains a number of members that store the same information as in the
    // database, but are stored here for speed. When this class is read from later, those
    // members are checked first to see if they exist, and if so are returned; otherwise the
    // database is read from and that data stored in those fields for next time.

上面这一大段注释，解释的很清楚，如果换一个词来代替，也不会有什么疑惑：

    // This class acts as a caching layer to the database.


##简化循环和逻辑

###流程控制要简单
让条件语句、循环以及其他控制流程的代码尽可能自然，让读者在阅读过程中不需要停顿思考或者在回头查找，是这一节的目的。

####条件语句中参数的位置
对比下面两种条件的写法：

    if (length >= 10)
    while (bytes_received < bytes_expected)

    if (10 <= length)
    while (bytes_expected > bytes_received)

到底是应该按照大于小于的顺序来呢，还是有其他的准则？是的，应该按照参数的意义来

<ul>
<li>运算符左边：通常是需要被检查的变量，也就是会经常变化的</li>
<li>运算符右边：通常是被比对的样本，一定程度上的常量</li>
</ul>

这就解释了为什么`bytes_received < bytes_expected`比反过来更好理解。

####if/else的顺序
通常，`if/else`的顺序你可以自由选择，下面这两种都可以：

    if (a == b) {
        // Case One ...
    } else {
        // Case Two ...
    }

    if (a != b) {
        // Case Two ...
    } else {
        // Case One ...
    }

或许对此你也没有仔细斟酌过，但在有些时候，一种顺序确实好过另一种：

- 正向的逻辑在前，比如`if(debug)`就比`if(!debug)`好
- 简单逻辑的在前，这样`if`和`else`就可以在一个屏幕显示
- 有趣、清晰的逻辑在前

举个例子来看：

    if (!url.HasQueryParameter("expand_all")) {
        response.Render(items);
        ...
    } else {
        for (int i = 0; i < items.size(); i++) {
            items[i].Expand();
        }
        ... 
    }

看到`if`你首先想到的是`expand_all`，就好像告诉你“不要想大象”，你会忍不住去想它，所以产生了一点点迷惑，最好写成：

    if (url.HasQueryParameter("expand_all")) {
        for (int i = 0; i < items.size(); i++) {
            items[i].Expand();
        }
        ... 
    } else {
        response.Render(items);
        ... 
    }

####三目运算符(?:)

    time_str += (hour >= 12) ? "pm" : "am";
    
    Avoiding the ternary operator, you might write:
        if (hour >= 12) {
            time_str += "pm";
        } else {
            time_str += "am";
    }

使用三目运算符可以减少代码行数，上例就是一个很好的例证，但是我们的真正目的是减少读代码的时间，所以下面的情况并不适合用三目运算符：

    return exponent >= 0 ? mantissa * (1 << exponent) : mantissa / (1 << -exponent);

    if (exponent >= 0) {
        return mantissa * (1 << exponent);
    } else {
        return mantissa / (1 << -exponent);
    }

所以只在简单表达式的地方用。

####避免使用do/while表达式

    do {
        continue;
    } while (false);

这段代码会执行几遍呢，需要时间思考一下，`do/while`完全可以用别的方法代替，所以应避免使用。

####尽早return

    public boolean Contains(String str, String substr) {
        if (str == null || substr == null) return false;
        if (substr.equals("")) return true;
        ...
    }

函数里面尽早的return，可以让逻辑更加清晰。

####减少嵌套

    if (user_result == SUCCESS) {
        if (permission_result != SUCCESS) {
            reply.WriteErrors("error reading permissions");
            reply.Done();
            return;
        }
        reply.WriteErrors("");
    } else {
        reply.WriteErrors(user_result);
    }
    reply.Done();

这样一段代码，有一层的嵌套，但是看起来也会稍有迷惑，想想自己的代码，有没有类似的情况呢？可以换个思路去考虑这段代码，并且用尽早return的原则修改，看起来就舒服很多：

    if (user_result != SUCCESS) {
        reply.WriteErrors(user_result);
        reply.Done();
        return;
    }
    if (permission_result != SUCCESS) {
        reply.WriteErrors(permission_result);
        reply.Done();
        return;
    }
    reply.WriteErrors("");
    reply.Done();

同样的，对于有嵌套的循环，可以采用同样的办法：

    for (int i = 0; i < results.size(); i++) {
        if (results[i] != NULL) {
            non_null_count++;
            if (results[i]->name != "") {
                cout << "Considering candidate..." << endl;
                ...
            }
        }
    }

换一种写法，尽早return，在循环中就用continue：

    for (int i = 0; i < results.size(); i++) {
        if (results[i] == NULL) continue;
        non_null_count++;

        if (results[i]->name == "") continue;
        cout << "Considering candidate..." << endl;
        ... 
    }

###拆分复杂表达式
很显然的，越复杂的表达式，读起来越费劲，所以应该把那些复杂而庞大的表达式，拆分成一个个易于理解的小式子。

####用变量
将复杂表达式拆分最简单的办法，就是增加一个变量：

    if line.split(':')[0].strip() == "root":

    //用变量替换
    username = line.split(':')[0].strip() 
    if username == "root":
        ...

或者这个例子：

    if (request.user.id == document.owner_id) {
        // user can edit this document...
    }
    ...
    if (request.user.id != document.owner_id) {
    // document is read-only...
    }

    //用变量替换
    final boolean user_owns_document = (request.user.id == document.owner_id);
    if (user_owns_document) {
        // user can edit this document...
    }
    ...
    if (!user_owns_document) {
        // document is read-only...
    }

####逻辑替换

- 1) not (a or b or c)   <--> (not a) and (not b) and (not c) 
- 2) not (a and b and c) <--> (not a) or (not b) or (not c)

所以，就可以这样写：

    if (!(file_exists && !is_protected)) Error("Sorry, could not read file.");

    //替换
    if (!file_exists || is_protected) Error("Sorry, could not read file.");

####不要滥用逻辑表达式

    assert((!(bucket = FindBucket(key))) || !bucket->IsOccupied());

这样的代码完全可以用下面这个替换，虽然有两行，但是更易懂：

    bucket = FindBucket(key);
    if (bucket != NULL) assert(!bucket->IsOccupied());

像下面这样的表达式，最好也不要写，因为在有些语言中，x会被赋予第一个为`true`的变量的值：

    x = a || b || c

####拆解大表达式

    var update_highlight = function (message_num) {
        if ($("#vote_value" + message_num).html() === "Up") {
            $("#thumbs_up" + message_num).addClass("highlighted");
            $("#thumbs_down" + message_num).removeClass("highlighted");
        } else if ($("#vote_value" + message_num).html() === "Down") {
            $("#thumbs_up" + message_num).removeClass("highlighted");
            $("#thumbs_down" + message_num).addClass("highlighted");
        } else {
            $("#thumbs_up" + message_num).removeClass("highighted");
            $("#thumbs_down" + message_num).removeClass("highlighted");
        }
    };

这里面有很多重复的语句，我们可以用变量还替换简化：

    var update_highlight = function (message_num) {
        var thumbs_up = $("#thumbs_up" + message_num);
        var thumbs_down = $("#thumbs_down" + message_num);
        var vote_value = $("#vote_value" + message_num).html();
        var hi = "highlighted";

        if (vote_value === "Up") {
            thumbs_up.addClass(hi);
            thumbs_down.removeClass(hi);
        } else if (vote_value === "Down") {
            thumbs_up.removeClass(hi);
            thumbs_down.addClass(hi);
        } else {
            thumbs_up.removeClass(hi);
            thumbs_down.removeClass(hi);
        }
    }


###变量与可读性

####消除变量
前一节，讲到利用变量来拆解大表达式，这一节来讨论如何消除多余的变量。

####没用的临时变量

    now = datetime.datetime.now()
    root_message.last_view_time = now

这里的`now`可以去掉，因为：

<ul>
<li>并非用来拆分复杂的表达式</li>
<li>也没有增加可读性，因为`datetime.datetime.now()`本就清晰</li>
<li>只用了一次</li>
</ul>

所以完全可以写作：

    root_message.last_view_time = datetime.datetime.now()

####消除条件控制变量

    boolean done = false;
    while (/* condition */ && !done) {
        ...
        if (...) {
            done = true;
            continue; 
        }
    }

这里的`done`可以用别的方式更好的完成：

    while (/* condition */) {
        ...
        if (...) {
            break;
        } 
    }

这个例子非常容易修改，如果是比较复杂的嵌套，`break`可能并不够用，这时候就可以把代码封装到函数中。

####减少变量的作用域
我们都听过要避免使用全局变量这样的忠告，是的，当变量的作用域越大，就越难追踪，所以要保持变量小的作用域。

    class LargeClass {
        string str_;
        void Method1() {
            str_ = ...;
            Method2();
        }
        void Method2() {
            // Uses str_
        }
        // Lots of other methods that don't use str_ 
        ... ;
    }

这里的`str_`的作用域有些大，完全可以换一种方式：

    class LargeClass {
        void Method1() {
            string str = ...;
            Method2(str); 
        }
        void Method2(string str) {
            // Uses str
        }
        // Now other methods can't see str.
    };

将`str`通过变量函数参数传递，减小了作用域，也更易读。同样的道理也可以用在定义类的时候，将大类拆分成一个个小类。

####不要使用嵌套的作用域

    # No use of example_value up to this point.
    if request:
        for value in request.values:
        if value > 0:
            example_value = value 
            break

    for logger in debug.loggers:
        logger.log("Example:", example_value)

这个例子在运行时候会报`example_value is undefined`的错，修改起来不算难：

    example_value = None
    if request:
        for value in request.values:
            if value > 0: example_value = value 
            break

    if example_value:
        for logger in debug.loggers:
        logger.log("Example:", example_value)

但是参考前面的**消除中间变量**准则，还有更好的办法：

    def LogExample(value):
        for logger in debug.loggers:
            logger.log("Example:", value)

        if request:
            for value in request.values:
                if value > 0:
                    LogExample(value)  # deal with 'value' immediately
                    break

####用到了再声明
在C语言中，要求将所有的变量事先声明，这样当用到变量较多时候，读者处理这些信息就会有难度，所以一开始没用到的变量，就暂缓声明：

    def ViewFilteredReplies(original_id):
        filtered_replies = []
        root_message = Messages.objects.get(original_id) 
        all_replies = Messages.objects.select(root_id=original_id)
        root_message.view_count += 1
        root_message.last_view_time = datetime.datetime.now()
        root_message.save()

        for reply in all_replies:
            if reply.spam_votes <= MAX_SPAM_VOTES:
                filtered_replies.append(reply)

        return filtered_replies

读者一次处理变量太多，可以暂缓声明：

    def ViewFilteredReplies(original_id):
        root_message = Messages.objects.get(original_id)
        root_message.view_count += 1
        root_message.last_view_time = datetime.datetime.now()
        root_message.save()

        all_replies = Messages.objects.select(root_id=original_id) 
        filtered_replies = []
        for reply in all_replies:
            if reply.spam_votes <= MAX_SPAM_VOTES:
                filtered_replies.append(reply)

        return filtered_replies

####变量最好只写一次
前面讨论了过多的变量会让读者迷惑，同一个变量，不停的被赋值也会让读者头晕，如果变量变化的次数少一些，代码可读性就更强。

####一个例子
假设有一个页面，如下，需要给第一个空的`input`赋值：

    <input type="text" id="input1" value="Dustin">
    <input type="text" id="input2" value="Trevor">
    <input type="text" id="input3" value="">
    <input type="text" id="input4" value="Melissa">
    ...
    var setFirstEmptyInput = function (new_value) {
        var found = false;
        var i = 1;
        var elem = document.getElementById('input' + i);
        while (elem !== null) {
            if (elem.value === '') {
                found = true;
                break; 
            }
            i++;
            elem = document.getElementById('input' + i);
        }
        if (found) elem.value = new_value;
        return elem;
    };

这段代码能工作，有三个变量，我们逐一去看如何优化，`found`作为中间变量，完全可以消除：

    var setFirstEmptyInput = function (new_value) {
        var i = 1;
        var elem = document.getElementById('input' + i);
        while (elem !== null) {
            if (elem.value === '') {
                elem.value = new_value;
                return elem;
            }
            i++;
            elem = document.getElementById('input' + i);
        }
        return null;
    };

再来看`elem`变量，只用来做循环，调用了很多次，所以很难跟踪他的值，`i`也可以用`for`来修改：

    var setFirstEmptyInput = function (new_value) {
        for (var i = 1; true; i++) {
            var elem = document.getElementById('input' + i);
            if (elem === null)
                return null;  // Search Failed. No empty input found.
            if (elem.value === '') {
                elem.value = new_value;
                return elem;
            }
        }
    };


##重新组织你的代码
###分离不相关的子问题
工程师就是将大问题分解为一个个小问题，然后逐个解决，这样也易于保证程序的健壮性、可读性。如何分解子问题，下面给出一些准则：

<ul>
<li>看看这个方法或代码，问问你自己“这段代码的最终目标是什么？”</li>
<li>对于每一行代码，要问“它与目标直接相关，或者是不相关的子问题？”</li>
<li>如果有足够多行的代码是处理与目标不直接相关的问题，那么抽离成子函数</li>
</ul>

来看一个例子：

    ajax_post({
        url: 'http://example.com/submit',
        data: data,
        on_success: function (response_data) {
            var str = "{\n";
            for (var key in response_data) {
                str += "  " + key + " = " + response_data[key] + "\n";
            }
            alert(str + "}");
            // Continue handling 'response_data' ...
        }
    });

这段代码的目标是发送一个`ajax`请求，所以其中字符串处理的部分就可以抽离出来：

    var format_pretty = function (obj) {
        var str = "{\n";
        for (var key in obj) {
            str += "  " + key + " = " + obj[key] + "\n";
        }
        return str + "}";
    };

####意外收获
有很多理由将`format_pretty`抽离出来，这些独立的函数可以很容易的添加feature，增强可靠性，处理边界情况，等等。所以这里，可以将`format_pretty`增强，就会得到一个更强大的函数：

    var format_pretty = function (obj, indent) {
        // Handle null, undefined, strings, and non-objects.
        if (obj === null) return "null";
        if (obj === undefined) return "undefined";
        if (typeof obj === "string") return '"' + obj + '"';
        if (typeof obj !== "object") return String(obj);
        if (indent === undefined) indent = "";

        // Handle (non-null) objects.

        var str = "{\n";
        for (var key in obj) {
            str += indent + "  " + key + " = ";
            str += format_pretty(obj[key], indent + " ") + "\n"; }
        return str + indent + "}";
    };

这个函数输出：

    {
        key1 = 1
        key2 = true
        key3 = undefined
        key4 = null
        key5 = {
            key5a = {
                key5a1 = "hello world"
            }
        }
    }

多做这样的事情，就是积累代码的过程，这样的代码可以复用，也可以形成自己的代码库，或者分享给别人。

####业务相关的函数
那些与目标不相关函数，抽离出来可以复用，与业务相关的也可以抽出来，保持代码的易读性，例如：

    business = Business()
    business.name = request.POST["name"]

    url_path_name = business.name.lower()
    url_path_name = re.sub(r"['\.]", "", url_path_name) 
    url_path_name = re.sub(r"[^a-z0-9]+", "-", url_path_name) 
    url_path_name = url_path_name.strip("-")
    business.url = "/biz/" + url_path_name

    business.date_created = datetime.datetime.utcnow() 
    business.save_to_database()

抽离出来，就好看很多：

    CHARS_TO_REMOVE = re.compile(r"['\.']+")
    CHARS_TO_DASH = re.compile(r"[^a-z0-9]+")

    def make_url_friendly(text):
        text = text.lower()
        text = CHARS_TO_REMOVE.sub('', text) 
        text = CHARS_TO_DASH.sub('-', text) 
        return text.strip("-")

    business = Business()
    business.name = request.POST["name"]
    business.url = "/biz/" + make_url_friendly(business.name) 
    business.date_created = datetime.datetime.utcnow() 
    business.save_to_database()

####简化现有接口
我们来看一个读写cookie的函数：

    var max_results;
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        c = c.replace(/^[ ]+/, '');  // remove leading spaces
        if (c.indexOf("max_results=") === 0)
            max_results = Number(c.substring(12, c.length));
    }

这段代码实在太丑了，理想的接口应该是这样的：

    set_cookie(name, value, days_to_expire);
    delete_cookie(name);

对于并不理想的接口，你永远可以用自己的函数做封装，让接口更好用。

####按自己需要写接口

    ser_info = { "username": "...", "password": "..." }
    user_str = json.dumps(user_info)
    cipher = Cipher("aes_128_cbc", key=PRIVATE_KEY, init_vector=INIT_VECTOR, op=ENCODE)
    encrypted_bytes = cipher.update(user_str)
    encrypted_bytes += cipher.final() # flush out the current 128 bit block
    url = "http://example.com/?user_info=" + base64.urlsafe_b64encode(encrypted_bytes)
    ...

虽然终极目的是拼接用户信息的字符，但是代码大部分做的事情是解析python的object，所以：

    def url_safe_encrypt(obj):
        obj_str = json.dumps(obj)
        cipher = Cipher("aes_128_cbc", key=PRIVATE_KEY, init_vector=INIT_VECTOR, op=ENCODE) encrypted_bytes = cipher.update(obj_str)
        encrypted_bytes += cipher.final() # flush out the current 128 bit block
        return base64.urlsafe_b64encode(encrypted_bytes)

这样在其他地方也可以调用：

    user_info = { "username": "...", "password": "..." }
    url = "http://example.com/?user_info=" + url_safe_encrypt(user_info)

分离子函数是好习惯，但是也要适度，过度的分离成多个小函数，也会让查找变得困难。

###单任务
代码应该是一次只完成一个任务

    var place = location_info["LocalityName"];  // e.g. "Santa Monica"
    if (!place) {
        place = location_info["SubAdministrativeAreaName"];  // e.g. "Los Angeles"
    }
    if (!place) {
        place = location_info["AdministrativeAreaName"];  // e.g. "California"
    }
    if (!place) {
        place = "Middle-of-Nowhere";
    }
    if (location_info["CountryName"]) {
        place += ", " + location_info["CountryName"];  // e.g. "USA"
    } else {
        place += ", Planet Earth";
    }

    return place;

这是一个用来拼地名的函数，有很多的条件判断，读起来非常吃力，有没有办法拆解任务呢？

    var town    = location_info["LocalityName"];               // e.g. "Santa Monica"
    var city    = location_info["SubAdministrativeAreaName"];  // e.g. "Los Angeles"
    var state   = location_info["AdministrativeAreaName"];     // e.g. "CA"
    var country = location_info["CountryName"];                // e.g. "USA"

先拆解第一个任务，将各变量分别保存，这样在后面使用中不需要去记忆那些繁长的key值了，第二个任务，解决地址拼接的后半部分：

    // Start with the default, and keep overwriting with the most specific value. var second_half = "Planet Earth";
    if (country) {
        second_half = country; 
    }
    if (state && country === "USA") {
        second_half = state; 
    }

再来解决前半部分：

    var first_half = "Middle-of-Nowhere";
    if (state && country !== "USA") {
        first_half = state; 
    }
    if (city) {
        first_half = city;
    }
    if (town) {
        first_half = town; 
    }

大功告成：

    return first_half + ", " + second_half;

如果注意到有`USA`这个变量的判断的话，也可以这样写：

    var first_half, second_half;
    if (country === "USA") {
        first_half = town || city || "Middle-of-Nowhere";
        second_half = state || "USA";
    } else {
        first_half = town || city || state || "Middle-of-Nowhere";
        second_half = country || "Planet Earth";
    }
    return first_half + ", " + second_half;

###把想法转换成代码
要把一个复杂的东西解释给别人，一些细节很容易就让人产生迷惑，所以想象把你的代码用平实的语言解释给别人听，别人是否能懂，有一些准则可以帮助你让代码更清晰：

<ul>
<li>用最平实的语言描述代码的目的，就像给读者讲述一样</li>
<li>注意描述中关键的字词</li>
<li>让你的代码符合你的描述</li>
</ul>

下面这段代码用来校验用户的权限：

    $is_admin = is_admin_request();
    if ($document) {
        if (!$is_admin && ($document['username'] != $_SESSION['username'])) {
            return not_authorized();
        }
    } else {
        if (!$is_admin) {
            return not_authorized();
        } 
    }
    // continue rendering the page ...

这一段代码不长，里面的逻辑嵌套倒是复杂，参考前面章节所述，嵌套太多非常影响阅读理解，将这个逻辑用语言描述就是：

    有两种情况有权限：
    1、你是管理员(admin)
    2、你拥有这个文档
    否则就没有权限

根据描述来写代码：

    if (is_admin_request()) {
        // authorized
    } elseif ($document && ($document['username'] == $_SESSION['username'])) {
        // authorized
    } else {
        return not_authorized();
    }
    // continue rendering the page ...

###写更少的代码
最易懂的代码就是没有代码！

<ul>
<li>去掉那些没意义的feature，也不要过度设计</li>
<li>重新考虑需求，解决最简单的问题，也能完成整体的目标</li>
<li>熟悉你常用的库，周期性研究他的API</li>
</ul>

##最后
还有一些与测试相关的章节，留给你自己去研读吧，再次推荐此书：

- 英文版：[《The Art of Readable Code》][RCEN]
- 中文版：[编写可读代码的艺术][RCCN]

[RCEN]: http://book.douban.com/subject/5442971/ "The Art Of Readable Code"
[RCCN]: http://book.douban.com/subject/10797189/ "编写可读代码的艺术"
