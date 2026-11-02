
import { immutable, assets, prerendered } from '$app/manifest';
import { version } from '$app/env';
import { resolve } from '$app/paths';

const CACHE = 'kanban-' + version;

const FILES = [
  ...immutable,
  ...assets,
  ...prerendered
].map((file) => resolve(file));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const file of FILES) {
        try {
          await cache.add(file);
        } catch (error) {
          console.error('Cache failed for:', file, error);
        }
      }
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      for (const key of keys) {
        if (key.startsWith('kanban-') && key !== CACHE) {
          await caches.delete(key);
        }
      }

      await self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
