'use strict';

// Сведения только из ТЗ-11/2026, раздел 2 и шапка письма.
// Километраж и набор высоты в разделе 2 ТЗ не заданы, на карточках их нет.
var TROPA_DATA = {
  phoneDisplay: '+7 (900) 111-11-31',
  phoneTel: '+79001111131',
  email: 'go@tropa-club.example',
  telegramUrl: 'https://t.me/tropa_trips',
  whatsappUrl: 'https://wa.me/79001111131',
  address: '614170, г. Новоозёрск, ул. Таёжная, д. 3, офис 2',
  included: [
    'Работа двух инструкторов',
    'Трансфер от ж/д вокзала',
    'Групповое снаряжение',
    'Горячее питание в многодневных походах',
    'Страховка от несчастного случая'
  ],
  trips: [
    {
      id: 'icefalls',
      name: 'Ледяные водопады',
      days: 1,
      daysLabel: '1 день',
      difficulty: 'easy',
      difficultyLabel: 'легко',
      price: 3500,
      see: 'Однодневный маршрут к ледяным водопадам. Подходит тем, кто идёт без опыта.'
    },
    {
      id: 'snowshoes',
      name: 'Снегоступы для начинающих',
      days: 1,
      daysLabel: '1 день',
      difficulty: 'easy',
      difficultyLabel: 'легко',
      price: 2900,
      see: 'Однодневный выход на снегоступах для тех, кто в походе впервые.'
    },
    {
      id: 'sunrise',
      name: 'Рассвет на Седой горе',
      days: 1,
      daysLabel: '1 день',
      difficulty: 'medium',
      difficultyLabel: 'средне',
      price: 3900,
      see: 'Однодневный выход к рассвету. Сложность средняя, это не маршрут «легко».'
    },
    {
      id: 'plateau',
      name: 'Снежное плато',
      days: 2,
      daysLabel: '2 дня',
      difficulty: 'medium',
      difficultyLabel: 'средне',
      price: 7900,
      see: 'Два дня на снежном плато. Сложность средняя. В многодневном походе входит горячее питание.'
    },
    {
      id: 'traverse',
      name: 'Лыжный траверс',
      days: 3,
      daysLabel: '3 дня',
      difficulty: 'hard',
      difficultyLabel: 'сложно',
      price: 11500,
      see: 'Три дня лыжного перехода. Сложность честно указана как «сложно».'
    },
    {
      id: 'newyear_hut',
      name: 'Новогодняя изба',
      days: 3,
      daysLabel: '31.12–02.01',
      difficulty: 'easy',
      difficultyLabel: 'легко',
      price: 15900,
      see: 'Выезд с 31 декабря по 2 января. Сложность «легко»: с 12 лет можно идти с родителем.'
    }
  ],
  departures: [
    { tripId: 'snowshoes', date: '2026-12-05', seats: 11 },
    { tripId: 'icefalls', date: '2026-12-06', seats: 4 },
    { tripId: 'sunrise', date: '2026-12-07', seats: 5 },
    { tripId: 'snowshoes', date: '2026-12-12', seats: 2 },
    { tripId: 'plateau', date: '2026-12-12', seats: 6 },
    { tripId: 'icefalls', date: '2026-12-13', seats: 0 },
    { tripId: 'traverse', date: '2026-12-18', seats: 5 },
    { tripId: 'snowshoes', date: '2026-12-19', seats: 0 },
    { tripId: 'icefalls', date: '2026-12-20', seats: 9 },
    { tripId: 'sunrise', date: '2026-12-21', seats: 7 },
    { tripId: 'plateau', date: '2026-12-26', seats: 0 },
    { tripId: 'newyear_hut', date: '2026-12-31', seats: 3 },
    { tripId: 'snowshoes', date: '2027-01-09', seats: 8 },
    { tripId: 'icefalls', date: '2027-01-10', seats: 6 },
    { tripId: 'sunrise', date: '2027-01-11', seats: 3 },
    { tripId: 'traverse', date: '2027-01-15', seats: 8 },
    { tripId: 'snowshoes', date: '2027-01-16', seats: 14 },
    { tripId: 'plateau', date: '2027-01-17', seats: 4 },
    { tripId: 'traverse', date: '2027-01-22', seats: 0 }
  ],
  gear: [
    { id: 'sleeping_bag', name: 'Спальник −20 °C', price: 500 },
    { id: 'tent', name: 'Палатка (на двоих)', price: 700 },
    { id: 'snowshoes', name: 'Снегоступы', price: 400 },
    { id: 'mat', name: 'Коврик', price: 150 },
    { id: 'stove', name: 'Горелка', price: 200 },
    { id: 'poles', name: 'Треккинговые палки', price: 150 }
  ],
  checklist: [
    { id: 'sleeping_bag', name: 'Спальник −20 °C' },
    { id: 'mat', name: 'Коврик' },
    { id: 'poles', name: 'Треккинговые палки' },
    { id: 'snowshoes', name: 'Снегоступы, если их нет своих' },
    { id: 'jacket', name: 'Тёплая куртка' },
    { id: 'thermo', name: 'Термобельё' },
    { id: 'hat', name: 'Шапка и перчатки' },
    { id: 'thermos', name: 'Термос' },
    { id: 'light', name: 'Фонарь' },
    { id: 'glasses', name: 'Солнцезащитные очки' },
    { id: 'passport', name: 'Паспорт' }
  ],
  guides: [
    {
      id: 'ageeva',
      name: 'Агеева Ксения Тимуровна',
      role: 'Руководитель направления «Походы»',
      text: 'Отвечает за содержание маршрутов. Почта trips@tropa-club.example, Telegram @tropa_trips. В группе на выезде два инструктора.'
    },
    {
      id: 'instructor_lead',
      name: 'Инструктор группы',
      role: 'Первый инструктор выезда',
      text: 'На каждом выезде с группой идут два инструктора. Группа — до 16 человек.'
    },
    {
      id: 'instructor_support',
      name: 'Второй инструктор группы',
      role: 'Страховка и темп группы',
      text: 'В стоимости похода уже есть работа двух инструкторов и страховка от несчастного случая.'
    }
  ]
};

function tropaTrip(id) {
  return TROPA_DATA.trips.filter(function (trip) { return trip.id === id; })[0] || null;
}

function tropaFormatMoney(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

function tropaFormatDate(iso) {
  var parts = iso.split('-');
  var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });
}
