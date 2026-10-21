import React, { useState } from 'react';
import { useHabits, DEFAULT_AUTHORIZED_EMAIL } from '../context/HabitContext';
import { to12HourTime, to24HourTime } from '../utils/habitUtils';

export const SettingsView: React.FC = () => {
  const {
    userName,
    userEmail,
    isAuthenticated,
    signInWithAccount,
    signOutAccount,
    habits,
    completions,
    updateHabitReminder,
    triggerHabitNotification,
    resetDemoData,
  } = useHabits();

  const [nameInput, setNameInput] = useState(userName);
  const [emailInput, setEmailInput] = useState(userEmail || DEFAULT_AUTHORIZED_EMAIL);
  const [dailyQuotes, setDailyQuotes] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmail = emailInput.trim() || DEFAULT_AUTHORIZED_EMAIL;
    const validName = nameInput.trim() || 'Elena';
    signInWithAccount(validEmail, validName);
    showToast('Account & profile updated');
  };

  const handleQuickAuthorizedSignIn = () => {
    setEmailInput(DEFAULT_AUTHORIZED_EMAIL);
    signInWithAccount(DEFAULT_AUTHORIZED_EMAIL, nameInput.trim() || 'Elena');
    showToast(`Signed in as ${DEFAULT_AUTHORIZED_EMAIL}`);
  };

  const handleExportData = () => {
    const data = {
      user: userName,
      email: userEmail,
      habits,
      completions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pt-space-sm pb-28 space-y-space-md">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-primary-container text-on-primary px-4 py-2 rounded-xl shadow-lg font-label-md text-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
          Preferences &amp; Account
        </p>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-medium">
          Settings
        </h1>
      </div>

      {/* Account & Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs space-y-space-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {!avatarError ? (
              <img
                alt={`${userName} Profile`}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-container/20 shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpmip-hDi70t8xbhDJIT45taYRrNZzQ_JuGvQ9rT0oNeECLG6Ad9Z8C0p2thsHTkA6tGmVkJSJDqPZ-PlsqtIjwOkUdty73haetHYC3IzrnMlN-l9kVZI9wKffg_RSbGIDQERnLUnyDP6AgzJNp20jjfBu8SsqguwllhltY6K-k2GPZs_jLymw2SbTtCB7PuqKk6QxuSIFcdU7VES03baQ4YH4hA-S-vRCbWnYt8o6npj-mCF7YtmrCg"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-base shrink-0">
                {userName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-primary truncate">{userName}</h2>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-fixed text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Connected
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {userEmail}
              </p>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                signOutAccount();
                showToast('Signed out of session');
              }}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm cursor-pointer shrink-0"
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={handleQuickAuthorizedSignIn}
              className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm cursor-pointer shrink-0"
            >
              Sign In
            </button>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="pt-2 space-y-3 border-t border-surface-container-low">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label
                className="block font-label-sm text-label-sm text-on-surface-variant mb-1"
                htmlFor="nameInput"
              >
                Display Name
              </label>
              <input
                id="nameInput"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 font-body-md text-primary text-sm focus:outline-none focus:bg-surface-container"
              />
            </div>

            <div>
              <label
                className="block font-label-sm text-label-sm text-on-surface-variant mb-1"
                htmlFor="emailInput"
              >
                Authorized Google Account
              </label>
              <input
                id="emailInput"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={DEFAULT_AUTHORIZED_EMAIL}
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 font-body-md text-primary text-sm focus:outline-none focus:bg-surface-container"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickAuthorizedSignIn}
              className="text-xs text-secondary hover:underline font-medium cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">account_circle</span>
              Use authorized account ({DEFAULT_AUTHORIZED_EMAIL})
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 shrink-0"
            >
              Save Account
            </button>
          </div>
        </form>
      </div>

      {/* Daily Habit Notification Schedule */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs space-y-space-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Daily Notification Schedule
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Customize daily reminder times persisted per habit
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-fixed font-label-sm text-[11px] font-semibold">
            {habits.filter((h) => h.reminderEnabled).length} Active
          </span>
        </div>

        <div className="divide-y divide-surface-container-low pt-1">
          {habits.map((habit) => {
            const time24 = habit.reminderTime24 || to24HourTime(habit.reminderTime || '09:00 PM');
            const time12 = to12HourTime(time24);

            return (
              <div
                key={habit.id}
                className="py-2.5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[16px]">{habit.symbol}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="font-body-md text-sm font-medium text-primary truncate">
                      {habit.name}
                    </p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">
                      {habit.reminderEnabled ? `Scheduled for ${time12}` : 'Reminder muted'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="time"
                    aria-label={`Reminder time for ${habit.name}`}
                    value={time24}
                    disabled={!habit.reminderEnabled}
                    onChange={(e) => {
                      const next12 = to12HourTime(e.target.value);
                      updateHabitReminder(habit.id, true, next12);
                      showToast(`${habit.name} set to ${next12}`);
                    }}
                    className={`bg-surface-container-low text-primary font-label-md text-xs px-2 py-1 rounded-lg border border-outline-variant/40 focus:outline-none ${
                      !habit.reminderEnabled ? 'opacity-40' : ''
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => triggerHabitNotification(habit.id)}
                    title="Send test reminder"
                    aria-label={`Test reminder for ${habit.name}`}
                    className="w-7 h-7 rounded-full bg-surface-container hover:bg-secondary-container/50 text-secondary flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">notifications_active</span>
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={habit.reminderEnabled}
                    aria-label={`Enable reminder for ${habit.name}`}
                    onClick={() => {
                      const nextState = !habit.reminderEnabled;
                      updateHabitReminder(habit.id, nextState, time12);
                      showToast(
                        nextState
                          ? `Reminder enabled at ${time12}`
                          : `Reminder muted for ${habit.name}`
                      );
                    }}
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
            );
          })}
        </div>
      </div>

      {/* Notification and Ambient Preferences */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs space-y-space-md">
        <h3 className="font-headline-sm text-headline-sm text-primary">Mindful Experience</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-body-md text-body-md font-medium text-primary block">
              Daily Companion Quotes
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant block">
              Show meditative affirmations on habit completion
            </span>
          </div>
          <button
            onClick={() => setDailyQuotes(!dailyQuotes)}
            className={`w-12 h-7 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
              dailyQuotes ? 'bg-primary-container justify-end' : 'bg-surface-container-highest justify-start'
            }`}
            type="button"
          >
            <span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-sm"></span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
          <div className="space-y-0.5">
            <span className="font-body-md text-body-md font-medium text-primary block">
              Tactile Sound Feedback
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant block">
              Subtle audio chime on ritual achievement
            </span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-7 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
              soundEnabled ? 'bg-primary-container justify-end' : 'bg-surface-container-highest justify-start'
            }`}
            type="button"
          >
            <span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-sm"></span>
          </button>
        </div>
      </div>

      {/* Data & Backup */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs space-y-space-sm">
        <h3 className="font-headline-sm text-headline-sm text-primary">Data &amp; Persistence</h3>
        <p className="font-body-sm text-xs text-on-surface-variant">
          Your rituals, progress streaks, and reflections are securely saved locally on your device.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleExportData}
            className="py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export JSON
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="py-2.5 px-3 rounded-xl border border-outline-variant text-on-surface-variant hover:text-error hover:border-error/40 font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Reset Demo
            </button>
          ) : (
            <button
              onClick={() => {
                resetDemoData();
                setShowResetConfirm(false);
                showToast('Demo data restored');
              }}
              className="py-2.5 px-3 rounded-xl bg-error text-on-error font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              type="button"
            >
              Confirm Reset
            </button>
          )}
        </div>
      </div>

      {/* Philosophy note */}
      <div className="bg-surface-container-low rounded-2xl p-space-md text-center space-y-1">
        <span className="font-headline-sm text-headline-sm text-primary font-serif italic block">
          HabitFlow
        </span>
        <p className="font-body-sm text-xs text-on-surface-variant">
          Designed for quiet clarity, calm intention, and natural momentum.
        </p>
      </div>
    </div>
  );
};
