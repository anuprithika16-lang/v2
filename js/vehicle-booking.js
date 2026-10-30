/* Aarthi Travels — Book Now buttons, booking dialog, vehicle preselection */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var dialog = document.getElementById('booking-dialog');
    if (!dialog) return;
    var form = dialog.querySelector('form');
    var label = document.getElementById('booking-vehicle-label');
    var select = form.elements['vehicle'];
    var dest = form.elements['destination'];
    var lastTrigger = null;

    function setLabel() {
      if (label) label.textContent = select.value ? 'Selected vehicle: ' + select.value : 'Choose a vehicle and share your travel details.';
    }
    function open(trigger) {
      lastTrigger = trigger || null;
      var v = trigger && trigger.getAttribute('data-vehicle');
      var d = trigger && trigger.getAttribute('data-destination');
      if (v) select.value = v;                // preselect the matching vehicle
      if (d) dest.value = d;                  // preselect destination for trip enquiries
      setLabel();
      var status = form.querySelector('.form-status'); if (status) status.hidden = true;
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
      document.body.classList.add('dialog-open');
      var first = form.elements['name'];
      setTimeout(function () { first.focus(); }, 60);
    }
    function close() {
      if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
    }
    dialog.addEventListener('close', function () {
      document.body.classList.remove('dialog-open');
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    });
    select.addEventListener('change', setLabel);

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-open-booking]');
      if (t) { e.preventDefault(); open(t); return; }
      if (e.target.closest('[data-close-booking]')) close();
      else if (e.target === dialog) close(); // click on backdrop
    });
  });
})();
