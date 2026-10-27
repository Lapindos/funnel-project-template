'use strict';

// Все вызовы gtag('event', …) собраны в этом файле, как требует раздел 4.3 ТЗ.
(function () {
  var PARAM_ATTRS = [
    'button-name',
    'page-section',
    'trip-id',
    'difficulty',
    'guide-id',
    'contact-type',
    'messenger',
    'network',
    'map-service',
    'promo-code'
  ];

  var NUMBER_PARAMS = {
    items_count: true,
    days: true,
    rental_price: true,
    seats_left: true,
    participants: true,
    duration_days: true
  };

  function sendEvent(name, params) {
    if (typeof window.gtag !== 'function') return;
    var payload = {};
    var source = params || {};
    Object.keys(source).forEach(function (key) {
      var value = source[key];
      if (value === undefined || value === null || value === '') return;
      if (NUMBER_PARAMS[key] && value !== 'all' && !isNaN(Number(value))) {
        payload[key] = Number(value);
        return;
      }
      payload[key] = String(value).slice(0, 100);
    });
    window.gtag('event', name, payload);
  }

  function paramsFromElement(el) {
    var params = {};
    PARAM_ATTRS.forEach(function (attr) {
      var value = el.getAttribute('data-' + attr);
      if (!value) return;
      params[attr.replace(/-/g, '_')] = value;
    });
    return params;
  }

  document.addEventListener('click', function (event) {
    var el = event.target.closest('[data-event]');
    if (!el) return;
    var name = el.getAttribute('data-event');
    if (!name) return;
    sendEvent(name, paramsFromElement(el));
  });

  window.TropaAnalytics = { send: sendEvent };
})();
