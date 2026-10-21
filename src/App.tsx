import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OverviewView } from './components/OverviewView';
import { ProgressView } from './components/ProgressView';
import { NewHabitView } from './components/NewHabitView';
import { HabitsListView } from './components/HabitsListView';
import { SettingsView } from './components/SettingsModal';
import { ReflectionModal } from './components/ReflectionModal';
import { NotificationBanner } from './components/NotificationBanner';

const AppContent: React.FC = () => {
  const { currentView } = useHabits();
  const [reflectionOpen, setReflectionOpen] = useState(false);

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      {/* Fixed Header */}
      <Header />

      {/* Active Reminder Notification Banner */}
      <NotificationBanner />

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        {currentView === 'overview' && <OverviewView />}
        {currentView === 'my-habits' && <HabitsListView />}
        {currentView === 'progress' && (
          <ProgressView onOpenReflection={() => setReflectionOpen(true)} />
        )}
        {currentView === 'new-habit' && <NewHabitView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Reflection Journal Modal */}
      <ReflectionModal
        isOpen={reflectionOpen}
        onClose={() => setReflectionOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}
