// Notification utilities

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
};

export const scheduleMedicationReminder = (medication, time) => {
  const now = new Date();
  const reminderTime = new Date(time);
  const delay = reminderTime - now;

  if (delay > 0) {
    setTimeout(() => {
      sendNotification(`Time to take ${medication.name}`, {
        body: `Dosage: ${medication.dosage}`,
        tag: `med-${medication.id}`,
        requireInteraction: true,
        actions: [
          { action: 'taken', title: 'Mark as Taken' },
          { action: 'snooze', title: 'Snooze 15 min' },
        ],
      });
    }, delay);
  }
};
