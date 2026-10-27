# Что снять и какие документы дописать

Код сайта, реестр, приёмник, схема, афиша, QR и черновик презентации уже в папке. Кадры чужого GA4 и выдуманные числа сюда не положены: на защите сверяют ваш Measurement ID и вашу таблицу.

После шагов из [podklyuchenie.md](podklyuchenie.md) сделайте следующее.

## Кадры GA4 — `screens/ga4/`

По одному PNG на событие, параметры раскрыты. Имя файла = имя события.

`page_view.png`, `scroll.png`, `click.png`, `file_download.png`, `form_start.png`, `form_submit.png`, `generate_lead.png`, `cta_click.png`, `trip_filter.png`, `trip_view.png`, `date_select.png`, `guide_view.png`, `rental_calc.png`, `checklist_check.png`, `contact_click.png`, `messenger_click.png`, `social_click.png`, `form_error.png`, `promo_copy.png`, `map_open.png`.

На кадре видны адрес сайта и Measurement ID. Для `rental_calc` отметьте спальник и коврик на 2 суток: в параметре `rental_price` должно быть `1300`. Это испытание И-13.

## Кадры UTM — `screens/utm/`

| Файл | Что на кадре |
|---|---|
| `registry.png` | лист `utm`: формула полной ссылки и пять меток |
| `short-link.png` | адрес сайта после клика по короткой ссылке ВКонтакте, все пять меток на месте |
| `traffic-acquisition.png` | Reports → Acquisition → Traffic acquisition, группировка Session source / medium, не меньше шести пар |

## Кадры Instagram — `screens/instagram/`

`comment-snaryaga.png`, `dm-snaryaga.png`, `comment-novichok.png`, `dm-novichok.png`, `button-url.png`. На кадре с кнопкой виден адрес U-02 или U-03.

## Кадры отчётов — `screens/reports/`

`snapshot.png`, `user-acquisition.png`, `traffic-campaign.png`, `traffic-content.png`, `landing-source.png`, `pages.png`, `events.png`, `key-events.png`, `tech.png`, `comparison.png`, `library.png`, `custom-insight.png`.

Рядом положите выгрузки, которые просит ТЗ:

- `docs/reports/traffic-acquisition.csv` — Share this report → Download file;
- настройки атрибуции (модель и окно) — строкой в `docs/report.md`.

Сравнение в Traffic acquisition: Session source exactly matches `instagram` и Session source exactly matches `(direct)`. Оба на одном кадре `comparison.png`.

Коллекция в Library называется «ТРОПА», отчёт «Кампания winter_trips_2026».

Оповещение: ежедневная проверка, сегмент Session source = `instagram`, сеансы упали больше чем на 50 %, письмо вам. Кадр настроек — `custom-insight.png`.

## Кадры исследований — `screens/explore/`

Названия исследований начинаются с «ТРОПА ·». На кадре виден значок качества данных.

| Файл | Исследование |
|---|---|
| `free-form.png` | свободная форма, фильтр кампании `winter_trips_2026` |
| `free-form-segments.png` | та же форма, сегменты Instagram Sessions и Direct Sessions рядом |
| `funnel-open.png` | открытая воронка: `page_view` → `trip_filter` → `cta_click` → `form_start` → `generate_lead` |
| `funnel-closed.png` | закрытая копия |
| `funnel-source.png` | разбивка по Session source |
| `funnel-device.png` | разбивка по Device category |
| `funnel-time.png` | у `form_start` ограничение «в течение 10 минут» после `cta_click` |
| `path.png` | старт `gear.html`, 3 шага по Page title, один узел раскрыт |
| `reverse-path.png` | конечная точка `generate_lead`, 3 шага по Event name |

Выгрузка свободной формы: `docs/reports/free-form.csv`.

## Кадры DataLens — `screens/datalens/`

`traffic.png`, `leads.png`, `campaigns.png`. На «Кампаниях» видны сеансы, заявки и заявки со статусом `went`.

## Кадры заявки — `screens/kursovaya/`

Уже есть кадры сайта. Добавьте после живой отправки:

| Файл | Что на кадре |
|---|---|
| `05-lead-in-sheet.png` | строка в `leads` с метками |
| `10-lead-went.png` | заявка, прошедшая все статусы до `went` |
| `11-lead-lost.png` | заявка со статусом `lost` |

## Что дописать в документах

| Файл | Что вписать своими словами по кадрам |
|---|---|
| `README.md` | адрес Vercel, ссылка на таблицу, DataLens, посты, Reel, новый Measurement ID, e-mail, которому выдан Viewer |
| `docs/report.md` | все числа из отчётов. Пустые формулировки «число не снято» замените цифрой с кадра |
| `docs/opisanie.md` | период проверок, ссылки на новые кадры, вывод и рекомендация |
| `docs/utm.csv` | после формулы в таблице выгрузите лист заново: короткие ссылки, адреса публикаций, даты, ники блогеров |
| `presentation/zashchita.pdf` | на слайды 7–9 поставьте свои кадры отчётов и одну рекомендацию по цифрам. Исходный текст слайдов — `presentation/slides.md` |
| `kursovaya_rabota/kursovaya.md` | те же ссылки в бланке сдачи |

Раздел «Реклама» в GA4 в России не заполняется: Google Реклама не подключается. В записку впишите, что цепочку перед заявкой показывает обратный путь, а не отчёт атрибуции рекламы.

Видео на защиту, если сеть в аудитории плохая: один проход до 60 секунд, переход по ссылке с UTM → форма → строка в таблице → `generate_lead` в Realtime.
