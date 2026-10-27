'use strict';

(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-filter]').forEach(initFilter);
  initCalendar();
  initChecklist();
  initRental();
  initPromo();
  initThanks();

  function initFilter(form) {
    var difficulty = form.querySelector('[name="difficulty"]');
    var duration = form.querySelector('[name="duration_days"]');
    var cards = document.querySelectorAll('[data-trip-card]');
    var empty = document.querySelector('[data-filter-empty]');
    if (location.hash === '#easy' && difficulty) difficulty.value = 'easy';

    function apply(send) {
      var diff = difficulty ? difficulty.value : 'all';
      var days = duration ? duration.value : 'all';
      var visible = 0;
      cards.forEach(function (card) {
        var okDiff = diff === 'all' || card.getAttribute('data-difficulty') === diff;
        var okDays = days === 'all' || card.getAttribute('data-days') === days;
        var show = okDiff && okDays;
        card.classList.toggle('is-hidden', !show);
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle('is-visible', visible === 0);
      if (send && window.TropaAnalytics) {
        window.TropaAnalytics.send('trip_filter', {
          difficulty: diff,
          duration_days: days
        });
      }
    }

    form.addEventListener('change', function () { apply(true); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply(true);
    });
    apply(false);
  }

  function nearestOther(current) {
    var same = TROPA_DATA.departures.filter(function (item) {
      return item.tripId === current.tripId && item.date !== current.date;
    });
    var future = same.filter(function (item) { return item.date > current.date; });
    future.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (future.length) return future[0];
    same.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return same[0] || null;
  }

  function initCalendar() {
    var root = document.querySelector('[data-calendar]');
    if (!root) return;
    var groups = [
      { title: 'Декабрь 2026', prefix: '2026-12' },
      { title: 'Январь 2027', prefix: '2027-01' }
    ];
    groups.forEach(function (group) {
      var month = document.createElement('section');
      month.className = 'month';
      var title = document.createElement('h2');
      title.textContent = group.title;
      month.appendChild(title);
      var list = document.createElement('div');
      list.className = 'agenda';
      TROPA_DATA.departures.filter(function (item) {
        return item.date.indexOf(group.prefix) === 0;
      }).forEach(function (item) {
        list.appendChild(renderDeparture(item));
      });
      month.appendChild(list);
      root.appendChild(month);
    });
    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target) target.classList.add('is-target');
    }
  }

  function renderDeparture(item) {
    var trip = tropaTrip(item.tripId);
    var row = document.createElement('article');
    row.className = 'departure' + (item.seats === 0 ? ' is-full' : '');
    row.id = 'dep-' + item.tripId + '-' + item.date;
    row.innerHTML =
      '<div><strong>' + tropaFormatDate(item.date) + '</strong></div>' +
      '<div><strong>' + trip.name + '</strong><div>' + trip.difficultyLabel + ' · ' + trip.daysLabel + ' · ' + tropaFormatMoney(trip.price) + ' за место</div></div>' +
      '<div class="' + (item.seats === 0 ? 'seat-no' : 'seat-ok') + '">' +
      (item.seats === 0 ? 'Мест нет' : 'Свободно: ' + item.seats) + '</div>';
    var actions = document.createElement('div');
    actions.className = 'wide';
    var choose = document.createElement('button');
    choose.type = 'button';
    choose.className = 'btn btn-ghost';
    choose.textContent = 'Выбрать дату';
    choose.addEventListener('click', function () {
      window.TropaAnalytics.send('date_select', {
        trip_id: item.tripId,
        trip_date: item.date,
        seats_left: item.seats
      });
      choose.textContent = 'Дата выбрана';
    });
    actions.appendChild(choose);
    if (item.seats === 0) {
      var other = nearestOther(item);
      var note = document.createElement('p');
      if (other) {
        note.innerHTML = 'Ближайшая другая дата этого маршрута: <a href="#dep-' + other.tripId + '-' + other.date + '">' + tropaFormatDate(other.date) + '</a>';
      } else {
        note.textContent = 'Другой даты этого маршрута в календаре нет.';
      }
      actions.appendChild(note);
    } else {
      var book = document.createElement('a');
      book.className = 'btn';
      book.href = 'contacts.html?trip_id=' + encodeURIComponent(item.tripId) + '&trip_date=' + encodeURIComponent(item.date);
      book.textContent = 'Забронировать';
      book.setAttribute('data-event', 'cta_click');
      book.setAttribute('data-button-name', 'calendar_book');
      book.setAttribute('data-page-section', 'calendar');
      actions.appendChild(book);
    }
    row.appendChild(actions);
    return row;
  }

  function initChecklist() {
    document.querySelectorAll('[data-checklist]').forEach(function (input) {
      input.addEventListener('change', function () {
        if (!input.checked || !window.TropaAnalytics) return;
        window.TropaAnalytics.send('checklist_check', { item_id: input.value });
      });
    });
  }

  function initRental() {
    var form = document.querySelector('[data-rental]');
    if (!form) return;
    var days = form.querySelector('[name="days"]');
    var total = form.querySelector('[data-rental-total]');
    var lines = form.querySelector('[data-rental-lines]');

    function selected() {
      return Array.prototype.filter.call(
        form.querySelectorAll('[name="gear_item"]'),
        function (input) { return input.checked; }
      );
    }

    function calculate(send) {
      var dayCount = Number(days.value);
      if (!dayCount || dayCount < 1) dayCount = 1;
      var sum = 0;
      var prices = [];
      var rows = '';
      selected().forEach(function (input) {
        var price = Number(input.getAttribute('data-price'));
        var line = price * dayCount;
        sum += line;
        prices.push(String(price));
        rows += '<div class="calc-row"><span>' + input.getAttribute('data-name') + '</span><span>' +
          price + ' ₽ × ' + dayCount + ' = ' + tropaFormatMoney(line) + '</span></div>';
      });
      if (prices.length) {
        rows += '<p>(' + prices.join(' + ') + ') × ' + dayCount + ' = ' + tropaFormatMoney(sum) + '</p>';
      }
      lines.innerHTML = rows || '<p>Отметьте предметы, которые нужно взять в аренду.</p>';
      total.textContent = tropaFormatMoney(sum);
      if (send && window.TropaAnalytics) {
        window.TropaAnalytics.send('rental_calc', {
          items_count: selected().length,
          days: dayCount,
          rental_price: sum
        });
      }
    }

    form.addEventListener('change', function () { calculate(true); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      calculate(true);
    });
    calculate(false);
  }

  function initPromo() {
    var button = document.querySelector('[data-promo]');
    if (!button) return;
    button.addEventListener('click', function () {
      var code = button.getAttribute('data-promo');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(function () { return null; });
      }
      var status = document.querySelector('[data-promo-status]');
      if (status) status.textContent = 'Промокод ' + code + ' скопирован.';
    });
  }

  function initThanks() {
    var number = document.querySelector('[data-request-id]');
    if (!number) return;
    var params = new URLSearchParams(location.search);
    var id = params.get('request_id') || '';
    number.textContent = id || 'Номер появится после отправки формы брони.';
    var trip = tropaTrip(params.get('trip_id') || '');
    var people = Number(params.get('participants') || '0');
    var pay = document.querySelector('[data-prepay]');
    if (!pay || !trip || !people) return;
    var amount = Math.round(trip.price * people * 0.3);
    var placeWord = people === 1 ? 'место' : (people >= 2 && people <= 4 ? 'места' : 'мест');
    pay.textContent = 'Предоплата 30% за ' + people + ' ' + placeWord + ' на маршруте «' + trip.name +
      '»: ' + tropaFormatMoney(amount) + '. Стоимость одного места — ' + tropaFormatMoney(trip.price) +
      '. Реквизиты для перевода пришлём в ответ на телефон из заявки. Отмена за 7 дней — возврат предоплаты.';
  }
})();
