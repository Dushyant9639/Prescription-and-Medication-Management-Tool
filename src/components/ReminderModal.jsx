import { Bell, Clock, Check, AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { formatTime } from '../utils/dateUtils';

const ReminderModal = ({ isOpen, onClose, reminder, onMarkTaken, onSnooze, onMarkMissed }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [snoozeMinutes, setSnoozeMinutes] = useState(15);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setPulse(true);
      const pulseTimer = setInterval(() => {
        setPulse((prev) => !prev);
      }, 2000);

      return () => clearInterval(pulseTimer);
    }
  }, [isOpen]);

  if (!reminder) return null;

  const handleMarkTaken = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onMarkTaken(reminder.id);
      onClose();
      setShowConfetti(false);
    }, 800);
  };

  const handleSnooze = (minutes) => {
    onSnooze(reminder.id, minutes);
    onClose();
  };

  const handleMarkMissed = () => {
    if (onMarkMissed) {
      onMarkMissed(reminder.id);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center relative">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Animated Bell Icon */}
        <div
          className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-4 transition-transform duration-300 ${
            pulse ? 'scale-110' : 'scale-100'
          }`}
        >
          <Bell className="h-10 w-10 text-blue-600 animate-bounce" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          💊 Time for Your Medication!
        </h3>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          {reminder.medicationName}
        </p>
        
        {/* Dosage Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-700">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{reminder.dosage}</p>
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>Scheduled for {formatTime(reminder.scheduledTime)}</span>
          </div>
        </div>
        
        {/* Primary Action - Mark as Taken */}
        <Button
          variant="primary"
          className="w-full mb-3 text-lg py-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          onClick={handleMarkTaken}
        >
          <Check className="w-5 h-5 mr-2 inline" />
          ✅ Mark as Taken
        </Button>
        
        {/* Snooze Options */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Snooze for:</p>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15].map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleSnooze(minutes)}
                className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium transition-colors"
              >
                ⏰ {minutes} min
              </button>
            ))}
          </div>
        </div>
        
        {/* Custom Snooze */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="120"
              value={snoozeMinutes}
              onChange={(e) => setSnoozeMinutes(Math.max(1, Math.min(120, Number(e.target.value))))}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Custom minutes"
            />
            <button
              onClick={() => handleSnooze(snoozeMinutes)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Snooze
            </button>
          </div>
        </div>
        
        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleMarkMissed}
          >
            <AlertCircle className="w-4 h-4 mr-1 inline" />
            Mark Missed
          </Button>
          
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-1 inline" />
            Dismiss
          </Button>
        </div>
        
        {/* Reminder Info */}
        {reminder.frequency && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            <p>🔁 Recurring: {reminder.frequency}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReminderModal;
