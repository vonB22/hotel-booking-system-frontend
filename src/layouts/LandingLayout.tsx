import React from 'react';
import Navbar from '../Components/Navbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar isDashboard={false} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
