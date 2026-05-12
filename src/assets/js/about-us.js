// Template Name: QuickFrame - Admin & Dashboard Template
// Author: SRBThemes
// Version: 1.0.0



import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
//about swiper
var swiper = new Swiper('.teamSwiper', {
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
  },
  // Optional parameters
  breakpoints: {
    // when window width is >= 320px
    557: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    // when window width is >= 480px
    1024: {
      slidesPerView: 4,
      spaceBetween: 40
    },
  }
});
//
var swiper = new Swiper(".testSwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

