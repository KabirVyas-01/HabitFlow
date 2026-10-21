export type HabitCategory = 'Health' | 'Focus' | 'Mindfulness' | 'Fitness' | 'Learning' | 'Work' | 'Mind' | 'Body' | 'Reflect' | 'Personal';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'All day';

export type CadenceType = 'Daily' | 'Weekly' | 'Custom';

export type TintColor =
  | 'primary-container'
  | 'secondary'
  | 'on-primary-fixed-variant'
  | 'tertiary-container'
  | 'on-secondary-fixed-variant'
  | 'surface-tint'
  | 'primary-fixed'
  | 'tertiary-fixed';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  symbol: string;
  tintColor: TintColor;
  cadence: CadenceType;
  repeatDays: number[]; // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun
  timeOfDay: TimeOfDay;
  scheduledTime?: string; // e.g. "07:00 AM"
  target?: string; // e.g. "15 min meditation", "2.5L goal", "30 mins before sleep"
  reminderEnabled: boolean;
  reminderTime?: string; // e.g. "09:00 PM"
  reminderTime24?: string; // e.g. "21:00"
  lastNotifiedDate?: string; // e.g. "2024-10-24"
  createdAt: string; // ISO date string
}

export interface ActiveReminderNotification {
  id: string;
  habitId: string;
  habitName: string;
  symbol: string;
  reminderTime: string;
  target?: string;
  triggeredAt: string;
}

export type CompletionMap = Record<string, Record<string, boolean>>; // habitId -> { 'YYYY-MM-DD': true }

export interface DailyReflection {
  id: string;
  date: string;
  content: string;
  mood?: string;
  createdAt: string;
}

export type ViewTab = 'overview' | 'my-habits' | 'new-habit' | 'progress' | 'settings';
