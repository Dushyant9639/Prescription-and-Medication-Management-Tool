import { useEffect, useRef } from 'react';
import { TrendingUp, CheckCircle, XCircle, Clock, Calendar, Award } from 'lucide-react';
import { useStore } from '../store';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Analytics = () => {
  const medications = useStore((state) => state.medications);
  const reminders = useStore((state) => state.reminders);
  const adherenceRecords = useStore((state) => state.adherenceRecords);
  const getAdherenceStats = useStore((state) => state.getAdherenceStats);
  
  const adherenceChartRef = useRef(null);
  const adherenceChartInstance = useRef(null);
  const weeklyChartRef = useRef(null);
  const weeklyChartInstance = useRef(null);
  const monthlyChartRef = useRef(null);
  const monthlyChartInstance = useRef(null);
  const weeklyBarChartRef = useRef(null);
  const weeklyBarChartInstance = useRef(null);
  
  const stats = getAdherenceStats();
  const activeMedications = medications.filter(m => m.status === 'active');
  const takenReminders = reminders.filter(r => r.status === 'taken');
  const missedReminders = reminders.filter(r => r.status === 'missed');
  const pendingReminders = reminders.filter(r => r.status === 'pending');
  
  // Calculate weekly adherence
  const getWeeklyAdherence = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const validMedicationIds = new Set(medications.map(m => m.id));
    
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayReminders = reminders.filter(r => {
        const reminderDate = new Date(r.scheduledTime);
       
        return reminderDate >= date && 
               reminderDate < nextDay && 
               (r.status === 'taken' || r.status === 'missed') &&
               validMedicationIds.has(r.medicationId);
      });
      
      const taken = dayReminders.filter(r => r.status === 'taken').length;
      const total = dayReminders.length;
      
      return {
        day,
        rate: total > 0 ? Math.round((taken / total) * 100) : 0
      };
    });
    
    return weekData;
  };
  
  // Calculate 30-day adherence
  const get30DayAdherence = () => {
    const data = [];
    const labels = [];
    const today = new Date();
    const validMedicationIds = new Set(medications.map(m => m.id));
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayReminders = reminders.filter(r => {
        const reminderDate = new Date(r.scheduledTime);
       
        return reminderDate >= date && 
               reminderDate < nextDay &&
               (r.status === 'taken' || r.status === 'missed') &&
               validMedicationIds.has(r.medicationId);
      });
      
      const taken = dayReminders.filter(r => r.status === 'taken').length;
      const total = dayReminders.length;
      const rate = total > 0 ? Math.round((taken / total) * 100) : 0;
      
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      data.push(rate);
    }
    
    return { labels, data };
  };
  
  // Calculate 12-week adherence
  const get12WeekAdherence = () => {
    const data = [];
    const labels = [];
    const today = new Date();
    const validMedicationIds = new Set(medications.map(m => m.id));
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekReminders = reminders.filter(r => {
        const reminderDate = new Date(r.scheduledTime);
       
        return reminderDate >= weekStart && 
               reminderDate < weekEnd &&
               (r.status === 'taken' || r.status === 'missed') &&
               validMedicationIds.has(r.medicationId);
      });
      
      const taken = weekReminders.filter(r => r.status === 'taken').length;
      const total = weekReminders.length;
      const rate = total > 0 ? Math.round((taken / total) * 100) : 0;
      
      labels.push(`Week ${12 - i}`);
      data.push(rate);
    }
    
    return { labels, data };
  };
  
  // Calculate current streak
  const currentStreak = (() => {
    const sortedReminders = [...reminders]
      .filter(r => r.status !== 'pending')
      .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
    
    let streak = 0;
    for (const reminder of sortedReminders) {
      if (reminder.status === 'taken') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();
  
  // Adherence Pie Chart
  useEffect(() => {
    if (adherenceChartRef.current) {
      const ctx = adherenceChartRef.current.getContext('2d');
      
      if (adherenceChartInstance.current) {
        adherenceChartInstance.current.destroy();
      }
      
      adherenceChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Taken', 'Missed', 'Pending'],
          datasets: [{
            data: [takenReminders.length, missedReminders.length, pendingReminders.length],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(234, 179, 8, 0.8)'
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(234, 179, 8, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Overall Adherence'
            }
          }
        }
      });
    }
    
    return () => {
      if (adherenceChartInstance.current) {
        try {
          adherenceChartInstance.current.destroy();
        } catch (error) {
          console.warn('Error destroying adherence chart:', error);
        }
        adherenceChartInstance.current = null;
      }
    };
  }, [takenReminders.length, missedReminders.length, pendingReminders.length]);
  
  // Weekly Adherence Line Chart
  useEffect(() => {
    if (weeklyChartRef.current) {
      const ctx = weeklyChartRef.current.getContext('2d');
      const weeklyData = getWeeklyAdherence();
      
      if (weeklyChartInstance.current) {
        weeklyChartInstance.current.destroy();
      }
      
      weeklyChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: weeklyData.map(d => d.day),
          datasets: [{
            label: 'Adherence Rate (%)',
            data: weeklyData.map(d => d.rate),
            borderColor: 'rgba(14, 165, 233, 1)',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: '7-Day Adherence Trend'
            }
          }
        }
      });
    }
    
    return () => {
      if (weeklyChartInstance.current) {
        try {
          weeklyChartInstance.current.destroy();
        } catch (error) {
          console.warn('Error destroying weekly chart:', error);
        }
        weeklyChartInstance.current = null;
      }
    };
  }, [reminders]);
  
  // 30-Day Trend Chart
  useEffect(() => {
    if (monthlyChartRef.current) {
      const ctx = monthlyChartRef.current.getContext('2d');
      const monthlyData = get30DayAdherence();
      
      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy();
      }
      
      monthlyChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthlyData.labels,
          datasets: [{
            label: 'Adherence Rate (%)',
            data: monthlyData.data,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: '30-Day Adherence Trend'
            }
          }
        }
      });
    }
    
    return () => {
      if (monthlyChartInstance.current) {
        try {
          monthlyChartInstance.current.destroy();
        } catch (error) {
          console.warn('Error destroying monthly chart:', error);
        }
        monthlyChartInstance.current = null;
      }
    };
  }, [reminders]);
  
  // 12-Week Bar Chart
  useEffect(() => {
    if (weeklyBarChartRef.current) {
      const ctx = weeklyBarChartRef.current.getContext('2d');
      const weeklyBarData = get12WeekAdherence();
      
      if (weeklyBarChartInstance.current) {
        weeklyBarChartInstance.current.destroy();
      }
      
      weeklyBarChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: weeklyBarData.labels,
          datasets: [{
            label: 'Adherence Rate (%)',
            data: weeklyBarData.data,
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: '12-Week Adherence Overview'
            }
          }
        }
      });
    }
    
    return () => {
      if (weeklyBarChartInstance.current) {
        try {
          weeklyBarChartInstance.current.destroy();
        } catch (error) {
          console.warn('Error destroying weekly bar chart:', error);
        }
        weeklyBarChartInstance.current = null;
      }
    };
  }, [reminders]);
  
  // Show message if no reminders exist
  const hasReminders = reminders.length > 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your medication adherence and progress.</p>
      </div>
      
      {/* Empty State */}
      {!hasReminders && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <Clock className="w-12 h-12 mx-auto text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">No Analytics Data Yet</h3>
          <p className="text-blue-800 dark:text-blue-200">Add medications and create reminders to start tracking your adherence.</p>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adherence Rate</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.adherenceRate}%</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{currentStreak}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Doses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDoses}</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Doses Taken</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.takenDoses}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Doses Missed</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.missedDoses}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 30-Day Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-80">
            <canvas ref={monthlyChartRef}></canvas>
          </div>
        </div>
        
        {/* 12-Week Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-80">
            <canvas ref={weeklyBarChartRef}></canvas>
          </div>
        </div>
        
        {/* 7-Day Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-80">
            <canvas ref={weeklyChartRef}></canvas>
          </div>
        </div>
        
        {/* Adherence Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-80">
            <canvas ref={adherenceChartRef}></canvas>
          </div>
        </div>
      </div>
      
      {/* Medications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Active Medications ({activeMedications.length})
        </h2>
        <div className="space-y-3">
          {activeMedications.map((med) => {
            const medReminders = reminders.filter(r => r.medicationId === med.id);
            const medTaken = medReminders.filter(r => r.status === 'taken').length;
            const medTotal = medReminders.length;
            const medRate = medTotal > 0 ? Math.round((medTaken / medTotal) * 100) : 0;
            
            return (
              <div key={med.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{med.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{med.dosage} • {med.frequency}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{medRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{medTaken}/{medTotal} doses</p>
                </div>
              </div>
            );
          })}
          {activeMedications.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No active medications to track</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
