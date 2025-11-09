import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, List, BarChart3, X, Pill } from 'lucide-react';
import { useStore } from '../store';
import MedicationTimeline from '../components/MedicationTimeline';
import Badge from '../components/Badge';
import Button from '../components/Button';

const History = () => {
  const medications = useStore((state) => state.medications);
  const medicationHistory = useStore((state) => state.medicationHistory);
  const reminders = useStore((state) => state.reminders);
  const toggleMedicationStatus = useStore((state) => state.toggleMedicationStatus);

  const [activeTab, setActiveTab] = useState('timeline'); // timeline | list | insights | medications
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all | started | stopped | refilled | taken | modified
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | inactive
  const [filterDate, setFilterDate] = useState('all'); // all | today | week | month | custom
  const [showFilters, setShowFilters] = useState(false);

  // Generate history from various sources
  const allHistory = useMemo(() => {
    const history = [...medicationHistory];

    // Add medication start events
    medications.forEach((med) => {
      if (!medicationHistory.some(h => h.medicationId === med.id && h.type === 'started')) {
        history.push({
          id: `start-${med.id}`,
          type: 'started',
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          description: `Started taking ${med.dosage} ${med.frequency}`,
          details: med.purpose,
          prescribedBy: med.prescribedBy,
          timestamp: med.startDate || new Date().toISOString(),
        });
      }
    });

    // Add taken reminders as history
    reminders
      .filter(r => r.status === 'taken' && r.takenAt)
      .forEach((reminder) => {
        history.push({
          id: `taken-${reminder.id}`,
          type: 'taken',
          medicationId: reminder.medicationId,
          medicationName: reminder.medicationName,
          dosage: reminder.dosage,
          description: `Took medication as scheduled`,
          timestamp: reminder.takenAt,
        });
      });

    return history;
  }, [medications, medicationHistory, reminders]);

  // Apply filters
  const filteredHistory = useMemo(() => {
    let filtered = allHistory;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.medicationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((event) => event.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((event) => {
        const med = medications.find(m => m.id === event.medicationId);
        return med?.status === filterStatus;
      });
    }

    // Date filter
    if (filterDate !== 'all') {
      const now = new Date();
      const eventDate = (event) => new Date(event.timestamp);

      filtered = filtered.filter((event) => {
        const date = eventDate(event);
        switch (filterDate) {
          case 'today':
            return date.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [allHistory, searchQuery, filterType, filterStatus, filterDate, medications]);

  // Calculate insights
  const insights = useMemo(() => {
    const totalEvents = filteredHistory.length;
    const takenCount = filteredHistory.filter(e => e.type === 'taken').length;
    const refilledCount = filteredHistory.filter(e => e.type === 'refilled').length;
    const activeMeds = medications.filter(m => m.status === 'active').length;
    const inactiveMeds = medications.filter(m => m.status !== 'active').length;

    // Recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEvents = filteredHistory.filter(e => new Date(e.timestamp) >= weekAgo);

    return {
      totalEvents,
      takenCount,
      refilledCount,
      activeMeds,
      inactiveMeds,
      recentActivity: recentEvents.length,
      averagePerDay: (recentEvents.length / 7).toFixed(1),
    };
  }, [filteredHistory, medications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medication History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your medication timeline, events, and insights
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medications or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Types</option>
                <option value="started">Started</option>
                <option value="stopped">Stopped</option>
                <option value="refilled">Refilled</option>
                <option value="taken">Taken</option>
                <option value="modified">Modified</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medication Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Medications</option>
                <option value="active">Currently Active</option>
                <option value="inactive">Currently Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredHistory.length}</span> event{filteredHistory.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          {[
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'list', label: 'List View', icon: List },
            { id: 'medications', label: 'Medications', icon: Pill },
            { id: 'insights', label: 'Insights', icon: BarChart3 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'timeline' && (
          <MedicationTimeline events={filteredHistory} />
        )}

        {activeTab === 'list' && (
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {event.medicationName}
                        </h3>
                        <Badge variant={event.type === 'started' ? 'success' : event.type === 'stopped' ? 'danger' : 'info'}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      {event.dosage && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Dosage: {event.dosage}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No events match your filters
              </p>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-4">
            {/* Active Medications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Active Medications ({medications.filter(m => m.status === 'active').length})
              </h3>
              <div className="space-y-2">
                {medications.filter(m => m.status === 'active').length > 0 ? (
                  medications.filter(m => m.status === 'active').map((med) => (
                    <div
                      key={med.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{med.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{med.dosage} • {med.frequency}</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-4">No active medications</p>
                )}
              </div>
            </div>

            {/* Inactive Medications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Inactive Medications ({medications.filter(m => m.status === 'inactive').length})
              </h3>
              <div className="space-y-2">
                {medications.filter(m => m.status === 'inactive').length > 0 ? (
                  medications.filter(m => m.status === 'inactive').map((med) => (
                    <div
                      key={med.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{med.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{med.dosage} • {med.frequency}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Purpose: {med.purpose}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="default">Inactive</Badge>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => toggleMedicationStatus(med.id, 'active')}
                          >
                            Reactivate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-4">No inactive medications</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{insights.totalEvents}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Doses Taken</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{insights.takenCount}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Refills</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{insights.refilledCount}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Active Meds</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{insights.activeMeds}</p>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recent Activity (Past 7 Days)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Total Events</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{insights.recentActivity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Average per Day</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{insights.averagePerDay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Active Medications</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{insights.activeMeds}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
