# Лабораторная работа №6 (Вариант 6 Погода по городу)

**Выполнил:** Бокор Евгений вариант 6

Веб-приложение на Node.js и Express с mock API погоды. Приложение устанавливается как PWA и работает офлайн.

## Что реализовано по заданию

- Проект инициализирован командой `npm init`, установлен Express.
- Сервер отдаёт статические файлы (HTML, CSS, JS) из папки `public`.
- Реализованы маршруты `GET /` (главная), `GET /about` (о себе), `GET /api/status` (JSON), `GET /api/weather/:city`.
- Данные погоды хардкодом для 5 городов: Moscow, London, Paris, Tokyo, Berlin (регистр не важен).
- Query-параметр `?units=metric` возвращает градусы Цельсия (по умолчанию), `?units=imperial` возвращает градусы Фаренгейта.
- Формат ответа: `{ "city": "Moscow", "temp": 23, "units": "C", "condition": "clear" }`.
- Город не найден: статус `404` и `{ "error": "City not found" }`.
- Добавлен `manifest.json` с иконкой (`icon.png`), подключён в HTML.
- Реализован service worker (`sw.js`): статика кешируется, приложение работает офлайн. Он зарегистрирован в `app.js`.

## Стек и библиотеки

- Node.js
- Express (`express`)
- HTML, CSS, Vanilla JS

## Команды для запуска

1. Установить зависимости: `npm install express`
2. Запустить сервер: `node server.js`
3. Открыть в браузере: `http://localhost:1500`

## Структура

```
server.js        сервер Express, маршруты и данные погоды
package.json
public/
  index.html     главная страница
  about.html     страница «О себе»
  style.css
  app.js         логика страницы, регистрация service worker
  sw.js          service worker (кеш и офлайн)
  manifest.json  манифест PWA
  icon.png       иконка приложения
```

## Примеры запросов

```bash
curl http://localhost:1500/api/weather/Moscow
curl "http://localhost:1500/api/weather/Moscow?units=imperial"
curl -i http://localhost:1500/api/weather/Atlantis
```

## Проверка PWA и офлайна

1. Открыть сайт в Chrome (`localhost` считается безопасным источником).
2. DevTools → Application → Manifest: манифест и иконки без ошибок.
3. Application → Service Workers: статус «activated and is running».
4. Обновить страницу и выбрать несколько городов, чтобы ответы API попали в кеш.
5. Включить «Offline» (или остановить сервер) и обновить страницу: интерфейс загрузится, а данные ранее открытых городов возьмутся из кеша.
6. В адресной строке Chrome появится значок установки.
