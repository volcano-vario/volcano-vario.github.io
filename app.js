const AUDIO_CACHE = 'vario-audio-v1';
const STATIC_CACHE = 'vario-static-v41';

const VERSIONED_STYLES = '/styles.css?v=41';
const VERSIONED_APP = '/app.js?v=41';

const legendTracks = [
  ['1', 'Вступление', '/data/audio/kore/poi_1_kore.mp3', '/data/audio/ence/poi_1_ence.mp3'],
  ['2', 'Шаман', '/data/audio/kore/poi_2_kore.mp3', '/data/audio/ence/poi_2_ence.mp3'],
  ['3', 'Лембо', '/data/audio/kore/poi_3_kore.mp3', '/data/audio/ence/poi_3_ence.mp3'],
  ['4', 'Бабочка', '/data/audio/kore/poi_4_kore.mp3', '/data/audio/ence/poi_4_ence.mp3'],
  ['5', 'Оутти', '/data/audio/kore/poi_5_kore.mp3', '/data/audio/ence/poi_5_ence.mp3'],
  ['6', 'Солнце', '/data/audio/kore/poi_6_kore.mp3', '/data/audio/ence/poi_6_ence.mp3'],
  ['7', 'Гнездо', '/data/audio/kore/poi_7_kore.mp3', '/data/audio/ence/poi_7_ence.mp3'],
  ['8', 'Малыш Микко', '/data/audio/kore/poi_8_kore.mp3', '/data/audio/ence/poi_8_ence.mp3'],
  ['9', 'Крылья', '/data/audio/kore/poi_9_kore.mp3', '/data/audio/ence/poi_9_ence.mp3'],
  ['10', 'Ладони', '/data/audio/kore/poi_10_kore.mp3', '/data/audio/ence/poi_10_ence.mp3'],
  ['11', 'Финал', '/data/audio/kore/poi_11_kore.mp3', '/data/audio/ence/poi_11_ence.mp3'],
];

const pages = {
  kore: {
    path: '/kore/',
    cache: 'vario-audio-kore-v1',
    theme: 'legend',
    eyebrow: 'Экотропа Вулкан Варио',
    label: 'KORE',
    title: 'Аудиогид «Легенда»',
    subtitle: 'Маршрут по древнему палеовулкану в окружении карельского леса.',
    tracks: legendTracks.map(([number, title, koreSrc]) => ({ number, title, src: koreSrc })),
  },
  ence: {
    path: '/ence/',
    cache: 'vario-audio-ence-v1',
    theme: 'legend',
    eyebrow: 'Экотропа Вулкан Варио',
    label: 'ENCE',
    title: 'Аудиогид «Легенда»',
    subtitle: 'Маршрут по древнему палеовулкану в окружении карельского леса.',
    tracks: legendTracks.map(([number, title, , enceSrc]) => ({ number, title, src: enceSrc })),
  },
  geo: {
    path: '/geo/',
    cache: 'vario-audio-geo-v1',
    theme: 'geo',
    eyebrow: 'Экотропа Вулкан Варио',
    title: 'Аудиогид «Геология»',
    subtitle: 'Геологические точки маршрута: рельеф, лавы, расщелины и время Ялгоры.',
    tracks: [
      { number: 'Г1', title: 'Вступление', src: '/data/audio/ence_geo/poi_1_geo_ence.mp3?v=2' },
      { number: 'Г2', title: 'Сейсмообвалы', src: '/data/audio/ence_geo/poi_2_geo_ence.mp3' },
      { number: 'Г3', title: 'Рельеф Ялгоры', src: '/data/audio/ence_geo/poi_3_geo_ence.mp3?v=2' },
      { number: 'Г4', title: 'Лавы Ялгоры', src: '/data/audio/ence_geo/poi_4_geo_ence.mp3?v=2' },
      { number: 'Г5', title: 'Вариолиты и кварцевые жилы', src: '/data/audio/ence_geo/poi_5_geo_ence.mp3' },
      { number: 'Г6', title: 'Расщелина', src: '/data/audio/ence_geo/poi_6_geo_ence.mp3?v=2' },
      { number: 'Г7', title: 'Озеро', src: '/data/audio/ence_geo/poi_7_geo_ence.mp3' },
      { number: 'Г8-9', title: 'Дорога', src: '/data/audio/ence_geo/poi_8_9_geo_ence.mp3?v=2' },
      { number: 'Г10', title: 'Ялгора и время', src: '/data/audio/ence_geo/poi_10_geo_ence.mp3' },
      { number: 'Г11', title: 'Финал', src: '/data/audio/ence_geo/poi_11_geo_ence.mp3' },
    ],
  },
};

const appFiles = [
  '/',
  '/index.html',
  '/kore/',
  '/kore/index.html',
  '/ence/',
  '/ence/index.html',
  '/geo/',
  '/geo/index.html',
  VERSIONED_STYLES,
  VERSIONED_APP,
  '/sw.js',
  '/manifest.webmanifest',
  '/manifest-kore.webmanifest',
  '/manifest-ence.webmanifest',
  '/manifest-geo.webmanifest',
  '/favicon.ico?v=16',
  '/icon-192.png?v=16',
  '/icon-512.png?v=16',
  '/data/docs/map-preview.png',
];

const elements = {
  audio: document.querySelector('#audio'),
  badge: document.querySelector('#connectionBadge'),
  copyDebug: document.querySelector('#copyDebug'),
  currentTitle: document.querySelector('#currentTitle'),
  debugLog: document.querySelector('#debugLog'),
  debugPanel: document.querySelector('#debugPanel'),
  download: document.querySelector('#downloadSection'),
  downloadText: document.querySelector('#downloadText'),
  downloadTitle: document.querySelector('#downloadTitle'),
  pageDescription: document.querySelector('#pageDescription'),
  pageEyebrow: document.querySelector('#pageEyebrow'),
  pageLabel: document.querySelector('#pageLabel'),
  pageTitle: document.querySelector('#app-title'),
  player: document.querySelector('#playerSection'),
  playIcon: document.querySelector('#playIcon'),
  playPause: document.querySelector('#playPause'),
  progressBar: document.querySelector('#progressBar'),
  progressFill: document.querySelector('#progressFill'),
  retryDownload: document.querySelector('#retryDownload'),
  routeNav: document.querySelector('#routeNav'),
  seekBar: document.querySelector('#seekBar'),
  seekWrap: document.querySelector('#seekWrap'),
  currentTime: document.querySelector('#currentTime'),
  duration: document.querySelector('#duration'),
  trackList: document.querySelector('#trackList'),
  trackSection: document.querySelector('#trackSection'),
};

const currentPageKey = getPageKey();
const currentPage = pages[currentPageKey];
const currentTracks = currentPage?.tracks || [];
const debugRequested = new URLSearchParams(window.location.search).has('debug');
const debugLines = [];

let activeObjectUrl;
let activeTrackIndex = -1;
let audioReady = false;
let debugCopyReady = false;
let debugVisible = debugRequested;
let isSeeking = false;
let appShellReadyPromise;
let preloadInProgress = false;

function getPageKey() {
  const segment = window.location.pathname.split('/').filter(Boolean)[0];
  return pages[segment] ? segment : null;
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function formatBytes(value) {
  if (!Number.isFinite(value)) {
    return 'unknown';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function trackUrl(track) {
  return new URL(track.src, window.location.origin).href;
}

function cacheName() {
  return currentPage?.cache || AUDIO_CACHE;
}

function shouldPreloadAudio() {
  return Boolean(currentPage);
}

function setProgress(done, total) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  elements.progressFill.style.width = `${percent}%`;
  elements.progressBar.setAttribute('aria-valuenow', String(percent));
}

function setTrackButtonsDisabled(disabled) {
  document.querySelectorAll('.track-button').forEach((button) => {
    button.disabled = disabled;
  });
}

function setPlayerDisabled(disabled) {
  if (elements.playPause) {
    elements.playPause.disabled = disabled;
  }

  if (elements.seekBar) {
    elements.seekBar.disabled = disabled || !Number.isFinite(elements.audio.duration);
  }
}

function updatePlayerUi() {
  if (!elements.audio || !elements.playPause) {
    return;
  }

  const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
  const currentTime = Number.isFinite(elements.audio.currentTime) ? elements.audio.currentTime : 0;
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isPlaying = !elements.audio.paused && !elements.audio.ended;

  elements.playPause.classList.toggle('is-playing', isPlaying);
  elements.playPause.setAttribute('aria-label', isPlaying ? 'Пауза' : 'Воспроизвести');

  if (elements.playIcon) {
    elements.playIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  }

  if (elements.currentTime) {
    elements.currentTime.textContent = formatTime(currentTime);
  }

  if (elements.duration) {
    elements.duration.textContent = formatTime(duration);
  }

  if (elements.seekBar && !isSeeking) {
    elements.seekBar.value = String(percent);
    elements.seekWrap?.style.setProperty('--seek-progress', `${percent}%`);
    elements.seekBar.disabled = !audioReady || duration <= 0;
  }
}

function updateDebugPanel() {
  if (!debugVisible || !elements.debugLog) {
    return;
  }

  elements.debugLog.textContent = debugLines.join('\n');
}

function logDebug(message, details) {
  const time = new Date().toISOString();
  let line = `[${time}] ${message}`;

  if (details !== undefined) {
    try {
      line += ` ${JSON.stringify(details)}`;
    } catch (error) {
      line += ` ${String(details)}`;
    }
  }

  debugLines.push(line);
  if (debugLines.length > 260) {
    debugLines.shift();
  }
  updateDebugPanel();
}

function setupDebugPanel() {
  if (!elements.debugPanel) {
    return;
  }

  if (!debugCopyReady) {
    elements.copyDebug?.addEventListener('click', copyDebugLog);
    debugCopyReady = true;
  }

  if (debugVisible) {
    elements.debugPanel.hidden = false;
    updateDebugPanel();
  }
}

function showDebugPanel(reason) {
  if (!elements.debugPanel) {
    return;
  }

  debugVisible = true;
  setupDebugPanel();
  logDebug('debug panel shown', { reason });
}

async function copyDebugLog() {
  const text = elements.debugLog?.textContent || '';
  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    elements.copyDebug.textContent = 'Скопировано';
    setTimeout(() => {
      elements.copyDebug.textContent = 'Скопировать';
    }, 1800);
  } catch (error) {
    elements.copyDebug.textContent = 'Не скопировалось';
    logDebug('copy failed', { error: error.message });
  }
}

async function hasCachedTrack(cache, track) {
  return Boolean(await cache.match(trackUrl(track)));
}

async function countCachedTracks(cache) {
  let completed = 0;

  for (const track of currentTracks) {
    if (await hasCachedTrack(cache, track)) {
      completed += 1;
    }
  }

  return completed;
}

async function getCachedTrackCount() {
  if (!currentPage || !('caches' in window)) {
    return 0;
  }

  const cache = await caches.open(cacheName());
  return countCachedTracks(cache);
}

async function readDebugSnapshot() {
  const storageEstimate = navigator.storage?.estimate
    ? await navigator.storage.estimate().catch((error) => ({ error: error.message }))
    : null;
  const registration = navigator.serviceWorker?.getRegistration
    ? await navigator.serviceWorker.getRegistration().catch((error) => ({ error: error.message }))
    : null;
  const cacheNames = 'caches' in window
    ? await caches.keys().catch((error) => [`error: ${error.message}`])
    : [];
  const cachedTracks = await getCachedTrackCount().catch((error) => `error: ${error.message}`);

  return {
    page: currentPageKey || 'home',
    url: window.location.href,
    origin: window.location.origin,
    standalone: isStandalone(),
    secureContext: window.isSecureContext,
    online: navigator.onLine,
    userAgent: navigator.userAgent,
    cachesAvailable: 'caches' in window,
    serviceWorkerAvailable: 'serviceWorker' in navigator,
    serviceWorkerControlled: Boolean(navigator.serviceWorker?.controller),
    serviceWorkerScope: registration?.scope || null,
    serviceWorkerActiveState: registration?.active?.state || null,
    cacheNames,
    cachedTracks,
    audioReady,
    preloadInProgress,
    progress: elements.progressBar?.getAttribute('aria-valuenow') || null,
    storageUsage: storageEstimate?.usage ? formatBytes(storageEstimate.usage) : null,
    storageQuota: storageEstimate?.quota ? formatBytes(storageEstimate.quota) : null,
    storageError: storageEstimate?.error || null,
  };
}

async function logDebugSnapshot(label) {
  logDebug(label, await readDebugSnapshot().catch((error) => ({ error: error.message })));
}

function renderRouteNav() {
  if (!elements.routeNav) {
    return;
  }

  const routes = [
    ['kore', 'Легенда'],
    ['ence', 'Легенда Ence'],
    ['geo', 'Геология'],
  ];

  elements.routeNav.replaceChildren();

  routes.forEach(([key, label]) => {
    const link = document.createElement('a');
    link.className = `route-link ${key === currentPageKey ? 'is-active' : ''}`.trim();
    link.href = pages[key].path;
    link.textContent = label;
    elements.routeNav.append(link);
  });
}

function renderHome() {
  document.body.dataset.page = 'home';
  elements.pageEyebrow.textContent = 'Экотропа';
  elements.pageLabel.hidden = true;
  elements.pageTitle.textContent = 'Вулкан Варио';
  elements.pageDescription.textContent = 'Выберите аудиогид маршрута. Каждая страница скачивает свои записи для работы без интернета.';
  elements.badge.textContent = 'Выбор маршрута';
  elements.download.hidden = true;
  elements.player.hidden = true;
  elements.trackSection.hidden = true;
}

function renderPage() {
  if (!currentPage) {
    renderHome();
    return;
  }

  document.body.dataset.page = currentPage.theme;
  document.title = `${currentPage.title} | Вулкан Варио`;
  elements.pageEyebrow.textContent = currentPage.eyebrow;
  elements.pageLabel.textContent = currentPage.label || '';
  elements.pageLabel.hidden = !currentPage.label;
  elements.pageTitle.textContent = currentPage.title;
  elements.pageDescription.textContent = currentPage.subtitle;
  elements.currentTitle.textContent = 'Выберите запись';
  elements.badge.textContent = shouldPreloadAudio() ? 'Подготовка' : 'В браузере';
  elements.download.hidden = !shouldPreloadAudio();
  elements.player.hidden = false;
  elements.trackSection.hidden = false;
}

function renderTracks() {
  elements.trackList.replaceChildren();

  currentTracks.forEach((track, index) => {
    const button = document.createElement('button');
    button.className = 'track-button';
    button.type = 'button';
    button.disabled = true;
    button.dataset.index = String(index);
    const number = document.createElement('span');
    number.className = 'track-number';
    number.dataset.length = String(track.number.length);
    number.textContent = track.number;

    const title = document.createElement('span');
    title.className = 'track-title';
    title.textContent = track.title;

    const state = document.createElement('span');
    state.className = 'track-state';
    state.textContent = 'Слушать';

    button.append(number, title, state);
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

function setReadyState() {
  audioReady = true;
  elements.downloadTitle.textContent = 'Готово офлайн';
  elements.downloadText.textContent = `Загружено ${currentTracks.length} записей. Можно слушать без интернета.`;
  elements.badge.textContent = 'Офлайн готов';
  elements.badge.classList.add('is-ready');
  elements.retryDownload.hidden = true;
  setProgress(currentTracks.length, currentTracks.length);
  setTrackButtonsDisabled(false);
  setPlayerDisabled(currentTracks.length === 0);
  updatePlayerUi();
}

function setLoadingState(done) {
  elements.downloadTitle.textContent = done > 0 ? 'Докачиваю аудио' : 'Загрузка аудио';
  elements.badge.textContent = 'Загрузка';
  elements.badge.classList.remove('is-ready');
  elements.retryDownload.hidden = true;
  setTrackButtonsDisabled(true);
  setPlayerDisabled(true);
}

function setErrorState(done) {
  audioReady = false;
  elements.downloadTitle.textContent = 'Загрузка не завершилась';
  elements.downloadText.textContent = `Загружено ${done} из ${currentTracks.length}. Откройте страницу с интернетом и повторите загрузку.`;
  elements.badge.textContent = 'Не готово';
  elements.badge.classList.remove('is-ready');
  elements.retryDownload.hidden = false;
  setProgress(done, currentTracks.length);
  setTrackButtonsDisabled(false);
  setPlayerDisabled(currentTracks.length === 0);
  showDebugPanel('download error');
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    logDebug('service worker unavailable');
    return;
  }

  logDebug('service worker register start');
  const registration = await navigator.serviceWorker.register('/sw.js');
  logDebug('service worker registered', {
    scope: registration.scope,
    active: registration.active?.state || null,
    installing: registration.installing?.state || null,
    waiting: registration.waiting?.state || null,
  });
  await navigator.serviceWorker.ready;
  logDebug('service worker ready', {
    controlled: Boolean(navigator.serviceWorker.controller),
  });
}

async function cacheAppShell() {
  if (!('caches' in window)) {
    logDebug('app shell cache skipped: caches unavailable');
    return;
  }

  logDebug('app shell cache start', { files: appFiles.length });
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(appFiles);
  logDebug('app shell cache done');
}

async function preloadAudio() {
  if (!currentPage || preloadInProgress) {
    logDebug('audio preload skipped', { currentPage: Boolean(currentPage), preloadInProgress });
    return;
  }

  if (!('caches' in window)) {
    setErrorState(0);
    throw new Error('Cache Storage is unavailable');
  }

  preloadInProgress = true;
  let completed = 0;
  logDebug('audio preload start', { page: currentPageKey, tracks: currentTracks.length });

  try {
    const cache = await caches.open(cacheName());
    completed = await countCachedTracks(cache);
    logDebug('audio cache counted', { completed, total: currentTracks.length });

    setLoadingState(completed);
    setProgress(completed, currentTracks.length);

    if (completed === currentTracks.length) {
      setReadyState();
      return;
    }

    const tracksToFetch = [];

    for (const track of currentTracks) {
      const url = trackUrl(track);
      const cached = await cache.match(url);

      if (!cached) {
        tracksToFetch.push(track);
      } else {
        logDebug('audio already cached', { track: track.number });
      }
    }

    let nextTrackIndex = 0;
    const workerCount = Math.min(3, tracksToFetch.length);

    async function fetchNextTrack() {
      while (nextTrackIndex < tracksToFetch.length) {
        const track = tracksToFetch[nextTrackIndex];
        nextTrackIndex += 1;
        const url = trackUrl(track);
        elements.downloadText.textContent = `Загружаю записи: ${completed + 1} из ${currentTracks.length}`;
        logDebug('audio fetch start', { track: track.number, url });

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`${track.title}: ${response.status}`);
        }

        await cache.put(url, response.clone());
        completed += 1;
        setProgress(completed, currentTracks.length);
        logDebug('audio fetch cached', {
          track: track.number,
          completed,
          total: currentTracks.length,
          status: response.status,
        });
      }
    }

    await Promise.all(Array.from({ length: workerCount }, fetchNextTrack));

    setReadyState();
    logDebugSnapshot('audio preload done');
  } catch (error) {
    setErrorState(completed);
    logDebug('audio preload failed', {
      completed,
      error: error.message,
      name: error.name,
    });
    logDebugSnapshot('failure snapshot');
    throw error;
  } finally {
    preloadInProgress = false;
  }
}

async function getTrackBlobUrl(track) {
  const cache = await caches.open(cacheName());
  const url = trackUrl(track);
  let response = await cache.match(url);

  if (!response) {
    logDebug('playback cache miss, fetching track', { track: track.number });
    response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${track.title}: ${response.status}`);
    }
    await cache.put(url, response.clone());
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

async function setAudioSource(track) {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = undefined;
  }

  if (shouldPreloadAudio()) {
    activeObjectUrl = await getTrackBlobUrl(track);
    elements.audio.src = activeObjectUrl;
    return;
  }

  elements.audio.src = trackUrl(track);
}

async function playTrack(index) {
  const track = currentTracks[index];
  if (!track) {
    return;
  }

  activeTrackIndex = index;
  audioReady = true;
  elements.currentTitle.textContent = track.title;
  markActiveTrack(index);

  try {
    await setAudioSource(track);
    await elements.audio.play();
    setPlayerDisabled(false);
    updatePlayerUi();
    logDebug('playback started', { track: track.number });
  } catch (error) {
    elements.currentTitle.textContent = 'Не удалось открыть запись';
    elements.downloadText.textContent = 'Проверьте подключение и обновите страницу.';
    logDebug('playback failed', { track: track.number, error: error.message });
    console.error(error);
    updatePlayerUi();
  }
}

async function togglePlayback() {
  if (!audioReady || currentTracks.length === 0) {
    return;
  }

  if (activeTrackIndex < 0 || !elements.audio.src) {
    await playTrack(0);
    return;
  }

  if (elements.audio.paused) {
    await elements.audio.play();
  } else {
    elements.audio.pause();
  }
}

function handleTrackEnded() {
  updatePlayerUi();
  logDebug('playback ended', {
    track: currentTracks[activeTrackIndex]?.number,
  });
}

async function prepareAppShell() {
  try {
    logDebug('prepare app shell start');
    await registerServiceWorker();
    await cacheAppShell();
    return true;
  } catch (error) {
    logDebug('prepare app shell failed', { error: error.message, name: error.name });
    console.warn('App shell cache failed', error);
    return false;
  }
}

async function prepareOfflineAudio() {
  let appShellReady = true;

  if (appShellReadyPromise) {
    appShellReady = await appShellReadyPromise;
  }

  if (!currentPage) {
    return;
  }

  if (!appShellReady) {
    const done = await getCachedTrackCount().catch(() => 0);
    setErrorState(done);
    logDebug('audio preload skipped: app shell unavailable', { cached: done, total: currentTracks.length });
    return;
  }

  try {
    await preloadAudio();
  } catch (error) {
    console.error(error);
  }
}

setupDebugPanel();
logDebug('app boot', { debugRequested, page: currentPageKey || 'home' });
logDebugSnapshot('initial snapshot');
renderRouteNav();
renderPage();
renderTracks();
elements.audio.addEventListener('ended', handleTrackEnded);
elements.audio.addEventListener('durationchange', updatePlayerUi);
elements.audio.addEventListener('loadedmetadata', updatePlayerUi);
elements.audio.addEventListener('pause', updatePlayerUi);
elements.audio.addEventListener('play', updatePlayerUi);
elements.audio.addEventListener('timeupdate', updatePlayerUi);
elements.playPause?.addEventListener('click', togglePlayback);
elements.seekBar?.addEventListener('input', () => {
  isSeeking = true;
  elements.seekWrap?.style.setProperty('--seek-progress', `${elements.seekBar.value}%`);
});
elements.seekBar?.addEventListener('change', () => {
  const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
  if (duration > 0) {
    elements.audio.currentTime = (Number(elements.seekBar.value) / 100) * duration;
  }
  isSeeking = false;
  updatePlayerUi();
});
elements.retryDownload?.addEventListener('click', prepareOfflineAudio);
window.addEventListener('online', () => {
  logDebug('browser online event');
  if (!audioReady && shouldPreloadAudio()) {
    prepareOfflineAudio();
  }
});
window.addEventListener('offline', () => {
  logDebug('browser offline event');
  logDebugSnapshot('offline snapshot');
});
window.addEventListener('pageshow', () => {
  logDebug('pageshow event');
  if (!audioReady && shouldPreloadAudio()) {
    prepareOfflineAudio();
  }
});
document.addEventListener('visibilitychange', () => {
  logDebug('visibilitychange event', { hidden: document.hidden });
  if (!document.hidden && !audioReady && shouldPreloadAudio()) {
    prepareOfflineAudio();
  }
});
appShellReadyPromise = prepareAppShell();
appShellReadyPromise.then(prepareOfflineAudio);
