const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 1500;
const PUBLIC_DIR = path.join(__dirname, 'public');

const CITIES = new Map([
  ['moscow', { name: 'Moscow', tempC: 23, condition: 'clear' }],
  ['london', { name: 'London', tempC: 15, condition: 'cloudy' }],
  ['paris', { name: 'Paris', tempC: 19, condition: 'rain' }],
  ['tokyo', { name: 'Tokyo', tempC: 27, condition: 'clear' }],
  ['berlin', { name: 'Berlin', tempC: 17, condition: 'windy' }]
]);

function findCity(rawName) {
  return CITIES.get(String(rawName).trim().toLowerCase()) || null;
}

function resolveUnits(rawUnits) {
  if (rawUnits === undefined) return 'C';
  if (typeof rawUnits !== 'string') return null;
  const value = rawUnits.trim().toLowerCase();
  if (value === 'metric' || value === 'c') return 'C';
  if (value === 'imperial' || value === 'f') return 'F';
  return null;
}

function convertTemp(tempC, units) {
  if (units === 'F') return Math.round((tempC * 9 / 5 + 32) * 10) / 10;
  return tempC;
}

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'about.html'));
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/cities', (req, res) => {
  res.json({ cities: Array.from(CITIES.values(), (city) => city.name) });
});

app.get('/api/weather/:city', (req, res) => {
  const city = findCity(req.params.city);
  if (!city) {
    return res.status(404).json({ error: 'City not found' });
  }

  const units = resolveUnits(req.query.units);
  if (!units) {
    return res.status(400).json({ error: 'Invalid units. Use metric or imperial' });
  }

  res.json({
    city: city.name,
    temp: convertTemp(city.tempC, units),
    units,
    condition: city.condition
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(
  express.static(PUBLIC_DIR, {
    setHeaders(res, filePath) {
      if (path.basename(filePath) === 'sw.js') {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  })
);

app.use((req, res) => {
  res.status(404).type('text/plain; charset=utf-8').send('Страница не найдена');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
