---
layout: post
title: jQuery解构：jQuery.parseXML() - 跨浏览器XML解析
---
# [{{ page.title }}][1]
2012-02-07 By [BeiYuu][]

###jQuery.parseXML()
jQuery.parseXML使用浏览器原生的处理函数来创建有效的XML文档。

使用方法如下：

    var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>",
        xmlDoc = $.parseXML( xml ),
        $xml = $( xmlDoc ),
        $title = $xml.find("title");
    console.log($title.text( "XML Title" ));
    // return "XML Title"

我们看看是怎么实现的：

    parseXML: function(data, xml, tmp) {
     
        if (window.DOMParser) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, "text/xml");
        } else { // IE
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = "false";
            xml.loadXML(data);
        }
     
        tmp = xml.documentElement;
     
        if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
            jQuery.error("Invalid XML: " + data);
        }
     
        return xml;
    }

`DOMParser`虽然很好用，但是并不是所有浏览器都支持，是的，是IE不支持。所以在IE下面，我们使用`ActiveXObject("Microsoft.XMLDOM")`。（IE9以上就有DOMParser方法了）

注意，这个方法用来处理XML文本，如果你想处理从服务器返回的XML文本，你可以使用`XMLHttpRequest`的`responseXML`属性，我们会在后面介绍。

相关参考：
[https://github.com/jquery/jquery/blob/master/src/core.js#L555][3]
DOMParser：[https://developer.mozilla.org/en/DOMParser][4]
[https://sites.google.com/a/van-steenbeek.net/archive/explorer_domparser_parsefromstring][5]

### [回jQuery解构目录][2]
[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[jQuery]:   http://jquery.com/ "jQuery"
[1]:    {{ page.url}}  ({{ page.title }})
[2]:    /decoding-jquery/ "jQuery解构"
[3]:    https://github.com/jquery/jquery/blob/master/src/core.js#L555
[4]:    https://developer.mozilla.org/en/DOMParser
[5]:    https://sites.google.com/a/van-steenbeek.net/archive/explorer_domparser_parsefromstring
