---
layout:     post
title:      Android Studio多渠道打包和代码混淆教程
keywords:	Android Studio, 打包, 混淆
data:   2015-03-18 18:30:20 +800
categories : [android]
description:  Gradle是一种依赖管理工具，基于Groovy语言，面向Java应用为主，它抛弃了基于XML的各种繁琐配置，取而代之的是一种基于Groovy的内部领域特定（DSL）语言。
tags: android
---


###什么是Gradle
Gradle是一种依赖管理工具，基于Groovy语言，面向Java应用为主，它抛弃了基于XML的各种繁琐配置，取而代之的是一种基于Groovy的领域特定（DSL）语言。Android Studio中新建项目成功后自动下载Gradle。
Gradle有几个基本组件：

1.整个项目的gradle配置文件build.gradle

{% highlight Groovy %}

// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
 repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.1.0'

    // NOTE: Do not place your application dependencies here; they belong
    // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        mavenCentral()
    }
}

{% endhighlight %}

内容主要包含了两个方面：一个是声明仓库的源，我这里用的是mavenCentral(), jcenter可以理解成是一个新的中央远程仓库，兼容maven中心仓库，而且性能更优。另一个是声明了android gradle plugin的版本，android studio 1.1正式版必须要求支持gradle plugin 1.1的版本。

---------------------

2.app文件夹下这个Module的gradle配置文件，也可以算是整个项目最主要的gradle配置文件

 {% highlight Groovy %}

apply plugin: 'com.android.application'

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.1.0'

    }
}

android {
    compileSdkVersion 17
    buildToolsVersion "21.1.2"

    defaultConfig {
        applicationId "com.lippi.recorder"
        minSdkVersion 15
        targetSdkVersion 17
        versionCode 1
        versionName '1.4'

        // dex突破65535的限制
        multiDexEnabled true
        // AndroidManifest.xml 里面UMENG_CHANNEL的value为 ${UMENG_CHANNEL_VALUE}
        manifestPlaceholders = [UMENG_CHANNEL_VALUE: "channel_name"]
    }

    sourceSets {
        main {
            manifest.srcFile 'src/main/AndroidManifest.xml'
            java.srcDirs = ['src/main/java']
            resources.srcDirs = ['src/main/resources']
            aidl.srcDirs = ['src/main/aidl']
            renderscript.srcDirs = ['src/maom']
            res.srcDirs = ['src/main/res']
            assets.srcDirs = ['src/main/assets']
            jniLibs.srcDir 'src/main/jniLibs'
        }

        // Move the tests to tests/java, tests/res, etc...
        instrumentTest.setRoot('tests')

        // Move the build types to build-types/<type>
        // For instance, build-types/debug/java, build-types/debug/AndroidManifest.xml, ...
        // This moves them out of them default location under src/<type>/... which would
        // conflict with src/ being used by the main source set.
        // Adding new build types or product flavors should be accompanied
        // by a similar customization.
        debug.setRoot('build-types/debug')
        release.setRoot('build-types/release')
    }
    //执行lint检查，有任何的错误或者警告提示，都会终止构建，我们可以将其关掉。
    lintOptions {
        abortOnError false
    }

    //签名
    signingConfigs {
        debug {
            storeFile file("/home/lippi/.android/debug.keystore")
        }
        relealse {
            //这样写就得把demo.jk文件放在项目目录
            storeFile file("recorder.jks")
            storePassword "recorder"
            keyAlias "recorder"
            keyPassword "recorder"
        }
    }

    buildTypes {
        debug {
            // 显示Log
            buildConfigField "boolean", "LOG_DEBUG", "true"

            versionNameSuffix "-debug"
            minifyEnabled false
            zipAlignEnabled false
            shrinkResources false
            signingConfig signingConfigs.debug
        }

        release {
            // 不显示Log
            buildConfigField "boolean", "LOG_DEBUG", "false"
            //混淆
            minifyEnabled true
            //Zipalign优化
            zipAlignEnabled true

            // 移除无用的resource文件
            shrinkResources true
            //前一部分代表系统默认的android程序的混淆文件，该文件已经包含了基本的混淆声明
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard.cfg'
            //签名
            signingConfig signingConfigs.relealse
        }
    }
    //渠道Flavors，配置不同风格的app
    productFlavors {
        GooglePlay {}
        xiaomi {}
        umeng {}
        _360 {}
        baidu {}
        wandoujia {}
    }
    //批量配置
    productFlavors.all { flavor ->
        flavor.manifestPlaceholders = [UMENG_CHANNEL_VALUE: name]
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_7
        targetCompatibility JavaVersion.VERSION_1_7
    }
    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            def outputFile = output.outputFile
            if (outputFile != null && outputFile.name.endsWith('.apk')) {
                def fileName = outputFile.name.replace(".apk", "-${defaultConfig.versionName}.apk")
                output.outputFile = new File(outputFile.parent, fileName)
            }
        }
    }

    dependencies {
        compile fileTree(include: ['*.jar'], dir: 'libs')
        compile 'org.apache.commons:commons-math:2.1'
        compile 'org.slf4j:slf4j-log4j12:1.7.5'
    }
}

{% endhighlight %}

*   文件开头apply plugin是最新gradle版本的写法，以前的写法是apply plugin: ‘android’, 如果还是以前的写法，请改正过来。

*   buildToolsVersion这个需要你本地安装该版本才行，很多人导入新的第三方库，失败的原因之一是build version的版本不对，这个可以手动更改成你本地已有的版本或者打开 SDK Manager 去下载对应版本。

*   applicationId代表应用的包名，也是最新的写法，这里就不在多说了。

*   android 5.0开始默认安装jdk1.7才能编译
*   minifyEnabled（混淆）也是最新的语法，很早之前是runProguard,这个也需要更新下。

*   proguardFiles这部分有两段，前一部分代表系统默认的android程序的混淆文件，该文件已经包含了基本的混淆声明，免去了我们很多事，这个文件的目录在 **/tools/proguard/proguard-android.txt** , 后一部分是我们项目里的自定义的混淆文件，目录就在 **app/proguard-rules.txt** , 如果你用Studio 1.0创建的新项目默认生成的文件名是 **proguard-rules.pro** , 这个名字没关系，在这个文件里你可以声明一些第三方依赖的一些混淆规则,后面会具体讲到。

compile project(‘:extras:ShimmerAndroid’)这一行是因为项目中存在其他Module，你可以理解成Android Library，由于Gradle的普及以及远程仓库的完善，这种依赖渐渐的会变得非常不常见，但是你需要知道有这种依赖的。

---------------------------------

3.gradle目录下有个 wrapper 文件夹，里面可以看到有两个文件，我们主要看下 gradle-wrapper.properties 这个文件的内容：

 {% highlight Groovy %}
 
#Fri Dec 19 21:59:01 CST 2014
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-2.2.1-all.zip
 {% endhighlight %}
     
可以看到里面声明了gradle的目录与下载路径以及当前项目使用的gradle版本，这些默认的路径我们一般不会更改的，这个文件里指明的gradle版本不对也是很多导包不成功的原因之一

-------------------------------------

4.settings.gradle

这个文件是全局的项目配置文件，里面主要声明一些需要加入gradle的module

    include ':recorder'

文件中recorder是项目的module，如果还有其他module按照相同的格式加上去。

----------------------------


##Gradle多渠道打包

由于国内Android市场众多渠道，为了统计每个渠道的下载及其它数据统计，就需要我们针对每个渠道单独打包，如果让你打几十个市场的包岂不烦死了，不过有了Gradle，这再也不是事了。
以友盟统计为例，在AndroidManifest.xml里面会有这么一段：

{% highlight Groovy %}

<meta-data
android:name="UMENG_CHANNEL"
android:value="Channel_ID" />
{% endhighlight %}
      
里面的Channel_ID就是渠道标示。我们的目标就是在编译的时候这个值能够自动变化。
*   第一步 在AndroidManifest.xml里配置PlaceHolder
{% highlight Groovy %}
<meta-data
android:name="UMENG_CHANNEL"
android:value="${UMENG_CHANNEL_VALUE}" />
{% endhighlight %}

*   第二步 在build.gradle  设置productFlavors
{% highlight Groovy %}
android { 
productFlavors {
    xiaomi {}
    _360 {}
    baidu {}
    wandoujia {}
} 

productFlavors.all { 
    flavor -> flavor.manifestPlaceholders = [UMENG_CHANNEL_VALUE: name] 
    }
}
{% endhighlight %}

然后直接执行` ./gradlew assembleRelease `然后就等待打包完成吧。
 
 assemble 这个命令，会结合 Build Type 创建自己的task，如:

* ./gradlew assembleDebug

* ./gradlew assembleRelease

除此之外 assemble 还能和 Product Flavor 结合创建新的任务，其实 assemble 是和 Build Variants 一起结合使用的，而 Build Variants = Build Type + Product Flavor ， 举个例子大家就明白了：

如果我们想打包wandoujia渠道的release版本，执行如下命令就好了：

    ./gradlew assembleWandoujiaRelease

如果我们只打wandoujia渠道版本，则：

    ./gradlew assembleWandoujia

此命令会生成wandoujia渠道的Release和Debug版本

同理我想打全部Release版本：

    ./gradlew assembleRelease

这条命令会把Product Flavor下的所有渠道的Release版本都打出来。

----------------------------------

##代码混淆

下面是常见的的proguard.cfg配置项：

       
        
        #指定代码的压缩级别
        -optimizationpasses 5
        
        #包明不混合大小写
        -dontusemixedcaseclassnames
        
        #不去忽略非公共的库类
        -dontskipnonpubliclibraryclasses
        
         #优化  不优化输入的类文件
        -dontoptimize
        
         #预校验
        -dontpreverify
        
         #混淆时是否记录日志
        -verbose
        
         # 混淆时所采用的算法
        -optimizations !code/simplification/arithmetic,!field/*,!class/merging/*
        
        #保护注解
        -keepattributes *Annotation*
        
        # 保持哪些类不被混淆
        -keep public class * extends android.app.Fragment
        -keep public class * extends android.app.Activity
        -keep public class * extends android.app.Application
        -keep public class * extends android.app.Service
        -keep public class * extends android.content.BroadcastReceiver
        -keep public class * extends android.content.ContentProvider
        -keep public class * extends android.app.backup.BackupAgentHelper
        -keep public class * extends android.preference.Preference
        -keep public class com.android.vending.licensing.ILicensingService
        #如果有引用v4包可以添加下面这行
        -keep public class * extends android.support.v4.app.Fragment
        
        
        
        #忽略警告
        -ignorewarning
        
        ##记录生成的日志数据,gradle build时在本项目根目录输出##
        
        #apk 包内所有 class 的内部结构
        -dump class_files.txt
        #未混淆的类和成员
        -printseeds seeds.txt
        #列出从 apk 中删除的代码
        -printusage unused.txt
        #混淆前后的映射
        -printmapping mapping.txt
        
        ########记录生成的日志数据，gradle build时 在本项目根目录输出-end######
        
        
        #####混淆保护自己项目的部分代码以及引用的第三方jar包library#######
        
        #-libraryjars libs/umeng-analytics-v5.2.4.jar
        
        #三星应用市场需要添加:sdk-v1.0.0.jar,look-v1.0.1.jar
        #-libraryjars libs/sdk-v1.0.0.jar
        #-libraryjars libs/look-v1.0.1.jar
        
        #如果不想混淆 keep 掉
        -keep class com.lippi.recorder.iirfilterdesigner.** {*; }
        #友盟
        -keep class com.umeng.**{*;}
        #项目特殊处理代码
        
        #忽略警告
        -dontwarn com.lippi.recorder.utils**
        #保留一个完整的包
        -keep class com.lippi.recorder.utils.** {
            *;
         }
        
        -keep class  com.lippi.recorder.utils.AudioRecorder{*;}
        
        
        #如果引用了v4或者v7包
        -dontwarn android.support.**
        
        ####混淆保护自己项目的部分代码以及引用的第三方jar包library-end####
        
        -keep public class * extends android.view.View {
            public <init>(android.content.Context);
            public <init>(android.content.Context, android.util.AttributeSet);
            public <init>(android.content.Context, android.util.AttributeSet, int);
            public void set*(...);
        }
        
        #保持 native 方法不被混淆
        -keepclasseswithmembernames class * {
            native <methods>;
        }
        
        #保持自定义控件类不被混淆
        -keepclasseswithmembers class * {
            public <init>(android.content.Context, android.util.AttributeSet);
        }
        
        #保持自定义控件类不被混淆
        -keepclassmembers class * extends android.app.Activity {
           public void *(android.view.View);
        }
        
        #保持 Parcelable 不被混淆
        -keep class * implements android.os.Parcelable {
          public static final android.os.Parcelable$Creator *;
        }
        
        #保持 Serializable 不被混淆
        -keepnames class * implements java.io.Serializable
        
        #保持 Serializable 不被混淆并且enum 类也不被混淆
        -keepclassmembers class * implements java.io.Serializable {
            static final long serialVersionUID;
            private static final java.io.ObjectStreamField[] serialPersistentFields;
            !static !transient <fields>;
            !private <fields>;
            !private <methods>;
            private void writeObject(java.io.ObjectOutputStream);
            private void readObject(java.io.ObjectInputStream);
            java.lang.Object writeReplace();
            java.lang.Object readResolve();
        }
        
        #保持枚举 enum 类不被混淆 如果混淆报错，建议直接使用上面的 -keepclassmembers class * implements java.io.Serializable即可
        #-keepclassmembers enum * {
        #  public static **[] values();
        #  public static ** valueOf(java.lang.String);
        #}
        
        -keepclassmembers class * {
            public void *ButtonClicked(android.view.View);
        }
        
        #不混淆资源类
        -keepclassmembers class **.R$* {
            public static <fields>;
        }
        
        #避免混淆泛型 如果混淆报错建议关掉
        #–keepattributes Signature
        
        #移除log 测试了下没有用还是建议自己定义一个开关控制是否输出日志
        #-assumenosideeffects class android.util.Log {
        #    public static boolean isLoggable(java.lang.String, int);
        #    public static int v(...);
        #    public static int i(...);
        #    public static int w(...);
        #    public static int d(...);
        #    public static int e(...);
        #}
        
        #如果用用到Gson解析包的，直接添加下面这几行就能成功混淆，不然会报错。
        #gson
        #-libraryjars libs/gson-2.2.2.jar
        -keepattributes Signature
        # Gson specific classes
        -keep class sun.misc.Unsafe { *; }
        # Application classes that will be serialized/deserialized over Gson
        -keep class com.google.gson.examples.android.model.** { *; }

        

-------------------------------

参考文献：[Android Tools Project Site](http://tools.android.com/tech-docs/new-build-system/tips)
