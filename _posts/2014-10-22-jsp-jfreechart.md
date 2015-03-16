---
layout: post
title:  使用Jfreechart生成曲线显示到JSP中
keywords: Jsp， servlet， jfreechart
categories : [web]
tags : [jsp，servlet，html，jfreechart]
---

项目中需要弄一个服务器，从数据库中读取数据，然后根据http请求显示制定的数据在曲线中，这里用到一个曲线库，[Jfreechart](http://www.jfree.org/jfreechart/)，用java写的，用来生成柱状图，饼状图，时间序列等。
整个流程如下：
![](/images/images/chart.png)

jsp代码如下：

    <%@ page contentType="text/html;charset=UTF-8"%>
    <%@ page import="java.awt.*,
    java.util.List,
    javax.swing.JPanel,
    org.jfree.chart.ChartFactory,
    org.jfree.chart.ChartPanel,
    org.jfree.chart.JFreeChart,
    org.jfree.chart.axis.DateAxis,
    org.jfree.chart.plot.XYPlot,
    org.jfree.chart.renderer.xy.XYItemRenderer,
    org.jfree.chart.renderer.xy.XYLineAndShapeRenderer,
    org.jfree.data.time.*,
    org.jfree.data.time.TimeSeries,
    org.jfree.data.time.TimeSeriesCollection,
    org.jfree.data.xy.XYDataset"%>
    <%@ page import="org.jfree.chart.ChartUtilities"%>
    <%@ page import="java.util.*"%>
    <%@ page import = "com.lippi.medic.server.*"%>
    <%@ page import = "java.io.*" %>

    <html>
    <body>
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8">
    <h1 align="center">
    <font font-size="5" color="black">欢迎访问肌电信号数据库</font>
    </h1>
    <%
     //创建时序图对象
     TimeSeries timeSeries = new TimeSeries("肌电信号");
     //这里的logs是从servlet中设置的request属性值
     List<MedicLogs> logs = (List)request.getAttribute("logs");
     Iterator<MedicLogs> iterator = logs.iterator();
     		while(iterator.hasNext()){
     			MedicLogs log = iterator.next();
     			Minute minute = new Minute(log.getCreateDate());
     			double data = log.getData();
     			timeSeries.add(minute, data);
     		}
     TimeSeriesCollection collection = new TimeSeriesCollection();
     collection.addSeries(timeSeries);
     collection.setDomainIsPointsInTime(true);

     JFreeChart chart = ChartFactory.createTimeSeriesChart("肌电信号","时间",
                            "幅值", collection,true,true,false);
     chart.setBackgroundPaint(Color.white);//设置曲线图背景色
     XYPlot plot = (XYPlot) chart.getPlot();
     XYLineAndShapeRenderer renderer = (XYLineAndShapeRenderer)plot.getRenderer();
     plot.setBackgroundPaint(Color.white);//设置网格背景颜色
     plot.setDomainGridlinePaint(Color.pink);//设置网格竖线颜色
     plot.setRangeGridlinePaint(Color.pink);//设置网格横线颜色
     renderer.setBaseShapesVisible(true);//设置曲线是否显示数据点
     final File file = new File("/home/lippi/apache-tomcat-8.0.11/webapps/medicdatabase/chart.png");
     ChartUtilities.saveChartAsPNG(file, chart, 500, 300);
     %>
     <h1 align="center">
    <IMG SRC="chart.png" WIDTH="600" HEIGHT="400" BORDER="0" USEMAP="#chart">
    
    <br><br>
    
    <form action="display.do" method="post">
        <input type="submit" name="back" value="载入前5000条数据" >
        
        <input type="submit" name="forward" value="载入后5000条数据" >
    </form>
    </h1>
    </body>
    </html>

附上Jsp代码的转换和编译过程：

 1. 客户第一次请求这个jsp，容器尝试将jsp页面转换成一个servlet类的java代码
 2. 容器把java源文件编译成.class文件
 3. web容器加载新生成的servlet类
 4. 容器实例化servlet，并调用servlet的jspInit()方法,此时对象成为一个完整的servlet
 5. 容器创建一个新线程来处理客户的请求，servlet的_jspService()方法运行
 6. 最终servlet向客户发回一个响应，或者把请求转发到另一个web应用组件，比如这个例子中的jsp。
  
编译这个jsp代码需要用到两个jar文件，jfreechart-1.0.18.jar和jcommon-1.0.22.jar，把他们放到WEB-INF的lib文件夹下。
