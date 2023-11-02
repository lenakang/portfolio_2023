/**
 * 2022.07 Updated.
 */

"use strict"

jQuery(function () {

  AOS.init({
    easing: 'ease-out-back',
    duration: 1200,
    disable: 'mobile',
  });

  scroll();
  scrollspy();
  burger_menu();
  overlay();

  //scroll
  function scroll() {
    $(window).scroll(function () {
      var win_scroll = $(window).scrollTop();
      if (win_scroll > 0) {
        $('header').addClass('scroll');
      } else {
        $('header').removeClass('scroll');
      }
    });
  };

  //scrollspy
  function scrollspy() {
    if (window.innerWidth > 992) {
      $('body').scrollspy({ target: ".navbar", offset: 200 });
      $("#myNavbar a.spy").on('click', function (event) {
        if (this.hash !== "") {
          event.preventDefault();
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 800, function () {
            window.location.hash = hash;
          });
        }
      });
      //scroll to about
      $('.scroll').click(function () {
        $('header > nav > ul > li:nth-child(2) > a').trigger('click');
        console.log('dd')
      });
    } else {
      $('.gnb').removeClass('navbar');
    }
  }

  //burger_menu
  function burger_menu() {
    function device_size() {
      if (window.innerWidth > 992) {
        $(".gnb").removeClass("mobile_gnb");
        $(".gnb").addClass("pc_gnb");
        closeMenu();
      } else {
        $(".gnb").addClass("mobile_gnb");
        $(".gnb").removeClass("pc_gnb");

      }
    }
    $(window).resize(function () {
      device_size();
    });
    device_size();

    $(".gnb.mobile_gnb > .nav > li").each(function (index) {
      if ($(this).find("ul").length > 0) {
        console.log("31");
        $(this).addClass("dp_menu");
        $(this).children("a").attr("href", "#none");
      }
    });

    $(document).on("click", ".dp_menu > a", function () {
      if ($(".gnb").hasClass("mobile_gnb")) {
        $(this).next("ul").slideToggle();
      }
    });

    $(document).on("click", ".mobile_gnb > ul > li > a.spy", function () {
      closeMenu();
    });

    if ('ontouchstart' in window) { var click = 'touchstart'; }
    else { var click = 'click'; }

    $('div.burger').on(click, function () {
      if (!$(this).hasClass('open')) { openMenu(); }
      else { closeMenu(); }
    });

    $('div.menu ul li a').on(click, function (e) {
      e.preventDefault();
      closeMenu();
    });

    function openMenu() {
      $("header").addClass("mobile_nav_open");
      $('div.circle').addClass('expand');
      $('div.burger').addClass('open');
      $('div.x, div.y, div.z').addClass('coll');
      $(".gnb").find("li").addClass('animate');

      setTimeout(function () {
        $('div.y').hide();
        $('div.x').addClass('rotate30');
        $('div.z').addClass('rotate150');
      }, 70);
      setTimeout(function () {
        $('div.x').addClass('rotate45');
        $('div.z').addClass('rotate135');
      }, 120);
    }

    function closeMenu() {
      $("header").removeClass("mobile_nav_open");
      $('div.burger').removeClass('open');
      $('div.x').removeClass('rotate45').addClass('rotate30');
      $('div.z').removeClass('rotate135').addClass('rotate150');
      $(".gnb").find("li").removeClass('animate');

      setTimeout(function () {
        $('div.x').removeClass('rotate30');
        $('div.z').removeClass('rotate150');
      }, 50);
      setTimeout(function () {
        $('div.y').show();
        $('div.x, div.y, div.z').removeClass('coll');
      }, 70);
      setTimeout(function () {
        $('div.circle').removeClass('expand');
      }, 150);
    }
  }

  //overlay
  function overlay() {
    $('#main section#work>.inner>.container>ul>li>figure').append('<div class="overlay"></div>');
  }

  // 원 회전모션
  function loaderCanvas(el, bubbleStrokeWidth, bubbleStrokeColor, bubbleFillColor) {
    var blob = new paper.PaperScope();
    blob.setup(el);
    var view = blob.view,
      Point = blob.Point,
      Path = blob.Path,
      Group = blob.Group;

    function Bacterium(center, radius, bubbleStrokeWidth, bubbleStrokeColor, bubbleFillColor) {
      this.build(center, radius, bubbleStrokeWidth, bubbleStrokeColor, bubbleFillColor);
    }
    Bacterium.prototype = {
      build: function (center, radius, bubbleStrokeWidth, bubbleStrokeColor, bubbleFillColor) {
        var padding = Math.min(view.size.width, view.size.height) * 0.1;
        var timeScale = 1;
        var maxWidth = view.size.width - padding * 1.5;
        var maxHeight = view.size.height - padding * 1.5;
        var w = maxWidth * timeScale;
        var h = maxHeight * timeScale;
        this.fitRect = new Path.Rectangle({
          point: [view.size.width / 2 - w / 2, view.size.height / 2 - h / 2],
          size: [w, h]
        });
        this.circlePath = new Path.Circle(center, radius);
        this.group = new Group([this.circlePath]);
        this.group.position = view.center;
        this.circlePath.strokeColor = bubbleStrokeColor;
        this.circlePath.strokeWidth = bubbleStrokeWidth;
        this.circlePath.fillColor = bubbleFillColor;
        this.circlePath.fullySelected = false;
        var rotationMultiplicator = radius / 200;
        this.threshold = radius * 1.4;
        this.center = center;
        this.controlCircle = this.circlePath.clone();
        this.controlCircle.fullySelected = false;
        this.controlCircle.visible = false;
        this.circlePath.flatten(radius * 0.5);
        this.circlePath.smooth();
        this.circlePath.fitBounds(this.fitRect.bounds);
        this.settings = [];
        for (var i = 0; i < this.circlePath.segments.length; i++) {
          var segment = this.circlePath.segments[i];
          this.settings[i] = {
            relativeX: segment.point.x - this.center.x,
            relativeY: segment.point.y - this.center.y,
            offsetX: rotationMultiplicator,
            offsetY: rotationMultiplicator,
            momentum: new Point(0, 0)
          };
        }
      },
      clear: function () {
        this.circlePath.remove();
        this.fitRect.remove();
      },
      animate: function (event) {
        this.group.rotate(-1, view.center);
        for (var i = 0; i < this.circlePath.segments.length; i++) {
          var segment = this.circlePath.segments[i];
          var settings = this.settings[i];
          var controlPoint = new Point(settings.relativeX + this.center.x, settings.relativeY + this.center.y);
          controlPoint = this.controlCircle.segments[i].point;
          var newOffset = new Point(0, 0);
          newOffset = new Point(this.center._owner.width / this.center._owner.height * Math.floor(Math.random() * (2 - 1 + 1) + 1), this.center._owner.width / this.center._owner.height * Math.floor(Math.random() * (2 - 1 + 1) + 1));
          var newPosition = controlPoint.add(newOffset);
          var distanceToNewPosition = segment.point.subtract(newPosition);
          settings.momentum = settings.momentum.subtract(distanceToNewPosition.divide(8));
          settings.momentum = settings.momentum.multiply(0.6);
          var amountX = settings.offsetX;
          var amountY = settings.offsetY;
          var sinus = Math.sin(event.time + i * 1);
          var cos = Math.cos(event.time + i * 1);
          settings.momentum = settings.momentum.add(new Point(cos * -amountX * 2, sinus * -amountY * 2));
          segment.point = segment.point.add(settings.momentum);
        }
      }
    };
    var radius = Math.min(view.size.width, view.size.height) / 2 * 0.7;
    var bacterium = new Bacterium(view.bounds.center, radius, bubbleStrokeWidth, bubbleStrokeColor, bubbleFillColor);
    view.onFrame = function (event) {
      bacterium.animate(event);
    };
  }

  function loadBubbles(bubbles) {
    for (var i = 0; i < bubbles.length; i++) {
      var bubble = bubbles[i];
      var bubbleStrokeWidth = bubble.getAttribute('data-stroke-width');
      var bubbleStrokeColor = bubble.getAttribute('data-stroke-color');
      var bubbleFillColor = bubble.getAttribute('data-fill');
      bubble.setAttribute('id', 'bubble-' + i);
      loaderCanvas(bubble.id, bubbleStrokeWidth, bubbleStrokeColor, bubbleFillColor);
    }
  }
  window.onload = function () {
    loadBubbles(document.querySelectorAll('.bubble'));
  };

});
