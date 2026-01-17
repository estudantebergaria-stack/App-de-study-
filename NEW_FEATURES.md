# New Features Documentation

This document describes the new features added to the Focus study app as part of the comprehensive enhancement update.

## Overview

The enhancement adds a complete diagnostic and gamification system to help students stay motivated and track their progress more effectively.

## Features

### 1. Next Best Action Card
**Location**: Top of Dashboard  
**Purpose**: Shows 1-3 recommended study actions based on your current progress

The card displays:
- Primary mission with large action button (e.g., "Estudar 25 min agora")
- Up to 2 additional missions with quick-start buttons
- XP rewards for each mission

**How it works**: The system analyzes your study patterns, goals, and review schedules to suggest the most impactful next steps.

### 2. Subject Diagnostics
**Location**: Dashboard (below heatmap)  
**Purpose**: Shows a comprehensive health score (0-100) for each subject

Each subject displays:
- **Overall Score**: Weighted average of three dimensions
- **Focus Score**: Weekly study time vs your goal
- **Review Score**: How recently you studied (inverse of days since last study)
- **Consistency Score**: Days studied this week (out of 7)

**Visual Indicators**:
- 🟢 Green (80-100): Excellent
- 🟡 Yellow (60-79): Needs attention
- 🔴 Red (0-59): Critical

**Actions**: Quick buttons to study 25 min or review 10 min for any subject below 80.

### 3. Weekly Heatmap
**Location**: Top of Dashboard  
**Purpose**: Visual calendar showing study intensity across the week

Features:
- Monday-Sunday grid with color-coded intensity
- Daily goal indicator (default 30 min)
- Hover tooltips showing exact minutes
- Ring highlight when daily goal is met

**Color Scale**:
- Dark/Empty: 0 minutes
- Light colors: Partial progress
- Bright colors: Meeting or exceeding goal

### 4. XP & Leveling System
**Location**: Dashboard (gamification section)  
**Purpose**: Track progress and provide motivation through experience points

**How XP Works**:
- **Study**: 10 XP per minute
- **Review** (with topic): 15 XP per minute
- **Streak Bonus**: Up to 2× multiplier at 30-day streak
- **Anti-Abuse**: Diminishing returns after 90 continuous minutes

**Levels**:
1. Iniciante (0 XP)
2. Aprendiz (500 XP)
3. Estudante (2,000 XP)
4. Dedicado (4,500 XP)
5. Focado (8,000 XP)
6. Persistente (12,500 XP)
7. Determinado (18,000 XP)
8. Comprometido (24,500 XP)
9. Expert (32,000 XP)
10. Mestre (40,500 XP)
11. Lenda (50,000+ XP)

**Formula**: Level N requires N² × 500 XP total

### 5. Daily Missions
**Location**: Dashboard (next to XP card)  
**Purpose**: Provide clear daily goals with completion tracking

**Mission Types**:
1. **Review Mission**: Study a neglected subject
2. **Goal Mission**: Work toward weekly goal
3. **Daily Completion**: Reach 45 min total study time

**Features**:
- Automatic generation based on your progress
- XP rewards (150-250 XP)
- Completion checkmarks
- One-click start buttons
- Progress bar showing missions completed

### 6. Streak Protection
**Location**: Dashboard (shown only when needed)  
**Purpose**: Remind you to preserve your study streak

**When it appears**: 
- You have an active streak (1+ days)
- You haven't studied today yet

**Action**: Quick 15-minute study session button

### 7. Weekly Summary
**Location**: Dashboard (below missions)  
**Purpose**: Week-over-week comparison with actionable insights

**Shows**:
- **This Week vs Last Week**: Minutes studied and % change
- **Trend Indicator**: 📈 Improving or 📉 Declining
- **Top 3 Recommendations**:
  - 🔴 Critical: Subjects not studied in 7+ days
  - 🟡 Warning: Subjects below weekly goal
  - 🟢 Positive: Subjects with excellent progress

**Actions**: Each recommendation has a quick-action button

## Usage Tips

### Maximizing XP
1. Maintain a daily study streak for up to 2× XP multiplier
2. Add topics when studying for 15 XP/min instead of 10 XP/min
3. Avoid marathon sessions—XP efficiency drops after 90 minutes
4. Complete daily missions for bonus XP

### Setting Up for Success
1. **Set Weekly Goals**: Go to "Metas Semanais" and set realistic hours per subject
2. **Add Topics**: Use "Gerenciar Matérias" to add specific topics for review tracking
3. **Check Dashboard Daily**: Review missions and recommendations
4. **Use Quick Actions**: Click CTAs instead of manually setting up sessions

### Understanding Your Scores
- **Focus < 60**: You're behind on study time—increase weekly sessions
- **Review < 60**: It's been too long since you studied—schedule a review
- **Consistency < 60**: Study more days per week—aim for 5-7 days

## Mobile Optimization

The app now features consistent dark theme colors on mobile:
- **Android Chrome**: Uses `theme-color` meta tag
- **iOS Safari**: Uses `apple-mobile-web-app-status-bar-style`
- **PWA**: Dark theme color in manifest

All new components are fully responsive and touch-optimized.

## Theme Support

All new features support the complete theme system:
- Dark (default)
- Light
- Neon Purple
- Neon Blue
- Neon Green
- Neon Pink
- Elite (unlocked at 100 hours)
- Mestre (unlocked at 30-day streak)

## Translation Ready

All UI text uses the existing translation system and is available in:
- Portuguese (pt-BR)
- English (en-US)
- Spanish (es-ES)
- Russian (ru-RU)

## Technical Details

### New Components
- `NextBestActionCard.tsx`: Primary action suggestions
- `SubjectDiagnostics.tsx`: Subject health scores
- `WeeklyHeatmap.tsx`: Calendar visualization
- `XPProgressCard.tsx`: Level and XP display
- `DailyMissionsCard.tsx`: Mission tracking
- `StreakReminderCard.tsx`: Streak protection
- `WeeklySummary.tsx`: Week comparison and insights

### New Utilities (utils.ts)
- `calculateSubjectScore()`: Score calculation
- `generateDailyMissions()`: Mission generation
- `getWeekHeatmapData()`: Heatmap data
- `calculateSessionXP()`: XP calculation
- `calculateLevel()`: Level from XP
- `getLevelInfo()`: Level metadata
- `isMissionCompleted()`: Mission status

### Data Structure
```typescript
// Added to UserSettings
interface UserSettings {
  xp?: number;      // Total XP earned
  level?: number;   // Current level
  // ... existing fields
}

// Added to StudyLog
interface StudyLog {
  xpEarned?: number;  // XP from this session
  // ... existing fields
}
```

## Future Enhancements

Potential additions based on the original requirements:
- Donut chart for subject time distribution
- Post-session energy/difficulty feedback
- Progress rings for important subjects
- AI-powered session recommender
- Auto-adjust goals based on performance
- Advanced notification system
- Offline mode support
- Voice input for logging sessions

---

For questions or suggestions, please open an issue on GitHub.
