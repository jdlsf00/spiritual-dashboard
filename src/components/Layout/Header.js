import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return {
          title: 'Spiritual Dashboard',
          subtitle: 'Welcome to your divine guidance center'
        };
      case '/tarot':
        return {
          title: 'Tarot Reading',
          subtitle: 'Seek wisdom through the cards'
        };
      case '/astrology':
        return {
          title: 'Astrology',
          subtitle: 'Celestial insights and cosmic guidance'
        };
      case '/knowledge':
        return {
          title: 'Knowledge Base',
          subtitle: 'Explore spiritual wisdom and teachings'
        };
      case '/settings':
        return {
          title: 'Settings',
          subtitle: 'Customize your spiritual journey'
        };
      default:
        return {
          title: 'Spiritual AI',
          subtitle: 'Your guide to enlightenment'
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-mystical font-semibold cosmic-text">
            {title}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {subtitle}
          </p>
        </motion.div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search spiritual wisdom..."
              className="spiritual-input pl-10 pr-4 py-2 w-64 text-sm"
            />
          </div>

          {/* Theme Toggle */}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white/70 hover:text-white">
            <SunIcon className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white/70 hover:text-white">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-spiritual-500 rounded-full border-2 border-slate-900"></div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-white">
                Spiritual Seeker
              </div>
              <div className="text-xs text-white/50">
                Level 3 Practitioner
              </div>
            </div>
            <button className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200">
              <UserCircleIcon className="w-8 h-8 text-white/70 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb or Additional Info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-white/50">
          <span>Home</span>
          <span>/</span>
          <span className="text-white/80">{title}</span>
        </div>
        
        {/* Time/Date Info */}
        <div className="hidden md:flex items-center space-x-4 text-sm text-white/60">
          <div className="flex items-center space-x-2">
            <MoonIcon className="w-4 h-4" />
            <span>Waning Crescent</span>
          </div>
          <div>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
