---
layout: post
title: jQuery解构
category: project
description: jQuery是一个伟大作品，他的完成充满智慧，我们来一点点拆解他，去理解作者的思想精华。
---
# [{{ page.title }}][1]
2012-01-16 By [BeiYuu][]

这是一个翻译项目，解构jQuery系列的作者是[Shi Chuan][2]，原文地址是：[Decoding jQuery series][3]。

## 介绍
开源项目不错，但是他们开的还不够彻底。在这一系列解构jQuery的文章中，我们会仔细去研究jQuery的每一个方法，去研究框架的美妙之处，也以此向jQuery的作者致敬。

## jQueyr Core

### 基础部分
* [面向对象和jQuery - 函数](/decoding-jquery/oop-jquery-function "面向对象和jQuery - 函数")
* [面向对象和jQuery - 对象](/decoding-jquery/oop-jquery-object "面向对象和jQuery - 对象")
* [面向对象和jQuery - 原型](/decoding-jquery/oop-jquery-prototype "面向对象和jQuery - 原型")
* [面向对象和jQuery - 函数作用域、链式调用以及jQuery.fn](/decoding-jquery/oop-jquery-scope "面向对象和jQuery - 函数作用域、链式调用以及jQuery.fn")

### 设计模式
* 面向对象和jQuery - 工厂模式(factory pattern)
* 面向对象和jQuery - 外观模式(facade pattern)

### 方法
* jQuery.extend() - 对象的继承扩展
* jQuery.isWindow() - 检测window对象
* jQuery.parseXML() - 跨浏览器的XML解析
* jQuery.globalEval() - 在全局作用域下执行脚本
* jQuery.toarray() - 数组的切分、调用等等
* jQuery.inarray() - 在数组中查找特定值
* jQuery.support() - DOM2的事件冒泡和捕获

[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    http://www.blog.highub.com/ "Shi Chuan"
[3]:    http://www.blog.highub.com/decoding-jquery/ "Decoding jQuery"
