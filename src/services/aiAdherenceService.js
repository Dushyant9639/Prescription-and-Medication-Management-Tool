import { GoogleGenAI } from '@google/genai';

// AI Adherence Monitoring Service using Gemini API
class AIAdherenceService {
  constructor() {
    this.apiKey = null;
    this.genAI = null;
  }

  // Set API key from settings
  setApiKey(key) {
    this.apiKey = key;
    if (key && key.trim() !== '') {
      this.genAI = new GoogleGenAI({ apiKey: key });
    }
  }

  // Check if API is configured
  isConfigured() {
    return this.genAI !== null;
  }

  // Analyze adherence patterns from reminder history
  analyzeAdherencePatterns(reminders, medications) {
    const now = new Date();
    const patterns = {
      totalReminders: 0,
      takenCount: 0,
      missedCount: 0,
      snoozedCount: 0,
      adherenceRate: 0,
      missedByTimeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      missedByMedication: {},
      consecutiveMissed: 0,
      improvementTrend: 0,
    };

    // Filter to only past reminders
    const pastReminders = reminders.filter(r => new Date(r.scheduledTime) <= now);
    patterns.totalReminders = pastReminders.length;

    if (patterns.totalReminders === 0) {
      return patterns;
    }

    // Analyze each reminder
    pastReminders.forEach((reminder) => {
      if (reminder.status === 'taken') {
        patterns.takenCount++;
      } else if (reminder.status === 'missed') {
        patterns.missedCount++;
        
        // Track missed by time of day
        const hour = new Date(reminder.scheduledTime).getHours();
        if (hour >= 6 && hour < 12) patterns.missedByTimeOfDay.morning++;
        else if (hour >= 12 && hour < 17) patterns.missedByTimeOfDay.afternoon++;
        else if (hour >= 17 && hour < 21) patterns.missedByTimeOfDay.evening++;
        else patterns.missedByTimeOfDay.night++;

        // Track missed by medication
        const medName = reminder.medicationName;
        patterns.missedByMedication[medName] = (patterns.missedByMedication[medName] || 0) + 1;
      }

      if (reminder.snoozedCount > 0) {
        patterns.snoozedCount++;
      }
    });

    patterns.adherenceRate = Math.round((patterns.takenCount / patterns.totalReminders) * 100);

    // Calculate consecutive missed pattern
    const sortedReminders = pastReminders.sort((a, b) => 
      new Date(b.scheduledTime) - new Date(a.scheduledTime)
    );
    
    let consecutive = 0;
    for (const reminder of sortedReminders) {
      if (reminder.status === 'missed') {
        consecutive++;
      } else {
        break;
      }
    }
    patterns.consecutiveMissed = consecutive;

    // Calculate trend (last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentReminders = pastReminders.filter(r => 
      new Date(r.scheduledTime) >= sevenDaysAgo
    );
    const previousReminders = pastReminders.filter(r => 
      new Date(r.scheduledTime) >= fourteenDaysAgo && 
      new Date(r.scheduledTime) < sevenDaysAgo
    );

    const recentRate = recentReminders.length > 0
      ? (recentReminders.filter(r => r.status === 'taken').length / recentReminders.length) * 100
      : 0;
    
    const previousRate = previousReminders.length > 0
      ? (previousReminders.filter(r => r.status === 'taken').length / previousReminders.length) * 100
      : 0;

    patterns.improvementTrend = recentRate - previousRate;

    return patterns;
  }

  // Generate AI insights using Gemini API
  async generateInsights(patterns, medications) {
    if (!this.isConfigured()) {
      return this.generateFallbackInsights(patterns, medications);
    }

    try {
      const prompt = this.buildPrompt(patterns, medications);
      
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });

      const aiText = response.text;

      return this.parseAIResponse(aiText, patterns);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateFallbackInsights(patterns, medications);
    }
  }

  // Build prompt for Gemini API
  buildPrompt(patterns, medications) {
    const mostMissedMed = Object.entries(patterns.missedByMedication)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const mostMissedTime = Object.entries(patterns.missedByTimeOfDay)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return `You are a medication adherence assistant. Analyze the following patient data and provide 3 specific, actionable suggestions to improve medication adherence. Keep each suggestion to 1-2 sentences.

Patient Data:
- Total Reminders: ${patterns.totalReminders}
- Adherence Rate: ${patterns.adherenceRate}%
- Missed Doses: ${patterns.missedCount}
- Most Missed Medication: ${mostMissedMed}
- Most Missed Time: ${mostMissedTime}
- Consecutive Missed: ${patterns.consecutiveMissed}
- Trend (vs last week): ${patterns.improvementTrend > 0 ? 'Improving' : 'Declining'} by ${Math.abs(patterns.improvementTrend).toFixed(1)}%

Provide exactly 3 suggestions in this format:
1. [Suggestion]
2. [Suggestion]
3. [Suggestion]

Focus on practical tips like timing adjustments, reminder strategies, or habit-building techniques.`;
  }

  // Parse AI response into structured format
  parseAIResponse(aiText, patterns) {
    const lines = aiText.split('\n').filter(line => line.trim());
    const suggestions = [];

    lines.forEach(line => {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match) {
        suggestions.push({
          id: Date.now() + suggestions.length,
          text: match[1].trim(),
          type: 'ai-generated',
        });
      }
    });

    return {
      suggestions: suggestions.slice(0, 3),
      patterns,
      lastGenerated: new Date().toISOString(),
    };
  }

  // Fallback insights when API is not available
  generateFallbackInsights(patterns, medications) {
    const suggestions = [];
    const { adherenceRate, missedCount, totalReminders, consecutiveMissed, improvementTrend } = patterns;

    // CRITICAL: Very poor adherence (0-50%)
    if (adherenceRate < 50) {
      suggestions.push({
        id: Date.now() + 100,
        text: `🚨 URGENT: Your ${adherenceRate}% adherence needs immediate attention. Contact your healthcare provider and consider pill organizers or family support.`,
        type: 'rule-based',
        priority: 'high',
      });
      suggestions.push({
        id: Date.now() + 101,
        text: 'Start with ONE medication at a time. Set multiple alarms 15 minutes apart until taking medications becomes automatic.',
        type: 'rule-based',
        priority: 'high',
      });
    } 
    // NEEDS IMPROVEMENT: Poor adherence (50-75%)
    else if (adherenceRate < 75) {
      suggestions.push({
        id: Date.now() + 102,
        text: `⚠️ Your ${adherenceRate}% adherence is below target (75%+). Focus on identifying and eliminating the main barriers to taking medications.`,
        type: 'rule-based',
        priority: 'high',
      });
      suggestions.push({
        id: Date.now() + 103,
        text: 'Try the "medication sandwich" - pair each dose with something you enjoy (coffee, music) to create positive associations.',
        type: 'rule-based',
        priority: 'medium',
      });
    }
    // GOOD: Acceptable adherence (75-85%)
    else if (adherenceRate < 85) {
      suggestions.push({
        id: Date.now() + 1,
        text: `✅ Good work! At ${adherenceRate}%, you\'re in the acceptable range. Fine-tune your routine to reach the optimal 90%+ target.`,
        type: 'rule-based',
        priority: 'medium',
      });
    }
    // EXCELLENT: Very good adherence (85-95%)
    else if (adherenceRate < 95) {
      suggestions.push({
        id: Date.now() + 2,
        text: `🎉 Excellent ${adherenceRate}% adherence! You\'re doing great. Small tweaks to timing or reminders can get you to 95%+.`,
        type: 'rule-based',
        priority: 'low',
      });
      if (missedCount > 0) {
        suggestions.push({
          id: Date.now() + 3,
          text: `You\'ve missed ${missedCount} doses. Analyze when/why these happened to prevent future misses.`,
          type: 'rule-based',
          priority: 'low',
        });
      }
    }
    // PERFECT: Outstanding adherence (95%+)
    else {
      suggestions.push({
        id: Date.now() + 4,
        text: `🏆 Outstanding ${adherenceRate}% adherence! You\'re a medication management champion. Keep up this excellent routine!`,
        type: 'rule-based',
        priority: 'low',
      });
      suggestions.push({
        id: Date.now() + 5,
        text: 'Consider mentoring others or sharing your successful strategies. Your consistency is exemplary!',
        type: 'rule-based',
        priority: 'low',
      });
    }

    // Consecutive missed pattern
    if (patterns.consecutiveMissed >= 3) {
      suggestions.push({
        id: 3,
        text: `You've missed ${patterns.consecutiveMissed} doses in a row. Consider enabling quiet hours or adjusting reminder times to better fit your schedule.`,
        type: 'rule-based',
        priority: 'high',
      });
    }

    // Time of day pattern
    const mostMissedTime = Object.entries(patterns.missedByTimeOfDay)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostMissedTime && mostMissedTime[1] > 2) {
      const timeNames = {
        morning: 'morning (6 AM - 12 PM)',
        afternoon: 'afternoon (12 PM - 5 PM)',
        evening: 'evening (5 PM - 9 PM)',
        night: 'night (9 PM - 6 AM)',
      };
      suggestions.push({
        id: 4,
        text: `You often miss ${timeNames[mostMissedTime[0]]} doses. Try moving these medications to a different time or enabling extra reminders.`,
        type: 'rule-based',
        priority: 'medium',
      });
    }

    // Medication-specific pattern
    const mostMissedMed = Object.entries(patterns.missedByMedication)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostMissedMed && mostMissedMed[1] > 3) {
      suggestions.push({
        id: 5,
        text: `"${mostMissedMed[0]}" is frequently missed. Consider setting multiple reminders or using the snooze feature for this medication.`,
        type: 'rule-based',
        priority: 'medium',
      });
    }

    // Positive reinforcement
    if (patterns.improvementTrend > 5) {
      suggestions.push({
        id: 6,
        text: `Great job! Your adherence has improved by ${patterns.improvementTrend.toFixed(1)}% this week. Keep up the excellent work!`,
        type: 'rule-based',
        priority: 'low',
      });
    }

    // Default suggestions if none generated
    if (suggestions.length === 0) {
      suggestions.push({
        id: 7,
        text: 'Set up notification preferences to receive timely reminders for your medications.',
        type: 'rule-based',
        priority: 'low',
      });
    }

    return {
      suggestions: suggestions.slice(0, 3),
      patterns,
      lastGenerated: new Date().toISOString(),
    };
  }

  // Determine smart reminder adjustments
  getSmartReminderAdjustments(patterns) {
    const adjustments = [];

    // Increase frequency for frequently missed medications
    Object.entries(patterns.missedByMedication).forEach(([medName, missedCount]) => {
      const totalForMed = patterns.totalReminders / Object.keys(patterns.missedByMedication).length;
      const missRate = (missedCount / totalForMed) * 100;

      if (missRate > 40) {
        adjustments.push({
          medicationName: medName,
          action: 'increase-frequency',
          suggestion: 'Add an extra reminder 15 minutes before the scheduled time',
          reason: `High miss rate of ${missRate.toFixed(0)}%`,
        });
      }
    });

    // Suggest time shift for problematic time periods
    const mostMissedTime = Object.entries(patterns.missedByTimeOfDay)
      .sort((a, b) => b[1] - a[1])[0];

    if (mostMissedTime && mostMissedTime[1] > 3) {
      adjustments.push({
        timeOfDay: mostMissedTime[0],
        action: 'suggest-time-shift',
        suggestion: `Consider moving ${mostMissedTime[0]} medications to a different time`,
        reason: `${mostMissedTime[1]} doses missed during this time`,
      });
    }

    return adjustments;
  }
}

export const aiAdherenceService = new AIAdherenceService();
