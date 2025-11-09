# 📚 MedManager - Complete User Documentation

**Version 1.0.0** | **Last Updated: January 2025**

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Guide](#dashboard-guide)
4. [Reminders System](#reminders-system)
5. [Analytics & Progress](#analytics--progress)
6. [Badges & Gamification](#badges--gamification)
7. [Medication History](#medication-history)
8. [User Profile](#user-profile)
9. [Help & Support](#help--support)
10. [Advanced Features](#advanced-features)
11. [Troubleshooting](#troubleshooting)
12. [FAQ](#faq)

---

## Introduction

### What is MedManager?

MedManager is a comprehensive **Progressive Web App (PWA)** designed to help you manage medications, track adherence, and maintain consistent medication schedules. The app works both online and offline, with intelligent reminders, AI-powered insights, and gamification features to keep you motivated.

### Key Benefits

✅ **Never Miss a Dose**: Smart notifications with snooze options  
✅ **Track Progress**: Visual charts and analytics  
✅ **Stay Motivated**: Earn badges for consistent adherence  
✅ **Work Offline**: Full functionality without internet  
✅ **AI Insights**: Personalized adherence suggestions  
✅ **Secure & Private**: All data stored locally on your device  

### System Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Operating System**: Windows, macOS, Linux, iOS, or Android
- **Internet**: Required for initial setup, then works offline
- **Notifications**: Browser notification permissions recommended

---

## Getting Started

### First-Time Setup

#### Step 1: Grant Permissions

When you first open MedManager, you'll see a notification permission request.

**Why it's important**: Enables medication reminders even when the app is closed.

**To grant permission**:
1. Click **"Allow"** when prompted
2. If blocked, click the lock icon in address bar
3. Change "Notifications" to "Allow"
4. Refresh the page

#### Step 2: Add Your First Medication

1. On the **Dashboard**, click the **"+ Add Medication"** button (top right)
2. Fill in the medication details:
   - **Name**: e.g., "Aspirin"
   - **Dosage**: e.g., "100mg" or "2 tablets"
   - **Frequency**: e.g., "Once daily" or "Twice daily"
   - **Prescriber**: Your doctor's name (optional)
   - **Instructions**: e.g., "Take with food" (optional)
3. Click **"Add Medication"**
4. Your medication appears on the dashboard

#### Step 3: Set Up Reminders

1. Navigate to **Reminders** page (navigation menu)
2. Click **"Set Up Reminders"** button
3. Choose your medication from the dropdown
4. Select schedule type (Daily/Weekly/Interval/As-Needed)
5. Set times and preferences
6. Click **"Save"**
7. Reminders auto-generate for the next 7 days

#### Step 4: Configure Profile (Optional but Recommended)

1. Go to **Profile** page
2. Add personal information
3. Enter health details (allergies, conditions)
4. Add emergency contact
5. Upload prescriptions
6. Store doctor contacts

---

## Dashboard Guide

### Overview

The **Dashboard** is your home screen showing:
- All active medications
- Quick statistics
- Recent activity
- AI adherence insights (if enabled)

### Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Dashboard                              │
├─────────────────────────────────────────┤
│  [Stats Cards]                          │
│  - Adherence Rate    - Current Streak   │
│  - Total Doses       - Doses Taken      │
│  - Doses Missed                         │
├─────────────────────────────────────────┤
│  [AI Adherence Insights]                │
│  - Personalized tips based on behavior  │
├─────────────────────────────────────────┤
│  [All Medications]                      │
│  - Active medications (white cards)     │
│  - Inactive medications (gray cards)    │
└─────────────────────────────────────────┘
```

### Understanding Medication Cards

Each medication card shows:
- **Medication Name** (large text at top)
- **Dosage** (e.g., "500mg")
- **Frequency** (e.g., "Twice daily")
- **Status Badge** (Active/Inactive - colored pill badge)
- **Action Buttons**:
  - 👁️ **View**: See full details
  - 🔄 **Request Refill**: Submit refill request

### Medication Card Actions

#### View Medication Details
1. Click **"View"** button on any medication card
2. Modal opens showing:
   - Complete medication information
   - Current status
   - Action buttons

#### Request Refill
1. Click **"Request Refill"** button
2. Status changes to "Pending"
3. Badge color changes to yellow
4. Check back later for approval status

### Adding New Medications

**Quick Method**:
1. Click **"+ Add Medication"** (top right)
2. Fill required fields (Name, Dosage, Frequency)
3. Click **"Add Medication"**

**Detailed Method**:
1. Click **"+ Add Medication"**
2. Fill all fields including optional ones:
   - Instructions (e.g., "Take with water")
   - Notes (any special considerations)
   - Prescriber information
3. Click **"Add Medication"**

### Medication Status Management

#### Activate/Deactivate Medications
1. Click **"View"** on medication card
2. Look for **Power button** icon at top
3. Click to toggle:
   - ✅ **Activate**: Green background, "Active" status
   - ⭕ **Deactivate**: Gray background, "Inactive" status

**What happens when deactivated**:
- Medication stays on dashboard (grayed out)
- No new reminders generated
- History preserved
- Can reactivate anytime

#### Delete Medications
⚠️ **Warning**: This permanently removes the medication and its history.

1. Click **"View"** on medication card
2. Scroll down in modal
3. Click **"Delete"** button (red)
4. Confirm deletion
5. Medication removed from all pages

### Understanding Stats Cards

#### Adherence Rate
- **Formula**: (Doses Taken ÷ Total Past Doses) × 100
- **Goal**: Maintain above 80%
- **Color Coding**:
  - 🟢 Green: 80-100% (Excellent)
  - 🟡 Yellow: 60-79% (Good)
  - 🔴 Red: Below 60% (Needs Improvement)

#### Current Streak
- **Definition**: Consecutive doses taken without missing
- **Resets**: When you miss a dose
- **Achievement**: Unlocks streak badges at 3, 7, and 30 days

#### Total Doses
- Count of all past medication reminders
- Includes taken, missed, and pending

#### Doses Taken
- Number of doses you've marked as taken
- Used to calculate adherence rate

#### Doses Missed
- Number of missed doses
- Review patterns in Analytics page

### AI Adherence Insights

**What are they?**  
Personalized tips generated by AI based on your medication-taking patterns.

**How to enable**:
1. Go to **Profile** → **AI Settings**
2. Toggle **"Enable AI Features"** ON
3. Toggle **"Show Adherence Insights"** ON
4. Configure API key (uses default if not changed)

**Understanding Insight Cards**:
- 🔴 **Red**: High priority - needs immediate attention
- 🟡 **Yellow**: Medium priority - consider implementing
- 🔵 **Blue**: Low priority - general tips

**Actions**:
- Click **"Dismiss"** to hide an insight
- Click **"Refresh"** to generate new insights
- Insights auto-refresh when reminder data changes

---

## Reminders System

### How Reminders Work

**Auto-Generation**:
- Reminders automatically created based on medication schedules
- Generated 7 days in advance
- New reminders added daily
- Old reminders cleaned up after 30 days

**Notification Flow**:
```
Scheduled Time → Browser Notification → Interactive Modal
                    ↓                        ↓
            [Action Buttons]          [Detailed View]
            - Mark Taken              - Medication info
            - Snooze 10 min           - Dosage details
                                      - Instructions
```

### Setting Up Reminders

#### Navigate to Reminders Page
1. Click **"Reminders"** in navigation menu
2. View upcoming reminders list
3. Click **"Set Up Reminders"** button

#### Choose Schedule Type

**1. Daily Schedule**
- **Best for**: Medications taken every day
- **Options**: 1-4 times per day
- **Setup**:
  1. Select "Daily"
  2. Choose number of times (1-4)
  3. Set specific times for each dose
  4. Pick start date
  5. Click "Save"

**Example**: Aspirin 100mg twice daily at 8:00 AM and 8:00 PM

**2. Weekly Schedule**
- **Best for**: Medications taken on specific days
- **Options**: Select any combination of days
- **Setup**:
  1. Select "Weekly"
  2. Click days of week (Mon, Tue, Wed, etc.)
  3. Set time for each selected day
  4. Pick start date
  5. Click "Save"

**Example**: Vitamin D on Monday, Wednesday, Friday at 9:00 AM

**3. Interval-Based Schedule**
- **Best for**: Medications taken every X days
- **Options**: Any interval (2, 3, 5 days, etc.)
- **Setup**:
  1. Select "Interval-Based"
  2. Enter number of days between doses
  3. Set time of day
  4. Pick start date
  5. Click "Save"

**Example**: Iron supplement every 3 days at 10:00 AM

**4. As-Needed Schedule**
- **Best for**: PRN medications (as needed)
- **Options**: No recurring reminders
- **Setup**:
  1. Select "As-Needed"
  2. Click "Save"
  3. Manually mark doses when taken

**Example**: Pain medication taken only when needed

### Receiving Notifications

#### Browser Notifications
When a reminder is due:
1. **Notification appears** on screen (even if browser closed)
2. Shows:
   - Medication name
   - Dosage
   - Instructions
3. **Action buttons**:
   - ✅ **Mark Taken**: Records as taken immediately
   - 😴 **Snooze 10 min**: Reminds again in 10 minutes

#### In-App Modal
If app is open when reminder is due:
1. **Modal pops up** automatically
2. Shows full medication details
3. **Three options**:
   - ✅ **Mark as Taken**
   - 😴 **Snooze** (choose 5, 10, 15, or 30 minutes)
   - ❌ **Mark as Missed**

### Managing Reminders

#### View Upcoming Reminders
1. Go to **Reminders** page
2. See list of all future reminders
3. Grouped by date and time
4. Color-coded by status:
   - 🟢 Green: Pending (upcoming)
   - 🔵 Blue: Taken
   - 🔴 Red: Missed

#### Manual Reminder Actions

**Mark as Taken** (if you forgot to respond):
1. Find the reminder in list
2. Click reminder card
3. Click **"Mark as Taken"** button

**Snooze a Reminder**:
1. Click reminder card
2. Click **"Snooze"** button
3. Choose duration (5, 10, 15, or 30 minutes)
4. Notification appears after chosen time

**Mark as Missed**:
1. Click reminder card
2. Click **"Mark as Missed"** button
3. Affects adherence statistics

### Notification Settings

#### Access Settings
1. Go to **Profile** page
2. Scroll to **"Notification Settings"** section
3. Customize preferences

#### Available Options

**Sound**:
- ✅ **ON**: Play notification sound
- ❌ **OFF**: Silent notifications
- **Default**: ON

**Vibration** (mobile devices):
- ✅ **ON**: Vibrate when notification appears
- ❌ **OFF**: No vibration
- **Default**: ON

**Require Interaction**:
- ✅ **ON**: Notification stays until you interact
- ❌ **OFF**: Notification auto-dismisses
- **Default**: ON
- **Recommendation**: Keep ON so you don't miss reminders

**Auto-Generate Reminders**:
- ✅ **ON**: Automatically create recurring reminders
- ❌ **OFF**: Manually create each reminder
- **Default**: ON
- **Recommendation**: Keep ON for convenience

**Days Ahead**:
- **Options**: 1-30 days
- **Purpose**: How many days of reminders to generate
- **Default**: 7 days
- **Recommendation**: 7-14 days

**Quiet Hours**:
- **Enable**: Toggle ON to set quiet period
- **Start Time**: When to stop notifications (e.g., 10:00 PM)
- **End Time**: When to resume notifications (e.g., 7:00 AM)
- **Effect**: No notifications during this period
- **Note**: Reminders still tracked, just not notified

---

## Analytics & Progress

### Accessing Analytics
1. Click **"Analytics"** in navigation menu
2. View comprehensive statistics and charts

### Dashboard Overview

```
┌─────────────────────────────────────────┐
│  Analytics & Progress                   │
├─────────────────────────────────────────┤
│  [5 Stats Cards]                        │
│  - Adherence Rate    - Current Streak   │
│  - Total Doses       - Doses Taken      │
│  - Doses Missed                         │
├─────────────────────────────────────────┤
│  [Charts - 2x2 Grid]                    │
│  - 30-Day Trend     - 12-Week Overview  │
│  - 7-Day Trend      - Status Pie Chart  │
├─────────────────────────────────────────┤
│  [Active Medications List]              │
│  - Individual adherence rates           │
└─────────────────────────────────────────┘
```

### Understanding Charts

#### 1. 30-Day Adherence Trend (Line Chart)
**Purpose**: Shows daily adherence rate for the last month

**How to Read**:
- **X-Axis**: Dates (last 30 days)
- **Y-Axis**: Adherence percentage (0-100%)
- **Line**: Daily adherence rate
- **Shaded Area**: Visual emphasis

**Insights**:
- 📈 **Upward trend**: Improving adherence
- 📉 **Downward trend**: Declining adherence
- 📊 **Flat line**: Consistent behavior
- 🔴 **Dips**: Investigate days with low adherence

**Example Interpretation**:
- Line at 100%: Perfect adherence that day
- Line at 50%: Took half of scheduled doses
- Line at 0%: Missed all doses that day

#### 2. 12-Week Overview (Bar Chart)
**Purpose**: Shows weekly adherence patterns over 3 months

**How to Read**:
- **X-Axis**: Week numbers (1-12)
- **Y-Axis**: Adherence percentage (0-100%)
- **Bars**: Weekly average adherence
- **Color**: Green bars indicate adherence rate

**Insights**:
- 📊 **Tall bars**: Good weeks (high adherence)
- 📉 **Short bars**: Challenging weeks (low adherence)
- 🔄 **Pattern**: Identify cyclical behaviors
- 📈 **Trend**: Long-term improvement or decline

**Example Interpretation**:
- Week 1: 95% (excellent start)
- Week 5: 60% (investigate what happened)
- Week 12: 90% (good recovery)

#### 3. 7-Day Trend (Line Chart)
**Purpose**: Detailed view of the past week

**How to Read**:
- **X-Axis**: Days of the week (Sun-Sat)
- **Y-Axis**: Adherence percentage (0-100%)
- **Line**: Daily adherence with smooth curve
- **Filled area**: Colored background

**Insights**:
- 📅 **Day-of-week patterns**: Do you miss more on weekends?
- 🔄 **Recent behavior**: Last 7 days performance
- 🎯 **Weekly goal**: Maintain above 80%

**Example Interpretation**:
- Monday-Friday: 100% (perfect weekdays)
- Saturday: 50% (weekend challenge)
- Sunday: 75% (improvement needed)

#### 4. Dose Status Distribution (Doughnut Chart)
**Purpose**: Visual breakdown of all doses by status

**How to Read**:
- **Green section**: Doses taken
- **Red section**: Doses missed
- **Gray section**: Doses pending (not yet due)
- **Percentages**: Shown in legend

**Insights**:
- 🟢 **Large green**: Excellent adherence
- 🔴 **Large red**: Needs improvement
- ⚪ **Large gray**: Many pending (normal if recently started)

**Example Interpretation**:
- 85% Taken (green): Excellent
- 10% Missed (red): Room for improvement
- 5% Pending (gray): Upcoming reminders

### Stats Cards Explained

#### Adherence Rate
**Calculation**: 
```
(Doses Taken ÷ Total Past Doses) × 100
```

**What it means**:
- **90-100%**: 🌟 Excellent - Keep it up!
- **80-89%**: ✅ Very Good - Minor improvements possible
- **70-79%**: 🟡 Good - Focus on consistency
- **60-69%**: 🟠 Fair - Review your routine
- **Below 60%**: 🔴 Needs Attention - Check insights

**Tips to Improve**:
- Set multiple reminders
- Use AI insights for personalized tips
- Link medications to daily routines
- Review missed dose patterns

#### Current Streak
**What it is**: Consecutive doses taken without missing

**How it works**:
- ➕ **Increases**: Every dose you take
- ↩️ **Resets to 0**: When you miss a dose
- 🏆 **Unlocks badges**: At 3, 7, and 30 days

**Streak Tips**:
- Check reminders daily
- Use snooze if timing is bad
- Set backup reminders
- Prepare medications in advance

**Milestone Streaks**:
- 🔥 **3-day streak**: Bronze level
- 🔥 **7-day streak**: Silver level  
- 👑 **30-day streak**: Gold level

#### Total Doses
**What it counts**: All past medication reminders

**Includes**:
- ✅ Taken doses
- ❌ Missed doses
- Doses before today

**Excludes**:
- ⏰ Future reminders (pending)

**Why it matters**: Shows total medication history

#### Doses Taken
**What it counts**: Successfully completed doses

**Recorded when you**:
- Click "Mark as Taken" in notification
- Click "Mark as Taken" in modal
- Click "Mark as Taken" in reminder card

**Why it matters**: Primary metric for adherence calculation

#### Doses Missed
**What it counts**: Doses that weren't taken

**Recorded when**:
- Reminder expires without action
- You manually mark as missed
- System detects overdue reminder

**Why it matters**: Identifies areas for improvement

### Medication-Specific Statistics

**Location**: Bottom of Analytics page

**What it shows**: Individual adherence for each medication

**Display format**:
```
┌────────────────────────────┐
│  Aspirin                   │
│  100mg • Twice daily       │
│                      85%   │
│                   17/20    │
└────────────────────────────┘
```

**Information shown**:
- Medication name
- Dosage and frequency
- Adherence percentage (large number)
- Fraction (taken/total)

**How to use**:
- 🔍 **Identify**: Which medications are problematic
- 📊 **Compare**: Relative adherence across medications
- 🎯 **Focus**: Prioritize improvement areas

**Example insights**:
- Aspirin: 95% (excellent)
- Vitamin D: 60% (needs attention)
- Calcium: 80% (good but can improve)

---

## Badges & Gamification

### Accessing Badges
1. Click **"Badges"** in navigation menu
2. View all badges (earned and locked)

### Badge Page Layout

```
┌─────────────────────────────────────────┐
│  Badges & Achievements                  │
├─────────────────────────────────────────┤
│  [Progress Bar]                         │
│  Your Progress: X/11 badges earned      │
│  [████████░░░░] XX%                     │
├─────────────────────────────────────────┤
│  [Current Stats - 4 Cards]              │
│  - Current Streak    - Adherence Rate   │
│  - Doses Taken       - Perfect Weeks    │
├─────────────────────────────────────────┤
│  [Badges Grid - 5 columns]              │
│  [Earned Badges]    [Locked Badges]     │
│  ✓ Colored          🔒 Grayed out       │
└─────────────────────────────────────────┘
```

### Understanding Badges

#### Badge Status Indicators

**Earned Badge**:
- ✅ **Checkmark** in top-right corner
- **Colored** icon and background
- **Full opacity** and vibrant colors
- **Hover effect**: Scales up slightly

**Locked Badge**:
- 🔒 **No checkmark**
- **Grayed out** icon
- **50% opacity**
- **No hover effect**

### Complete Badge List

#### 1. 🌟 Getting Started
**Requirement**: Take your first dose

**How to earn**:
1. Add a medication
2. Set up reminder
3. Take your first dose
4. Badge unlocks automatically

**Difficulty**: ⭐ Very Easy

**Tips**: Easiest badge - just get started!

---

#### 2. 🔥 3-Day Streak
**Requirement**: Maintain a 3-day streak

**How to earn**:
1. Take doses 3 days in a row
2. Don't miss any doses
3. Badge unlocks on 3rd consecutive day

**Difficulty**: ⭐⭐ Easy

**Tips**: 
- Set consistent daily times
- Use reminders
- Check app daily

---

#### 3. 🔥 7-Day Streak
**Requirement**: Maintain a 7-day streak

**How to earn**:
1. Take doses 7 days in a row
2. Don't miss any doses
3. Badge unlocks on 7th consecutive day

**Difficulty**: ⭐⭐⭐ Medium

**Tips**:
- Plan for weekends
- Set backup alarms
- Prepare weekly pill organizer

---

#### 4. 👑 30-Day Streak
**Requirement**: Maintain a 30-day streak

**How to earn**:
1. Take doses 30 days in a row
2. Don't miss any doses
3. Badge unlocks on 30th consecutive day

**Difficulty**: ⭐⭐⭐⭐⭐ Very Hard

**Tips**:
- Build strong habits
- Use AI insights
- Set multiple reminders
- Link to daily routine

---

#### 5. 🎯 Consistency Champion
**Requirement**: Achieve 80% adherence with at least 10 total doses

**How to earn**:
1. Take at least 10 doses total
2. Maintain 80% or higher adherence
3. Badge unlocks when both conditions met

**Difficulty**: ⭐⭐⭐ Medium

**Tips**:
- Focus on consistency over perfection
- Take 8 out of 10 doses minimum
- Use Analytics to track progress

---

#### 6. 🏆 Perfect Form
**Requirement**: Achieve 95% adherence with at least 20 total doses

**How to earn**:
1. Take at least 20 doses total
2. Maintain 95% or higher adherence
3. Can only miss 1 out of 20 doses

**Difficulty**: ⭐⭐⭐⭐ Hard

**Tips**:
- Nearly perfect required
- Set extra reminders
- Review missed dose patterns
- Use quiet hours wisely

---

#### 7. 🥇 Flawless
**Requirement**: Achieve 100% adherence with at least 30 total doses

**How to earn**:
1. Take at least 30 doses total
2. **Never miss a single dose**
3. Perfect adherence required

**Difficulty**: ⭐⭐⭐⭐⭐ Very Hard

**Tips**:
- Requires dedication
- Use all available tools
- Set multiple backup reminders
- Check app daily
- Plan ahead for travel

---

#### 8. ❤️ Committed
**Requirement**: Take 10 doses total

**How to earn**:
1. Take any 10 doses
2. Can be any medication
3. Doesn't require streak

**Difficulty**: ⭐⭐ Easy

**Tips**: Just keep taking medications consistently

---

#### 9. ⚡ Dedicated
**Requirement**: Take 50 doses total

**How to earn**:
1. Take any 50 doses
2. Can be any medication
3. Doesn't require streak

**Difficulty**: ⭐⭐⭐ Medium

**Tips**: Takes time but achievable with consistency

---

#### 10. 🏅 Health Hero
**Requirement**: Take 100 doses total

**How to earn**:
1. Take any 100 doses
2. Can be any medication
3. Doesn't require streak

**Difficulty**: ⭐⭐⭐⭐ Hard

**Tips**: Long-term achievement - stay committed

---

#### 11. ✨ Perfect Week
**Requirement**: Complete a week with 100% adherence

**How to earn**:
1. Take all doses for 7 consecutive days
2. No missed doses allowed
3. Must be a complete week (Sun-Sat or Mon-Sun)

**Difficulty**: ⭐⭐⭐⭐ Hard

**Tips**:
- Plan the week
- Avoid distractions
- Use weekend strategies
- Set extra reminders on challenging days

### Badge Unlocking Animation

**What happens when you earn a badge**:

1. **Full-screen modal appears**
   - Black semi-transparent background
   - Centered white card with animation

2. **Trophy icon bounces**
   - Large yellow trophy
   - Bounce animation
   - Celebratory feel

3. **Badge details shown**
   - Badge icon (colored)
   - Badge name (large text)
   - Badge description

4. **Auto-dismisses after 3 seconds**
   - Or click anywhere to close
   - Returns to normal view

5. **Badge appears earned on Badges page**
   - Checkmark added
   - Full color displayed
   - Added to earned count

### Progress Tracking

**Progress Bar**:
- Shows completion percentage
- Updates in real-time
- Formula: `(Earned Badges ÷ 11) × 100`

**Example Progress**:
- 3/11 badges = 27% complete
- 5/11 badges = 45% complete
- 11/11 badges = 100% complete (All badges!)

**Progress Card** (top of page):
- **Purple gradient** background
- Shows earned count (X/11)
- Shows percentage (XX%)
- Visual progress bar

### Stats Dashboard

Located below progress bar, shows:

1. **Current Streak** (🔥 Orange flame icon)
   - Number of consecutive doses
   - Updates in real-time

2. **Adherence Rate** (🎯 Green target icon)
   - Percentage of doses taken
   - Updates when you take/miss doses

3. **Doses Taken** (❤️ Red heart icon)
   - Total doses taken count
   - Increases with each dose

4. **Perfect Weeks** (✨ Cyan sparkles icon)
   - Number of weeks with 100% adherence
   - Used for Perfect Week badge

### Badge Strategies

#### For Quick Wins:
1. Start with **"Getting Started"** (easiest)
2. Focus on **"Committed"** (10 doses)
3. Build a **"3-Day Streak"**

#### For Long-Term Goals:
1. Work towards **"7-Day Streak"**
2. Maintain **80% adherence** for "Consistency Champion"
3. Aim for **"Perfect Week"**

#### For Ultimate Challenge:
1. Never miss a dose for **"Flawless"**
2. Build up to **"30-Day Streak"**
3. Reach **100 doses** for "Health Hero"

### Motivation Tips

**Use badges to**:
- Set concrete goals
- Track long-term progress
- Celebrate achievements
- Stay motivated during challenges
- Compete with yourself
- Share progress with family/friends

**Remember**:
- Every badge earned is an achievement
- Focus on progress, not perfection
- Missed doses are learning opportunities
- Consistency beats perfection

---

## Medication History

### Accessing History
1. Click **"History"** in navigation menu
2. View comprehensive event timeline

### History Page Layout

```
┌─────────────────────────────────────────┐
│  Medication History                     │
├─────────────────────────────────────────┤
│  [Two Tabs]                             │
│  • Timeline (chronological)             │
│  • Medications (grouped)                │
├─────────────────────────────────────────┤
│  [Search & Filters]                     │
│  Search: [text input]                   │
│  Medication: [dropdown]                 │
│  Date Range: [From] to [To]            │
│  Event Type: [dropdown]                 │
│  [Apply Filters] [Clear]                │
├─────────────────────────────────────────┤
│  [Timeline/List View]                   │
│  Events displayed here...               │
└─────────────────────────────────────────┘
```

### Understanding Event Types

#### 🟢 Started
**When recorded**: Medication first added to app

**Information shown**:
- Medication name
- Dosage
- Frequency
- Date/time added
- Prescriber

**Example**:
```
Started Aspirin
100mg • Twice daily
Prescribed by Dr. Smith
Jan 5, 2025 at 9:30 AM
```

---

#### 🔴 Stopped
**When recorded**: Medication deactivated or deleted

**Information shown**:
- Medication name
- Reason (if provided)
- Date/time stopped

**Example**:
```
Stopped Aspirin
Treatment completed
Jan 20, 2025 at 2:15 PM
```

---

#### ✅ Taken
**When recorded**: Dose marked as taken

**Information shown**:
- Medication name
- Scheduled time
- Time actually taken
- Dosage

**Example**:
```
Taken Aspirin
100mg dose
Scheduled: 8:00 AM
Taken: 8:05 AM
```

---

#### ❌ Missed
**When recorded**: Dose not taken

**Information shown**:
- Medication name
- Scheduled time
- Missed time
- Reason (if system-detected or manual)

**Example**:
```
Missed Vitamin D
Scheduled: 9:00 AM
Not taken
```

---

#### 🔄 Refilled
**When recorded**: Prescription refilled

**Information shown**:
- Medication name
- Refill date
- Quantity (if recorded)
- Pharmacy (if recorded)

**Example**:
```
Refilled Aspirin
30-day supply
Walgreens Pharmacy
Jan 15, 2025
```

---

#### 📈 Dosage Increased
**When recorded**: Dosage adjusted upward

**Information shown**:
- Medication name
- Previous dosage
- New dosage
- Reason
- Doctor approval status

**Example**:
```
Dosage Increased - Aspirin
From: 100mg
To: 150mg
Reason: Doctor recommendation
Approved by Dr. Smith
```

---

#### 📉 Dosage Decreased
**When recorded**: Dosage adjusted downward

**Information shown**:
- Medication name
- Previous dosage
- New dosage
- Reason
- Doctor approval status

**Example**:
```
Dosage Decreased - Aspirin
From: 150mg
To: 100mg
Reason: Side effects
Approved by Dr. Smith
```

---

#### 🕐 Schedule Modified
**When recorded**: Reminder schedule changed

**Information shown**:
- Medication name
- Old schedule
- New schedule
- Modification date

**Example**:
```
Schedule Modified - Aspirin
Changed to: Twice daily
At: 8:00 AM and 8:00 PM
Previously: Once daily
```

### Using the Timeline View

**What it shows**: Chronological list of all events

**How it's organized**:
- **Most recent first** (newest at top)
- Grouped by date
- Color-coded by event type
- Icons for quick identification

**How to read**:
```
┌─────────────────────────────────┐
│ [Icon] Event Type               │
│ Medication Name                 │
│ Details here...                 │
│ Date • Time                     │
└─────────────────────────────────┘
```

**Event colors**:
- 🟢 **Green**: Positive events (started, taken, refilled)
- 🔴 **Red**: Negative events (stopped, missed)
- 🔵 **Blue**: Informational (schedule changes, dosage)

### Using the Medications View

**What it shows**: Events grouped by medication

**How it's organized**:
- One section per medication
- Expandable/collapsible sections
- Events listed under each medication

**How to use**:
1. Click medication name to expand
2. View all events for that medication
3. Click again to collapse

**Example structure**:
```
▼ Aspirin (12 events)
  ├─ Started - Jan 1
  ├─ Taken - Jan 2
  ├─ Taken - Jan 3
  ├─ Dosage Increased - Jan 5
  └─ ...

▼ Vitamin D (8 events)
  ├─ Started - Jan 1
  ├─ Missed - Jan 2
  └─ ...
```

### Search and Filters

#### Search Bar
**Purpose**: Find specific events by text

**Searches in**:
- Medication names
- Event descriptions
- Prescriber names
- Notes/reasons

**How to use**:
1. Type search term
2. Press Enter or click search icon
3. Results filter automatically

**Examples**:
- Search "Aspirin" → Shows all Aspirin events
- Search "Dr. Smith" → Shows events with Dr. Smith
- Search "increased" → Shows dosage increases

#### Medication Filter
**Purpose**: Show events for specific medication

**How to use**:
1. Click "All Medications" dropdown
2. Select specific medication
3. Click "Apply Filters"
4. View filtered results

**To clear**:
- Select "All Medications" again
- Click "Clear Filters"

#### Date Range Filter
**Purpose**: View events within specific time period

**How to use**:
1. Click "From" date picker
2. Select start date
3. Click "To" date picker
4. Select end date
5. Click "Apply Filters"

**Examples**:
- Last 7 days: Today - 7 days ago
- This month: 1st of month - Today
- Last year: Jan 1 - Dec 31

**To clear**:
- Click "Clear Filters"
- Or select new date range

#### Event Type Filter
**Purpose**: Show only specific event types

**How to use**:
1. Click "All Events" dropdown
2. Select event type:
   - Started
   - Stopped
   - Taken
   - Missed
   - Refilled
   - Dosage Changed
   - Schedule Modified
3. Click "Apply Filters"

**Examples**:
- Select "Taken" → See all taken doses
- Select "Missed" → Identify missed patterns
- Select "Dosage Changed" → Track adjustments

#### Combining Filters
**Power user tip**: Use multiple filters together

**Example combinations**:
1. **Aspirin + Last 30 days + Taken**
   - See all Aspirin doses taken in last month

2. **All Medications + This week + Missed**
   - Identify this week's missed doses

3. **Vitamin D + All time + Dosage Changed**
   - Track all dosage changes for Vitamin D

### Exporting History

**Currently not available** in the app, but you can:

**Option 1: Browser Console**
```javascript
// Copy this to browser console
console.log(JSON.stringify(
  JSON.parse(localStorage.getItem('medication-store'))
    .state.medicationHistory,
  null,
  2
))
```

**Option 2: Manual Screenshots**
- Use browser's screenshot feature
- Capture timeline views
- Save for personal records

### History Use Cases

**Medical Appointments**:
- Review medication history before doctor visits
- Share dosage change history
- Discuss adherence patterns

**Adherence Analysis**:
- Identify missed dose patterns
- Find problematic times/days
- Track improvement over time

**Medication Management**:
- Remember when prescriptions were filled
- Track dosage adjustments
- Verify schedule changes

**Health Records**:
- Maintain personal health documentation
- Track medication journey
- Reference past events

---

## User Profile

### Accessing Profile
1. Click **"Profile"** in navigation menu
2. View/edit all profile sections

### Profile Page Layout

```
┌─────────────────────────────────────────┐
│  Profile                                │
├─────────────────────────────────────────┤
│  [Personal Information]                 │
│  Name, DOB, Gender, Contact Info        │
├─────────────────────────────────────────┤
│  [Health Information]                   │
│  Allergies, Conditions, Vitals          │
├─────────────────────────────────────────┤
│  [Emergency Contact]                    │
│  Name, Relationship, Phone              │
├─────────────────────────────────────────┤
│  [Doctors]                              │
│  Add/manage doctor contacts             │
├─────────────────────────────────────────┤
│  [Prescription Files]                   │
│  Upload/manage prescriptions            │
├─────────────────────────────────────────┤
│  [Notification Settings]                │
│  Configure reminder preferences         │
├─────────────────────────────────────────┤
│  [AI Settings]                          │
│  Configure AI features and API key      │
└─────────────────────────────────────────┘
```

### Personal Information Section

#### Fields Available

**Name**:
- Full legal name
- Used throughout app
- Required for reports

**Date of Birth**:
- Format: MM/DD/YYYY
- Used for age calculations
- Privacy: Stored locally only

**Gender**:
- Options: Male, Female, Other, Prefer not to say
- Optional field
- For medical context

**Email**:
- Contact email address
- Validation: Must be valid email format
- Example: `user@example.com`

**Phone**:
- Contact phone number
- Validation: Minimum 10 digits
- Format: Any (will be validated)
- Example: `(555) 123-4567`

**Address**:
- Full mailing address
- Multi-line input
- For emergency services reference

#### How to Edit

1. Click **"Personal Information"** section to expand
2. Click in any field to edit
3. Type new information
4. Click outside field or press Enter
5. **Auto-saves** on blur (leaving field)

**Validation messages**:
- ❌ **Red text**: Invalid format
- ✅ **Saves automatically**: When valid

### Health Information Section

#### Allergies Management

**What to include**:
- Medication allergies
- Food allergies (if relevant)
- Environmental allergies (if severe)

**How to add**:
1. Expand **"Health Information"** section
2. Find "Allergies" subsection
3. Type allergy name in input field
4. Press Enter or click "+ Add"
5. Allergy appears in list with X button

**How to remove**:
1. Find allergy in list
2. Click red X button next to name
3. Confirms deletion immediately

**Example allergies**:
- Penicillin
- Aspirin
- Sulfa drugs
- Peanuts
- Latex

**Why it matters**:
- Critical for emergency situations
- Prevents dangerous drug interactions
- Reference for new prescriptions

#### Medical Conditions Management

**What to include**:
- Chronic conditions
- Current diagnoses
- Relevant medical history

**How to add**:
1. Find "Conditions" subsection
2. Type condition name
3. Press Enter or click "+ Add"
4. Condition appears with date added

**How to remove**:
1. Click X button next to condition
2. Removes immediately

**Example conditions**:
- Hypertension
- Diabetes Type 2
- Asthma
- Heart disease
- Arthritis

**Why it matters**:
- Context for medication needs
- Drug interaction awareness
- Emergency medical information

#### Vital Statistics

**Blood Type**:
- Dropdown selection
- Options: A+, A-, B+, B-, AB+, AB-, O+, O-
- Critical emergency information

**Height**:
- Format: Feet and inches or centimeters
- Example: `5'10"` or `178 cm`
- Used for dosage calculations (some medications)

**Weight**:
- Format: Pounds or kilograms
- Example: `170 lbs` or `77 kg`
- Important for medication dosing

### Emergency Contact Section

**Purpose**: Quick access to emergency contact during medical situations

**Fields**:

**Name**:
- Full name of emergency contact
- Should be someone reliable
- Available 24/7 ideally

**Relationship**:
- Your relationship to them
- Examples: Spouse, Parent, Sibling, Friend

**Phone**:
- Primary contact number
- Validation: Must be valid phone
- Should be reachable quickly

**How to edit**:
1. Expand **"Emergency Contact"** section
2. Fill/update fields
3. Auto-saves on field blur

**Best practices**:
- Choose someone local
- Ensure they have your medical info
- Update if contact changes
- Verify number periodically

### Doctors Management

**Purpose**: Store healthcare provider information for quick reference

#### Adding a Doctor

1. Click **"+ Add Doctor"** button
2. Fill in the form:
   - **Name**: Dr. First Last
   - **Specialty**: e.g., "Cardiologist"
   - **Phone**: Office number
   - **Email**: Professional email (optional)
   - **Address**: Office address (optional)
3. Click **"Add"**
4. Doctor appears in list

#### Editing a Doctor

1. Find doctor in list
2. Click **"Edit"** button
3. Modify fields in modal
4. Click **"Save Changes"**

#### Removing a Doctor

1. Find doctor in list
2. Click **"Remove"** button (red)
3. Confirms deletion
4. Doctor removed from list

#### Doctor List Display

**Shows**:
- Doctor name with specialty
- Phone number
- Email (if provided)
- Edit and Remove buttons

**Example**:
```
┌─────────────────────────────────┐
│ Dr. Jane Smith                  │
│ Cardiologist                    │
│ 📞 (555) 123-4567              │
│ 📧 dr.smith@clinic.com         │
│ [Edit] [Remove]                 │
└─────────────────────────────────┘
```

### Prescription Files Upload

**Purpose**: Store digital copies of prescriptions

#### Supported Formats
- **PDF**: `.pdf`
- **Images**: `.jpg`, `.jpeg`, `.png`
- **HEIC**: `.heic` (iOS photos)

**File Size**: Maximum 10MB per file

#### Upload Methods

**Method 1: Drag and Drop**
1. Drag prescription file
2. Drop into upload area
3. File validates automatically
4. Uploads if valid

**Method 2: Click to Browse**
1. Click **"Upload Prescription"** area
2. File browser opens
3. Select prescription file
4. Click **"Open"**
5. File uploads automatically

#### Upload Process

**Steps**:
1. File selected/dropped
2. **Validation checks**:
   - ✅ File format allowed
   - ✅ File size under 10MB
   - ❌ Shows error if invalid
3. **File converted** to base64
4. **Stored locally** in browser
5. **Thumbnail generated** (if image)
6. **Added to list**

**Progress indicator**:
- Shows during upload
- Completes when stored

#### Managing Uploaded Files

**File List Shows**:
- File name
- Upload date
- File size
- Preview icon (if image)
- Download button
- Delete button

**To view a file**:
1. Click on file name or preview
2. Opens in new tab/window
3. Can view full quality

**To download a file**:
1. Click **"Download"** button
2. Saves to your downloads folder
3. Original format preserved

**To delete a file**:
1. Click red X or **"Delete"** button
2. Confirms deletion
3. Permanently removes from app

**Storage note**:
- Files stored in browser localStorage
- Limited by browser storage limits (typically 5-10MB total)
- Compressed for efficient storage

### Notification Settings

(See [Reminders System - Notification Settings](#notification-settings) section for complete details)

**Quick access from Profile page**:
- Sound, Vibration, Interaction settings
- Auto-generate toggle
- Days ahead configuration
- Quiet hours setup

### AI Settings

#### Enable AI Features

**Purpose**: Turn AI-powered adherence suggestions on/off

**How to configure**:
1. Find **"AI Settings"** section
2. Toggle **"Enable AI Features"**
   - ✅ **ON**: AI insights enabled
   - ❌ **OFF**: Only rule-based insights

**When to disable**:
- Want only basic suggestions
- Prefer not to use external AI
- Conserve API usage

#### Show Adherence Insights

**Purpose**: Control visibility of insights on Dashboard

**How to configure**:
1. Find **"Show Adherence Insights"** toggle
2. Switch ON or OFF
   - ✅ **ON**: Insights appear on Dashboard
   - ❌ **OFF**: Insights hidden

**Note**: Must have "Enable AI Features" ON for this to work

#### Gemini API Key Configuration

**Purpose**: Connect to Google's Gemini AI service

**Default key**:
- Pre-configured with working key
- Shared across all users
- May hit rate limits

**Using your own key**:

**Step 1: Get API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the generated key

**Step 2: Configure in App**
1. Go to Profile → AI Settings
2. Find "Gemini API Key" field
3. Click 👁️ (eye icon) to show current key
4. Clear existing key
5. Paste your new key
6. Click away from field (auto-saves)

**Step 3: Verify**
1. Refresh Dashboard
2. Check if insights appear
3. If not, check browser console for errors

**Key display**:
- **Hidden**: Shows as `••••••••••••••••••`
- **Visible**: Shows actual key text
- **Toggle**: Click eye icon to switch

**Security notes**:
- Stored in browser localStorage only
- Never sent to any server except Google's
- Only you can see it
- Can be changed anytime

**API key info**:
- **Free tier**: 60 requests per minute
- **Fallback**: Rule-based insights if API fails
- **Privacy**: Your data never leaves your device

---

## Help & Support

### Accessing Help
1. Click **"Help"** in navigation menu
2. Browse resources and FAQ

### Help Page Sections

#### Getting Started Guide

**5-step quick start**:
1. **Grant Permissions**
   - Allow notifications
   - Why it's important

2. **Add Medications**
   - Click + button
   - Fill basic info

3. **Set Up Reminders**
   - Choose schedule
   - Configure times

4. **Take Your Medications**
   - Respond to reminders
   - Build habits

5. **Track Progress**
   - Check Analytics
   - Earn badges

#### Additional Resources

**Three helpful cards**:

1. **📖 User Guide**
   - Link to full documentation
   - Comprehensive instructions
   - All features explained

2. **💡 Tips & Tricks**
   - Best practices
   - Productivity hacks
   - Common solutions

3. **🐛 Report Issue**
   - How to report bugs
   - Feature requests
   - Contact information

#### FAQ Section

**18 questions across 6 categories**:

**Categories**:
- All (shows everything)
- Medications
- Reminders
- Schedules
- Prescriptions
- Account

**How to use**:
1. Select category (or All)
2. Use search bar to find questions
3. Click question to expand answer
4. Click again to collapse

**Search feature**:
- Type keyword or question
- Filters questions in real-time
- Searches both questions and answers

### Chat Widget

**Location**: Floating button (bottom-right corner of all pages)

**Purpose**: Quick help and contextual assistance

#### Opening the Chat

**Method 1**: Click the chat bubble icon
**Method 2**: Icon animates when new tips available

**Widget appearance**:
- Blue circular button
- Chat bubble icon
- Subtle animation

#### Using the Chat

**Chat window features**:
- **Header**: "Chat Assistant" with close button
- **Message area**: Conversation history
- **Input area**: Type your message
- **Send button**: Submit message

**How to chat**:
1. Click chat bubble to open
2. Type your question or concern
3. Press Enter or click Send
4. AI responds with helpful information
5. Continue conversation as needed

**Quick Replies**:
- Suggested actions/questions
- Click to auto-send
- Save typing time

**Sample topics**:
- "How do I add a medication?"
- "Why did I miss a reminder?"
- "How do I change my schedule?"
- "What are badges?"
- "How do I view history?"

#### Chat Features

**Message History**:
- Shows previous messages
- Scrollable conversation
- Persists during session
- Clears on page refresh

**Typing Indicator**:
- Shows "..." when AI is responding
- Indicates processing
- Brief delay (~1-2 seconds)

**Smart Responses**:
- Context-aware answers
- Keyword matching
- Provides relevant guidance
- Links to specific features

**Closing the Chat**:
- Click X button in header
- Click outside window
- Window collapses to bubble

### Common Help Topics

#### Getting Started
- How to add first medication
- Setting up notifications
- Understanding the dashboard

#### Medications
- Adding medications
- Editing dosage
- Requesting refills
- Activating/deactivating
- Deleting medications

#### Reminders
- Setting up schedules
- Snoozing reminders
- Marking as taken/missed
- Quiet hours
- Notification settings

#### Schedules
- Daily schedules
- Weekly schedules
- Interval-based schedules
- As-needed medications
- Editing schedules

#### Analytics
- Understanding charts
- Reading adherence rate
- Tracking streaks
- Viewing history

#### Badges
- How to earn badges
- Badge requirements
- Tracking progress
- Unlocking achievements

#### Profile
- Editing personal info
- Adding health information
- Emergency contacts
- Uploading prescriptions
- Managing doctors

#### AI Features
- Enabling AI insights
- Configuring API key
- Understanding suggestions
- Troubleshooting AI errors

---

## Advanced Features

### Progressive Web App (PWA)

#### What is a PWA?

A **Progressive Web App** is a website that works like a native mobile/desktop app:
- ✅ Install on device
- ✅ Works offline
- ✅ Receives push notifications
- ✅ Appears on home screen/desktop
- ✅ Runs in standalone window

#### Installing the PWA

**On Desktop (Chrome/Edge)**:
1. Open MedManager in browser
2. Look for install icon in address bar (⊕)
3. Click the icon
4. Click **"Install"** in popup
5. App installs and opens in new window
6. Shortcut added to desktop/applications

**On Mobile (Android)**:
1. Open MedManager in Chrome
2. Tap menu (⋮)
3. Tap **"Install app"** or **"Add to Home screen"**
4. Tap **"Install"**
5. Icon appears on home screen
6. Tap icon to launch

**On Mobile (iOS/Safari)**:
1. Open MedManager in Safari
2. Tap Share button (⎙)
3. Scroll down, tap **"Add to Home Screen"**
4. Tap **"Add"**
5. Icon appears on home screen
6. Tap icon to launch

#### Using Installed PWA

**Launch**:
- Desktop: Double-click icon
- Mobile: Tap icon

**Appearance**:
- No browser chrome
- Full-screen app window
- Native app feel

**Features**:
- All functionality available
- Works offline
- Push notifications
- Fast loading

#### Offline Functionality

**What works offline**:
- ✅ View medications
- ✅ See reminders
- ✅ Mark doses taken/missed
- ✅ Check analytics
- ✅ Browse history
- ✅ Edit profile
- ✅ View badges

**What requires internet**:
- ❌ AI adherence suggestions (uses fallback)
- ❌ First-time app load
- ❌ Service worker updates

**How offline mode works**:
1. **Service worker** caches app files
2. **LocalStorage** stores all data
3. **IndexedDB** queues offline actions
4. **Background sync** syncs when online returns

**Offline actions**:
- Marked doses sync automatically when online
- No data lost during offline period
- Visual indicator shows offline status

#### App Shortcuts

**Available shortcuts** (right-click app icon):

1. **View Reminders**
   - Quick access to reminders page
   - See upcoming doses

2. **Add Medication**
   - Direct to add medication form
   - Fast medication entry

**How to use**:
- **Desktop**: Right-click app icon
- **Mobile**: Long-press app icon
- Select shortcut from menu

### Background Sync

**Purpose**: Syncs offline actions when connectivity returns

**How it works**:
1. You mark dose while offline
2. Action stored in IndexedDB queue
3. Service worker detects connection
4. Automatically syncs queued actions
5. Local data updated

**What gets synced**:
- Taken doses
- Missed doses
- Medication changes
- Profile updates

**Visual feedback**:
- No action required from you
- Happens automatically
- Console logs confirm sync (if you check)

### Push Notifications

#### Browser Notifications

**Capabilities**:
- System-level alerts
- Show when browser closed
- Interactive action buttons
- Persistent (require interaction)
- Vibration (mobile)
- Sound

**Notification components**:
```
┌────────────────────────────────┐
│ 💊 Medication Reminder          │
│                                 │
│ Time to take Aspirin            │
│ 100mg - Twice daily             │
│                                 │
│ [Mark Taken] [Snooze 10 min]   │
└────────────────────────────────┘
```

**Interaction options**:
- **Mark Taken**: Records dose immediately
- **Snooze 10 min**: Delays reminder
- **Click notification**: Opens app
- **Dismiss**: Reminder stays in app

#### Notification Permissions

**Checking status**:
1. Look at browser address bar
2. Click lock/info icon
3. Check "Notifications" permission

**Permission states**:
- ✅ **Allowed**: Notifications work
- ❌ **Blocked**: No notifications
- ❓ **Ask**: Will prompt when needed

**Fixing blocked notifications**:
1. Click lock icon in address bar
2. Find "Notifications" setting
3. Change to "Allow"
4. Refresh page

#### Notification Troubleshooting

**Not receiving notifications?**

**Check 1: Permissions**
- Verify notifications allowed in browser
- Check system notification settings (OS level)

**Check 2: Quiet Hours**
- Review quiet hours settings
- Disable temporarily to test

**Check 3: Browser Focus**
- Some browsers only show when app is closed
- Try closing browser completely

**Check 4: Service Worker**
- Open browser console (F12)
- Check for service worker errors
- Try unregistering and re-registering

**Still not working?**
- Clear browser cache
- Reinstall PWA
- Try different browser
- Check browser notification settings in OS

### Service Worker

**What is it?**: Background script that enables offline functionality and notifications

**What it does**:
- Caches app files for offline use
- Manages push notifications
- Syncs data in background
- Updates app automatically

**Service Worker Status**:
- Check browser DevTools → Application → Service Workers
- Should show "activated and running"

**Updating Service Worker**:
- Happens automatically
- Checks for updates hourly
- New version installs in background
- Prompts for reload when ready

**Troubleshooting Service Worker**:
1. Open DevTools (F12)
2. Go to Application tab
3. Click Service Workers
4. Click "Unregister"
5. Refresh page
6. New service worker registers

### Data Storage

#### LocalStorage

**What's stored**:
- Medications list
- Reminders
- History events
- Profile information
- Settings
- AI configuration
- Unlocked badges

**Storage key**: `medication-store`

**Size limit**: ~5-10MB (browser-dependent)

**Persistence**: 
- Remains until manually cleared
- Survives browser restarts
- Deleted only if you clear browser data

#### IndexedDB

**What's stored**:
- Pending offline actions
- Temporary data queue

**Database name**: `MedicationManagerDB`

**Purpose**: Queue offline actions for sync

**Automatic cleanup**: After successful sync

#### Clearing Data

**⚠️ Warning**: This deletes all medications, reminders, and settings

**Method 1: Browser Settings**
1. Browser Settings → Privacy
2. Clear browsing data
3. Select "Cookies and site data"
4. Choose time range
5. Click Clear

**Method 2: Browser Console**
```javascript
localStorage.clear()
indexedDB.deleteDatabase('MedicationManagerDB')
location.reload()
```

**Method 3: DevTools**
1. Open DevTools (F12)
2. Application tab
3. Storage → Local Storage
4. Right-click → Clear
5. Refresh page

#### Exporting Data

**Currently no built-in export**, but you can:

**Console method**:
```javascript
// Copy this output
console.log(localStorage.getItem('medication-store'))

// Save to file (manual):
// 1. Copy console output
// 2. Paste into text editor
// 3. Save as medication-backup.json
```

**Importing data**:
```javascript
// Paste your backup JSON
const backup = { /* your backup data */ }

localStorage.setItem('medication-store', JSON.stringify(backup))
location.reload()
```

### Theme Customization

#### Dark Mode

**How it works**:
- Auto-detects system preference
- Manual toggle available
- Persists across sessions

**Enabling Dark Mode**:
1. Click moon/sun icon in navigation
2. Theme switches immediately
3. Preference saved

**System preference**:
- Windows: Settings → Personalization → Colors → Dark
- macOS: System Preferences → General → Appearance → Dark
- Linux: Varies by desktop environment

**Theme persistence**:
- Saved to localStorage
- Key: `theme`
- Values: `'light'` or `'dark'`

#### Customizing Colors

**Currently not supported in UI**, but developers can modify:
- Edit `tailwind.config.js`
- Modify `index.css`
- Rebuild app with `npm run build`

---

## Troubleshooting

### Common Issues

#### App Not Loading

**Symptoms**: Blank page, loading forever, error message

**Solutions**:

**1. Clear browser cache**
```
Chrome/Edge: Ctrl+Shift+Delete → Clear cache
Firefox: Ctrl+Shift+Delete → Clear cache
Safari: Cmd+Option+E
```

**2. Check internet connection**
- Ensure you're online for first load
- Try accessing other websites

**3. Try different browser**
- Chrome (recommended)
- Firefox
- Safari
- Edge

**4. Check browser console**
- Press F12
- Look for red error messages
- Share errors if seeking help

---

#### Notifications Not Working

**Symptoms**: No alerts when reminders are due

**Solutions**:

**1. Check permissions**
```
1. Click lock icon in address bar
2. Check "Notifications" → Allowed
3. If blocked, change to Allow
4. Refresh page
```

**2. Check system settings**
- Windows: Settings → System → Notifications
- macOS: System Preferences → Notifications
- Android: Settings → Apps → Notifications
- iOS: Settings → Notifications → Safari

**3. Verify quiet hours**
- Go to Profile → Notification Settings
- Check if in quiet hours period
- Disable temporarily to test

**4. Test with browser closed**
- Close all browser windows
- Wait for scheduled reminder time
- Should receive system notification

**5. Check service worker**
- F12 → Application → Service Workers
- Should show "activated and running"
- If not, refresh page

---

#### Reminders Not Generating

**Symptoms**: No future reminders appear

**Solutions**:

**1. Check auto-generate setting**
```
Profile → Notification Settings
→ Auto-Generate Reminders: ON
```

**2. Verify medication has schedule**
```
1. View medication details
2. Check schedule is configured
3. If not, click "Edit Schedule"
4. Set up schedule type and times
```

**3. Check days ahead setting**
```
Profile → Notification Settings
→ Days Ahead: 7 (or more)
```

**4. Manually trigger generation**
```
Open browser console (F12)
Type: location.reload()
Check Reminders page again
```

**5. Check browser console**
```
F12 → Console tab
Look for "Auto-generating reminders" message
If error appears, note it for support
```

---

#### Data Not Saving

**Symptoms**: Changes disappear after refresh

**Solutions**:

**1. Check localStorage availability**
```javascript
// Open console (F12)
try {
  localStorage.setItem('test', 'test')
  localStorage.removeItem('test')
  console.log('localStorage working')
} catch(e) {
  console.error('localStorage not available:', e)
}
```

**2. Check storage quota**
```
- F12 → Application → Storage
- View "Usage" bar
- If full, clear some data
```

**3. Disable browser extensions**
- Privacy extensions may block storage
- Temporarily disable
- Test app again

**4. Check incognito/private mode**
- Regular mode recommended
- Private mode has limited storage
- Data cleared when window closes

---

#### AI Insights Not Showing

**Symptoms**: No insights appear on Dashboard

**Solutions**:

**1. Check AI settings**
```
Profile → AI Settings
→ Enable AI Features: ON
→ Show Adherence Insights: ON
```

**2. Verify API key**
```
Profile → AI Settings
→ Gemini API Key: Should have value
→ If empty, will use default
```

**3. Check browser console**
```
F12 → Console tab
Look for:
- "Error generating AI insights"
- "429" error (rate limit)
- "404" error (invalid model)
```

**4. API rate limits**
- Free tier: 60 requests/minute
- If exceeded, wait 1 minute
- Or use your own API key

**5. Check fallback insights**
- Even if API fails, should show rules
- If no insights at all, check console

---

#### Charts Not Displaying

**Symptoms**: Blank areas where charts should be

**Solutions**:

**1. Check if you have data**
```
- Need at least 1 taken/missed reminder
- Charts show "No data" if empty
```

**2. Clear browser cache**
```
Ctrl+Shift+Delete → Clear cache
Refresh page
```

**3. Check browser console**
```
F12 → Console
Look for Chart.js errors
```

**4. Try different browser**
- Chart.js works in all modern browsers
- Update browser if old version

---

#### Badge Not Unlocking

**Symptoms**: Met requirement but badge still locked

**Solutions**:

**1. Verify actual stats**
```
Go to Badges page
Check stats cards
→ Current Streak: X
→ Adherence Rate: X%
→ Doses Taken: X
```

**2. Check exact requirements**
```
Click badge to see description
Ensure ALL conditions met
Example: 80% adherence AND 10+ doses
```

**3. Refresh page**
```
Sometimes updates need refresh
Ctrl+R or F5
Check badge status again
```

**4. Clear badge cache**
```javascript
// Open console (F12)
localStorage.removeItem('unlockedBadges')
location.reload()
// Badges will recalculate
```

**5. Wait for recalculation**
- Badges check on page load
- May take a moment to update
- Check stats cards match requirements

---

#### Slow Performance

**Symptoms**: App loads slowly, laggy interface

**Solutions**:

**1. Clear old reminders**
```
- Many old reminders = slower app
- System auto-cleans after 30 days
- Check Reminders page count
```

**2. Clear browser data**
```
Ctrl+Shift+Delete
→ Cached images and files
→ Clear
```

**3. Close other tabs**
- Too many tabs = slow browser
- Close unused tabs
- Restart browser

**4. Check browser extensions**
- Heavy extensions slow down
- Disable unnecessary ones
- Test app again

**5. Update browser**
```
Chrome: Menu → Help → About
Firefox: Menu → Help → About Firefox
```

---

### Error Messages

#### "Failed to load resource: 429"

**Meaning**: API rate limit exceeded

**Solution**: 
- Wait 1 minute and try again
- App uses fallback insights automatically
- Or add your own API key in Profile → AI Settings

---

#### "Notification permission denied"

**Meaning**: Notifications blocked

**Solution**:
1. Click lock icon in address bar
2. Change Notifications to "Allow"
3. Refresh page

---

#### "Service Worker registration failed"

**Meaning**: PWA features not working

**Solution**:
1. Check HTTPS (required for service workers)
2. Clear browser cache
3. Try different browser
4. Check browser console for details

---

#### "Invalid API key"

**Meaning**: AI API key not working

**Solution**:
1. Go to Profile → AI Settings
2. Check API key format
3. Try default key (remove yours)
4. Or get new key from Google AI Studio

---

### Getting Help

#### In-App Help
1. Click **Help** in navigation
2. Browse FAQ
3. Use Chat Widget for quick questions

#### Console Logs
When reporting issues:
1. Open DevTools (F12)
2. Go to Console tab
3. Copy any error messages (red text)
4. Include in report

#### Browser Information
Share when reporting:
- Browser name and version
- Operating system
- Error messages
- Steps to reproduce

---

## FAQ

### General Questions

**Q: Is my data secure?**  
A: Yes. All data is stored locally on your device in your browser. Nothing is sent to external servers except:
- AI API requests (only adherence patterns, no personal info)
- No medication names, no personal details shared

**Q: Can I use this on multiple devices?**  
A: Data is stored per browser, so each device has its own data. To sync:
1. Export data from one device (console method)
2. Import on other device
3. Or use same browser with sync enabled

**Q: Is this a replacement for medical advice?**  
A: No. This is a tool to help manage medications. Always consult healthcare professionals for medical decisions.

**Q: How much storage does it use?**  
A: Typically 1-5MB depending on data amount. Browser allows 5-10MB for most sites.

**Q: Will it work on my phone?**  
A: Yes! Works on iOS and Android. Install as PWA for best experience.

---

### Medications

**Q: How do I add a medication?**  
A: Dashboard → + Add Medication → Fill details → Add

**Q: Can I edit medication details after adding?**  
A: Yes. Click medication card → View → Edit button → Modify → Save

**Q: What happens when I deactivate a medication?**  
A: It stays in app (grayed out) but no new reminders generate. Can reactivate anytime.

**Q: Can I track PRN (as-needed) medications?**  
A: Yes. Use "As-Needed" schedule type. Manually mark when taken.

**Q: How do I delete a medication permanently?**  
A: Click View → Scroll down → Delete button. ⚠️ This removes all history!

---

### Reminders

**Q: How far ahead are reminders generated?**  
A: Default is 7 days. Change in Profile → Notification Settings → Days Ahead

**Q: Can I set different times for different days?**  
A: Yes. Use Weekly schedule and set time for each selected day.

**Q: What if I miss a reminder?**  
A: It's marked as missed and affects adherence rate. Review patterns in Analytics.

**Q: Can I turn off reminders temporarily?**  
A: Yes. Use Quiet Hours feature or disable Auto-Generate in settings.

**Q: Do reminders work when app is closed?**  
A: Yes! Browser notifications work even when browser is closed (if permissions granted).

---

### Analytics & Badges

**Q: How is adherence rate calculated?**  
A: (Doses Taken ÷ Total Past Doses) × 100

**Q: What's a good adherence rate?**  
A: 80% or higher is considered good. 95%+ is excellent.

**Q: How do I earn badges?**  
A: Meet specific requirements (take doses, build streaks, maintain adherence). Check Badges page for details.

**Q: Can I lose badges?**  
A: No. Once earned, badges stay earned forever.

**Q: Why isn't my badge unlocking?**  
A: Verify you meet ALL requirements. Some badges need multiple conditions (e.g., adherence % AND dose count).

---

### AI Features

**Q: What AI model is used?**  
A: Google's Gemini 2.0 Flash Experimental model.

**Q: Do I need my own API key?**  
A: No. Default key provided. But you can use your own for unlimited requests.

**Q: What if AI insights don't show?**  
A: App automatically uses rule-based insights as fallback. Check API key and settings.

**Q: Is my data sent to Google?**  
A: Only adherence patterns (percentages, counts). No medication names or personal information.

**Q: Can I disable AI features?**  
A: Yes. Profile → AI Settings → Toggle off "Enable AI Features"

---

### Technical

**Q: What browsers are supported?**  
A: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (all modern browsers)

**Q: Does it work offline?**  
A: Yes! After first load, works completely offline. Syncs when connectivity returns.

**Q: How do I install as an app?**  
A: Click install icon in address bar (desktop) or "Add to Home Screen" (mobile).

**Q: Can I export my data?**  
A: Yes, via browser console. See [Data Storage](#data-storage) section for instructions.

**Q: How do I backup my medications?**  
A: Copy localStorage data via console (see Data Storage section) or screenshot important info.

---

### Troubleshooting

**Q: App not loading?**  
A: Clear cache, try different browser, check internet connection.

**Q: Notifications not working?**  
A: Check permissions, verify not in quiet hours, test with browser closed.

**Q: Why are my changes not saving?**  
A: Check localStorage enabled, not in private mode, browser extensions not blocking.

**Q: Charts not showing?**  
A: Need data first (take/miss doses), clear cache, check browser console.

**Q: Slow performance?**  
A: Clear old reminders, close other tabs, update browser.

---

## Appendix

### Keyboard Shortcuts

**Coming in future update**

Current version: Use mouse/touch interaction

---

### Supported Browsers & Versions

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome  | 90             | Latest      |
| Firefox | 88             | Latest      |
| Safari  | 14             | Latest      |
| Edge    | 90             | Latest      |

**Mobile**:
- iOS Safari 14+
- Android Chrome 90+

---

### Storage Limits

| Storage Type | Typical Limit | Used For |
|-------------|---------------|----------|
| LocalStorage | 5-10 MB      | All app data |
| IndexedDB    | 50 MB+       | Offline queue |
| Cache        | Varies       | App files |

---

### API Endpoints

**Gemini AI API**:
- Base URL: `https://generativelanguage.googleapis.com/v1beta`
- Model: `gemini-2.0-flash-exp`
- Rate Limit: 60 requests/minute (free tier)

---

### Update Log

**Version 1.0.0** (January 2025)
- Initial release
- All core features
- PWA support
- AI integration
- Gamification system

---

### Credits

**Developed by**: Your Development Team  
**Powered by**: React, Vite, Tailwind CSS  
**AI by**: Google Gemini  
**Icons by**: Lucide React  

---

### Legal

**Privacy**: All data stored locally on your device. No data collection.  
**License**: MIT License  
**Medical Disclaimer**: This app is a tool, not medical advice. Consult healthcare professionals for medical decisions.

---

**End of Documentation**

For questions or support, use the in-app Help section or Chat Widget.

**Version 1.0.0** | **Last Updated: January 2025**
