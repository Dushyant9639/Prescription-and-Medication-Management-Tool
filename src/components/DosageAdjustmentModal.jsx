import { useState } from 'react';
import { X, Plus, Minus, AlertTriangle, Check } from 'lucide-react';
import Button from './Button';

const DosageAdjustmentModal = ({ medication, onClose, onConfirm }) => {
  const [step, setStep] = useState(1); // Step 1: Adjust, Step 2: Confirm
  const [newDosage, setNewDosage] = useState(medication.dosage);
  const [reason, setReason] = useState('');
  const [doctorApproved, setDoctorApproved] = useState(false);

  // Parse dosage value (e.g., "500 mg" -> 500)
  const parseDosage = (dosageStr) => {
    const match = dosageStr.match(/^(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Get dosage unit (e.g., "500 mg" -> "mg")
  const getDosageUnit = (dosageStr) => {
    const match = dosageStr.match(/[a-zA-Z]+/);
    return match ? match[0] : 'mg';
  };

  const currentValue = parseDosage(medication.dosage);
  const unit = getDosageUnit(medication.dosage);
  const [dosageValue, setDosageValue] = useState(currentValue);

  // Determine step increment based on current value
  const getStepIncrement = () => {
    if (dosageValue >= 1000) return 100;
    if (dosageValue >= 100) return 50;
    if (dosageValue >= 10) return 5;
    return 1;
  };

  const increment = getStepIncrement();

  const handleIncrease = () => {
    const newValue = dosageValue + increment;
    setDosageValue(newValue);
    setNewDosage(`${newValue} ${unit}`);
  };

  const handleDecrease = () => {
    const newValue = Math.max(0, dosageValue - increment);
    setDosageValue(newValue);
    setNewDosage(`${newValue} ${unit}`);
  };

  const handleManualInput = (value) => {
    const numValue = parseFloat(value) || 0;
    setDosageValue(numValue);
    setNewDosage(`${numValue} ${unit}`);
  };

  const getDosageChange = () => {
    const diff = dosageValue - currentValue;
    if (diff > 0) return { type: 'increased', amount: diff };
    if (diff < 0) return { type: 'decreased', amount: Math.abs(diff) };
    return { type: 'unchanged', amount: 0 };
  };

  const dosageChange = getDosageChange();
  const hasChanged = dosageChange.type !== 'unchanged';

  const handleNext = () => {
    if (!hasChanged) {
      onClose();
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    onConfirm({
      newDosage,
      previousDosage: medication.dosage,
      reason,
      doctorApproved,
      changeType: dosageChange.type,
      changeAmount: dosageChange.amount,
    });
  };

  const canConfirm = reason.trim() !== '' && doctorApproved;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? 'Adjust Dosage' : 'Confirm Changes'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Adjust Dosage */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Medication Info */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {medication.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current dosage: <span className="font-medium">{medication.dosage}</span>
                </p>
              </div>

              {/* Dosage Stepper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  New Dosage
                </label>
                
                {/* Stepper Controls */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={handleDecrease}
                    className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="flex-1 max-w-xs">
                    <div className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {dosageValue} {unit}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={currentValue * 3}
                      step={increment}
                      value={dosageValue}
                      onChange={(e) => handleManualInput(e.target.value)}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <button
                    onClick={handleIncrease}
                    className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {/* Manual Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={dosageValue}
                    onChange={(e) => handleManualInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter dosage"
                  />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{unit}</span>
                </div>
              </div>

              {/* Change Indicator */}
              {hasChanged && (
                <div
                  className={`p-4 rounded-lg flex items-start space-x-3 ${
                    dosageChange.type === 'increased'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-orange-50 dark:bg-orange-900/20'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      dosageChange.type === 'increased' ? 'text-yellow-600' : 'text-orange-600'
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        dosageChange.type === 'increased'
                          ? 'text-yellow-800 dark:text-yellow-200'
                          : 'text-orange-800 dark:text-orange-200'
                      }`}
                    >
                      Dosage {dosageChange.type} by {dosageChange.amount} {unit}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {medication.dosage} → {newDosage}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="flex-1"
                  disabled={!hasChanged}
                >
                  {hasChanged ? 'Continue' : 'No Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Change Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Medication</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {medication.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Previous Dosage</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {medication.dosage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">New Dosage</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {newDosage}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Important Safety Information
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Only adjust your dosage as directed by your healthcare provider. Never change
                    dosages without medical supervision.
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Change <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Doctor's recommendation, side effects, condition improvement..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Doctor Approval Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="doctorApproval"
                  checked={doctorApproved}
                  onChange={(e) => setDoctorApproved(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="doctorApproval"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I confirm this dosage change has been approved by my healthcare provider{' '}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Change</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DosageAdjustmentModal;
