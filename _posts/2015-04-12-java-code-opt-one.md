---
title: 优化java代码建议(1)
date: 2015-04-12 21:05:13 +0800
layout: post
categories:
  - java
tags:
  - java
---


假设你要统计一个地区的人口平均年龄，你可能写出下面这段代码：

	 {% highlight java%}
	 public static void main(String[] args){
		//人口数量50万
		int peopleNum = 50 * 10000;
		List<Integer> heights = new ArrayList<>(peopleNum);

		for(int i =0; i < peopleNum; i++){
		    heights.add(new Random().nextInt(300));
		}
		//计算时间
		long start = System.currentTimeMillis();
		System.out.println("平均高度是： " + average(heights));
		System.out.println("运行时间： " + (System.currentTimeMillis() - start) + "ms");
	    }

	    //计算平均值
	    public static int average(List<Integer> list){
		int sum = 0;
		//遍历求和
		for(int i : list){
		    sum += i;
		}
		return sum/list.size();
	    }
	{% endhighlight java%}

这个程序把50万人的身高存入一个ArrayList中，然后通过foreach遍历求和，再计算平均值，输出结果是：

	平均高度是： 154
	运行时间： 47ms
	
仅仅是一个算术平均值就花费了47ms，如果是加权平均值等算法，那花的时间肯定更长了，这段代码也没什么好优化的，唯一剩下的就是元素的遍历，List的遍历可以优化吗？

我们之道List的遍历还有另外一种方法，通过下标来索引，代码如下：

	 {% highlight java%}
	public static int average1(List<Integer> list){
        int sum = 0;
        //遍历求和
        for(int i = 0, size = list.size(); i < size; i++){
            sum += list.get(i);
        }
        return sum/list.size();
    }
	{% endhighlight java%}

运行结果是：

	平均身高是： 154
	运行时间： 16ms
	
可以看到运行时间大幅下降，效率提高了65%，为什么性能得到这么大幅度的提升？

这是因为Arraylist实现了RandomAccess接口（随机存取接口），这就标志这ArrayList是一个可以随机存取的列表，实现RandomAccess接口表明这个类可以随机存取，标志着这个List的元素之间**没有关联**，两个相邻的元素之间没有相互的依赖关系和索引关系，可以随机访问和存储。

Java中的foreach语法是iterator的变形用法，也就是说foreach和下面的代码等价：

	 {% highlight java%}
	for(Iterator<Integer> i = list.iterator(); i.hasNext();){
		sum += i.next();
	}
	{% endhighlight java%}

我们再来想想什么是迭代器，迭代器是23中设计模式中的一种，提供一种方法能够遍历容器的各个元素，同时又无需暴露该对象的实现细节，也就是说需要先创建一个迭代器容器，然后屏蔽内部遍历细节，对外提供hasNext、next方法，问题是ArrayList实现了RandomAccess接口，表明元素之间本来没有关系，可视为了使用迭代器就需要强制建立一种相互“知晓”的一种关系，比如上一个元素可以判断是否有下一个元素，以及下一个元素是什么，这就是通过foreach遍历耗时的原因。

但是有些List实现类不是随机存取的，比如LinkedList类，也是一个列表，但它实现了双向链表，每个数据节点node都有三个数据项：前一个节点的引用、本节点元素、下一个节点的引用，也就是说LinkedList的两个元素之间是有关联的，我知道你的存在，你知道我的存在，这时候使用foreach来遍历效率就会更高，我们把代码中的ArrayList修改成LinkedList之后再运行下，结果如下：

	平均身高是： 154
	运行时间： 16ms

确实如此，也是16ms，你可能也想用测试一下下标访问方法遍历LinkedList的元素，其实不用测试，效率非常低下。

明白了随机存取和有序存取列表的区别，在遍历列表时就应该采用不同的遍历方式。	
