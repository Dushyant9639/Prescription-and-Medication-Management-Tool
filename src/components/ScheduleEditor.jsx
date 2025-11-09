import { useState } from 'react';
import { Clock, Calendar, Plus, X } from 'lucide-react';
import Button from './Button';

const ScheduleEditor = ({ schedule, onChange }) => {
  // Initialize schedule properly - handle both array and object formats
  const getInitialSchedule = () => {
    if (!schedule) {
      return {
        frequency: 'daily',
        timesPerDay: 1,
        times: ['09:00'],
        daysOfWeek: [],
        customDays: [],
        startDate: new Date().toISOString().split('T')[0],
      };
    }
    
    // If schedule is already an object with frequency, return it
    if (schedule && typeof schedule === 'object' && schedule.frequency) {
      return {
        frequency: schedule.frequency || 'daily',
        timesPerDay: schedule.timesPerDay || 1,
        times: Array.isArray(schedule.times) ? schedule.times : ['09:00'],
        daysOfWeek: Array.isArray(schedule.daysOfWeek) ? schedule.daysOfWeek : [],
        customDays: Array.isArray(schedule.customDays) ? schedule.customDays : [],
        startDate: schedule.startDate || new Date().toISOString().split('T')[0],
      };
    }
    
    // If schedule is just an array of times, convert it to proper format
    if (Array.isArray(schedule)) {
      return {
        frequency: 'daily',
        timesPerDay: schedule.length,
        times: schedule,
        daysOfWeek: [],
        customDays: [],
        startDate: new Date().toISOString().split('T')[0],
      };
    }
    
    // Fallback
    return {
      frequency: 'daily',
      timesPerDay: 1,
      times: ['09:00'],
      daysOfWeek: [],
      customDays: [],
      startDate: new Date().toISOString().split('T')[0],
    };
  };
  
  const [localSchedule, setLocalSchedule] = useState(getInitialSchedule());

  const frequencyOptions = [
    { value: 'daily', label: 'Every Day' },
    { value: 'weekly', label: 'Specific Days of Week' },
    { value: 'interval', label: 'Every X Days' },
    { value: 'asNeeded', label: 'As Needed' },
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ];

  const timesPerDayOptions = [
    { value: 1, label: 'Once daily' },
    { value: 2, label: 'Twice daily' },
    { value: 3, label: 'Three times daily' },
    { value: 4, label: 'Four times daily' },
  ];

  const handleFrequencyChange = (frequency) => {
    const updated = { ...localSchedule, frequency };
    setLocalSchedule(updated);
    onChange(updated);
  };

  const handleTimesPerDayChange = (timesPerDay) => {
    const currentTimes = Array.isArray(localSchedule.times) ? localSchedule.times : [];
    let newTimes = [...currentTimes];

    // Adjust times array based on timesPerDay
    if (timesPerDay > currentTimes.length) {
      // Add more time slots
      const defaultTimes = ['09:00', '14:00', '19:00', '22:00'];
      while (newTimes.length < timesPerDay) {
        newTimes.push(defaultTimes[newTimes.length] || '12:00');
      }
    } else {
      // Remove excess time slots
      newTimes = newTimes.slice(0, timesPerDay);
    }

    const updated = { ...localSchedule, timesPerDay, times: newTimes };
    setLocalSchedule(updated);
    onChange(updated);
  };

  const handleTimeChange = (index, time) => {
    const currentTimes = Array.isArray(localSchedule.times) ? localSchedule.times : [];
    const newTimes = [...currentTimes];
    newTimes[index] = time;
    const updated = { ...localSchedule, times: newTimes };
    setLocalSchedule(updated);
    onChange(updated);
  };

  const handleDayToggle = (day) => {
    const currentDays = Array.isArray(localSchedule.daysOfWeek) ? localSchedule.daysOfWeek : [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    const updated = { ...localSchedule, daysOfWeek: newDays };
    setLocalSchedule(updated);
    onChange(updated);
  };

  const handleIntervalChange = (interval) => {
    const updated = { ...localSchedule, intervalDays: parseInt(interval) };
    setLocalSchedule(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Frequency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Schedule Frequency
        </label>
        <div className="grid grid-cols-2 gap-2">
          {frequencyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFrequencyChange(option.value)}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                localSchedule.frequency === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Schedule */}
      {localSchedule.frequency === 'daily' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Times Per Day
            </label>
            <select
              value={localSchedule.timesPerDay || 1}
              onChange={(e) => handleTimesPerDayChange(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              {timesPerDayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Specific Times
            </label>
            <div className="space-y-2">
              {(Array.isArray(localSchedule.times) ? localSchedule.times : []).map((time, index) => (
                <input
                  key={index}
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Schedule */}
      {localSchedule.frequency === 'weekly' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Days
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    (Array.isArray(localSchedule.daysOfWeek) ? localSchedule.daysOfWeek : []).includes(day.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time of Day
            </label>
            <input
              type="time"
              value={(Array.isArray(localSchedule.times) ? localSchedule.times[0] : '') || '09:00'}
              onChange={(e) => handleTimeChange(0, e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Interval Schedule */}
      {localSchedule.frequency === 'interval' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Take Every X Days
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localSchedule.intervalDays || 1}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time of Day
            </label>
            <input
              type="time"
              value={(Array.isArray(localSchedule.times) ? localSchedule.times[0] : '') || '09:00'}
              onChange={(e) => handleTimeChange(0, e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* As Needed */}
      {localSchedule.frequency === 'asNeeded' && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This medication will be taken as needed. No automatic reminders will be scheduled.
          </p>
        </div>
      )}

      {/* Start Date */}
      {localSchedule.frequency !== 'asNeeded' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={localSchedule.startDate}
            onChange={(e) => {
              const updated = { ...localSchedule, startDate: e.target.value };
              setLocalSchedule(updated);
              onChange(updated);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleEditor;
