 document.querySelectorAll('.card-swiper').forEach(function(el){
    new Swiper(el, {
      loop: true,
      speed: 600,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: el.querySelector('.swiper-pagination'), clickable: true }
    });
  });


   const lastMinSwiper = new Swiper('.lastmin-swiper', {
    slidesPerView: 'auto',        // ширина задається CSS — це і дає "peek" праворуч
    spaceBetween: 16,             // відстань між картками
    loop: false,
    speed: 600,
    navigation: {
      nextEl: '.lastmin-next',
      prevEl: '.lastmin-prev'
    },
    // щоб права картка виглядала за межі контейнера:
    // важливо, що .lastmin-swiper має overflow: visible (у CSS)
    breakpoints: {
      992: { spaceBetween: 18 },
      1400:{ spaceBetween: 20 }
    }
  });

    const tstmSwiper = new Swiper('.tstm-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    autoHeight: true,
    loop: false,
    speed: 600,
    pagination: { el: '.tstm-swiper .swiper-pagination', clickable: true },
    breakpoints: {
      992: { spaceBetween: 20 }
    }
  });



    const edgeSwiper = new Swiper('.edge-swiper', {
     slidesPerView: 2,
    spaceBetween: 18,
        // центрируем активный — соседи видны слева/справа
    loop: true,
    freeMode: { enabled: true, momentum: true },
    grabCursor: true,         // «рука» при перетаскивании
    mousewheel: { forceToAxis: true },
    // без навигации и пагинации
    breakpoints: {
      768: { spaceBetween: 22, slidesPerView: 3, centeredSlides: true, },
      992: { spaceBetween: 22,slidesPerView: 6, centeredSlides: true,  },
      1400:{ spaceBetween: 24,slidesPerView: 6, centeredSlides: true,  }
    }
  });



    const facilitiesSwiper = new Swiper('.facilities-swiper', {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: '.facilities-next',
      prevEl: '.facilities-prev',
    },
    breakpoints: {
      1200:{ slidesPerView: 7 }
    }
  });


   const localSwiper = new Swiper('.local-swiper', {

     slidesPerView: 1,    
    spaceBetween: 22,
    loop: false,
    speed: 600,
    navigation: {
      nextEl: '.local-next',
      prevEl: '.local-prev'
    },
    grabCursor: true,
     breakpoints: {
      768: { slidesPerView: 3,   },
    }
  });



    const mosaicSwiper = new Swiper('.mosaic-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: false,
    speed: 600,
    navigation: {
      nextEl: '.mosaic-next',
      prevEl: '.mosaic-prev',
    },
    // Можно включить перетаскивание мышью и колёсиком
    grabCursor: true,
    mousewheel: { forceToAxis: true },
    // на очень широких экранах оставляем аккуратные отступы
    breakpoints: {
      1400: { spaceBetween: 28 }
    }
  });

  document.querySelectorAll('.prop-gallery').forEach(function(el){
    new Swiper(el, {
      slidesPerView: 1,
      loop: true,
      speed: 500,
      pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev'),
      }
    });
  });


   const offerSwiper = new Swiper('.offer-swiper', {
    loop: true,
    speed: 700,

    pagination: { el: '.swiper-pagination', clickable: true },
  });


   document.addEventListener("DOMContentLoaded", function () {
    // Для круглых стрелок у категорий
    document.querySelectorAll(".faq-cat-arrow").forEach(function (arrow) {
      arrow.addEventListener("click", function () {
        const target = document.querySelector(arrow.getAttribute("data-bs-target"));
        if (target.classList.contains("show")) {
          arrow.classList.add("collapsed");
        } else {
          arrow.classList.remove("collapsed");
        }
      });
    });

    // Для стрелок у внутренних вопросов (›)
    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const icon = btn.querySelector(".faq-row-arrow");
        // Если открыт — повернем стрелку
        if (btn.getAttribute("aria-expanded") === "true") {
          icon.classList.remove("rotate");
        } else {
          icon.classList.add("rotate");
        }
      });
    });
  });
  
(function(){
  function updateEdgePad() {
    const cont = document.querySelector('.container'); // можно .container, что над секцией
    if (!cont) return;
    // (100vw - ширина контейнера)/2
    const pad = Math.max(16, (window.innerWidth - cont.clientWidth) / 2);
    document.documentElement.style.setProperty('--edge-pad', pad + 'px');
  }
  window.addEventListener('resize', updateEdgePad);
  updateEdgePad();
})();

(function () {
  const root  = document.querySelector('.hmc');
  if (!root) return;

  const track   = root.querySelector('.hmc-track');
  const btnPrev = root.querySelector('.hmc-prev');
  const btnNext = root.querySelector('.hmc-next');

  // ШВИДКОСТІ (узгоджені з CSS)
  const DUR = 1500;     // для translateX дорожки
  const FLIP_DUR = 1000; // для FLIP transform

  const items = () => Array.from(track.children);

  /* gap для точного шага */
  function getGap() {
    const cs = getComputedStyle(track);
    const g  = parseFloat(cs.columnGap || cs.gap || '0');
    return isNaN(g) ? 0 : g;
  }

  /* шаг = ширина первого (текущего левого) + gap */
  function firstStep() {
    const arr = items();
    if (!arr.length) return 0;
    const w = arr[0].getBoundingClientRect().width;
    return w + getGap();
  }

  /* роли/порядок:
     1-й -> big (order-1)
     2-й -> overlay (order-4)
     3-й -> tall (order-2)
     4-й -> small (order-3)
  */
  function applyRoles() {
    const arr = items();
    arr.forEach(el => {
      el.classList.remove(
        'hmc-item--big','hmc-item--tall','hmc-item--overlay',
        'hmc-order-1','hmc-order-2','hmc-order-3','hmc-order-4'
      );
      el.style.order = '';
    });

    if (arr[0]) arr[0].classList.add('hmc-item--big','hmc-order-1');
    if (arr[1]) arr[1].classList.add('hmc-item--overlay','hmc-order-4');
    if (arr[2]) arr[2].classList.add('hmc-item--tall','hmc-order-2');
    if (arr[3]) arr[3].classList.add('hmc-order-3');
    // остальные остаются с order:5 (в CSS)
  }

  /* ================= FLIP ================= */

  function snapshotRects(list) {
    const map = new Map();
    list.forEach(el => map.set(el, el.getBoundingClientRect()));
    return map;
  }

  /**
   * Плавная смена ролей.
   * options.noFlip: Set<Element> — элементы, для которых НЕ делаем FLIP (вообще без сдвига/масштаба)
   * options.noAnim: Set<Element> — элементы, у которых временно отключаем любые CSS-переходы
   */
function applyRolesWithFlip(preRects, options = {}) {
    const { noFlip = new Set(), noAnim = new Set() } = options;
    
    const els = items();

    const firstRects = preRects || snapshotRects(els);

    applyRoles();

    const toPlay = [];

    // тимчасово обмежуємо лише transform (fade лишається завдяки CSS)
    noAnim.forEach(el => el && el.classList.add('hmc-item--noanim'));

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => {
        const last  = el.getBoundingClientRect();
        const first = firstRects.get(el) || last;

        if (noFlip.has(el)) return;

        let dx, dy, sx = 1, sy = 1, origin = 'left top';

        if (el.classList.contains('hmc-item--big')) {
          const fcx = first.left + first.width  / 2;
          const fcy = first.top  + first.height / 2;
          const lcx = last.left  + last.width   / 2;
          const lcy = last.top   + last.height  / 2;
          dx = fcx - lcx; dy = fcy - lcy; origin = 'center center';
        } else {
          dx = first.left - last.left;
          dy = first.top  - last.top;
          sx = first.width  / last.width;
          sy = first.height / last.height;
        }

        el.style.transformOrigin = origin;
        el.style.willChange      = 'transform';
        el.style.transform       = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        toPlay.push(el);
      });

      requestAnimationFrame(() => {
        toPlay.forEach(el => {
          el.style.transition = `transform ${FLIP_DUR}ms ease`;
          el.style.transform  = '';
          el.addEventListener('transitionend', () => {
            el.style.transition      = '';
            el.style.willChange      = '';
            el.style.transformOrigin = '';
          }, { once: true });
        });
      });
    }

    if (noAnim.size) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noAnim.forEach(el => el && el.classList.remove('hmc-item--noanim'));
        });
      });
    }
  }

  function forceReflow(){ void track.offsetWidth; }

 function goNext() {
    const step = firstStep();
    if (!step) return;

    track.style.transition = `transform ${DUR}ms ease`;
    track.style.transform  = `translateX(${-step}px)`;

    track.addEventListener('transitionend', function handler() {
      track.removeEventListener('transitionend', handler);

      track.style.transition = 'none';
      const before = items();
      const pre = snapshotRects(before);

      const willBeBig = before[1];

      track.style.transform  = 'translateX(0)';
      track.appendChild(before[0]);

      applyRolesWithFlip(pre);

      void track.offsetWidth;
      track.style.transition = `transform ${DUR}ms ease`;
    }, { once:true });
  }

  function goPrev() {
    const pre = snapshotRects(items());

    const arr  = items();
    const last = arr[arr.length - 1];
    if (!last) return;

    track.style.transition = 'none';
    track.insertBefore(last, arr[0]);

    const willBeBig = items()[0];
    applyRolesWithFlip(pre, {
      noFlip: new Set([willBeBig]),
      noAnim: new Set([willBeBig])
    });

    const step = firstStep();
    track.style.transform = `translateX(${-step}px)`;
    void track.offsetWidth;

    track.style.transition = `transform ${DUR}ms ease`;
    track.style.transform  = 'translateX(0)';
  }

  btnNext.addEventListener('click', goNext);
  btnPrev.addEventListener('click', goPrev);

  /* =============== drag / swipe =============== */
  let dragging = false, startX = 0, deltaX = 0;

  function onDown(e){
    dragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX = 0;
    track.classList.add('is-dragging');
    track.style.transition = 'none';
  }
  function onMove(e){
    if(!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - startX;
    const limit = firstStep();
    deltaX = Math.max(-limit, Math.min(limit, dx));
    track.style.transform = `translateX(${deltaX}px)`;
  }
  function onUp(){
    if(!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');

    const limit = firstStep();
    const threshold = limit * 0.33;

    // свайп вправо: следующий (вперёд)
    if (deltaX <= -threshold) {
  track.style.transition = `transform ${DUR}ms ease`; 
  track.style.transform  = `translateX(${-limit}px)`;

      track.addEventListener('transitionend', function handler(){
        track.removeEventListener('transitionend', handler);

        track.style.transition = 'none';
        const before = items();
        const pre = snapshotRects(before);
        const willBeBig = before[1]; // новая "первая"

        track.style.transform  = 'translateX(0)';
        track.appendChild(before[0]);

        applyRolesWithFlip(pre, {
          noFlip: new Set([willBeBig]),
          noAnim: new Set([willBeBig])
        });

        forceReflow();
        track.style.transition = `transform ${DUR}ms ease`; ы
      }, { once:true });

    // свайп влево: предыдущий (назад)
   } else if (deltaX >= threshold) {
  const pre = snapshotRects(items());
  const arr  = items();
  const last = arr[arr.length - 1];

  track.style.transition = 'none';
  track.insertBefore(last, arr[0]);

  const willBeBig = items()[0];
  applyRolesWithFlip(pre, {
    noFlip: new Set([willBeBig]),
    noAnim: new Set([willBeBig])
  });

  const step = firstStep();
  track.style.transform = `translateX(${-step}px)`;
  forceReflow();

  track.style.transition = `transform ${DUR}ms ease`;                 // було 400ms
  track.style.transform  = 'translateX(0)';

} else {
  // відкат без зміни позиції
  track.style.transition = `transform ${DUR}ms ease`;                 // було 400ms
  track.style.transform  = 'translateX(0)';
}
  }

  track.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove, { passive:false });
  window.addEventListener('mouseup', onUp);

  track.addEventListener('touchstart', onDown, { passive:true });
  window.addEventListener('touchmove', onMove, { passive:false });
  window.addEventListener('touchend', onUp);

  /* старт — без анимации */
  applyRoles();
})();


(() => {
  const wrapList = document.getElementById('findListWrap');
  const wrapMap  = document.getElementById('findMapWrap');
  const btnOpen  = document.querySelector('.openMap');

  if(btnOpen) {
  let mapLoaded = false;         // чтобы подгружать карты один раз
  let gmap, infowindow;
  let markers = [];

  // ДАННЫЕ ДЛЯ МАРКЕРОВ (пример)
  const PARKS = [
    {
      id: 1,
      title: 'Brean Sands',
      address: 'Brean Sands, Somerset TA8 2RB',
      lat: 51.315, lng: -3.006,
      rating: 4.7,
      img: 'https://images.unsplash.com/photo-1540448051976-24bb68980d51?q=80&w=1600&auto=format&fit=crop',
      text: 'The place that has it all! Great choice of leisure including a theme park, located right on the coast with miles of sandy beaches.'
    },
    {
      id: 2,
      title: 'Golden Sands Holiday Park',
      address: 'Dawlish Warren, Devon EX7 0PS',
      lat: 50.601, lng: -3.445,
      rating: 4.6,
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      text: 'Family-friendly holiday park near the beach with lots of entertainment.'
    },
    {
      id: 3,
      title: 'Ladram Bay Holiday Park',
      address: 'Budleigh Salterton, Devon EX9 7BX',
      lat: 50.627, lng: -3.299,
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1517955623995-7dd0d8dc8f91?q=80&w=1600&auto=format&fit=crop',
      text: 'Stunning private beach. Boasting activities and sea sports and a host of facilities to suit all ages.'
    },
    {
      id: 4,
      title: 'Beverley Bay',
      address: 'Goodrington, Paignton TQ4',
      lat: 50.423, lng: -3.560,
      rating: 4.5,
      img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      text: 'Sea views, pools and a warm welcome for the whole family.'
    }
  ];

  // переключатель
  btnOpen.addEventListener('click', () => {
    const showingMap = !wrapMap.classList.contains('d-none');

    if (showingMap) {
      // вернуться к списку
      wrapMap.classList.add('d-none');
      wrapList.classList.remove('d-none');
      btnOpen.innerHTML = '<img src="/Newmans/img/location.png" alt="">  On the map';
    } else {
      // показать карту
      wrapList.classList.add('d-none');
      wrapMap.classList.remove('d-none');
      btnOpen.innerHTML = '<img src="/Newmans/img/grid.png" alt=""> List view';

      // инициализируем карты только один раз
      if (!mapLoaded) {
        loadGoogleMaps(initFindMap);
        mapLoaded = true;
      } else {
        // если карта уже была — на всякий случай триггерим resize
        setTimeout(() => google.maps.event.trigger(gmap, 'resize'), 100);
      }
    }
  });
 



  // Загрузка скрипта Google Maps
  function loadGoogleMaps(cb){
    const s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDJcq9UOVMoqKLMi2_I8yIwNcX2YAFKNiE&v=weekly&callback=__initFindMapCb';
    s.async = true; s.defer = true;
    window.__initFindMapCb = cb;
    document.head.appendChild(s);
  }

  // Инициализация карты
  function initFindMap(){
    gmap = new google.maps.Map(document.getElementById('findMap'), {
      center: { lat: 50.9, lng: -3.2 },   // Юго-Запад Англии
      zoom: 9,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    infowindow = new google.maps.InfoWindow({
      maxWidth: 520
    });

    // создаём маркеры
    markers = PARKS.map(p => {
      const marker = new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: gmap,
        title: p.title,
        icon: markerIcon(false)
      });

      marker.addListener('click', () => {
        // активируем/деактивируем иконки
        markers.forEach(m => m.setIcon(markerIcon(m === marker)));

        infowindow.setContent(makeInfoContent(p));
        infowindow.open(gmap, marker);
      });

      return marker;
    });

    // при клике по карте закрываем карточку и сбрасываем активный маркер
    gmap.addListener('click', () => {
      infowindow.close();
      markers.forEach(m => m.setIcon(markerIcon(false)));
    });
  }

  const PIN_W = 34;                // ширина пина в px
const PIN_H = 45;                // высота пина в px
const PIN_URL_DEFAULT = '/Newmans/img/pin-blue.png';   // обычный
const PIN_URL_ACTIVE  = '/Newmans/img/pin-gold.png';   // активный (по клику)

  // Простая SVG-иконка маркера: активная/обычная
function markerIcon(active = false){
  return {
    url: active ? PIN_URL_ACTIVE : PIN_URL_DEFAULT,
    scaledSize: new google.maps.Size(PIN_W, PIN_H),
    // "носик" пина должен указывать на координаты — обычно центр по X и низ по Y
    anchor: new google.maps.Point(PIN_W / 2, PIN_H - 2)
  };
}

  // HTML контент карточки (в InfoWindow)
  function makeInfoContent(p){
    return `
      <div class="map-iw">
        <img class="map-iw__img" src="${p.img}" alt="${p.title}">

        <div >
          <div class="find-card__head d-flex align-items-end gap-2 mb-2">
            <img src="/Newmans/img/location.png" alt=""> Budleigh Salterton, Devon EX9 7BX
          </div>
          <h3 class="h5 mb-2">${p.title}</h3>
          <p class="mb-3">
            ${p.text}
          </p>

          <div class="d-flex find-card__btn justify-content-between gap-2">
            <a href="/Newmans/park_facilities.html" class="btn">View Park</a>
            <a href="#" class="btn btn-dark">Last Minute Breaks</a>
          </div>
        </div>
      </div>`;
  }

   }

})();


 const findSwiper = new Swiper('.find-holiday', {
    // mobile-first: одна карточка по центру
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 16,
    speed: 500,
    pagination: { el: '.find-holiday .swiper-pagination', clickable: true },

    // на более широких экранах показываем больше карточек
    breakpoints: {
      576: { slidesPerView: 1.2, centeredSlides: true, spaceBetween: 18 },
      768: { slidesPerView: 2,   centeredSlides: false, spaceBetween: 20 },
      992: { slidesPerView: 3,   centeredSlides: false, spaceBetween: 22 }
    }
  });



   const btn   = document.getElementById('menuBtn');
  const modal = document.getElementById('mobileNav');

  // открыть/закрыть по кнопке: просто переключаем класс
  btn.addEventListener('click', () => {
    btn.classList.toggle('is-open');      // гамбургер ↔ крестик
    modal.classList.toggle('is-open');    // показать/скрыть панель
    document.body.classList.toggle('no-scroll'); // (необязательно) блок скролла
  });

  // закрыть кликом по фону, крестику или пункту меню
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modalMenu__overlay, .modalMenu__close, .modalMenu__list a')) {
      btn.classList.remove('is-open');
      modal.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
  });



  document.addEventListener('DOMContentLoaded', () => {
  const field = document.querySelector('.offer-field--date');
  if (!field) return;

  const native  = field.querySelector('.date-native');
  const display = field.querySelector('.date-display');

  // форматируем yyyy-mm-dd -> 24 Jun 2025 (поменяй локаль/формат под задачу)
  const fmt = v => {
    const d = new Date(v + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  };

  // при выборе даты — показать её в «красивом» инпуте
  native.addEventListener('change', () => {
    display.value = native.value ? fmt(native.value) : '';
  });

  // клик по красивому инпуту — открыть системный пикер (если поддерживается)
  display.addEventListener('click', () => {
    if (native.showPicker) native.showPicker(); else native.focus();
  });

  // на всякий случай — клик по всей обёртке тоже откроет пикер
  field.addEventListener('click', (e) => {
    if (e.target === field) {
      if (native.showPicker) native.showPicker(); else native.focus();
    }
  });
});