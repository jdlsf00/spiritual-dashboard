/**
 * Spiritual Notification System for Dashboard
 * 
 * Beautiful, animated notification system with spiritual theming
 * Integrates with the spiritual error handling system
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Create notification context
const SpiritualNotificationContext = createContext();

// Notification Provider Component
export const SpiritualNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration (default 5 seconds)
    const duration = notification.duration !== undefined ? notification.duration : 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Spiritual-themed notification helpers
  const notifySuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title: options.title || '✨ Spiritual Success',
      message,
      ...options
    });
  }, [addNotification]);

  const notifyError = useCallback((error, options = {}) => {
    const message = error?.spiritualMessage || error?.message || error || 'An unknown error occurred';
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title: options.title || '🌙 Spiritual Challenge',
      message,
      ...options
    });
  }, [addNotification]);

  const notifyWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: options.title || '⚠️ Cosmic Caution',
      message,
      ...options
    });
  }, [addNotification]);

  const notifyInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: options.title || '🔮 Spiritual Insight',
      message,
      ...options
    });
  }, [addNotification]);

  const notifyLoading = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.LOADING,
      title: options.title || '🌟 Channeling Energy',
      message,
      duration: 0, // Loading notifications don't auto-dismiss
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyLoading
  };

  return (
    <SpiritualNotificationContext.Provider value={value}>
      {children}
      <SpiritualNotificationContainer />
    </SpiritualNotificationContext.Provider>
  );
};

// Hook to use notifications
export const useSpiritualNotifications = () => {
  const context = useContext(SpiritualNotificationContext);
  if (!context) {
    throw new Error('useSpiritualNotifications must be used within SpiritualNotificationProvider');
  }
  return context;
};

// Individual Notification Component
const SpiritualNotification = ({ notification, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate progress for auto-dismiss
  useEffect(() => {
    if (notification.duration > 0 && !isHovered) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (notification.duration / 100));
          return Math.max(0, newProgress);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [notification.duration, isHovered]);

  // Get notification styling based on type
  const getNotificationStyle = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return {
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-400/50',
          text: 'text-green-200',
          icon: CheckCircleIcon,
          glow: 'shadow-green-500/25'
        };
      case NOTIFICATION_TYPES.ERROR:
        return {
          bg: 'from-red-500/20 to-rose-500/20',
          border: 'border-red-400/50',
          text: 'text-red-200',
          icon: XCircleIcon,
          glow: 'shadow-red-500/25'
        };
      case NOTIFICATION_TYPES.WARNING:
        return {
          bg: 'from-yellow-500/20 to-amber-500/20',
          border: 'border-yellow-400/50',
          text: 'text-yellow-200',
          icon: ExclamationTriangleIcon,
          glow: 'shadow-yellow-500/25'
        };
      case NOTIFICATION_TYPES.INFO:
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-400/50',
          text: 'text-blue-200',
          icon: InformationCircleIcon,
          glow: 'shadow-blue-500/25'
        };
      case NOTIFICATION_TYPES.LOADING:
        return {
          bg: 'from-purple-500/20 to-indigo-500/20',
          border: 'border-purple-400/50',
          text: 'text-purple-200',
          icon: ArrowPathIcon,
          glow: 'shadow-purple-500/25'
        };
      default:
        return {
          bg: 'from-gray-500/20 to-slate-500/20',
          border: 'border-gray-400/50',
          text: 'text-gray-200',
          icon: InformationCircleIcon,
          glow: 'shadow-gray-500/25'
        };
    }
  };

  const style = getNotificationStyle(notification.type);
  const IconComponent = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative bg-gradient-to-r ${style.bg} backdrop-blur-sm border ${style.border} rounded-lg shadow-lg ${style.glow} p-4 max-w-sm w-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar for auto-dismiss */}
      {notification.duration > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-white/20 rounded-t-lg w-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-white/60 to-white/80"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent 
            className={`w-6 h-6 ${style.text} ${notification.type === NOTIFICATION_TYPES.LOADING ? 'animate-spin' : ''}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-semibold ${style.text}`}>
              {notification.title}
            </h4>
            
            {/* Close button */}
            <button
              onClick={() => onRemove(notification.id)}
              className="flex-shrink-0 ml-2 text-white/60 hover:text-white/90 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-white/80 text-sm mt-1 leading-relaxed">
            {notification.message}
          </p>

          {/* Action buttons */}
          {(notification.onRetry || notification.onUseFallback || notification.onAction) && (
            <div className="flex space-x-2 mt-3">
              {notification.onRetry && (
                <button
                  onClick={() => {
                    notification.onRetry();
                    onRemove(notification.id);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white/90 transition-colors"
                >
                  <ArrowPathIcon className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
              
              {notification.onUseFallback && (
                <button
                  onClick={() => {
                    notification.onUseFallback();
                    onRemove(notification.id);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white/90 transition-colors"
                >
                  <SparklesIcon className="w-3 h-3" />
                  <span>Use Offline Mode</span>
                </button>
              )}

              {notification.onAction && (
                <button
                  onClick={() => {
                    notification.onAction();
                    onRemove(notification.id);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white/90 transition-colors"
                >
                  <span>{notification.actionLabel || 'Action'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Notification Container Component
const SpiritualNotificationContainer = () => {
  const { notifications, removeNotification } = useSpiritualNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <SpiritualNotification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SpiritualNotificationProvider;
