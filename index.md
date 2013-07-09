---
layout: index
---

<div class="index-content blog">
    <div class="section">
        <ul class="artical-cate">
            <li class="on"><a href="/"><span>Blog</span></a></li>
            <li style="text-align:center"><a href="/opinion"><span>Opinion</a></span></li>
            <li style="text-align:right"><a href="/project"><span>Project</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <ul class="artical-list">
        {% for post in site.categories.blog %}
            <li>
                <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
                <div class="title-desc">{{ post.description }}</div>
            </li>
        {% endfor %}
        </ul>
    </div>
    <div class="aside">
        <!--<div class="weibo-con">-->
            <!--<iframe width="100%" height="75" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=75&fansRow=2&ptype=1&speed=0&skin=1&isTitle=0&noborder=0&isWeibo=0&isFans=0&uid=1855270953&verifier=375b89d6&colors=d6f3f7,262626,666666,0082cb,ecfbfd&dpc=1"></iframe>-->
        <!--</div>-->
    </div>
</div>
