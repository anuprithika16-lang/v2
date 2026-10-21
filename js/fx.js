/* BizHopers - premium motion & depth layer (no libraries).
   Adds: hero entrance, 3D parallax scene, scroll reveal, card tilt, scroll progress.
   The site is fully usable if this file fails to load. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('fx');

  /* ---------- Scroll progress + sticky header state ---------- */
  var bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var header = document.querySelector('.site-header');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero headline: split into words for the entrance ---------- */
  var h1 = document.querySelector('.hero h1');
  if (h1 && !reduce) {
    var text = h1.textContent.trim();
    h1.setAttribute('aria-label', text);
    h1.innerHTML = text.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  }
  document.querySelectorAll('.page-banner .container > *').forEach(function (el, i) {
    el.style.setProperty('--i', i);
  });

  // Start the entrance once fonts and the hero image are ready (max 900ms wait).
  var started = false;
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(function () { root.classList.add('is-ready'); });
  }
  var heroImg = document.querySelector('.hero-media img');
  var waits = [];
  if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
  if (heroImg && !heroImg.complete) {
    waits.push(new Promise(function (r) { heroImg.addEventListener('load', r); heroImg.addEventListener('error', r); }));
  }
  Promise.all(waits).then(start, start);
  setTimeout(start, 900);

  if (reduce) return; // everything below is motion

  /* ---------- Scroll reveal ---------- */
  var groups = [
    '.section-head', '.split-media', '.split > div:not(.split-media)',
    '.grid > *', '.benefits > *', '.quick li', '.contact-layout > *', '.footer-grid > *'
  ];
  var revealEls = [];
  groups.forEach(function (sel) {
    document.querySelectorAll('main ' + sel + (sel.indexOf('footer') > -1 ? ', ' + sel : '')).forEach(function (el) {
      if (el.closest('.hero') || el.closest('.quick') || revealEls.indexOf(el) > -1) return;
      revealEls.push(el);
    });
  });
  document.querySelectorAll('.footer-grid > *').forEach(function (el) { if (revealEls.indexOf(el) < 0) revealEls.push(el); });

  revealEls.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return revealEls.indexOf(c) > -1; });
    var idx = siblings.indexOf(el);
    el.setAttribute('data-reveal', el.matches('.split-media') ? 'img' : '');
    el.style.setProperty('--i', Math.min(idx, 5));
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  if (!finePointer) return; // touch devices: no pointer-driven 3D

  /* ---------- Card tilt with light sheen ---------- */
  var tiltSel = '.card, .feature, .split-media';
  document.querySelectorAll('main ' + tiltSel).forEach(function (el) {
    el.classList.add('tilt');
    var raf = 0, max = el.matches('.split-media') ? 5 : 7;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.classList.add('is-tilting');
        el.style.setProperty('--ry', ((x - .5) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((.5 - y) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
    });
    el.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });

  /* ---------- Hero 3D scene follows the pointer ---------- */
  var hero = document.querySelector('.hero');
  var scene = document.querySelector('[data-scene]');
  if (hero && scene) {
    var sraf = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width - .5) * 2;
      var py = ((e.clientY - r.top) / r.height - .5) * 2;
      cancelAnimationFrame(sraf);
      sraf = requestAnimationFrame(function () {
        scene.style.setProperty('--px', px.toFixed(3));
        scene.style.setProperty('--py', py.toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', function () {
      scene.style.setProperty('--px', 0);
      scene.style.setProperty('--py', 0);
    });
  }

  /* ---------- Magnetic primary buttons ---------- */
  document.querySelectorAll('main .btn--primary, .cta .btn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = 'translate(' + (dx * 8).toFixed(1) + 'px,' + (dy * 6 - 2).toFixed(1) + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });
})();
