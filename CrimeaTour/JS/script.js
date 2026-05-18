document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.board_row_slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.slider_track');
    let slides = slider.querySelectorAll('.slider_slide');
    const btnPrev = slider.querySelector('.btn_prev');
    const btnNext = slider.querySelector('.btn_next');
    
    // Если слайдов нет или он всего один — крутить нечего
    if (!track || slides.length <= 1) return;

    // 1. Создаем клоны первого и последнего слайдов для бесшовного круга
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    // 2. Закидываем клоны в начало и в конец ленты
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    // Обновляем список слайдов, теперь их стало на 2 больше
    slides = slider.querySelectorAll('.slider_slide');
    
    // Начинаем с индекса 1, потому что индекс 0 теперь — это левый клон
    let currentIndex = 1;
    let isTransitioning = false; // Защита от бешеных кликов
    let autoPlayInterval;

    // Изначально смещаем трек на первый настоящий слайд без анимации
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Функция листания вперед
    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      updateSlider();
    };

    // Функция листания назад
    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      updateSlider();
    };

    // 3. Главная магия: следим, когда анимация перемещения РЕАЛЬНО ЗАКОНЧИЛАСЬ
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      
      // Если долетели до правого клона (копия первой картинки)
      if (currentIndex === slides.length - 1) {
        track.style.transition = 'none'; // Вырубаем анимацию
        currentIndex = 1;                // Мгновенно прыгаем на настоящий 1-й слайд
        updateSlider();
      }
      
      // Если долетели до левого клона (копия последней картинки)
      if (currentIndex === 0) {
        track.style.transition = 'none'; // Вырубаем анимацию
        currentIndex = slides.length - 2; // Мгновенно прыгаем на настоящий последний слайд
        updateSlider();
      }
    });

    // Автопрокрутка 10 секунд
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 10000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Запускаем таймер
    startAutoPlay();
  });
});