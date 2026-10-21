import React from 'react';
import { useHabits } from '../context/HabitContext';

export const NotificationBanner: React.FC = () => {
  const { activeNotifications, dismissNotification, toggleHabitCompletion, isHabitCompleted, selectedDate } =
    useHabits();

  if (activeNotifications.length === 0) return null;

  return (
    <div
      className="fixed top-16 inset-x-0 z-50 px-margin pt-2 pointer-events-none"
      role="region"
      aria-label="Habit Reminder Notifications"
    >
      <div className="max-w-xl mx-auto space-y-2">
        {activeNotifications.map((notif) => {
          const completed = isHabitCompleted(notif.habitId, selectedDate);
          return (
            <div
              key={notif.id}
              className="pointer-events-auto bg-primary-container text-on-primary rounded-2xl p-3.5 shadow-lg border border-secondary-container/20 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary-container font-semibold">
                      Daily Reminder • {notif.reminderTime}
                    </span>
                  </div>
                  <p className="font-headline-sm text-sm text-white font-semibold truncate">
                    {notif.habitName}
                  </p>
                  {notif.target && (
                    <p className="font-body-sm text-xs text-on-primary-container truncate">
                      {notif.target}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!completed && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleHabitCompletion(notif.habitId, selectedDate);
                      dismissNotification(notif.id);
                    }}
                    className="px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Complete
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Dismiss reminder"
                  onClick={() => dismissNotification(notif.id)}
                  className="w-8 h-8 rounded-full hover:bg-primary/40 text-on-primary-container flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
