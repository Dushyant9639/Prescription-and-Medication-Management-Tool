import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/DashboardNew';
import Reminders from './pages/Reminders';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import History from './pages/History';
import Help from './pages/Help';
import Badges from './pages/Badges';
import AIAssistant from './components/AIAssistant';
import ChatWidget from './components/ChatWidget';
import ReminderModal from './components/ReminderModal';
import { useStore } from './store';
import { mockMedications, mockUserProfile } from './utils/mockData';
import { requestNotificationPermission } from './utils/notifications';
import { notificationScheduler } from './services/notificationScheduler';
import { recurringReminderService } from './services/recurringReminders';
import { aiAdherenceService } from './services/aiAdherenceService';
import { registerServiceWorker, setupOnlineOfflineListeners, storeOfflineAction, isOnline } from './utils/serviceWorkerRegistration';
import './utils/testReminders'; // Load test utilities

function App() {
  const medications = useStore((state) => state.medications);
  const reminders = useStore((state) => state.reminders);
  const addReminder = useStore((state) => state.addReminder);
  const setUserProfile = useStore((state) => state.setUserProfile);
  const setNotificationsEnabled = useStore((state) => state.setNotificationsEnabled);
  const markReminderTaken = useStore((state) => state.markReminderTaken);
  const markReminderMissed = useStore((state) => state.markReminderMissed);
  const snoozeReminder = useStore((state) => state.snoozeReminder);
  const notificationsEnabled = useStore((state) => state.notificationsEnabled);
  const notificationSettings = useStore((state) => state.notificationSettings);
  const aiSettings = useStore((state) => state.aiSettings);
  const updateAISettings = useStore((state) => state.updateAISettings);
  
  const [dueReminder, setDueReminder] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Register service worker for PWA
  useEffect(() => {
    registerServiceWorker();
    setupOnlineOfflineListeners();
  }, []);
  
  // Handle service worker messages for reminder actions
  useEffect(() => {
    const handleSWReminderTaken = (event) => {
      const { reminderId } = event.detail;
      markReminderTaken(reminderId);
    };
    
    const handleSWReminderSnooze = (event) => {
      const { reminderId, minutes } = event.detail;
      snoozeReminder(reminderId, minutes);
    };
    
    window.addEventListener('sw-reminder-taken', handleSWReminderTaken);
    window.addEventListener('sw-reminder-snooze', handleSWReminderSnooze);
    
    return () => {
      window.removeEventListener('sw-reminder-taken', handleSWReminderTaken);
      window.removeEventListener('sw-reminder-snooze', handleSWReminderSnooze);
    };
  }, [markReminderTaken, snoozeReminder]);
  
  // Initialize with mock data ONLY on first app load (not when user deletes all medications)
  useEffect(() => {
    // Skip mock data loading - users should add their own medications
    // Comment out the section below if you want to enable mock data for development
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
    
    /* Uncomment below to enable mock data on first load:
    if (isFirstLoad && medications.length === 0) {
      console.log('📋 First app load - loading mock data');
      mockMedications.forEach((med) => useStore.getState().addMedication(med));
      setUserProfile(mockUserProfile);
      setIsFirstLoad(false);
    } else if (!isFirstLoad && medications.length === 0) {
      console.log('🗑️ All medications deleted - not reloading mock data');
    } else if (medications.length > 0) {
      setIsFirstLoad(false);
    }
    */
  }, [isFirstLoad]);
  
  // Initialize Gemini API key if not already set (only on first mount)
  useEffect(() => {
    // Set default API key ONLY if empty on first load
    if (!aiSettings.geminiApiKey || aiSettings.geminiApiKey.trim() === '') {
      updateAISettings({ 
        geminiApiKey: 'AIzaSyDr0Slm-FRDKcWR7QbHxWengNTpP-x3CyM'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount
  
  // Initialize AI service whenever API key changes
  useEffect(() => {
    if (aiSettings.geminiApiKey) {
      aiAdherenceService.setApiKey(aiSettings.geminiApiKey);
    }
  }, [aiSettings.geminiApiKey]);
  
  // Request notification permissions on mount
  useEffect(() => {
    const initNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };
    initNotifications();
  }, [setNotificationsEnabled]);
  
  // Auto-generate recurring reminders
  useEffect(() => {
    if (notificationsEnabled && notificationSettings.autoGenerate && medications.length > 0) {
      // Check if reminders need to be regenerated (daily)
      if (recurringReminderService.shouldRegenerateReminders()) {
        console.log('🔄 Auto-generating recurring reminders...');
        
        const newReminders = recurringReminderService.generateRecurringReminders(
          medications,
          reminders,
          notificationSettings.daysAhead
        );
        
        // Add new reminders to store
        newReminders.forEach((reminder) => {
          addReminder(reminder);
        });
        
        // Clean up old reminders
        const cleanedReminders = recurringReminderService.cleanupOldReminders(reminders);
        if (cleanedReminders.length !== reminders.length) {
          console.log(`🧹 Cleaned up ${reminders.length - cleanedReminders.length} old reminders`);
        }
      }
    }
    
    // Check daily for reminder regeneration
    const dailyCheckInterval = setInterval(() => {
      if (notificationsEnabled && notificationSettings.autoGenerate && medications.length > 0) {
        if (recurringReminderService.shouldRegenerateReminders()) {
          const newReminders = recurringReminderService.generateRecurringReminders(
            medications,
            reminders,
            notificationSettings.daysAhead
          );
          newReminders.forEach((reminder) => addReminder(reminder));
        }
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(dailyCheckInterval);
  }, [notificationsEnabled, notificationSettings.autoGenerate, notificationSettings.daysAhead, medications, reminders, addReminder]);
  
  // Start notification scheduler
  useEffect(() => {
    if (notificationsEnabled && medications.length > 0) {
      const handleReminderDue = (reminder) => {
        setDueReminder(reminder);
        setShowReminderModal(true);
      };
      
      // Update scheduler settings
      notificationScheduler.updateSettings({
        sound: notificationSettings.sound,
        vibration: notificationSettings.vibration,
        requireInteraction: notificationSettings.requireInteraction,
      });
      
      notificationScheduler.start(reminders, medications, handleReminderDue);
      
      return () => {
        notificationScheduler.stop();
      };
    }
  }, [notificationsEnabled, reminders, medications, notificationSettings]);
  
  // Reschedule when reminders change
  useEffect(() => {
    if (notificationsEnabled) {
      const handleReminderDue = (reminder) => {
        setDueReminder(reminder);
        setShowReminderModal(true);
      };
      notificationScheduler.reschedule(reminders, medications, handleReminderDue);
    }
  }, [reminders, medications, notificationsEnabled]);

  return (
    <ThemeProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
        </Routes>
        </Layout>
        
        {/* AI Assistant - Available on all pages */}
        <AIAssistant />
        
        {/* Chat Widget - Available on all pages */}
        <ChatWidget />
      
      {/* Global Reminder Modal for notifications */}
      {dueReminder && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => {
            setShowReminderModal(false);
            setDueReminder(null);
          }}
          reminder={dueReminder}
          onMarkTaken={(id) => {
            markReminderTaken(id);
            notificationScheduler.closeNotification(id);
            setShowReminderModal(false);
            setDueReminder(null);
          }}
          onSnooze={(id, minutes) => {
            snoozeReminder(id, minutes);
            notificationScheduler.closeNotification(id);
            setShowReminderModal(false);
            setDueReminder(null);
          }}
          onMarkMissed={(id) => {
            markReminderMissed(id);
            notificationScheduler.closeNotification(id);
            setShowReminderModal(false);
            setDueReminder(null);
          }}
        />
      )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
