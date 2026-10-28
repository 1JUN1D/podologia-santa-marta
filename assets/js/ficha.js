/* Pedi-Spa · ficha podológica: calculadora por canal, escenario por sección, hoja móvil y entradas */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '573155832882';
  function fmt(n) { return '$' + n.toLocaleString('es-CO').replace(/,/g, '.'); }
  function track() { try { if (window.gtag) gtag('event', 'conversion', { send_to: 'AW-18542513130/Tz7qCPmIgK0dEOqX4YlF' }); } catch (e) {} }

  /* --- calculadora por canal --- */
  var form = document.getElementById('calc');
  var diagram = document.querySelector('.diagram');
  if (form && diagram) {
    var out = document.getElementById('calc-total');
    var wa = document.getElementById('calc-wa');
    var hits = diagram.querySelectorAll('.canal-hit');
    var on = { l: true, r: false };
    function count() { return (on.l ? 1 : 0) + (on.r ? 1 : 0); }
    function paint() {
      ['l', 'r'].forEach(function (k) {
        var p = diagram.querySelector('.canal[data-canal="' + k + '"]');
        if (p) p.classList.toggle('is-on', on[k]);
      });
      hits.forEach(function (b) { b.setAttribute('aria-pressed', on[b.dataset.canal] ? 'true' : 'false'); });
      var proc = form.querySelector('input[name="proc"]:checked');
      var n = count();
      var total = Number(proc.dataset.precio) * n;
      out.textContent = fmt(total);
      var msg = 'Hola, quiero agendar ' + proc.dataset.nombre + ' de ' + n + (n === 1 ? ' canal' : ' canales') + ' (' + fmt(total) + ') en Pedi-Spa';
      wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'canales') {
        var n = Number(e.target.value);
        if (n === 2) { on.l = true; on.r = true; } else if (count() === 2) { on.r = false; on.l = true; }
      }
      paint();
    });
    hits.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.canal;
        if (on[k] && count() === 1) return;
        on[k] = !on[k];
        var r = form.querySelector('input[name="canales"][value="' + count() + '"]');
        if (r) r.checked = true;
        diagram.dataset.state = 'canales';
        paint();
      });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    wa.addEventListener('click', track);
    paint();
  }

  /* --- el escenario cambia con la sección que se lee --- */
  if (diagram && 'IntersectionObserver' in window) {
    var marks = document.querySelectorAll('[data-stage]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) diagram.dataset.state = en.target.getAttribute('data-stage');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    marks.forEach(function (m) { io.observe(m); });
  }

  /* --- hoja móvil --- */
  var stage = document.querySelector('.stage');
  var toggle = document.querySelector('.nav__calc');
  var openers = document.querySelectorAll('.nav__calc, .ficha-peek');
  if (stage && toggle) {
    var opener = toggle;
    function setOpen(v) {
      stage.classList.toggle('is-open', v);
      openers.forEach(function (b) { b.setAttribute('aria-expanded', v ? 'true' : 'false'); });
      toggle.textContent = v ? 'Cerrar' : 'Calcular';
      if (v) { var f = stage.querySelector('input,button,a'); if (f) f.focus({ preventScroll: true }); }
    }
    openers.forEach(function (b) {
      b.addEventListener('click', function () { opener = b; setOpen(!stage.classList.contains('is-open')); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && stage.classList.contains('is-open')) { setOpen(false); (opener.offsetParent ? opener : toggle).focus(); } });
  }
  document.querySelectorAll('.nav__wa, .stage a[href*="wa.me"], a.ficha-peek').forEach(function (a) { if (a.id !== 'calc-wa') a.addEventListener('click', track); });

  /* --- entradas por sección, en orden de lectura --- */
  var groups = document.querySelectorAll('.read > section, .read > div');
  if (!reduce && 'IntersectionObserver' in window) {
    var sel = '.section-header > *, .shead > *, .hero__left > *, .hero__text > *, .hero > *:not(.hero__left):not(.hero__text), .stats__item, .stat-item, .service-pill, .price-card, .feature-card, .benefit-item, .faq-item, .testimonial-card > *, .cobertura-card > *, .map-info > *, .domicilio-card > div > *, .cta-band .container > *, .vp-card, .step, .split__visual, .svc, .why__card, .map__frame, .map__addr, .compare-table';
    groups.forEach(function (g) {
      var items = g.querySelectorAll(sel);
      items = Array.prototype.filter.call(items, function (el) { return !(el.matches('h1') || el.querySelector('h1')); });
      items.forEach(function (el, i) { el.setAttribute('data-rise', ''); el.style.setProperty('--d', Math.min(i, 8) * 75 + 'ms'); });
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    document.querySelectorAll('[data-rise]').forEach(function (el) { ro.observe(el); });
    setTimeout(function () { document.querySelectorAll('[data-rise]:not(.in)').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); }); }, 1200);
  }

  /* --- fotos que se asientan al entrar (no se ocultan nunca) --- */
  if (!reduce && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('settled'); so.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.band, .split__visual').forEach(function (el) { so.observe(el); });
  }

  /* --- video: quieto con movimiento reducido o pestaña oculta --- */
  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    if (v.closest('.hero__media') && window.matchMedia('(min-width: 768px)').matches) { v.removeAttribute('autoplay'); v.preload = 'none'; v.pause(); return; }
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) v.pause(); else if (!reduce) v.play().catch(function () {}); });
  });
})();
