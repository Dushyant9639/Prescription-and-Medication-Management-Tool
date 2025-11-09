import { BookOpen, Video, FileText, HelpCircle } from 'lucide-react';
import FAQ from '../components/FAQ';

const Help = () => {
  const gettingStartedSteps = [
    {
      id: 1,
      title: 'Set Up Your Profile',
      description: 'Add your personal information, allergies, medical conditions, and emergency contacts to keep everything organized.',
      icon: '👤',
    },
    {
      id: 2,
      title: 'Add Your Medications',
      description: 'Click "Add Medication" on the Dashboard to enter your prescriptions with dosages, frequencies, and special instructions.',
      icon: '💊',
    },
    {
      id: 3,
      title: 'Configure Schedules',
      description: 'Set up custom schedules for each medication - daily, weekly, or interval-based reminders.',
      icon: '⏰',
    },
    {
      id: 4,
      title: 'Enable Notifications',
      description: 'Turn on browser notifications in your Profile to receive timely reminders for your medications.',
      icon: '🔔',
    },
    {
      id: 5,
      title: 'Track Your Progress',
      description: 'Monitor your adherence rate and view your medication history to stay on top of your health.',
      icon: '📊',
    },
  ];

  const resources = [
    {
      id: 1,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides on using key features',
      icon: Video,
      color: 'blue',
    },
    {
      id: 2,
      title: 'User Guide',
      description: 'Comprehensive documentation covering all features',
      icon: BookOpen,
      color: 'green',
    },
    {
      id: 3,
      title: 'Tips & Best Practices',
      description: 'Learn how to make the most of your medication management',
      icon: FileText,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Help Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Everything you need to manage your medications effectively
        </p>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Getting Started
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Follow these steps to set up your account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gettingStartedSteps.map((step) => (
            <div
              key={step.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {step.id}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Additional Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
              purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            };
            
            return (
              <div
                key={resource.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 ${colorClasses[resource.color]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <FAQ />
      </div>
    </div>
  );
};

export default Help;
