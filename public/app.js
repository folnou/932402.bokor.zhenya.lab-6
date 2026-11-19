const CONDITION_LABELS = {
  clear: 'Ясно',
  cloudy: 'Облачно',
  rain: 'Дождь',
  windy: 'Ветрено'
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Не удалось зарегистрировать service worker', error);
    });
  });
}

const offlineBanner = document.getElementById('offline-banner');
const citySelect = document.getElementById('city');
const resultBox = document.getElementById('result');
const installButton = document.getElementById('install-btn');

function updateOnlineStatus() {
  if (offlineBanner) offlineBanner.hidden = navigator.onLine;
}

function renderMessage(text, isError) {
  resultBox.className = isError ? 'result error' : 'result';
  resultBox.replaceChildren();
  const p = document.createElement('p');
  p.textContent = text;
  resultBox.append(p);
}

function renderWeather(data, fromCache) {
  resultBox.className = 'result';
  resultBox.replaceChildren();

  const city = document.createElement('p');
  city.className = 'city';
  city.textContent = citySelect.selectedOptions[0].textContent;

  const temp = document.createElement('p');
  temp.className = 'temp';
  temp.textContent = `${data.temp}°${data.units}`;

  const condition = document.createElement('p');
  condition.className = 'condition';
  condition.textContent = CONDITION_LABELS[data.condition] || data.condition;

  resultBox.append(city, temp, condition);

  if (fromCache) {
    const source = document.createElement('p');
    source.className = 'source';
    source.textContent = 'Данные из кеша (офлайн)';
    resultBox.append(source);
  }
}

async function loadWeather() {
  const units = document.querySelector('input[name="units"]:checked').value;
  const url = `/api/weather/${encodeURIComponent(citySelect.value)}?units=${units}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      renderMessage(data.error || 'Ошибка запроса', true);
      return;
    }

    renderWeather(data, response.headers.get('X-From-Cache') === '1');
  } catch (error) {
    renderMessage('Нет соединения, и для этого запроса нет сохранённых данных', true);
  }
}

if (citySelect && resultBox) {
  citySelect.addEventListener('change', loadWeather);
  document.querySelectorAll('input[name="units"]').forEach((radio) => {
    radio.addEventListener('change', loadWeather);
  });
  loadWeather();
}

window.addEventListener('online', () => {
  updateOnlineStatus();
  if (resultBox) loadWeather();
});
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installButton) installButton.hidden = false;
});

if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  if (installButton) installButton.hidden = true;
});
