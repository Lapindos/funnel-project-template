'use strict';

// Адрес приёмника берётся из action формы, как в теме 7 курса.
// generate_lead уходит только после {"ok": true}: так требует ТЗ, это отличие от учебной формы.
var UTM_KEY = 'tropa_utm';

(function () {
  rememberUtm();
  var form = document.querySelector('#booking-form');
  if (!form) return;
  fillUtmFields(form);
  fillTripOptions(form);
  applyQuery(form);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submitBooking(form);
  });

  function rememberUtm() {
    var params = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    var hasAny = keys.some(function (key) { return params.get(key); });
    if (!hasAny) return;
    var stored = {};
    keys.forEach(function (key) { stored[key] = (params.get(key) || '').trim(); });
    sessionStorage.setItem(UTM_KEY, JSON.stringify(stored));
  }

  function currentUtm() {
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}'); } catch (error) { stored = {}; }
    var params = new URLSearchParams(location.search);
    function pick(key, fallback) {
      var fromUrl = params.get(key);
      var value = fromUrl ? fromUrl : stored[key];
      value = (value || '').trim();
      return value || fallback;
    }
    return {
      utm_source: pick('utm_source', 'direct'),
      utm_medium: pick('utm_medium', 'none'),
      utm_campaign: pick('utm_campaign', 'not_set'),
      utm_content: pick('utm_content', 'not_set')
    };
  }

  function fillUtmFields(bookingForm) {
    var utm = currentUtm();
    Object.keys(utm).forEach(function (key) {
      var input = bookingForm.elements.namedItem(key);
      if (input) input.value = utm[key];
    });
  }

  function fillTripOptions(bookingForm) {
    var select = bookingForm.querySelector('[name="trip_id"]');
    var dateSelect = bookingForm.querySelector('[name="trip_date"]');
    TROPA_DATA.trips.forEach(function (trip) {
      var option = document.createElement('option');
      option.value = trip.id;
      option.textContent = trip.name + ' — ' + trip.daysLabel + ', ' + trip.difficultyLabel + ', ' + tropaFormatMoney(trip.price);
      select.appendChild(option);
    });
    select.addEventListener('change', function () { refillDates(select.value, dateSelect, ''); });
    refillDates(select.value, dateSelect, '');
  }

  function refillDates(tripId, dateSelect, preferred) {
    var current = preferred || dateSelect.value;
    dateSelect.innerHTML = '<option value="">Выберите дату</option>';
    TROPA_DATA.departures.filter(function (item) {
      return item.tripId === tripId && item.seats > 0;
    }).forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.date;
      option.textContent = tropaFormatDate(item.date) + ' · свободно ' + item.seats;
      dateSelect.appendChild(option);
    });
    if (current) dateSelect.value = current;
  }

  function applyQuery(bookingForm) {
    var params = new URLSearchParams(location.search);
    var tripId = params.get('trip_id') || '';
    var tripDate = params.get('trip_date') || '';
    var select = bookingForm.querySelector('[name="trip_id"]');
    if (tripId && tropaTrip(tripId)) {
      select.value = tripId;
      refillDates(tripId, bookingForm.querySelector('[name="trip_date"]'), tripDate);
    }
  }

  function showError(bookingForm, fieldName, message, errorType) {
    var field = bookingForm.elements.namedItem(fieldName);
    var box = bookingForm.querySelector('[data-error-for="' + fieldName + '"]');
    if (field) field.setAttribute('aria-invalid', 'true');
    if (box) box.textContent = message;
    if (window.TropaAnalytics) {
      window.TropaAnalytics.send('form_error', { field_name: fieldName, error_type: errorType });
    }
  }

  function clearErrors(bookingForm) {
    bookingForm.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute('aria-invalid');
    });
    bookingForm.querySelectorAll('.field-error').forEach(function (box) { box.textContent = ''; });
  }

  function normalizePhone(value) {
    var digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 11 && digits.charAt(0) === '8') digits = '7' + digits.slice(1);
    if (digits.length === 11 && digits.charAt(0) === '7') return '+' + digits;
    if (digits.length === 10) return '+7' + digits;
    return String(value || '').trim();
  }

  function validate(bookingForm) {
    clearErrors(bookingForm);
    var name = bookingForm.elements.namedItem('name').value.trim();
    var phone = normalizePhone(bookingForm.elements.namedItem('phone').value);
    bookingForm.elements.namedItem('phone').value = phone;
    var email = bookingForm.elements.namedItem('email').value.trim();
    var tripId = bookingForm.elements.namedItem('trip_id').value;
    var tripDate = bookingForm.elements.namedItem('trip_date').value;
    var participants = Number(bookingForm.elements.namedItem('participants').value);
    var consent = bookingForm.elements.namedItem('consent').checked;
    var adult = bookingForm.elements.namedItem('adult').checked;
    if (name.length < 2 || name.length > 60) {
      showError(bookingForm, 'name', 'Имя: от 2 до 60 символов.', 'format');
      return null;
    }
    if (!/^\+7\d{10}$/.test(phone)) {
      showError(bookingForm, 'phone', 'Телефон нужен в виде +7 и ещё 10 цифр.', 'format');
      return null;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(bookingForm, 'email', 'Проверьте написание e-mail или оставьте поле пустым.', 'format');
      return null;
    }
    if (!tropaTrip(tripId)) {
      showError(bookingForm, 'trip_id', 'Выберите маршрут из списка.', 'required');
      return null;
    }
    var departure = TROPA_DATA.departures.filter(function (item) {
      return item.tripId === tripId && item.date === tripDate && item.seats > 0;
    })[0];
    if (!departure) {
      showError(bookingForm, 'trip_date', 'Выберите дату, на которой ещё есть места.', 'required');
      return null;
    }
    if (!Number.isInteger(participants) || participants < 1 || participants > 6) {
      showError(bookingForm, 'participants', 'В одной брони можно указать от 1 до 6 участников.', 'range');
      return null;
    }
    if (!adult) {
      showError(bookingForm, 'adult', 'Нужно подтвердить возраст: 18 лет или вы идёте с родителем.', 'required');
      return null;
    }
    if (!consent) {
      showError(bookingForm, 'consent', 'Без согласия на обработку персональных данных бронь не отправляется.', 'required');
      return null;
    }
    ['name', 'phone', 'email', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (key) {
      var field = bookingForm.elements.namedItem(key);
      if (field && field.value.length > 200) field.value = field.value.slice(0, 200);
    });
    return {
      name: name,
      phone: phone,
      email: email,
      trip_id: tripId,
      trip_date: tripDate,
      participants: String(participants)
    };
  }

  async function submitBooking(bookingForm) {
    var status = bookingForm.querySelector('#form-status');
    var button = bookingForm.querySelector('[type="submit"]');
    var payload = validate(bookingForm);
    if (!payload) return;
    fillUtmFields(bookingForm);
    var requestId = bookingForm.elements.namedItem('request_id');
    if (!requestId.value) requestId.value = 'REQ-' + crypto.randomUUID().toUpperCase();
    var endpoint = bookingForm.getAttribute('action') || '';
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(endpoint) || endpoint.indexOf('REPLACE_WITH_DEPLOYMENT_ID') !== -1) {
      status.textContent = 'Приёмник заявок ещё не опубликован. Вставьте адрес Apps Script в action формы на contacts.html.';
      window.TropaAnalytics.send('form_error', { field_name: 'form', error_type: 'server' });
      return;
    }
    button.disabled = true;
    status.textContent = 'Отправляем бронь…';
    var body = new URLSearchParams();
    Object.keys(payload).forEach(function (key) { body.set(key, payload[key]); });
    ['request_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (key) {
      body.set(key, bookingForm.elements.namedItem(key).value);
    });
    try {
      var response = await fetch(endpoint, { method: 'POST', body: body });
      var data = await response.json();
      if (!data || data.ok !== true) {
        status.textContent = 'Таблица не приняла бронь. Проверьте поля и попробуйте ещё раз.';
        window.TropaAnalytics.send('form_error', { field_name: 'form', error_type: 'server' });
        button.disabled = false;
        return;
      }
      window.TropaAnalytics.send('generate_lead', {
        lead_trip_id: payload.trip_id,
        participants: payload.participants,
        lead_source: bookingForm.elements.namedItem('utm_source').value
      });
      location.href = 'thanks.html?request_id=' + encodeURIComponent(requestId.value) +
        '&trip_id=' + encodeURIComponent(payload.trip_id) +
        '&participants=' + encodeURIComponent(payload.participants);
    } catch (error) {
      status.textContent = 'Нет ответа от приёмника заявок. Бронь не записана.';
      window.TropaAnalytics.send('form_error', { field_name: 'form', error_type: 'server' });
      button.disabled = false;
    }
  }
})();
