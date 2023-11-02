/**
 * 2022.07 Updated.
 */

"use strict"

jQuery(function(){

	const msnry = new Masonry('.grid', {
	  itemSelector: '.grid-item',
	  columnWidth: '.grid-sizer',
	  gutter: '.gutter-sizer',
	  percentPosition: true,
	});
	imagesLoaded('.grid').on('progress', function () {
	  msnry.layout();
	});

	$(".tab > li").each(function (index) {
	  $(this).click(function () {
		const port_li = $(".grid-item");
		port_li.hide();
		$(".tab > li").removeClass('on');
		$(this).addClass('on');

		if ($(this).hasClass('all')) {
		  port_li.show();
		} else {
		  port_li.hide();
		  $(".grid-item.portf_" + index).show();
		}

		imagesLoaded('.grid').on('progress', function () {
		  msnry.layout();
		});

	  });
	});

});
