import React from 'react';
import { BookOpen } from 'lucide-react';
import NetworkStatus from './NetworkStatus';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Virtual Classroom</h1>
            <p className="text-xs text-gray-500">Low-Bandwidth Learning Platform</p>
          </div>
        </div>
        
        <NetworkStatus />
      </div>
    </header>
  );
};

export default Header;