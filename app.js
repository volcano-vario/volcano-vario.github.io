const AUDIO_CACHE = 'kore-audio-v1';
const STATIC_CACHE = 'kore-static-v3';

const TRACKS = [
  { number: 1, title: 'Запись 1', src: 'data/legends/kore_female/poi_1_kore.mp3' },
  { number: 2, title: 'Запись 2', src: 'data/legends/kore_female/poi_2_kore.mp3' },
  { number: 3, title: 'Запись 3', src: 'data/legends/kore_female/poi_3_kore.mp3' },
  { number: 4, title: 'Запись 4', src: 'data/legends/kore_female/poi_4_kore.mp3' },
  { number: 6, title: 'Запись 6', src: 'data/legends/kore_female/poi_6_kore.mp3' },
  { number: 7, title: 'Запись 7', src: 'data/legends/kore_female/poi_7_kore.mp3' },
  { number: 8, title: 'Запись 8', src: 'data/legends/kore_female/poi_8_kore.mp3' },
  { number: 9, title: 'Запись 9', src: 'data/legends/kore_female/poi_9_kore.mp3' },
  { number: 10, title: 'Запись 10', src: 'data/legends/kore_female/poi_10_kore.mp3' },
  { number: 11, title: 'Запись 11', src: 'data/legends/kore_female/poi_11_kore.mp3' },
  { number: 12, title: 'Запись 12', src: 'data/legends/kore_female/poi_12_kore.mp3' },
];

const appFiles = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './sw.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

const elements = {
  audio: document.querySelector('#audio'),
  androidInstall: document.querySelector('#androidInstall'),
  badge: document.querySelector('#connectionBadge'),
  currentTitle: document.querySelector('#currentTitle'),
  downloadText: document.querySelector('#downloadText'),
  downloadTitle: document.querySelector('#downloadTitle'),
  installButton: document.querySelector('#installButton'),
  iosInstall: document.querySelector('#iosInstall'),
  progressBar: document.querySelector('#progressBar'),
  progressFill: document.querySelector('#progressFill'),
  trackList: document.querySelector('#trackList'),
};

let deferredInstallPrompt;
let activeTrackIndex = -1;
let activeObjectUrl;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function setProgress(done, total) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  elements.progressFill.style.width = `${percent}%`;
  elements.progressBar.setAttribute('aria-valuenow', String(percent));
}

function setReadyState() {
  elements.downloadTitle.textContent = 'Готово офлайн';
  elements.downloadText.textContent = `Загружено ${TRACKS.length} записей. Можно слушать без интернета.`;
  elements.badge.textContent = 'Офлайн готов';
  elements.badge.classList.add('is-ready');
  setProgress(TRACKS.length, TRACKS.length);
  setTrackButtonsDisabled(false);
}

function setTrackButtonsDisabled(disabled) {
  document.querySelectorAll('.track-button').forEach((button) => {
    button.disabled = disabled;
  });
}

function renderTracks() {
  elements.trackList.innerHTML = '';

  TRACKS.forEach((track, index) => {
    const button = document.createElement('button');
    button.className = 'track-button';
    button.type = 'button';
    button.disabled = true;
    button.dataset.index = String(index);
    button.innerHTML = `
      <span class="track-number">${track.number}</span>
      <span class="track-title">${track.title}</span>
      <span class="track-state">Слушать</span>
    `;
    button.addEventListener('click', () => playTrack(index));
    elements.trackList.append(button);
  });
}

function markActiveTrack(index) {
  document.querySelectorAll('.track-button').forEach((button) => {
    const isActive = Number(button.dataset.index) === index;
    button.classList.toggle('is-active', isActive);
    button.querySelector('.track-state').textContent = isActive ? 'Играет' : 'Слушать';
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  await navigator.serviceWorker.register('./sw.js');
  await navigator.serviceWorker.ready;
}

async function cacheAppShell() {
  if (!('caches' in window)) {
    return;
  }

  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(appFiles);
}

async function preloadAudio() {
  if (!('caches' in window)) {
    throw new Error('Cache Storage is unavailable');
  }

  const cache = await caches.open(AUDIO_CACHE);
  let completed = 0;
  setProgress(completed, TRACKS.length);

  for (const track of TRACKS) {
    elements.downloadText.textContent = `Загружаю ${track.title}: ${completed + 1} из ${TRACKS.length}`;

    const request = new Request(track.src, { cache: 'reload' });
    const cached = await cache.match(track.src);

    if (!cached) {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error(`${track.title}: ${response.status}`);
      }
      await cache.put(track.src, response.clone());
    }

    completed += 1;
    setProgress(completed, TRACKS.length);
  }
}

async function getTrackBlobUrl(track) {
  const cache = await caches.open(AUDIO_CACHE);
  let response = await cache.match(track.src);

  if (!response) {
    response = await fetch(track.src);
    if (!response.ok) {
      throw new Error(`${track.title}: ${response.status}`);
    }
    await cache.put(track.src, response.clone());
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

async function playTrack(index) {
  const track = TRACKS[index];
  activeTrackIndex = index;
  elements.currentTitle.textContent = track.title;
  markActiveTrack(index);

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
  }

  try {
    activeObjectUrl = await getTrackBlobUrl(track);
    elements.audio.src = activeObjectUrl;
    await elements.audio.play();
  } catch (error) {
    elements.currentTitle.textContent = 'Не удалось открыть запись';
    elements.downloadText.textContent = 'Проверьте подключение и обновите страницу.';
    console.error(error);
  }
}

function playNextTrack() {
  if (activeTrackIndex < 0) {
    return;
  }

  const nextIndex = activeTrackIndex + 1;
  if (nextIndex < TRACKS.length) {
    playTrack(nextIndex);
  }
}

function setupInstallUi() {
  if (isStandalone()) {
    return;
  }

  const androidDevice = isAndroid();

  if (isIos()) {
    elements.iosInstall.hidden = false;
  }

  if (androidDevice) {
    elements.androidInstall.hidden = false;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    if (!androidDevice) {
      return;
    }

    event.preventDefault();
    deferredInstallPrompt = event;
    elements.androidInstall.hidden = false;
    elements.installButton.disabled = false;
  });

  elements.installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = undefined;
    elements.installButton.disabled = true;
  });
}

async function prepareOfflineAudio() {
  try {
    await registerServiceWorker();
    await cacheAppShell();
    await preloadAudio();
    setReadyState();
  } catch (error) {
    elements.downloadTitle.textContent = 'Загрузка не завершилась';
    elements.downloadText.textContent = 'Нужен интернет для первой загрузки аудио.';
    elements.badge.textContent = 'Не готово';
    setTrackButtonsDisabled(false);
    console.error(error);
  }
}

renderTracks();
setupInstallUi();
elements.audio.addEventListener('ended', playNextTrack);
prepareOfflineAudio();
