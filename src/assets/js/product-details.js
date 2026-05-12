// Template Name: QuickFrame - Admin & Dashboard Template
// Author: SRBThemes
// Version: 1.0.0



import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

const galleryThumbs = new Swiper('.gallery-thumbs', {
    spaceBetween: 10,
    direction: 'vertical',
    slidesPerView: 3,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
});

const gallerySlider = new Swiper('.gallery-slider', {
    spaceBetween: 10,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    thumbs: {
        swiper: galleryThumbs,
    },
});