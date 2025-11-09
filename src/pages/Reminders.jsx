import { useState } from 'react';
import { Bell, Clock, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ReminderModal from '../components/ReminderModal';
import { formatTime, getRelativeTime } from '../utils/dateUtils';

const Reminders = () => {
  const reminders = useStore((state) => state.reminders);
  const medications = useStore((state) => state.medications);
  const markReminderTaken = useStore((state) => state.markReminderTaken);
  const markReminderMissed = useStore((state) => state.markReminderMissed);
  const snoozeReminder = useStore((state) => state.snoozeReminder);
  const updateReminder = useStore((state) => state.updateReminder);
  
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'taken', 'missed'
  
  const getMedicationName = (reminder) => {
    // Use medicationName from reminder if available (for recurring reminders)
    if (reminder.medicationName) {
      return reminder.medicationName;
    }
    // Fallback to looking up by medicationId
    const med = medications.find(m => m.id === reminder.medicationId);
    return med ? med.name : 'Unknown Medication';
  };
  
  const getMedicationDosage = (reminder) => {
    // Use dosage from reminder if available (for recurring reminders)
    if (reminder.dosage) {
      return reminder.dosage;
    }
    // Fallback to looking up by medicationId
    const med = medications.find(m => m.id === reminder.medicationId);
    return med ? med.dosage : '';
  };
  
  const handleReminderClick = (reminder) => {
    setSelectedReminder(reminder);
    setIsModalOpen(true);
  };
  
  const handleResetReminder = (reminderId) => {
    updateReminder(reminderId, { status: 'pending', takenAt: null, snoozedUntil: null });
  };
  
  // Filter reminders
  const filteredReminders = reminders.filter(reminder => {
    if (filterStatus === 'all') return true;
    return reminder.status === filterStatus;
  });
  
  // Sort by scheduled time
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    return new Date(b.scheduledTime) - new Date(a.scheduledTime);
  });
  
  const getReminderStatusColor = (status) => {
    switch (status) {
      case 'taken': return 'success';
      case 'pending': return 'warning';
      case 'snoozed': return 'info';
      case 'missed': return 'danger';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        <p className="text-gray-600 mt-1">Manage your medication reminders and schedules.</p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b">
        {['all', 'pending', 'taken', 'missed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
              filterStatus === status
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
            {status !== 'all' && (
              <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                {reminders.filter(r => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Reminders List */}
      {sortedReminders.length > 0 ? (
        <div className="space-y-3">
          {sortedReminders.map((reminder) => {
            const medName = getMedicationName(reminder);
            const medDosage = getMedicationDosage(reminder);
            
            return (
              <div
                key={reminder.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleReminderClick(reminder)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      reminder.status === 'taken' ? 'bg-green-100' :
                      reminder.status === 'pending' ? 'bg-yellow-100' :
                      reminder.status === 'snoozed' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      {reminder.status === 'taken' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : reminder.status === 'missed' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Bell className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{medName}</h3>
                        <Badge variant={getReminderStatusColor(reminder.status)}>
                          {reminder.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{medDosage}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{getRelativeTime(reminder.scheduledTime)}</span>
                      </div>
                      {reminder.takenAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Taken at {formatTime(reminder.takenAt)}
                        </p>
                      )}
                      {reminder.snoozedUntil && (
                        <p className="text-xs text-blue-600 mt-1">
                          Snoozed until {formatTime(reminder.snoozedUntil)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {reminder.status !== 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetReminder(reminder.id);
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {filterStatus !== 'all' ? filterStatus : ''} reminders</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus === 'all'
              ? 'Your medication reminders will appear here.'
              : `You have no ${filterStatus} reminders.`}
          </p>
        </div>
      )}
      
      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminder={selectedReminder}
        onMarkTaken={markReminderTaken}
        onSnooze={snoozeReminder}
        onMarkMissed={markReminderMissed}
      />
    </div>
  );
};

export default Reminders;
