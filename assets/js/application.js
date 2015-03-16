/* Author: 
*/

// var App = Ember.Application.create({
//     rootElement: '#container'
// });
// 
// App.Router.map(function() {
//     this.route('articles');
// });
// 
// App.IndexView = Ember.View.extend({
// 
//     // http://stackoverflow.com/questions/21779815/how-to-integrate-jquery-masonry-with-ember-js
//     
//     onDidInsertElement: function() {
//         // TODO: refactoring
// 
//         $('#accordion').on('show.bs.collapse', function () {
// 
//             // http://masonry.desandro.com/
//             var $container = $('.masonry', this);
//             $container.imagesLoaded( function() {
//                 $container.masonry({
//                     // columnWidth: 200,
//                     // itemSelector: '.item'
//                 });
//             });
//             
//         });
// 
//         // $('.thumbnail.with-caption').hover(
//         //     function(){ $(this).find('.caption').slideDown(250); },
//         //     function(){ $(this).find('.caption').slideUp(250); }
//         // ); 
// 
//       this.reMason();
//     }.on('didInsertElement'),
// 
//     onWillDestroy: function() {
//       this.$('.masonry').masonry('destroy');
//     }.on('willDestroy'),
// 
//     reMason: function() {
//       this.$('.masonry').masonry({
//         // masonry init options here
//       });
//       this.$('.masonry').imagesLoaded( function() {
//         this.$('.masonry').masonry();
//       }.bind(this));
//     }    
// });


$(function() {
	// $('.bigger').biggerlink();
	// $('.tabs').tabs();

	function loadTwitter() {
	    if($(".twitter-share-button").length > 0){
	        if (typeof (twttr) != 'undefined') {
	            twttr.widgets.load();
	        } else {
	            $.getScript('http://platform.twitter.com/widgets.js');
	        }
	    }
	}
	
	var init = function(ajax) {
		
		$(".various").fancybox({
			// maxWidth	: 800,
			// maxHeight	: 600,
			// fitToView	: false,
			// width		: '70%',
			// height		: '70%',
			// autoSize	: false,
			// closeClick	: false,
			// openEffect	: 'none',
			// closeEffect	: 'none'
		});
		
		// http://stackoverflow.com/questions/7901679/jquery-add-target-blank-for-outgoing-link
		$('a[href^="http://"]').not('a[href*=usefulparadigm]').attr('target','_blank');
		
		// re-render widgets
		if (ajax) {
			if (typeof FB !== 'undefined') FB.XFBML.parse();
			loadTwitter();
		}
        

        // http://kenwheeler.github.io/slick/        
        // $('.work-slider').slick({
        //     infinite: true,
        //       slidesToShow: 3,
        //       slidesToScroll: 3
        // });    
        
        // http://masonry.desandro.com/
        // var $container = $('.masonry');
        // $container.imagesLoaded( function() {
        //     $container.masonry({
        //         // columnWidth: 200,
        //         // itemSelector: '.item'
        //     });
        // });

        // $('#accordion').on('show.bs.collapse', function () {
        //     // http://masonry.desandro.com/
        //     var $container = $('.masonry', this);
        //     $container.imagesLoaded( function() {
        //         $container.masonry({
        //             // columnWidth: 200,
        //             // itemSelector: '.item'
        //         });
        //     });
        // });
        
	};
	
	init();

	// // ajax pushState
	// 
	// String.prototype.decodeHTML = function() {
	// 	return $("<div>", {html: "" + this}).html();
	// };
	// 
	// if (window.history && window.history.pushState) {
	// 	
	// 	var loadPage = function(href) {
	// 		history.ready = true; 
	// 		history.pushState({path: href}, '', href);
	// 		$.get(href, function(html) {
	// 			$("#container").html(html.match(/<!--\^frag-->([\s\S]*?)<!--\$frag-->/m)[1]);
	// 			document.title = html.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML();
	// 			init(true);
	// 		});
	// 		// $('#container').load(href + ' #container>*', function(html) {
	// 		// 	console.log($(html).filter("#container>*"));
	// 		// 	document.title = html.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML();
	// 		// 	init();
	// 		// 	// $('#container').animate({width: 'toggle'});
	// 		// });
	// 	};
	// 
	// 	$(document).on('click', "a:not([href^='http://'])", function() {
	// 		var href = $(this).attr('href');
	// 		// if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
	// 			loadPage(href);
	// 		// }
	// 		return false;
	// 	});
	// 	
	// 	$(window).on("popstate", function(e) {
	// 		// console.log(e.originalEvent);
	// 	    if (window.history.ready || e.originalEvent.state !== null) { // if not initial load
	// 			loadPage(location.href);
	// 	    }
	// 	});
	// 	
	// }

});

