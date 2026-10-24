import React, { useState, useRef } from 'react';
import { useHabits, DEFAULT_USER_EMAIL } from '../context/HabitContext';
import { to12HourTime, to24HourTime } from '../utils/habitUtils';

const CURATED_AVATARS = [
  {
    id: 'zen-stone',
    label: 'River Stones',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'forest-pine',
    label: 'Forest Mist',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'bamboo-green',
    label: 'Calm Bamboo',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'sunrise-warmth',
    label: 'Dawn Horizon',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&h=120&q=80',
  },
];

export const SettingsView: React.FC = () => {
  const {
    userName,
    userEmail,
    userAvatar,
    setUserName,
    setUserEmail,
    setUserAvatar,
    isAuthenticated,
    signInWithAccount,
    signOutAccount,
    habits,
    completions,
    updateHabitReminder,
    triggerHabitNotification,
    resetDemoData,
    overallStreaks,
  } = useHabits();

  const [nameInput, setNameInput] = useState(userName);
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [dailyQuotes, setDailyQuotes] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const validName = nameInput.trim() || 'Elena';
    const validEmail = emailInput.trim();
    setUserName(validName);
    setUserEmail(validEmail);
    showToast('Profile updated');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUserAvatar(reader.result);
        showToast('Profile picture updated');
        setShowAvatarPicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectCuratedAvatar = (url: string) => {
    setUserAvatar(url);
    showToast('Profile avatar chosen');
    setShowAvatarPicker(false);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setUserAvatar(customUrlInput.trim());
    setCustomUrlInput('');
    showToast('Custom avatar URL applied');
    setShowAvatarPicker(false);
  };

  const handleRemoveAvatar = () => {
    setUserAvatar(null);
    showToast('Profile picture reset to initial monogram');
    setShowAvatarPicker(false);
  };

  const handleExportData = () => {
    const data = {
      user: userName,
      email: userEmail,
      avatar: userAvatar ? 'custom' : 'monogram',
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

  const initialLetter = userName.trim() ? userName.trim().charAt(0).toUpperCase() : 'U';

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
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs space-y-space-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Clickable Profile Avatar */}
            <div className="relative group shrink-0">
              {userAvatar ? (
                <img
                  alt={`${userName} Profile`}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-container/20 shadow-xs"
                  src={userAvatar}
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-xl ring-2 ring-primary-container/20 shadow-xs">
                  {initialLetter}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
                title="Change profile picture"
                aria-label="Change profile picture"
              >
                <span className="material-symbols-outlined text-[13px]">photo_camera</span>
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-primary truncate">{userName}</h2>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-fixed text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Active
                  </span>
                )}
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant truncate">
                {userEmail || 'No email specified'}
              </p>
              <p className="font-label-sm text-[11px] text-secondary font-medium mt-0.5">
                {overallStreaks.current} {overallStreaks.current === 1 ? 'day active streak' : 'days active streak'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container font-label-sm text-label-sm text-primary transition-colors cursor-pointer shrink-0"
          >
            {showAvatarPicker ? 'Close' : 'Change Photo'}
          </button>
        </div>

        {/* Profile Picture Picker Panel */}
        {showAvatarPicker && (
          <div className="p-3 bg-surface-container-low rounded-xl space-y-3 border border-outline-variant/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md font-semibold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">image</span>
                Choose Your Profile Picture
              </span>
              {userAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-[11px] text-error hover:underline font-semibold cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Option A: Upload File */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-xs font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                Upload From Device
              </button>
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="py-2 px-3 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-sm text-xs hover:bg-surface-container transition-colors border border-outline-variant/30 cursor-pointer shadow-2xs"
              >
                Use Initial ({initialLetter})
              </button>
            </div>

            {/* Option B: Curated Serene Themes */}
            <div>
              <span className="block text-[11px] text-on-surface-variant font-medium mb-1.5">
                Or pick a calm atmosphere:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {CURATED_AVATARS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCuratedAvatar(item.url)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-surface-container-high group-hover:ring-2 group-hover:ring-primary transition-all shadow-2xs"
                    />
                    <span className="text-[10px] text-on-surface-variant truncate max-w-full">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option C: Image URL */}
            <form onSubmit={handleApplyCustomUrl} className="flex gap-1.5 pt-1">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 bg-surface-container-lowest rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none border border-outline-variant/30"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Apply
              </button>
            </form>
          </div>
        )}

        {/* Profile Edit Form */}
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
                placeholder="Your Name"
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 font-body-md text-primary text-sm focus:outline-none focus:bg-surface-container"
              />
            </div>

            <div>
              <label
                className="block font-label-sm text-label-sm text-on-surface-variant mb-1"
                htmlFor="emailInput"
              >
                Email Address
              </label>
              <input
                id="emailInput"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 font-body-md text-primary text-sm focus:outline-none focus:bg-surface-container"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90"
            >
              Save Profile
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
