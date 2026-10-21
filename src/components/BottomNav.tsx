import React from 'react';
import { useHabits } from '../context/HabitContext';
import { ViewTab } from '../types/habit';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, setEditingHabit } = useHabits();

  const handleNav = (tab: ViewTab) => {
    if (tab === 'new-habit') {
      setEditingHabit(null);
    }
    setCurrentView(tab);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] border-t border-surface-container-high/40">
      <div className="max-w-xl mx-auto flex justify-around items-center h-16 px-space-xs">
        {/* Overview Tab */}
        <button
          onClick={() => handleNav('overview')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors cursor-pointer ${
            currentView === 'overview'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Overview"
          type="button"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentView === 'overview' ? "'FILL' 1" : "'FILL' 0" }}
          >
            space_dashboard
          </span>
          <span className="font-label-sm text-label-sm">Overview</span>
        </button>

        {/* Habits Tab */}
        <button
          onClick={() => handleNav('my-habits')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors cursor-pointer ${
            currentView === 'my-habits'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Habits"
          type="button"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentView === 'my-habits' ? "'FILL' 1" : "'FILL' 0" }}
          >
            check_circle
          </span>
          <span className="font-label-sm text-label-sm">Habits</span>
        </button>

        {/* Center Add Button */}
        <div className="relative flex items-center justify-center min-w-[56px] min-h-[44px] -top-3">
          <button
            onClick={() => handleNav('new-habit')}
            aria-label="Add Habit"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary shadow-[0_4px_12px_rgba(30,58,47,0.25)] active:scale-95 transition-all cursor-pointer hover:opacity-95"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl font-light">add</span>
          </button>
        </div>

        {/* Progress Tab */}
        <button
          onClick={() => handleNav('progress')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors cursor-pointer ${
            currentView === 'progress'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Progress"
          type="button"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentView === 'progress' ? "'FILL' 1" : "'FILL' 0" }}
          >
            monitoring
          </span>
          <span className="font-label-sm text-label-sm">Progress</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => handleNav('settings')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors cursor-pointer ${
            currentView === 'settings'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Settings"
          type="button"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentView === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
          >
            tune
          </span>
          <span className="font-label-sm text-label-sm">Settings</span>
        </button>
      </div>
    </nav>
  );
};
