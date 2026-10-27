// Приёмник броней турклуба «Тропа». Основа — doPost из темы 7 курса ОП.03.
// Замените SPREADSHEET_ID на ID таблицы «Tropa — Bookings» (между /d/ и /edit).
// Публикация: Развернуть → Новое развёртывание → Веб-приложение,
// выполнять от своего имени, доступ — все. После правки кода нужна новая версия.

var SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID';
var HEADERS = [
  'request_id', 'created_at', 'name', 'phone', 'email', 'trip_id', 'trip_date',
  'participants', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'status'
];
var TRIPS = ['icefalls', 'snowshoes', 'sunrise', 'plateau', 'traverse', 'newyear_hut'];

function doPost(e) {
  var params = readParams(e);
  var clean = function (key) { return String(params[key] || '').trim(); };
  var required = ['request_id', 'name', 'phone', 'trip_id', 'trip_date', 'participants'];
  var missing = required.filter(function (key) { return !clean(key); });
  if (missing.length) return jsonResponse({ ok: false, error: 'missing_required', fields: missing });

  var id = clean('request_id');
  if (!/^REQ-[A-F0-9]{8}-[A-F0-9]{4}-4[A-F0-9]{3}-[89AB][A-F0-9]{3}-[A-F0-9]{12}$/i.test(id)) {
    return jsonResponse({ ok: false, error: 'invalid_request_id' });
  }
  var name = clean('name');
  if (name.length < 2 || name.length > 60) return jsonResponse({ ok: false, error: 'invalid_name' });
  var phone = clean('phone');
  if (!/^\+7\d{10}$/.test(phone)) return jsonResponse({ ok: false, error: 'invalid_phone' });
  var email = clean('email');
  if (email && !/^[^\s@]+\@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: 'invalid_email' });
  }
  var tripId = clean('trip_id');
  if (TRIPS.indexOf(tripId) === -1) return jsonResponse({ ok: false, error: 'invalid_trip' });
  var tripDate = clean('trip_date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tripDate)) return jsonResponse({ ok: false, error: 'invalid_date' });
  var participants = Number(clean('participants'));
  if (!Number.isInteger(participants) || participants < 1 || participants > 6) {
    return jsonResponse({ ok: false, error: 'invalid_participants' });
  }
  var longField = ['name', 'phone', 'email', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].some(function (key) {
    return clean(key).length > 200;
  });
  if (longField) return jsonResponse({ ok: false, error: 'value_too_long' });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return jsonResponse({ ok: false, error: 'busy_retry' });
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('leads');
    if (!sheet || sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0].join('|') !== HEADERS.join('|')) {
      return jsonResponse({ ok: false, error: 'invalid_sheet_schema' });
    }
    var duplicate = sheet.getRange('A:A').createTextFinder(id)
      .matchEntireCell(true).matchCase(false).useRegularExpression(false).findNext();
    if (duplicate) return jsonResponse({ ok: false, error: 'duplicate_request_id' });
    // created_at и status ставит сервер. status из браузера игнорируется.
    sheet.appendRow([
      id,
      new Date(),
      textCell(name),
      textCell(phone),
      textCell(email),
      tripId,
      tripDate,
      participants,
      textCell(clean('utm_source') || 'direct'),
      textCell(clean('utm_medium') || 'none'),
      textCell(clean('utm_campaign') || 'not_set'),
      textCell(clean('utm_content') || 'not_set'),
      'new'
    ]);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true, request_id: id });
  } catch (error) {
    return jsonResponse({ ok: false, error: 'storage_error' });
  } finally {
    lock.releaseLock();
  }
}

function readParams(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (error) { /* форма шлёт urlencoded */ }
  }
  return (e && e.parameter) || {};
}

function textCell(value) {
  return /^[=+@-]/.test(value) ? "'" + value : value;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Один раз в редакторе Apps Script: выберите setupWorkbook и нажмите «Выполнить».
// Функция создаёт лист leads по разделу 6 и лист utm с формулой полной ссылки.
function setupWorkbook() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  setupLeads(ss);
  setupUtm(ss);
}

function setupLeads(ss) {
  var sheet = ss.getSheetByName('leads') || ss.insertSheet('leads');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:M1').setFontWeight('bold');
  sheet.getRange('B2:B').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('M2:M500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['new', 'contacted', 'prepaid', 'went', 'lost'], true)
      .setAllowInvalid(false)
      .build()
  );
  sheet.getRange('F2:F500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(TRIPS, true)
      .setAllowInvalid(false)
      .build()
  );
  sheet.clearConditionalFormatRules();
  var emptyRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"";OR($C2="";$D2="";$F2="";$G2="";$H2="";$I2="";$J2="";$K2="";$L2="";$M2=""))')
    .setBackground('#f4c7c3')
    .setRanges([sheet.getRange('A2:M500')])
    .build();
  var duplicateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"";COUNTIF($A:$A;$A2)>1)')
    .setBackground('#fce8b2')
    .setRanges([sheet.getRange('A2:A500')])
    .build();
  sheet.setConditionalFormatRules([emptyRule, duplicateRule]);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function setupUtm(ss) {
  var headers = [
    'номер', 'канал', 'размещение', 'utm_source', 'utm_medium', 'utm_campaign',
    'utm_content', 'utm_term', 'страница', 'полная_ссылка', 'короткая_ссылка',
    'адрес_публикации', 'дата_публикации', 'пояснение'
  ];
  var rows = [
    ['U-01', 'Instagram', 'ссылка в шапке профиля', 'instagram', 'social', 'winter_trips_2026', 'bio', 'winter', 'index.html', '', '', '', '', 'С шапки профиля открывается главная.'],
    ['U-02', 'Instagram', 'автоответ под Reel, ветка СНАРЯГА', 'instagram', 'social', 'winter_trips_2026', 'reel_tent_01', 'winter', 'gear.html', '', '', '', '', 'Кнопка «Открыть чек-лист».'],
    ['U-03', 'Instagram', 'автоответ, ветка НОВИЧОК', 'instagram', 'social', 'beginners_dec_2026', 'reel_tent_01_easy', 'winter', 'trips.html#easy', '', '', '', '', 'Якорь #easy включает фильтр лёгких маршрутов.'],
    ['U-04', 'Instagram', 'ссылка-стикер в Stories', 'instagram', 'social', 'winter_trips_2026', 'stories_01', 'winter', 'calendar.html', '', '', '', '', 'В ТЗ content был пустым: для Stories взято stories_01.'],
    ['U-05', 'ВКонтакте', 'пост в сообществе', 'vk', 'social', 'winter_trips_2026', 'post_01', 'winter', 'trips.html', '', '', '', '', 'Пост про маршруты ведёт в каталог.'],
    ['U-06', 'ВКонтакте', 'фотоотчёт из похода', 'vk', 'social', 'winter_trips_2026', 'photo_report', 'winter', 'calendar.html', '', '', '', '', 'Кампания в ТЗ была пустой: та же winter_trips_2026.'],
    ['U-07', 'Telegram', 'пост в канале', 'telegram', 'social', 'winter_trips_2026', 'post_01', 'winter', 'calendar.html', '', '', '', '', 'Из канала выбирают дату.'],
    ['U-08', 'Telegram', 'сообщение в чате участников', 'telegram', 'social', 'winter_trips_2026', 'members_chat', 'winter', 'calendar.html', '', '', '', '', 'medium в ТЗ был пустым: чат — это social.'],
    ['U-09', 'YouTube', 'описание видео «Снежное плато за 2 дня»', 'youtube', 'social', 'winter_trips_2026', 'video_01', 'winter', 'trips.html', '', '', '', '', 'content в ТЗ был пустым: формат ролика video_01.'],
    ['U-10', 'Блогер 1', 'ссылка у партнёра', 'partner_one', 'affiliate', 'winter_trips_2026', 'stories_01', 'winter', 'index.html', '', '', '', '', 'Перед публикацией заменить partner_one на ник латиницей.'],
    ['U-11', 'Блогер 2', 'ссылка у партнёра', 'partner_two', 'affiliate', 'winter_trips_2026', 'post_01', 'winter', 'gear.html', '', '', '', '', 'Перед публикацией заменить partner_two на ник латиницей.'],
    ['U-12', 'Магазин снаряжения', 'QR-код на стойке', 'gearshop_qr', 'qr', 'winter_trips_2026', 'counter_a4', 'winter', 'gear.html', '', '', '', '', 'Пятая метка utm_term=winter: в п. 5.3 нужны пять меток.']
  ];
  var sheet = ss.getSheetByName('utm') || ss.insertSheet('utm');
  if (sheet.getLastRow() > 1) return;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  var formula = '=IF(I2="";"";LET(page;I2;hash;IFERROR(REGEXEXTRACT(page;"#.*");"");path;IF(hash="";page;REGEXREPLACE(page;"#.*";""));"https://tz-11-turklub-tropa.vercel.app/"&path&"?utm_source="&D2&"&utm_medium="&E2&"&utm_campaign="&F2&"&utm_content="&G2&"&utm_term="&H2&hash))';
  sheet.getRange('J2').setFormula(formula);
  sheet.getRange('J2').copyTo(sheet.getRange('J3:J13'));
}
