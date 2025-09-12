 document.querySelectorAll('.card-swiper').forEach(function(el){
    new Swiper(el, {
      loop: true,
      speed: 600,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: el.querySelector('.swiper-pagination'), clickable: true }
    });
  });


   const lastMinSwiper = new Swiper('.lastmin-swiper', {
    slidesPerView: 'auto',       
    spaceBetween: 16,           
    loop: false,
    speed: 600,
    navigation: {
      nextEl: '.lastmin-next',
      prevEl: '.lastmin-prev'
    },

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

    loop: true,
    freeMode: { enabled: true, momentum: true },
    grabCursor: true,         
    mousewheel: { forceToAxis: true },

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
  
    grabCursor: true,
    mousewheel: { forceToAxis: true },
  
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


    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const icon = btn.querySelector(".faq-row-arrow");
        
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
    const cont = document.querySelector('.container');
    if (!cont) return;
 
    const pad = Math.max(16, (window.innerWidth - cont.clientWidth) / 2);
    document.documentElement.style.setProperty('--edge-pad', pad + 'px');
  }
  window.addEventListener('resize', updateEdgePad);
  updateEdgePad();
})();

(function () {
  const root = document.querySelector('.hmc');
  if (!root) return;

  const viewport = root.querySelector('.hmc-viewport');
  const track    = root.querySelector('.hmc-track');
  const btnPrev  = root.querySelector('.hmc-prev');
  const btnNext  = root.querySelector('.hmc-next');

  const SPECIAL = [
    'hmc-item--big','hmc-item--tall','hmc-item--overlay',
    'hmc-order-1','hmc-order-2','hmc-order-3','hmc-order-4','hmc-item--noanim'
  ];

  let flattened = false;
  let busy = false;

  const items = () => Array.from(track.children);

  // без згладжування: просто зняти класи один раз
  function stripOnce() {
    if (flattened) return;
    flattened = true;
    items().forEach(el => SPECIAL.forEach(c => el.classList.remove(c)));
    root.classList.add('hmc--flat');
  }

  function gap() {
    const cs = getComputedStyle(track);
    return parseFloat(cs.gap || cs.columnGap || '0') || 0;
  }
  function step() {
    const first = track.querySelector('.hmc-item');
    return first ? first.getBoundingClientRect().width + gap() : 0;
  }

  function waitForScroll(targetLeft, timeout = 900) {
    return new Promise(resolve => {
      const start = performance.now();
      (function tick(now) {
        if (Math.abs(viewport.scrollLeft - targetLeft) < 1 || (now - start) > timeout) resolve();
        else requestAnimationFrame(tick);
      })(start);
    });
  }

  // NEXT: fade-out першої, скрол, перестановка, компенсація
  async function goNext() {
    if (busy) return;
    busy = true;

    if (!flattened) stripOnce();

    const s = step();
    if (!s) { busy = false; return; }

    const first = track.firstElementChild;
    if (first) {
      first.classList.add('hmc-fade');
      first.style.opacity = '0';
    }

    const target = viewport.scrollLeft + s;
    viewport.scrollBy({ left: s, behavior: 'smooth' });
    await waitForScroll(target);

    if (first) {
      track.appendChild(first);
      viewport.scrollLeft -= s;
      first.classList.remove('hmc-fade');
      first.style.opacity = '';
    }

    busy = false;
  }

  // PREV: переставляємо останній уперед з opacity:0, компенсуємо scrollLeft, скролимо назад і проявляємо
  async function goPrev() {
    if (busy) return;
    busy = true;

    if (!flattened) stripOnce();

    const s = step();
    if (!s) { busy = false; return; }

    const last = track.lastElementChild;
    if (last) {
      last.classList.add('hmc-fade');
      last.style.opacity = '0';
      track.insertBefore(last, track.firstElementChild);
      viewport.scrollLeft += s;
    }

    const target = viewport.scrollLeft - s;
    viewport.scrollBy({ left: -s, behavior: 'smooth' });
    requestAnimationFrame(() => { if (last) last.style.opacity = '1'; });

    await waitForScroll(target);

    if (last) {
      last.classList.remove('hmc-fade');
      last.style.opacity = '';
    }

    busy = false;
  }

  btnNext?.addEventListener('click', goNext);
  btnPrev?.addEventListener('click', goPrev);
})();


(() => {
  const wrapList = document.getElementById('findListWrap');
  const wrapMap  = document.getElementById('findMapWrap');
  const btnOpen  = document.querySelector('.openMap');

  if(btnOpen) {
  let mapLoaded = false;        
  let gmap, infowindow;
  let markers = [];


  const PARKS = [
    {
      id: 1,
      title: 'Brean Sands',
      address: 'Brean Sands, Somerset TA8 2RB',
      lat: 51.315, lng: -3.006,
      rating: 4.7,
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
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
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      text: 'Stunning private beach. Boasting activities and sea sports and a host of facilities to suit all ages.'
    },
    {
      id: 4,
      title: 'Beverley Bay',
      address: 'Goodrington, Paignton TQ4',
      lat: 50.423, lng: -3.560,
      rating: 4.5,
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      text: 'Sea views, pools and a warm welcome for the whole family.'
    }
  ];


  btnOpen.addEventListener('click', () => {
    const showingMap = !wrapMap.classList.contains('d-none');

    if (showingMap) {

      wrapMap.classList.add('d-none');
      wrapList.classList.remove('d-none');
      btnOpen.innerHTML = '<img src="/Newmans/img/location.png" alt="">  On the map';
    } else {

      wrapList.classList.add('d-none');
      wrapMap.classList.remove('d-none');
      btnOpen.innerHTML = '<img src="/Newmans/img/grid.png" alt=""> List view';

      if (!mapLoaded) {
        loadGoogleMaps(initFindMap);
        mapLoaded = true;
      } else {
        setTimeout(() => google.maps.event.trigger(gmap, 'resize'), 100);
      }
    }
  });
 

  function loadGoogleMaps(cb){
    const s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDJcq9UOVMoqKLMi2_I8yIwNcX2YAFKNiE&v=weekly&callback=__initFindMapCb';
    s.async = true; s.defer = true;
    window.__initFindMapCb = cb;
    document.head.appendChild(s);
  }

  function initFindMap(){
    gmap = new google.maps.Map(document.getElementById('findMap'), {
      center: { lat: 50.9, lng: -3.2 }, 
      zoom: 9,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    infowindow = new google.maps.InfoWindow({
      maxWidth: 520
    });

    markers = PARKS.map(p => {
      const marker = new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: gmap,
        title: p.title,
        icon: markerIcon(false)
      });

      marker.addListener('click', () => {
        markers.forEach(m => m.setIcon(markerIcon(m === marker)));

        infowindow.setContent(makeInfoContent(p));
        infowindow.open(gmap, marker);
      });

      return marker;
    });

    gmap.addListener('click', () => {
      infowindow.close();
      markers.forEach(m => m.setIcon(markerIcon(false)));
    });
  }

  const PIN_W = 34;  
const PIN_H = 45;
const PIN_URL_DEFAULT = '/Newmans/img/pin-blue.png';
const PIN_URL_ACTIVE  = '/Newmans/img/pin-gold.png';

function markerIcon(active = false){
  return {
    url: active ? PIN_URL_ACTIVE : PIN_URL_DEFAULT,
    scaledSize: new google.maps.Size(PIN_W, PIN_H),
    anchor: new google.maps.Point(PIN_W / 2, PIN_H - 2)
  };
}


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
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 16,
    speed: 500,
    pagination: { el: '.find-holiday .swiper-pagination', clickable: true },

    breakpoints: {
      576: { slidesPerView: 1.2, centeredSlides: true, spaceBetween: 18 },
      768: { slidesPerView: 2,   centeredSlides: false, spaceBetween: 20 },
      992: { slidesPerView: 3,   centeredSlides: false, spaceBetween: 22 }
    }
  });



   const btn   = document.getElementById('menuBtn');
  const modal = document.getElementById('mobileNav');


  btn.addEventListener('click', () => {
    btn.classList.toggle('is-open'); 
    modal.classList.toggle('is-open');
    document.body.classList.toggle('no-scroll');
  });


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


  const fmt = v => {
    const d = new Date(v + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  };


  native.addEventListener('change', () => {
    display.value = native.value ? fmt(native.value) : '';
  });

native.addEventListener('click', () => {
  if (native.showPicker) native.showPicker(); else native.click();
});

field.addEventListener('click', (e) => {
  if (e.target === field) {
    if (native.showPicker) native.showPicker(); else native.click();
  }
});
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.enquiry-form');
  if (!form) return;


  form.setAttribute('novalidate', '');


  const requiredControls = () =>
    Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));


  function validateField(el){
    let valid;
    if (el.tagName === 'SELECT') {
      valid = el.value.trim() !== '';
    } else {
      valid = el.checkValidity();
    }
    el.classList.toggle('is-invalid', !valid);
    el.setAttribute('aria-invalid', valid ? 'false' : 'true');
    return valid;
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const controls = requiredControls();
    let firstInvalid = null;
    let allValid = true;

    controls.forEach(el => {
      const ok = validateField(el);
      if (!ok && !firstInvalid) firstInvalid = el;
      allValid = allValid && ok;
    });

    if (!allValid) {
      firstInvalid?.focus();
      return;
    }

    form.reset();
    controls.forEach(el => el.classList.remove('is-invalid'));
    alert('✅ Form is valid (demo).');
  });

  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.matches('input[required], textarea[required]')) validateField(el);
  });
  form.addEventListener('change', (e) => {
    const el = e.target;
    if (el.matches('select[required]')) validateField(el);
  });
});