// Register service worker for PWA functionality
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            const { action, reminderId, minutes } = event.data;

            if (action === 'markTaken') {
              // Dispatch custom event to mark reminder as taken
              window.dispatchEvent(
                new CustomEvent('sw-reminder-taken', {
                  detail: { reminderId },
                })
              );
            } else if (action === 'snooze') {
              // Dispatch custom event to snooze reminder
              window.dispatchEvent(
                new CustomEvent('sw-reminder-snooze', {
                  detail: { reminderId, minutes },
                })
              );
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    });

    // Handle service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker updated, reloading page...');
      window.location.reload();
    });
  }
}

// Unregister service worker
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('❌ Service Worker unregistration failed:', error);
      });
  }
}

// Check if app is running as PWA
export function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

// Prompt user to install PWA
export function promptPWAInstall() {
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = event;

    // Show install button
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'block';

      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          // Show the install prompt
          deferredPrompt.prompt();

          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`PWA install outcome: ${outcome}`);

          // Clear the deferredPrompt
          deferredPrompt = null;
          installButton.style.display = 'none';
        }
      });
    }
  });

  // Log when PWA was successfully installed
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
  });
}

// Store offline actions in IndexedDB
export async function storeOfflineAction(action) {
  if (!('indexedDB' in window)) {
    console.warn('IndexedDB not supported');
    return;
  }

  try {
    const db = await openDB();
    const tx = db.transaction('pendingActions', 'readwrite');
    const store = tx.objectStore('pendingActions');
    await store.add({
      ...action,
      timestamp: new Date().toISOString(),
    });
    console.log('📝 Offline action stored:', action);

    // Request background sync if available
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-reminders');
    }
  } catch (error) {
    console.error('Error storing offline action:', error);
  }
}

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MedicationManagerDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingActions')) {
        db.createObjectStore('pendingActions', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

// Check if online
export function isOnline() {
  return navigator.onLine;
}

// Setup online/offline event listeners
export function setupOnlineOfflineListeners() {
  window.addEventListener('online', () => {
    console.log('✅ Back online');
    // Trigger sync
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-reminders');
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('📴 Went offline');
  });
}
