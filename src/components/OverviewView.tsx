import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import {
  formatHeaderDate,
  parseDateKey,
  formatDateKey,
  to12HourTime,
  to24HourTime,
} from '../utils/habitUtils';
import { ReminderTimePicker } from './ReminderTimePicker';

export const OverviewView: React.FC = () => {
  const {
    habits,
    selectedDate,
    setSelectedDate,
    setCurrentView,
    setEditingHabit,
    toggleHabitCompletion,
    isHabitCompleted,
    updateHabitReminder,
    triggerHabitNotification,
    userName,
    completions,
    overallStreaks,
  } = useHabits();

  const [activeReminderHabitId, setActiveReminderHabitId] = useState<string | null>(null);

  const selectedDateObj = parseDateKey(selectedDate);

  // Habits for this day
  const dayOfWeek = (selectedDateObj.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const todaysHabits = habits.filter((h) => {
    if (h.cadence === 'Daily') return true;
    return h.repeatDays.includes(dayOfWeek);
  });

  const completedCount = todaysHabits.filter((h) => isHabitCompleted(h.id, selectedDate)).length;
  const scheduledCount = Math.max(todaysHabits.length, 1);
  const percentage = Math.round((completedCount / scheduledCount) * 100);
  const remainingCount = Math.max(scheduledCount - completedCount, 0);

  // SVG Gauge calculations
  const radius = 30;
  const circumference = 2 * Math.PI * radius; // ~188.5
  const strokeOffset = circumference - (percentage / 100) * circumference;

  // Weekly consistency data for week containing Oct 24, 2024 (Mon Oct 21 to Sun Oct 27)
  const weekDays = [
    { label: 'M', dateStr: '2024-10-21' },
    { label: 'T', dateStr: '2024-10-22' },
    { label: 'W', dateStr: '2024-10-23' },
    { label: 'T', dateStr: '2024-10-24' },
    { label: 'F', dateStr: '2024-10-25' },
    { label: 'S', dateStr: '2024-10-26' },
    { label: 'S', dateStr: '2024-10-27' },
  ];

  // Calculate stats for weekly bar chart
  let weeklyTotalScheduled = 0;
  let weeklyTotalDone = 0;

  const weekBars = weekDays.map((wd) => {
    const isToday = wd.dateStr === '2024-10-24';
    const isSelected = wd.dateStr === selectedDate;
    const isPastOrToday = wd.dateStr <= '2024-10-24';

    const wdObj = parseDateKey(wd.dateStr);
    const wdIndex = (wdObj.getDay() + 6) % 7;
    const dayHabits = habits.filter((h) => h.cadence === 'Daily' || h.repeatDays.includes(wdIndex));
    const dayScheduled = Math.max(dayHabits.length, 1);
    const dayCompleted = dayHabits.filter((h) => completions[h.id]?.[wd.dateStr]).length;

    if (isPastOrToday) {
      weeklyTotalScheduled += dayScheduled;
      weeklyTotalDone += dayCompleted;
    }

    const dayPct = isPastOrToday ? Math.round((dayCompleted / dayScheduled) * 100) : 0;

    return {
      ...wd,
      isToday,
      isSelected,
      isPastOrToday,
      completed: dayCompleted,
      scheduled: dayScheduled,
      percent: dayPct,
    };
  });

  const weeklyAverage =
    weeklyTotalScheduled > 0 ? Math.round((weeklyTotalDone / weeklyTotalScheduled) * 100) : 91;

  // 30-Day Activity Heatmap: 28 days preview (4 weeks from Oct 1 to Oct 28)
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2024-10-${String(dayNum).padStart(2, '0')}`;
    const dayObj = parseDateKey(dateStr);
    const dayIdx = (dayObj.getDay() + 6) % 7;

    const dayHabits = habits.filter((h) => h.cadence === 'Daily' || h.repeatDays.includes(dayIdx));
    const doneCount = dayHabits.filter((h) => completions[h.id]?.[dateStr]).length;
    const isToday = dateStr === '2024-10-24';
    const isSelected = dateStr === selectedDate;
    const isUpcoming = dateStr > '2024-10-24';

    let bgClass = 'bg-surface-container-high text-outline';
    if (!isUpcoming) {
      if (doneCount >= 8) {
        bgClass = 'bg-primary-container text-on-primary';
      } else if (doneCount >= 6) {
        bgClass = 'bg-secondary text-on-secondary';
      } else if (doneCount >= 4) {
        bgClass = 'bg-secondary-fixed-dim text-on-secondary-fixed-variant';
      } else if (doneCount > 0) {
        bgClass = 'bg-surface-container-highest text-on-surface-variant';
      } else {
        bgClass = 'bg-surface-container-highest text-on-surface-variant';
      }
    }

    return {
      dayNum,
      dateStr,
      doneCount,
      isToday,
      isSelected,
      isUpcoming,
      bgClass,
    };
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Body':
      case 'Fitness':
        return 'bg-secondary-container text-on-secondary-container';
      case 'Work':
      case 'Focus':
        return 'bg-primary-fixed text-on-primary-fixed-variant';
      case 'Mind':
      case 'Mindfulness':
        return 'bg-surface-container-high text-on-surface-variant';
      case 'Reflect':
        return 'bg-surface-container-high text-on-surface-variant';
      default:
        return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const navigateDay = (offset: number) => {
    const cur = parseDateKey(selectedDate);
    cur.setDate(cur.getDate() + offset);
    setSelectedDate(formatDateKey(cur));
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pb-24 space-y-space-lg">
      {/* Editorial Date & Greeting Header */}
      <section className="flex flex-col pt-space-sm space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateDay(-1)}
              aria-label="Previous Day"
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-secondary cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              {formatHeaderDate(selectedDateObj)}
            </span>
            <button
              onClick={() => navigateDay(1)}
              aria-label="Next Day"
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-secondary cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
            {selectedDate !== '2024-10-24' && (
              <button
                onClick={() => setSelectedDate('2024-10-24')}
                className="text-[11px] text-secondary underline hover:opacity-80 ml-1 font-semibold cursor-pointer"
                type="button"
              >
                Today
              </button>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Active Flow
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-medium">
          Good morning, {userName}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Calm intention builds lasting momentum. Here is your daily rhythm.
        </p>
      </section>

      {/* Prominent Daily Progress Card */}
      <section className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-[0px_1px_2px_rgba(31,36,33,0.03),0px_4px_12px_rgba(31,36,33,0.02)] relative overflow-hidden">
        <div className="flex items-center justify-between gap-space-md">
          <div className="flex flex-col space-y-1">
            <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold tracking-wider">
              Today's Discipline
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-semibold tracking-tight"
                id="completed-count-text"
              >
                {completedCount}
              </span>
              <span className="font-headline-md text-headline-md text-outline font-normal">
                / {scheduledCount}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant ml-1">
                rituals completed
              </span>
            </div>
            <p
              className="font-body-sm text-body-sm text-on-surface-variant pt-1"
              id="routine-helper-text"
            >
              {remainingCount === 0
                ? 'Splendid work! All rituals completed for today.'
                : remainingCount === 1
                ? 'Almost there! Just 1 habit left to complete your daily routine.'
                : `${remainingCount} habits left to complete your daily routine.`}
            </p>
          </div>

          {/* SVG Circular Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
              <circle
                className="text-surface-container-high fill-none"
                cx="36"
                cy="36"
                r={radius}
                stroke="currentColor"
                strokeWidth="5.5"
              />
              <circle
                className="text-primary-container fill-none transition-all duration-700 ease-out"
                cx="36"
                cy="36"
                id="progress-circle-bar"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="5.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="font-label-lg text-label-lg font-bold text-primary tracking-tight"
                id="progress-percentage-label"
              >
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats Micro-Grid */}
        <div className="grid grid-cols-2 gap-space-sm mt-space-md pt-space-md border-t-0 bg-surface-container-low rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-[19px]">local_fire_department</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Current Streak
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {overallStreaks.current} {overallStreaks.current === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[19px]">bolt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Best Streak
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {overallStreaks.best} {overallStreaks.best === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action & Section Header */}
      <section className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary font-semibold">
            Today's Habits
          </h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Prioritized by cadence and focus
          </p>
        </div>
        <button
          onClick={() => {
            setEditingHabit(null);
            setCurrentView('new-habit');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-all shadow-[0_2px_8px_rgba(30,58,47,0.18)] cursor-pointer hover:opacity-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Habit</span>
        </button>
      </section>

      {/* Interactive Habit Cards List */}
      <section className="space-y-space-sm" id="habit-items-container">
        {todaysHabits.map((habit) => {
          const completed = isHabitCompleted(habit.id, selectedDate);
          const isEditingReminder = activeReminderHabitId === habit.id;
          const displayTime = habit.reminderTime || habit.scheduledTime || '09:00 PM';

          return (
            <div
              key={habit.id}
              className="habit-card group w-full bg-surface-container-lowest rounded-2xl p-space-md flex flex-col gap-space-sm shadow-[0px_1px_2px_rgba(31,36,33,0.02)] transition-all hover:shadow-sm"
              data-completed={completed ? 'true' : 'false'}
            >
              <div className="flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Checkbox Toggle Button */}
                  <button
                    aria-label={`Toggle ${habit.name}`}
                    onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                    className={`habit-toggle-btn w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      completed
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-high text-transparent hover:bg-surface-container-highest'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </button>

                  {/* Habit Text Info */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setEditingHabit(habit);
                        setCurrentView('new-habit');
                      }}
                    >
                      <span
                        className={`habit-title font-body-md text-body-md font-semibold truncate transition-colors ${
                          completed ? 'line-through text-outline' : 'text-on-surface'
                        }`}
                      >
                        {habit.name}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm shrink-0 ${getCategoryBadgeClass(
                          habit.category
                        )}`}
                      >
                        {habit.category}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReminderHabitId(isEditingReminder ? null : habit.id)
                        }
                        aria-label={`Schedule reminder time for ${habit.name}`}
                        title="Click to adjust daily reminder time"
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 -ml-1.5 transition-colors cursor-pointer ${
                          habit.reminderEnabled
                            ? 'text-secondary hover:bg-secondary-container/30 font-medium'
                            : 'text-outline hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {habit.reminderEnabled ? 'notifications_active' : 'schedule'}
                        </span>
                        <span>{displayTime}</span>
                      </button>

                      {habit.target && (
                        <>
                          <span>•</span>
                          <span>{habit.target}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Habit Icon */}
                <button
                  onClick={() => {
                    setEditingHabit(habit);
                    setCurrentView('new-habit');
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                    completed
                      ? 'bg-secondary-container/40 text-secondary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  title="Edit habit"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px]">{habit.symbol}</span>
                </button>
              </div>

              {/* Expandable Inline Reminder Time Scheduler */}
              {isEditingReminder && (
                <div className="pt-2 border-t border-surface-container-low space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        notifications_active
                      </span>
                      Daily Reminder Schedule
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
                        aria-label={`Enable reminder for ${habit.name}`}
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
                    inputId={`reminder-time-${habit.id}`}
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
      </section>

      {/* Weekly Consistency Mini-Chart */}
      <section className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-[0px_1px_2px_rgba(31,36,33,0.03),0px_4px_12px_rgba(31,36,33,0.02)] space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              calendar_view_week
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">
              Weekly Consistency
            </h3>
          </div>
          <span className="font-label-md text-label-md text-secondary font-semibold">
            {weeklyAverage}% Average
          </span>
        </div>

        {/* 7-Day Matrix Row */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {weekBars.map((bar, i) => (
            <div
              key={i}
              onClick={() => setSelectedDate(bar.dateStr)}
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-opacity ${
                !bar.isPastOrToday ? 'opacity-60' : 'hover:opacity-90'
              }`}
            >
              <div className="relative flex flex-col items-center">
                {bar.isToday && (
                  <div className="absolute -top-2 w-1.5 h-1.5 rounded-full bg-secondary"></div>
                )}
                <span
                  className={`font-label-sm text-label-sm ${
                    bar.isToday
                      ? 'text-primary font-bold'
                      : bar.isSelected
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant font-medium'
                  }`}
                >
                  {bar.label}
                </span>
              </div>

              {/* Bar Fill */}
              <div
                className={`w-full h-16 rounded-xl p-1 flex flex-col justify-end ${
                  bar.isToday ? 'bg-secondary-container/40' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    bar.percent >= 90
                      ? 'bg-primary-container'
                      : bar.percent > 0
                      ? 'bg-secondary'
                      : 'bg-surface-container-highest'
                  }`}
                  style={{ height: `${bar.percent}%` }}
                ></div>
              </div>

              {/* Fraction */}
              <span
                className={`font-label-sm text-label-sm ${
                  bar.isToday || bar.isSelected
                    ? 'text-primary font-bold'
                    : bar.isPastOrToday
                    ? 'text-primary font-bold'
                    : 'text-outline'
                }`}
              >
                {bar.isPastOrToday ? `${bar.completed}/${bar.scheduled}` : '-'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Activity Heatmap (4-Week Grid Preview) */}
      <section className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-[0px_1px_2px_rgba(31,36,33,0.03),0px_4px_12px_rgba(31,36,33,0.02)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">
              30-Day Activity Heatmap
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Consistent habit density over the past 4 weeks
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-label-sm text-label-sm text-outline mr-1">Less</span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-surface-container-highest"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-secondary-fixed-dim"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-secondary"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-primary-container"></span>
            <span className="font-label-sm text-label-sm text-outline ml-1">More</span>
          </div>
        </div>

        {/* Calendar Grid Rows */}
        <div className="pt-2">
          <div className="grid grid-cols-7 gap-2">
            {heatmapDays.map((hd) => (
              <button
                key={hd.dayNum}
                onClick={() => setSelectedDate(hd.dateStr)}
                title={`Day ${hd.dayNum}: ${hd.doneCount} rituals`}
                className={`aspect-square rounded-md flex items-center justify-center font-label-sm text-label-sm transition-all cursor-pointer ${
                  hd.bgClass
                } ${
                  hd.isToday
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest font-bold'
                    : hd.isSelected
                    ? 'ring-2 ring-secondary ring-offset-1'
                    : ''
                }`}
                type="button"
              >
                {hd.dayNum}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Companion Reflection Note */}
      <section className="w-full bg-surface-container-low rounded-2xl p-space-md flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">spa</span>
        <div className="flex flex-col space-y-0.5">
          <span className="font-headline-sm text-headline-sm text-primary font-semibold">
            Mindful Habit Tip
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Evening routines prepare your cognitive workspace for tomorrow. Completing your non-fiction reading and reflection within an hour before bed signals restorative wind-down.
          </p>
        </div>
      </section>
    </div>
  );
};
