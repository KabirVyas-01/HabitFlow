# HabitFlow — Calm Habit Tracking & Momentum

> A mindful, tactile habit tracking web application designed for quiet consistency, daily rituals, and natural momentum. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

---

## 🔗 Live Application Links

- **Production / Shared App**: [https://kabirvyas-habitflow.ai.studio/](https://kabirvyas-habitflow.ai.studio/)

---

## 🌿 Overview

**HabitFlow** translates the serene aesthetic of mindful discipline into a responsive web application. The interface emphasizes calm clarity over loud gamification, featuring an earthy forest-and-mint palette, Newsreader editorial typography, Plus Jakarta Sans micro-labels, and tactile interactions.

---

## ✨ Features

### 1. Dashboard (Overview)
- **Daily Discipline Metric**: Real-time completed ritual counter (`6 / 8 rituals completed`) with dynamic completion percentage and adaptive helper messaging.
- **Animated SVG Circular Gauge**: Smooth SVG progress ring calculating completion percentage and stroke offset.
- **Streak Tracking**: Displays current streak (`18 Days`) with flame indicators and best recorded streak (`42 Days`).
- **Interactive Habit Cards**:
  - One-tap checkbox completion toggle with satisfying strike-through styling.
  - Focus Area categorization tags (`Mind`, `Body`, `Work`, `Reflect`, `Health`).
  - Scheduled time and intention/target metadata.
  - Click-to-edit integration to adjust habit parameters or delete routines.
  - Inline reminder badge with immediate quick-scheduling trigger.
- **7-Day Weekly Consistency Bar Chart**:
  - Visual completion heights and fractions (`8/8`, `7/8`, `6/8`) across Monday through Sunday.
  - Distinct active today indicator dot and interactive date selection.
  - Dynamically calculated weekly average completion rate.
- **30-Day Activity Heatmap**:
  - 4-week calendar grid showcasing habit density using graduated color scales.
  - Ring highlight for the active day and interactive cell selection.
- **Mindful Habit Tip**: Curated companion reflection note for restorative routine pacing.

### 2. Progress & Insights
- **Timeframe Filtering**: Switch seamlessly between `7D`, `30D`, `90D`, and `Year` windows.
- **Core KPI Cards**: High-level completion rate, total lifetime/period completions, and active routine counts.
- **Monthly Execution Calendar**: 31-day interactive October matrix mapped to historical habit densities with active day badges and legend.
- **Ranked Habit Consistency**: Ranked progress bars with percentage consistency, consecutive day streaks, and flame badges.
- **Habit Correlation (AI Pattern)**: Analytical correlation insights (e.g., Morning Mindfulness driving Evening Reflection adherence).
- **Weekly Reflection Journaling**: Micro-journaling modal to record thoughts, rate mental state (`Calm`, `Grounded`, `Focused`, `Energized`), and review past reflections.

### 3. Habit Creation & Customization (New / Edit Habit)
- **Live Card Preview**: Updates in real time as the user configures habit name, symbol, palette tint, and cadence.
- **Focus Area Selector**: Quick categorization chips (`Health`, `Focus`, `Mindfulness`, `Fitness`, `Learning`, `Work`, `Personal`).
- **Curated Symbol Grid**: Curated Material Symbols (`self_improvement`, `water_drop`, `fitness_center`, `menu_book`, `bedtime`, `psychology`, `laptop_mac`, etc.).
- **Harmonious Tint Palette**: 6 curated earth-toned swatches (`#1e3a2f`, `#3a6752`, `#304c41`, `#2a3829`, `#224f3c`, `#486458`).
- **Cadence & Rhythm**:
  - `Daily`, `Weekly`, and `Custom` frequency tabs.
  - Individual day-of-week toggles with an "All Days" shortcut.
  - Time of day selector (`Morning`, `Afternoon`, `Evening`).
  - Target / Intention input field (e.g., `30 mins before sleep`, `2.5L goal`).
- **Atmosphere & Mood Inspiration**: Embedded visual aesthetic thumbnails (`Evening Stillness`, `Restful Reset`).
- **Deletion Support**: Safe habit removal with confirmation dialog when editing existing routines.

### 4. Daily Reminder & Notification Scheduling System
- **Time Picker (`ReminderTimePicker`)**:
  - Native `<input type="time">` input synced bidirectionally with 12-hour (`09:00 PM`) and 24-hour (`21:00`) formats.
  - Hour, minute, and AM/PM drop-down controls.
  - Quick rhythm presets (`07:00 AM`, `09:00 AM`, `12:30 PM`, `06:00 PM`, `09:00 PM`).
- **Habit Metadata Persistence**:
  - Reminder preferences (`reminderEnabled`, `reminderTime`, `reminderTime24`, `scheduledTime`) are saved directly in habit metadata and persisted in `localStorage`.
- **Background Scheduler**:
  - Periodic scheduler checking enabled habits against the clock to dispatch reminders.
  - Dispatches browser `Notification` (when permissions are granted) and an in-app banner.
- **In-App Notification Banner**:
  - Non-intrusive top banner with habit icon, reminder time, and one-tap **Complete** and **Dismiss** buttons.
- **Centralized Notification Schedule**:
  - Settings panel listing all habits and their reminder times with toggle switches and instant "Test Prompt" buttons.

### 5. Account & Data Persistence
- **Authorized Account Support**: Configured with user profile and authorized Google account (`kabirvyas199@gmail.com`).
- **Export & Backup**: One-click JSON data export of all habits, completions, and reflections.
- **Reset Demo Data**: Restore initial benchmark data at any time.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript (strict types, ES2022)
- **Styling**: Tailwind CSS v4 with custom `@theme` design tokens
- **Typography**: Google Fonts (*Newsreader* serif + *Plus Jakarta Sans*)
- **Icons**: Google Material Symbols Outlined + SVG fallbacks
- **State & Storage**: React Context API with persistent `localStorage` synchronization

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point, fonts, metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
├── public/                      # Static assets & inspiration artwork
└── src/
    ├── main.tsx                 # React DOM mount
    ├── App.tsx                  # Root app layout, view router, modals
    ├── index.css                # Tailwind theme tokens & typography classes
    ├── types/
    │   └── habit.ts             # TypeScript interfaces (Habit, TintColor, etc.)
    ├── context/
    │   └── HabitContext.tsx     # Centralized state, persistence, notification scheduler
    ├── utils/
    │   └── habitUtils.ts        # Time conversion (12h/24h), dates, seed data, stats
    └── components/
        ├── Header.tsx           # Fixed top bar with SVG brand logo & profile
        ├── BottomNav.tsx        # 5-tab thumb navigation with elevated (+) button
        ├── OverviewView.tsx     # Dashboard, daily progress, habit cards, weekly bar chart
        ├── ProgressView.tsx     # Analytics, monthly execution heatmap, consistency bars
        ├── NewHabitView.tsx     # Habit creator / editor, live card preview, time picker
        ├── HabitsListView.tsx   # Habit library with focus area filters & quick reminders
        ├── ReminderTimePicker.tsx# Reusable 12h/24h time picker & rhythm presets
        ├── NotificationBanner.tsx# In-app reminder toast with Complete/Dismiss
        ├── ReflectionModal.tsx  # Mindful journal modal & mood tagging
        └── SettingsModal.tsx    # Preferences, profile, notification schedule, data export
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

---

## 🎨 Design Tokens

| Token Name | Value | Purpose |
| :--- | :--- | :--- |
| `--color-surface` | `#f6fbf5` | Calm, neutral canvas background |
| `--color-primary` | `#07241a` | Deepest brand text & headlines |
| `--color-primary-container` | `#1e3a2f` | Dark forest green cards & primary CTAs |
| `--color-secondary` | `#3a6752` | Jade accent for active streaks & bars |
| `--color-secondary-container` | `#bceed3` | Soft mint container for icons & highlights |
| `--color-surface-container` | `#ebefea` | Card surfaces & neutral chips |
| `--color-surface-container-lowest` | `#ffffff` | Elevated white card containers |

---

## 📄 License

Apache-2.0
