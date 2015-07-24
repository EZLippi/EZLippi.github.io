---                                                                                                                                                                     
layout: post
title: Hibernate缓存配置笔记
categories:     java
tags:   java, hibernate
---

Hibernate中提供了两级Cache，第一级别的缓存是Session级别的缓存，这一级别的缓存由hibernate管理的，一般情况下无需进行干预；第二级别的缓存是SessionFactory级别的缓存，它是属于进程范围或群集范围的缓存,这一级别的缓存可以进行配置和更改，并且可以动态加载和卸载。 Hibernate还为查询结果提供了一个查询缓存，它依赖于第二级缓存。

**一级缓存和二级缓存的要点**

![](/images/hibernate1.png)
![](/images/hibernate2.png)
![](/images/hibernate3.png)

**使用二级缓存**

这里以EhCache作为二级缓存的插件为例介绍Hibernate二级缓存的配置。

（1）打开二级缓存：

为Hibernate配置二级缓存：

在主配置文件中hibernate.cfg.xml ：
	
Hibernate3.3以上：

	{% highlight XML %}
	<property 	name="hibernate.cache.region.factory_class">net.sf.ehcache.hibernate.EhCacheRegionFactory</property>
	{% endhighlight %}

Hibernate4.0以上,使用`org.hibernate.cache.ehcache.EhCacheRegionFactory `代替`net.sf.ehcache.hibernate.EhCacheRegionFactory`
	
	{% highlight XML %}
	<!--二级缓存-->
	<property name="hibernate.cache.use_second_level_cache">true</property>
	<!--查询缓存-->
	<property name="hibernate.cache.use_query_cache">true</property>
	在查询定义的地方加入setCacheable(true)，这次查询就被缓存起来了 
	{% endhighlight %}

（2）配置ehcache.xml

	{% highlight XML %}
	<ehcache>
	<!--缓存到硬盘的路径-->
	<diskStore path="/home/lippi/ehcache"/>
	<defaultCache
	maxElementsInMemory="200"<!-- 最多缓存多少个对象 -->
	eternal="false"<!-- 内存中的对象是否永远不变 -->
	timeToIdleSeconds="50"<!--空闲了多长时间，超过这个时间清除 -->
	timeToLiveSeconds="60"<!--总共存活时间 -->
	overflowToDisk="true"<!--内存中溢出就放到硬盘上 -->
	/>

	<cache name="org.hibernate.cache.spi.UpdateTimestampsCache"  
           maxElementsInMemory="5000"   
           eternal="true"   
           overflowToDisk="true" />  
	<cache name="org.hibernate.cache.internal.StandardQueryCache"  
           maxElementsInMemory="10000"   
           eternal="false"   
           timeToLiveSeconds="120"  
           overflowToDisk="true" /> 
	<!--
	java文件注解查找cache方法名的策略：如果不指定java文件注解中的	region="ehcache.xml中的name的属性值", 则使用name名为全限定包名, 如果不存在与类名匹配的cache名称, 则用 defaultCache，如果类中包含set集合, 则需要另行指定其cache指定缓存的对象，缓存哪一个实体类，下面出现的的属性覆盖上面出现的，没出现的继承上面的。
	-->
	<cache name="com.lippi.hibernate.pojos.Order"
	maxElementsInMemory="200"
	eternal="true"
	timeToIdleSeconds="0"
	timeToLiveSeconds="0"
	overflowToDisk="false"
	/>
	</ehcache>
	{% endhighlight %}
 

（3）使用二级缓存需要在实体类中加入注解：

	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)

Load默认使用二级缓存，就是当查一个对象的时候，它先会去二级缓存里面去找，如果找到了就不去数据库中查了。

Iterator默认的也会使用二级缓存，有的话就不去数据库里面查了，不发送select语句了。

List默认的往二级缓存中加数据，假如有一个query，把数据拿出来之后会放到二级缓存，但是执行查询的时候不会到二级缓存中查，会在数据库中查。原因每个query中查询条件不一样。

（4）也可以在需要被缓存的对象中hbm文件中的<class>标签下添加一个<cache>子标签:

 

	{% highlight XML %}
	<hibernate-mapping>
	<class name="com.lippi.hibernate.pojos.Order" table="Orders">
	<cache usage="read-only"/>
	<id name="id" type="string">
	<column name="id"></column>
	<generator class="uuid"></generator>
	</id>
	<property name="orderNumber" column="orderNumber" type="string"></property>
	<property name="cost" column="cost" type="integer"></property>
	<many-to-one name="customer" class="com.lippi.hibernate.pojos.Customer"
	column="customer_id" cascade="save-update">
	</many-to-one>
	</class>
	</hibernate-mapping>
	{% endhighlight %}

存在一对多的关系，想要在在获取一方的时候将关联的多方缓存起来，需要在集合属性下添加<cache>子标签，这里需要将关联的对象的hbm文件中必须在存在<class>标签下也添加<cache>标签，不然Hibernate只会缓存OID。

	{% highlight XML %}
	<hibernate-mapping>
	<class name="com.lippi.hibernate.pojos.Customer" table="customer">
	<!-- 主键设置-->
	<id name="id" type="string">
	<column name="id"></column>
	<generator class="uuid"></generator>
	</id>
	<!-- 属性设置-->
	<property name="username" column="username" type="string"></property>
	<property name="balance" column="balance" type="integer"></property>
	<set name="orders" inverse="true" cascade="all" lazy="false" fetch="join">
	<cache usage="read-only"/>
	<key column="customer_id" ></key>
	<one-to-many class="com.lippi.hibernate.pojos.Order"/>
	</set>
	</class>
	</hibernate-mapping>
	{% endhighlight %}

(5)在hibernate.cfg.xml中配置ehcache.xml文件的位置

	{% highlight XML %}
	<property name="cache.provider_configuration_file_resource_path">config/hibernate/ehcache/ehcache.xml</property>
	{% endhighlight %}

(6)和Spring集成

在Spring集成Hibernate配置中，添加如下属性:

	{% highlight XML %}
	<prop key="hibernate.cache.use_second_level_cache">true</prop>
	<prop key="hibernate.cache.use_query_cache">true</prop>
	<prop key="hibernate.cache.region.factory_class">net.sf.ehcache.hibernate.EhCacheRegionFactory</prop>
	{% endhighlight %}


