---
layout: post
title: 使用Backbone.js开发Chrome便签插件
description: 没有合适的插件，就只好自己动手了，同时也用Backbone.js来练练手。
category: blog
---

##开始之前
在Web Store上没找到满意的便签插件，就只好自己动手写了[Notty Notes][Notty]，你可以试试看，多多提建议哦~
<a href="https://chrome.google.com/webstore/detail/notty-notes/ggbmjahbkbhakkfgjiggdclpmmpmhajn?hl=zh-CN" title="Notty Notes" target="_blank"><img src="/images/backbonechrome/notes-logo.jpg" alt="Notty Notes"></a>

[Backbone][2]的流行，与前端复杂度的提高息息相关，尤其越来越多的大型单页应用的上线，代码的组织方面就产生很多新的问题。所以MV\*的概念又一次在前端应用开来，不管最后那个\*被定义成为什么，M(odel)和V(iew)这两层的分离，对于代码的组织大有好处。Backbone就是很简洁恰当的解决了这个问题，并没有带来一点点多余之物，这也是他的动人之处。

[Chrome][3]的美丽与Backbone有相同之处。他的插件开发流程令人愉悦，[Chrome Web Store][4]上展现率和安装率也挺让人安慰，那丁点的热情也不会被打消掉。所以，综合种种，我又结合Backbone.js的使用，总结出来这片Blog。

##Backbone.js简介
>Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

这是官方的介绍，Backbone.js给web应用开发约定了一种结构，包括用key-value绑定且可以自定义事件的Models，提供大量API方法的Models的集合Collections，以及用来响应事件的Views，并把这些很好的与你的RESTful的Json接口相结合，有效的组织复杂应用的代码。Backbone.js基于[jQuery][10]和[Underscore][11]。

Backbone算轻量级的MVC框架，他的优雅之处在于，他为复杂的代码约定了一种优美的组织方式。使用Backbone可以脱离处理复杂DOM的苦海。你的数据就是`Models`，`Collections`是`Models`的集合，`Models`的每一个变化都会触发`change`事件，`Views`用来响应数据的变化。就我的使用效果来说，对于相同功能的应用，代码量减少至少30%以上，更别说在可维护性方面带来的提高了。

相对于基本的HTML页面，Backbone.js的更适用于单页复杂应用(Single Page Application)。什么是单页复杂应用，比如Gmail、Google Reader、阿尔法城等，当然包括我将要讨论的便签插件。

##Notes页面准备
便签是很直观、简单的东西，设计思路基本上模拟真实物品，所以也没多费神，实现的结果就是这样子的：
![Notes Draft](/images/backbonechrome/notes-draft.jpg)

为了一些简单的自定义功能，还有这样的设置页：
![Notes Settings](/images/backbonechrome/notes-settings.jpg)

总体来看，页面元素很简单，独立的三个模块：便签模板、关闭浮层、设置浮层。

为了不让过多的代码占据篇幅，简写如下，后面会给出源码地址：

    <body id="container">
        <!--便签模板-->
        <div class="note-tmpl" id="note-template">
            <!--Something Code...-->
        </div>

        <!--设置浮层-->
        <div class="modal hide fade" id="modal-settings">
            <div class="modal-body">
                <!--Something Code...-->
            </div>
            <div class="modal-footer">
                <!--Something Code...-->
            </div>
        </div>

        <!--关闭浮层-->
        <div id="tmpl-close" class="hide">
            <div class="alert fade in tmpl-close-confirm">
                <!--Something Code...-->
            </div>
        </div>
    </body>

为了快速搭建，使用了[Bootstrap][14]，其中的modal就是Bootstrap的模态对话框，Bootstrap更多特性可以参考官方文档，这里就不展开了。

样式我这样不懂审美的土鳖来说，是最困难的，只能根据直觉慢慢调整，还好CSS3方便了很多，不然最终肯定都是无聊的线框。不用兼容浏览器，那些漂亮的样式可以敞开了写，不过从设计角度来说，过于绚丽会导致操作效率降低，令用户产生厌烦，恰到好处是最好的，这方面我只到有直觉的水平，并无有价值的理论经验可分享。最终效果自己体会就好，关注如何实现，可以到源码中一看究竟。

用到的插件除了[Bootstrap][14]以外，还有：

- [jQueryUI][15]，包括拖拽和放大缩小插件。
- [Animate.css][16]，很不错的CSS3动画插件，只包含css文件。
- [Backbone.localStorage.js][17]，Backbone本地存储的适配器。
- [Sanitize.js][18]，清理过滤HTML节点。
- [UnderScore][11]，Backbone依赖UnderScore.js。

页面的部分不是这篇博客的重点，就像平常开发一样。在做这个完全我自己设计开发的东西的过程中，体会到想达到很优雅的用户体验，需要关注和解决的问题很多，是一个非常考验耐心的事情，不过最终完成时候的成就感自然也不同啦。

##Backbone.js的Model
Model就是要操作对象的数据结构，存储需要用到的数据，基于这些数据，会有大量的交互、验证等等操作。

###Model声明
根据要做的便签的需要，数据结构定义为如下：

    var Note = Backbone.Model.extend({
        defaults:{
            position:{top:20,left:30}
            ,scale:{width:300,height:300}
            ,theme:'0'
            ,fonttheme:'1'
            ,customfont:'16'
            ,title:'Note'
            ,content:''
            ,collapsed:''
            ,locked:false
            ,contentHeight:248
            ,ref:{title:'',href:''}
        }

        ,initialize:function(){
            console.log('Model initialized!');
        }
        ,remove:function(){
            this.destroy();
        }
    });

可以看到，我们定义了Note的Model的默认值，还有initialize和remove方法，当new一个Note对象时候，initialize方法会执行，默认的值也会赋给new的对象。

###Model值的set方法
也可以在new的时候修改覆盖默认值：

    var note1 = new Note({title:'New Note',content:'This is the new note'});//覆盖默认的title和content

    var note2 = new Note();
    note2.set({title:'New Note 2',content:'This is the new note 2'}); //设置Model的值

###Model值的get方法

    var note3 = new Note();
    note3.set({title:'New Note 3',content:'This is the new note 3'}); //设置Model的值

    var title = note3.get('title'); // "New Note 3"

###监听Model的change事件

要监听change事件，可以在initialize方法中做，也可以在实例化之后做：

    var note4 = new Note({title:'New Note 4',content:'This is the new note 4'});
    note4.bind('change:title',function(){
        //some code...
    });
    note4.bind('change:theme',function(){
        //some code...
    });
    note4.bind('change:fonttheme',function(){
        //some code...
    });

###与服务端的交互
在这个应用中，无需与服务端交互，用了那个localStorage的补充插件之后，同样调用save()和destory()方法就好，该插件会自动完成相应的工作，真正与服务端的交互也很简单：

    var UserModel = Backbone.Model.extend({
        urlRoot: '/user'
        ,defaults: {
            name: ''
            ,email: ''
        }
    });

其中urlRoot用来定义服务端的RESTful的API接口。

新建：

    var UserModel = Backbone.Model.extend({
        urlRoot: '/user'
        ,defaults: {
            name: ''
            ,email: ''
        }
    });
    var user = new Usermodel();
    // 注意这里没有id
    var userDetails = {
        name: 'notty'
        ,email: 'notty@example.com'
    };
    //因为没有设置id，所以服务端接收到请求的时候，会自动新建，并添加id
    user.save(userDetails, {
        success: function (user) {
            alert(user.toJSON());
        }
    })

获取：

    // 这里设置了id
    var user = new Usermodel({id: 1});

    // 下面这个方法会使用GET /user/1
    // 服务端返回相应的数据
    user.fetch({
        success: function (user) {
            alert(user.toJSON());
        }
    })

修改：

    // 我们修改id为1的用户数据
    var user = new Usermodel({
        id: 1,
        name: 'notes',
        email: 'notes@gmail.com'
    });

    // 因为有id，所以Backbone.js会触发 PUT /user/1，并发送相应的数据给服务端
    user.save({name: 'Davis'}, {
        success: function (model) {
            alert(user.toJSON());
        }
    });

删除：

    // 这里设置了model的id
    var user = new Usermodel({
        id: 1
        ,name: 'Notty'
        ,email: 'Notty@example.com'
    });

    // 因为有id，所以触发 DESTROY /user/1 
    user.destroy({
        success: function () {
            alert('Destroyed');
        }
    });

Model还支持validate方法，可以对数据进行校验，校验不通过，则不能执行后续操作，在声明Model时候，增加validate方法就好：

    Person = Backbone.Model.extend({
        // 如果年龄小于0，就会报错
        validate: function( attributes ){
            if( attributes.age < 0 && attributes.name != "Dr Manhatten" ){
                return "You can't be negative years old";
            }
        }
        ,initialize: function(){
            alert("Welcome to this world");
            this.bind("error", function(model, error){
                alert( error );
            });
        }
    });

##Backbone.js的Collection
Collection的概念很好理解，他就是Model的一个简单集合，举几个例子：

- Model是歌，Collection是专辑
- Model是动物，Collection是动物园
- Model是一个便签，Collection是所有便签（囧）

创建一个Collection，Model还是之前的便签的Model：

    var NoteCollection = Backbone.Collection.extend({
        model:Note
        ,localStorage:new Backbone.LocalStorage('notty-note')
    });

    var note1 = new Note({title:'New Note',content:'This is the new note'});
    var note2 = new Note({title:'New Note 2',content:'This is the new note 2'});
    var note3 = new Note({title:'New Note 3',content:'This is the new note 3'});

    var Notes = new NoteCollection([note1,note2,note3]);
    console.log(Notes.models) //[note1,note2,note3]

需要注意的是，我们的便签插件不需要与服务端交互，但是需要本地存储，所以使用localStorage。

##Backbone.js的View
好了，重头来了，View的声明和其他的基本上一样，一些参数查文档就很容易明白：

    var NoteView = Backbone.View.extend({
        tagName:'div'
        ,className:'note'
        ,template:function(tmpl,obj){
        }
        ,initialize:function(){
        }
        ,render:function(){
            return this;
        }
        ,events:{
            'mousedown':'clickNote'
            ,'dblclick .note-nav':'foldContent'
            ,'click .note-nav-close':'deleteNote'
            ,'click .note-nav-lock':'lockNote'
            ,'click .note-nav-title':'settings'
            ,'keyup .note-content':'contentChange'
            ,'blur .note-content':'contentChange'
        }
        ,clickNote:function(e){
        }
        ,deleteNote:function(e){
        }
        ,lockNote:function(e){
        }
        ,settings:function(){
        }
        ,contentChange:function(e){
        }
        ,changeScaleAndContentHeight:function(view){
        }
        ,bringNoteToContainer:function(view){
        }
        ,bringNoteToFront:function($ele){
        }
    });

在这个应用中，分离了每个便签的View和整个app的View，这样做的好处是逻辑、代码更清晰。

###el属性
`this.el`是这个View的DOM引用，使用它可以方便的做很多操作DOM的事情。注意到在这个View的声明里面，定义了template函数，不适用Underscore自带的template的函数的原因是Chrome Manifest V2的版本里面不允许出现`new Function`，导致很多模板库不能使用，只好自己重写一个简单的。`template`在这个场景还是能非常方便的解决一些问题的。

使用`this.el`我们如何给View填充数据呢，很简单：

    var $ele = $(this.el);
    $ele.html(
        this.template('#note-template',model.toJSON())
    ).draggable({
        handle:'.note-nav'
        ,stack:'.note'
        ,stop:function(){
            var $el = $(this);
            that.bringNoteToContainer(that);
        }
    }).css({
        position:'absolute'
        ,top:model.get('position').top
        ,left:model.get('position').left
        ,width:model.get('scale').width
        ,height:model.get('scale').height
    }).resizable({
        minWidth:200
        ,minHeight:200
        ,handles:'e,w,s,se'
        ,alsoResize:$ele.find('.note-content')
        ,stop:function(){that.changeScaleAndContentHeight(that)}
    });

在`initialize`方法中，可以初始化这些事情，需要更多的初始化工作，继续写写下去就好。

###事件的监听
你肯定注意到了声明View代码中的下面这些：

    ,events:{
        'mousedown':'clickNote'
        ,'dblclick .note-nav':'foldContent'
        ,'click .note-nav-close':'deleteNote'
        ,'click .note-nav-lock':'lockNote'
        ,'click .note-nav-title':'settings'
        ,'keyup .note-content':'contentChange'
        ,'blur .note-content':'contentChange'
    }

这些用来给View绑定事件，就和平常使用jQuery一样的用法，相信你一看就明白。

###appView
`appView`并不是Backbone的内容，而是在这个应用中，我们用来粘合所有元素的一个容器，为了将整个流程串联起来，有一个总体的概念，我会详细解释这部分的代码：

    var appView = Backbone.View.extend({
        //指定appView的el，也是整个应用的总容器
        el:$('#container')

        //同样的initialize方法
        ,initialize:function(){

            //给数据绑定相应的事件
            this.collection.bind('add',this.addOne,this);
            this.collection.bind('reset',this.addAll,this);

            //这里的Notes就是便签Model的Collection
            //在初始化的时候，fetch方法从localStorage中取出所有数据
            Notes.fetch();
        }
        ,render:function(){
            return this;
        }

        //初始化一个便签note
        ,initOne:function(note){
            //这里的NoteView就是每个便签的View
            //NoteView使用数据Model就是note
            var view = new NoteView({model:note});
            var ele = view.render().el

            $('#container').append(ele)
            //细节处理
            view.bringNoteToContainer(view)
            return ele;
        }
        
        //当用户自主添加的时候，增加动画效果
        ,addOne:function(note){
            //前面的初始化还是一样
            var ele = this.initOne(note);

            //这里是Animate.css的动画
            $(ele).addClass('animated bounceIn');

            //洁癖，细节处理
            setTimeout(function(){
                $(ele).removeClass('animated bounceIn');
            },600);
        }

        //fetch之后会触发reset事件，我们绑定了这个方法
        ,addAll:function(){
            var that = this;
            var length = Notes.models.length;
            $.each(Notes.models,function(index,item){
                //一个个的初始化
                that.initOne(item)
            });
        }
    });

    //这里是真正的启动的代码
    //指定了数据Collection
    var app = new appView({collection:Notes});

    //用户添加的时候事件处理
    $(document).bind('dblclick',function(e){
        e.preventDefault();
        if(e.target==$('html')[0]){
            Notes.create({position:{top:e.pageY,left:e.pageX}});
        }
    });

注释很详细，也不用再赘述了。

##Backbone.js更多资源
基本上到这里，使用Backbone.js整体的框架已经搭建好了，剩下的就是填充血肉了，这里面充满了细节，写的过程中慢慢体会、完善。再提供几个比较好的资源，以及这个插件的源码地址：

- [Notty Notes源码][19]
- [Babkbone 官方站点][13]
- [Backbone Tutorials][12]
- [简单的Todo实例][20]
- [Backbone 学习笔记][21]
- [Backbone 架构分析][22]
- [Backbone HelloWorld（中文）][23]
- [Backbone 初探][24]
- [Backbone has made me a better programmer][25]

##Chrome插件
Chrome插件开发的流程很舒适、自然。为了先配好环境，就先大致的介绍一下插件开发的相关事宜。如果比较熟悉，可忽略跳过。更详细全面的说明参考[官方文档][5]。

###manifest.json
每一个插件的`manifest.json`文件必不可少，看看[Notty Notes][Notty]，也就是我们要写的插件的`manifest.json`的内容吧：


    {
        "name": "Notty Notes"
        ,"version":"1.3"
        ,"manifest_version":2
        ,"description":"One of The Best Sticky Notes For Your Broswer"

        ,"app": {
            "launch": {
                "local_path": "main.html"
            }
        }
        ,"icons":{
            "16":"assets/32.png"
            ,"32":"assets/32.png"
        }

       ,"permissions": [
           "unlimitedStorage"
       ]
    }

顾名思义的就不多讲了，现在较新版本的Chrome，会对那些没有使用manifest_version为2的插件提示，升级为2之后，Chrome对插件的权限控制会更多，之前用到一些比较方便的写法都会有问题，比如内联的JS，new一个Function等等，[Chrome extension 升级到 manifest version 2 的问题][7]里说明了一些问题，可以了解一下。

根据插件的性质不同，`app`部分会有不同，我们要开发的[便签插件][Notty]是一个独立页面的应用，所以按照上述的方法写，如果是那种只打开一个在线页面的链接型插件，只要改成：

    ,"app": {
        "launch": {
            "web_url": "http://overapi.com/?chrome"
        }
    }

如果是浏览器增强型的，可以写成：

    ,"browser_action": {
        "default_icon":"assets/24.png"
        ,"default_title":"Notty Notes"
        ,"default_popup":"popup.html"
    }

无需`app`字段。按照你的需求，更多的可以参考[Manifest Files][8]。

`permissions`项是向Chrome请求需要的权限，在用户安装插件额时候，会有提示，可声明的权限可以参考[Permissions][9]。

###开发调试
关于文件的组织，除了`manifest.json`文件需要放在根目录之外，其他文件放在`manifest`中指定的位置即可，不得不说，很愉悦。

开发调试过程简单方便，在`扩展程序`的管理页面，选择`载入正在开发的扩展程序`，加载正在开发的文件目录就好，单页的应用，可直接在应用当页使用开发工具调试，`background`类型的也可以方便的在`扩展程序`页面看到打开调试工具的按钮。

做完准备工作，余下的开发过程就同平常一样，修改代码，刷新，看效果，调BUG，毫无不适。

##Chrome Web Store
###账号注册
[Chrome Web Store][4]在早起测试阶段，可以免费注册使用，现在注册一个可发布应用的账号需要支付5美元的费用，而且得是信用卡，之前一直没办信用卡，所以写了的插件只能自己打包发布管理，异常的纷杂，办信用卡之后，第一件事就是注册Chrome Web Store。

需要注意的一点是，填写地址部分，没有中国大陆的选项，不知道Google会不会检查信用卡发卡地和地址是否匹配，我选择了香港，瞎填了地址，也通过了，仅供参考。

###发布、推广
Chrome Store上插件的发布很简单，把自己的插件按要求打包好，上传即可，介绍写的简洁动人一些，准备几个漂亮的图标，再做几张符合尺寸要求的宣传图，发布之后，很快就能生效在相关的分类里面看到。吐槽一下，我的宣传图上传好几天了，也没见通过审核的迹象，效率啊XD。

最后再广告一下我的[便签插件][Notty]吧，感谢[靖哥哥][26]帮我做宣传图：
<a href="https://chrome.google.com/webstore/detail/notty-notes/ggbmjahbkbhakkfgjiggdclpmmpmhajn?hl=zh-CN" title="Notty Notes" target="_blank"><img src="/images/backbonechrome/notes-logo.jpg" alt="Notty Notes"></a>

[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    http://backbonejs.org  "Backbone.js"
[3]:    http://www.google.cn/intl/zh-CN/chrome/browser/  "Chrome Broswer"
[4]:    https://chrome.google.com/webstore/category/home  "Chrome Web Store"
[5]:    http://developer.chrome.com/extensions/getstarted.html "Chrome Extension Get Started"
[Notty]:    https://chrome.google.com/webstore/detail/notty-notes/ggbmjahbkbhakkfgjiggdclpmmpmhajn?hl=zh-CN "Notty Notes"
[7]:    http://www.qianduan.net/chrome-extension-upgrade-to-the-manifest-version-2-2.html "Chrome extension 升级到 manifest version 2 的问题"
[8]:    http://developer.chrome.com/extensions/manifest.html "Manifest Files"
[9]:    http://developer.chrome.com/extensions/manifest.html#permissions "Manifest Permissions"
[10]:    http://jquery.com/ "jQuery"
[11]:    http://underscorejs.org/ "UnderScore.js"
[12]:    http://backbonetutorials.com/ "Backbone Tutorials"
[13]:    http://documentcloud.github.com/backbone/ "Backbone Official"
[14]:    http://twitter.github.com/bootstrap/ "Bootstrap"
[15]:    http://jqueryui.com/ "jQuery UI"
[16]:    http://daneden.me/animate/ "Animate.css"
[17]:    https://github.com/jeromegn/Backbone.localStorage "Backbone.localStorage.js"
[18]:    https://github.com/gbirke/Sanitize.js "Sanitize.js"
[19]:    https://github.com/beiyuu/Notty-Notes
[20]:    http://documentcloud.github.com/backbone/examples/todos/index.html "Backbone Todo"
[21]:    http://www.the5fire.net/backbone-tutorials-catalogue.html "Backbone.js入门学习笔记目录"
[22]:    http://www.cnblogs.com/nuysoft/archive/2012/03/19/2404274.html "Backbone 架构分析"
[23]:    http://blog.csdn.net/soasme/article/details/6581029 "Backbone HelloWorld"
[24]:    http://weakfi.iteye.com/blog/1391990 "Backbone初探"
[25]:    http://floatleft.com/notebook/backbone-has-made-me-a-better-programmer "Backbone has made me a better programmer" 
[26]:    http://www.douban.com/people/JGuo/
