$(function(){

    $('#cardflip').click(function(){
        $('#card1').toggleClass('flipped')
    });

    $('body').delegate('#cardflip1','click',function(){
        $('#card2').toggleClass('flipped')
    });

    $('body').delegate('#cube-btn button','click',function(){
        var cls = $(this).attr('data-class');
        $('#cube').removeClass();
        $('#cube').addClass(cls);
    });

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
});
