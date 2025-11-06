import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  SparklesIcon,
  StarIcon,
  BookOpenIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      description: 'Overview & Quick Actions'
    },
    {
      name: 'Tarot Reading',
      href: '/tarot',
      icon: SparklesIcon,
      description: 'Divine Guidance Cards'
    },
    {
      name: 'Astrology',
      href: '/astrology',
      icon: StarIcon,
      description: 'Celestial Insights'
    },
    {
      name: 'Knowledge Base',
      href: '/knowledge',
      icon: BookOpenIcon,
      description: 'Spiritual Wisdom'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      description: 'Preferences & Config'
    },
  ];

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' }
  };

  return (
    <motion.div
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col h-full"
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-spiritual-500 to-mystical-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-mystical font-semibold cosmic-text">
                Spiritual AI
              </h1>
              <p className="text-xs text-white/50">Dashboard</p>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white/70 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `navigation-link ${isActive ? 'active' : ''} ${
                  isCollapsed ? 'justify-center' : ''
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-white/50 group-hover:text-white/70">
                    {item.description}
                  </div>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="text-xs text-white/50 mb-2">
              AI Crew Stack
            </div>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/60">Online</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
