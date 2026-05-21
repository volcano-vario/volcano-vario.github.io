const AUDIO_CACHE = 'kore-audio-v1';
const STATIC_CACHE = 'kore-static-v6';

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
  './styles.css?v=6',
  './app.js?v=6',
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
  copyDebug: document.querySelector('#copyDebug'),
  debugLog: document.querySelector('#debugLog'),
  debugPanel: document.querySelector('#debugPanel'),
  currentTitle: document.querySelector('#currentTitle'),
  downloadText: document.querySelector('#downloadText'),
  downloadTitle: document.querySelector('#downloadTitle'),
  installButton: document.querySelector('#installButton'),
  iosInstall: document.querySelector('#iosInstall'),
  progressBar: document.querySelector('#progressBar'),
  progressFill: document.querySelector('#progressFill'),
  retryDownload: document.querySelector('#retryDownload'),
  trackList: document.querySelector('#trackList'),
};

let deferredInstallPrompt;
let activeTrackIndex = -1;
let activeObjectUrl;
let audioReady = false;
let preloadInProgress = false;
const debugRequested = new URLSearchParams(window.location.search).has('debug');
const debugLines = [];
let debugVisible = debugRequested;
let debugCopyReady = false;

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

async function getCachedTrackCount() {
  if (!('caches' in window)) {
    return 0;
  }

  const cache = await caches.open(AUDIO_CACHE);
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
    url: window.location.href,
    origin: window.location.origin,
    standalone: isStandalone(),
    secureContext: window.isSecureContext,
    online: navigator.onLine,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
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
  audioReady = true;
  elements.downloadTitle.textContent = 'Готово офлайн';
  elements.downloadText.textContent = `Загружено ${TRACKS.length} записей. Можно слушать без интернета.`;
  elements.badge.textContent = 'Офлайн готов';
  elements.badge.classList.add('is-ready');
  if (elements.retryDownload) {
    elements.retryDownload.hidden = true;
  }
  setProgress(TRACKS.length, TRACKS.length);
  setTrackButtonsDisabled(false);
}

function setLoadingState(done) {
  elements.downloadTitle.textContent = done > 0 ? 'Докачиваю аудио' : 'Загрузка аудио';
  elements.badge.textContent = 'Загрузка';
  elements.badge.classList.remove('is-ready');
  if (elements.retryDownload) {
    elements.retryDownload.hidden = true;
  }
  setTrackButtonsDisabled(true);
}

function setErrorState(done) {
  audioReady = false;
  elements.downloadTitle.textContent = 'Загрузка не завершилась';
  elements.downloadText.textContent = `Загружено ${done} из ${TRACKS.length}. Откройте приложение с интернетом и повторите загрузку.`;
  elements.badge.textContent = 'Не готово';
  elements.badge.classList.remove('is-ready');
  if (elements.retryDownload) {
    elements.retryDownload.hidden = false;
  }
  setProgress(done, TRACKS.length);
  setTrackButtonsDisabled(false);
  showDebugPanel('download error');
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
    logDebug('service worker unavailable');
    return;
  }

  logDebug('service worker register start');
  const registration = await navigator.serviceWorker.register('./sw.js');
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

function trackUrl(track) {
  return new URL(track.src, window.location.href).href;
}

async function hasCachedTrack(cache, track) {
  return Boolean(await cache.match(trackUrl(track)));
}

async function countCachedTracks(cache) {
  let completed = 0;

  for (const track of TRACKS) {
    if (await hasCachedTrack(cache, track)) {
      completed += 1;
    }
  }

  return completed;
}

async function preloadAudio() {
  if (preloadInProgress) {
    logDebug('audio preload skipped: already running');
    return;
  }

  if (!('caches' in window)) {
    setErrorState(0);
    throw new Error('Cache Storage is unavailable');
  }

  preloadInProgress = true;
  let completed = 0;
  logDebug('audio preload start', { tracks: TRACKS.length });

  try {
    const cache = await caches.open(AUDIO_CACHE);
    completed = await countCachedTracks(cache);
    logDebug('audio cache counted', { completed, total: TRACKS.length });

    setLoadingState(completed);
    setProgress(completed, TRACKS.length);

    if (completed === TRACKS.length) {
      setReadyState();
      return;
    }

    for (const track of TRACKS) {
      const url = trackUrl(track);
      const cached = await cache.match(url);

      if (!cached) {
        elements.downloadText.textContent = `Загружаю ${track.title}: ${completed + 1} из ${TRACKS.length}`;
        logDebug('audio fetch start', { track: track.number, url });

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`${track.title}: ${response.status}`);
        }

        await cache.put(url, response.clone());
        completed += 1;
        setProgress(completed, TRACKS.length);
        logDebug('audio fetch cached', {
          track: track.number,
          completed,
          total: TRACKS.length,
          status: response.status,
        });
      } else {
        logDebug('audio already cached', { track: track.number });
      }
    }

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
  const cache = await caches.open(AUDIO_CACHE);
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
    logDebug('playback started', { track: track.number });
  } catch (error) {
    elements.currentTitle.textContent = 'Не удалось открыть запись';
    elements.downloadText.textContent = 'Проверьте подключение и обновите страницу.';
    logDebug('playback failed', { track: track.number, error: error.message });
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
    logDebug('beforeinstallprompt received');
  });

  elements.installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    logDebug('install prompt finished');
    deferredInstallPrompt = undefined;
    elements.installButton.disabled = true;
  });
}

async function prepareAppShell() {
  try {
    logDebug('prepare app shell start');
    await registerServiceWorker();
    await cacheAppShell();
  } catch (error) {
    logDebug('prepare app shell failed', { error: error.message, name: error.name });
    console.warn('App shell cache failed', error);
  }
}

async function prepareOfflineAudio() {
  try {
    await preloadAudio();
  } catch (error) {
    console.error(error);
  }
}

setupDebugPanel();
logDebug('app boot', { debugRequested });
logDebugSnapshot('initial snapshot');
renderTracks();
setupInstallUi();
elements.audio.addEventListener('ended', playNextTrack);
elements.retryDownload?.addEventListener('click', prepareOfflineAudio);
window.addEventListener('online', () => {
  logDebug('browser online event');
  if (!audioReady) {
    prepareOfflineAudio();
  }
});
window.addEventListener('offline', () => {
  logDebug('browser offline event');
  logDebugSnapshot('offline snapshot');
});
window.addEventListener('pageshow', () => {
  logDebug('pageshow event');
  if (!audioReady) {
    prepareOfflineAudio();
  }
});
document.addEventListener('visibilitychange', () => {
  logDebug('visibilitychange event', { hidden: document.hidden });
  if (!document.hidden && !audioReady) {
    prepareOfflineAudio();
  }
});
prepareAppShell();
prepareOfflineAudio();
