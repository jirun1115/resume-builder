// Service Worker for AI Resume & Portfolio Builder (PWA)
const CACHE_NAME = "resume-builder-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/static/css/style.css",
  "/static/js/app.js",
  "/static/manifest.json",
  "/static/images/sample2_transparent.png",
  "/static/images/pixel_mandoo_glasses.svg"
];

// 1. 설치 이벤트: 정적 에셋 사전 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. 활성화 이벤트: 구버전 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 페치 이벤트: 네트워크 우선 + 캐시 폴백 (API 생성 요청 제외)
self.addEventListener("fetch", (event) => {
  // AI 생성 API는 캐싱하지 않고 항상 네트워크 호출
  if (event.request.method !== "GET" || event.request.url.includes("/generate")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 유효한 응답이면 캐시에 복사 후 반환
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
