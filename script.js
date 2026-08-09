document.addEventListener('DOMContentLoaded', () => {

  const loader = document.getElementById('loader');

  if(loader){
    /* ---------- LOADER TIRAI "SELAMAT DATANG" (khusus Beranda) ---------- */
    const loaderBar = document.getElementById('loader-progress-bar');
    const loaderPercent = document.getElementById('loader-percent');
    const LOADER_DURATION = 1000;

    let loaderDone = false;
    let loaderTimer = null;

    function finishLoader(){
      if(loaderDone) return;
      loaderDone = true;
      clearInterval(loaderTimer);
      if(loaderBar) loaderBar.style.width = '100%';
      if(loaderPercent) loaderPercent.textContent = '100%';
      loader.classList.add('open');
      setTimeout(() => loader.classList.add('hide'), 1750);
      setTimeout(() => document.body.classList.remove('no-scroll'), 900);
    }

    const startTime = performance.now();
    loaderTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / LOADER_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const pct = Math.round(eased * 100);
      if(loaderBar) loaderBar.style.width = pct + '%';
      if(loaderPercent) loaderPercent.textContent = pct + '%';
      if(progress >= 1) finishLoader();
    }, 40);

    // fallback: tetap sembunyikan meski 'load' lambat
    window.addEventListener('load', () => setTimeout(finishLoader, LOADER_DURATION));
    setTimeout(finishLoader, LOADER_DURATION + 500);
  } else if(document.body.classList.contains('page-enter')){
    /* ---------- FADE-IN SEDERHANA (halaman selain Beranda) ---------- */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('page-enter-active');
      });
    });
  }


  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }

  /* ---------- NAV: shrink on scroll + active link ---------- */
  const nav = document.getElementById('site-nav');
  const backToTop = document.getElementById('back-to-top');
  function onScroll(){
    updateProgress();
    if(window.scrollY > 60){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    if(window.scrollY > 500){ backToTop.classList.add('show'); } else { backToTop.classList.remove('show'); }
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    burger.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  }));

  /* ---------- HERO SLIDESHOW (gambar lokal dari folder images/) ---------- */
  const HERO_IMAGES = [
    'bcg1.jpeg',
    'bcg2.jpeg',
    'bcg3.jpeg'
  ]; 

  const heroSlidesWrap = document.getElementById('hero-slides');

  if(heroSlidesWrap){
    // Bangun slide sesuai jumlah gambar
    const slides = [];
    HERO_IMAGES.forEach((img, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      slide.style.backgroundImage = "url('" + img + "')";
      heroSlidesWrap.appendChild(slide);
      slides.push(slide);
    });

    let heroIndex = 0;
    function showHeroSlide(i){
      slides.forEach(s => s.classList.remove('is-active'));
      slides[i].classList.add('is-active');
      heroIndex = i;
    }
    setInterval(() => showHeroSlide((heroIndex + 1) % slides.length), 5500);
  }

  /* ---------- HERO TYPING SUBTITLE ---------- */
  const typeEl = document.querySelector('.hero-sub');
  if(typeEl){
    let phrases = [];
    try{ phrases = JSON.parse(typeEl.dataset.typing); }catch(e){ phrases = []; }
    let pIndex = 0, cIndex = 0, deleting = false;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '|';

    function typeLoop(){
      if(!phrases.length) return;
      const current = phrases[pIndex];
      if(!deleting){
        cIndex++;
        if(cIndex > current.length){ deleting = true; setTimeout(typeLoop, 1800); return; }
      } else {
        cIndex--;
        if(cIndex === 0){ deleting = false; pIndex = (pIndex + 1) % phrases.length; }
      }
      typeEl.textContent = current.slice(0, cIndex);
      typeEl.appendChild(cursor);
      setTimeout(typeLoop, deleting ? 28 : 42);
    }
    typeLoop();
  }

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseInt(el.dataset.counter, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if(progress < 1){ requestAnimationFrame(tick); } else { el.textContent = target; }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- DESTINATION CAROUSEL ---------- */
  const destTrack = document.getElementById('dest-track');
  const destViewport = document.getElementById('dest-viewport');
  const destPrev = document.getElementById('dest-prev');
  const destNext = document.getElementById('dest-next');
  if(destTrack){
    function cardStep(){
      const card = destTrack.querySelector('.dest-card');
      const gap = 24;
      return card.getBoundingClientRect().width + gap;
    }
    destNext.addEventListener('click', () => {
      destViewport.scrollBy ? null : null;
      scrollCarousel(1);
    });
    destPrev.addEventListener('click', () => scrollCarousel(-1));
    let destOffset = 0;
    function scrollCarousel(dir){
      const step = cardStep();
      const maxOffset = -(destTrack.scrollWidth - destViewport.clientWidth);
      destOffset = Math.min(0, Math.max(maxOffset, destOffset - dir * step));
      destTrack.style.transform = `translateX(${destOffset}px)`;
    }
  }

/* ---------- VIDEO MODAL ---------- */
  const videoModal = document.getElementById('video-modal');
  const videoBox = videoModal.querySelector('.video-box');
  const videoClose = videoModal.querySelector('.video-close');
  document.querySelectorAll('.video-frame, .play-btn, [data-video]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const frame = trigger.closest('.video-frame');
      const src = (frame && frame.dataset.video) || trigger.dataset.video;
      if(!src) return;
      // Ubah format URL menjadi embed agar bisa dimuat di iframe
      const embedUrl = toEmbedUrl(src);
      const watchUrl = toWatchUrl(src);
      videoBox.innerHTML = `
        <iframe src="${embedUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>
        <a class="video-fallback" href="${watchUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-up-right-from-square"></i> Buka di YouTube</a>
      `;
      videoModal.classList.add('open');
    });
  });

  // Konversi berbagai format URL YouTube menjadi URL embed yang valid.
  // NOTE: autoplay TIDAK dipaksa di sini karena banyak browser memblokir
  // autoplay bersuara hingga pengguna berinteraksi — ini yang membuat video
  // tampak "stuck/loading". Pemain YouTube tetap muncul dan tinggal ditekan play.
  function toEmbedUrl(url){
    let id = null;
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if(m) id = m[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  function toWatchUrl(url){
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/watch?v=${m[1]}` : url;
  }
  videoClose.addEventListener('click', closeVideo);
  videoModal.addEventListener('click', (e) => { if(e.target === videoModal) closeVideo(); });
  function closeVideo(){
    videoModal.classList.remove('open');
    videoBox.innerHTML = '';
  }

  /* ---------- SMOOTH ANCHOR OFFSET (untuk sticky nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior:'smooth' });
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

});
