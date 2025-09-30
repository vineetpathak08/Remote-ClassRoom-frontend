import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Video, Download, Users } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { path: '/lectures', label: 'Lectures', icon: Book },
    { path: '/live-classes', label: 'Live Classes', icon: Video },
    { path: '/downloads', label: 'Downloads', icon: Download },
    { path: '/faculty', label: 'Faculty', icon: Users }
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;