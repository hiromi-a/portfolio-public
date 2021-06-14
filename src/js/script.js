$(function () {

  // slick
  $('.slider').slick({
    autoplay: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: '<div class="slick-prev"></div>',
    nextArrow: '<div class="slick-next"></div>',
    dots: true,
    responsive: [
      {
        breakpoint: 899,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  });

  // Modaal
  $(".inline").modaal();
  $('.gallery').modaal({
    type: 'image'
  });

  // SPnavi
  $(".js-hamburger").click(function() {
    $(this).toggleClass('active');
    $('.js-header__nav').toggleClass('nav_active');
    $('.menu-bg').toggleClass('menu-bg_active');
  });
  $('.js-header__nav a').click(function() {
    $('.js-hamburger').removeClass('active');
    $('.js-header__nav').removeClass('nav_active');
    $('.menu-bg').removeClass('menu-bg_active');
  });

  // current
  $(document).ready(function() {
    if(location.pathname != "/") {
      $('.header__nav-link[href^="/' + location.pathname.split("/")[1] + '"]').addClass('current');
    } else $('.header__nav-link:eq(0)').addClass('current');
  });


  //muuri
  $(window).on('load',function(){

    var grid = new Muuri('.item', {

      showDuration: 600,
      showEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      hideDuration: 600,
      hideEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',

      visibleStyles: {
        opacity: '1',
        transform: 'scale(1)'
      },
      hiddenStyles: {
        opacity: '0',
        transform: 'scale(0.5)'
      }
    });

    $('.sort-btn ul li').on('click',function(){
      var className = $(this).attr("class")
      className = className.split(' ');

      if($(this).hasClass("active")){
        if(className[0] != "all"){
          $(this).removeClass("active");
          var selectElms = $(".sort-btn ul li.active");
          if(selectElms.length == 0){
            $(".sort-btn ul li.all").addClass("active");
            grid.show('');
          }else{
            filterDo();
          }
        }
      }
      else{
        if(className[0] == "all"){
          $(".sort-btn ul li").removeClass("active");
          $(this).addClass("active");
          grid.show('');
        }else{
          if($(".all").hasClass("active")){
            $(".sort-btn ul li.all").removeClass("active");
          }
          $(this).addClass("active");
          filterDo();
        }
      }
    });
    function filterDo(){
      var selectElms = $(".sort-btn ul li.active");
      var selectElemAry = [];
      $.each(selectElms, function(index, selectElm) {
        var className = $(this).attr("class")
        className = className.split(' ');
        selectElemAry.push("."+className[0]);
      })
      str = selectElemAry.join(',');
      grid.filter(str);
    }
  });


  // accordion
  $('.accordion-area__title').on('click', function() {
    var findElm = $(this).next(".box");
    $(findElm).slideToggle();
    if($(this).hasClass('close')){
      $(this).removeClass('close');
    }else{
      $(this).addClass('close');
    }
  });
  $(window).on('load', function(){
    $('.accordion-area__inner').addClass("open");
    $(".open").each(function(index, element){
      var Title =$(element).children('.accordion-area__title');
      $(Title).addClass('close');
      var Box =$(element).children('.box');
      $(Box).slideDown(500);
    });
  });

  // PAGE TOP
  var pagetop = $('.js-pagetop');
  pagetop.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      pagetop.fadeIn();
    } else {
      pagetop.fadeOut();
    }
  });

  // スムーススクロール
  $('.js-anchor[href^="#"]').click(function(){
    var time = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" ? 'html' : href);
    var distance = target.offset().top;
    $("html, body").animate({scrollTop:distance}, time, "swing");
    return false;
  });

  // vivus
  new Vivus('svg-animation', {
    type: 'scenario-sync',
    duration: 8,
    forceRender: false,
    animTimingFunction:Vivus.EASE
  });

  // wow
  new WOW().init();

});
