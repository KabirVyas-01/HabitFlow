import React, { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { HabitCategory, TimeOfDay, CadenceType, TintColor } from '../types/habit';
import { ReminderTimePicker } from './ReminderTimePicker';
import { to12HourTime, to24HourTime } from '../utils/habitUtils';

export const NewHabitView: React.FC = () => {
  const {
    addHabit,
    updateHabit,
    updateHabitReminder,
    deleteHabit,
    editingHabit,
    setCurrentView,
    setEditingHabit,
  } = useHabits();

  const isEditing = Boolean(editingHabit);

  // Form states
  const [name, setName] = useState(editingHabit?.name || 'Evening Screen Detox');
  const [category, setCategory] = useState<HabitCategory>(editingHabit?.category || 'Health');
  const [symbol, setSymbol] = useState(editingHabit?.symbol || 'bedtime');
  const [tintColor, setTintColor] = useState<TintColor>(editingHabit?.tintColor || 'primary-container');
  const [cadence, setCadence] = useState<CadenceType>(editingHabit?.cadence || 'Daily');
  const [repeatDays, setRepeatDays] = useState<number[]>(
    editingHabit?.repeatDays || [0, 1, 2, 3, 4, 5, 6]
  );
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(editingHabit?.timeOfDay || 'Evening');
  const [target, setTarget] = useState(editingHabit?.target || '30 mins before sleep');
  const [reminderEnabled, setReminderEnabled] = useState(editingHabit?.reminderEnabled ?? true);
  const [reminderTime, setReminderTime] = useState(
    to12HourTime(editingHabit?.reminderTime || editingHabit?.scheduledTime || '09:00 PM')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setCategory(editingHabit.category);
      setSymbol(editingHabit.symbol);
      setTintColor(editingHabit.tintColor);
      setCadence(editingHabit.cadence);
      setRepeatDays(editingHabit.repeatDays);
      setTimeOfDay(editingHabit.timeOfDay);
      setTarget(editingHabit.target || '');
      setReminderEnabled(editingHabit.reminderEnabled);
      setReminderTime(
        to12HourTime(editingHabit.reminderTime || editingHabit.scheduledTime || '09:00 PM')
      );
    }
  }, [editingHabit]);

  const categoryOptions: { name: HabitCategory; icon?: string }[] = [
    { name: 'Health', icon: 'spa' },
    { name: 'Focus' },
    { name: 'Mindfulness' },
    { name: 'Fitness' },
    { name: 'Learning' },
    { name: 'Work' },
    { name: 'Personal' },
  ];

  const iconOptions = [
    'menu_book',
    'water_drop',
    'fitness_center',
    'wb_sunny',
    'bedtime',
    'psychology',
    'local_fire_department',
    'favorite',
    'self_improvement',
    'laptop_mac',
    'spa',
    'directions_walk',
  ];

  const colorOptions: { id: TintColor; bgClass: string; hex: string }[] = [
    { id: 'primary-container', bgClass: 'bg-primary-container', hex: '#1e3a2f' },
    { id: 'secondary', bgClass: 'bg-secondary', hex: '#3a6752' },
    { id: 'on-primary-fixed-variant', bgClass: 'bg-on-primary-fixed-variant', hex: '#304c41' },
    { id: 'tertiary-container', bgClass: 'bg-tertiary-container', hex: '#2a3829' },
    { id: 'on-secondary-fixed-variant', bgClass: 'bg-on-secondary-fixed-variant', hex: '#224f3c' },
    { id: 'surface-tint', bgClass: 'bg-surface-tint', hex: '#486458' },
  ];

  const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleDay = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      if (repeatDays.length === 1) return; // Keep at least one day
      setRepeatDays(repeatDays.filter((d) => d !== dayIndex));
    } else {
      setRepeatDays([...repeatDays, dayIndex].sort());
    }
  };

  const selectAllDays = () => {
    setRepeatDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleReminderToggle = () => {
    const nextEnabled = !reminderEnabled;
    setReminderEnabled(nextEnabled);
    if (isEditing && editingHabit) {
      updateHabitReminder(editingHabit.id, nextEnabled, reminderTime);
    }
  };

  const handleReminderTimeChange = (formatted12: string) => {
    setReminderTime(formatted12);
    if (isEditing && editingHabit) {
      updateHabitReminder(editingHabit.id, reminderEnabled, formatted12);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    setIsSaving(true);
    const normalized12 = to12HourTime(reminderTime);
    const normalized24 = to24HourTime(normalized12);

    setTimeout(() => {
      if (isEditing && editingHabit) {
        updateHabit(editingHabit.id, {
          name: name.trim(),
          category,
          symbol,
          tintColor,
          cadence,
          repeatDays,
          timeOfDay,
          target: target.trim(),
          reminderEnabled,
          reminderTime: normalized12,
          reminderTime24: normalized24,
          scheduledTime: normalized12,
        });
      } else {
        addHabit({
          name: name.trim(),
          category,
          symbol,
          tintColor,
          cadence,
          repeatDays,
          timeOfDay,
          target: target.trim(),
          reminderEnabled,
          reminderTime: normalized12,
          reminderTime24: normalized24,
          scheduledTime: normalized12,
        });
      }

      setEditingHabit(null);
      setCurrentView('overview');
    }, 300);
  };

  const handleDelete = () => {
    if (editingHabit) {
      deleteHabit(editingHabit.id);
      setEditingHabit(null);
      setCurrentView('overview');
    }
  };

  const handleCancel = () => {
    setEditingHabit(null);
    setCurrentView('overview');
  };

  // Preview tint class
  const activeColorObj = colorOptions.find((c) => c.id === tintColor) || colorOptions[0];

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pt-space-sm pb-28 space-y-space-md">
      {/* Top Action Bar inside content */}
      <div className="flex items-center justify-between pb-space-xs">
        <button
          className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-headline-sm text-headline-sm text-primary">
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </span>
        </div>

        <button
          id="saveHabitBtn"
          className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          onClick={handleSave}
          disabled={!name.trim() || isSaving}
          type="button"
        >
          {isSaving ? (
            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          ) : (
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check
            </span>
          )}
          {isSaving ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
            Live Card Preview
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            {cadence} • {timeOfDay}
          </span>
        </div>

        <div className="flex items-center gap-3.5 pt-1">
          <div
            className={`w-12 h-12 rounded-xl text-on-primary flex items-center justify-center transition-colors shadow-sm ${activeColorObj.bgClass}`}
          >
            <span className="material-symbols-outlined text-[24px]">{symbol}</span>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h2 className="font-headline-sm text-headline-sm text-primary truncate">
              {name.trim() || 'Untitled Habit'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {target.trim() ? `${category} • ${target.trim()}` : category}
              {reminderEnabled ? ` • ${reminderTime}` : ''}
            </p>
          </div>

          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[18px]">done</span>
          </div>
        </div>
      </div>

      {/* Input: Habit Title & Intention */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-xs">
        <label
          className="block font-label-md text-label-md text-on-surface-variant"
          htmlFor="habitNameInput"
        >
          Habit Name
        </label>
        <div className="relative">
          <input
            id="habitNameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container-low rounded-lg px-3.5 py-2.5 font-body-lg text-body-lg text-primary placeholder:text-outline focus:outline-none focus:bg-surface-container transition-all"
            placeholder="e.g. Morning Cold Plunge, Read 20 Pages"
            type="text"
          />
        </div>
        <p className="font-body-sm text-body-sm text-outline pt-0.5">
          Define a distinct, repeatable action for calm consistency.
        </p>
      </div>

      {/* Visual Identity: Icon & Palette Picker */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md">
        {/* Category Tag Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-md text-label-md text-on-surface-variant">Focus Area</span>
            <span className="font-label-sm text-label-sm text-outline">Categorization</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  {cat.icon && (
                    <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                  )}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated Icon Grid */}
        <div>
          <span className="block font-label-md text-label-md text-on-surface-variant mb-2">
            Symbol
          </span>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {iconOptions.map((ic) => {
              const isSelected = symbol === ic;
              return (
                <button
                  key={ic}
                  onClick={() => setSymbol(ic)}
                  className={`h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                  type="button"
                  title={ic}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Harmonious Color Swatches */}
        <div>
          <span className="block font-label-md text-label-md text-on-surface-variant mb-2">
            Tint Palette
          </span>
          <div className="flex items-center justify-between gap-2">
            {colorOptions.map((col) => {
              const isSelected = tintColor === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setTintColor(col.id)}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center text-on-primary transition-transform cursor-pointer ${
                    col.bgClass
                  } ${isSelected ? 'scale-110 shadow-sm ring-2 ring-primary ring-offset-2' : 'hover:scale-105'}`}
                  type="button"
                  title={col.id}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rhythm & Cadence */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md">
        {/* Frequency Segmented Pill Control */}
        <div>
          <span className="block font-label-md text-label-md text-on-surface-variant mb-2">
            Cadence
          </span>
          <div className="p-1 bg-surface-container-low rounded-xl flex items-center">
            {(['Daily', 'Weekly', 'Custom'] as const).map((cad) => {
              const isSelected = cadence === cad;
              return (
                <button
                  key={cad}
                  onClick={() => setCadence(cad)}
                  className={`flex-1 py-1.5 rounded-lg font-label-md text-label-md transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  type="button"
                >
                  {cad}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Schedule Days */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-md text-label-md text-on-surface-variant">Repeat On</span>
            <button
              onClick={selectAllDays}
              className="font-label-sm text-label-sm text-secondary hover:underline cursor-pointer"
              type="button"
            >
              All Days
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {daysLabels.map((lbl, idx) => {
              const isActive = repeatDays.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`h-10 rounded-full font-label-md text-label-md flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time of Day & Metric Target */}
        <div className="space-y-space-sm pt-1">
          <span className="block font-label-md text-label-md text-on-surface-variant">
            Time of Day
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Morning', icon: 'wb_twilight' },
              { label: 'Afternoon', icon: 'wb_sunny' },
              { label: 'Evening', icon: 'nights_stay' },
            ].map((tod) => {
              const isSelected = timeOfDay === tod.label;
              return (
                <button
                  key={tod.label}
                  onClick={() => setTimeOfDay(tod.label as TimeOfDay)}
                  className={`py-2 px-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">{tod.icon}</span>
                  {tod.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <label
              className="block font-label-md text-label-md text-on-surface-variant mb-1"
              htmlFor="targetInput"
            >
              Target / Intention (Optional)
            </label>
            <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3.5 py-2.5">
              <span className="material-symbols-outlined text-outline text-[18px]">timer</span>
              <input
                id="targetInput"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-transparent font-body-md text-body-md text-primary placeholder:text-outline focus:outline-none"
                placeholder="e.g. 20 mins, 2 liters, 50 pages"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Reminder Setting */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div>
              <span className="block font-headline-sm text-headline-sm text-primary">
                Daily Reminder
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {reminderEnabled
                  ? `Send quiet prompt at ${reminderTime}`
                  : 'Gentle prompts currently muted'}
              </span>
            </div>
          </div>

          {/* Accessible Native-feel Toggle Switch */}
          <button
            id="reminderToggle"
            aria-label="Toggle Daily Reminder"
            aria-checked={reminderEnabled}
            role="switch"
            onClick={handleReminderToggle}
            className={`w-12 h-7 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
              reminderEnabled
                ? 'bg-primary-container justify-end'
                : 'bg-surface-container-highest justify-start'
            }`}
            type="button"
          >
            <span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform"></span>
          </button>
        </div>

        {/* Interactive Time Picker & Rhythm Presets */}
        <ReminderTimePicker
          value={reminderTime}
          disabled={!reminderEnabled}
          onChange={(formatted12) => handleReminderTimeChange(formatted12)}
        />

        {/* Quick Ambient Quote (Micro-delight) */}
        <div className="mt-space-sm bg-surface-container-low rounded-lg p-3 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            auto_awesome
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant italic">
            "Small disciplines repeated with quiet intention make monumental progress feel natural."
          </p>
        </div>
      </div>

      {/* Visual Inspiration Thumbnail Grid */}
      <div className="space-y-space-xs pt-1">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-1 font-semibold">
          Atmosphere &amp; Mood
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative h-24 rounded-xl overflow-hidden shadow-sm bg-primary-container">
            <img
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              alt="Minimalist calm bedroom in evening twilight, warm bedside lamp glowing gently beside an open linen journal and cedarwood cup, soft shadow play in soothing muted sage and earth tones, film grain aesthetic."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4n_ZwZd1ONnZEIJWCxlsEDF_NEQ2kgxMxtGjPTU0w0ml5QWpYLEgIddkXZAW2_MOeQyZsDZqWiOu18NDWC-1iHuKt1RtPidgvB0BYWB3GfBjOw1_w-KFWbdtw7oMz9z-YA6Fud3x3nTzjZGepCTKze9nJnA5gpZ0KhSiYVhrErrCmRNx1XOoA6G1rew-ScRGxLOHjw92SOO32QXyKr-I_4rcjoRY-fa6vRseXO_5CNr4QNptgNx-cDA"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
            <span className="absolute bottom-2 left-2 font-label-sm text-label-sm text-on-primary bg-primary/60 px-2 py-0.5 rounded">
              Evening Stillness
            </span>
          </div>

          <div className="relative h-24 rounded-xl overflow-hidden shadow-sm bg-primary-container">
            <img
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              alt="Close-up of smooth natural river stones and dried herbal tea on a handcrafted raw ceramic plate, soft diffused morning sunlight, peaceful Japanese wabi-sabi aesthetic with deep forest green background."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgVHqCCjqEnqUp1t5X7u9Ss6ME_fwvn2WIjyyCOssN3dY5Qj5FllYQ_oQfaBOpiWCeJw2c-2MTw3J0mj6Uch7LMMj6ofTqzEhYwYZcvD5DqTNXxwxFY164NPAnEdWOTWSuaB25L3FGdMaPCduEAG4IUAfCYYGB9p8lGRiz2mY_5bde6FtAufnRl3vYII2m79b2_biywp07eifKQX9Qx62mtFXTIBHzJfdflcu_W_jKETyRcJx06DXGA"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
            <span className="absolute bottom-2 left-2 font-label-sm text-label-sm text-on-primary bg-primary/60 px-2 py-0.5 rounded">
              Restful Reset
            </span>
          </div>
        </div>
      </div>

      {/* Delete Habit Button (for edit mode) */}
      {isEditing && (
        <div className="pt-2">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 rounded-xl border border-error/30 text-error font-label-md text-label-md hover:bg-error-container/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Delete This Habit
            </button>
          ) : (
            <div className="bg-error-container/20 border border-error/40 rounded-xl p-3 flex flex-col gap-2">
              <p className="font-body-sm text-body-sm text-on-surface">
                Are you sure you want to delete <strong>{name}</strong>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-1.5 rounded-lg bg-error text-on-error font-label-md text-label-md cursor-pointer"
                  type="button"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md cursor-pointer"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
