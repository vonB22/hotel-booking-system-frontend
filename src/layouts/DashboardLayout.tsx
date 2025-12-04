import React from 'react';
import DashboardNavbar from '../Components/DashboardNavbar';
import Sidebar from '../Components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNavbar />
      <Sidebar />
      {/* main uses responsive margin via CSS and the html root class toggled by Sidebar */}
      <main className="pt-16 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-8 max-w-full">{children}</div>
      </main>

      <style>{`
        /* By default on desktop, push content to match sidebar width.
           The Sidebar component toggles 'sidebar-hidden' on :root when collapsed
           so the layout can react without additional React state/sharing. */
        @media (min-width: 1024px) {
          main { margin-left: 18rem; }
          :root.sidebar-hidden main { margin-left: 0 !important; }
        }
        @media (max-width: 1023px) {
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
