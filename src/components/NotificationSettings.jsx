import { Bell, Volume2, Vibrate, Clock, Moon, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import { notificationScheduler } from '../services/notificationScheduler';
import { recurringReminderService } from '../services/recurringReminders';

const NotificationSettings = () => {
  const notificationSettings = useStore((state) => state.notificationSettings);
  const updateNotificationSettings = useStore((state) => state.updateNotificationSettings);
  const notificationsEnabled = useStore((state) => state.notificationsEnabled);
  const medications = useStore((state) => state.medications);
  const reminders = useStore((state) => state.reminders);
  const clearRecurringReminders = useStore((state) => state.clearRecurringReminders);
  const addReminder = useStore((state) => state.addReminder);

  const handleToggle = (setting) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };
    updateNotificationSettings(newSettings);
    
    // Update scheduler settings
    notificationScheduler.updateSettings({
      sound: newSettings.sound,
      vibration: newSettings.vibration,
      requireInteraction: newSettings.requireInteraction,
    });
  };

  const handleTimeChange = (field, value) => {
    updateNotificationSettings({ [field]: value });
  };

  const handleDaysAheadChange = (value) => {
    const days = Math.max(1, Math.min(30, parseInt(value) || 7));
    updateNotificationSettings({ daysAhead: days });
  };

  const handleRegenerateReminders = () => {
    if (!notificationSettings.autoGenerate) {
      alert('Please enable "Auto-Generate Reminders" first.');
      return;
    }

    if (medications.length === 0) {
      alert('No medications found. Add medications first.');
      return;
    }

    const confirm = window.confirm(
      `This will clear all ${reminders.filter(r => r.recurring).length} existing recurring reminders and generate new ones for the next ${notificationSettings.daysAhead} day(s).\n\nContinue?`
    );

    if (confirm) {
      // Clear existing recurring reminders
      clearRecurringReminders();
      
      // Force regeneration
      recurringReminderService.lastGenerated = null;
      
      // Generate new reminders
      const newReminders = recurringReminderService.generateRecurringReminders(
        medications,
        [],
        notificationSettings.daysAhead
      );
      
      // Add to store
      newReminders.forEach((reminder) => addReminder(reminder));
      
      alert(`✅ Successfully generated ${newReminders.length} new reminders for the next ${notificationSettings.daysAhead} day(s)!`);
    }
  };

  if (!notificationsEnabled) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Notifications are disabled. Enable them in your browser to configure settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notification Preferences
        </h3>
        
        {/* Sound */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Sound Alert</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Play sound when reminder is due</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('sound')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.sound
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.sound ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Vibration */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Vibrate className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Vibration</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vibrate device for notifications (mobile)</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('vibration')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.vibration
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.vibration ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Require Interaction */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Persistent Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Keep notifications until dismissed</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('requireInteraction')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.requireInteraction
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.requireInteraction ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Auto Generate Reminders */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Auto-Generate Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Automatically create recurring reminders</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('autoGenerate')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.autoGenerate
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.autoGenerate ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Days Ahead */}
        {notificationSettings.autoGenerate && (
          <div className="py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center flex-1">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Days Ahead</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Generate reminders for the next {notificationSettings.daysAhead} days
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={notificationSettings.daysAhead}
                    onChange={(e) => handleDaysAheadChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>
              </div>
              <input
                type="number"
                min="1"
                max="30"
                value={notificationSettings.daysAhead}
                onChange={(e) => handleDaysAheadChange(e.target.value)}
                className="ml-4 w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}

        {/* Quiet Hours */}
        <div className="py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Quiet Hours</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mute notifications during specific hours</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('quietHoursEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.quietHoursEnabled
                  ? 'bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.quietHoursEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {notificationSettings.quietHoursEnabled && (
            <div className="ml-8 flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start</label>
                <input
                  type="time"
                  value={notificationSettings.quietHoursStart}
                  onChange={(e) => handleTimeChange('quietHoursStart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End</label>
                <input
                  type="time"
                  value={notificationSettings.quietHoursEnd}
                  onChange={(e) => handleTimeChange('quietHoursEnd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regenerate Button */}
      {notificationSettings.autoGenerate && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={handleRegenerateReminders}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Regenerate All Reminders
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Clears existing recurring reminders and creates new ones based on current settings
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>Tip:</strong> Enable auto-generate to automatically create reminders based on your medication schedules. After changing "Days Ahead", click "Regenerate All Reminders" to apply the new setting.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
