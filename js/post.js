$(document).ready(function(){

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        }
        ,BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        }
        ,iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
        ,Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        }
        ,Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        }
        ,any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $('pre').addClass('prettyprint linenums'); //添加Google code Hight需要的class

    //***********************
    //**评论的代码也删掉哦***
    window.disqus_shortname = 'beiyuu'; // required: replace example with your forum shortname
    $('#disqus_container .comment').on('click',function(){
        $(this).html('加载中...');
        var that = this;
        $.getScript('http://' + disqus_shortname + '.disqus.com/embed.js',function(){$(that).remove()});
    });
    //**评论的代码也删掉哦***
    //***********************

    $('.entry a').each(function(index,element){
        var href = $(this).attr('href');
        if(href){
            if(href.indexOf('#') == 0){
            }else if ( href.indexOf('/') == 0 || href.toLowerCase().indexOf('beiyuu.com')>-1 ){
            }else if ($(element).has('img').length){
            }else{
                $(this).attr('target','_blank');
                $(this).addClass('external');
            }
        }
    });

    var menuIndex = function(){
        var ie6 = ($.browser.msie && $.browser.version=="6.0") ? true : false;
        if($('h2',$('#content')).length > 2 && !isMobile.any() && !ie6){
            var h2 = [],h3 = [],tmpl = '<ul>',h2index = 0;

            $.each($('h2,h3',$('#content')),function(index,item){
                if(item.tagName.toLowerCase() == 'h2'){
                    var h2item = {};
                    h2item.name = $(item).text();
                    h2item.id = 'menuIndex'+index;
                    h2.push(h2item);
                    h2index++;
                }else{
                    var h3item = {};
                    h3item.name = $(item).text();
                    h3item.id = 'menuIndex'+index;
                    if(!h3[h2index-1]){
                        h3[h2index-1] = [];
                    }
                    h3[h2index-1].push(h3item);
                }
                item.id = 'menuIndex' + index;
            });

            //添加h1
            tmpl += '<li class="h1"><a href="#" data-top="0">'+$('h1').text()+'</a></li>';

            for(var i=0;i<h2.length;i++){
                tmpl += '<li><a href="#" data-id="'+h2[i].id+'">'+h2[i].name+'</a></li>';
                if(h3[i]){
                    for(var j=0;j<h3[i].length;j++){
                        tmpl += '<li class="h3"><a href="#" data-id="'+h3[i][j].id+'">'+h3[i][j].name+'</a></li>';
                    }
                }
            }
            tmpl += '</ul>';

            $('body').append('<div id="menuIndex"></div>');
            $('#menuIndex').append($(tmpl)).delegate('a','click',function(e){
                e.preventDefault();
                var scrollNum = $(this).attr('data-top') || $('#'+$(this).attr('data-id')).offset().top;
                //window.scrollTo(0,scrollNum-30);
                $('body, html').animate({ scrollTop: scrollNum-30 }, 400, 'swing');
            });

            $(window).load(function(){
                var scrollTop = [];
                $.each($('#menuIndex li a'),function(index,item){
                    if(!$(item).attr('data-top')){
                        var top = $('#'+$(item).attr('data-id')).offset().top;
                        scrollTop.push(top);
                        $(item).attr('data-top',top);
                    }
                });

                var waitForFinalEvent = (function () {
                    var timers = {};
                    return function (callback, ms, uniqueId) {
                        if (!uniqueId) {
                            uniqueId = "Don't call this twice without a uniqueId";
                        }
                        if (timers[uniqueId]) {
                            clearTimeout (timers[uniqueId]);
                        }
                        timers[uniqueId] = setTimeout(callback, ms);
                    };
                })();

                $(window).scroll(function(){
                    waitForFinalEvent(function(){
                        var nowTop = $(window).scrollTop(),index,length = scrollTop.length;
                        if(nowTop+60 > scrollTop[length-1]){
                            index = length;
                        }else{
                            for(var i=0;i<length;i++){
                                if(nowTop+60 <= scrollTop[i]){
                                    index = i;
                                    break;
                                }
                            }
                        }
                        $('#menuIndex li').removeClass('on');
                        $('#menuIndex li').eq(index).addClass('on');
                    });
                });
            });

            //用js计算屏幕的高度
            $('#menuIndex').css('max-height',$(window).height()-80);
        }
    };

    $.getScript('/js/prettify/prettify.js',function(){
        prettyPrint();
        menuIndex();
    });

    if(/\#comment/.test(location.hash)){
        $('#disqus_container .comment').trigger('click');
    }
});
