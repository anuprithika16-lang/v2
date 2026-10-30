/* Aarthi Travels — header, mobile menu, active page, page fade */
(function () {
  'use strict';
  var NAV_BREAKPOINT = 1100; // keep in sync with the header media query in responsive.css

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!header || !toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('[data-open-booking]')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > NAV_BREAKPOINT) setOpen(false); });

    // Sticky header shadow
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Page-leave fade for internal links (skipped for reduced motion / new tabs / modifier keys)
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (reduce || !a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var h = a.getAttribute('href');
      if (a.target === '_blank' || a.hasAttribute('download') || /^(#|mailto:|tel:|https?:|javascript:)/i.test(h) || (h.indexOf('#') > -1 && h.split('#')[0] === '')) return;
      e.preventDefault(); document.body.classList.add('page-leave');
      setTimeout(function () { window.location.href = a.href; }, 220);
      setTimeout(function () { document.body.classList.remove('page-leave'); }, 2500); // never leave the page faded out
    });
    // Back / forward (including the bfcache) always return to a fully visible page
    window.addEventListener('pageshow', function () { document.body.classList.remove('page-leave'); });

    // Active page fallback (HTML already sets aria-current on the right link)
    if (!nav.querySelector('[aria-current="page"]')) {
      var here = location.pathname.split('/').pop() || 'index.html';
      nav.querySelectorAll('a[href]').forEach(function (a) {
        if (a.getAttribute('href').split('/').pop().split('#')[0] === here) a.setAttribute('aria-current', 'page');
      });
    }
  });
})();
