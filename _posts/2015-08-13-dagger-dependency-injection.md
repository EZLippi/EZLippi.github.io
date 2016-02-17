---
layout: post
title: Dagger依赖注入浅析 
categories:	gradle
tags:   java, gradle
---

最早接触依赖注入这个概念是在使用Spring框架的时候，一开始没太在意它，后面开发项目的过程中发现使用依赖注入可以降低代码的耦合性,Spring的依赖注入是通过反射机制实现的，而Dagger依赖注入是在编译期生成辅助的类，这些类继承特定父类或实现特定接口，程序在运行时 Dagger 加载这些辅助类，调用相应接口完成依赖生成和注入.


##什么是控制反转？

比如你有一个DataProcessor类，DataProcessor里有一个DataFinder对象，用于查找数据，DataFinder是一个接口，它有一个实现类:IndexDataFinder,如果你要使用DataFinder来查找数据，传统的做法是在DataProcessor构造器里新建一个DataFinder对象，然后再调用DataFinder的findData方法:
	
{% highlight java %}
public DataProcessor(){
	this.dataFinder = new IndexDataFinder();
}
{% endhighlight %}

在上述的实现中，DataProcessor就和DataFinder紧密的耦合在一起．假设后来DataFinder又有一个新的实现类SQLDataFinder,根据需求来选择相应的实现，这时候你要怎么做呢？传统的做法就是给构造器传递一个int参数，根据参数的值来初始化DataFinder,还要处理异常参数如下所示：


{% highlight java %}
public DataProcessor(int dataFinderIndex){
	if(dataFinderIndex == 0){
		this.dataFinder = new IndexDataFinder();	
	}else if(dataFinderIndex == 1){
		this.dataFinder = new SQLDataFinder();
	}
}
{% endhighlight %}

这样子虽然代码变得简单，但是DataProcessor类仍然依赖于具体的实现，实际上DataProcessor不应该有这么多的控制逻辑，它只需要负责调用dataFinder的方法来完成它的逻辑，至于是什么类型的DataFinder它不应该考虑．我们试着将控制DataFinder的任务交给客户：

	
{% highlight java %}
public DataProcessor(DataFinder dataFinder){
	this.dataFinder = dataFinder;
}
{% endhighlight %}

这样DataProcessor就不用依赖具体的实现了，不用管到底是哪种类型的DataFinder,也就是说将选择DataFinder的控制权交给了客户端，实现了"控制反转"．控制反转只是一个概念而已，依赖注入是他的一种实现方法，依赖注入就是将实例变量传递到一个对象中去，依赖注入的方法有两种：构造器注入和setter方法注入．

##Dagger依赖注入

Spring IoC和Google Guice的依赖注入都很有名，但它们都是使用Java的反射机制来实现的，这对性能要求比较高的Android平台来说就不太适合了，于是Dagger应运而生.

###编译期

Dagger在编译时使用注解处理工具(APT)对所有的类进行扫描，这里包括两个工具InjectAdapterProcessor和ModuleAdapterProcessor,InjectAdapterProcessor会扫描所有的被@inject注解的元素，包括静态域，实例域和构造器，然后根据这几个元素生成一个内部对象InjectedClass，它的定义如下：

{% highlight java %}
static class InjectedClass {
	final TypeElement type;
	final List<Element> staticFields;
	final ExecutableElement constructor;
	final List<Element> fields;
	..............
}
{% endhighlight %}

根据域是否是静态域注入方式会有不同，非静态域生成InjectAdapter对象并保存在同个被注入类同个目录下，比如被注入的类为A,生成的类名称为A$$InjectAdapter,InjectAdapter包含了所有需要注入的实例域和构造器参数的信息．如果被注解的是静态域，则生成A$$StaticInjection.这里需要注意的是如果你是在构造函数上用@inject注解而且构造函数有其他参数，你需要给这些参数添加@inject注解或者在Module中提供provide方法（下面会讲到Module）．InjectAdapter类的生成Dagger用到了JavaPoet这个用于生成Java源文件的类库，用法简介：

{% highlight java %}
MethodSpec main = MethodSpec.methodBuilder("main")
.addModifiers(Modifier.PUBLIC, Modifier.STATIC)
.returns(void.class)
.addParameter(String[].class, "args")
.addStatement("$T.out.println($S)", System.class, "Hello, JavaPoet!")
.build();

TypeSpec helloWorld = TypeSpec.classBuilder("HelloWorld")
.addModifiers(Modifier.PUBLIC, Modifier.FINAL)
.addMethod(main)
.build();

JavaFile javaFile = JavaFile.builder("com.example.helloworld", helloWorld)
 .build();

javaFile.writeTo(System.out);
{% endhighlight %}


上面这种过注入依赖的方法适合我们自己编写的类，如果是第三方类库的话你没有修改它的源代码给它的构造器或者域添加@inject注解，这时候就需要使用第二种注入依赖的方法.通过新建一个用@Module注解的类，这个类告诉Dagger编译期哪些类要注入依赖，这个Module包含哪些子Module，通过编写provide方法来生成一些依赖实例．具体用法举例如下：

{% highlight java %}
@Module(
	injects = CoffeeApp.class//表示CoffeeApp这个类需要注入依赖
	includes = PumpModule.class//包括PumpModule这个Module
	)	
class DripCoffeeModule {
	//所有需要被注入的实例都用@Provides方法提供
	@Provides @Singleton Heater provideHeater() {
		  return new ElectricHeater();
	 }
	//方法可以有参数，前提是这个参数能够被注入
	@Provides Pump providePump(Heater heater) {
		 return new Thermosiphon(heater);	
	 }
}
{% endhighlight %}

编译时Dagger编译期扫描所有被@Provides注解的方法，然后扫描它所在的类是否被＠Module注解，根据Module注解的参数injects,includes,complete,library生成ModuleAdapter类，保存为［Module名称］$$ModuleAdapter的形式,内部使用的是generateModuleAdapter方法，定义如下：

{% highlight java %}
private JavaFile generateModuleAdapter(TypeElement type,
  Map<String, Object> module, List<ExecutableElement> providerMethods) {
Object[] injects = (Object[]) module.get("injects");
Object[] includes = (Object[]) module.get("includes");
boolean complete = (Boolean) module.get("complete");
boolean library = (Boolean) module.get("library");
//省略了其他部分
}
{% endhighlight %}

运行时，在 Application 或某个具体模块的初始化处，使用ObjectGraph类来加载部分依赖(实质上是利用编译时生成的ModuleAdapters加载了所有的ProvidesBinding)，形成一个不完整的依赖关系图。 这个不完整的依赖关系图生成之后，就可以调用ObjectGraph的相应函数来获取实例和注入依赖了。实现依赖注入的函数有两个：`ObjectGraph.get(Class<T> type)`函数，用于直接获取对象；`ObjectGraph.inject(T instance)`函数，用于对指定对象进行属性的注入。在这些获取实例和注入依赖的过程中，如果用到了还未加载的依赖，程序会自动对它们进行加载(实质上是加载的编译时生成的InjectAdapter)。在此过程中，内存中的 DAG 也被补充地越来越完整。

简单介绍一些Dagger的Binding 类，它相当于依赖关系 DAG 图中的节点，依赖关系 DAG 图中得每一个节点都有一个由 APT 生成的继承自 Binding 的类与之对应，而依赖关系 DAG 图中的每一个节点与Host和Dependency一一对应，所以每个Host或Dependency必然有一个由 APT 生成的继承自 Binding 的子类与之对应，Binding.java 实现了两个接口，第一个是 javax 的Provider接口，此接口提供了 get() 函数用于返回一个Dependency实例，当然也可以是Host实例。第二个接口是 Dagger 中的MembersInjector接口，此接口提供了 injectMembers() 用来向Host对象中注入Dependency。
单纯的DependencyBinding只要实现Provider接口，在 get() 函数中返回自己的实例即可。单纯的HostBinding只要实现MembersInjector，在 injectMembers() 函数中调用DependencyBinding的 get() 函数得到依赖，然后对自己的依赖进行注入即可。如果一个类既是Host又是Dependency，则与它对应的Binding这两个接口都需要实现。

还是之前那个例子：

{% highlight java %}
public class CoffeeApp implements Runnable {
  @Inject CoffeeMaker coffeeMaker;

  @Override public void run() {
		coffeeMaker.brew();
  }

  public static void main(String[] args) {
	//建立依赖关系图
	ObjectGraph objectGraph = ObjectGraph.create(new DripCoffeeModule());
	//调用objectGraph．get(CoffeeApp.class)来获取一个CoffeeApp实例
	CoffeeApp coffeeApp = objectGraph.get(CoffeeApp.class);
	coffeeApp.run();
  }
}
{% endhighlight %}

CoffeeMaker的定义如下：

{% highlight java %}
class CoffeeMaker {
  @Inject Lazy<Heater> heater; 
  @Inject Pump pump;

	 public void brew() {
	 heater.get().on();
	 pump.pump();
	 System.out.println(" [_]P coffee! [_]P ");
	 heater.get().off();
	 }
}
{% endhighlight %}

	这样在运行中Dagger会自动注入CoffeeMaker实例以及它依赖的对象heater和pump.
