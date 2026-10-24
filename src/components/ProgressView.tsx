import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { calculateHabitStats, calculateTimeframeData, parseDateKey, formatDateKey } from '../utils/habitUtils';

interface ProgressViewProps {
  onOpenReflection: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onOpenReflection }) => {
  const { habits, completions, selectedDate, setSelectedDate } = useHabits();
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '90D' | 'Year'>('30D');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Dynamically compute stats for the selected timeframe
  const timeframeStats = useMemo(() => {
    return calculateTimeframeData(habits, completions, timeFilter, selectedDate);
  }, [habits, completions, timeFilter, selectedDate]);

  // Calculate consistency breakdown from actual habits for the chosen timeframe
  const habitBreakdowns = useMemo(() => {
    const days = timeFilter === '7D' ? 7 : timeFilter === '30D' ? 30 : timeFilter === '90D' ? 90 : 365;
    return habits
      .map((h) => {
        const stats = calculateHabitStats(h, completions, selectedDate, days);
        return {
          habit: h,
          ...stats,
        };
      })
      .sort((a, b) => b.consistencyRate - a.consistencyRate);
  }, [habits, completions, selectedDate, timeFilter]);

  // 30D: October 31-day heatmap matrix
  const octoberMatrix = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const dateStr = `2024-10-${String(day).padStart(2, '0')}`;
      const dayObj = parseDateKey(dateStr);
      const dayIdx = (dayObj.getDay() + 6) % 7;

      const scheduledHabits = habits.filter(
        (h) => h.cadence === 'Daily' || h.repeatDays.includes(dayIdx)
      );
      const doneCount = scheduledHabits.filter((h) => completions[h.id]?.[dateStr]).length;
      const totalScheduled = Math.max(scheduledHabits.length, 1);
      const pct = Math.round((doneCount / totalScheduled) * 100);

      let bg = 'bg-surface-container text-outline';
      if (pct >= 90) {
        bg = 'bg-primary text-on-primary font-bold';
      } else if (pct >= 75) {
        bg = 'bg-primary-container text-on-primary font-medium';
      } else if (pct >= 50) {
        bg = 'bg-secondary text-on-secondary font-medium';
      } else if (pct > 0) {
        bg = 'bg-secondary-fixed/70 text-on-secondary-fixed';
      }

      if (day === 31) {
        bg += ' ring-2 ring-primary ring-offset-1';
      }

      return {
        day,
        dateStr,
        count: doneCount,
        totalScheduled,
        pct,
        bg,
      };
    });
  }, [habits, completions]);

  // 7D: Last 7 days points
  const last7Days = useMemo(() => {
    const points: {
      dateStr: string;
      dayOfWeek: string;
      dayNum: number;
      doneCount: number;
      totalCount: number;
      pct: number;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    const targetDate = parseDateKey(selectedDate);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(targetDate);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const dayIdx = (d.getDay() + 6) % 7;

      const scheduled = habits.filter(
        (h) => h.cadence === 'Daily' || h.repeatDays.includes(dayIdx)
      );
      const done = scheduled.filter((h) => completions[h.id]?.[key]).length;
      const total = Math.max(scheduled.length, 1);
      const pct = Math.round((done / total) * 100);

      points.push({
        dateStr: key,
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        dayNum: d.getDate(),
        doneCount: done,
        totalCount: total,
        pct,
        isToday: key === '2024-10-24',
        isSelected: key === selectedDate,
      });
    }
    return points;
  }, [habits, completions, selectedDate]);

  // 90D: 3-month aggregated comparison
  const quarterlyMonths = useMemo(() => {
    return [
      { name: 'August', activeDays: 28, totalDone: 146, totalPossible: 170, pct: 86 },
      { name: 'September', activeDays: 27, totalDone: 142, totalPossible: 162, pct: 88 },
      { name: 'October', activeDays: 27, totalDone: 142, totalPossible: 160, pct: 89 },
    ];
  }, []);

  // 90D: 12-week consistency momentum ribbon
  const twelveWeeks = useMemo(() => {
    return [
      { week: 'W1', pct: 75, bg: 'bg-secondary-fixed' },
      { week: 'W2', pct: 80, bg: 'bg-secondary' },
      { week: 'W3', pct: 85, bg: 'bg-primary-container' },
      { week: 'W4', pct: 82, bg: 'bg-secondary' },
      { week: 'W5', pct: 88, bg: 'bg-primary-container' },
      { week: 'W6', pct: 86, bg: 'bg-primary-container' },
      { week: 'W7', pct: 90, bg: 'bg-primary' },
      { week: 'W8', pct: 84, bg: 'bg-secondary' },
      { week: 'W9', pct: 89, bg: 'bg-primary-container' },
      { week: 'W10', pct: 92, bg: 'bg-primary' },
      { week: 'W11', pct: 94, bg: 'bg-primary' },
      { week: 'W12', pct: 96, bg: 'bg-primary' },
    ];
  }, []);

  // Year: 12-month overview
  const annualMonths = useMemo(() => {
    return [
      { label: 'Jan', rate: 76, active: true },
      { label: 'Feb', rate: 80, active: true },
      { label: 'Mar', rate: 78, active: true },
      { label: 'Apr', rate: 82, active: true },
      { label: 'May', rate: 85, active: true },
      { label: 'Jun', rate: 84, active: true },
      { label: 'Jul', rate: 86, active: true },
      { label: 'Aug', rate: 86, active: true },
      { label: 'Sep', rate: 88, active: true },
      { label: 'Oct', rate: 89, active: true, isCurrent: true },
      { label: 'Nov', rate: 0, active: false },
      { label: 'Dec', rate: 0, active: false },
    ];
  }, []);

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pb-28 space-y-space-lg">
      {/* Header & Time Filter Segmented Control */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
              Momentum &amp; Rhythm
            </p>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
              Progress &amp; Insights
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
          </div>
        </div>

        {/* Segmented Filter Pill: 7D / 30D / 90D / Year */}
        <div className="flex items-center p-1 bg-surface-container-high rounded-full w-full justify-between shadow-inner">
          {(['7D', '30D', '90D', 'Year'] as const).map((filter) => {
            const isActive = timeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`flex-1 py-1.5 px-3 rounded-full text-center font-label-md text-label-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Row / Overview Cards (Dynamically calculated for active filter) */}
      <div className="grid grid-cols-3 gap-space-xs">
        {/* Card 1: Completion Rate */}
        <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col justify-between shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-base">donut_large</span>
            <span className="inline-flex items-center text-[10px] font-semibold text-secondary px-1.5 py-0.5 rounded-full bg-secondary-container/40 leading-none">
              {timeFilter === '7D' ? '+6%' : timeFilter === '30D' ? '+4%' : '+8%'}
            </span>
          </div>
          <div className="mt-2">
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight block">
              {timeframeStats.rate}%
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant truncate block leading-tight">
              Rate ({timeFilter})
            </span>
          </div>
        </div>

        {/* Card 2: Total Completions */}
        <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col justify-between shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          </div>
          <div className="mt-2">
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight block">
              {timeframeStats.totalDone}
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant truncate block leading-tight">
              Total Done
            </span>
          </div>
        </div>

        {/* Card 3: Active Routines */}
        <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col justify-between shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-base">local_fire_department</span>
            <span className="font-label-sm text-[10px] font-medium text-on-surface-variant">Active</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight block">
              {habits.length}
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant truncate block leading-tight">
              Routines
            </span>
          </div>
        </div>
      </div>

      {/* TIMEFRAME-SPECIFIC CHARTS CONTAINER */}

      {/* 1. 7D VIEW: 7-Day Daily Momentum Bar Chart & Ritual Adherence */}
      {timeFilter === '7D' && (
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-primary">Daily Rhythm</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">· Last 7 Days</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Day-by-day ritual completion volume
              </p>
            </div>
            <span className="font-label-md text-label-md text-secondary font-semibold">
              {timeframeStats.activeDays} of 7 Active Days
            </span>
          </div>

          {/* 7-Day High-Fidelity Column Chart */}
          <div className="grid grid-cols-7 gap-2 pt-2 pb-1">
            {last7Days.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDate(item.dateStr)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="relative flex flex-col items-center">
                  {item.isToday && (
                    <div className="absolute -top-2 w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  )}
                  <span
                    className={`font-label-sm text-xs ${
                      item.isSelected ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    {item.dayOfWeek}
                  </span>
                  <span
                    className={`text-[10px] ${
                      item.isSelected ? 'text-secondary font-bold' : 'text-outline'
                    }`}
                  >
                    {item.dayNum}
                  </span>
                </div>

                {/* Vertical Bar */}
                <div
                  className={`w-full h-24 rounded-xl p-1 flex flex-col justify-end transition-all ${
                    item.isSelected ? 'bg-secondary-container/40 ring-1 ring-primary' : 'bg-surface-container-high'
                  }`}
                >
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      item.pct >= 90
                        ? 'bg-primary-container'
                        : item.pct >= 75
                        ? 'bg-secondary'
                        : item.pct > 0
                        ? 'bg-secondary-fixed-dim'
                        : 'bg-surface-container-highest'
                    }`}
                    style={{ height: `${item.pct}%` }}
                  ></div>
                </div>

                {/* Score */}
                <span className="font-label-sm text-[11px] font-semibold text-primary">
                  {item.doneCount}/{item.totalCount}
                </span>
              </div>
            ))}
          </div>

          {/* 7-Day Habit Adherence Breakdown Matrix */}
          <div className="pt-2 border-t border-surface-container-low space-y-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Habit Breakdown Across 7 Days
            </span>
            <div className="space-y-1.5">
              {habits.slice(0, 5).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium text-primary truncate max-w-[140px]">{h.name}</span>
                  <div className="flex items-center gap-2">
                    {last7Days.map((d, i) => {
                      const done = Boolean(completions[h.id]?.[d.dateStr]);
                      return (
                        <span
                          key={i}
                          title={`${h.name} on ${d.dateStr}: ${done ? 'Completed' : 'Missed'}`}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            done
                              ? 'bg-secondary-container text-on-secondary-fixed font-bold'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          {done ? '✓' : '·'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. 30D VIEW: Monthly Calendar Execution Heatmap (October Matrix) */}
      {timeFilter === '30D' && (
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-primary">Monthly Execution</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">· October</span>
            </div>
            <span className="font-label-md text-label-md text-secondary font-semibold">
              {timeframeStats.activeDays} Active Days
            </span>
          </div>

          {/* Heatmap Day-of-Week Headings */}
          <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-[10px] text-outline font-medium">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>

          {/* 31 Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5" id="heatmapGrid">
            {octoberMatrix.map((item) => {
              const isSelected = selectedCalendarDay === item.day;
              return (
                <button
                  key={item.day}
                  onClick={() => {
                    setSelectedCalendarDay(item.day);
                    setSelectedDate(item.dateStr);
                  }}
                  className={`aspect-square rounded-md flex items-center justify-center font-label-sm text-[10px] transition-transform cursor-pointer hover:scale-105 active:scale-95 ${
                    item.bg
                  } ${isSelected ? 'ring-2 ring-secondary ring-offset-1 font-bold' : ''}`}
                  type="button"
                  title={`October ${item.day}: ${item.count} rituals`}
                >
                  {item.day}
                </button>
              );
            })}
            {/* Empty spacer cells */}
            <div className="aspect-square rounded-md bg-surface-container-high/30"></div>
            <div className="aspect-square rounded-md bg-surface-container-high/30"></div>
            <div className="aspect-square rounded-md bg-surface-container-high/30"></div>
            <div className="aspect-square rounded-md bg-surface-container-high/30"></div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-sm text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Today: 31st
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-outline">Less</span>
              <span className="w-3 h-3 rounded-xs bg-surface-container inline-block"></span>
              <span className="w-3 h-3 rounded-xs bg-secondary-fixed/50 inline-block"></span>
              <span className="w-3 h-3 rounded-xs bg-secondary-fixed inline-block"></span>
              <span className="w-3 h-3 rounded-xs bg-secondary inline-block"></span>
              <span className="w-3 h-3 rounded-xs bg-primary inline-block"></span>
              <span className="text-outline">More</span>
            </div>
          </div>

          {selectedCalendarDay && (
            <div className="text-xs text-on-surface-variant bg-surface-container-low p-2 rounded-lg mt-1 flex items-center justify-between">
              <span>October {selectedCalendarDay}: Active date selected</span>
              <button
                onClick={() => setSelectedCalendarDay(null)}
                className="text-secondary font-semibold hover:underline cursor-pointer"
                type="button"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. 90D VIEW: 3-Month Quarterly Momentum & 12-Week Ribbon */}
      {timeFilter === '90D' && (
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-primary">Quarterly Momentum</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">· Q3/Q4</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                82 active days across August, September, and October
              </p>
            </div>
            <span className="font-label-md text-label-md text-secondary font-semibold">
              87% Quarterly Avg
            </span>
          </div>

          {/* 3-Month Comparative Progress Bars */}
          <div className="space-y-3 pt-1">
            {quarterlyMonths.map((m) => (
              <div key={m.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">{m.name} 2024</span>
                  <span className="text-on-surface-variant">
                    {m.pct}% · {m.activeDays} days ({m.totalDone} done)
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary-container h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 12-Week Momentum Ribbon */}
          <div className="pt-2 border-t border-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                12-Week Consistency Wave
              </span>
              <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                +8% Trend
              </span>
            </div>

            <div className="grid grid-cols-12 gap-1 pt-1">
              {twelveWeeks.map((wk) => (
                <div
                  key={wk.week}
                  className="flex flex-col items-center gap-1"
                  title={`${wk.week}: ${wk.pct}% consistency`}
                >
                  <div className={`w-full h-9 rounded-md ${wk.bg} flex items-end justify-center pb-0.5`}>
                    <span className="text-[9px] text-white font-bold">{wk.pct}%</span>
                  </div>
                  <span className="text-[9px] text-outline font-medium">{wk.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. YEAR VIEW: 12-Month Annual Rhythm & Seasonality */}
      {timeFilter === 'Year' && (
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-primary">Annual Consistency</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">· 2024</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Full-year habit volume &amp; seasonal discipline
              </p>
            </div>
            <span className="font-label-md text-label-md text-secondary font-semibold">
              312 Active Days
            </span>
          </div>

          {/* 12-Month Bar Distribution */}
          <div className="grid grid-cols-12 gap-1.5 pt-2 pb-1 items-end h-28">
            {annualMonths.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={`w-full rounded-md transition-all ${
                    m.isCurrent
                      ? 'bg-primary ring-2 ring-secondary ring-offset-1'
                      : m.active
                      ? 'bg-primary-container'
                      : 'bg-surface-container-high'
                  }`}
                  style={{ height: m.active ? `${m.rate}%` : '6%' }}
                  title={`${m.label}: ${m.active ? `${m.rate}% consistency` : 'Upcoming'}`}
                ></div>
                <span
                  className={`text-[10px] font-medium ${
                    m.isCurrent ? 'text-primary font-bold' : m.active ? 'text-on-surface-variant' : 'text-outline'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Seasonal Consistency Summary */}
          <div className="pt-2 border-t border-surface-container-low grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-surface-container-low rounded-lg p-2">
              <span className="text-[10px] text-outline uppercase block font-semibold">Q1 Winter</span>
              <span className="font-headline-sm text-sm text-primary font-bold">78%</span>
            </div>
            <div className="bg-surface-container-low rounded-lg p-2">
              <span className="text-[10px] text-outline uppercase block font-semibold">Q2 Spring</span>
              <span className="font-headline-sm text-sm text-primary font-bold">84%</span>
            </div>
            <div className="bg-surface-container-low rounded-lg p-2">
              <span className="text-[10px] text-outline uppercase block font-semibold">Q3 Summer</span>
              <span className="font-headline-sm text-sm text-primary font-bold">87%</span>
            </div>
            <div className="bg-surface-container-low rounded-lg p-2 ring-1 ring-secondary/40">
              <span className="text-[10px] text-secondary uppercase block font-semibold">Q4 Autumn</span>
              <span className="font-headline-sm text-sm text-primary font-bold">89%</span>
            </div>
          </div>
        </div>
      )}

      {/* Habit Consistency Breakdown (Calculated Dynamically from Real Data) */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-primary">Habit Consistency</h2>
          <span className="font-label-md text-label-md text-on-surface-variant">Ranked by completion</span>
        </div>

        <div className="flex flex-col gap-space-xs">
          {habitBreakdowns.map(({ habit, consistencyRate, streak }) => {
            const hasFire = streak >= 7;
            const barBg =
              consistencyRate >= 90
                ? 'bg-primary-container'
                : consistencyRate >= 80
                ? 'bg-secondary'
                : 'bg-secondary-fixed-dim';

            return (
              <div
                key={habit.id}
                className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-base">{habit.symbol}</span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-body-md text-body-md font-semibold text-primary truncate">
                        {habit.name}
                      </p>
                      <div className="flex items-center gap-1.5 font-label-sm text-[11px] text-on-surface-variant">
                        <span>{consistencyRate}% consistency</span>
                        <span>•</span>
                        <span
                          className={`font-medium flex items-center gap-0.5 ${
                            hasFire ? 'text-secondary' : 'text-on-surface-variant'
                          }`}
                        >
                          {streak} {streak === 1 ? 'day streak' : 'day streak'}
                          {hasFire && (
                            <span
                              className="material-symbols-outlined text-[13px] text-[#e06d28]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              local_fire_department
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {consistencyRate}%
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div
                    className={`${barBg} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${consistencyRate}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Progress Insights Card */}
      <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-md flex flex-col gap-space-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-secondary-container/10 pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary-container text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-container font-semibold">
              Habit Correlation
            </span>
          </div>
          <span className="font-label-sm text-[11px] bg-primary/40 px-2 py-0.5 rounded-full text-on-primary-container">
            AI Pattern
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-primary leading-relaxed">
          You are <span className="font-semibold text-secondary-container">35% more likely</span> to complete Evening Reflection when <span className="text-white font-medium">Morning Mindfulness</span> is completed before 08:00 AM.
        </p>

        <div className="flex items-center justify-between pt-space-xs mt-1 border-t border-on-primary/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-base">
              auto_graph
            </span>
            <span className="font-label-sm text-label-sm text-on-primary-container">
              Best Day: <strong className="text-white">Tuesday</strong>
            </span>
          </div>
          <span className="font-label-md text-label-md font-bold text-secondary-container bg-primary/30 px-2 py-0.5 rounded-md">
            96% avg
          </span>
        </div>
      </div>

      {/* Micro-Journaling Prompt Callout */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </div>
          <div className="min-w-0">
            <p className="font-body-md text-body-md font-semibold text-primary">Weekly Reflection</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Capture thoughts on your consistent momentum
            </p>
          </div>
        </div>
        <button
          onClick={onOpenReflection}
          className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold shadow-xs hover:bg-surface-container transition-all shrink-0 cursor-pointer"
          type="button"
        >
          Reflect
        </button>
      </div>
    </div>
  );
};
