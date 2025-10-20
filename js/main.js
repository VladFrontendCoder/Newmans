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
    slidesPerView: 3.5,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: '.facilities-next',
      prevEl: '.facilities-prev',
    },
    breakpoints: {
      768:{ slidesPerView: 4,     spaceBetween: 20, },
      1200:{ slidesPerView: 7 }
    }
  });


   const localSwiper = new Swiper('.local-swiper', {

     slidesPerView: 1,    
    spaceBetween: 22,
    loop: true,
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

if(btn) {
  btn.addEventListener('click', () => {
    btn.classList.toggle('is-open'); 
    modal.classList.toggle('is-open');
    document.body.classList.toggle('no-scroll');
  });

}


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

  const q = (sel) => form.querySelector(sel);
  const phone = q('#phone');

  if (phone) {
    const maxLen = 15;
    const digitsOnly = v => v.replace(/\D+/g, '');

    phone.addEventListener('input', () => {
      const clean = digitsOnly(phone.value).slice(0, maxLen);
      if (phone.value !== clean) phone.value = clean;
      if (phone.hasAttribute('required')) validateField(phone);
    });

    phone.addEventListener('keydown', (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const allowed =
        ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','Home','End'].includes(e.key) || ctrl;
      if (allowed) return;
      if (!/^\d$/.test(e.key)) e.preventDefault();
    });
  }


  const requiredControls = () =>
    Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));

  function mark(el, invalid) {
    el.classList.toggle('is-invalid', invalid);
    el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  }

  function validateField(el) {
    if (!el.hasAttribute('required')) return true; 

    let valid = true;

    if (el.tagName === 'SELECT') {

      valid = el.value.trim() !== '' && el.selectedIndex > 0;
    } else if (el.id === 'phone') {
      const digits = (el.value || '').replace(/\D+/g, '');
      valid = digits.length >= 7 && digits.length <= 15; 
    } else {
      valid = el.checkValidity() && (el.value || '').trim().length > 0;
    }

    mark(el, !valid);
    return valid;
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const controls = requiredControls();
    let firstInvalid = null;
    let allValid = true;

    controls.forEach(el => {
      if (!validateField(el)) {
        if (!firstInvalid) firstInvalid = el;
        allValid = false;
      }
    });

    if (!allValid) {
      firstInvalid?.focus();
      return;
    }

  
    form.reset();
    controls.forEach(el => mark(el, false));
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


document.addEventListener('DOMContentLoaded', function () {
  var step2 = document.getElementById('step-2');
  var step3 = document.getElementById('step-3');
  var step4 = document.getElementById('step-4');
  var step5 = document.getElementById('step-5');
  var step6 = document.getElementById('step-6');
  var stepsDots = document.querySelectorAll('.stepsbar__item');

  function updateStepsProgress(n) {
    stepsDots.forEach(function (el, idx) {
       el.classList.toggle('stepsbar__item--active', idx < (n - 1));
    });
  }

var mobBar = document.getElementById('stepsbar-mob');
var mobStepEl = document.getElementById('stepsbar-mob-step');
var mobTitleEl = document.getElementById('stepsbar-mob-title');

function updateMobileStepsBar(n) {
  if (!mobBar) { return; }
  var idx = n - 1;
  var item = stepsDots[idx];
  var title = '';
  if (item) {
    var t = item.querySelector('.stepsbar__txt');
    if (t) { title = t.textContent.trim(); }
  }
  if (mobStepEl) { mobStepEl.textContent = 'Step ' + n + ':'; }
  if (mobTitleEl) { mobTitleEl.textContent = title; }
}


function setStep(n) {
  if (step2) { step2.classList.remove('step--active'); }
  if (step3) { step3.classList.remove('step--active'); }
  if (step4) { step4.classList.remove('step--active'); }
  if (step5) { step5.classList.remove('step--active'); }
  if (step6) { step6.classList.remove('step--active'); }

  if (n === 2 && step2) { step2.classList.add('step--active'); }
  if (n === 3 && step3) { step3.classList.add('step--active'); }
  if (n === 4 && step4) { step4.classList.add('step--active'); }
  if (n === 5 && step5) { step5.classList.add('step--active'); }
  if (n === 6 && step6) { step6.classList.add('step--active'); }

updateStepsProgress(n);          // если используешь
  updateMobileStepsBar(n);         // ← ДОБАВИТЬ ЭТО

  if (n === 5) { syncPayment(); }
  if (n === 6) { syncConfirmation(); }
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

  document.querySelectorAll('[data-goto-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var s = parseInt(btn.getAttribute('data-goto-step'), 10);
      setStep(s);
    });
  });

  var tabButtons = document.querySelectorAll('.tabs__btn');
  var panels = document.querySelectorAll('.tabs__panel');

  function activatePanel(id) {
    tabButtons.forEach(function (b) {
      b.classList.remove('tabs__btn--active');
    });
    panels.forEach(function (p) {
      p.classList.remove('tabs__panel--active');
    });
    var btn = document.querySelector('.tabs__btn[data-panel="' + id + '"]');
    var panel = document.getElementById(id);
    if (btn) {
      btn.classList.add('tabs__btn--active');
    }
    if (panel) {
      panel.classList.add('tabs__panel--active');
    }
    document.querySelectorAll('.js-filters').forEach(function (f) {
      f.style.display = 'none';
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activatePanel(btn.getAttribute('data-panel'));
    });
  });

document.addEventListener('click', function (e) {
  var toggleBtn = e.target.closest('.js-filter-toggle');
  if (toggleBtn) {
    var panel = toggleBtn.closest('.tabs__panel');
    var filtersBox = panel ? panel.querySelector('.js-filters') : null;
    if (filtersBox) {
      filtersBox.style.display = (filtersBox.style.display === 'block') ? 'none' : 'block';
    }
    return;
  }

  var closeBtn = e.target.closest('.js-filters-close');
  if (closeBtn) {
    var f = closeBtn.closest('.js-filters');
    if (f) {
      f.style.display = 'none';
    }
  }
});

  document.querySelectorAll('.result__swiper').forEach(function (node) {
    new Swiper(node, {
      loop: false,
      pagination: {
        el: node.querySelector('.swiper-pagination'),
        clickable: true
      }
    });
  });

  var selects = document.querySelectorAll('.extra__select');
  var sumExtras = document.getElementById('sum-extras');
  var sumAccom = document.getElementById('sum-accom');
  var sumTotal = document.getElementById('sum-total');
  var sumToday = document.getElementById('sum-today');

  function parseMoney(text) {
    var t = String(text).replace('£', '').replace(',', '');
    return parseFloat(t);
  }

  function formatMoney(x) {
    return '£' + x.toFixed(2);
  }

  function recalc() {
    var extras = 0;
    selects.forEach(function (s) {
      var qty = parseInt(s.value, 10);
      var price = parseFloat(s.getAttribute('data-price'));
      if (!isNaN(qty) && !isNaN(price)) {
        extras += qty * price;
      }
    });
    var base = sumAccom ? parseMoney(sumAccom.textContent) : 0;
    var total = base + extras;
    var today = total * 0.51;
    if (sumExtras) {
      sumExtras.textContent = formatMoney(extras);
    }
    if (sumTotal) {
      sumTotal.textContent = formatMoney(total);
    }
    if (sumToday) {
      sumToday.textContent = formatMoney(today);
    }
  }

  selects.forEach(function (s) {
    s.addEventListener('change', recalc);
  });
});


document.addEventListener('DOMContentLoaded', function () {
  var MOBILE_BP = 768;

  function isMobile() {
    return window.innerWidth < MOBILE_BP;
  }

  // ---------- result__more: к info на мобиле / в media на десктопе ----------
  function relocateResultMore() {
    var mobile = isMobile();
    document.querySelectorAll('.result-grid').forEach(function (grid) {
      var media = grid.querySelector('.result__media');
      var info  = grid.querySelector('.result-grid__info');
      var more  = grid.querySelector('.result__more');
      if (!media || !info || !more) {
        return;
      }
      if (mobile) {
        if (more.previousElementSibling !== info) {
          info.insertAdjacentElement('afterend', more);
        }
      } else {
        if (more.parentElement !== media) {
          media.appendChild(more);
        }
      }
    });
  }

  // ---------- extra__qty: в конец body на мобиле / обратно в top на десктопе ----------
  function relocateExtraQty() {
    var mobile = isMobile();
    document.querySelectorAll('.extra').forEach(function (card) {
      var qty  = card.querySelector('.extra__qty');
      var body = card.querySelector('.extra__body');
      var top  = card.querySelector('.extra__top');
      if (!qty || !body) {
        return;
      }
      if (mobile) {
        if (qty.parentElement !== body) {
          body.appendChild(qty);
        }
      } else {
        if (top && qty.parentElement !== top) {
          top.appendChild(qty);
        }
      }
    });
  }

  // ---------- pagenav: после summary внутри ТЕКУЩЕГО step на мобиле / назад на десктопе ----------
  // создаём "якорь" перед каждым .pagenav, чтобы знать, куда его вернуть
  function ensureAnchorBefore(el) {
    if (!el._anchor) {
      var anchor = document.createElement('span');
      anchor.className = 'pagenav-anchor';
      anchor.style.display = 'none';
      el._anchor = anchor;
      if (el.parentNode) {
        el.parentNode.insertBefore(anchor, el);
      }
    }
    return el._anchor;
  }

  function relocatePageNav() {
    var mobile = isMobile();

    document.querySelectorAll('.step').forEach(function (step) {
      var summary = step.querySelector('.summary');
      if (!summary) {
        return;
      }

      step.querySelectorAll('.pagenav').forEach(function (nav) {
        // якорь на исходной позиции (один раз)
        ensureAnchorBefore(nav);

        if (mobile) {
          // перемещаем сразу после .summary в ЭТОМ step
          if (summary.nextElementSibling !== nav) {
            summary.insertAdjacentElement('afterend', nav);
          }
        } else {
          // возвращаем туда, где стоял изначально
          if (nav._anchor && nav._anchor.parentNode) {
            nav._anchor.parentNode.insertBefore(nav, nav._anchor);
          }
        }
      });
    });
  }

  function reflowMobileRelocations() {
    relocateResultMore();
    relocateExtraQty();
    relocatePageNav();
  }

  reflowMobileRelocations();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reflowMobileRelocations, 100);
  });

  // вызови это после динамической подгрузки карточек/шагов
  window.reflowMobileRelocations = reflowMobileRelocations;
});


// Attach smooth horizontal scroll to the arrow button
(function () {
  const list = document.querySelector('.section-nav-list');
  const btn  = document.querySelector('.section-nav-arrow');
  if (!list || !btn) return;

  // Compute step dynamically: ~80% of visible width, min 120px, max 360px
  const getStep = () => {
    const vw = list.clientWidth;
    return Math.max(120, Math.min(360, Math.round(vw * 0.8)));
  };

  // Click -> scroll right
  btn.addEventListener('click', () => {
    list.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  // Optional: long-press for continuous scroll (mobile-friendly)
  let pressTimer;
  const startPress = () => {
    pressTimer = setInterval(() => {
      list.scrollBy({ left: 40, behavior: 'smooth' }); // small repeated nudges
    }, 120);
  };
  const endPress = () => clearInterval(pressTimer);

  btn.addEventListener('mousedown', startPress);
  btn.addEventListener('touchstart', startPress, { passive: true });
  ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt =>
    btn.addEventListener(evt, endPress)
  );
})();