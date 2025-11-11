import { sendNotification } from '../utils/notifications';

class NotificationScheduler {
  constructor() {
    this.timers = new Map();
    this.checkInterval = null;
    this.activeNotifications = new Map(); // Track active notifications
    this.notificationSound = null;
    this.settings = {
      sound: true,
      vibration: true,
      requireInteraction: true,
    };
  }

  /**
   * Update notification settings
   */
  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    console.log('🔧 Notification settings updated:', this.settings);
  }

  start(reminders, medications, onReminderDue) {
    console.log('🔔 Notification scheduler started');
    
    // Check for due reminders every minute
    this.checkInterval = setInterval(() => {
      this.checkDueReminders(reminders, medications, onReminderDue);
    }, 60000); // Check every minute

    // Initial check
    this.checkDueReminders(reminders, medications, onReminderDue);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    // Clear all scheduled timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    console.log('🔕 Notification scheduler stopped');
  }

  checkDueReminders(reminders, medications, onReminderDue) {
    const now = new Date();
    
    reminders.forEach(reminder => {
      if (reminder.status !== 'pending') return;
      
      let scheduledTime = new Date(reminder.scheduledTime);
      
      if (reminder.scheduledTime && !reminder.scheduledTime.includes('Z') && !reminder.scheduledTime.includes('+') && reminder.scheduledTime.includes('T')) {
        const parts = reminder.scheduledTime.split('T');
        const [year, month, day] = parts[0].split('-').map(Number);
        const [hours, minutes, seconds] = (parts[1] || '00:00:00').split(':').map(Number);
        scheduledTime = new Date(year, month - 1, day, hours, minutes, seconds || 0);
      }
      
      const timeDiff = scheduledTime.getTime() - now.getTime();
      
      // Debug logging
      // console.log(`⏰ Checking reminder: ${reminder.medicationName} scheduled at ${scheduledTime.toLocaleTimeString()} (diff: ${timeDiff}ms = ${Math.round(timeDiff / 60000)} min)`);
      
      // Find medication for this reminder
      const medication = medications.find(m => m.id === reminder.medicationId);
      
      // Skip if medication not found
      if (!medication) return;
    
      if (timeDiff <= 5000 && timeDiff > -300000) {
        console.log(`🔔 Triggering notification for ${medication.name} (time diff: ${timeDiff}ms)`);
        this.triggerNotification(reminder, medication, onReminderDue);
      }
      
      if (timeDiff > 5000 && timeDiff < 86400000) {
        this.scheduleNotification(reminder, medication, timeDiff, onReminderDue);
      }
    });
  }

  triggerNotification(reminder, medication, onReminderDue, onMarkTaken, onSnooze) {
    console.log('🔔 Triggering notification for:', medication.name);
    
    // Play notification sound if enabled
    if (this.settings.sound) {
      this.playNotificationSound();
    }

    // Prepare notification options
    const notificationOptions = {
      body: `Dosage: ${medication.dosage}\nScheduled: ${new Date(reminder.scheduledTime).toLocaleTimeString()}\n\nClick to mark as taken or snooze`,
      tag: `reminder-${reminder.id}`,
      requireInteraction: this.settings.requireInteraction,
      icon: '/vite.svg',
      badge: '/vite.svg',
      data: {
        reminderId: reminder.id,
        medicationId: medication.id,
        action: 'show-modal',
      },
    };

    // Add vibration if enabled
    if (this.settings.vibration && 'vibrate' in navigator) {
      notificationOptions.vibrate = [200, 100, 200, 100, 200];
    }

  
    const notification = sendNotification(
      `💊 Time to take ${medication.name}`,
      notificationOptions
    );

    if (notification) {
      // Store active notification
      this.activeNotifications.set(reminder.id, notification);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        onReminderDue(reminder);
        notification.close();
        this.activeNotifications.delete(reminder.id);
      };

      // Handle notification close
      notification.onclose = () => {
        this.activeNotifications.delete(reminder.id);
      };
    }
    
    // Also trigger in-app callback
    onReminderDue(reminder);
  }

  /**
   * Play notification sound
   */
  playNotificationSound() {
    try {
      // Use Web Audio API for a simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('🔇 Could not play notification sound:', error);
    }
  }

  /**
   * Close notification programmatically
   */
  closeNotification(reminderId) {
    const notification = this.activeNotifications.get(reminderId);
    if (notification) {
      notification.close();
      this.activeNotifications.delete(reminderId);
    }
  }

  scheduleNotification(reminder, medication, delay, onReminderDue) {
    // Don't schedule if already scheduled
    if (this.timers.has(reminder.id)) return;
    
    const timer = setTimeout(() => {
      this.triggerNotification(reminder, medication, onReminderDue);
      this.timers.delete(reminder.id);
    }, delay);
    
    this.timers.set(reminder.id, timer);
    console.log(`⏰ Scheduled notification for ${medication.name} in ${Math.round(delay / 60000)} minutes`);
  }

  reschedule(reminders, medications, onReminderDue) {
    // Clear existing timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    // Re-check all reminders
    this.checkDueReminders(reminders, medications, onReminderDue);
  }
}

// Singleton instance
export const notificationScheduler = new NotificationScheduler();
