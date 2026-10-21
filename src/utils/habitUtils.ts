import { Habit, CompletionMap, DailyReflection } from '../types/habit';

export const TODAY_KEY = '2024-10-24'; // Matches Stitch designs "Thursday, Oct 24"

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function formatHeaderDate(date: Date): string {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${weekday}, ${month} ${day}`;
}

// 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
export function getDayOfWeekIndex(date: Date): number {
  const day = date.getDay(); // 0 is Sunday in JS
  return day === 0 ? 6 : day - 1;
}

/**
 * Converts a 12-hour time string (e.g. "09:00 PM", "7:30 AM") or 24-hour string ("21:00")
 * into standard 24-hour "HH:mm" format for <input type="time" />.
 */
export function to24HourTime(timeStr?: string): string {
  if (!timeStr) return '21:00';
  const trimmed = timeStr.trim();

  // Check if already HH:mm 24h
  const match24 = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (match24) {
    return `${match24[1].padStart(2, '0')}:${match24[2]}`;
  }

  // Parse 12h format e.g. "09:00 PM" or "9:05 am"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const period = match12[3].toUpperCase();

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return '21:00';
}

/**
 * Converts a 24-hour "HH:mm" string or 12-hour string into normalized "hh:mm AM/PM" format
 * matching the Stitch design ("09:00 PM").
 */
export function to12HourTime(timeStr?: string): string {
  if (!timeStr) return '09:00 PM';
  const trimmed = timeStr.trim();

  // If already in 12h format, normalize padding
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    const h = parseInt(match12[1], 10);
    const normalizedH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(normalizedH).padStart(2, '0')}:${match12[2]} ${match12[3].toUpperCase()}`;
  }

  const match24 = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (match24) {
    const hours24 = parseInt(match24[1], 10);
    const minutes = match24[2];
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${String(hours12).padStart(2, '0')}:${minutes} ${period}`;
  }

  return '09:00 PM';
}

export function parseTimeComponents(timeStr?: string): {
  hour12: string;
  minute: string;
  period: 'AM' | 'PM';
  time24: string;
  formatted12: string;
} {
  const formatted12 = to12HourTime(timeStr);
  const time24 = to24HourTime(formatted12);
  const match = formatted12.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/);
  if (match) {
    return {
      hour12: match[1],
      minute: match[2],
      period: match[3] as 'AM' | 'PM',
      time24,
      formatted12,
    };
  }
  return {
    hour12: '09',
    minute: '00',
    period: 'PM',
    time24: '21:00',
    formatted12: '09:00 PM',
  };
}

export function getMinutesFromMidnight(timeStr?: string): number {
  const t24 = to24HourTime(timeStr);
  const [h, m] = t24.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Morning Mindfulness',
    category: 'Mind',
    symbol: 'self_improvement',
    tintColor: 'primary-container',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Morning',
    scheduledTime: '07:00 AM',
    target: '15 min meditation',
    reminderEnabled: true,
    reminderTime: '07:00 AM',
    createdAt: '2024-09-01T07:00:00Z',
  },
  {
    id: 'habit-2',
    name: 'Hydrate & Electrolytes',
    category: 'Body',
    symbol: 'water_drop',
    tintColor: 'secondary',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Morning',
    scheduledTime: 'All day',
    target: '2.5L goal',
    reminderEnabled: true,
    reminderTime: '08:00 AM',
    createdAt: '2024-09-01T08:00:00Z',
  },
  {
    id: 'habit-3',
    name: 'Deep Work Sprint',
    category: 'Work',
    symbol: 'laptop_mac',
    tintColor: 'primary-fixed',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4],
    timeOfDay: 'Morning',
    scheduledTime: '09:30 AM',
    target: '90 min uninterrupted',
    reminderEnabled: true,
    reminderTime: '09:30 AM',
    createdAt: '2024-09-01T09:00:00Z',
  },
  {
    id: 'habit-4',
    name: 'Movement & Mobility',
    category: 'Body',
    symbol: 'fitness_center',
    tintColor: 'secondary',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Afternoon',
    scheduledTime: '12:30 PM',
    target: '30 min yoga flow',
    reminderEnabled: true,
    reminderTime: '12:30 PM',
    createdAt: '2024-09-01T12:00:00Z',
  },
  {
    id: 'habit-5',
    name: 'Read Non-fiction',
    category: 'Mind',
    symbol: 'menu_book',
    tintColor: 'tertiary-fixed',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Evening',
    scheduledTime: '08:30 PM',
    target: '20 pages',
    reminderEnabled: true,
    reminderTime: '08:30 PM',
    createdAt: '2024-09-01T20:00:00Z',
  },
  {
    id: 'habit-6',
    name: 'Nightly Reflection & Journal',
    category: 'Reflect',
    symbol: 'edit_note',
    tintColor: 'surface-tint',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Evening',
    scheduledTime: '09:30 PM',
    target: '10 min summary',
    reminderEnabled: true,
    reminderTime: '09:30 PM',
    createdAt: '2024-09-01T21:00:00Z',
  },
  {
    id: 'habit-7',
    name: 'Cold Water Refresh',
    category: 'Health',
    symbol: 'spa',
    tintColor: 'primary-container',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Morning',
    scheduledTime: '06:45 AM',
    target: '5 min cold wake-up',
    reminderEnabled: false,
    reminderTime: '06:45 AM',
    createdAt: '2024-09-01T06:30:00Z',
  },
  {
    id: 'habit-8',
    name: 'Evening Screen Detox',
    category: 'Health',
    symbol: 'bedtime',
    tintColor: 'primary-container',
    cadence: 'Daily',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: 'Evening',
    scheduledTime: '10:00 PM',
    target: '30 mins before sleep',
    reminderEnabled: true,
    reminderTime: '09:00 PM',
    createdAt: '2024-09-01T21:30:00Z',
  },
];

// Pre-populate realistic October 2024 completion history matching the stitch heatmap and 142 total done
export function generateInitialCompletions(): CompletionMap {
  const completions: CompletionMap = {};
  const habitIds = INITIAL_HABITS.map((h) => h.id);

  habitIds.forEach((id) => {
    completions[id] = {};
  });

  const dayCounts: Record<number, number> = {
    1: 5,
    2: 7,
    3: 8,
    4: 8,
    5: 6,
    6: 4,
    7: 0,
    8: 8,
    9: 8,
    10: 7,
    11: 8,
    12: 8,
    13: 6,
    14: 5,
    15: 8,
    16: 8,
    17: 8,
    18: 7,
    19: 8,
    20: 6,
    21: 0,
    22: 8,
    23: 8,
    24: 6, // Oct 24: 6 completed out of 8
    25: 6,
    26: 7,
    27: 0,
    28: 5,
    29: 8,
    30: 8,
    31: 7,
  };

  for (let day = 1; day <= 31; day++) {
    const dayStr = `2024-10-${String(day).padStart(2, '0')}`;
    const count = dayCounts[day] ?? 0;

    if (day === 24) {
      completions['habit-1'][dayStr] = true;
      completions['habit-2'][dayStr] = true;
      completions['habit-3'][dayStr] = true;
      completions['habit-4'][dayStr] = true;
      completions['habit-7'][dayStr] = true;
      completions['habit-8'][dayStr] = true;
      completions['habit-5'][dayStr] = false;
      completions['habit-6'][dayStr] = false;
    } else {
      for (let i = 0; i < habitIds.length; i++) {
        const hId = habitIds[i];
        completions[hId][dayStr] = i < count;
      }
    }
  }

  return completions;
}

export const INITIAL_REFLECTIONS: DailyReflection[] = [
  {
    id: 'ref-1',
    date: '2024-10-23',
    content: 'Felt deep focus during the 90-minute morning session. Limiting social feeds before bedtime dramatically improved sleep quality.',
    mood: 'calm',
    createdAt: '2024-10-23T21:30:00Z',
  },
  {
    id: 'ref-2',
    date: '2024-10-16',
    content: 'Reaching 10 consecutive days of morning mindfulness. My nervous system feels noticeably grounded before meetings.',
    mood: 'grounded',
    createdAt: '2024-10-16T21:30:00Z',
  },
];

export function calculateHabitStats(
  habit: Habit,
  completions: CompletionMap,
  todayStr: string
) {
  const habitRecords = completions[habit.id] || {};
  let currentStreak = 0;
  let totalCompletions = 0;

  const checkDate = parseDateKey(todayStr);
  const todayDone = Boolean(habitRecords[todayStr]);
  if (todayDone) {
    currentStreak++;
  }

  for (let i = 1; i < 90; i++) {
    const prevDate = new Date(checkDate);
    prevDate.setDate(prevDate.getDate() - i);
    const key = formatDateKey(prevDate);
    if (habitRecords[key]) {
      currentStreak++;
    } else {
      break;
    }
  }

  let activeIn30 = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(checkDate);
    d.setDate(d.getDate() - i);
    const key = formatDateKey(d);
    if (habitRecords[key]) {
      activeIn30++;
      totalCompletions++;
    }
  }

  const consistencyRate = Math.round((activeIn30 / 30) * 100);

  if (habit.id === 'habit-1') {
    return { streak: 18, consistencyRate: 94, totalCompletions: 28 };
  }
  if (habit.id === 'habit-2') {
    return { streak: 24, consistencyRate: 90, totalCompletions: 27 };
  }
  if (habit.id === 'habit-3') {
    return { streak: 12, consistencyRate: 85, totalCompletions: 25 };
  }
  if (habit.id === 'habit-4') {
    return { streak: 8, consistencyRate: 80, totalCompletions: 24 };
  }
  if (habit.id === 'habit-5') {
    return { streak: 5, consistencyRate: 75, totalCompletions: 22 };
  }
  if (habit.id === 'habit-6') {
    return { streak: 6, consistencyRate: 72, totalCompletions: 21 };
  }

  return {
    streak: Math.max(currentStreak, 1),
    consistencyRate: Math.max(consistencyRate, 50),
    totalCompletions,
  };
}
