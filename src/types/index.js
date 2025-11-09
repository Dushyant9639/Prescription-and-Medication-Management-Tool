// Type definitions for the Medication Management Tool
// Using JSDoc comments for type checking in JavaScript

/**
 * @typedef {Object} Medication
 * @property {string} id - Unique identifier
 * @property {string} name - Medication name
 * @property {string} dosage - Dosage amount (e.g., "500mg")
 * @property {string} frequency - How often to take (e.g., "twice daily")
 * @property {string[]} schedule - Times to take medication (e.g., ["09:00", "21:00"])
 * @property {Date} startDate - When medication started
 * @property {Date|null} endDate - When medication ends (null for ongoing)
 * @property {string} prescribedBy - Doctor name
 * @property {string} purpose - Reason for medication
 * @property {number} refillsRemaining - Number of refills left
 * @property {Date|null} nextRefillDate - When next refill is needed
 * @property {string} status - "active" | "inactive" | "expired"
 * @property {string[]} sideEffects - List of possible side effects
 * @property {string} instructions - Special instructions
 */

/**
 * @typedef {Object} Reminder
 * @property {string} id - Unique identifier
 * @property {string} medicationId - Reference to medication
 * @property {Date} scheduledTime - When reminder should fire
 * @property {string} status - "pending" | "taken" | "missed" | "snoozed"
 * @property {Date|null} takenAt - When medication was taken
 * @property {Date|null} snoozedUntil - When snoozed reminder should fire again
 * @property {string} medicationName - Cached medication name
 * @property {string} dosage - Cached dosage
 */

/**
 * @typedef {Object} Prescription
 * @property {string} id - Unique identifier
 * @property {string} medicationId - Reference to medication
 * @property {Date} prescribedDate - When prescription was written
 * @property {Date} expiryDate - When prescription expires
 * @property {number} initialRefills - Original number of refills
 * @property {number} refillsUsed - Number of refills used
 * @property {string} prescribingDoctor - Doctor who prescribed
 * @property {string} pharmacy - Pharmacy name
 * @property {string} prescriptionNumber - Prescription reference number
 * @property {string} status - "active" | "expired" | "refill_requested"
 * @property {string|null} fileUrl - Uploaded prescription image/PDF
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - Unique identifier
 * @property {string} name - User's full name
 * @property {Date} dateOfBirth - Date of birth
 * @property {string[]} allergies - List of allergies
 * @property {string[]} conditions - Current medical conditions
 * @property {string} emergencyContact - Emergency contact name
 * @property {string} emergencyPhone - Emergency contact phone
 * @property {Doctor[]} doctors - List of doctors
 */

/**
 * @typedef {Object} Doctor
 * @property {string} id - Unique identifier
 * @property {string} name - Doctor's name
 * @property {string} specialty - Medical specialty
 * @property {string} phone - Contact phone
 * @property {string} email - Contact email
 * @property {string} address - Office address
 */

/**
 * @typedef {Object} AdherenceRecord
 * @property {string} id - Unique identifier
 * @property {string} medicationId - Reference to medication
 * @property {Date} date - Date of record
 * @property {boolean} taken - Whether medication was taken
 * @property {string|null} missedReason - Reason if missed
 */

/**
 * @typedef {Object} AdherenceStats
 * @property {number} totalDoses - Total scheduled doses
 * @property {number} takenDoses - Number of taken doses
 * @property {number} missedDoses - Number of missed doses
 * @property {number} adherenceRate - Percentage (0-100)
 * @property {Object.<string, number>} weeklyAdherence - Adherence by day of week
 */

export {};
