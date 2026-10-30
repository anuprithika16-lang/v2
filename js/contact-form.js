/* Aarthi Travels — enquiry form validation and WhatsApp / email hand-off.
   There is no backend: nothing is sent until the customer presses Send in WhatsApp
   or in their email app, so the page never claims a booking has been made. */
(function () {
  'use strict';
  var A = window.Aarthi;

  function todayIso() {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  function setError(form, name, msg) {
    var el = form.elements[name]; if (!el) return;
    var err = document.getElementById(el.id + '-error');
    if (msg) { el.setAttribute('aria-invalid', 'true'); if (err) err.textContent = msg; }
    else { el.removeAttribute('aria-invalid'); if (err) err.textContent = ''; }
  }
  function val(form, n) { return (form.elements[n] && form.elements[n].value || '').trim(); }

  function validate(form) {
    var errors = {}, v = {};
    ['name', 'phone', 'email', 'pickup', 'destination', 'date', 'returnDate', 'passengers', 'vehicle', 'notes']
      .forEach(function (n) { v[n] = val(form, n); });
    if (v.name.length < 2) errors.name = 'Please enter your full name.';
    var digits = v.phone.replace(/[\s\-().]/g, '');
    if (!v.phone) errors.phone = 'Please enter your phone number.';
    else if (!/^(\+?91|0)?[6-9]\d{9}$/.test(digits)) errors.phone = 'Enter a valid 10-digit Indian mobile number, for example 98765 43210.';
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) errors.email = 'Enter a valid email address, or leave this field empty.';
    if (!v.pickup) errors.pickup = 'Please enter the pickup location.';
    if (!v.destination) errors.destination = 'Please enter your destination.';
    if (!v.date) errors.date = 'Please choose your travel date.';
    else if (v.date < todayIso()) errors.date = 'Travel date cannot be in the past.';
    if (v.returnDate && v.date && v.returnDate < v.date) errors.returnDate = 'Return date must be on or after the travel date.';
    var p = parseInt(v.passengers, 10);
    if (!v.passengers) errors.passengers = 'Please enter the number of passengers.';
    else if (isNaN(p) || p < 1 || p > 60) errors.passengers = 'Enter a number between 1 and 60.';
    if (!v.vehicle) errors.vehicle = 'Please choose a vehicle.';
    else if (!errors.passengers && A.seatsFor(v.vehicle) && p > A.seatsFor(v.vehicle))
      errors.passengers = 'The ' + v.vehicle + ' seats up to ' + A.seatsFor(v.vehicle) + '. Choose a larger vehicle or fewer passengers.';
    return { errors: errors, values: v };
  }

  function showStatus(form, text, isError) {
    var s = form.querySelector('.form-status'); if (!s) return;
    s.hidden = false; s.textContent = text; s.classList.toggle('is-error', !!isError);
  }

  function init(form) {
    form.setAttribute('novalidate', '');
    var min = todayIso();
    ['date', 'returnDate'].forEach(function (n) { if (form.elements[n]) form.elements[n].min = min; });
    form.addEventListener('input', function (e) { if (e.target.name) setError(form, e.target.name, ''); });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'date' && form.elements.returnDate) form.elements.returnDate.min = e.target.value || min;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var channel = (e.submitter && e.submitter.getAttribute('data-channel')) || 'whatsapp';
      var res = validate(form), names = Object.keys(res.errors);
      ['name', 'phone', 'email', 'pickup', 'destination', 'date', 'returnDate', 'passengers', 'vehicle']
        .forEach(function (n) { setError(form, n, res.errors[n] || ''); });
      if (names.length) {
        showStatus(form, 'Please fix ' + (names.length === 1 ? 'the highlighted field' : names.length + ' highlighted fields') + ' and try again.', true);
        form.elements[names[0]].focus();
        return;
      }
      var btns = form.querySelectorAll('button[type="submit"]');
      if (form.getAttribute('data-busy')) return;           // prevent duplicate submissions
      form.setAttribute('data-busy', '1'); btns.forEach(function (b) { b.disabled = true; });
      setTimeout(function () { form.removeAttribute('data-busy'); btns.forEach(function (b) { b.disabled = false; }); }, 4000);

      var text = A.message(res.values);
      if (channel === 'email') {
        window.location.href = 'mailto:' + A.email + '?subject=' + encodeURIComponent('Travel enquiry: ' + res.values.vehicle) + '&body=' + encodeURIComponent(text);
        showStatus(form, 'Your email app has opened with your enquiry. Please review it and press Send there. Your enquiry is not sent until you do.');
      } else {
        var w = window.open(A.waUrl(text), '_blank', 'noopener');
        if (!w) window.location.href = A.waUrl(text);
        showStatus(form, 'WhatsApp has opened with your enquiry. Please review the message and press Send in WhatsApp. This is an enquiry only and does not confirm a booking.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-enquiry-form]').forEach(init);
  });
})();
