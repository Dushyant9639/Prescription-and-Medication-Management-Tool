import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Pill, Clock, Bell, FileText, User } from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'medications', name: 'Medications', icon: Pill },
    { id: 'reminders', name: 'Reminders', icon: Bell },
    { id: 'schedules', name: 'Schedules', icon: Clock },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText },
    { id: 'account', name: 'Account', icon: User },
  ];

  const faqs = [
    {
      id: 1,
      category: 'medications',
      question: 'How do I add a new medication?',
      answer: 'To add a new medication, go to the Dashboard and click the "Add Medication" button. Fill in the medication details including name, dosage, frequency, and any special instructions. You can also set up automatic reminders for this medication.',
    },
    {
      id: 2,
      category: 'medications',
      question: 'Can I edit or delete a medication?',
      answer: 'Yes! Click on any medication card to view its details. From there, you can edit information like dosage and schedule, or delete the medication entirely. You can also activate/deactivate medications without deleting them.',
    },
    {
      id: 3,
      category: 'medications',
      question: 'What does "inactive" medication mean?',
      answer: 'Inactive medications are those you\'ve stopped taking but want to keep in your history. They remain visible on your dashboard with a gray badge and reduced opacity, but won\'t generate new reminders.',
    },
    {
      id: 4,
      category: 'reminders',
      question: 'How do medication reminders work?',
      answer: 'Reminders are automatically generated based on your medication schedule. You\'ll receive browser notifications at the scheduled times. You can mark doses as taken or missed, or snooze the reminder for 5, 10, or 15 minutes.',
    },
    {
      id: 5,
      category: 'reminders',
      question: 'I\'m not receiving notifications. What should I do?',
      answer: 'First, check your browser notification permissions and make sure they\'re enabled for this site. Then go to Profile > Notification Settings and ensure notifications are turned on. You can also configure sound, vibration, and quiet hours.',
    },
    {
      id: 6,
      category: 'reminders',
      question: 'Can I snooze a reminder?',
      answer: 'Yes! When a reminder appears, you can snooze it for 5, 10, or 15 minutes, or set a custom time. The reminder will reappear after the snooze duration.',
    },
    {
      id: 7,
      category: 'schedules',
      question: 'What schedule options are available?',
      answer: 'You can set up daily schedules (1-4 times per day), weekly schedules (specific days of the week), interval-based schedules (every X days), or mark medications as "as needed" with no automatic reminders.',
    },
    {
      id: 8,
      category: 'schedules',
      question: 'How do I change my medication schedule?',
      answer: 'Open the medication details by clicking on it, then click "Edit Schedule". You can modify the frequency, times, and days. Changes will apply to future reminders.',
    },
    {
      id: 9,
      category: 'schedules',
      question: 'Can I set different times for different days?',
      answer: 'Currently, you can set specific days of the week with a consistent time, or use daily schedules with multiple times. For more complex schedules, you can create separate medication entries.',
    },
    {
      id: 10,
      category: 'prescriptions',
      question: 'How do I request a prescription refill?',
      answer: 'On any medication card, if you see a "Request Refill" button (shown when refills are low or needed), click it to submit a refill request. You\'ll see the status change to "Pending" and receive updates when approved.',
    },
    {
      id: 11,
      category: 'prescriptions',
      question: 'Can I upload prescription documents?',
      answer: 'Yes! Go to Profile > Prescription Documents and drag & drop PDF or image files (JPG, PNG, HEIC) up to 10MB. You can download or delete uploaded prescriptions anytime.',
    },
    {
      id: 12,
      category: 'prescriptions',
      question: 'How do I know when my prescription needs refilling?',
      answer: 'The app tracks your refills and displays color-coded badges: red for no refills, yellow for low refills (≤2), and blue for pending requests. You\'ll also see warnings on medication cards.',
    },
    {
      id: 13,
      category: 'account',
      question: 'How do I update my personal information?',
      answer: 'Go to the Profile page where you\'ll find expandable sections for Personal Information, Health Information, Emergency Contact, and Healthcare Providers. Click "Edit" on any section to make changes.',
    },
    {
      id: 14,
      category: 'account',
      question: 'What information should I add to my profile?',
      answer: 'We recommend adding your allergies, medical conditions, emergency contact, and healthcare provider information. This helps keep all your health information organized in one place.',
    },
    {
      id: 15,
      category: 'account',
      question: 'How do I adjust dosage safely?',
      answer: 'Click on a medication, then "Adjust Dosage". Use the stepper controls or slider to change the amount. You\'ll need to provide a reason and confirm the change was approved by your healthcare provider before saving.',
    },
    {
      id: 16,
      category: 'medications',
      question: 'What is the adherence rate?',
      answer: 'Your adherence rate shows the percentage of doses you\'ve taken on time. It\'s calculated based on your reminder history and helps track how well you\'re following your medication schedule.',
    },
    {
      id: 17,
      category: 'reminders',
      question: 'What are quiet hours?',
      answer: 'Quiet hours let you silence notifications during specific times (like overnight). Enable them in Profile > Notification Settings and set your preferred start and end times.',
    },
    {
      id: 18,
      category: 'medications',
      question: 'Can I see my medication history?',
      answer: 'Yes! Click on History in the navigation to view a timeline of all medication events including when medications were started, stopped, taken, refilled, or dosages were changed.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search frequently asked questions..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start space-x-3 flex-1">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                {expandedId === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {expandedId === faq.id && (
                <div className="px-4 pb-4 pt-0 pl-12">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Still need help?
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Can't find what you're looking for? Our support team is here to help you with any questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Contact Support
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            Email Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
