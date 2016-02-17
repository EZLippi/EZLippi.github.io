---
layout:	post
title: Java Lambda简明教程
categories:	[java, lambda]
tags:	java
---


许多热门的编程语言如今都有一个叫做lambda或者闭包的语言特性，包括比较经典的函数式编程语言Lisp,Scheme,也有稍微年轻的语言比如JavaScript,Python,Ruby,Groovy,Scale,C#,甚至C++也有Lambda表达式。一些语言是运行在java虚拟机上，作为虚拟机最具代表的语言java当然也不想落后。

#究竟什么是Lambda表达式?

Lambda表达式的概念来自于Lambda演算，下面是一个java lambda的简单例子，

{% highlight java %}
(int x) -> { return x+1; }
{% endhighlight %}

简单来看lambda像一个没有名字的方法，它具有一个方法应该有的部分：参数列表`int x`，方法body　`return x+1`,和方法相比lambda好像缺少了一个返回值类型、异常抛出和名字。返回值类型和异常是通过编译器在方法体中推导出来，在上面这个例子中返回值类型是int,没有抛出异常。真正缺少的就是一个名字，从这个角度来看，lambda表达式是一种匿名方法。

#Lambda表达式和匿名内部类

从上面的分析可以看出lambda和java内部类的特性有点相似，匿名内部类不只是一个方法，而是一个包含一个或多个方法的类，他们的作用都是一样的，都是作为方法的参数传递，我从JDK源码中提取出来`listFiles(FileFilter)` 方法：

{% highlight java %}
public File[] listFiles(FileFilter filter) {
	String ss[] = list();
	if (ss == null) return null;
	
	ArrayList<File> files = new ArrayList<>();
	for (String s : ss) {
		File f = new File(s, this);
		if ((filter == null) || filter.accept(f))
		files.add(f);
	}
	return files.toArray(new File[files.size()]);
}
{% endhighlight %}

`listFilter`方法接收一个功能接口作为参数，在这里是FileFilter接口：

{% highlight java %}
public interface FileFilter {
	boolean accept(File pathname);
}
{% endhighlight %}

`fileFilter`接收一个`File`对象返回一个`boolean`值，`listFiles`方法把`Filter`应用到所有的`File`对象接收 那些`accept`返回`true`的文件。对于`listFiles`方法来讲我们必须传递一个函数式接口给他，这是`FileFileter`的一个实现，一般我们通过匿名类来完成：

{% highlight java %}
File myDir = new File("／home/user/files");
if (myDir.isDirectory()) {
	File[] files = myDir.listFiles(
	new FileFilter() {
	 public boolean accept(File f) { return f.isFile(); }
	 }
	);
}
{% endhighlight %}

　我们现在可以用lambda来实现：

{% highlight java %}
File myDir = new File("／home/user/files");
if (myDir.isDirectory()) {
	File[] files = myDir.listFiles(
	(File f) -> { return f.isFile(); }
	);
}
{% endhighlight %}

这两种情况我们都是传递了一个函数式接口给方法就像传递对象一样，我们使用代码就像使用数据一样，使用匿名类我们实际上传递了一个对象给方法，使用lambda不再需要创建对象，我们只需要把lambda代码传递给方法。

除了传递lambda之外我们还可以传递一个方法引用，比如：

{% highlight java %}
File[] files = myDir.listFiles( File::isFile );
{% endhighlight %}

#Lambda表达式的表示

在之前的例子，我们使用lambda表达式定义了一个函数，我们可以把它作为参数传递给一个方法，方法把它当成一个对象来使用，lambda表达式有函数和对象的一些属性，看你从什么角度来看：

* 从概念来讲，lambda表达式是一个匿名函数，它有签名和方法体但是没有名字
* 当lambda表达式作为参数传递给方法时，接收方法把它当对象使用，在`listFiles`方法内部，lambda表达式是一个对象的引用，在这里lambda表达式是一种常规的对象，比如有地址和类型。

从实际的角度来分析，lambda对象是由编译期和运行时系统来创建的，这就允许编译期进行优化而使用者不需要关心具体细节，编译器从lambda表达式的上下文环境来获取lambda对象的语义类型，但是编译期并不创建那个对象而是直到运行时由虚拟机动态创建，这里说的动态创建是指调用`invokedynamic`字节码指令来创建。使用动态创建可以推迟对象的创建到对象第一次被使用时，如果你只是定义了lambda表达式而从未使用，它的类型和对象都不会创建。

#函数式接口

整个魔幻之处就在于类型的推导，这个类型称为目标类型，运行时系统动态创建的类型是目标类型的子类型。之前的那个例子我们看到目标类型是`FileFilter`,在例子中我们定义了一个lambda表达式把它传递给listFiles方法，然后listFiles方法把它作为`FileFilter`子类的一个对象来使用。这里看起来好像有点神奇，我们并没有声明lambda表达式实现了`FileFilter`接口，`listFiles`方法也没有表明它很愉快的接收了lambda表达式，它只是需要一个`FileFilter`的子类的对象，这是如何工作的？

这里面的魔术在于编译期执行了类型推导，编译器根据lambda表达式的上下文来决定需要什么类型的对象，然后编译器观察lambda表达式是否兼容需要的类型。如果Java是一种函数式编程语言的话lambda表达式最自然的类型就是某种函数式类型，用来描述函数的一种特殊类型。函数式类型仅仅描述了函数的签名比如`(int,int)->boolean`.但是Java不是函数式编程语言因此没有函数式类型，语言的设计者可以选择添加一种新的类型，由于他们不想给Java的类型系统引入太多的改变，因此他们尝试寻找一种办法来集成lambda表达式到语言中而不需要添加函数式类型。

结果他们使用函数式接口来代替，函数式接口是只有一个方法的接口，这样的接口在JDK里有很多，比如经典的Runnable接口，它只有一个方法`void run()`,还有很多其他的，比如`Readable,Callable,Iterable,closeable,Flushnable,Formattable,Comparable,Comparator`,或者我们前面提到的`FileFilter`接口。函数是接口和lambda表达式奕扬都只有一个方法，语言的设计者决定让编译器把lambda表达式转换成匹配的函数式接口。这种转换通常是自动的。比如我们前面提到的`(File f) -> { return f.isFile(); }`,编译器知道listFiles方法的签名，因此我们需要的类型就是`FileFilter`,`FileFilter`是这样的：

{% highlight java %}
public interface FileFilter { boolean accept(File pathname); }
{% endhighlight %}

FileFilter仅仅需要一个方法因此它是函数式接口类型，我们定义的lambda表达式有一个相匹配的签名，接收一个`File`对象，返回一个`boolean`值，不抛出检查的异常，因此编译器把lambda表达式转换成函数式接口`FileFilter`类型。

假如我们有下面两个函数式接口：

	
{% highlight java %}
public interface FileFilter { boolean accept(File pathname); }
　
public interface Predicate<T> { boolean test(T t); }
{% endhighlight %}

我们的lambda表达式兼容两种函数式接口类型：

{% highlight java %}
FileFilter filter = (File f) -> { return f.isFile(); };

Predicate<File> predicate = (File f) -> { return f.isFile(); };

filter = predicate;//错误，不兼容的类型
{% endhighlight %}

当我们试图给两个变量相互赋值时编译器会报错，虽然两个变量都是同一个lambda表达式，原因很简单两个变量是不同的类型。也有可能出现编译器无法判断匹配的函数式接口类型，比如这个例子：

{% highlight java %}
Object ref　= (File f) -> { return f.isFile(); };
{% endhighlight %}

这个赋值语句的上下文没有提供足够的信息来转换，因此编译器会报错，解决这个问题最简单的方法就是添加一个类型转换：

{% highlight java %}
　	Object ref　= (FileFilter) (File f) -> { return f.isFile(); };
{% endhighlight %}

#Lambda表达式和匿名内部类的区别

Lambda表达式出现在我们通常需要匿名内部类的地方，在很多场合他们是可以互换的。但是他们还是有几个区别：

###语法

匿名类一般这样编写：

{% highlight java %}
File[] fs = myDir.lis tFiles(
	new FileFilter() {
	public boolean accept(File f) { return f.isFile(); }
	}
);
{% endhighlight %}

而Lambda表达式有多种形式：

{% highlight java %}
File[] files = myDir.listFiles( (File f) -> {return f.isFile();} );
File[] files = myDir.listFiles( f -> f.isFile() );
F ile[] fil e s = myDir.listFiles( File::isFile );
{% endhighlight %}

###运行时成本

匿名类相对Lambda表达式来讲多了一些成本，使用匿名类或造成新类型的创建、新类型对象的创建。运行时匿名内需要：

* 类加载
* 内存分配、对象初始化
* 调用非静态方法

Lambda表达式需要函数式接口的转换和最终的调用，类型推导发生在编译期，不需要运行时消耗，之前提到过，lambda对象的创建是通过字节码指令`invokedynamic`来完成的，减少了类型和实例的创建消耗。

###变量绑定

匿名类可以访问外部域的`final`变量，如下所示：

{% highlight java %}
void method() {
	final int cnt = 16;

	Runnable r = new Runnable() {
		public void run() {
		System.out.println("count: " + cnt);
		}
	};
	Thread t = new Thread(r);
	t.start();

	cnt++;// error: cnt is final
}
{% endhighlight %}
	
对于lambda表达式，cnt变量不需要显式声明为final的，一旦变量在lambda中使用编译期会自动把它当成是`final`的变量，换句话说在lambda中使用的外部域变量是隐式final的，

{% highlight java %}
void method() {
	int cnt = 16;

	Runnable r = () -> { System.out.println("count: " + cnt);
	};
	Thread t = new Thread(r);
	t.start();

	cnt++;// error: cnt is implicitly final
}
{% endhighlight %}

从java8开始匿名内部类也不需要再显式声明final类，编译器会自动把它当成是final。


 
##作用域

匿名内部类是一个类，也就是说它自己引入了一个作用域，你可以在里面定义变量，而lambda表达式没有自己的作用域。

{% highlight java %}
void method() {
	int cnt = 16;
	Runnable r = new Runnable() {
	public void run() { int cnt = 0; // fine
		System.out.println("cnt is: " + cnt); }
		};
　
}
{% endhighlight %}

lambda表达式：

{% highlight java %}
void method() {
	int cnt = 16;
	Runnable r = () -> { int cnt = 0; // error: cnt has already been defined
		System.out.println("cnt is: " + cnt);
	};
　
}
{% endhighlight %}

不同的作用域规则对于`this`和`super`关键字有不同的效果，在匿名类中`this`表示匿名类对象本身的引用，`super`表示匿名类的父类。在lambda表达式`this`和`super`关键字意思和外部域中`this`和`super`的意思一样，`this`一般是包含它的那个对象，`super`表示包含它的类的父类。









