const CACHE_NAME = 'medication-manager-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Medication Reminder';
  const options = {
    body: data.body || 'Time to take your medication',
    icon: '/icon-192x192.svg',
    badge: '/icon-192x192.svg',
    data: data,
    actions: [
      { action: 'taken', title: 'Mark Taken' },
      { action: 'snooze', title: 'Snooze 10 min' },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'taken') {
    // Send message to mark reminder as taken
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            client.postMessage({
              action: 'markTaken',
              reminderId: event.notification.data.reminderId,
            });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  } else if (event.action === 'snooze') {
    // Send message to snooze reminder
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            client.postMessage({
              action: 'snooze',
              reminderId: event.notification.data.reminderId,
              minutes: 10,
            });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  } else {
    // Default action - open app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reminders') {
    event.waitUntil(syncReminders());
  }
});

async function syncReminders() {
  try {
    // Get pending actions from IndexedDB
    const db = await openDatabase();
    const tx = db.transaction('pendingActions', 'readonly');
    const store = tx.objectStore('pendingActions');
    const pendingActions = await store.getAll();

    // Process each pending action
    for (const action of pendingActions) {
      // Send to server or update local state
      console.log('Syncing action:', action);
    }

    // Clear pending actions
    const clearTx = db.transaction('pendingActions', 'readwrite');
    const clearStore = clearTx.objectStore('pendingActions');
    await clearStore.clear();
  } catch (error) {
    console.error('Error syncing reminders:', error);
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MedicationManagerDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingActions')) {
        db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
