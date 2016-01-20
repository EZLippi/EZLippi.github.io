---
layout: post
title: 彻底理解Gradle的任务
categories:	gradle
tags:   java, gradle
---

在Gradle的build文件中，任务是构建活动最基本的单元，它是许多构建指令的集合，下面我将仔细介绍Gradle任务的细节。

##声明一个任务

声明任务很简单，你只需要一个任务名：

{% highlight Groovy %}
task hello
{% endhighlight %}
你可以在命令行中使用`gradle tasks`来查看所有的任务：

    ------------------------------------------------------------
    Root Project
    ------------------------------------------------------------
    Help tasks
    ----------
    dependencies - Displays the dependencies of root project 'task-lab'.
    help - Displays a help message
    projects - Displays the subprojects of root project 'task-lab'.
    properties - Displays the properties of root project 'task-lab'.
    13
    tasks - Displays the tasks in root project 'task-lab'.
    Other tasks
    -----------
    hello

##任务的动作

很显然执行`gradle hello`不会有任何结果，因为你没有给这个任务添加动作，我们可以通过左移操作符给任务添加一个动作(在Groovy语言中左移操作符可以重载成在任务的最后添加一个动作)：
	
{% highlight Groovy %}
task hello <<{
    println 'hello,world'
}
{% endhighlight %}

我们可以在任务的后面引用前面声明的任务:

{% highlight Groovy %}

task hello

hello << {
    print 'hello,'
}

hello << {
    println 'world'
} 
{% endhighlight %}

接下来在命令行中运行`gradle hello`,输出如下：

    $ gradle hello
    hello, world
    $

##任务的配置

Gradle新手可能会很容易混淆任务的动作和配置，看下面这个例子：

{% highlight Groovy %}

task initializeDatabase
initializeDatabase << { println 'connect to database' }
initializeDatabase << { println 'update database schema' }
initializeDatabase { println 'configuring database connection' }//这里没有左移操作符
{% endhighlight %}

运行这个构建脚本，猜猜输出是什么：

	//－b 选项用于指定gradle构建脚本文件名
    $ gradle -b scratch.gradle initializeDatabase
    configuring database connection
    :initializeDatabase
    connect to database
    update database schema
    $

如果第三个代码块我们用的是<<操作浮，这个消息就是在最后而不是最先打印出来了，我把用{}扩起来的部分统称为一个闭包，上面第三个闭包并不是任务的动作，他直接使用了任务名+闭包，在这里它是一个配置块。在Gradle的构建生命周期里配置阶段是在执行阶段前运行的，所以这个块里的代码最先执行了。

Gradle的构建生命周期分为三部分，初始化、配置和执行阶段。在执行阶段，任务按照他们的依赖顺序按序执行，在配置阶段所有的任务都转换成Gradle的内部对象模型，通常叫做有向无环图(DAG)。图的节点就是构建脚本里的任务，任务与任务之间可以定义依赖关系。初始化阶段是Gradle用来找出哪些项目会参与到项目构建中，这在多项目构建中很重要。

和动作闭包一样，配置闭包也具有可加性，你可以像下面这样编写构建脚本：

{% highlight Groovy %}

task initializeDatabase
initializeDatabase << { println 'connect to database' }
initializeDatabase << { println 'update database schema' }
initializeDatabase { print 'configuring ' }
initializeDatabase { println 'database connection' }
{% endhighlight %}

配置块是用来放置变量和数据结构的地方，这些可能会在任务的执行过程中用到。

##一切任务都是对象

前面讲过Gradle会在任务执行之前把他们创建成内部的对象模型，每一个你声明的任务都是一个任务对象，这个对象有自己的属性和方法，就和Java语言里的对象一样，我们可以控制每个任务对象的类型。默认情况每一个新创建的任务都是DefaultTask类型，就像Java语言里的java.lang.Object一样，每一个Gradle任务都继承自DefaultTask类型，你也可以定义自己的类型。DefaultTask事实上没有做任务事情，不过它具有基本的属性和方法用来和Gradle项目模型交互。接下来我会一一介绍每个任务都有的方法和属性。

##DefaultTask的方法

###dependsOn(task)

用于给任务添加一个依赖的任务，被依赖的任务总是在依赖它的任务之前运行，你可以有多种方式声明这种依赖关系，如下所示：

{% highlight Groovy %}

//最简单的方法
task loadTestData {
   	dependsOn createSchema
}

//使用<<声明依赖
task loadTestData {
    dependsOn << createSchema
}

// 使用单引号声明依赖
task loadTestData {
    dependsOn 'createSchema'
}

//显式调用dependsOn方法
task loadTestData
loadTestData.dependsOn createSchema

// 快捷方法
task loadTestData(dependsOn: createSchema)

{% endhighlight %}

任务可以依赖多个任务，如下所示：

{% highlight Groovy %}

//每次声明一个任务
task loadTestData {
    dependsOn << compileTestClasses
    dependsOn << createSchema
}

// 依次传递任务名
task world {
    dependsOn compileTestClasses, createSchema
}

// 显式调用方法
task world
world.dependsOn compileTestClasses, createSchema

//快捷方式
task world(dependsOn: [ compileTestClasses, createSchema ])
{% endhighlight %}
     

###doFirst(closure)

在任务的最开始添加一个可执行的代码块，doFirst方法允许你添加动作到现有的任务中，这个任务是在其他插件中定义的，你没有办法修改，但是你可以多次调用doFirst方法在任务执行之前添加一些代码块。
你可以使用任务对象调用doFirst方法，传递一个闭包给这个方法，如下所示：

{% highlight Groovy %}

task setupDatabaseTests << {
// 任务现有的代码
println 'load test data'
}

setupDatabaseTests.doFirst {
println 'create schema'
}
{% endhighlight %}

然后运行gradle setupDatabaseTests,结果如下：

    $ gradle setupDatabaseTests
    :setupDatabaseTests
    create schema
    load test data
    $

你也可以在任务的配置块里面调用doFirst方法，不过要记住配置块里的代码在任务的动作之前执行：

{% highlight Groovy %}

task setupDatabaseTests << {
    println 'load test data'
}
setupDatabaseTests {
doFirst {
    println 'create schema'
}
}
{% endhighlight %}
    
doFirst方法也是可加的，你可以多次调用这个方法在任务的最前面添加代码块，如下所示：

{% highlight Groovy %}

task setupDatabaseTests << {
    println 'load test data'
}

setupDatabaseTests.doFirst {
    println 'create database schema'
}

setupDatabaseTests.doFirst {
    println 'drop database schema'
}
{% endhighlight %}

运行结果如下：

    $ gradle world
    :setupDatabaseTests
    drop database schema
    create database schema
    load test data
    $

###doLast(closure)

doLast方法和doFirst方法很类似，它用于在任务的最后面添加一段代码，这里就不重复了。

###onlyIf(closure)

onlyIf方法用于决定是否执行一个任务，这里使用闭包返回的值来作为onlyIf的判断依据，在Groovy语言中，一个闭包的最后一个表达式用来作为这个闭包的返回值，即使你没有声明return语句，看一个例子：
 
{% highlight Groovy %}

task createSchema << {
    println 'create database schema'
}

task loadTestData(dependsOn: createSchema) << {
    println 'load test data'
}

loadTestData.onlyIf {
    System.properties['load.data'] == 'true'//当系统属性load.data为true时这个闭包返回true
}

{% endhighlight %}
    
看下下面的运行结果：

	//这里没有系统属性load.data
    $ build loadTestData
    create database schema
    :loadTestData SKIPPED
    
    //在命令行中传递系统属性
    $ gradle -Dload.data=true loadTestData
    :createSchema
    create database schema
    :loadTestData
    load test data
    $

##DefaultTask的属性

###didWork

一个用来标识任务是否成功完成的boolean属性，不是所有的任务都是在完成之后设置didWork变量，一些自带的任务比如Compile,Copy和Delete会根据动作是否执行成功来设置这个变量，JavaCompiler任务的实现是只要有一个文件成功编译就返回true,你可以在你自己的任务中设置didWork属性来反映构建代码的执行结果，举例如下：

{% highlight Groovy %}

apply plugin: 'java'

task emailMe(dependsOn: compileJava) << {
    if(tasks.compileJava.didWork) {
    	println 'SEND EMAIL ANNOUNCING SUCCESS'
   	 }
}
{% endhighlight %}
    
运行结果如下：

    $ gradle -b didWork.gradle emailMe
    SEND EMAIL ANNOUNCING SUCCESS
    $

###enabled

一个用来设置任务是否会执行的一个属性，你可以设置enabled为false不让它运行，但是它依赖的任务依然会运行。

{% highlight Groovy %}

task templates << {
    println 'process email templates'
}

task sendEmails(dependsOn: templates) << {
    println 'send emails'
}

sendEmails.enabled = false
{% endhighlight %}
    
运行结果如下：

    $ gradle -b enabled.gradle sendEmails
    :templates
    process email templates
    :sendEmails SKIPPED
    $

###path

一个字符串属性包含任务的全限定路径名，默认是一个冒号加上任务名，如下所示：

{% highlight Groovy %}

task echoMyPath << {
println "THIS TASK'S PATH IS ${path}"
}
{% endhighlight %}

运行一下，输出如下：

    $ gradle -b path.gradle echoMyPath
    THIS TASK'S PATH IS :echoMyPath
    $
    
最开始的冒号表示这个任务在最顶级的构建文件里面，由于Gradle支持多项目构建，一个项目里面可能有多个子项目，假如echoMyPath在子项目subProject构建文件中,那它的全限定路径名就是:subProject:echoMyPath。

###description

正如它的名字一样，这个用来给一个任务添加一段容易阅读的描述，你可以使用如下几种方法给任务添加描述。

{% highlight Groovy %}

task helloWorld(description: 'Says hello to the world') << {
println 'hello, world'
}

task helloWorld << {
println 'hello, world'
}

helloWorld {
description = 'Says hello to the world'
}

// Another way to do it
helloWorld.description = 'Says hello to the world'
{% endhighlight %}

##任务的类型

我前面说过每个任务都有一个类型。除了DefaultTask之外，还有许多其他类型，你可以继承DefaultTask来声明新的类型，下面介绍几种比较重要的类型，以后可能经常会用到。

###Copy

Copy任务用于把文件从一个地方复制到另一个地方，你可以设置源目录、目标目录和要复制的文件类型，如下所示：

{% highlight Groovy %}

task copyFiles(type: Copy) {
    from 'resources'
    into 'target'
    include '**/*.xml', '**/*.txt', '**/*.properties'
}
{% endhighlight %}

如果目标目录不存在,Copy任务会自动创建，上面这个任务会把resources目录下所有的xml、txt和propertied文件都复制到target目录。

###Jar

Jar任务用于打包源代码生成Jar文件，Java插件就自带这种类型，任务类型就叫做jar,这个任务把源代码文件和资源文件打包成Jar文件，并保存在build/libs目录下，文件名默认是用项目的名称。

{% highlight Groovy %}

apply plugin: 'java'
task customJar(type: Jar) {
manifest {
//设置一些属性值(以键值对的形式)
    attributes firstKey: 'firstValue', secondKey: 'secondValue'
}
//文件名
archiveName = 'hello.jar'
//目标路径
destinationDir = file("${buildDir}/jars")//file方法用于把一个字符串变成文件对象
//要打包的文件
from sourceSets.main.classes
}
{% endhighlight %}

###JavaExec

用于执行一个Java类的main()方法。举例说明：

{% highlight Groovy %}

apply plugin: 'java'
//maven中央仓库
repositories {
    mavenCentral()
}
//项目依赖
dependencies {
    runtime 'commons-codec:commons-codec:1.5'
}

task encode(type: JavaExec, dependsOn: classes) {
    
main = 'org.gradle.example.commandline.MetaphoneEncoder'
    args = "The rain in Spain falls mainly in the plain".split().toList()
    classpath sourceSets.main.classesDir
    classpath configurations.runtime
}
{% endhighlight %}

这个构建文件声明了一个外部依赖，Apache Commons Codec库。一般情况下，在命令行运行一个class文件的步骤是编译Java源文件，然后在命令行中设置class文件的路径和依赖的库文件。我们上面encode任务声明了main函数所在的类，给他传递了命令行参数，设置classpath参数。

##编写自定义的任务类型

如果Gradle自带的任务类型不满足你的工作需求时，最简单的办法就是编写自定义的任务类型，Gradle提供了多种方法来实现，这里我介绍两种最常用的方法。

###在Build文件中编写自定义任务类型

假设你的构建脚本需要对MySQL数据库执行一些随机的查询，下面我们来编写一个任务执行数据库查询：

{% highlight Groovy %}

task createDatabase(type: MySqlTask) {
    sql = 'CREATE DATABASE IF NOT EXISTS example'
}

task createUser(type: MySqlTask, dependsOn: createDatabase) {
    sql = "GRANT ALL PRIVILEGES ON example.*
    TO exampleuser@localhost IDENTIFIED BY 'passw0rd'"
}

task createTable(type: MySqlTask, dependsOn: createUser) {
    username = 'exampleuser'
    password = 'passw0rd'
    database = 'example'
    sql = 'CREATE TABLE IF NOT EXISTS users
    (id BIGINT PRIMARY KEY, username VARCHAR(100))'
}

class MySqlTask extends DefaultTask {
    //声明任务的属性
    def hostname = 'localhost'
    def port = 3306
    def sql
    def database
    def username = 'root'
    def password = 'password'

//表示这是任务的动作
@TaskAction
def runQuery() {
	def cmd
if(database) {
	cmd = "mysql -u ${username} -p${password} -h 	${hostname}-P ${port} ${database} -e "
}
else {
	cmd = "mysql -u ${username} -p${password} -h ${hostname} -P ${port} -e "
}
project.exec {
	commandLine = cmd.split().toList() + sql
}
}
}
{% endhighlight %}
    
上面的MySqlTask继承自DefaultTask,所有的任务都必须继承自这个类或者它的子类。任务声明了几个属性，然后声明了一个方法runQuery(),这个方法用@TaskAction注解了，表示这个方法会在任务执行的时候执行。最上面定义的三个任务都声明为MySqlTask类型，因此他们都自动继承了它的属性和方法，有些属性有默认值，你可以覆写这些默认值，来添加你的逻辑。

###在源码树中定义自定义任务类型

前面你在build文件中定义了一个自定义的MySqlTask类型，这样的缺点就是你无法在其他构建文件中使用它，只能把它的源码复制过去。我们可以在源码树的buildSrc目录下定义自定义任务类型，这个目录下的文件会被自动编译然后添加到项目的classpath中，如下所示：

 {% highlight Groovy %}

//任务MySqlTask并没有定义在构建脚本中
task createDatabase(type: MySqlTask) {
    sql = 'CREATE DATABASE IF NOT EXISTS example'
}

task createUser(type: MySqlTask, dependsOn: createDatabase) {
    sql = "GRANT ALL PRIVILEGES ON example.*
    TO exampleuser@localhost IDENTIFIED BY 'passw0rd'"
}

task createTable(type: MySqlTask, dependsOn: createUser) {
    username = 'exampleuser'
    password = 'passw0rd'
    database = 'example'
    sql = 'CREATE TABLE IF NOT EXISTS users
    (id BIGINT PRIMARY KEY, username VARCHAR(100))'
}
{% endhighlight %}
    
在buildSrc目录下新建一个文件MysqlTask.groovy,然后添加下面的代码：
	
{% highlight Groovy %}

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class MySqlTask extends DefaultTask {
    //声明任务的属性
    def hostname = 'localhost'
    def port = 3306
    def sql
    def database
    def username = 'root'
    def password = 'password'

//表示这是任务的动作
@TaskAction
def runQuery() {
	def cmd
if(database) {
	cmd = "mysql -u ${username} -p${password} -h 	${hostname}-P ${port} ${database} -e "
}
else {
	cmd = "mysql -u ${username} -p${password} -h ${hostname} -P ${port} -e "
}
project.exec {
	commandLine = cmd.split().toList() + sql
}
}
}
{% endhighlight %}

编译之后buildSrc目录树如下所示：

![/images/gradle-tasks.png](/images/gradle-tasks.png)


对Gradle的任务介绍就到此为止，大家如果还有不懂的地方可以去查看Gradle的官方文档[https://docs.gradle.org/current/release-notes](https://docs.gradle.org/current/release-notes)。
