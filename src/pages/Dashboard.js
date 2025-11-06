import React from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  StarIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const quickActions = [
    {
      title: 'Daily Tarot Reading',
      description: 'Get your daily guidance',
      icon: SparklesIcon,
      href: '/tarot',
      color: 'from-spiritual-500 to-spiritual-600',
    },
    {
      title: 'Astrology Chart',
      description: 'View your cosmic alignment',
      icon: StarIcon,
      href: '/astrology',
      color: 'from-mystical-500 to-mystical-600',
    },
    {
      title: 'Wisdom Search',
      description: 'Explore spiritual knowledge',
      icon: BookOpenIcon,
      href: '/knowledge',
      color: 'from-cosmic-500 to-cosmic-600',
    },
  ];

  const recentActivity = [
    {
      type: 'tarot',
      title: 'Three Card Spread',
      time: '2 hours ago',
      result: 'The Fool, The Magician, The High Priestess'
    },
    {
      type: 'astrology',
      title: 'Birth Chart Analysis',
      time: '1 day ago',
      result: 'Mars in Leo rising'
    },
    {
      type: 'knowledge',
      title: 'Chakra Meditation Guide',
      time: '2 days ago',
      result: 'Root chakra healing techniques'
    },
  ];

  const insights = [
    {
      title: 'Spiritual Growth',
      value: '87%',
      change: '+12%',
      icon: HeartIcon,
    },
    {
      title: 'Daily Practice',
      value: '15',
      change: '+3',
      icon: ClockIcon,
    },
    {
      title: 'Wisdom Gained',
      value: '234',
      change: '+18',
      icon: BookOpenIcon,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="spiritual-card p-8 mystical-glow"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-mystical font-bold cosmic-text mb-2">
              Welcome Back, Seeker
            </h2>
            <p className="text-white/70 text-lg">
              Your spiritual journey continues. What wisdom will you discover today?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-gradient-to-br from-spiritual-500/20 to-mystical-500/20 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-16 h-16 text-spiritual-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="spiritual-card p-6 hover-lift cursor-pointer group"
                onClick={() => window.location.href = action.href}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {action.title}
                </h4>
                <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                  {action.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Insights & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Your Progress</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={insight.title} className="spiritual-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-spiritual-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-spiritual-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{insight.title}</div>
                        <div className="text-white/60 text-sm">{insight.change} this week</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold cosmic-text">{insight.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="spiritual-card p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'tarot' ? 'bg-spiritual-500/20' :
                    activity.type === 'astrology' ? 'bg-mystical-500/20' :
                    'bg-cosmic-500/20'
                  }`}>
                    {activity.type === 'tarot' && <SparklesIcon className="w-4 h-4 text-spiritual-400" />}
                    {activity.type === 'astrology' && <StarIcon className="w-4 h-4 text-mystical-400" />}
                    {activity.type === 'knowledge' && <BookOpenIcon className="w-4 h-4 text-cosmic-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.title}</div>
                    <div className="text-white/60 text-sm mt-1">{activity.result}</div>
                    <div className="text-white/40 text-xs mt-2">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Wisdom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="spiritual-card p-8 text-center"
      >
        <h3 className="text-xl font-mystical font-semibold cosmic-text mb-4">
          Daily Wisdom
        </h3>
        <blockquote className="text-lg text-white/80 italic mb-4">
          "The soul becomes dyed with the color of its thoughts."
        </blockquote>
        <cite className="text-white/60">— Marcus Aurelius</cite>
      </motion.div>
    </div>
  );
};

export default Dashboard;
