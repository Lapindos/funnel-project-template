# События

Тег: `gtag.js` в `<head>` каждой страницы. Сейчас в коде стоит учебный ID `G-YQM8LSJ9F7`. Для сдачи его заменяют на ID ресурса «ТРОПА — сайт». Все вызовы `gtag('event', …)` идут через `sendEvent` в `js/analytics.js`, строка 40. В разметке кнопки помечены `data-event`, обработчик клика — `js/analytics.js`, строки 53–59.

Имя, телефон и e-mail в параметры и в адрес страницы не передаются.

| № | Событие | Где | Пример параметров |
|---|---|---|---|
| 1 | `page_view` | расширенная статистика, код не пишет | `page_location` = адрес страницы, `page_title` = «Главная — турклуб «Тропа»» |
| 2 | `scroll` | расширенная статистика | `percent_scrolled` = 90 |
| 3 | `click` | расширенная статистика, внешняя ссылка | `link_url` = `https://t.me/tropa_trips`, `outbound` = true |
| 4 | `file_download` | расширенная статистика, ссылка `files/checklist-winter.pdf` на `gear.html` | `file_name` = checklist-winter.pdf, `file_extension` = pdf |
| 5 | `form_start` | расширенная статистика, первое поле формы `#booking-form` | `form_id` = booking-form |
| 6 | `form_submit` | расширенная статистика, отправка формы | `form_id` = booking-form |
| 7 | `generate_lead` | `js/form.js`, строка 209, только после `ok: true` | `lead_trip_id` = snowshoes, `participants` = 2, `lead_source` = instagram |
| 8 | `cta_click` | атрибут `data-event` на кнопках брони, первая — `index.html`, строка 48 | `button_name` = hero_pick, `page_section` = hero |
| 9 | `trip_filter` | `js/ui.js`, строка 40, смена фильтра на главной и на `trips.html` | `difficulty` = easy, `duration_days` = 1 |
| 10 | `trip_view` | карточки маршрутов, первая — `index.html`, строка 87 | `trip_id` = icefalls, `difficulty` = easy |
| 11 | `date_select` | `js/ui.js`, строка 112, кнопка «Выбрать дату» | `trip_id` = icefalls, `trip_date` = 2026-12-13, `seats_left` = 0 |
| 12 | `guide_view` | карточки инструкторов, `guides.html`, строка 51, и ссылки на главной | `guide_id` = ageeva |
| 13 | `rental_calc` | `js/ui.js`, строка 186, изменение калькулятора | `items_count` = 2, `days` = 2, `rental_price` = 1300 |
| 14 | `checklist_check` | `js/ui.js`, строка 147, отметка пункта | `item_id` = sleeping_bag |
| 15 | `contact_click` | телефон и e-mail, первая ссылка — `index.html`, строка 35 | `contact_type` = phone |
| 16 | `messenger_click` | `contacts.html`, строки 97–98 | `messenger` = telegram |
| 17 | `social_click` | подвал и блок на `thanks.html` | `network` = vk, `page_section` = footer |
| 18 | `form_error` | `js/form.js`, строка 100, плюс строки 190, 205 и 219 при ошибке приёмника | `field_name` = phone, `error_type` = format |
| 19 | `promo_copy` | `gear.html`, строка 88, по выбору | `promo_code` = SNOW300 |
| 20 | `map_open` | `calendar.html`, строка 54, по выбору | `map_service` = yandex |

Ключевые события, их отмечают в интерфейсе GA4, не в коде: `generate_lead`, `contact_click`, `messenger_click`.

Пользовательские параметры уровня события: `button_name`, `page_section`, `difficulty`, `trip_id`, `seats_left`, `lead_trip_id`, `messenger`.
