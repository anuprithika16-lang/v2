/* BizHopers - shared behaviour: mobile navigation, footer year, enquiry form.
   No external libraries. */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Enquiry form ----------
     The form's delivery endpoint is read from the data-endpoint attribute on
     <form id="enquiry-form"> in contact.html. It is intentionally EMPTY because
     the original project has no backend. While it is empty this script validates
     the form but does NOT send anything, and says so to the visitor.
     To go live, set data-endpoint to a service URL that accepts a POST of form
     fields (e.g. a Formspree, Getform or Web3Forms endpoint, or your own API). */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var phones = 'Please call 7200880027 or 9943023731 to make your enquiry.';
  var phonesShort = 'call 7200880027 or 9943023731.';

  // Pre-fill the subject when arriving from an "Enquire Now" button (?subject=...)
  try {
    var presetSubject = new URLSearchParams(window.location.search).get('subject');
    var subjectField = form.elements['subject'];
    if (presetSubject && subjectField && !subjectField.value) {
      subjectField.value = presetSubject.slice(0, 120);
    }
  } catch (err) { /* older browsers: leave subject empty */ }

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name.'; },
    email: function (v) {
      if (!v.trim()) return 'Enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, for example name@example.com.';
    },
    phone: function (v) {
      if (!v.trim()) return ''; // optional
      var digits = v.replace(/[\s()+-]/g, '');
      return /^\d{7,15}$/.test(digits) && /^[\d\s()+-]+$/.test(v) ? '' : 'Enter a valid phone number, using digits only.';
    },
    subject: function (v) { return v.trim().length >= 3 ? '' : 'Enter a subject for your enquiry.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.'; }
  };

  function setFieldState(name, message) {
    var input = form.elements[name];
    var wrap = input.closest('.field');
    var err = wrap.querySelector('.error');
    wrap.classList.toggle('invalid', !!message);
    err.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  function validate() {
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var msg = rules[name](form.elements[name].value);
      setFieldState(name, msg);
      if (msg && !firstBad) firstBad = form.elements[name];
    });
    return firstBad;
  }

  function showStatus(kind, html) {
    status.innerHTML = '<div class="notice notice--' + kind + '"><div>' + html + '</div></div>';
    status.setAttribute('role', kind === 'err' ? 'alert' : 'status');
  }

  Object.keys(rules).forEach(function (name) {
    form.elements[name].addEventListener('blur', function () {
      setFieldState(name, rules[name](form.elements[name].value));
    });
    form.elements[name].addEventListener('input', function () {
      if (form.elements[name].closest('.field').classList.contains('invalid')) {
        setFieldState(name, rules[name](form.elements[name].value));
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.innerHTML = '';

    // Honeypot: bots fill this hidden field, people never see it.
    if (form.elements['company_website'] && form.elements['company_website'].value) return;

    var firstBad = validate();
    if (firstBad) {
      showStatus('err', '<p><strong>Please correct the highlighted fields.</strong></p><p>Your message has not been sent.</p>');
      firstBad.focus();
      return;
    }

    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    if (!endpoint) {
      // No backend configured: be honest, never claim delivery.
      showStatus('info', '<p><strong>Your details look complete, but this form is not connected to a message service yet, so nothing has been sent.</strong></p><p>' + phones + '</p>');
      return;
    }

    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      Object.keys(rules).forEach(function (n) { setFieldState(n, ''); });
      showStatus('ok', '<p><strong>Thank you. Your enquiry has been sent.</strong></p><p>We will get back to you using the details you provided.</p>');
    }).catch(function () {
      showStatus('err', '<p><strong>We could not send your message.</strong></p><p>Please try again, or ' + phonesShort + '</p>');
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    });
  });
})();
