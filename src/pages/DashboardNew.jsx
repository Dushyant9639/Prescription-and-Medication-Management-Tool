import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Pill, Bell, Calendar, TrendingUp, Plus, Settings, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import MedicationCard from '../components/MedicationCard';
import ReminderModal from '../components/ReminderModal';
import AddMedicationModal from '../components/AddMedicationModal';
import MedicationDetailsModal from '../components/MedicationDetailsModal';
import RefillRequestModal from '../components/RefillRequestModal';
import DraggableWidget from '../components/DraggableWidget';
import Badge from '../components/Badge';
import AdherenceInsights from '../components/AdherenceInsights';

const DashboardNew = () => {
  const medications = useStore((state) => state.medications);
  const reminders = useStore((state) => state.reminders);
  const markReminderTaken = useStore((state) => state.markReminderTaken);
  const snoozeReminder = useStore((state) => state.snoozeReminder);
  const getAdherenceStats = useStore((state) => state.getAdherenceStats);
  const addMedication = useStore((state) => state.addMedication);
  const deleteMedication = useStore((state) => state.deleteMedication);
  const toggleMedicationStatus = useStore((state) => state.toggleMedicationStatus);
  const requestMedicationRefill = useStore((state) => state.requestMedicationRefill);
  const adjustMedicationDosage = useStore((state) => state.adjustMedicationDosage);
  const updateMedicationSchedule = useStore((state) => state.updateMedicationSchedule);
  const dashboardLayout = useStore((state) => state.dashboardLayout);
  const updateDashboardLayout = useStore((state) => state.updateDashboardLayout);
  const resetDashboardLayout = useStore((state) => state.resetDashboardLayout);
  
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [isMedicationDetailsModalOpen, setIsMedicationDetailsModalOpen] = useState(false);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const activeMedications = medications.filter((med) => med.status === 'active');
  const allMedications = medications; // Show all medications regardless of status
  const pendingReminders = reminders.filter((rem) => rem.status === 'pending');
  const stats = getAdherenceStats();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = dashboardLayout.widgetOrder.indexOf(active.id);
      const newIndex = dashboardLayout.widgetOrder.indexOf(over.id);
      
      const newOrder = arrayMove(dashboardLayout.widgetOrder, oldIndex, newIndex);
      
      updateDashboardLayout({
        ...dashboardLayout,
        widgetOrder: newOrder,
      });
    }
  };
  
  const handleToggleVisibility = (widgetId) => {
    updateDashboardLayout({
      ...dashboardLayout,
      visibleWidgets: {
        ...dashboardLayout.visibleWidgets,
        [widgetId]: !dashboardLayout.visibleWidgets[widgetId],
      },
    });
  };
  
  const handleRequestRefill = (medication) => {
    setSelectedMedication(medication);
    setIsRefillModalOpen(true);
  };
  
  const handleViewMedication = (medication) => {
    setSelectedMedication(medication);
    setIsMedicationDetailsModalOpen(true);
  };
  
  const handleAddMedication = (medication) => {
    addMedication(medication);
    alert(`${medication.name} has been added successfully!`);
  };
  
  const handleAdjustDosage = (medicationId, dosageData) => {
    adjustMedicationDosage(medicationId, dosageData);
    alert('Dosage adjusted successfully!');
  };
  
  const handleUpdateSchedule = (medicationId, schedule) => {
    updateMedicationSchedule(medicationId, schedule);
    alert('Schedule updated successfully!');
  };
  
  const widgets = {
    'stats': (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Medications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeMedications.length}</p>
            </div>
            <Pill className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reminders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingReminders.length}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Refills</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adherence Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.adherenceRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    ),
    'pending-reminders': pendingReminders.length > 0 && (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              You have {pendingReminders.length} pending medication reminder(s)
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {pendingReminders.map((reminder) => (
                <Badge
                  key={reminder.id}
                  variant="warning"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedReminder(reminder);
                    setIsReminderModalOpen(true);
                  }}
                >
                  {reminder.medicationName}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    'medications': (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Medications</h2>
          <button
            onClick={() => setIsAddMedicationModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Medication
          </button>
        </div>
        {allMedications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onRequestRefill={handleRequestRefill}
                onView={handleViewMedication}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
            <Pill className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No medications</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first medication.</p>
          </div>
        )}
      </div>
    ),
  };
  
  return (
    <div className="space-y-6">
      {/* Header with Customize Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your medication overview.</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              onClick={() => {
                if (confirm('Reset dashboard to default layout?')) {
                  resetDashboardLayout();
                }
              }}
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Layout
            </button>
          )}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center px-4 py-2 font-medium rounded-lg transition-all ${
              isEditMode
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditMode ? 'Done Editing' : 'Customize Layout'}
          </button>
        </div>
      </div>
      
      {isEditMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Edit Mode:</strong> Drag widgets to reorder them or click the eye icon to show/hide sections. Click "Done Editing" when finished.
          </p>
        </div>
      )}
      
      {/* AI Adherence Insights */}
      {!isEditMode && reminders.length > 0 && (
        <AdherenceInsights />
      )}
      
      {/* Draggable Widgets */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dashboardLayout.widgetOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {dashboardLayout.widgetOrder.map((widgetId) => (
              <DraggableWidget
                key={widgetId}
                id={widgetId}
                isEditMode={isEditMode}
                isVisible={dashboardLayout.visibleWidgets[widgetId]}
                onToggleVisibility={handleToggleVisibility}
                title={
                  widgetId === 'stats' ? 'Statistics' :
                  widgetId === 'pending-reminders' ? 'Pending Reminders' :
                  'Medications'
                }
              >
                {widgets[widgetId]}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Modals */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        reminder={selectedReminder}
        onMarkTaken={markReminderTaken}
        onSnooze={snoozeReminder}
      />
      
      <AddMedicationModal
        isOpen={isAddMedicationModalOpen}
        onClose={() => setIsAddMedicationModalOpen(false)}
        onAdd={handleAddMedication}
      />
      
      <MedicationDetailsModal
        isOpen={isMedicationDetailsModalOpen}
        onClose={() => {
          setIsMedicationDetailsModalOpen(false);
          setSelectedMedication(null);
        }}
        medication={selectedMedication}
        onDelete={deleteMedication}
        onToggleStatus={toggleMedicationStatus}
        onAdjustDosage={handleAdjustDosage}
        onUpdateSchedule={handleUpdateSchedule}
      />
      
      <RefillRequestModal
        isOpen={isRefillModalOpen}
        onClose={() => {
          setIsRefillModalOpen(false);
          setSelectedMedication(null);
        }}
        medication={selectedMedication}
        onRequestRefill={requestMedicationRefill}
      />
    </div>
  );
};

export default DashboardNew;
