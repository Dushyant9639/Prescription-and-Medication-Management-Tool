import { useState } from 'react';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';
import { Pill, Clock, Calendar, User, AlertTriangle, FileText, Trash2, Power, Edit } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import DosageAdjustmentModal from './DosageAdjustmentModal';
import ScheduleEditor from './ScheduleEditor';

const MedicationDetailsModal = ({ isOpen, onClose, medication, onDelete, onToggleStatus, onAdjustDosage, onUpdateSchedule }) => {
  if (!medication) return null;

  const [isToggling, setIsToggling] = useState(false);
  const [showDosageModal, setShowDosageModal] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const isActive = medication.status === 'active';

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${medication.name}?`)) {
      onDelete(medication.id);
      onClose();
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    const newStatus = isActive ? 'inactive' : 'active';
    
    // Simulate API call
    setTimeout(() => {
      onToggleStatus(medication.id, newStatus);
      setIsToggling(false);
    }, 300);
  };

  const handleDosageAdjustment = (dosageData) => {
    onAdjustDosage(medication.id, dosageData);
    setShowDosageModal(false);
  };

  const handleScheduleUpdate = (schedule) => {
    onUpdateSchedule(medication.id, schedule);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Medication Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
              <Pill className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{medication.name}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">{medication.dosage}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isActive ? 'success' : 'default'}>
              {medication.status}
            </Badge>
            {/* Active/Inactive Toggle */}
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Power className="w-4 h-4" />
              {isToggling ? 'Updating...' : isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        {/* Dosage Section with Edit Button */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Current Dosage</h4>
            <button
              onClick={() => setShowDosageModal(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Adjust
            </button>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{medication.dosage}</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Frequency</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{medication.frequency}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Prescribed By</p>
                <p className="text-sm text-gray-600">{medication.prescribedBy || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Start Date</p>
                <p className="text-sm text-gray-600">{formatDate(medication.startDate)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Purpose</p>
                <p className="text-sm text-gray-600">{medication.purpose}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Refills Remaining</p>
                <p className="text-sm text-gray-600">{medication.refillsRemaining}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Next Refill Date</p>
                <p className="text-sm text-gray-600">
                  {medication.nextRefillDate ? formatDate(medication.nextRefillDate) : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Editor */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Medication Schedule
            </h4>
            <button
              onClick={() => setShowScheduleEditor(!showScheduleEditor)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              {showScheduleEditor ? 'Hide' : 'Edit Schedule'}
            </button>
          </div>
          {showScheduleEditor ? (
            <ScheduleEditor
              schedule={medication.schedule || {
                frequency: 'daily',
                timesPerDay: 1,
                times: medication.schedule || ['09:00'],
                daysOfWeek: [],
                customDays: [],
                startDate: new Date().toISOString().split('T')[0],
              }}
              onChange={handleScheduleUpdate}
            />
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Frequency:</span> {medication.frequency || 'daily'}
              </p>
              {medication.schedule && Array.isArray(medication.schedule) && medication.schedule.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {medication.schedule.map((time, index) => (
                    <Badge key={index} variant="info">
                      {time}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        {medication.instructions && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Instructions
            </h4>
            <p className="text-sm text-gray-700">{medication.instructions}</p>
          </div>
        )}

        {/* Side Effects */}
        {medication.sideEffects && medication.sideEffects.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Possible Side Effects
            </h4>
            <div className="flex flex-wrap gap-2">
              {medication.sideEffects.map((effect, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  {effect}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t dark:border-gray-700">
          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Medication
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Dosage Adjustment Modal */}
      {showDosageModal && (
        <DosageAdjustmentModal
          medication={medication}
          onClose={() => setShowDosageModal(false)}
          onConfirm={handleDosageAdjustment}
        />
      )}
    </Modal>
  );
};

export default MedicationDetailsModal;
