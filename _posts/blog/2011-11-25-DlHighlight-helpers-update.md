---
layout:        post
title:          为 DlHighlight 的 Helpers 增加行数
---
#{{ page.title }}
2011-11-25 By PIZn @杭州

今天下午在寻找一些合适的代码高亮 JS 插件，发现有几款挺不错的。于是下了下来看源代
码，折腾折腾了。

找到一个叫<a href="http://mihai.bazon.net/projects/javascript-syntax-highlighting-engine"
title="DlHighlight" >DlHighlight</a> 的，目前只提供 XML ，XHTML ，JS ，CSS 4 种
语法高亮，感觉特别合适我。大爱啊。其生成方式也比较喜欢，通过载入 JS 来修改代码的
高亮形式。

只是， 一来发现其代码高亮的色彩搭配不是很喜欢，二来发现其提供了一个可以直接在
domReady 的时候调用的辅助函数不是很完美，遂修改之。

主要修改的地方是让代码的行数显得更佳容易调控。通过置入开关 true 和 false 来实现
，好简单丫。

修改点，为 highlightByName 函数增加 switch 即可；

    highlightByName: function(name, tag, args, switch) {
        if(!switch)
            switch = false;
        if(!args)
            args = {};
        if(!tag)
            tag = "pre";
        var a = document.getElementsByTagName(tag);
        for (var i = a.length; --i >= 0;) {
            var el = a[i];
            if (el.getAttribute("name") == name) {
                var code = el._msh_text || getText(el);
                el._msh_text = code;
                args.leng = el.msh_type || el.className;
                el._msh_type = args.lang;
                args.lineNumbers = switch;
                var hl = new DlHighlight(args);
                code = hl.doItNow(code);
                if(DlHighlight.is_ie) {
                    var div = document.createElement("div");
                    div.innerHTML = "<pre>" + code + "</pre>";
                    while (div.firstChild)
                        el.appendChild(div.firstChild);
                } else
                    el.innerHTML = code;
                el.className = "DlHighlight" + el.className;
            }
        }
    }

OK，修改好之后，就可以这样来调用了：
    
    window.onload = function() {
        //最后一个参数 true 为打开行数，false 为关闭
        DlHighlight.HELPERS.highlighting('fooname', 'pre', '', true);
    }
