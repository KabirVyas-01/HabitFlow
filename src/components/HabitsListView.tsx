import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { calculateHabitStats } from '../utils/habitUtils';
import { ReminderTimePicker } from './ReminderTimePicker';

export const HabitsListView: React.FC = () => {
  const {
    habits,
    completions,
    selectedDate,
    setEditingHabit,
    setCurrentView,
    toggleHabitCompletion,
    isHabitCompleted,
    updateHabitReminder,
    triggerHabitNotification,
  } = useHabits();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedReminderId, setExpandedReminderId] = useState<string | null>(null);

  const categories = ['All', 'Mind', 'Body', 'Health', 'Work', 'Reflect'];

  const filteredHabits = habits.filter((h) => {
    if (selectedCategory === 'All') return true;
    return h.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pt-space-sm pb-28 space-y-space-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            All Routines
          </p>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-medium">
            Habit Library
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingHabit(null);
            setCurrentView('new-habit');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-all shadow-[0_2px_8px_rgba(30,58,47,0.18)] cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Habit</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              type="button"
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Habit Cards */}
      <div className="space-y-space-sm">
        {filteredHabits.map((habit) => {
          const completed = isHabitCompleted(habit.id, selectedDate);
          const stats = calculateHabitStats(habit, completions, selectedDate);
          const isReminderOpen = expandedReminderId === habit.id;
          const displayTime = habit.reminderTime || habit.scheduledTime || '09:00 PM';

          return (
            <div
              key={habit.id}
              className="bg-surface-container-lowest rounded-2xl p-space-md flex flex-col gap-space-sm shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Completion Toggle */}
                  <button
                    aria-label={`Toggle ${habit.name}`}
                    onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      completed
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-high text-transparent hover:bg-surface-container-highest'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </button>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setEditingHabit(habit);
                        setCurrentView('new-habit');
                      }}
                    >
                      <span
                        className={`font-body-md text-body-md font-semibold truncate ${
                          completed ? 'line-through text-outline' : 'text-on-surface'
                        }`}
                      >
                        {habit.name}
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shrink-0">
                        {habit.category}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedReminderId(isReminderOpen ? null : habit.id)
                        }
                        aria-label={`Configure reminder time for ${habit.name}`}
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 -ml-1.5 transition-colors cursor-pointer ${
                          habit.reminderEnabled
                            ? 'text-secondary hover:bg-secondary-container/30 font-medium'
                            : 'text-outline hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {habit.reminderEnabled ? 'notifications_active' : 'notifications_off'}
                        </span>
                        <span>{displayTime}</span>
                      </button>
                      {habit.target && <span>•</span>}
                      {habit.target && <span>{habit.target}</span>}
                      <span>•</span>
                      <span className="text-secondary font-medium flex items-center gap-0.5">
                        {stats.streak}d streak
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setExpandedReminderId(isReminderOpen ? null : habit.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      habit.reminderEnabled
                        ? 'bg-secondary-container/50 text-secondary'
                        : 'bg-surface-container text-outline hover:bg-surface-container-high'
                    }`}
                    title="Schedule Reminder"
                    aria-label={`Schedule reminder for ${habit.name}`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {habit.reminderEnabled ? 'notifications_active' : 'notifications'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingHabit(habit);
                      setCurrentView('new-habit');
                    }}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                    title="Edit Habit"
                    aria-label={`Edit ${habit.name}`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
              </div>

              {isReminderOpen && (
                <div className="pt-2 border-t border-surface-container-low space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-primary font-semibold">
                      Daily Reminder Time
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => triggerHabitNotification(habit.id)}
                        className="px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-[11px] hover:bg-secondary-container/40 transition-colors cursor-pointer"
                      >
                        Test Prompt
                      </button>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={habit.reminderEnabled}
                        aria-label={`Toggle reminder for ${habit.name}`}
                        onClick={() =>
                          updateHabitReminder(
                            habit.id,
                            !habit.reminderEnabled,
                            habit.reminderTime || '09:00 PM'
                          )
                        }
                        className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                          habit.reminderEnabled
                            ? 'bg-primary-container justify-end'
                            : 'bg-surface-container-highest justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-2xs" />
                      </button>
                    </div>
                  </div>
                  <ReminderTimePicker
                    inputId={`library-reminder-${habit.id}`}
                    value={habit.reminderTime || habit.scheduledTime || '09:00 PM'}
                    disabled={!habit.reminderEnabled}
                    onChange={(formatted12) =>
                      updateHabitReminder(habit.id, true, formatted12)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div className="bg-surface-container-low rounded-2xl p-space-lg text-center space-y-2">
            <span className="material-symbols-outlined text-outline text-3xl">spa</span>
            <p className="font-body-md text-body-md text-on-surface font-medium">
              No habits found in this focus area
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Create a new habit or pick a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
