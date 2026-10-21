import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Habit,
  CompletionMap,
  DailyReflection,
  ViewTab,
  ActiveReminderNotification,
} from '../types/habit';
import {
  INITIAL_HABITS,
  generateInitialCompletions,
  INITIAL_REFLECTIONS,
  TODAY_KEY,
  getDayOfWeekIndex,
  parseDateKey,
  to12HourTime,
  to24HourTime,
} from '../utils/habitUtils';

interface HabitContextType {
  habits: Habit[];
  completions: CompletionMap;
  reflections: DailyReflection[];
  selectedDate: string;
  currentView: ViewTab;
  editingHabit: Habit | null;
  userName: string;
  userEmail: string;
  isAuthenticated: boolean;
  activeNotifications: ActiveReminderNotification[];
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  signInWithAccount: (email: string, name?: string) => void;
  signOutAccount: () => void;
  setSelectedDate: (date: string) => void;
  setCurrentView: (view: ViewTab) => void;
  setEditingHabit: (habit: Habit | null) => void;
  addHabit: (newHabit: Omit<Habit, 'id' | 'createdAt'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  updateHabitReminder: (id: string, reminderEnabled: boolean, reminderTime: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, dateStr?: string) => void;
  isHabitCompleted: (habitId: string, dateStr?: string) => boolean;
  triggerHabitNotification: (habitId: string) => void;
  dismissNotification: (notificationId: string) => void;
  addReflection: (content: string, mood?: string) => void;
  resetDemoData: () => void;
  getHabitsForSelectedDate: () => Habit[];
  getCompletedCountForDate: (dateStr: string) => number;
  getTotalScheduledCountForDate: (dateStr: string) => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = 'habitflow_habits_v2';
const HABITS_LEGACY_KEY = 'habitflow_habits';
const COMPLETIONS_STORAGE_KEY = 'habitflow_completions_v2';
const REFLECTIONS_STORAGE_KEY = 'habitflow_reflections_v2';
const USER_STORAGE_KEY = 'habitflow_user_v2';
const USER_EMAIL_STORAGE_KEY = 'habitflow_user_email_v2';

export const DEFAULT_AUTHORIZED_EMAIL = 'kabirvyas199@gmail.com';

function normalizeHabitMetadata(habit: Habit): Habit {
  const reminderTime12 = to12HourTime(habit.reminderTime || habit.scheduledTime || '09:00 PM');
  const reminderTime24 = to24HourTime(reminderTime12);
  return {
    ...habit,
    reminderEnabled: Boolean(habit.reminderEnabled),
    reminderTime: reminderTime12,
    reminderTime24,
  };
}

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY) || localStorage.getItem(HABITS_LEGACY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeHabitMetadata);
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_HABITS.map(normalizeHabitMetadata);
  });

  const [completions, setCompletions] = useState<CompletionMap>(() => {
    try {
      const saved = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return generateInitialCompletions();
  });

  const [reflections, setReflections] = useState<DailyReflection[]>(() => {
    try {
      const saved = localStorage.getItem(REFLECTIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REFLECTIONS;
  });

  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'Elena';
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_AUTHORIZED_EMAIL;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_KEY);
  const [currentView, setCurrentView] = useState<ViewTab>('overview');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeNotifications, setActiveNotifications] = useState<ActiveReminderNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      const serialized = JSON.stringify(habits);
      localStorage.setItem(HABITS_STORAGE_KEY, serialized);
      localStorage.setItem(HABITS_LEGACY_KEY, serialized);
    } catch {
      // ignore
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(completions));
    } catch {
      // ignore
    }
  }, [completions]);

  useEffect(() => {
    try {
      localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(reflections));
    } catch {
      // ignore
    }
  }, [reflections]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, userName);
    } catch {
      // ignore
    }
  }, [userName]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_EMAIL_STORAGE_KEY, userEmail);
    } catch {
      // ignore
    }
  }, [userEmail]);

  const triggerHabitNotification = useCallback((habitId: string) => {
    setHabits((currentHabits) => {
      const targetHabit = currentHabits.find((h) => h.id === habitId);
      if (!targetHabit) return currentHabits;

      const formattedTime = to12HourTime(targetHabit.reminderTime || '09:00 PM');
      const notif: ActiveReminderNotification = {
        id: `notif-${Date.now()}-${habitId}`,
        habitId: targetHabit.id,
        habitName: targetHabit.name,
        symbol: targetHabit.symbol,
        reminderTime: formattedTime,
        target: targetHabit.target,
        triggeredAt: new Date().toISOString(),
      };

      setActiveNotifications((prev) => [notif, ...prev.filter((n) => n.habitId !== habitId)]);

      // Also dispatch browser notification if permission is already granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`HabitFlow Reminder · ${formattedTime}`, {
            body: `${targetHabit.name}${targetHabit.target ? ` (${targetHabit.target})` : ''}`,
          });
        } catch {
          // ignore browser notification errors in sandboxed iframes
        }
      }

      return currentHabits;
    });
  }, []);

  const dismissNotification = (notificationId: string) => {
    setActiveNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  // Real-time background scheduler checking habit reminder times
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const current24 = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayKeyStr = selectedDate;

      habits.forEach((h) => {
        if (!h.reminderEnabled || !h.reminderTime) return;
        const h24 = h.reminderTime24 || to24HourTime(h.reminderTime);
        const alreadyDone = Boolean(completions[h.id]?.[todayKeyStr]);
        if (h24 === current24 && !alreadyDone && h.lastNotifiedDate !== `${todayKeyStr}-${current24}`) {
          setHabits((prev) =>
            prev.map((item) =>
              item.id === h.id ? { ...item, lastNotifiedDate: `${todayKeyStr}-${current24}` } : item
            )
          );
          triggerHabitNotification(h.id);
        }
      });
    };

    const interval = setInterval(checkSchedule, 20000);
    return () => clearInterval(interval);
  }, [habits, completions, selectedDate, triggerHabitNotification]);

  const signInWithAccount = (email: string, name?: string) => {
    const cleanEmail = email.trim() || DEFAULT_AUTHORIZED_EMAIL;
    setUserEmail(cleanEmail);
    if (name?.trim()) {
      setUserName(name.trim());
    }
    setIsAuthenticated(true);
  };

  const signOutAccount = () => {
    setIsAuthenticated(false);
  };

  const addHabit = (data: Omit<Habit, 'id' | 'createdAt'>): Habit => {
    const id = `habit-${Date.now()}`;
    const reminderTime12 = to12HourTime(data.reminderTime || '09:00 PM');
    const reminderTime24 = to24HourTime(reminderTime12);
    const newHabit: Habit = normalizeHabitMetadata({
      ...data,
      id,
      reminderTime: reminderTime12,
      reminderTime24,
      scheduledTime: data.reminderEnabled ? reminderTime12 : data.scheduledTime || reminderTime12,
      createdAt: new Date().toISOString(),
    });
    setHabits((prev) => [...prev, newHabit]);

    setCompletions((prev) => ({
      ...prev,
      [id]: {},
    }));

    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const merged = { ...h, ...updates };
        if (updates.reminderTime !== undefined) {
          merged.reminderTime = to12HourTime(updates.reminderTime);
          merged.reminderTime24 = to24HourTime(merged.reminderTime);
          merged.scheduledTime = merged.reminderTime;
        }
        return normalizeHabitMetadata(merged);
      })
    );
  };

  const updateHabitReminder = (id: string, reminderEnabled: boolean, reminderTime: string) => {
    const formatted12 = to12HourTime(reminderTime);
    const formatted24 = to24HourTime(formatted12);
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? normalizeHabitMetadata({
              ...h,
              reminderEnabled,
              reminderTime: formatted12,
              reminderTime24: formatted24,
              scheduledTime: formatted12,
            })
          : h
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleHabitCompletion = (habitId: string, dateStr: string = selectedDate) => {
    setCompletions((prev) => {
      const habitRecord = prev[habitId] || {};
      const currentVal = Boolean(habitRecord[dateStr]);
      return {
        ...prev,
        [habitId]: {
          ...habitRecord,
          [dateStr]: !currentVal,
        },
      };
    });
  };

  const isHabitCompleted = (habitId: string, dateStr: string = selectedDate): boolean => {
    return Boolean(completions[habitId]?.[dateStr]);
  };

  const addReflection = (content: string, mood = 'calm') => {
    const newRef: DailyReflection = {
      id: `ref-${Date.now()}`,
      date: selectedDate,
      content,
      mood,
      createdAt: new Date().toISOString(),
    };
    setReflections((prev) => [newRef, ...prev]);
  };

  const resetDemoData = () => {
    setHabits(INITIAL_HABITS.map(normalizeHabitMetadata));
    setCompletions(generateInitialCompletions());
    setReflections(INITIAL_REFLECTIONS);
    setUserName('Elena');
    setUserEmail(DEFAULT_AUTHORIZED_EMAIL);
    setIsAuthenticated(true);
    setSelectedDate(TODAY_KEY);
    setCurrentView('overview');
  };

  const getHabitsForSelectedDate = (): Habit[] => {
    const dateObj = parseDateKey(selectedDate);
    const dayOfWeek = getDayOfWeekIndex(dateObj);

    return habits.filter((habit) => {
      if (habit.cadence === 'Daily') return true;
      if (habit.cadence === 'Weekly' || habit.cadence === 'Custom') {
        return habit.repeatDays.includes(dayOfWeek);
      }
      return true;
    });
  };

  const getCompletedCountForDate = (dateStr: string): number => {
    const dateObj = parseDateKey(dateStr);
    const dayOfWeek = getDayOfWeekIndex(dateObj);

    return habits.filter((h) => {
      const scheduledOnDay =
        h.cadence === 'Daily' || h.repeatDays.includes(dayOfWeek);
      return scheduledOnDay && completions[h.id]?.[dateStr];
    }).length;
  };

  const getTotalScheduledCountForDate = (dateStr: string): number => {
    const dateObj = parseDateKey(dateStr);
    const dayOfWeek = getDayOfWeekIndex(dateObj);

    const count = habits.filter((h) => {
      return h.cadence === 'Daily' || h.repeatDays.includes(dayOfWeek);
    }).length;

    return Math.max(count, 1);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        reflections,
        selectedDate,
        currentView,
        editingHabit,
        userName,
        userEmail,
        isAuthenticated,
        activeNotifications,
        setUserName,
        setUserEmail,
        signInWithAccount,
        signOutAccount,
        setSelectedDate,
        setCurrentView,
        setEditingHabit,
        addHabit,
        updateHabit,
        updateHabitReminder,
        deleteHabit,
        toggleHabitCompletion,
        isHabitCompleted,
        triggerHabitNotification,
        dismissNotification,
        addReflection,
        resetDemoData,
        getHabitsForSelectedDate,
        getCompletedCountForDate,
        getTotalScheduledCountForDate,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
