import { useState } from 'react';
import { RefreshCw, Check, X, AlertCircle, Loader } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const RefillRequestModal = ({ isOpen, onClose, medication, onRequestRefill }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!medication) return null;

  const handleRequestRefill = async () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      onRequestRefill(medication.id);
      setIsSubmitting(false);
      setShowSuccess(true);

      // Auto-close after showing success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  const handleCancel = () => {
    setShowSuccess(false);
    onClose();
  };

  // Check if already requested
  const isPending = medication.refillStatus === 'pending';
  const isApproved = medication.refillStatus === 'approved';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Prescription Refill" size="md">
      <div className="space-y-6">
        {showSuccess ? (
          // Success State
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-bounce">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ✅ Refill Requested!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your refill request has been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Medication Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                {medication.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Dosage</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{medication.dosage}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Frequency</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{medication.frequency}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Refills Remaining</p>
                  <p className={`font-bold ${medication.refillsRemaining <= 1 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                    {medication.refillsRemaining}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Prescribed By</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{medication.prescribedBy}</p>
                </div>
              </div>
            </div>

            {/* Warning if low refills */}
            {medication.refillsRemaining === 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-300">No Refills Remaining</p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    You'll need a new prescription from your doctor. This request will be forwarded to your pharmacy and doctor.
                  </p>
                </div>
              </div>
            )}

            {medication.refillsRemaining <= 2 && medication.refillsRemaining > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-300">Low Refills</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    You're running low on refills. Consider contacting your doctor for a new prescription soon.
                  </p>
                </div>
              </div>
            )}

            {/* Already Pending Warning */}
            {isPending && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Request Already Pending</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    A refill request for this medication is currently being processed.
                  </p>
                </div>
              </div>
            )}

            {/* Already Approved Info */}
            {isApproved && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-300">Previous Request Approved</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Your last refill request was approved. Submit a new request if you need another refill.
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation Message */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                📋 What happens next?
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span>Your refill request will be sent to your pharmacy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span>The pharmacy will verify your prescription and insurance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span>You'll be notified when your refill is ready for pickup</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4️⃣</span>
                  <span>Typical processing time: 24-48 hours</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleRequestRefill}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Request Refill
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>

            {/* Status Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              After requesting, you can track the status on your dashboard and in medication details.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default RefillRequestModal;
