import { Pill, Clock, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';
import { formatDate, isExpiringSoon } from '../utils/dateUtils';

const MedicationCard = ({ medication, onRequestRefill, onView }) => {
  const isRefillNeeded = isExpiringSoon(medication.nextRefillDate, 14);
  const isLowRefills = medication.refillsRemaining <= 2;
  const isNoRefills = medication.refillsRemaining === 0;
  const isInactive = medication.status === 'inactive';
  
  // Determine refill status badge
  const getRefillBadge = () => {
    if (medication.refillStatus === 'pending') {
      return { text: '⏳ Pending', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
    if (medication.refillStatus === 'approved') {
      return { text: '✅ Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    }
    if (medication.refillStatus === 'denied') {
      return { text: '❌ Denied', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
    }
    if (isNoRefills) {
      return { text: '🛑 No Refills', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
    }
    if (isLowRefills) {
      return { text: `⚠️ ${medication.refillsRemaining} Refill${medication.refillsRemaining === 1 ? '' : 's'}`, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
    }
    return null;
  };
  
  const refillBadge = getRefillBadge();
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 ${
      isInactive 
        ? 'border-gray-300 dark:border-gray-600 opacity-70' 
        : 'border-transparent hover:border-blue-200 dark:hover:border-blue-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
            <Pill className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{medication.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{medication.dosage}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge variant={medication.status === 'active' ? 'success' : 'default'}>
            {medication.status}
          </Badge>
          {refillBadge && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${refillBadge.color}`}>
              {refillBadge.text}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-700">
          <Clock className="w-4 h-4 mr-2" />
          <span>{medication.frequency}</span>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Purpose:</span> {medication.purpose}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Prescribed by:</span> {medication.prescribedBy}
        </p>
      </div>
      
      {isRefillNeeded && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Refill needed by {formatDate(medication.nextRefillDate)}
          </p>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onView(medication)} className="flex-1">
          View Details
        </Button>
        {(isRefillNeeded || isLowRefills || isNoRefills) && (
          <Button 
            variant={isNoRefills ? "danger" : "primary"} 
            size="sm" 
            onClick={() => onRequestRefill(medication)}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            {medication.refillStatus === 'pending' ? 'Pending' : 'Request Refill'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MedicationCard;
