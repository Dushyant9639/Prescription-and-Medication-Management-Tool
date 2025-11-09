// Utility to create test reminders that will trigger soon for testing notifications
import { useStore } from '../store';

export const createTestReminder = (medicationId, medicationName, dosage, secondsFromNow = 10) => {
  const scheduledTime = new Date(Date.now() + secondsFromNow * 1000);
  
  return {
    id: `test-${Date.now()}`,
    medicationId,
    medicationName,
    dosage,
    scheduledTime: scheduledTime.toISOString(),
    status: 'pending',
    frequency: 'test',
    recurring: false,
    takenAt: null,
    snoozedUntil: null,
  };
};

// Add to window for easy testing in console
if (typeof window !== 'undefined') {
  // Expose store to window
  window.useStore = useStore;
  
  // Add test reminder (defaults to 10 seconds)
  window.addTestReminder = (secondsFromNow = 10) => {
    const medications = useStore.getState().medications;
    
    if (medications.length === 0) {
      console.error('❌ No medications found. Add a medication first!');
      return null;
    }
    
    const medication = medications[0];
    const reminder = createTestReminder(
      medication.id,
      medication.name,
      medication.dosage,
      secondsFromNow
    );
    
    useStore.getState().addReminder(reminder);
    
    console.log(`✅ Test reminder added for ${medication.name}`);
    console.log(`⏰ Will trigger in ${secondsFromNow} seconds`);
    console.log(`🕐 Scheduled for: ${new Date(reminder.scheduledTime).toLocaleTimeString()}`);
    console.log('🔔 Watch for browser notification and modal!');
    
    return reminder;
  };
  
  // Quick test - 5 seconds
  window.testNow = () => window.addTestReminder(5);
  
  console.log('\n🧪 TEST UTILITIES LOADED!');
  console.log('====================================');
  console.log('📝 Run these commands in console:');
  console.log('  window.testNow()           - Test in 5 seconds');
  console.log('  window.addTestReminder(10) - Test in 10 seconds');
  console.log('  window.addTestReminder(30) - Test in 30 seconds');
  console.log('====================================\n');
}
