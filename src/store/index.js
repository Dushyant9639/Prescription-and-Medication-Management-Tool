import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Main store for medication management
export const useStore = create(
  persist(
    (set, get) => ({
      // Medications
      medications: [],
      addMedication: (medication) =>
        set((state) => ({
          medications: [...state.medications, { ...medication, id: crypto.randomUUID() }],
        })),
      updateMedication: (id, updates) =>
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id ? { ...med, ...updates } : med
          ),
        })),
      toggleMedicationStatus: (id, newStatus) => {
        const state = get();
        const medication = state.medications.find(m => m.id === id);
        
        // Add history event
        if (medication) {
          state.addHistoryEvent({
            type: newStatus === 'active' ? 'started' : 'stopped',
            medicationId: id,
            medicationName: medication.name,
            dosage: medication.dosage,
            description: newStatus === 'active' 
              ? `Reactivated ${medication.name}`
              : `Deactivated ${medication.name}`,
            prescribedBy: medication.prescribedBy,
          });
        }
        
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id ? { ...med, status: newStatus } : med
          ),
        }));
      },
      deleteMedication: (id) => {
        const state = get();
        const medication = state.medications.find(m => m.id === id);
        
        // Add history event before deletion
        if (medication) {
          state.addHistoryEvent({
            type: 'deleted',
            medicationId: id,
            medicationName: medication.name,
            dosage: medication.dosage,
            description: `Deleted ${medication.name}`,
            prescribedBy: medication.prescribedBy,
          });
        }
        
        set((state) => ({
          // Remove the medication
          medications: state.medications.filter((med) => med.id !== id),
          // Also remove all associated reminders
          reminders: state.reminders.filter((rem) => rem.medicationId !== id),
        }));
      },
      requestMedicationRefill: (id) =>
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id
              ? {
                  ...med,
                  refillStatus: 'pending',
                  refillRequestedAt: new Date().toISOString(),
                }
              : med
          ),
        })),
      updateRefillStatus: (id, status) =>
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id
              ? {
                  ...med,
                  refillStatus: status,
                  refillUpdatedAt: new Date().toISOString(),
                }
              : med
          ),
        })),
      adjustMedicationDosage: (id, dosageData) => {
        const state = get();
        const medication = state.medications.find(m => m.id === id);
        
        if (medication) {
          // Add history event
          state.addHistoryEvent({
            type: dosageData.changeType === 'increased' ? 'dosage_increased' : 'dosage_decreased',
            medicationId: id,
            medicationName: medication.name,
            dosage: dosageData.newDosage,
            description: `Dosage ${dosageData.changeType} from ${dosageData.previousDosage} to ${dosageData.newDosage}. Reason: ${dosageData.reason}`,
            prescribedBy: medication.prescribedBy,
            metadata: {
              previousDosage: dosageData.previousDosage,
              newDosage: dosageData.newDosage,
              reason: dosageData.reason,
              doctorApproved: dosageData.doctorApproved,
            },
          });
        }
        
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id ? { ...med, dosage: dosageData.newDosage } : med
          ),
        }));
      },
      updateMedicationSchedule: (id, schedule) => {
        const state = get();
        const medication = state.medications.find(m => m.id === id);
        
        if (medication) {
          // Add history event
          state.addHistoryEvent({
            type: 'schedule_modified',
            medicationId: id,
            medicationName: medication.name,
            dosage: medication.dosage,
            description: `Schedule updated to ${schedule.frequency}`,
            prescribedBy: medication.prescribedBy,
            metadata: { schedule },
          });
        }
        
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id ? { ...med, schedule } : med
          ),
        }));
      },

      // Reminders
      reminders: [],
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, { ...reminder, id: crypto.randomUUID() }],
        })),
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((rem) =>
            rem.id === id ? { ...rem, ...updates } : rem
          ),
        })),
      markReminderTaken: (id) =>
        set((state) => ({
          reminders: state.reminders.map((rem) =>
            rem.id === id ? { ...rem, status: 'taken', takenAt: new Date().toISOString() } : rem
          ),
        })),
      markReminderMissed: (id) =>
        set((state) => ({
          reminders: state.reminders.map((rem) =>
            rem.id === id ? { ...rem, status: 'missed', missedAt: new Date().toISOString() } : rem
          ),
        })),
      snoozeReminder: (id, minutes) =>
        set((state) => ({
          reminders: state.reminders.map((rem) =>
            rem.id === id
              ? {
                  ...rem,
                  status: 'pending', // Keep as pending so scheduler will trigger it
                  scheduledTime: new Date(Date.now() + minutes * 60000).toISOString(), // Update scheduled time
                  snoozedUntil: new Date(Date.now() + minutes * 60000).toISOString(),
                  snoozedCount: (rem.snoozedCount || 0) + 1, // Track snooze count
                }
              : rem
          ),
        })),
      clearRecurringReminders: () =>
        set((state) => ({
          reminders: state.reminders.filter((rem) => !rem.recurring),
        })),

      // Medication History
      medicationHistory: [],
      addHistoryEvent: (event) =>
        set((state) => ({
          medicationHistory: [...state.medicationHistory, { ...event, id: crypto.randomUUID(), timestamp: new Date().toISOString() }],
        })),
      getMedicationHistory: (medicationId) => {
        const history = get().medicationHistory;
        return medicationId
          ? history.filter((event) => event.medicationId === medicationId)
          : history;
      },

      // Prescriptions
      prescriptions: [],
      addPrescription: (prescription) =>
        set((state) => ({
          prescriptions: [...state.prescriptions, { ...prescription, id: crypto.randomUUID() }],
        })),
      updatePrescription: (id, updates) =>
        set((state) => ({
          prescriptions: state.prescriptions.map((presc) =>
            presc.id === id ? { ...presc, ...updates } : presc
          ),
        })),
      requestRefill: (prescriptionId) =>
        set((state) => ({
          prescriptions: state.prescriptions.map((presc) =>
            presc.id === prescriptionId
              ? { ...presc, status: 'refill_requested' }
              : presc
          ),
        })),

      // Adherence tracking
      adherenceRecords: [],
      addAdherenceRecord: (record) =>
        set((state) => ({
          adherenceRecords: [...state.adherenceRecords, { ...record, id: crypto.randomUUID() }],
        })),
      getAdherenceStats: () => {
        const reminders = get().reminders;
        const medications = get().medications;
        const now = new Date();
        
        // Get valid medication IDs (only active medications)
        const validMedicationIds = new Set(medications.map((m) => m.id));
        
        // Only count reminders that:
        // 1. Are in the past (due reminders)
        // 2. Belong to medications that still exist
        // 3. Are either taken or missed (not pending)
        const dueReminders = reminders.filter((r) => 
          new Date(r.scheduledTime) <= now && 
          validMedicationIds.has(r.medicationId) &&
          (r.status === 'taken' || r.status === 'missed')
        );
        
        const totalDoses = dueReminders.length;
        const takenDoses = dueReminders.filter((r) => r.status === 'taken').length;
        const missedDoses = dueReminders.filter((r) => r.status === 'missed').length;
        const pendingDoses = reminders.filter((r) => r.status === 'pending').length;
        const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

        return {
          totalDoses,
          takenDoses,
          missedDoses,
          pendingDoses,
          adherenceRate: Math.round(adherenceRate),
        };
      },

      // User profile
      userProfile: {
        personalInfo: {
          name: '',
          dateOfBirth: '',
          gender: '',
          email: '',
          phone: '',
          address: '',
        },
        healthInfo: {
          allergies: [],
          conditions: [],
          bloodType: '',
          height: '',
          weight: '',
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
        },
        doctors: [],
        prescriptionFiles: [],
      },
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (updates) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates },
        })),
      addAllergy: (allergy) =>
        set((state) => {
          const currentAllergies = state.userProfile?.healthInfo?.allergies || [];
          return {
            userProfile: {
              ...state.userProfile,
              healthInfo: {
                ...(state.userProfile?.healthInfo || {}),
                allergies: [...currentAllergies, { id: crypto.randomUUID(), name: allergy, addedAt: new Date().toISOString() }],
              },
            },
          };
        }),
      removeAllergy: (id) =>
        set((state) => {
          const currentAllergies = state.userProfile?.healthInfo?.allergies || [];
          return {
            userProfile: {
              ...state.userProfile,
              healthInfo: {
                ...(state.userProfile?.healthInfo || {}),
                allergies: currentAllergies.filter((a) => a.id !== id),
              },
            },
          };
        }),
      addCondition: (condition) =>
        set((state) => {
          const currentConditions = state.userProfile?.healthInfo?.conditions || [];
          return {
            userProfile: {
              ...state.userProfile,
              healthInfo: {
                ...(state.userProfile?.healthInfo || {}),
                conditions: [...currentConditions, { id: crypto.randomUUID(), name: condition, addedAt: new Date().toISOString() }],
              },
            },
          };
        }),
      removeCondition: (id) =>
        set((state) => {
          const currentConditions = state.userProfile?.healthInfo?.conditions || [];
          return {
            userProfile: {
              ...state.userProfile,
              healthInfo: {
                ...(state.userProfile?.healthInfo || {}),
                conditions: currentConditions.filter((c) => c.id !== id),
              },
            },
          };
        }),
      addDoctor: (doctor) =>
        set((state) => {
          const currentDoctors = state.userProfile?.doctors || [];
          return {
            userProfile: {
              ...state.userProfile,
              doctors: [...currentDoctors, { ...doctor, id: crypto.randomUUID(), addedAt: new Date().toISOString() }],
            },
          };
        }),
      updateDoctor: (id, updates) =>
        set((state) => {
          const currentDoctors = state.userProfile?.doctors || [];
          return {
            userProfile: {
              ...state.userProfile,
              doctors: currentDoctors.map((doc) =>
                doc.id === id ? { ...doc, ...updates } : doc
              ),
            },
          };
        }),
      removeDoctor: (id) =>
        set((state) => {
          const currentDoctors = state.userProfile?.doctors || [];
          return {
            userProfile: {
              ...state.userProfile,
              doctors: currentDoctors.filter((doc) => doc.id !== id),
            },
          };
        }),
      addPrescriptionFile: (file) =>
        set((state) => {
          const currentFiles = state.userProfile?.prescriptionFiles || [];
          return {
            userProfile: {
              ...state.userProfile,
              prescriptionFiles: [...currentFiles, { ...file, id: crypto.randomUUID(), uploadedAt: new Date().toISOString() }],
            },
          };
        }),
      removePrescriptionFile: (id) =>
        set((state) => {
          const currentFiles = state.userProfile?.prescriptionFiles || [];
          return {
            userProfile: {
              ...state.userProfile,
              prescriptionFiles: currentFiles.filter((f) => f.id !== id),
            },
          };
        }),

      // Notifications settings
      notificationsEnabled: false,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      notificationSettings: {
        sound: true,
        vibration: true,
        requireInteraction: true,
        autoGenerate: true, // Auto-generate recurring reminders
        daysAhead: 7, // Generate reminders for next 7 days
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      },
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        })),

      // AI Settings
      aiSettings: {
        enabled: true,
        geminiApiKey: '',
        showInsights: true,
      },
      updateAISettings: (settings) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, ...settings },
        })),

      // UI state
      selectedMedication: null,
      setSelectedMedication: (medication) => set({ selectedMedication: medication }),
      
      // Dashboard layout customization
      dashboardLayout: {
        widgetOrder: ['stats', 'pending-reminders', 'medications'],
        visibleWidgets: {
          stats: true,
          'pending-reminders': true,
          medications: true,
        },
      },
      updateDashboardLayout: (layout) => set({ dashboardLayout: layout }),
      resetDashboardLayout: () => set({
        dashboardLayout: {
          widgetOrder: ['stats', 'pending-reminders', 'medications'],
          visibleWidgets: {
            stats: true,
            'pending-reminders': true,
            medications: true,
          },
        },
      }),
    }),
    {
      name: 'medication-store',
      partialize: (state) => ({
        medications: state.medications,
        reminders: state.reminders,
        prescriptions: state.prescriptions,
        adherenceRecords: state.adherenceRecords,
        medicationHistory: state.medicationHistory,
        userProfile: state.userProfile,
        notificationsEnabled: state.notificationsEnabled,
        notificationSettings: state.notificationSettings,
        aiSettings: state.aiSettings,
        dashboardLayout: state.dashboardLayout,
      }),
    }
  )
);
