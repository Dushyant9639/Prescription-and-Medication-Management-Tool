import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, User, Heart, Phone, Stethoscope, Plus, X, Save, AlertCircle } from 'lucide-react';
import Button from './Button';

// Section component defined outside to prevent re-creation
const Section = ({ id, title, icon: Icon, isExpanded, onToggle, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
    
    {isExpanded && (
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {children}
      </div>
    )}
  </div>
);

const ProfileManagement = ({ profile, onUpdate, onAddAllergy, onRemoveAllergy, onAddCondition, onRemoveCondition, onAddDoctor, onUpdateDoctor, onRemoveDoctor }) => {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    health: false,
    emergency: false,
    doctors: false,
  });

  const [editMode, setEditMode] = useState({
    personal: false,
    health: false,
    emergency: false,
  });

  const [formData, setFormData] = useState({
    personalInfo: profile?.personalInfo || { name: '', dateOfBirth: '', gender: '', email: '', phone: '', address: '' },
    healthInfo: profile?.healthInfo || { allergies: [], conditions: [], bloodType: '', height: '', weight: '' },
    emergencyContact: profile?.emergencyContact || { name: '', relationship: '', phone: '' },
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    address: '',
  });
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  const [errors, setErrors] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleEditMode = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?[\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.personalInfo.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.personalInfo.email && !validateEmail(formData.personalInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.personalInfo.phone && !validatePhone(formData.personalInfo.phone)) {
      newErrors.phone = 'Invalid phone number (min 10 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmergencyContact = () => {
    const newErrors = {};
    
    if (!formData.emergencyContact.name?.trim()) {
      newErrors.emergencyName = 'Emergency contact name is required';
    }
    
    if (!formData.emergencyContact.phone?.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    } else if (!validatePhone(formData.emergencyContact.phone)) {
      newErrors.emergencyPhone = 'Invalid phone number (min 10 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (section) => {
    let isValid = true;

    if (section === 'personal') {
      isValid = validatePersonalInfo();
    } else if (section === 'emergency') {
      isValid = validateEmergencyContact();
    }

    if (isValid) {
      onUpdate({ [section === 'personal' ? 'personalInfo' : section === 'health' ? 'healthInfo' : 'emergencyContact']: formData[section === 'personal' ? 'personalInfo' : section === 'health' ? 'healthInfo' : 'emergencyContact'] });
      toggleEditMode(section);
      setErrors({});
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      onAddAllergy(newAllergy.trim());
      setNewAllergy('');
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      onAddCondition(newCondition.trim());
      setNewCondition('');
    }
  };

  const handleAddDoctor = () => {
    if (newDoctor.name.trim() && newDoctor.phone.trim()) {
      onAddDoctor(newDoctor);
      setNewDoctor({ name: '', specialty: '', phone: '', email: '', address: '' });
      setShowAddDoctor(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <Section 
        id="personal" 
        title="Personal Information" 
        icon={User}
        isExpanded={expandedSections.personal}
        onToggle={() => toggleSection('personal')}
      >
        <div className="space-y-4">
          {editMode.personal ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.name}
                    onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, name: e.target.value } })}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.personalInfo.gender}
                    onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, gender: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, phone: e.target.value } })}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, address: e.target.value } })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSave('personal')} variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => toggleEditMode('personal')} variant="outline">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.personalInfo?.name || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.personalInfo?.dateOfBirth || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                  <dd className="text-sm text-gray-900 dark:text-white capitalize">{profile?.personalInfo?.gender || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.personalInfo?.email || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.personalInfo?.phone || 'Not set'}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.personalInfo?.address || 'Not set'}</dd>
                </div>
              </dl>
              <Button onClick={() => toggleEditMode('personal')} variant="outline" size="sm">
                Edit Information
              </Button>
            </>
          )}
        </div>
      </Section>

      {/* Health Information */}
      <Section 
        id="health" 
        title="Health Information" 
        icon={Heart}
        isExpanded={expandedSections.health}
        onToggle={() => toggleSection('health')}
      >
        <div className="space-y-6">
          {/* Allergies */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Allergies</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile?.healthInfo?.allergies && profile.healthInfo.allergies.length > 0 ? (
                profile.healthInfo.allergies.map((allergy) => (
                  <span
                    key={allergy.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  >
                    {allergy.name}
                    <button
                      onClick={() => onRemoveAllergy(allergy.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No allergies recorded</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                placeholder="Add new allergy"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleAddAllergy} variant="primary" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Medical Conditions</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile?.healthInfo?.conditions && profile.healthInfo.conditions.length > 0 ? (
                profile.healthInfo.conditions.map((condition) => (
                  <span
                    key={condition.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                  >
                    {condition.name}
                    <button
                      onClick={() => onRemoveCondition(condition.id)}
                      className="ml-2 hover:text-orange-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No conditions recorded</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                placeholder="Add medical condition"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleAddCondition} variant="primary" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Additional Health Info */}
          {editMode.health ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Type
                </label>
                <select
                  value={formData.healthInfo.bloodType}
                  onChange={(e) => setFormData({ ...formData, healthInfo: { ...formData.healthInfo, bloodType: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.healthInfo.height}
                  onChange={(e) => setFormData({ ...formData, healthInfo: { ...formData.healthInfo, height: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.healthInfo.weight}
                  onChange={(e) => setFormData({ ...formData, healthInfo: { ...formData.healthInfo, weight: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button onClick={() => handleSave('health')} variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => toggleEditMode('health')} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Type</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.healthInfo?.bloodType || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Height</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.healthInfo?.height ? `${profile.healthInfo.height} cm` : 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.healthInfo?.weight ? `${profile.healthInfo.weight} kg` : 'Not set'}</dd>
                </div>
              </dl>
              <Button onClick={() => toggleEditMode('health')} variant="outline" size="sm">
                Edit Health Info
              </Button>
            </>
          )}
        </div>
      </Section>

      {/* Emergency Contact */}
      <Section 
        id="emergency" 
        title="Emergency Contact" 
        icon={Phone}
        isExpanded={expandedSections.emergency}
        onToggle={() => toggleSection('emergency')}
      >
        <div className="space-y-4">
          {editMode.emergency ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.emergencyName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.emergencyName && <p className="text-xs text-red-500 mt-1">{errors.emergencyName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                    placeholder="e.g., Spouse, Parent"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.emergencyPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave('emergency')} variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => toggleEditMode('emergency')} variant="outline">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.emergencyContact?.name || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.emergencyContact?.relationship || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{profile?.emergencyContact?.phone || 'Not set'}</dd>
                </div>
              </dl>
              <Button onClick={() => toggleEditMode('emergency')} variant="outline" size="sm">
                Edit Contact
              </Button>
            </>
          )}
        </div>
      </Section>

      {/* Doctors */}
      <Section 
        id="doctors" 
        title="Healthcare Providers" 
        icon={Stethoscope}
        isExpanded={expandedSections.doctors}
        onToggle={() => toggleSection('doctors')}
      >
        <div className="space-y-4">
          {profile?.doctors && profile.doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">{doctor.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialty}</p>
                    </div>
                    <button
                      onClick={() => onRemoveDoctor(doctor.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {doctor.phone && <p>📞 {doctor.phone}</p>}
                    {doctor.email && <p>✉️ {doctor.email}</p>}
                    {doctor.address && <p className="text-xs text-gray-600 dark:text-gray-400">📍 {doctor.address}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No doctors added yet</p>
          )}

          {showAddDoctor ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Add New Doctor</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    placeholder="e.g., Cardiologist"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newDoctor.address}
                    onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button onClick={handleAddDoctor} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
                <Button onClick={() => setShowAddDoctor(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowAddDoctor(true)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Healthcare Provider
            </Button>
          )}
        </div>
      </Section>
    </div>
  );
};

export default ProfileManagement;
