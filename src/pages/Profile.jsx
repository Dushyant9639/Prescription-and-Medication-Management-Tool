import { useState } from 'react';
import { FileText, X, Download } from 'lucide-react';
import { useStore } from '../store';
import Button from '../components/Button';
import NotificationSettings from '../components/NotificationSettings';
import ProfileManagement from '../components/ProfileManagement';
import PrescriptionUpload from '../components/PrescriptionUpload';
import AISettings from '../components/AISettings';

const Profile = () => {
  const userProfile = useStore((state) => state.userProfile);
  const updateUserProfile = useStore((state) => state.updateUserProfile);
  const addAllergy = useStore((state) => state.addAllergy);
  const removeAllergy = useStore((state) => state.removeAllergy);
  const addCondition = useStore((state) => state.addCondition);
  const removeCondition = useStore((state) => state.removeCondition);
  const addDoctor = useStore((state) => state.addDoctor);
  const updateDoctor = useStore((state) => state.updateDoctor);
  const removeDoctor = useStore((state) => state.removeDoctor);
  const addPrescriptionFile = useStore((state) => state.addPrescriptionFile);
  const removePrescriptionFile = useStore((state) => state.removePrescriptionFile);

  const handlePrescriptionUpload = (file) => {
    addPrescriptionFile(file);
  };

  const handleDownloadPrescription = (file) => {
    // Create download link for base64 data
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information, health details, and prescription documents.</p>
      </div>

      {/* Profile Management Component */}
      <ProfileManagement
        profile={userProfile}
        onUpdate={updateUserProfile}
        onAddAllergy={addAllergy}
        onRemoveAllergy={removeAllergy}
        onAddCondition={addCondition}
        onRemoveCondition={removeCondition}
        onAddDoctor={addDoctor}
        onUpdateDoctor={updateDoctor}
        onRemoveDoctor={removeDoctor}
      />

      {/* Prescription Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Prescription Documents
        </h2>
        <PrescriptionUpload onUpload={handlePrescriptionUpload} />

        {/* Uploaded Files */}
        {userProfile.prescriptionFiles && userProfile.prescriptionFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Uploaded Prescriptions ({userProfile.prescriptionFiles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userProfile.prescriptionFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadPrescription(file)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removePrescriptionFile(file.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Settings */}
      <AISettings />

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <NotificationSettings />
      </div>
    </div>
  );
};

export default Profile;
