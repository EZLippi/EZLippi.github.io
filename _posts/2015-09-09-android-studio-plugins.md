---
layout: post
title: 提高效率的Android Studio插件
category: Android
tags: [android, studio]
---

这里记录那些可以显著提升Android开发效率的Studio插件，好的插件和快捷键可以提高效率，缩短开发周期。这里介绍的插件大部分都可以通过Studio的插件市场下载安装，安装方法如下：

1. in Android Studio: go to Preferences → Plugins → Browse repositories,搜索你要安装的插件

2. download it and install via Preferences → Plugins → Install plugin from disk

主要的插件：

1.H.A.X.M和GenyMotion这两个网上介绍的比较多，就不说了

2.[ButterKnifeZelezny](https://github.com/avast/android-butterknife-zelezny)

ButterKnife视图注入插件,如果你的Activity布局里面有很多组件，写一堆的findViewById岂不是很烦人，ButterKnife解决了这个烦人的问题,这个插件的效果图如下：

![](/images/butterknife.gif)

3.[android-drawable-importer](https://github.com/winterDroid/android-drawable-importer-intellij-plugin)

它可以减少导入缩放图像到Android项目所需的工作量,Android  Drawable Importer添加了一个在不同分辨率导入画板或缩放指定图像到定义分辨率的选项,该插件包含三个主要功能，可以在New下的Android module的任意地方通过右键访问它们：
1、引入AndroidIcons Drawable
选择资源，指定颜色，改变目标资源名字以及选中所有你想引入的资源。然后会自动创建所有缺失的文件夹，如果已经存在相同名字的drawable，则会进行警告。

2、Scaled Drawable
选择资源并指定分辨率。如果你想缩放引入的图片，你应该选择“其他”选项，然后填充目标分辨率和目标宽度/高度。

3、Multisource-Drawable
引入不同资源的Drawable，设计者根据如下结构设计不同资源的Drawable zip文件，引入一个zip文件即可引入不同分辨率的Drawable。
	root/
      	./drawable_ldpi.png
     	 ./drawable_mdpi.png
      	./drawable_hdpi.png
     	 ./drawable_xhdpi.png
如图所示:
![](/images/drawableimport.png)

4.[adb-idea](https://github.com/pbreault/adb-idea)
支持直接在AS面板中进行ADB操作,快捷键:
* Mac OSX: Ctrl+Shift+A
* Windows/Linux: Ctrl+Alt+Shift+A

![](/images/adb.png)

5.[SelectorChapek](https://github.com/inmite/android-selector-chapek)

按照命名规范自动生成Selector,如图所示：

如何使用：

* 在资源文件夹下右击，比如'drawable_xhdpi'下：

![](/images/selector1.png)

* 选择Generate Android Selectors

![](/images/selector2.png)

* 所有的selector自动出现在drawable文件夹下 

![](/images/selector3.png)

6.[GsonFormat](https://github.com/zzz40500/GsonFormat)

根据Gson　api接口生成相应的实体类

![](/images/gson_format.gif)

7.[ParcelableGenerator](https://github.com/mcharmas/android-parcelable-intellij-plugin)

Android中的序列化有两种方式，分别是实现Serializable接口和Parcelable接口，但在Android中是推荐使用Parcelable，只不过我们这种方式要比Serializable方式要繁琐,这个插件帮助我们解决繁琐的事情。

![](/images/parcelable_generator.png)


8.[android-material-design-icon-generator](https://github.com/konifar/android-material-design-icon-generator-plugin)

![](/images/capture.gif)

9.[idea-markdown](https://github.com/nicoulaj/idea-markdown)

![](/images/preview.png)

10.[Android Holo Colors Generator](ns.jetbrains.com/plugin/7366?pr=)


![](/images/holocolor.png)

11.[Codota](https://www.codota.com/)

搜索代码的插件，他的搜索源，不仅只有Github，而且还有知名博客和开发者网站，让你搜索一个东西，不用在找上半天；

除了搜索功能，首页的下方还罗列比较流行的类库，还提供保存代码的CodeBox，同时还提供了Chrome 插件和Android Studio 插件，最后通过Google，Github，Facebook 任意一个授权登录即可使用；

而且当你点击搜索的结果（Java class）的时候，右侧会显示UML 视图，而且左边的代码如果点击会有高亮现实，而且还会显示Doc，并提供了API Doc 的链接

![](/images/codota.png)

12.[ideaVim](https://github.com/JetBrains/ideavim)
   有了它之后就可以在Idea里指尖如飞了

13.[LeakCanary](https://github.com/square/leakcanary)

Square最近刚开源的一个非常有用的工具，强烈推荐，帮助你在开发阶段方便的检测出内存泄露的问题，使用起来更简单方便

![](/images/leak.png)

14.checkStyle 和　findBugs都还不错

15.如果你像推荐其他插件，可以在本文最上方点击纠错后添加，然后pull request。




