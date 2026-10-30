/* Aarthi Travels — shared configuration and general behaviour */
(function () {
  'use strict';
  var A = window.Aarthi = {
    phone: '917845501000',
    email: 'aarthicarsandvans@gmail.com',
    vehicles: [
      { id: 'urbania', name: '16 Seater Urbania', seats: 16 },
      { id: 'tempo-traveller', name: '13 Seater Tempo Traveller', seats: 13 },
      { id: 'ac-van-25', name: '25 Seater AC Van', seats: 25 },
      { id: 'van-21', name: '21 Seater Van', seats: 21 },
      { id: 'innova-crysta', name: '7 Seater Innova Crysta', seats: 7 },
      { id: 'mahindra-xylo', name: '7 Seater Mahindra Xylo', seats: 7 }
    ],
    seatsFor: function (name) {
      for (var i = 0; i < A.vehicles.length; i++) if (A.vehicles[i].name === name) return A.vehicles[i].seats;
      return null;
    },
    formatDate: function (iso) {
      if (!iso) return '';
      var d = new Date(iso + 'T00:00:00');
      return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    },
    /* Builds the enquiry text. Only includes details the customer actually entered. */
    message: function (d) {
      d = d || {};
      var m = 'Hello Aarthi Travels, I would like to enquire about ' +
        (d.vehicle ? 'booking the ' + d.vehicle : 'a trip') + '.';
      var bits = [];
      if (d.pickup) bits.push('my pickup location is ' + d.pickup);
      if (d.destination) bits.push('my destination is ' + d.destination);
      if (d.date) bits.push('my travel date is ' + A.formatDate(d.date));
      if (d.returnDate) bits.push('my return date is ' + A.formatDate(d.returnDate));
      if (d.passengers) bits.push('there will be ' + d.passengers + ' passenger(s)');
      if (bits.length) {
        bits[0] = bits[0].charAt(0).toUpperCase() + bits[0].slice(1);
        m += ' ' + bits.slice(0, -1).join(', ') + (bits.length > 1 ? ', and ' : '') + bits[bits.length - 1] + '.';
      }
      if (d.notes) m += ' Additional requirements: ' + d.notes + '.';
      m += ' Please share the availability and booking details.';
      if (d.name || d.phone) m += ' Name: ' + (d.name || '') + (d.phone ? ', Phone: ' + d.phone : '') + '.';
      return m;
    },
    waUrl: function (text) { return 'https://wa.me/' + A.phone + '?text=' + encodeURIComponent(text); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Footer year
    var y = document.querySelectorAll('[data-year]');
    for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

    // Tour package category filter
    var buttons = document.querySelectorAll('[data-filter]');
    var items = document.querySelectorAll('[data-categories]');
    var count = document.getElementById('filter-count');
    var grid = document.getElementById('dest-grid');
    function updateGrid(n) { if (grid) grid.setAttribute('data-visible', n); }
    updateGrid(items.length);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        var shown = 0;
        items.forEach(function (it) {
          var show = f === 'all' || it.getAttribute('data-categories').split(' ').indexOf(f) > -1;
          it.hidden = !show; if (show) shown++;
        });
        updateGrid(shown);
        if (count) count.textContent = shown + (shown === 1 ? ' destination shown' : ' destinations shown');
      });
    });
  });
})();
