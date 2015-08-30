---
layout: post
title:  android实用小技巧
description: 本文是一篇译文,讲述的是Android开发过程中遇到的一些实用的小技巧,或者一些实用的API,作者介绍的非常全面，推荐大家收藏起来，平常写Android程序也用的上。
tags:   android, tips
categoried: android
date:   2015-04-16 9:52:18 +800
---

<p>
本文是一篇译文,讲述的是Android开发过程中遇到的一些实用的小技巧,或者一些实用的API,作者介绍的非常全面，推荐大家收藏起来，平常写Android程序也用的上。</p>

###第一部分

<p><a href="http://developer.android.com/reference/android/app/Activity.html#startActivities(android.content.Intent[]" target="_blank" rel="external">Activity.startActivities()</a>) 常用于在应用程序中间启动其他的Activity.</p>
<a id="more"></a>
<p><a href="http://developer.android.com/reference/android/text/TextUtils.html#isEmpty(java.lang.CharSequence" target="_blank" rel="external">TextUtils.isEmpty()</a>) 简单的工具类,用于检测是否为空</p>
<p><a href="http://developer.android.com/reference/android/text/Html.html#fromHtml(java.lang.String" target="_blank" rel="external">Html.fromHtml()</a>) 用于生成一个Html,参数可以是一个字符串.个人认为它不是很快,所以我不怎么经常去用.（我说不经常用它是为了重点突出这句话：请多手动构建 Spannable 来替换 Html.fromHtml），但是它对渲染从 web 上获取的文字还是很不错的。</p>
<p><a href="http://developer.android.com/reference/android/widget/TextView.html#setError%28java.lang.CharSequence%29" target="_blank" rel="external">TextView.setError()</a> 在验证用户输入的时候很棒</p>
<p><a href="http://developer.android.com/reference/android/os/Build.VERSION_CODES.html" target="_blank" rel="external">Build.VERSION_CODES</a> 这个标明了当前的版本号,在处理兼容性问题的时候经常会用到.点进去可以看到各个版本的不同特性</p>
<p><a href="http://developer.android.com/reference/android/util/Log.html#getStackTraceString(java.lang.Throwable" target="_blank" rel="external">Log.getStackTraceString()</a>) 方便的日志类工具,方法Log.v()、Log.d()、Log.i()、Log.w()和Log.e()都是将信息打印到LogCat中，有时候需要将出错的信息插入到数据库或一个自定义的日志文件中，那么这种情况就需要将出错的信息以字符串的形式返回来，也就是使用static String getStackTraceString(Throwable tr)方法的时候.</p>
<p><a href="http://developer.android.com/reference/android/view/LayoutInflater.html#from%28android.content.Context%29" target="_blank" rel="external">LayoutInflater.from()</a> 顾名思义,用于Inflate一个layout,参数是layout的id.这个经常写Adapter的人会用的比较多.</p>
<p><a href="http://developer.android.com/reference/android/view/ViewConfiguration.html#getScaledTouchSlop%28%29" target="_blank" rel="external">ViewConfiguration.getScaledTouchSlop()</a> 使用 ViewConfiguration 中提供的值以保证所有触摸的交互都是统一的。这个方法获取的值表示:用户的手滑动这个距离后,才判定为正在进行滑动.当然这个值也可以自己来决定.但是为了一致性,还是使用标准的值较好.</p>
<p><a href="http://developer.android.com/reference/android/telephony/PhoneNumberUtils.html#convertKeypadLettersToDigits%28java.lang.String%29" target="_blank" rel="external">PhoneNumberUtils.convertKeypadLettersToDigits</a> 顾名思义.将字母转换为数字,类似于T9输入法,</p>
<p><a href="http://developer.android.com/reference/android/content/Context.html#getCacheDir%28%29" target="_blank" rel="external">Context.getCacheDir()</a> 获取缓存数据文件夹的路径,很简单但是知道的人不多,这个路径通常在SD卡上(这里的SD卡指的是广义上的SD卡,包括外部存储和内部存储)Adnroid/data/您的应用程序包名/cache/  下面.测试的时候,可以去这里面看是否缓存成功.缓存在这里的好处是:不用自己再去手动创建文件夹,不用担心用户把自己创建的文件夹删掉,在应用程序卸载的时候,这里会被清空,使用第三方的清理工具的时候,这里也会被清空.</p>
<p><a href="http://developer.android.com/reference/android/animation/ArgbEvaluator.html" target="_blank" rel="external">ArgbEvaluator</a> 用于处理颜色的渐变。就像 Chris Banes 说的一样，这个类会进行很多自动装箱的操作，所以最好还是去掉它的逻辑自己去实现它。这个没用过,不明其所以然,回头再补充.</p>
<p><a href="http://developer.android.com/reference/android/view/ContextThemeWrapper.html" target="_blank" rel="external">ContextThemeWrapper</a> 方便在运行的时候修改主题.</p>
<p><a href="http://developer.android.com/reference/android/widget/Space.html" target="_blank" rel="external">Space</a> space是Android 4.0中新增的一个控件，它实际上可以用来分隔不同的控件，其中形成一个空白的区域.这是一个轻量级的视图组件，它可以跳过Draw，对于需要占位符的任何场景来说都是很棒的。</p>
<p><a href="http://developer.android.com/reference/android/animation/ValueAnimator.html#reverse%28%29" target="_blank" rel="external">ValueAnimator.reverse()</a> 这个方法可以很顺利地取消正在运行的动画.我超喜欢.</p>

###第二部分

<p><a href="http://developer.android.com/reference/android/text/format/DateUtils.html#formatDateTime%28android.content.Context,%20long,%20int%29" target="_blank" rel="external">DateUtils.formatDateTime()</a> 用来进行区域格式化工作,输出格式化和本地化的时间或者日期.</p>
<a id="more"></a>
<p><a href="http://developer.android.com/reference/android/app/AlarmManager.html#setInexactRepeating(int, long, long, android.app.PendingIntent" target="_blank" rel="external">AlarmManager.setInexactRepeating</a>) 通过闹铃分组的方式省电,即使你只调用了一个闹钟,这也是一个好的选择,（可以确保在使用完毕时自动调用 AlarmManager.cancel ()。原文说的比较抽象,这里详细说一下:setInexactRepeating指的是设置非准确闹钟,使用方法:alarmManager.setInexactRepeating(AlarmManager.RTC, startTime,intervalL, pendingIntent),非准确闹钟只能保证大致的时间间隔，但是不一定准确，可能出现设置间隔为30分钟，但是实际上一次间隔20分钟，另一次间隔40分钟。它的最大的好处是可以合并闹钟事件，比如间隔设置每30分钟一次，不唤醒休眠，在休眠8小时后已经积累了16个闹钟事件，而在手机被唤醒的时候，非准时闹钟可以把16个事件合并为一个, 所以这么看来,非准时闹钟一般来说比较节约能源.</p>
<p><a href="http://developer.android.com/reference/android/text/format/Formatter.html#formatFileSize(android.content.Context, long" target="_blank" rel="external">Formatter.formatFileSize()</a>) 一个区域化的文件大小格式化工具。通俗来说就是把大小转换为MB,G,KB之类的字符串.</p>
<p><a href="http://developer.android.com/reference/android/app/ActionBar.html#hide(" target="_blank" rel="external">ActionBar.hide()</a>)/<a href="http://developer.android.com/reference/android/app/ActionBar.html#show(" target="_blank" rel="external">.show()</a>) 顾名思义,隐藏和显示ActionBar,可以优雅地在全屏和带Actionbar之间转换.</p>
<p><a href="http://developer.android.com/reference/android/text/util/Linkify.html#addLinks(android.text.Spannable, int" target="_blank" rel="external">Linkify.addLinks()</a>)  在Text上添加链接.很实用.</p>
<p><a href="http://developer.android.com/reference/android/text/StaticLayout.html" target="_blank" rel="external">StaticLayout</a> 在自定义 View 中渲染文字的时候很实用。</p>
<p><a href="http://developer.android.com/reference/android/app/Activity.html#onBackPressed(" target="_blank" rel="external">Activity.onBackPressed()</a>) 很方便的管理back键的方法,有时候需要自己控制返回键的事件的时候,可以重写一下.比如加入 “点两下back键退出” 功能.</p>
<p><a href="http://developer.android.com/reference/android/view/GestureDetector.html" target="_blank" rel="external">GestureDetector</a> 用来监听和相应对应的手势事件,比如点击,长按,慢滑动,快滑动,用起来很简单,比你自己实现要方便许多.</p>
<p><a href="http://developer.android.com/reference/android/graphics/DrawFilter.html" target="_blank" rel="external">DrawFilter</a> 可以让你在不调用onDrew方法的情况下,操作canvas,比了个如,你可以在创建自定义 View 的时候设置一个 DrawFilter，给父 View 里面的所有 View 设置反别名。</p>
<p><a href="http://developer.android.com/reference/android/app/ActivityManager.html#getMemoryClass(" target="_blank" rel="external">ActivityManager.getMemoryClass()</a>) 告诉你你的机器还有多少内存,在计算缓存大小的时候会比较有用.</p>
<p><a href="http://developer.android.com/reference/android/view/ViewStub.html" target="_blank" rel="external">ViewStub</a> 它是一个初始化不做任何事情的 View，但是之后可以载入一个布局文件。在慢加载 View 中很适合做占位符。唯一的缺点就是不支持标签，所以如果你不太小心的话，可能会在视图结构中加入不需要的嵌套。</p>
<p><a href="http://developer.android.com/reference/android/os/SystemClock.html#sleep(long" target="_blank" rel="external">SystemClock.sleep()</a>) 这个方法在保证一定时间的 sleep 时很方便，通常我用来进行 debug 和模拟网络延时。</p>
<p><a href="http://developer.android.com/reference/android/util/DisplayMetrics.html#density" target="_blank" rel="external">DisplayMetrics.density</a> 这个方法你可以获取设备像素密度,大部分时候最好让系统来自动进行缩放资源之类的操作,但是有时候控制的效果会更好一些.(尤其是在自定义View的时候).</p>
<p><a href="http://developer.android.com/reference/android/util/Pair.html#create(A, B" target="_blank" rel="external">Pair.create()</a>) 方便构建类和构造器的方法。</p>

###第三部分

<p><a href="http://developer.android.com/reference/android/net/UrlQuerySanitizer.html" target="_blank" rel="external">UrlQuerySanitizer</a>——使用这个工具可以方便对 URL 进行检查。</p>
<a id="more"></a>
<p><a href="http://developer.android.com/reference/android/app/Fragment.html#setArguments%28android.os.Bundle%29" target="_blank" rel="external">Fragment.setArguments</a>——因为在构建 Fragment 的时候不能加参数，所以这是个很好的东西，可以在创建 Fragment 之前设置参数（即使在 configuration 改变的时候仍然会导致销毁/重建）。</p>
<p><a href="http://developer.android.com/reference/android/app/DialogFragment.html#setShowsDialog%28boolean%29" target="_blank" rel="external">DialogFragment.setShowsDialog ()</a>—— 这是一个很巧妙的方式，DialogFragment 可以作为正常的 Fragment 显示！这里可以让 Fragment 承担双重任务。我通常在创建 Fragment 的时候把 onCreateView ()和 onCreateDialog ()都加上，就可以创建一个具有双重目的的 Fragment。</p>
<p><a href="http://developer.android.com/reference/android/app/FragmentManager.html#enableDebugLogging%28boolean%29" target="_blank" rel="external">FragmentManager.enableDebugLogging ()</a>——在需要观察 Fragment 状态的时候会有帮助。</p>
<p><a href="http://developer.android.com/reference/android/support/v4/content/LocalBroadcastManager.html" target="_blank" rel="external">LocalBroadcastManager</a>——这个会比全局的 broadcast 更加安全，简单，快速。像 <a href="http://square.github.io/otto/" target="_blank" rel="external">otto</a> 这样的 Event buses 机制对你的应用场景更加有用。</p>
<p><a href="http://developer.android.com/reference/android/telephony/PhoneNumberUtils.html#formatNumber%28java.lang.String%29" target="_blank" rel="external">PhoneNumberUtils.formatNumber ()</a>——顾名思义，这是对数字进行格式化操作的时候用的。</p>
<p><a href="http://developer.android.com/reference/android/graphics/Region.html#op%28android.graphics.Region,%20android.graphics.Region,%20android.graphics.Region.Op%29" target="_blank" rel="external">Region.op()</a>——我发现在对比两个渲染之前的区域的时候很实用，如果你有两条路径，那么怎么知道它们是不是会重叠呢？使用这个方法就可以做到。</p>
<p><a href="http://developer.android.com/reference/android/app/Application.html#registerActivityLifecycleCallbacks%28android.app.Application.ActivityLifecycleCallbacks%29" target="_blank" rel="external">Application.registerActivityLifecycleCallbacks</a>——虽然缺少官方文档解释，不过我想它就是注册 Activity 的生命周期的一些回调方法（顾名思义），就是一个方便的工具。</p>
<p><a href="http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Build-Types" target="_blank" rel="external">versionNameSuffix</a>——这个 gradle 设置可以让你在基于不同构建类型的 manifest 中修改版本名这个属性，例如，如果需要在在 debug 版本中以”-SNAPSHOT”结尾，那么就可以轻松的看出当前是 debug 版还是 release 版。</p>
<p><a href="http://developer.android.com/reference/android/database/CursorJoiner.html" target="_blank" rel="external">CursorJoiner</a>——如果你是只使用一个数据库的话，使用 SQL 中的 join 就可以了，但是如果收到的数据是来自两个独立的 ContentProvider，那么 CursorJoiner 就很实用了。</p>
<p><a href="http://www.genymotion.com/" target="_blank" rel="external">Genymotion</a>——一个非常快的 Android 模拟器，本人一直在用。</p>
<p><a href="http://developer.android.com/guide/practices/screens_support.html#qualifiers" target="_blank" rel="external">-nodpi</a>——在没有特别定义的情况下，很多修饰符(-mdpi,-hdpi,-xdpi等等)都会默认自动缩放 assets/dimensions，有时候我们需要保持显示一致，这种情况下就可以使用 -nodpi。</p>
<p><a href="http://developer.android.com/reference/android/content/BroadcastReceiver.html#setDebugUnregister%28boolean%29" target="_blank" rel="external">BroadcastRecevier.setDebugUnregister ()</a>——又一个方便的调试工具。</p>
<p><a href="http://developer.android.com/reference/android/app/Activity.html#recreate%28%29" target="_blank" rel="external">Activity.recreate ()</a>——强制让 Activity 重建。</p>
<p><a href="http://developer.android.com/reference/android/content/pm/PackageManager.html#checkSignatures%28java.lang.String,%20java.lang.String%29" target="_blank" rel="external">PackageManager.checkSignatures ()</a>——如果同时安装了两个 app 的话，可以用这个方法检查。如果不进行签名检查的话，其他人可以轻易通过使用一样的包名来模仿你的 app。</p>

###第四部分

<p><a href="http://developer.android.com/reference/android/app/Activity.html#isChangingConfigurations%28%29" target="_blank" rel="external">Activity.isChangingConfigurations ()</a>——如果在 Activity 中 configuration 会经常改变的话，使用这个方法就可以不用手动做保存状态的工作了。</p>
<a id="more"></a>
<p><a href="http://developer.android.com/reference/android/content/SearchRecentSuggestionsProvider.html" target="_blank" rel="external">SearchRecentSuggestionsProvider</a>——可以创建最近提示效果的 provider，是一个简单快速的方法。</p>
<p><a href="http://developer.android.com/reference/android/view/ViewTreeObserver.html" target="_blank" rel="external">ViewTreeObserver</a>——这是一个很棒的工具。可以进入到 VIew 里面，并监控 View 结构的各种状态，通常我都用来做 View 的测量操作（自定义视图中经常用到）。</p>
<p><a href="https://www.timroes.de/2013/09/12/speed-up-gradle/" target="_blank" rel="external">org.gradle.daemon=true</a>——这句话可以帮助减少 Gradle 构建的时间，仅在命令行编译的时候用到，因为 Android Studio 已经这样使用了。</p>
<p><a href="http://developer.android.com/reference/android/database/DatabaseUtils.html" target="_blank" rel="external">DatabaseUtils</a>——一个包含各种数据库操作的使用工具。</p>
<p><a href="http://developer.android.com/reference/android/widget/LinearLayout.html#attr_android:weightSum" target="_blank" rel="external">android:weightSum (LinearLayout)</a>——如果想使用 layout weights，但是却不想填充整个 LinearLayout 的话，就可以用 weightSum 来定义总的 weight 大小。</p>
<p><a href="http://developer.android.com/reference/android/view/View.html#attr_android:duplicateParentState" target="_blank" rel="external">android:duplicateParentState (View)</a>——此方法可以使得子 View 可以复制父 View 的状态。比如如果一个 ViewGroup 是可点击的，那么可以用这个方法在它被点击的时候让它的子 View 都改变状态。</p>
<p><a href="http://developer.android.com/reference/android/view/ViewGroup.html#attr_android:clipChildren" target="_blank" rel="external">android:clipChildren (ViewGroup)</a>——如果此属性设置为不可用，那么 ViewGroup 的子 View 在绘制的时候会超出它的范围，在做动画的时候需要用到。</p>
<p><a href="http://developer.android.com/reference/android/widget/ScrollView.html#attr_android:fillViewport" target="_blank" rel="external">android:fillViewport (ScrollView)</a>——在这片文章中有详细介绍<a href="http://www.curious-creature.org/2010/08/15/scrollviews-handy-trick/" target="_blank" rel="external">文章链接</a>，可以解决在 ScrollView 中当内容不足的时候填不满屏幕的问题。</p>
<p><a href="http://developer.android.com/guide/topics/resources/drawable-resource.html#Bitmap" target="_blank" rel="external">android:tileMode (BitmapDrawable)</a>——可以指定图片使用重复填充的模式。</p>
<p><a href="http://developer.android.com/reference/android/R.attr.html#exitFadeDuration" target="_blank" rel="external">android:enterFadeDuration/android:exitFadeDuration (Drawables)</a>——此属性在 Drawable 具有多种状态的时候，可以定义它展示前的淡入淡出效果。</p>
<p><a href="http://developer.android.com/reference/android/widget/ImageView.html#attr_android:scaleType" target="_blank" rel="external">android:scaleType (ImageView)</a>——定义在 ImageView 中怎么缩放/剪裁图片，一般用的比较多的是“centerCrop”和“centerInside”。</p>
<p><a href="http://developer.android.com/training/improving-layouts/reusing-layouts.html#Merge" target="_blank" rel="external">Merge</a>——此标签可以在另一个布局文件中包含别的布局文件，而不用再新建一个 ViewGroup，对于自定义 ViewGroup 的时候也需要用到；可以通过载入一个带有标签的布局文件来自动定义它的子部件。</p>
<p><a href="http://developer.android.com/reference/android/util/AtomicFile.html" target="_blank" rel="external">AtomicFile</a>——通过使用备份文件进行文件的原子化操作。这个知识点之前我也写过，不过最好还是有出一个官方的版本比较好。</p>

###第五部分

<p><a href="https://developer.android.com/reference/android/support/v4/widget/ViewDragHelper.html" target="_blank" rel="external">ViewDragHelper</a> ——视图拖动是一个比较复杂的问题。这个类可以帮助解决不少问题。如果你需要一个例子，<a href="https://developer.android.com/reference/android/support/v4/widget/DrawerLayout.html" target="_blank" rel="external">DrawerLayout</a>就是利用它实现扫滑。Flavient Laurent 还写了一些关于这方面的<a href="http://flavienlaurent.com/blog/2013/08/28/each-navigation-drawer-hides-a-viewdraghelper/" target="_blank" rel="external">优秀文章</a>。</p>
<a id="more"></a>
<p><a href="https://developer.android.com/reference/android/widget/PopupWindow.html" target="_blank" rel="external">PopupWindow</a>——Android到处都在使用PopupWindow ，甚至你都没有意识到（标题导航条ActionBar，自动补全AutoComplete，编辑框错误提醒Edittext Errors）。这个类是创建浮层内容的主要方法。</p>
<p><a href="https://developer.android.com/reference/android/app/ActionBar.htmlgetThemedContext%28%29" target="_blank" rel="external">Actionbar.getThemrContext()</a>——导航栏的主题化是很复杂的（不同于Activity其他部分的主题化）。你可以得到一个上下文（Context），用这个上下文创建的自定义组件可以得到正确的主题。</p>
<p><a href="https://developer.android.com/reference/android/media/ThumbnailUtils.html" target="_blank" rel="external">ThumbnailUtils</a>——帮助创建缩略图。通常我都是用现有的图片加载库（比如，Picasso 或者 Volley），不过这个ThumbnaiUtils可以创建视频缩略图。<strong>译者注：</strong>该API从V8才开始支持。</p>
<p><a href="https://developer.android.com/reference/android/content/Context.htmlgetExternalFilesDir%28java.lang.String%29" target="_blank" rel="external">Context.getExternalFilesDir()</a>———— 申请了SD卡写权限后，你可以在SD的任何地方写数据，把你的数据写在设计好的合适位置会更加有礼貌。这样数据可以及时被清理，也会有更好的用户体验。此外，Android 4.0 Kitkat中在这个文件夹下写数据是不需要权限的，每个用户有自己的独立的数据存储路径。<strong>译者注：</strong>该API从V8才开始支持。</p>
<p><a href="https://developer.android.com/reference/android/util/SparseArray.html" target="_blank" rel="external">SparseArray</a>——Map的高效优化版本。推荐了解姐妹类SparseBooleanArray、SparseIntArray和SparseLongArray。</p>
<p><a href="https://developer.android.com/reference/android/content/pm/PackageManager.htmlsetComponentEnabledSetting%28android.content.ComponentName,%20int,%20int%29" target="_blank" rel="external">PackageManager.setComponentEnabledSetting()</a>——可以用来启动或者禁用程序清单中的组件。对于关闭不需要的功能组件是非常赞的，比如关掉一个当前不用的广播接收器。</p>
<p><a href="https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.htmlyieldIfContendedSafely%28%29" target="_blank" rel="external">SQLiteDatabase.yieldIfContendedSafely()</a>——让你暂时停止一个数据库事务， 这样你可以就不会占用太多的系统资源。</p>
<p><a href="https://developer.android.com/reference/android/os/Environment.html#getExternalStoragePublicDirectory%28java.lang.String%29" target="_blank" rel="external">Environment.getExternalStoragePublicDirectory()</a>——还是那句话，用户期望在SD卡上得到统一的用户体验。用这个方法可以获得在用户设备上放置指定类型文件（音乐、图片等）的正确目录。</p>
<p><a href="https://developer.android.com/reference/android/view/View.htmlgenerateViewId%28%29" target="_blank" rel="external">View.generateViewId()</a>——每次我都想要推荐动态生成控件的ID。需要注意的是，不要和已经存在的控件ID或者其他已经生成的控件ID重复。</p>
<p><a href="https://developer.android.com/reference/android/app/ActivityManager.htmlclearApplicationUserData%28%29" target="_blank" rel="external">ActivityManager.clearApplicationUserData()</a>—— 一键清理你的app产生的用户数据，可能是做用户退出登录功能，有史以来最简单的方式了。</p>
<p><a href="http://developer.android.com/reference/android/content/Context.htmlcreateConfigurationContext%28android.%E2%80%94%E2%80%94ontent.res.Configuration%29" target="_blank" rel="external">Context.createConfigurationContext()</a> ——自定义你的配置环境信息。我通常会遇到这样的问题：强制让一部分显示在某个特定的环境下（倒不是我一直这样瞎整，说来话长，你很难理解）。用这个实现起来可以稍微简单一点。</p>
<p><a href="http://developer.android.com/reference/android/app/ActivityOptions.html" target="_blank" rel="external">ActivityOptions</a> ——方便的定义两个Activity切换的动画。 使用<a href="http://developer.android.com/reference/android/support/v4/app/ActivityOptionsCompat.html" target="_blank" rel="external">ActivityOptionsCompat</a> 可以很好解决旧版本的兼容问题。</p>
<p><a href="http://developer.android.com/reference/android/widget/AdapterViewFlipper.htmlfyiWillBeAdvancedByHostKThx%28%29" target="_blank" rel="external">AdapterViewFlipper.fyiWillBeAdvancedByHostKThx()</a>——仅仅因为很好玩，没有其他原因。在整个安卓开源项目中（AOSP the Android ——pen Source Project Android开放源代码项目）中还有其他很有意思的东西（比如<br><a href="http://developer.android.com/reference/android/hardware/SensorManager.htmlGRAVITY_DEATH_STAR_I" target="_blank" rel="external">GRAVITY_DEATH_STAR_I</a>）。不过，都不像这个这样，这个确实有用</p>
<p><a href="http://developer.android.com/reference/android/view/ViewParent.htmlrequestDisallowInterceptTouchEvent%28boolean%29" target="_blank" rel="external">ViewParent.requestDisallowInterceptTouchEvent()</a> ——Android系统触摸事件机制大多时候能够默认处理，不过有时候你需要使用这个方法来剥夺父级控件的控制权（顺便说一下，如果你想对Android触摸机制了解更多，<a href="https://www.youtube.com/watch?v=EZAoJU-nUyI" target="_blank" rel="external">这个演讲</a>会令你惊叹不已。）</p>

原文作者:[http://blog.danlew.net/about/](http://blog.danlew.net/about/)

原文地址：[http://coolshell.info/blog/2015/04/android-tips.html](http://coolshell.info/blog/2015/04/android-tips.html)

本文地址：[http://coolshell.info/blog/2015/04/android-tips.html](http://coolshell.info/blog/2015/04/android-tips.html)
