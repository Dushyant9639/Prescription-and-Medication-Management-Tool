// import { useState } from 'react';
// import { Pill, Bell, Calendar, TrendingUp, Plus } from 'lucide-react';
// import { useStore } from '../store';
// import MedicationCard from '../components/MedicationCard';
// import ReminderModal from '../components/ReminderModal';
// import AddMedicationModal from '../components/AddMedicationModal';
// import MedicationDetailsModal from '../components/MedicationDetailsModal';
// import Badge from '../components/Badge';
// import Button from '../components/Button';

// const Dashboard = () => {
//   const medications = useStore((state) => state.medications);
//   const reminders = useStore((state) => state.reminders);
//   const markReminderTaken = useStore((state) => state.markReminderTaken);
//   const snoozeReminder = useStore((state) => state.snoozeReminder);
//   const requestRefill = useStore((state) => state.requestRefill);
//   const getAdherenceStats = useStore((state) => state.getAdherenceStats);
//   const addMedication = useStore((state) => state.addMedication);
//   const deleteMedication = useStore((state) => state.deleteMedication);
  
//   const [selectedReminder, setSelectedReminder] = useState(null);
//   const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
//   const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
//   const [selectedMedication, setSelectedMedication] = useState(null);
//   const [isMedicationDetailsModalOpen, setIsMedicationDetailsModalOpen] = useState(false);
  
//   const activeMedications = medications.filter((med) => med.status === 'active');
//   const pendingReminders = reminders.filter((rem) => rem.status === 'pending');
//   const stats = getAdherenceStats();
  
//   const handleRequestRefill = (medication) => {
//     const prescription = medication.id; // In real app, would find matching prescription
//     requestRefill(prescription);
//     alert(`Refill requested for ${medication.name}`);
//   };
  
//   const handleViewMedication = (medication) => {
//     setSelectedMedication(medication);
//     setIsMedicationDetailsModalOpen(true);
//   };
  
//   const handleAddMedication = (medication) => {
//     addMedication(medication);
//     alert(`${medication.name} has been added successfully!`);
//   };
  
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your medication overview.</p>
//       </div>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Active Medications</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeMedications.length}</p>
//             </div>
//             <Pill className="w-8 h-8 text-primary-600" />
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reminders</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingReminders.length}</p>
//             </div>
//             <Bell className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Refills</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
//             </div>
//             <Calendar className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6 transition-colors">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Adherence Rate</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.adherenceRate}%</p>
//             </div>
//             <TrendingUp className="w-8 h-8 text-green-600" />
//           </div>
//         </div>
//       </div>
      
//       {/* Pending Reminders */}
//       {pendingReminders.length > 0 && (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//           <div className="flex items-center">
//             <Bell className="h-5 w-5 text-yellow-400 mr-3" />
//             <div>
//               <h3 className="text-sm font-medium text-yellow-800">
//                 You have {pendingReminders.length} pending medication reminder(s)
//               </h3>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {pendingReminders.map((reminder) => (
//                   <Badge
//                     key={reminder.id}
//                     variant="warning"
//                     className="cursor-pointer"
//                     onClick={() => {
//                       setSelectedReminder(reminder);
//                       setIsReminderModalOpen(true);
//                     }}
//                   >
//                     {reminder.medicationName}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Active Medications */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Medications</h2>
//           <button
//             onClick={() => setIsAddMedicationModalOpen(true)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
//             style={{ backgroundColor: '#2563eb' }}
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Add Medication
//           </button>
//         </div>
//         {activeMedications.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {activeMedications.map((medication) => (
//               <MedicationCard
//                 key={medication.id}
//                 medication={medication}
//                 onRequestRefill={handleRequestRefill}
//                 onView={handleViewMedication}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
//             <Pill className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active medications</h3>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first medication.</p>
//           </div>
//         )}
//       </div>
      
//       {/* Reminder Modal */}
//       <ReminderModal
//         isOpen={isReminderModalOpen}
//         onClose={() => setIsReminderModalOpen(false)}
//         reminder={selectedReminder}
//         onMarkTaken={markReminderTaken}
//         onSnooze={snoozeReminder}
//       />
      
//       {/* Add Medication Modal */}
//       <AddMedicationModal
//         isOpen={isAddMedicationModalOpen}
//         onClose={() => setIsAddMedicationModalOpen(false)}
//         onAdd={handleAddMedication}
//       />
      
//       {/* Medication Details Modal */}
//       <MedicationDetailsModal
//         isOpen={isMedicationDetailsModalOpen}
//         onClose={() => {
//           setIsMedicationDetailsModalOpen(false);
//           setSelectedMedication(null);
//         }}
//         medication={selectedMedication}
//         onDelete={deleteMedication}
//       />
//     </div>
//   );
// };

// export default Dashboard;
