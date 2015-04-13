Gradle提供了一些默认的Tasks给Java项目，比如，编译源代码、运行测试、打包JAR.每一个Java项目都有一个标准的路径布局，这个布局定义了去哪里找项目的源代码、资源文件和测试代码，你也可以在配置中修改这些默认位置。

Gradle的约定类似于Maven的约定优于配置的实现，Maven的约定就是一个项目只包含一个Java源代码路径，只产生一个JAR文件，对于企业级开发来讲这样是显然不够的，Gradle允许你打破传统的观念，Gradle的构建生命周期如下图：

！[](/images/dag6.png)
！[](/images/dag5.png)

#和其他构建工具集成#

Gradle完全兼容Ant、Maven，你可以很容易的从Ant或Maven迁移到Gradle，Gradle并不强迫你完全把你的Build逻辑迁移过来，它允许你复用已有的Ant构建逻辑。Gradle完全兼容Maven和Ivy仓库，你可以从中检索依赖也可以发布你的文件到仓库中，Gradle提供转换器能把Maven的构建逻辑转换成Gradle的构建脚本。

##从Ant迁移到Gradle##

现有的Ant脚本可以无缝的导入到Gradle项目中，Ant的Target在运行时直接映射成Gradle的任务，Gradle有一个AntBuilder可以把你的Ant脚本混成Gradle的DSL（领域特定语言），这些脚本看起来像是Ant的XML，但是去掉了尖括号，对于Ant用户来说非常方便，不需要担心过渡到Gradle的学习周期。
！[](/images/dag7.png)


