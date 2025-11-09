import { useState, useEffect } from 'react';
import { Sparkles, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { aiAdherenceService } from '../services/aiAdherenceService';
import Button from './Button';

const AISettings = () => {
  const aiSettings = useStore((state) => state.aiSettings);
  const updateAISettings = useStore((state) => state.updateAISettings);
  
  const [localSettings, setLocalSettings] = useState(aiSettings);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(aiSettings);
  }, [aiSettings]);

  const handleSave = () => {
    updateAISettings(localSettings);
    
    // Update the AI service with the new API key
    if (localSettings.geminiApiKey) {
      aiAdherenceService.setApiKey(localSettings.geminiApiKey);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const maskApiKey = (key) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 8);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure AI-powered adherence monitoring
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable AI Insights */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable AI Insights
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Show personalized suggestions on your dashboard
            </p>
          </div>
          <button
            onClick={() => setLocalSettings({ ...localSettings, enabled: !localSettings.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Show Insights on Dashboard */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Insights on Dashboard
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Display AI suggestions at the top of your dashboard
            </p>
          </div>
          <button
            onClick={() => setLocalSettings({ ...localSettings, showInsights: !localSettings.showInsights })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.showInsights ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.showInsights ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Gemini API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Google Gemini API Key
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Get your free API key from{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google AI Studio
            </a>
          </p>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={localSettings.geminiApiKey}
              onChange={(e) => setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })}
              placeholder="Enter your Gemini API key"
              className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {localSettings.geminiApiKey && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              ✓ API key configured
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            How AI Insights Work
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Analyzes your medication adherence patterns</li>
            <li>• Identifies frequently missed medications and times</li>
            <li>• Provides personalized suggestions to improve adherence</li>
            <li>• Uses Google Gemini AI for intelligent recommendations</li>
            <li>• Falls back to rule-based suggestions if API unavailable</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex items-center space-x-3 pt-4">
          <Button
            onClick={handleSave}
            variant="primary"
            className="flex items-center space-x-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </Button>
          {saved && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Settings saved successfully
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettings;
