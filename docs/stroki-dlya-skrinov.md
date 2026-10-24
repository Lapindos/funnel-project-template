# Что снять с сайта самому

Сайт: https://ga4-analytics-lab-beryl.vercel.app
Код: https://github.com/Lapindos/ga4-analytics-lab

Снимай в редакторе или через «Просмотр кода страницы» опубликованного сайта.
В кадре должны быть адрес `ga4-analytics-lab-beryl.vercel.app` и ID `G-YQM8LSJ9F7`.
Готовый PNG клади в папку домашки под именем из таблицы.

| Куда положить кадр | Какой файл открыть | Какие строки должны попасть в кадр |
|---|---|---|
| `lesson_03/screens/02-tag-in-code.png` | `index.html` | 4–11 и 20–21 |
| `lesson_04/screens/01-code.png` | `js/metrics.js` и `index.html` | весь `js/metrics.js`, плюс строки 20–21 из `index.html` |
| `lesson_05/screens/04-form.png` | `contacts.html` | 26 и 41–44 |
| `lesson_07/screens/06-guide-utm.png` | страница `guide.html` в браузере | не код, а адресная строка целиком |

## Урок 3. Тег на странице

Файл `index.html`. В одном кадре должны быть видны эти строки:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YQM8LSJ9F7"></script>
```

```html
gtag('config', 'G-YQM8LSJ9F7');
```

```html
<script src="js/script.js" defer></script>
<script src="js/metrics.js" defer></script>
```

Это строки 5, 11, 20 и 21. Открывай исходный код опубликованной страницы, чтобы в адресе был сайт:

https://ga4-analytics-lab-beryl.vercel.app/index.html

Тот же тег стоит в `about.html` и `contacts.html`. Для этого кадра хватает `index.html`.

## Урок 4. Файл метрик и строка подключения

Один кадр, два места. Слева или сверху весь `js/metrics.js`, рядом строка подключения из `index.html`.

Подключение, `index.html`, строки 20–21:

```html
<script src="js/script.js" defer></script>
<script src="js/metrics.js" defer></script>
```

В `js/metrics.js` должны читаться четыре события:

```javascript
gtag('event', 'nav_click', {
```

```javascript
gtag('event', 'utm_visit', {
```

```javascript
gtag('event', 'read_30s', {
```

```javascript
gtag('event', 'form_error', {
```

Это строки 9, 20, 33 и 42. Файл на сайте: https://ga4-analytics-lab-beryl.vercel.app/js/metrics.js

## Урок 5. Форма

Файл `contacts.html`. В кадре адрес формы и четыре скрытых поля.

Строка 26, начало тега формы. В `action` должен быть виден конец `/exec`:

```html
<form id="lead-form" action="https://script.google.com/macros/s/AKfycbz9nTkZz5E3ApqD745Ad3ywUMMOntG3QIx3-yv5tK8qGFA6f4qn68OR0Vsl0GDlL6Wb/exec" method="POST" target="submission-frame">
```

Строки 41–44:

```html
<input type="hidden" name="request_id" id="request_id">
<input type="hidden" name="utm_source" id="utm_source">
<input type="hidden" name="utm_medium" id="utm_medium">
<input type="hidden" name="utm_campaign" id="utm_campaign">
```

Страница: https://ga4-analytics-lab-beryl.vercel.app/contacts.html

## Урок 7. Гайд с метками

Код не нужен. Открой в браузере эту ссылку и сними страницу так, чтобы адресная строка была видна целиком, включая `utm_content=reel01`:

```text
https://ga4-analytics-lab-beryl.vercel.app/guide.html?utm_source=instagram&utm_medium=social&utm_campaign=backend_guide&utm_content=reel01
```

На странице должен быть заголовок «Как начать изучать backend».
