import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Plus } from 'lucide-react';

const AddMedicationModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    schedule: ['09:00'],
    purpose: '',
    prescribedBy: '',
    refillsRemaining: 3,
    nextRefillDate: '',
    instructions: '',
    sideEffects: '',
  });

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every other day',
    'Weekly',
    'As needed',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = value;
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleTime = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, '09:00']
    }));
  };

  const removeScheduleTime = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert side effects string to array
    const sideEffectsArray = formData.sideEffects
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const medication = {
      ...formData,
      sideEffects: sideEffectsArray,
      startDate: new Date(),
      endDate: null,
      nextRefillDate: formData.nextRefillDate ? new Date(formData.nextRefillDate) : null,
      status: 'active',
    };

    onAdd(medication);
    
    // Reset form
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      schedule: ['09:00'],
      purpose: '',
      prescribedBy: '',
      refillsRemaining: 3,
      nextRefillDate: '',
      instructions: '',
      sideEffects: '',
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Medication" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medication Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medication Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Lisinopril"
          />
        </div>

        {/* Dosage and Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage *
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 10mg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency *
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {frequencyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Times */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Times *
          </label>
          <div className="space-y-2">
            {formData.schedule.map((time, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleScheduleChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {formData.schedule.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeScheduleTime(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addScheduleTime}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Time
            </Button>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose *
          </label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Blood pressure management"
          />
        </div>

        {/* Prescribed By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prescribed By
          </label>
          <input
            type="text"
            name="prescribedBy"
            value={formData.prescribedBy}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Dr. Smith"
          />
        </div>

        {/* Refills and Next Refill Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refills Remaining
            </label>
            <input
              type="number"
              name="refillsRemaining"
              value={formData.refillsRemaining}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Refill Date
            </label>
            <input
              type="date"
              name="nextRefillDate"
              value={formData.nextRefillDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Take with food in the morning"
          />
        </div>

        {/* Side Effects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Side Effects (comma separated)
          </label>
          <input
            type="text"
            name="sideEffects"
            value={formData.sideEffects}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Dizziness, Headache, Nausea"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            Add Medication
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMedicationModal;
