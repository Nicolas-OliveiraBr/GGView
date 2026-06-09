document.querySelectorAll('.swiper').forEach(element => {

  new Swiper(element, {

    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 10,
    freeMode: true,
    loop: true,
    speed: 600,
    loopAdditionalSlides: 6,

    navigation: {
      nextEl: element.querySelector('.swiper-button-next'),
      prevEl: element.querySelector('.swiper-button-prev'),
    },

    breakpoints: {
    
      480: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        freeMode: false 
      },
      
      768: {
        slidesPerView: 5,
        slidesPerGroup: 4,
        freeMode: false 
      },

      1024: {
        slidesPerView: 9,
        slidesPerGroup: 1,
        freeMode: false 
      },

      1400: {
        slidesPerView: 10,
        slidesPerGroup: 1,
        freeMode: false 
      }
    }

  });

});