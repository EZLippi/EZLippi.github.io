---
layout: post
title: CSS3动画详解
description: 随着低版本IE份额下降，以及移动端流量的增长，在项目中也可以大胆使用CSS3动画来增强体验和提高产品的优雅程度，对那些不支持的浏览器也不用再费心去做更多兼容，所以，我们来研究下CSS3动画，到底应该怎么用。
category: blog
---

##CSS3动画

有人认为CSS动画是做了js的事情，较真起来也算，只是已经抢占许多年了，早些年要实现鼠标滑过链接变色的基本效果，需要动用Java Applet，后来只需给HTML元素加事件`onclick=changecolor()`，再之后正如你所知，只要写`:hover`、`:focus`这样的伪类即可，同样的，现在有了CSS3动画。

####CSS3动画的优势：
<ul>
    <li>写起来非常方便，不会js也没问题</li>
    <li>有些动画js也不能很好的胜任，比如让一个元素在二维、三维空间旋转</li>
    <li>运行效果流畅，让浏览器去优化性能</li>
    <li>浏览器从底层优化动画序列，例如当tab不可见的时候，降低更新的频率提高整体性能</li>
</ul>

####劣势：
<ul>
    <li>CSS3动画应用的范围还是有限</li>
    <li>兼容性：对于增强体验的Feature来说，可以无视</li>
</ul>

###可以做动画效果的属性
理论上来说，任何单独的CSS属性都可以做动画的效果，比如：

<ul>
    <li><code>width</code>：10px 到 100px</li>
    <li><code>padding</code>：0px 到 20px</li>
    <li><code>color</code>：#F00 到 #00F</li>
    <li><code>top</code>：0px 到 10px</li>
    <li><code>border-radius</code>：3px 到 8px</li>
    <li><code>transform</code>：rotate(0deg) 到 ratate(45deg)</li>
</ul>

你也可以给`red`、`blue`这样的赋值的颜色属性加transition或animation，它会被自动转化为对应的RGB值。

###不可以做动画效果的属性

看下面这些例子：

    #container p {
        display: none;
        transition: all 3s ease;
    }

    #container:hover p {
        display: block;
    }

    /**********************/

    #container p {
        height: 0px;
        transition: all 3s ease;
    }

    #container:hover p {
        height: auto;
    }

属性从无到有或到不确定值，动画效果不会生效，因为浏览器不知道如何去做，对于元素从无到有，你可以选择`opacity`属性来处理。

##CSS3 Transition

Transition是被用到最多的也是最简单的CSS3动画类型。如果要做一个10px宽的蓝色元素在3s后变成一个100px宽的红色元素的效果，Transition可以平滑实现，你只需要声明起始和终止这两个状态。

Transition的触发也很简单，可以用`:hover`、`:focus`这样的伪类来触发，也可以通过改变元素的样式来触发。

###transition的属性

####transition-property
transition-property用来声明transition会被应用到的属性。

    #container p.one {
        transition-property: color;
    }

    #container p.two {
        transition-property: width;
    }

    #container p.three {
        transition-property: color, width;
    }

如果你想应用到所有属性，那可以简单写作`all`，也可以通过`none`来关闭transition。

####transition-duration
transition-duration用来声明动画持续的时长，可以是s也可以是ms

    #container p.one {
        transition-duration: 3s;
    }

    #container p.two {
        transition-duration: 3000ms;
    }

####transition-timing-function
transition-timing-function声明了动画的缓动类型，有下面几个选项：

<ul>
    <li><code>ease</code>：默认项，动画效果慢慢开始然后加速，到中点后再减速最后缓慢到达终点</li>
    <li><code>ease-in-out</code>：与ease类似，加减速更柔和一些</li>
    <li><code>ease-in</code>：开始比较慢，但是加速和停止曲线比较陡峭</li>
    <li><code>ease-out</code>：开始较快，然后缓慢停止</li>
    <li><code>linear</code>：线性平均速率，通常在color和opacity属性的变化上</li>
</ul>

最后，还有`cubic-bezier`函数，可以自己创造更多更优美的缓动类型。

####transition-delay
transition-delay声明了动画延迟开始的时间，很容易理解

    #container p.one {
        transition-delay: 0.5s;
    }

    #container p.two {
        transition-delay: 500ms;
    }

###transition简写
上面介绍了transition的属性，他们也可以合并成一项，省去了许多拼写，当然也别忘记浏览器前缀：

    #container p {
        transition-property: all;
        transition-duration: 3s;
        transition-timing-function: ease-in-out;
        transition-delay: 0.5s;
    }


    #element {
        /* starting state styles */
        color: #F00;
        -webkit-transition: all 3s ease-in-out 0.5s;
        transition: all 3s ease-in-out 0.5s;
    }

    #element:hover {
        /* ending state styles */
        color: #00F;
    }

###transition的高级用法

####不同的transition效果
看这样的例子：

    p#animate {
        color: #ff6;
        transition: all 3s ease-in-out 0.5s;
    }

    p#animate:hover {
        color: #0f0;
        transform: scale(4);
    }

在这个例子中，当鼠标hover，元素在0.5s之后在3s内放大四倍，鼠标移开，需要同样的时间回到原来的状态。如果想要不同的效果，可以这样写：

    p#animate {
        color: #ff6;
        transition: all 0.5s ease-in-out;
    }

    p#animate:hover {
        color: #0f0;
        transform: scale(4);
        transition: all 3s ease-in-out 0.5s;
    }

####多个transition
需要给多个transition指定不同的效果时，`all`属性解决不了，可以这样写：

    p#animate {
        width: 10em;
        background-color: #F00;
        border-radius: 5px;
        transition-property: width, border-radius, background-color;
        transition-duration: 1s, 2s;
        transition-timing-function:  ease, ease-out, linear;
    }

    p#animate:hover {
        width: 20em;
        background-color: #00F;
        border-radius: 50%;
    }

注意其中的`transition-duration`只写了两个，那么第三个`transition-property`属性`background-color`就用循环到第一个，也就是说他的`transition-duration`值是`1s`。

###transition示例

<div id="transition1">
#transition1 {<br>
&nbsp;&nbsp;&nbsp;&nbsp;width:350px;<br>
&nbsp;&nbsp;&nbsp;&nbsp;background-color:#1abc9c;<br>
&nbsp;&nbsp;&nbsp;&nbsp;transition-propety:width,background-color;<br>
&nbsp;&nbsp;&nbsp;&nbsp;transition-duration:.5s, 1s;<br>
}<br>
#transition1:hover {<br>
&nbsp;&nbsp;&nbsp;&nbsp;width:450px;<br>
&nbsp;&nbsp;&nbsp;&nbsp;background-color:#8e44ad;<br>
&nbsp;&nbsp;&nbsp;&nbsp;transition-duration:.5s, 3s;<br>
}<br>
</div>




##CSS3 Animation
###Animation和Transition的不同

<ul>
    <li>和transition一样都可以定义开始和结束状态，但是animation还可以指定更确定的中间状态</li>
    <li>animation可以像transition一样被触发，也可以自动运行</li>
    <li>animation可以无限循环的运行下去，也可以指定运行的次数</li>
    <li>animation可以在顺序运行也可以反向运行</li>
    <li>animatino写起来稍麻烦些，但是依然比js简单许多</li>
</ul>

###定义keyframes

    @keyframes colorchange {
        0%   { background-color: #00F; /* from: blue */ }
        25%  { background-color: #F00; /* red        */ }
        50%  { background-color: #0F0; /* green      */ }
        75%  { background-color: #F0F; /* purple     */ }
        100% { background-color: #00F; /* to: blue   */ }
    }

    @-webkit-keyframes colorchange {
        0%   { background-color: #00F; /* from: blue */ }
        25%  { background-color: #F00; /* red        */ }
        50%  { background-color: #0F0; /* green      */ }
        75%  { background-color: #F0F; /* purple     */ }
        100% { background-color: #00F; /* to: blue   */ }
    }

在这个例子中，只是定义了`background-color`这一个属性，如有需要，可以换做其他。对于`0%`这个也可以用`from`关键字来替代，同样的可以用`to`来代替`100%`，过渡状态，你可以定义任何百分比，类似`12.5%`这样的也可以，不过就不用给自己找麻烦了吧。浏览器的`prefix`也不能少。

###应用到元素
将`animation`应用到元素的属性写法，和`transition`差不太多，顺序都一致，就不在一个个参数重复说明，直接看代码吧：

    #myelement {
        animation-name: colorchange; /**这里引用了前面定义的动画**/
        animation-duration: 5s;
        animation-timing-function: linear;
        animation-delay: 1s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    /****简写****/
    #myelement {
        -webkit-animation: colorchange 5s linear 1s infinite alternate;
        animation: colorchange 5s linear 1s infinite alternate;
    }

`animation-iteration-count`用来指定动画循环的次数，无限循环用`infinite`。

animation-direction有四个值：

<ul>
    <li><code>normal</code>：默认，从0%执行到100%</li>
    <li><code>reverse</code>：动画从100%执行到0%</li>
    <li><code>alternate</code>：动画在0%到100%之间往复执行</li>
    <li><code>alternate-reverse</code>与<code>alternate</code>一致，不过是从100%开始</li>
</ul>

###Animation示例
<div id="ani1">Animate color</div>


##CSS3 Transform
有了`transition`和`animation`之后，就可以做出些漂亮的动画效果，如果再搭配`transform`这一CSS3动画利器，就更出彩了。

###CSS3 2D Transform

运用CSS3 2D Transform的技术，可以更自由轻松的来修饰HTML元素。CSS3 2D Transform的基本方法有下面这些：

<ul>
    <li><code>translate()</code></li>
    <li><code>rotate()</code></li>
    <li><code>scale()</code></li>
    <li><code>skew()</code></li>
    <li><code>matrix()</code></li>
</ul>

####Translate
使用`translate()`方法，可以将HTML元素在x-y轴平面上做位移，且不会影响到其他元素。

    div{
        -webkit-transform: translate(20px,20px);
        -moz-transform: translate(20px,20px);
        -o-transform: translate(20px,20px);
        transform: translate(20px,20px);
    }

效果如下：

<div id="translate1">
<div id="trans-inner1">Normal Div</div>
<div id="trans-inner2">transform:tranlated(40px, 40px)</div>
</div>

####Rotate

`rotate()`方法可以将元素按照时钟方向旋转，参数可以是`0deg`到`360deg`，也是在x-y轴平面，示例如下：

<div id="rotate1">
<div id="rota-inner1">Normal Div</div>
<div id="rota-inner2">transform:rotate(-30deg)</div>
</div>

####Scale
和名字的一样，`scale()`方法用来放大一个元素，依然是在x-y轴平面，看示例：

<div id="scale1">
    <div id="sca-inner1">Normal Div</div>
    <div id="sca-inner2">transform:scale(1.5,1.3)</div>
</div>

####Skew
`skew()`方法可以将元素按照指定参数进行扭曲，你需要指定x、y轴的扭曲角度，看示例：

<div id="skew1">
<div id="sk-inner1">Normal Div</div>
<div id="sk-inner2">transform:skew(30deg,0)</div>
</div>

####Matrix
`matrix()`方法是以上所有2D效果的方法的总和，写法如下：

    div{
        transform: matrix(a,b,c,d,tx,ty);
    }

本质上`scale`、`skew`、`rotate`、`translate`的效果都是通过`matrix`实现的，`tx`、`ty`表示位移量，关于`matrix`方法更详细的介绍可以参考这里：[理解CSS3 transform中的Matrix(矩阵)](http://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%E7%9F%A9%E9%98%B5/)


###CSS3 3D Transform
了解了2D Transform之后，3D Transform的概念也不会太难，他给HTML元素在x-y平面加上了z轴，我们一个个来看看：

<ul>
    <li><code>translate3d(tx,ty,tz)</code>：他定义了一个3D的位移方法，增加了z轴的偏移量</li>
    <li><code>translateZ(tz)</code>：这个方法只在Z轴偏移，与<code>translateX()</code>和<code>translateY()</code>相似</li>
    <li><code>scale3d(sx,sy,sz)</code>：在原有的<code>scale</code>方法上增加了z轴的参数</li>
    <li><code>scaleZ(sz)</code>：同理，只放大z轴，与<code>scaleX()</code>和<code>scaleY()</code>类似</li>
    <li><code>rotate3d(rx,ry,rz)</code>：将元素以给定参数的某一个轴方向旋转</li>
    <li><code>rotateX(angle)，rotateY(angle)</code>和<code>rotateZ(angle)</code>：只按照某一个轴旋转，<code>rotate3d(1,0,0,30deg)</code>相当于<code>rotateX(30deg)</code>，其他类推。</li>
</ul>

来看看例子：

<div class="transform-con">
<div id="trans-3" class="inner">
width:100%;<br>
height:100%;<br>
transform: translateZ(-200px);
</div>
</div>

<div class="transform-con">
<div id="trans-31" class="inner">
width:100%;<br>
height:100%;<br>
transform: translateZ(100px);
</div>
</div>

<div class="transform-con">
<div id="rotate-31" class="inner">
width:100%;<br>
height:100%;<br>
transform: rotateX(45deg);
</div>
</div>
<div class="transform-con">
<div id="rotate-32" class="inner">
width:100%;<br>
height:100%;<br>
transform: rotateY(45deg);
</div>
</div>
<div class="transform-con">
<div id="rotate-33" class="inner">
width:100%;<br>
height:100%;<br>
transform: rotateZ(45deg);
</div>
</div>

任何有3D变换的元素，不论最后只是做了2D的变换，或者什么都没做`translate3d(0,0,0)`，都会触发浏览器去计算。不过，以后会更新优化也不一定。

###Perspective
激活元素的3D空间，需要`perspective`属性，写法有两种：

    transform: perspective( 600px );
    /**或者**/
    perspective: 600px;

这两种不同写法，当应用元素只有一个时候，并没有区别，当有多个元素的时候，我们看看效果：

    #pers-red .item{
      background: red;
      transform: perspective( 400px ) rotateY(45deg);
    }

<div class="pers-con" id="pers-red">
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
</div>

    #pers-blue {
      perspective: 400px;
    }

    #pers-blue .item{
      background: blue;
      transform: rotateY( 45deg );
    }

<div class="pers-con" id="pers-blue">
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
<div class="item">&nbsp;</div>
</div>

上面这两种写法，都触发了元素的3D行为，函数型的写法`transform:perspective(400px)`适用于单个元素，会对每一个元素做3D视图的变换，而`perspective:400px`的写法，需写在父元素上，然后以父元素的视角，对多个子元素进行3D变换，多个子元素共享同一个3D空间，可以自己打开console修改感受一下。

`perspective`的参数值，决定了3D效果的强烈程度，可以想象为距离多远去观察元素。值越大，观察距离就越远，同样的旋转值，看起来效果就弱一些；值越小，距离越近，3D效果就更强烈。

####perspective-orgin
通常，对一个元素进行3D变换的时候，变换点都是元素的中心点，如果你想以其他的位置为变换点，那就可以用这个属性来做调整：

    perspective-orgin: 20% 70%;

这个是默认值的`perspective-orign:50% 50%`：
<div id="transform1">
<div class="inner">
<img src="http://lorempixel.com/150/150/city" alt="Nature">
<img src="http://lorempixel.com/150/150/food" alt="Nature">
<img src="http://lorempixel.com/150/150/people" alt="Nature">
</div>
</div>

这个是`perspective-orgin: 0% 50%;`
<div id="transform1" sytle="-webkit-perspective-origin:0% 50%;perspective-origin:0% 50%">
<div class="inner">
<img src="http://lorempixel.com/150/150/nature" alt="Nature">
<img src="http://lorempixel.com/150/150/animals" alt="Nature">
<img src="http://lorempixel.com/150/150/abstract" alt="Nature">
</div>
</div>

####transform-style
这个参数用来共享父元素的3D空间，这样说起来有些抽象，下面第一个翻卡片的例子中会讲到。

####backface-visibility
backface-visibility 属性可用于隐藏内容的背面。默认情况下，背面可见，这意味着即使在翻转后，变换的内容仍然可见。但当 backface-visibility 设置为 hidden 时，旋转后内容将隐藏，因为旋转后正面将不再可见。该功能可帮助你模拟多面的对象，例如下例中使用的卡片。通过将 backface-visibility 设置为 hidden，可以确保只有正面可见。




##CSS3 动画实例

下面例子中的代码，为了方便查看都没有写浏览器前缀，也没有加入其他的修饰属性，所以实际应用时，不要忘记哦，当然也可以直接console查看。

###CSS3 翻纸牌
做一个翻纸牌的效果，结构很简单：

    <div id="cardflip">
      <div id="card1">
        <div class="front">1</div>
        <div class="back">2</div>
      </div>
    </div>

`.cardflip`是整个3D效果的容器，`#card1`是翻转效果的元素，`.front`和`.back`是翻转的两面。添加样式：

    #cardflip {
        width: 200px;
        height: 260px;
        position: relative;
        perspective: 800px;
    }

    #card1 {
        width: 100%;
        height: 100%;
        position: absolute;
        transform-style: preserve-3d;
        transition: transform 1s;
    }

首先给`#cardflip`添加`perspective`属性，这样才能触发3D变换，之后`#card1`就在父元素的3D空间中了，用了`absolute`来定位子元素，设置宽高都是`100%`，这样就可以让`transform-origin`在元素的中心点，这个后面再讨论。

`transform-style`有两个值，一个是默认的`flat`一个是`preserve-3d`，由于`perspective`的3D空间，只能作用于直接的子元素，那么`.front`和`.back`也需要`#cardflip`的3D空间的话，就需要给`#card1`添加这个属性，

    #card1 div{
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }

只有`#card1 div`元素共享了外层元素的3D空间之后，3D变换的属性才能生效，这时候的`backface-visibility`才有效，设置为`hidden`。

    #card1 .front {
        background: red;
    }

    #card1 .back {
        background: blue;
        transform: rotateY( 180deg );
    }

    #card1.flipped {
        transform: rotateY( 180deg );
    }

因为设置了`backface-visibility`，而`.back`默认就是以Y轴旋转了180度，空间想象一下，`.back`就转到背面去了，所以`hidden`属性生效，就看不到`.back`了。

当`#card1`添加了`.flipped`的样式，`#card1`以Y轴旋转了180度，这时候`.front`转到了背面，而`.back`从背面转到了前面，所以就完成了切换。这一段需要仔细的想一想。好了，看看下面的实例，点击即可翻转：

<div id="cardflip">
<div id="card1">
<div class="front">1</div>
<div class="back">2</div>
</div>
</div>

我们再给这个翻转加一些偏移的效果，看起来会不那么生硬。这就用到了`transform-origin`，这个参数：

    #card1 { transform-origin: left center; }

    #card1.flipped {
      transform: translateX( 100% ) rotateY( 180deg );
    }

默认的`transform-origin`是`center center`，我们改成`left center`之后，就不再以元素的x方向的中心为轴旋转，而是以元素的左边为Y轴旋转，所以还需要给整个`#card1`加一个位移量`translate`，值是`100%`，就是元素本身的宽度。

可以在console里面去掉`#card1.flipped`的`translate`帮助理解。

<div id="cardflip1">
<div id="card2">
<div class="front">1</div>
<div class="back">2</div>
</div>
</div>

这里有一点需要注意，当元素在z轴上有了位移，或者朝向负角度旋转，会导致元素在页面上无法被鼠标点击到，想像一下3D空间，这个元素已经位于整个页面平面的**里面**，所以无法触及了。

###CSS3 立方体
做完了反转卡片的效果，肯定还想做更炫的，来试试做一个立方体吧：

    <section id="cube-con">
      <div id="cube">
        <figure class="front">1</figure>
        <figure class="back">2</figure>
        <figure class="right">3</figure>
        <figure class="left">4</figure>
        <figure class="top">5</figure>
        <figure class="bottom">6</figure>
      </div>
    </section>

    #cube-con {
        width: 200px;
        height: 200px;
        position: relative;
        perspective: 1000px;
    }

    #cube {
        width: 100%;
        height: 100%;
        position: absolute;
        transform-style: preserve-3d;
    }

    #cube figure {
        width: 196px;
        height: 196px;
        display: block;
        position: absolute;
        border: 2px solid black;
    }

这一部分和上一个例子没有太大的差别，应该都能理解每一个属性的含义了。

    #cube .front  { transform: rotateY(   0deg ) translateZ( 100px ); }
    #cube .back   { transform: rotateX( 180deg ) translateZ( 100px ); }
    #cube .right  { transform: rotateY(  90deg ) translateZ( 100px ); }
    #cube .left   { transform: rotateY( -90deg ) translateZ( 100px ); }
    #cube .top    { transform: rotateX(  90deg ) translateZ( 100px ); }
    #cube .bottom { transform: rotateX( -90deg ) translateZ( 100px ); }

立方体的每一个面，经过`rotate`旋转之后，就放置在了他该被放置的地方，但是这时候会发现，这些层叠加在一起，还没有成为一个立方体，这时候需要给Z轴一个位移，想象一下我们的视角点在`#cube`正中间，拉伸z轴之后，`.right`、`left`等面就会有一定的角度，参考画画时候的透视，因为刚好在中心点，所以位移量就是宽度的一半。分步过程可以看[这里](http://desandro.github.io/3dtransforms/examples/cube-01-steps.html)。

因为z轴拉伸之后，原来的对象会被放大一些，这样就会模糊掉，为了去掉这个影响，我们需要把立方体再推回原来的视角平面，于是：

    #cube { transform: translateZ( -100px ); }

完成了立方体，想让某个面旋转到前方，只需转动整个立方体，不用去调整每个面：

    #cube.show-front  { transform: translateZ( -100px ) rotateY(    0deg ); }
    #cube.show-back   { transform: translateZ( -100px ) rotateX( -180deg ); }
    #cube.show-right  { transform: translateZ( -100px ) rotateY(  -90deg ); }
    #cube.show-left   { transform: translateZ( -100px ) rotateY(   90deg ); }
    #cube.show-top    { transform: translateZ( -100px ) rotateX(  -90deg ); }
    #cube.show-bottom { transform: translateZ( -100px ) rotateX(   90deg ); }

    /**还有过渡效果**/
    #cube { transition: transform 1s; }

<section id="cube-con">
<div id="cube">
<figure class="front">1</figure>
<figure class="back">2</figure>
<figure class="right">3</figure>
<figure class="left">4</figure>
<figure class="top">5</figure>
<figure class="bottom">6</figure>
</div>
</section>

<div id="cube-btn">
<button data-class="show-front">Show Front</button>
<button data-class="show-back">Show Back</button>
<button data-class="show-right">Show Right</button>
<button data-class="show-left">Show Left</button>
<button data-class="show-top">Show Top</button>
<button data-class="show-bottom">Show Bottom</button>
</div>


###3D 旋转跑马灯
做幻灯片展示的方法有很多，我们用CSS3的3D技术来试试看：

    <section class="container">
      <div id="carousel">
        <figure>1</figure>
        <figure>2</figure>
        <figure>3</figure>
        <figure>4</figure>
        <figure>5</figure>
        <figure>6</figure>
        <figure>7</figure>
        <figure>8</figure>
        <figure>9</figure>
      </div>
    </section>

    .container {
      width: 210px;
      height: 140px;
      position: relative;
      perspective: 1000px;
    }

    #carousel {
      width: 100%;
      height: 100%;
      position: absolute;
      transform-style: preserve-3d;
    }

    #carousel figure {
      display: block;
      position: absolute;
      width: 186px;
      height: 116px;
      left: 10px;
      top: 10px;
      border: 2px solid black;
    }

上面这一段，没什么特别要说明的，基本的结构样式，以及之前重点说明过的`perspective`和`preserve-3d`。现在有9个卡片，要环绕成一圈，那么每个的角度就是`40deg` （360/90）。

    #carousel figure:nth-child(1) { transform: rotateY(   0deg ); }
    #carousel figure:nth-child(2) { transform: rotateY(  40deg ); }
    #carousel figure:nth-child(3) { transform: rotateY(  80deg ); }
    #carousel figure:nth-child(4) { transform: rotateY( 120deg ); }
    #carousel figure:nth-child(5) { transform: rotateY( 160deg ); }
    #carousel figure:nth-child(6) { transform: rotateY( 200deg ); }
    #carousel figure:nth-child(7) { transform: rotateY( 240deg ); }
    #carousel figure:nth-child(8) { transform: rotateY( 280deg ); }
    #carousel figure:nth-child(9) { transform: rotateY( 320deg ); }

好了，和立方体的例子到同样的步骤了，现在所有的卡片做了Y轴旋转，但因为观察的视角点没有变，所以看起来还是平面，如下这样：

![caro](http://ww3.sinaimg.cn/large/8b8af2c8jw1e84s4cel0uj208e05raa0.jpg)

立方体的位移很好计算，只要是宽度、高度、或者深度的一半就可以了，这个旋转的跑马灯应该怎么计算呢？

![caro-cmpu](http://ww1.sinaimg.cn/large/8b8af2c8jw1e84s5efyxej20f00b6aaj.jpg)

从旋转跑马灯的上方观察，每个卡片的宽度是`210px`，角度是`40deg`，要计算到中心点的距离，根据旁边的三角形可得：

    r = 105 / tan(20deg) = 288px

所以：

    #carousel figure:nth-child(1) {transform:rotateY(  0deg) translateZ(288px);}
    #carousel figure:nth-child(2) {transform:rotateY( 40deg) translateZ(288px);}
    #carousel figure:nth-child(3) {transform:rotateY( 80deg) translateZ(288px);}
    #carousel figure:nth-child(4) {transform:rotateY(120deg) translateZ(288px);}
    #carousel figure:nth-child(5) {transform:rotateY(160deg) translateZ(288px);}
    #carousel figure:nth-child(6) {transform:rotateY(200deg) translateZ(288px);}
    #carousel figure:nth-child(7) {transform:rotateY(240deg) translateZ(288px);}
    #carousel figure:nth-child(8) {transform:rotateY(280deg) translateZ(288px);}
    #carousel figure:nth-child(9) {transform:rotateY(320deg) translateZ(288px);}

知道了计算方法，如果要改变卡片的个数，或者宽度，只要按照那个公式再计算就好：

    var tz = Math.round( ( panelSize / 2 ) / 
      Math.tan( ( ( Math.PI * 2 ) / numberOfPanels ) / 2 ) );
    // or simplified to
    var tz = Math.round( ( panelSize / 2 ) / 
      Math.tan( Math.PI / numberOfPanels ) );

计算好卡片的位置之后，然后旋转`#carousel`就可以了，当然这个要用js来控制了：

    #carousel{
        transform: translateZ( -288px ) rotateY( -160deg );
    }

js代码如下：

    $(function(){
        $('#car-pre').click(function(){
            var deg = $('#carousel').attr('data-deg') || 0;
            deg = parseInt(deg)+40;

            var value = 'translateZ(-288px) rotateY('+deg+'deg)';

            $('#carousel')
                .attr('data-deg',deg)
                .css({
                    '-webkit-transform':value
                    ,'-moz-transform':value
                    ,'-o-transform':value
                    ,'transform':value
                });
        });
        $('#car-next').click(function(){
            var deg = $('#carousel').attr('data-deg') || 0;
            deg = parseInt(deg)-40;

            var value = 'translateZ(-288px) rotateY('+deg+'deg)';

            $('#carousel')
                .attr('data-deg',deg)
                .css({
                    '-webkit-transform':value
                    ,'-moz-transform':value
                    ,'-o-transform':value
                    ,'transform':value
                });
        });

<section id="caro-con"><div id="carousel"><figure>1</figure><figure>2</figure><figure>3</figure><figure>4</figure><figure>5</figure><figure>6</figure><figure>7</figure><figure>8</figure><figure>9</figure></div></section>
<div id="car-btn">
<button id="car-pre">&lt; Prev</button>
<button id="car-next">Next &gt;</button>
</div>

##结语
终于完成了这篇，梳理的过程对我自己很有提高，希望对你也能有些帮助，有兴趣可以关注我，期待下以后的博客~
