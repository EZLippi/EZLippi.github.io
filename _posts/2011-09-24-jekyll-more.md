---
layout:         post
title:          Jekyll 的一些函数和技巧
date:           2011-09-24
category:       jekyll
---
#{{ page.title }}
{{ page.date | date:"%B %d, %Y" }} By PIZn @杭州
##一些函数
循环输出 3 篇文章
    for post in site.posts limit:3
    endfor
循环输出最近 3 篇
    for post in site.posts offset:3 limit:3
    endfor
日期
    page.date | date:"%B %b, %Y"
分页输出
    for post in paginator.posts
      content
    endfor
分页
    if paginator.previous_page
      //判断输出前一个分页
      //"page" + paginator.previous_page
    endif
    if paginator.next_page
      //判断输出后一个分页
      //"page" + paginator.next_page
    endif
    for page in (1..paginator.total_pages)
      if page == paginator.page
         //如果是当前分页
         //page
      else
         //不是的话输出其他分页链接号码
         //"page" + page
      endif
    endfor
文章页面显示前一篇文章和后一篇文章
    if page.previous
      //url:    page.previous.url
      //title:  page.previous.title | truncatewords:5
    endif
    if page.next
      //url:    page.next.url
      //title:  page.next.url | truncatewords:5
