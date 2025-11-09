import { Calendar, Pill, RefreshCw, TrendingUp, TrendingDown, PlayCircle, StopCircle, Edit, Clock } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateUtils';

const MedicationTimeline = ({ events }) => {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Group events by date
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = new Date(event.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  const getEventIcon = (type) => {
    switch (type) {
      case 'started':
        return { Icon: PlayCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
      case 'stopped':
        return { Icon: StopCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
      case 'refilled':
        return { Icon: RefreshCw, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'dosage_increased':
        return { Icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' };
      case 'dosage_decreased':
        return { Icon: TrendingDown, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
      case 'modified':
        return { Icon: Edit, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
      case 'schedule_modified':
        return { Icon: Clock, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' };
      case 'taken':
        return { Icon: Pill, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
      default:
        return { Icon: Calendar, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' };
    }
  };

  const getEventTitle = (event) => {
    switch (event.type) {
      case 'started':
        return `Started ${event.medicationName}`;
      case 'stopped':
        return `Stopped ${event.medicationName}`;
      case 'refilled':
        return `Refilled ${event.medicationName}`;
      case 'dosage_increased':
        return `Increased dosage of ${event.medicationName}`;
      case 'dosage_decreased':
        return `Decreased dosage of ${event.medicationName}`;
      case 'modified':
        return `Modified ${event.medicationName}`;
      case 'schedule_modified':
        return `Updated schedule for ${event.medicationName}`;
      case 'taken':
        return `Took ${event.medicationName}`;
      default:
        return event.medicationName || 'Medication event';
    }
  };

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No History Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your medication history will appear here as you use the app.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(new Date(dateEvents[0].timestamp))}
              </h3>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="relative pl-8">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />

            <div className="space-y-6">
              {dateEvents.map((event, index) => {
                const { Icon, color, bg } = getEventIcon(event.type);
                
                return (
                  <div
                    key={event.id}
                    className="relative group"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[1.4rem] top-1 w-8 h-8 rounded-full ${bg} flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 transition-transform group-hover:scale-110`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>

                    {/* Event Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {getEventTitle(event)}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description}
                          </p>
                          {event.details && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {event.details}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(event.timestamp)}
                          </p>
                          {event.dosage && (
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                              {event.dosage}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      {event.prescribedBy && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Prescribed by:</span> {event.prescribedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationTimeline;
