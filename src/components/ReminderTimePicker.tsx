import React from 'react';
import { parseTimeComponents, to12HourTime, to24HourTime } from '../utils/habitUtils';

interface ReminderTimePickerProps {
  value: string; // e.g. "09:00 PM" or "21:00"
  onChange: (formatted12h: string, formatted24h: string) => void;
  disabled?: boolean;
  inputId?: string;
}

const PRESET_TIMES = ['07:00 AM', '09:00 AM', '12:30 PM', '06:00 PM', '09:00 PM'];
const HOURS_12 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES_STEP = ['00', '15', '30', '45'];

export const ReminderTimePicker: React.FC<ReminderTimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  inputId = 'reminderTimeInput',
}) => {
  const { hour12, minute, period, time24, formatted12 } = parseTimeComponents(value);

  const handleNativeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw24 = e.target.value;
    if (!raw24) return;
    const next12 = to12HourTime(raw24);
    const next24 = to24HourTime(next12);
    onChange(next12, next24);
  };

  const handlePartsChange = (nextHour: string, nextMin: string, nextPeriod: 'AM' | 'PM') => {
    const composed12 = `${nextHour}:${nextMin} ${nextPeriod}`;
    const composed24 = to24HourTime(composed12);
    onChange(composed12, composed24);
  };

  return (
    <div className={`space-y-3 pt-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Primary Time Picker Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low rounded-xl p-2.5">
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
          <span>Scheduled Time</span>
        </label>

        <div className="flex items-center gap-2">
          {/* Native time input for accessibility & direct keyboard/picker entry */}
          <input
            id={inputId}
            aria-label="Reminder time"
            type="time"
            value={time24}
            disabled={disabled}
            onChange={handleNativeTimeChange}
            className="bg-surface-container-lowest text-primary font-headline-sm text-sm font-semibold px-3 py-1.5 rounded-lg shadow-2xs border border-outline-variant/40 focus:outline-none focus:border-primary"
          />

          {/* Hour / Minute / AM-PM Explicit Selectors */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded-lg border border-outline-variant/30">
            <select
              aria-label="Reminder hour"
              value={hour12}
              disabled={disabled}
              onChange={(e) => handlePartsChange(e.target.value, minute, period)}
              className="bg-transparent text-primary font-label-md text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {HOURS_12.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-outline font-bold">:</span>
            <select
              aria-label="Reminder minute"
              value={MINUTES_STEP.includes(minute) ? minute : '00'}
              disabled={disabled}
              onChange={(e) => handlePartsChange(hour12, e.target.value, period)}
              className="bg-transparent text-primary font-label-md text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {MINUTES_STEP.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              {!MINUTES_STEP.includes(minute) && <option value={minute}>{minute}</option>}
            </select>
            <div className="flex items-center bg-surface-container-low rounded-md p-0.5 ml-1">
              {(['AM', 'PM'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePartsChange(hour12, minute, p)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    period === p
                      ? 'bg-primary-container text-on-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Time Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-[11px] text-outline">Quick Rhythm Presets</span>
          <span className="font-label-sm text-[11px] text-secondary font-semibold">
            {formatted12}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TIMES.map((preset) => {
            const isSelected = formatted12 === preset;
            return (
              <button
                key={preset}
                type="button"
                disabled={disabled}
                onClick={() => onChange(preset, to24HourTime(preset))}
                className={`px-2.5 py-1 rounded-full font-label-sm text-[11px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
