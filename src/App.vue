<template>
  <main class="main">
    <div v-if="showLoading" class="page-loader">
      <div class="page-loader__spinner">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
        </svg>
      </div>
    </div>

    <header class="header">
      <!--<div class="navigation-trigger" data-sa-action="aside-open" data-sa-target=".sidebar">-->
        <!--<i class="zmdi zmdi-menu"></i>-->
      <!--</div>-->

      <div class="logo hidden-sm-down">
        <h1><a href="#/">{{logoText}}</a></h1>
      </div>


      <ul class="top-nav">
        <!--<li>-->
          <!--<form class="search">-->
            <!--<div class="search__inner">-->
              <!--<input type="text" class="search__text" :placeholder="searchPlaceholder">-->
              <!--<i class="zmdi zmdi-search search__helper" data-sa-action="search-close"></i>-->
            <!--</div>-->
          <!--</form>-->
        <!--</li>-->
        <li class="hidden-xs-down">
          <a href="#/email" data-sa-target=".themes"><i
            class="zmdi zmdi-dns"></i></a>
        </li>
        <li class="hidden-xs-down">
          <a href="" class="top-nav__themes" data-sa-action="aside-open" data-sa-target=".themes"><i
            class="zmdi zmdi-palette"></i></a>
        </li>
      </ul>

      <div class="clock hidden-md-down">
        <div class="time">
          <span class="time__hours"></span>
          <span class="time__min"></span>
          <span class="time__sec"></span>
        </div>
      </div>
    </header>
    <div class="themes indexColor">
      <div class="scrollbar-inner">
        <a href="" class="themes__item" data-sa-value="1"><img src="../static/img/bg/1.jpg" alt=""></a>
        <a href="" class="themes__item active" data-sa-value="2"><img src="../static/img/bg/2.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="3"><img src="../static/img/bg/3.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="4"><img src="../static/img/bg/4.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="5"><img src="../static/img/bg/5.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="6"><img src="../static/img/bg/6.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="7"><img src="../static/img/bg/7.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="8"><img src="../static/img/bg/8.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="9"><img src="../static/img/bg/9.jpg" alt=""></a>
        <a href="" class="themes__item" data-sa-value="10"><img src="../static/img/bg/10.jpg" alt=""></a>
      </div>
    </div>
    <!--<aside class="sidebar sidebar&#45;&#45;hidden sidebarColor">-->
      <!--<div class="scrollbar-inner">-->
        <!--<ul class="navigation">-->
          <!--<li class="@@indexactive&#45;&#45;active"><a href="#/"><i class="zmdi zmdi-home"></i> 主页</a></li>-->
          <!--<li class="@@indexactive"><a href="#/force"><i class="zmdi zmdi-home"></i>主机拓扑图</a></li>-->
          <!--<li class="@@indexactive"><a href="#/connect"><i class="zmdi zmdi-home"></i>流量分析面板</a></li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</aside>-->


    <section class="content content--full">
      <router-view></router-view>
    </section>
  </main>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    mounted() {
      $(window).on('load', function () {
        setTimeout(function () {
          $('.page-loader').fadeOut();
        }, 500);
      });

      /*------------------------------------------------
          Header
      -------------------------------------------------*/
      $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 20) {
          $('.header').addClass('header--scrolled');
        } else {
          $('.header').removeClass('header--scrolled');
        }
      });


      $(document).ready(function () {

        var $body = $('body');

        //Fullscreen Launch function
        function launchIntoFullscreen(element) {

          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }

        //Fullscreen exit function
        function exitFullscreen() {

          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }


        $body.on('click', '[data-sa-action]', function (e) {
          e.preventDefault();

          var $this = $(this);
          var action = $this.data('sa-action');
          var target = '';

          switch (action) {
            /*-------------------------------------------
                Search
            ---------------------------------------------*/
            // Open
            case 'search-open':
              $('.search').addClass('search--toggled');
              break;

            // Close
            case 'search-close':
              $('.search').removeClass('search--toggled');
              break;


            /*-------------------------------------------
                Aside
            ---------------------------------------------*/
            // Open
            case 'aside-open':
              target = $this.data('sa-target');
              $this.addClass('toggled');
              $('body').addClass('aside-toggled');
              $(target).addClass('toggled');
              $('.content, .header').append('<div class="sa-backdrop" data-sa-action="aside-close" data-sa-target=' + target + ' />');
              break;


            case 'aside-close':
              target = $this.data('sa-target');
              $('body').removeClass('aside-toggled');
              $('[data-sa-action="aside-open"], ' + target).removeClass('toggled');
              $('.content, .header').find('.sa-backdrop').remove();
              break;


            /*-------------------------------------------
                Full screen browse
            ---------------------------------------------*/
            case 'fullscreen':
              launchIntoFullscreen(document.documentElement);
              break;


            /*-------------------------------------------
                Print
            ---------------------------------------------*/
            case 'print':
              window.print();
              break;


            /*-------------------------------------------
                Login
            --------------------------------------------*/
            case 'login-switch':
              target = $this.data('sa-target');
              $('.login__block').removeClass('active');
              $(target).addClass('active');
              break;


            /*-------------------------------------------
                Notifications clear
            --------------------------------------------*/
            case 'notifications-clear':
              e.stopPropagation();

              var items = $('.top-nav__notifications .listview__item');
              var itemsCount = items.length;
              var index = 0;
              var delay = 150;

              $this.fadeOut();

              items.each(function () {
                var currentItem = $(this);
                setTimeout(function () {
                  currentItem.addClass('animated fadeOutRight');
                }, index += delay);
              });

              setTimeout(function () {
                items.remove();
                $('.top-nav__notifications').addClass('top-nav__notifications--cleared');
              }, itemsCount * 180);
              break;


            /*------------------------------------------------
                Toolbar search toggle
            -------------------------------------------------*/

            // Open
            case 'toolbar-search-open':
              $(this).closest('.toolbar').find('.toolbar__search').fadeIn(200);
              $(this).closest('.toolbar').find('.toolbar__search input').focus();
              break;

            // Close
            case 'toolbar-search-close':
              $(this).closest('.toolbar').find('.toolbar__search input').val('');
              $(this).closest('.toolbar').find('.toolbar__search').fadeOut(200);
              break;
          }
        });
        /*------------------------------------------------
            Clock
        -------------------------------------------------*/
        if ($('.clock')[0]) {
          var newDate = new Date();
          newDate.setDate(newDate.getDate());

          setInterval(function () {
            var seconds = new Date().getSeconds();
            $('.time__sec').html((seconds < 10 ? '0' : '') + seconds);
          }, 1000);

          setInterval(function () {
            var minutes = new Date().getMinutes();
            $('.time__min').html((minutes < 10 ? '0' : '') + minutes);
          }, 1000);

          setInterval(function () {
            var hours = new Date().getHours();
            $('.time__hours').html((hours < 10 ? '0' : '') + hours);
          }, 1000);
        }


        /*------------------------------------------------
            Theme Switch
        -------------------------------------------------*/
        $('body').on('click', '.themes__item', function (e) {
          e.preventDefault();

          // Set active item
          $('.themes__item').removeClass('active');
          $(this).addClass('active');

          // Set theme
          var theme = $(this).data('sa-value');
          $('body').attr('data-sa-theme', theme);
        });


        /*------------------------------------------------
            Search
        -------------------------------------------------*/

        // Active Stat
        $('body').on('focus', '.search__text', function () {
          $(this).closest('.search').addClass('search--focus');
        });

        // Clear
        $('body').on('blur', '.search__text', function () {
          $(this).val('');
          $(this).closest('.search').removeClass('search--focus');
        });


        /*------------------------------------------------
            Sidebar toggle menu
        -------------------------------------------------*/
        $('body').on('click', '.navigation__sub > a', function (e) {
          e.preventDefault();

          $(this).parent().toggleClass('navigation__sub--toggled');
          $(this).next('ul').slideToggle(250);
        });


        /*------------------------------------------------
            Form group bar
        -------------------------------------------------*/
        if ($('.form-group--float')[0]) {
          $('.form-group--float').each(function () {
            var p = $(this).find('.form-control').val()

            if (!p.length == 0) {
              $(this).find('.form-control').addClass('form-control--active');
            }
          });

          $('body').on('blur', '.form-group--float .form-control', function () {
            var i = $(this).val();

            if (i.length == 0) {
              $(this).removeClass('form-control--active');
            }
            else {
              $(this).addClass('form-control--active');
            }
          });
        }


        /*------------------------------------------------
            Stay active Dropdown menu
        -------------------------------------------------*/
        $('body').on('click', '.dropdown-menu--active', function (e) {
          e.stopPropagation();
        });
      });
      document.title = this.appTitle;
    },
    computed: {
      ...mapGetters(['showLoading', 'searchPlaceholder', 'appTitle', 'logoText'])
    },
    methods: {},
    data() {
      return {}
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    text-decoration: none;
    list-style: none;
  }

  .myCharts {
    width: 100%;
    height: 970px;
  }

  .search {
    padding-left: 2.2rem;
  }

  .search input {
    width: 300px;
  }

  .sidebarColor {
    background-color: rgba(0,0,0,0.7);
    margin-top: 5rem;
  }
  .indexColor{
    background-color: transparent;
  }
</style>
