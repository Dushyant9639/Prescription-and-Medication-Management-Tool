/**
 * Recurring Reminder Generator Service
 * Generates daily/weekly recurring reminders based on medication schedules
 */

class RecurringReminderService {
  constructor() {
    this.lastGenerated = null;
  }
  generateRecurringReminders(medications, existingReminders = [], daysAhead = 7) {
    const newReminders = [];
    const now = new Date();
    const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    console.log(`🔄 Generating recurring reminders from ${now.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);

    medications.forEach((medication) => {
      // Check if medication has schedule (either array or object)
      if (!medication.schedule || (Array.isArray(medication.schedule) && medication.schedule.length === 0)) return;
      
      // Skip inactive medications
      if (medication.status !== 'active') return;
      
     
      let startDate = now;

      const freq = (medication.frequency || 'daily').toLowerCase();
      
      if (freq.includes('daily') && !freq.includes('twice') && !freq.includes('three')) {
        // "Once daily", "Daily", etc.
        this.generateDailyReminders(medication, startDate, endDate, existingReminders, newReminders);
      } else if (freq.includes('twice')) {
        // "Twice daily", "Twice a day", etc.
        this.generateTwiceDailyReminders(medication, startDate, endDate, existingReminders, newReminders);
      } else if (freq.includes('three')) {
        // "Three times daily", "Three times a day", etc.
        this.generateThreeTimesDailyReminders(medication, startDate, endDate, existingReminders, newReminders);
      } else if (freq.includes('weekly') || freq.includes('week')) {
        // "Weekly", "Once a week", etc.
        this.generateWeeklyReminders(medication, startDate, endDate, existingReminders, newReminders);
      } else if (freq.includes('as needed') || freq.includes('prn')) {
        // Don't auto-generate for as-needed medications
      } else {
        // For custom frequencies, generate based on schedule times
        this.generateDailyReminders(medication, startDate, endDate, existingReminders, newReminders);
      }
    });

    this.lastGenerated = new Date();
    console.log(`✅ Generated ${newReminders.length} new recurring reminders`);
    return newReminders;
  }

  /**
   * Generate daily reminders for a medication
   */
  generateDailyReminders(medication, startDate, endDate, existingReminders, newReminders) {
    let schedules = Array.isArray(medication.schedule) ? medication.schedule : [medication.schedule];
    
    // Filter out invalid schedules
    schedules = schedules.filter(s => s && (typeof s === 'string' || s.time));
    
    if (schedules.length === 0) {
      console.warn(`⚠️ No valid schedules for ${medication.name}`);
      return;
    }
    
    const now = new Date();
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    
    // If start date is today, check today first before moving to tomorrow
    const todayAtMidnight = new Date(now);
    todayAtMidnight.setHours(0, 0, 0, 0);
    
    const isStartingToday = currentDate.getTime() === todayAtMidnight.getTime();
    
    console.log(`💫 Daily reminders for ${medication.name}: now=${now.toLocaleString()}, currentDate=${currentDate.toLocaleString()}, today=${todayAtMidnight.toLocaleString()}, isToday=${isStartingToday}`);

    while (currentDate <= endDate) {
      schedules.forEach((scheduleTime) => {
        if (!scheduleTime) return; // Skip empty schedule times
        
        const reminderTime = this.parseScheduleTime(scheduleTime, currentDate);
        
        // Skip if more than 5 minutes in the past (allow current time and recent times)
        if (reminderTime < now && (now - reminderTime) > 300000) {
          console.log(`⏭️ Skipping past reminder for ${medication.name} at ${reminderTime.toLocaleTimeString()} (${(now - reminderTime) / 1000}s ago)`);
          return;
        }
        
        // Log if creating reminder for current or near-current time
        if (reminderTime <= now && (now - reminderTime) < 300000) {
          console.log(`🔑 Creating reminder for ${medication.name} at current/recent time: ${reminderTime.toLocaleTimeString()}`);
        }

        // Check if reminder already exists
        if (!this.reminderExists(medication.id, reminderTime, existingReminders)) {
          console.log(`✨ Creating daily reminder for ${medication.name} at ${reminderTime.toLocaleString()} (today=${isStartingToday}, on date=${currentDate.toLocaleDateString()})`);
          newReminders.push(this.createReminder(medication, reminderTime, 'daily'));
        } else {
          console.log(`📌 Reminder already exists for ${medication.name} at ${reminderTime.toLocaleTimeString()}`);
        }
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  /**
   * Generate twice daily reminders (morning and evening)
   */
  generateTwiceDailyReminders(medication, startDate, endDate, existingReminders, newReminders) {
    const schedules = medication.schedule && medication.schedule.length >= 2
      ? medication.schedule.slice(0, 2)
      : ['08:00', '20:00'];

    const now = new Date();
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      schedules.forEach((scheduleTime) => {
        const reminderTime = this.parseScheduleTime(scheduleTime, currentDate);
        
        // Skip if more than 5 minutes in the past
        if (reminderTime < now && (now - reminderTime) > 300000) {
          return;
        }
        
        if (!this.reminderExists(medication.id, reminderTime, existingReminders)) {
          newReminders.push(this.createReminder(medication, reminderTime, 'twice-daily'));
        }
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  /**
   * Generate three times daily reminders
   */
  generateThreeTimesDailyReminders(medication, startDate, endDate, existingReminders, newReminders) {
    const schedules = medication.schedule && medication.schedule.length >= 3
      ? medication.schedule.slice(0, 3)
      : ['08:00', '14:00', '20:00'];

    const now = new Date();
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      schedules.forEach((scheduleTime) => {
        const reminderTime = this.parseScheduleTime(scheduleTime, currentDate);
        
        // Skip if more than 5 minutes in the past
        if (reminderTime < now && (now - reminderTime) > 300000) {
          return;
        }
        
        if (!this.reminderExists(medication.id, reminderTime, existingReminders)) {
          newReminders.push(this.createReminder(medication, reminderTime, 'three-times-daily'));
        }
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  /**
   * Generate weekly reminders
   */
  generateWeeklyReminders(medication, startDate, endDate, existingReminders, newReminders) {
    const schedules = Array.isArray(medication.schedule) ? medication.schedule : ['09:00'];
    const weeklyDay = medication.weeklyDay || 0; // Default to Sunday

    const now = new Date();
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      // Check if current day matches weekly day
      if (currentDate.getDay() === weeklyDay) {
        schedules.forEach((scheduleTime) => {
          const reminderTime = this.parseScheduleTime(scheduleTime, currentDate);
          
          // Skip if more than 5 minutes in the past
          if (reminderTime < now && (now - reminderTime) > 300000) {
            return;
          }
          
          if (!this.reminderExists(medication.id, reminderTime, existingReminders)) {
            newReminders.push(this.createReminder(medication, reminderTime, 'weekly'));
          }
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  /**
   * Parse schedule time (HH:MM) and combine with date
   */
  parseScheduleTime(scheduleTime, date) {
    let timeString = scheduleTime;
    
    // Handle different input types
    if (typeof scheduleTime === 'object') {
      // If it's an object, try to extract time string
      timeString = scheduleTime.time || scheduleTime.value || scheduleTime.toString();
    }
    
    // Ensure we have a string
    if (typeof timeString !== 'string') {
      console.warn('⚠️ Invalid schedule time format:', scheduleTime, 'defaulting to 09:00');
      timeString = '09:00';
    }
    
    // Handle time format validation
    if (!timeString.includes(':')) {
      console.warn('⚠️ Schedule time missing colon:', timeString, 'defaulting to 09:00');
      timeString = '09:00';
    }
    
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      
      // Validate hours and minutes
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        console.warn('⚠️ Invalid time values:', timeString, 'defaulting to 09:00');
        const reminderTime = new Date(date);
        reminderTime.setHours(9, 0, 0, 0);
        return reminderTime;
      }
      
      const reminderTime = new Date(date);
      reminderTime.setHours(hours, minutes, 0, 0);
      return reminderTime;
    } catch (error) {
      console.error('❌ Error parsing schedule time:', scheduleTime, error);
      const reminderTime = new Date(date);
      reminderTime.setHours(9, 0, 0, 0);
      return reminderTime;
    }
  }

  /**
   * Check if reminder already exists for medication at specific time
   */
  reminderExists(medicationId, scheduledTime, existingReminders) {
    return existingReminders.some((reminder) => {
      if (reminder.medicationId !== medicationId) return false;
      
      const existingTime = new Date(reminder.scheduledTime);
      const newTime = new Date(scheduledTime);
      
      // Check if same time (within 1 minute tolerance)
      return Math.abs(existingTime - newTime) < 60000;
    });
  }

  /**
   * Create a reminder object
   */
  createReminder(medication, scheduledTime, frequency) {
    // Store the local time as ISO string, but also track it as local time
    // This prevents timezone offset issues when comparing times
    const year = scheduledTime.getFullYear();
    const month = String(scheduledTime.getMonth() + 1).padStart(2, '0');
    const day = String(scheduledTime.getDate()).padStart(2, '0');
    const hours = String(scheduledTime.getHours()).padStart(2, '0');
    const minutes = String(scheduledTime.getMinutes()).padStart(2, '0');
    const seconds = String(scheduledTime.getSeconds()).padStart(2, '0');
    
    // Store as local time string: YYYY-MM-DDTHH:MM:SS (no Z for UTC)
    const localTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
    return {
      id: crypto.randomUUID(),
      medicationId: medication.id,
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledTime: localTimeString,
      status: 'pending',
      frequency,
      recurring: true,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Check if reminders need to be regenerated (daily check)
   */
  shouldRegenerateReminders() {
    if (!this.lastGenerated) return true;
    
    const now = new Date();
    const lastGen = new Date(this.lastGenerated);
    
    // Regenerate if last generation was more than 24 hours ago
    const hoursSinceLastGen = (now - lastGen) / (1000 * 60 * 60);
    return hoursSinceLastGen >= 24;
  }

  /**
   * Clean up old reminders (older than 7 days)
   */
  cleanupOldReminders(reminders) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return reminders.filter((reminder) => {
      const scheduledTime = new Date(reminder.scheduledTime);
      return scheduledTime >= sevenDaysAgo || reminder.status === 'pending';
    });
  }

  /**
   * Get statistics about generated reminders
   */
  getStats(reminders) {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      total: reminders.length,
      pending: 0,
      taken: 0,
      missed: 0,
      today: 0,
      tomorrow: 0,
      upcoming: 0,
    };

    reminders.forEach((reminder) => {
      const scheduledTime = new Date(reminder.scheduledTime);
      
      // Status counts
      if (reminder.status === 'pending') stats.pending++;
      else if (reminder.status === 'taken') stats.taken++;
      else if (reminder.status === 'missed') stats.missed++;

      // Time-based counts
      if (scheduledTime >= today && scheduledTime < tomorrow) {
        stats.today++;
      } else if (scheduledTime >= tomorrow && scheduledTime < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
        stats.tomorrow++;
      } else if (scheduledTime > now) {
        stats.upcoming++;
      }
    });

    return stats;
  }
}

// Singleton instance
export const recurringReminderService = new RecurringReminderService();
