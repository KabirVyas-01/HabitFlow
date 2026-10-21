import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose }) => {
  const { reflections, addReflection, selectedDate } = useHabits();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('calm');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const moods = [
    { id: 'calm', label: 'Calm', icon: 'spa' },
    { id: 'grounded', label: 'Grounded', icon: 'self_improvement' },
    { id: 'focused', label: 'Focused', icon: 'psychology' },
    { id: 'energized', label: 'Energized', icon: 'bolt' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addReflection(content.trim(), mood);
    setContent('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-space-md shadow-xl space-y-space-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary">Weekly Reflection</h2>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Capture thoughts on your consistent momentum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Reflection Form */}
        <form onSubmit={handleSave} className="space-y-space-sm">
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
              Current State of Mind
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                    mood === m.id
                      ? 'bg-primary-container text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
              Intention & Reflections
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What rituals felt effortless this week? Where did resistance arise, and what gentle adjustment will restore ease?"
              className="w-full bg-surface-container-low rounded-xl p-3 font-body-md text-body-md text-primary placeholder:text-outline focus:outline-none focus:bg-surface-container transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Recorded
                </>
              ) : (
                'Save Reflection'
              )}
            </button>
          </div>
        </form>

        {/* Previous Reflections Log */}
        {reflections.length > 0 && (
          <div className="pt-space-sm border-t border-surface-container-low space-y-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Recent Entries
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {reflections.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-surface-container-low rounded-xl p-2.5 space-y-1 text-left"
                >
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="font-semibold text-primary">{ref.date}</span>
                    <span className="capitalize px-2 py-0.5 rounded-full bg-surface-container text-secondary font-medium">
                      {ref.mood}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                    {ref.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
