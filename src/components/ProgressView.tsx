import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { calculateHabitStats } from '../utils/habitUtils';

interface ProgressViewProps {
  onOpenReflection: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onOpenReflection }) => {
  const { habits, completions, selectedDate, setSelectedDate } = useHabits();
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '90D' | 'Year'>('30D');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Time filter adjustments
  const rateAdjust = timeFilter === '7D' ? 92 : timeFilter === '30D' ? 88 : timeFilter === '90D' ? 84 : 81;
  const totalDoneAdjust = timeFilter === '7D' ? 44 : timeFilter === '30D' ? 142 : timeFilter === '90D' ? 398 : 1240;

  // Calculate consistency breakdown from actual habits
  const habitBreakdowns = habits.slice(0, 5).map((h) => {
    const stats = calculateHabitStats(h, completions, selectedDate);
    return {
      habit: h,
      ...stats,
    };
  }).sort((a, b) => b.consistencyRate - a.consistencyRate);

  // October 31-day heatmap matrix from Stitch Image_4
  // Mapping specific color tokens as defined in the Stitch design
  const octoberMatrix = [
    // Week 1 (Oct 1 - Oct 7)
    { day: 1, count: 5, bg: 'bg-secondary-fixed/50 text-on-secondary-fixed' },
    { day: 2, count: 7, bg: 'bg-secondary text-on-secondary font-medium' },
    { day: 3, count: 8, bg: 'bg-primary-container text-on-primary font-medium' },
    { day: 4, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 5, count: 6, bg: 'bg-secondary-fixed text-on-secondary-fixed' },
    { day: 6, count: 0, bg: 'bg-surface-container text-outline' },
    { day: 7, count: 5, bg: 'bg-secondary-fixed/50 text-on-secondary-fixed' },
    // Week 2 (Oct 8 - Oct 14)
    { day: 8, count: 8, bg: 'bg-primary-container text-on-primary font-medium' },
    { day: 9, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 10, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 11, count: 7, bg: 'bg-secondary text-on-secondary font-medium' },
    { day: 12, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 13, count: 6, bg: 'bg-secondary-fixed text-on-secondary-fixed' },
    { day: 14, count: 0, bg: 'bg-surface-container text-outline' },
    // Week 3 (Oct 15 - Oct 21)
    { day: 15, count: 7, bg: 'bg-secondary text-on-secondary font-medium' },
    { day: 16, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 17, count: 8, bg: 'bg-primary-container text-on-primary font-medium' },
    { day: 18, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 19, count: 8, bg: 'bg-primary-container text-on-primary font-medium' },
    { day: 20, count: 7, bg: 'bg-secondary text-on-secondary font-medium' },
    { day: 21, count: 6, bg: 'bg-secondary-fixed text-on-secondary-fixed' },
    // Week 4 (Oct 22 - Oct 28)
    { day: 22, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 23, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 24, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 25, count: 7, bg: 'bg-secondary text-on-secondary font-medium' },
    { day: 26, count: 8, bg: 'bg-primary-container text-on-primary font-medium' },
    { day: 27, count: 0, bg: 'bg-surface-container text-outline' },
    { day: 28, count: 5, bg: 'bg-secondary-fixed/60 text-on-secondary-fixed' },
    // Week 5 (Oct 29 - Oct 31 + empty trailing cells)
    { day: 29, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 30, count: 8, bg: 'bg-primary text-on-primary font-bold' },
    { day: 31, count: 8, bg: 'bg-primary-container text-on-primary font-medium ring-2 ring-primary ring-offset-1' },
  ];

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pb-28 space-y-space-lg">
      {/* Header & Time Filter Segmented Control */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
              Momentum & Rhythm
            </p>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
              Progress & Insights
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
          </div>
        </div>

        {/* Segmented Filter Pill */}
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

      {/* Key Metrics Row / Overview Cards */}
      <div className="grid grid-cols-3 gap-space-xs">
        {/* Card 1: Completion Rate */}
        <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col justify-between shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-base">donut_large</span>
            <span className="inline-flex items-center text-[10px] font-semibold text-secondary px-1.5 py-0.5 rounded-full bg-secondary-container/40 leading-none">
              +4%
            </span>
          </div>
          <div className="mt-2">
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight block">
              {rateAdjust}%
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant truncate block leading-tight">
              Rate
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
              {totalDoneAdjust}
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant truncate block leading-tight">
              Total Done
            </span>
          </div>
        </div>

        {/* Card 3: Active Streaks */}
        <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col justify-between shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-base">local_fire_department</span>
            <span className="font-label-sm text-[10px] font-medium text-on-surface-variant">Active</span>
          </div>
          <div className="mt-2">
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight block">
              {habits.length > 0 ? habits.length : 5}
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant truncate block leading-tight">
              Routines
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Monthly Calendar Heatmap */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-primary">Monthly Execution</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">· October</span>
          </div>
          <span className="font-label-md text-label-md text-secondary font-semibold">27 Active Days</span>
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
                  const dateStr = `2024-10-${String(item.day).padStart(2, '0')}`;
                  setSelectedDate(dateStr);
                }}
                className={`aspect-square rounded-md flex items-center justify-center font-label-sm text-[10px] transition-transform cursor-pointer hover:scale-105 active:scale-95 ${
                  item.bg
                } ${isSelected ? 'ring-2 ring-secondary ring-offset-1' : ''}`}
                type="button"
                title={`October ${item.day}: ${item.count} rituals`}
              >
                {item.day}
              </button>
            );
          })}
          {/* Empty spacer cells for remaining days in 5x7 grid */}
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
            <span>October {selectedCalendarDay}: Set as active overview date</span>
            <button
              onClick={() => setSelectedCalendarDay(null)}
              className="text-secondary font-semibold hover:underline"
              type="button"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Habit Consistency Breakdown */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-primary">Habit Consistency</h2>
          <span className="font-label-md text-label-md text-on-surface-variant">Ranked by completion</span>
        </div>

        <div className="flex flex-col gap-space-xs">
          {habitBreakdowns.map(({ habit, consistencyRate, streak }) => {
            const hasFire = streak >= 15;
            const barBg =
              consistencyRate >= 90
                ? 'bg-primary-container'
                : consistencyRate >= 85
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
                          {streak}-day streak
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
        {/* Ambient organic backdrop aura */}
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
              Capture thoughts on your 18-day streak
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
