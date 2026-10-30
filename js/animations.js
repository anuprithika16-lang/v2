/* Aarthi Travels — hero slider, scroll reveal, subtle card tilt.
   Motion is reduced (cross-fade only) when the visitor prefers reduced motion.
   Everything here is progressive enhancement: if this file fails, content stays visible
   (the page <head> removes the `js` class after 4s unless window.__aarthiAnim is set). */
(function () {
  'use strict';
  window.__aarthiAnim = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Hero slider ----------
     Cross-fade + subtle Ken Burns zoom. The incoming slide is decoded, then faded in (.is-active)
     while the outgoing slide (.is-leaving) stays opaque underneath, so there is never a blank or
     flickering frame. The destination text panel is re-animated in step with each change. */
  var SLIDE_MS = 5500;      // autoplay interval
  var TRANSITION_MS = 1100; // must match --fade-ms in style.css

  function initSlider() {
    var root = document.querySelector('[data-hero-slider]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-bg-slide'));
    var caption = root.querySelector('.slide-caption');
    var copy = root.querySelector('.hero-copy');
    var n = slides.length;
    if (!n) return;

    var idx = 0, timer = null, busy = false, queued = null;
    var touchHold = false, focusHold = false;

    slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true'); });

    function setCaption(animate) {
      if (animate && copy) { copy.classList.remove('swap'); void copy.offsetWidth; copy.classList.add('swap'); }
      if (!caption) return;
      var s = slides[idx];
      caption.textContent = '';
      var t = document.createElement('strong'); t.className = 'cap-title'; t.textContent = s.getAttribute('data-title') || '';
      var x = document.createElement('span'); x.className = 'cap-text'; x.textContent = s.getAttribute('data-text') || '';
      caption.appendChild(t); caption.appendChild(x);
    }
    function isPaused() { return touchHold || focusHold || document.hidden; }
    function stopTimer() { if (timer) { clearTimeout(timer); timer = null; } }
    function schedule() {
      stopTimer();
      if (n < 2 || reduce || isPaused()) return; // reduced-motion visitors move through slides with the arrows
      timer = setTimeout(function () { go(idx + 1, 1); }, SLIDE_MS);
    }
    function pause() { stopTimer(); }
    function resume() { schedule(); }

    /* Start loading an upcoming image so the transition never waits on the network */
    function preload(i) {
      var img = slides[(i + n) % n].querySelector('img');
      if (img && img.loading === 'lazy') img.loading = 'eager';
    }
    /* Call cb once the slide image is loaded and decoded (or after a 3s safety timeout) */
    function ready(slide, cb) {
      var img = slide.querySelector('img'), done = false;
      function fin() {
        if (done) return; done = true;
        if (img && img.decode) { img.decode().then(cb, cb); } else { cb(); }
      }
      if (!img || (img.complete && img.naturalWidth)) { fin(); return; }
      img.loading = 'eager';
      img.addEventListener('load', fin, { once: true });
      img.addEventListener('error', fin, { once: true });
      setTimeout(fin, 3000);
    }

    /* Where the slider is heading: the queued slide if a request is waiting, otherwise the current one */
    function pendingIdx() { return queued ? queued.t : idx; }

    function go(target, dir) {
      target = (target + n) % n;
      if (target === idx && !busy) return;
      if (busy) { queued = { t: target, d: dir }; return; } // one animation at a time; keep the latest request
      busy = true; stopTimer();
      var from = idx, incoming = slides[target], outgoing = slides[from];
      ready(incoming, function () {
        incoming.classList.remove('is-leaving');
        outgoing.classList.remove('is-active'); outgoing.classList.add('is-leaving');
        incoming.classList.add('is-active');
        outgoing.setAttribute('aria-hidden', 'true'); incoming.setAttribute('aria-hidden', 'false');
        idx = target; setCaption(true); schedule(); preload(idx + 1);
        setTimeout(function () {
          outgoing.classList.remove('is-leaving');
          busy = false;
          if (queued) { var q = queued; queued = null; go(q.t, q.d); }
        }, TRANSITION_MS + 60);
      });
    }

    root.querySelectorAll('.hero-arrow').forEach(function (b) {
      b.addEventListener('click', function () { var d = b.classList.contains('prev') ? -1 : 1; go(pendingIdx() + d, d); });
    });

    /* Keyboard focus pauses autoplay; a mouse click that leaves focus on a button does not */
    root.addEventListener('focusin', function (e) {
      var kb = true; try { kb = e.target.matches(':focus-visible'); } catch (err) { /* old browsers */ }
      if (kb) { focusHold = true; pause(); }
    });
    root.addEventListener('focusout', function () { if (focusHold) { focusHold = false; resume(); } });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(pendingIdx() - 1, -1); else if (e.key === 'ArrowRight') go(pendingIdx() + 1, 1);
    });

    /* Swipe: horizontal gestures change slides, vertical gestures still scroll the page */
    var x0 = 0, y0 = 0, tracking = false;
    root.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      tracking = true; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
      touchHold = true; pause();
    }, { passive: true });
    function endTouch(e) {
      if (!tracking) return; tracking = false; touchHold = false;
      var t = e.changedTouches && e.changedTouches[0];
      var dx = t ? t.clientX - x0 : 0, dy = t ? t.clientY - y0 : 0;
      if (e.type === 'touchend' && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        go(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      } else { resume(); }
    }
    root.addEventListener('touchend', endTouch, { passive: true });
    root.addEventListener('touchcancel', endTouch, { passive: true });

    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else resume(); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) resume(); });

    setCaption(false); schedule();
    if (n > 1) {
      if (document.readyState === 'complete') preload(1);
      else window.addEventListener('load', function () { preload(1); });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSlider();

    /* Stagger grid items by column so cards arrive one after another */
    document.querySelectorAll('.grid, .steps, .filter-bar').forEach(function (g) {
      var cols = 1;
      if (window.getComputedStyle) {
        var tpl = window.getComputedStyle(g).gridTemplateColumns;
        if (tpl && tpl !== 'none') cols = tpl.split(' ').length;
      }
      if (cols < 2) cols = 4;
      Array.prototype.forEach.call(g.children, function (c, i) {
        c.classList.add('reveal-item'); c.style.setProperty('--d', ((i % cols) * 0.1).toFixed(2) + 's');
      });
    });

    /* Scroll reveal */
    var els = document.querySelectorAll('.reveal, .reveal-item, .reveal-left, .reveal-right, .reveal-zoom, .content-section h2');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (el) { io.observe(el); });
      setTimeout(function () { els.forEach(function (el) { el.classList.add('is-visible'); }); }, 5000); // safety net
    }
    if (reduce || !finePointer) return;

    /* Subtle card tilt (max 3 degrees, mouse only) */
    var MAX = 3;
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('is-tracking');
        card.style.setProperty('--ry', (px * MAX * 2).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * MAX * 2).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tracking');
        card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
      });
    });
  });
})();
