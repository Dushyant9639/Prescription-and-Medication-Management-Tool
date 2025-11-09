import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, X, RefreshCw, Sparkles } from 'lucide-react';
import { aiAdherenceService } from '../services/aiAdherenceService';
import { useStore } from '../store';

const AdherenceInsights = () => {
  const reminders = useStore((state) => state.reminders);
  const medications = useStore((state) => state.medications);
  const aiSettings = useStore((state) => state.aiSettings);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState(new Set());

  // Create a dependency string that changes when reminder data actually changes
  const reminderDataHash = reminders.map(r => `${r.id}-${r.status}-${r.scheduledTime}`).join('|');

  useEffect(() => {
    generateInsights();
  }, [reminderDataHash, medications.length]); // Regenerate when reminder statuses change OR medication count changes

  const generateInsights = async () => {
    if (reminders.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const patterns = aiAdherenceService.analyzeAdherencePatterns(reminders, medications);
      const generatedInsights = await aiAdherenceService.generateInsights(patterns, medications);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (insightId) => {
    setDismissedInsights(new Set([...dismissedInsights, insightId]));
  };

  const handleRefresh = () => {
    setDismissedInsights(new Set());
    generateInsights();
  };

  // Don't show if AI insights are disabled
  if (!aiSettings?.enabled || !aiSettings?.showInsights) {
    return null;
  }

  if (!insights || insights.suggestions.length === 0) {
    return null;
  }

  const visibleSuggestions = insights.suggestions.filter(
    (suggestion) => !dismissedInsights.has(suggestion.id)
  );

  if (visibleSuggestions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">All insights reviewed</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'medium':
        return <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights
          </h3>
          {insights.patterns && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Based on {insights.patterns.totalReminders} reminders
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Insights Cards */}
      <div className="space-y-3">
        {visibleSuggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${getPriorityColor(
              suggestion.priority
            )}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(suggestion.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Tip #{index + 1}
                      </span>
                      {suggestion.type === 'ai-generated' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {suggestion.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismiss(suggestion.id)}
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adherence Summary */}
      {insights.patterns && insights.patterns.totalReminders > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Current Adherence Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {insights.patterns.adherenceRate}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Trend (vs last week)
              </p>
              <p
                className={`text-sm font-semibold ${
                  insights.patterns.improvementTrend > 0
                    ? 'text-green-600 dark:text-green-400'
                    : insights.patterns.improvementTrend < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {insights.patterns.improvementTrend > 0 ? '+' : ''}
                {insights.patterns.improvementTrend.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdherenceInsights;
