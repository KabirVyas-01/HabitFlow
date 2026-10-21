import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';

export const HabitFlowLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} shrink-0`}
    aria-label="HabitFlow Logo"
  >
    <rect width="36" height="36" rx="9" fill="#1e3a2f" />
    <path
      d="M26.5 18C26.5 22.6944 22.6944 26.5 18 26.5C13.3056 26.5 9.5 22.6944 9.5 18C9.5 13.3056 13.3056 9.5 18 9.5C19.65 9.5 21.19 9.97 22.5 10.78"
      stroke="#bceed3"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M14.5 18.2L17.1 20.8L22.5 15.2"
      stroke="#bceed3"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="25" cy="11.5" r="2" fill="#e09f5a" />
  </svg>
);

export const Header: React.FC = () => {
  const { currentView, setCurrentView, editingHabit, setEditingHabit, userName, userEmail } = useHabits();
  const [avatarError, setAvatarError] = useState(false);

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'overview':
        return 'Overview';
      case 'my-habits':
        return 'Habits';
      case 'progress':
        return 'Progress';
      case 'settings':
        return 'Settings';
      case 'new-habit':
        return editingHabit ? 'Edit Habit' : 'New Habit';
      default:
        return 'Overview';
    }
  };

  const isFormView = currentView === 'new-habit';

  const handleBack = () => {
    setEditingHabit(null);
    setCurrentView('overview');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-xl mx-auto h-16 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          {isFormView && (
            <button
              aria-label="Go back"
              className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface cursor-pointer"
              onClick={handleBack}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}

          {/* Brand Logo & Title */}
          <div
            onClick={() => {
              setEditingHabit(null);
              setCurrentView('overview');
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <HabitFlowLogo className="w-8 h-8" />

            {isFormView ? (
              <h1 className="font-headline-sm text-headline-sm text-primary font-semibold tracking-tight truncate max-w-[160px]">
                {editingHabit ? 'Edit Habit' : 'New Habit'}
              </h1>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-semibold">
                  HabitFlow
                </span>
                <span className="text-outline-variant font-body-md">/</span>
                <span className="font-label-md text-label-md text-on-surface-variant truncate max-w-[120px]">
                  {getBreadcrumb()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-space-sm">
          <button
            aria-label="Profile"
            title={`${userName} (${userEmail})`}
            onClick={() => setCurrentView('settings')}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            {!avatarError ? (
              <img
                alt={`Profile of ${userName}`}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpmip-hDi70t8xbhDJIT45taYRrNZzQ_JuGvQ9rT0oNeECLG6Ad9Z8C0p2thsHTkA6tGmVkJSJDqPZ-PlsqtIjwOkUdty73haetHYC3IzrnMlN-l9kVZI9wKffg_RSbGIDQERnLUnyDP6AgzJNp20jjfBu8SsqguwllhltY6K-k2GPZs_jLymw2SbTtCB7PuqKk6QxuSIFcdU7VES03baQ4YH4hA-S-vRCbWnYt8o6npj-mCF7YtmrCg"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                {userName.charAt(0)}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
