import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { NavigationState } from '../types/navigation';

interface MainLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  state: NavigationState;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  setActiveTab,
  state,
  children
}) => {
  return (
    <div className="flex min-h-screen bg-[#070B14] text-[#F8FAFC]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar state={state} />
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
