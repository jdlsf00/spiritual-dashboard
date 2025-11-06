import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  BellIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      dailyReading: true,
      planetaryTransits: true,
      newContent: false,
      emailDigest: true,
    },
    appearance: {
      theme: 'dark',
      animations: true,
      reducedMotion: false,
      fontSize: 'medium',
    },
    privacy: {
      shareReadings: false,
      analyticsTracking: true,
      personalizedContent: true,
    },
    profile: {
      name: 'Spiritual Seeker',
      birthDate: '',
      birthTime: '',
      location: '',
      timezone: 'UTC',
    },
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile & Birth Information',
      icon: UserIcon,
      description: 'Manage your personal information for accurate readings',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: BellIcon,
      description: 'Control what notifications you receive',
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: PaintBrushIcon,
      description: 'Customize the look and feel of your dashboard',
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: ShieldCheckIcon,
      description: 'Manage your privacy and data sharing preferences',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="spiritual-card p-8 mystical-glow text-center"
      >
        <CogIcon className="w-16 h-16 text-spiritual-400 mx-auto mb-4" />
        <h2 className="text-3xl font-mystical font-bold cosmic-text mb-2">
          Settings
        </h2>
        <p className="text-white/70 text-lg">
          Customize your spiritual journey experience
        </p>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="spiritual-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <UserIcon className="w-6 h-6 text-spiritual-400" />
            <h3 className="text-xl font-semibold text-white">Profile & Birth Info</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2">Name</label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                className="spiritual-input w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={settings.profile.birthDate}
                  onChange={(e) => updateSetting('profile', 'birthDate', e.target.value)}
                  className="spiritual-input w-full"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Birth Time</label>
                <input
                  type="time"
                  value={settings.profile.birthTime}
                  onChange={(e) => updateSetting('profile', 'birthTime', e.target.value)}
                  className="spiritual-input w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/70 mb-2">Birth Location</label>
              <input
                type="text"
                placeholder="City, Country"
                value={settings.profile.location}
                onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                className="spiritual-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-white/70 mb-2">Timezone</label>
              <select
                value={settings.profile.timezone}
                onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
                className="spiritual-input w-full"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="spiritual-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BellIcon className="w-6 h-6 text-mystical-400" />
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-white/60 text-sm">
                    {key === 'dailyReading' && 'Get notified about your daily guidance'}
                    {key === 'planetaryTransits' && 'Alerts for important cosmic events'}
                    {key === 'newContent' && 'Updates when new content is available'}
                    {key === 'emailDigest' && 'Weekly summary via email'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spiritual-500"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="spiritual-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <PaintBrushIcon className="w-6 h-6 text-cosmic-400" />
            <h3 className="text-xl font-semibold text-white">Appearance</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 mb-3">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('appearance', 'theme', 'dark')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.appearance.theme === 'dark'
                      ? 'border-spiritual-400 bg-spiritual-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <MoonIcon className="w-6 h-6 mx-auto mb-2 text-white" />
                  <div className="text-white text-sm">Dark</div>
                </button>
                <button
                  onClick={() => updateSetting('appearance', 'theme', 'light')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.appearance.theme === 'light'
                      ? 'border-spiritual-400 bg-spiritual-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <SunIcon className="w-6 h-6 mx-auto mb-2 text-white" />
                  <div className="text-white text-sm">Light</div>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-white/70 mb-3">Font Size</label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                className="spiritual-input w-full"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Enable Animations</div>
                  <div className="text-white/60 text-sm">Smooth transitions and effects</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.animations}
                    onChange={(e) => updateSetting('appearance', 'animations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmic-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Reduced Motion</div>
                  <div className="text-white/60 text-sm">For accessibility preferences</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.reducedMotion}
                    onChange={(e) => updateSetting('appearance', 'reducedMotion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmic-500"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="spiritual-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheckIcon className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Privacy & Data</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-white/60 text-sm">
                    {key === 'shareReadings' && 'Allow sharing readings with community'}
                    {key === 'analyticsTracking' && 'Help improve our services with usage data'}
                    {key === 'personalizedContent' && 'Customize content based on your preferences'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <button className="spiritual-button inline-flex items-center space-x-2">
          <ShieldCheckIcon className="w-5 h-5" />
          <span>Save Settings</span>
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
