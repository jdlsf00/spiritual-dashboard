/**
 * Network Configuration Management for Spiritual Dashboard
 * 
 * Centralized configuration for all network-related settings
 * across the Spiritual Dashboard application
 */

// Environment-based configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};

// Service endpoints configuration
export const SERVICE_ENDPOINTS = {
  // Core spiritual services
  SPIRITUAL_API: {
    name: 'Spiritual API',
    url: process.env.REACT_APP_SPIRITUAL_API_URL || 'http://localhost:8001',
    health: '/health',
    timeout: 30000
  },
  
  TAROT_SERVICE: {
    name: 'Tarot Reader',
    url: process.env.REACT_APP_TAROT_SERVICE_URL || 'http://localhost:7870', 
    health: '/health',
    timeout: 45000
  },
  
  ASTROLOGY_SERVICE: {
    name: 'Astrology Calculator',
    url: process.env.REACT_APP_ASTROLOGY_SERVICE_URL || 'http://localhost:7871',
    health: '/health',
    timeout: 60000
  },
  
  BOOK_CHAT_SERVICE: {
    name: 'Book Chat API',
    url: process.env.REACT_APP_BOOK_CHAT_URL || 'http://localhost:8002',
    health: '/health',
    timeout: 30000
  },
  
  SPIRITUAL_GATEWAY: {
    name: 'Spiritual Gateway',
    url: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8091',
    health: '/api/health',
    timeout: 25000
  },
  
  // Dashboard-specific services
  DASHBOARD_API: {
    name: 'Dashboard API',
    url: process.env.REACT_APP_DASHBOARD_API_URL || 'http://localhost:3003',
    health: '/health',
    timeout: 15000
  },
  
  // Analytics and monitoring
  ANALYTICS_SERVICE: {
    name: 'Analytics Service',
    url: process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:3001',
    health: '/health',
    timeout: 15000
  },
  
  METRICS_SERVICE: {
    name: 'Metrics Service', 
    url: process.env.REACT_APP_METRICS_URL || 'http://localhost:9090',
    health: '/api/v1/status/config',
    timeout: 10000
  }
};

// Network retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000,    // 10 seconds
  BACKOFF_MULTIPLIER: 2,
  
  // Jitter to avoid thundering herd
  addJitter: (delay) => {
    const jitter = Math.random() * 0.3; // ±30% jitter
    return delay * (1 + jitter);
  },
  
  // Calculate delay with exponential backoff
  calculateDelay: (attempt) => {
    const delay = RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, attempt - 1);
    return Math.min(RETRY_CONFIG.addJitter(delay), RETRY_CONFIG.MAX_DELAY);
  }
};

// Request timeout configuration by operation type
export const TIMEOUT_CONFIG = {
  QUICK: 5000,      // Health checks, simple queries
  NORMAL: 15000,    // Standard API calls
  LONG: 30000,      // AI inference, complex processing
  EXTENDED: 60000,  // Astrology calculations, large data processing
  
  // Dynamic timeout based on operation
  getTimeout: (operation) => {
    const timeoutMap = {
      health: TIMEOUT_CONFIG.QUICK,
      models: TIMEOUT_CONFIG.NORMAL,
      chat: TIMEOUT_CONFIG.LONG,
      reading: TIMEOUT_CONFIG.LONG,
      birthChart: TIMEOUT_CONFIG.EXTENDED,
      query: TIMEOUT_CONFIG.NORMAL,
      generateChart: TIMEOUT_CONFIG.EXTENDED,
      fetchTarotReading: TIMEOUT_CONFIG.LONG
    };
    
    return timeoutMap[operation] || TIMEOUT_CONFIG.NORMAL;
  }
};

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  LONG_TTL: 30 * 60 * 1000,   // 30 minutes
  SHORT_TTL: 1 * 60 * 1000,   // 1 minute
  
  // TTL by data type
  TTL_MAP: {
    models: 30 * 60 * 1000,    // Models change infrequently
    health: 1 * 60 * 1000,     // Health checks are frequent
    spreads: 60 * 60 * 1000,   // Tarot spreads are static
    books: 15 * 60 * 1000,     // Book data is semi-static
    user: 5 * 60 * 1000,       // User preferences
    charts: 10 * 60 * 1000,    // Astrology charts
    readings: 0                // Don't cache readings (personal)
  },
  
  getTTL: (dataType) => {
    return CACHE_CONFIG.TTL_MAP[dataType] || CACHE_CONFIG.DEFAULT_TTL;
  }
};

// Request headers configuration
export const HEADERS_CONFIG = {
  DEFAULT: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client': 'spiritual-dashboard',
    'X-Version': '1.0.0'
  },
  
  // Headers for specific services
  SPIRITUAL_API: {
    'X-Service': 'spiritual-api',
    'X-Context': 'spiritual-guidance'
  },
  
  TAROT_SERVICE: {
    'X-Service': 'tarot-reader',
    'X-Context': 'divination'
  },
  
  ASTROLOGY_SERVICE: {
    'X-Service': 'astrology-calculator',
    'X-Context': 'celestial-wisdom'
  },
  
  BOOK_CHAT_SERVICE: {
    'X-Service': 'book-chat',
    'X-Context': 'ancient-knowledge'
  },
  
  DASHBOARD_API: {
    'X-Service': 'dashboard-api',
    'X-Context': 'spiritual-dashboard'
  },
  
  // Build headers for specific service
  buildHeaders: (service, additional = {}) => {
    const serviceHeaders = HEADERS_CONFIG[service] || {};
    return {
      ...HEADERS_CONFIG.DEFAULT,
      ...serviceHeaders,
      ...additional
    };
  }
};

// Network status monitoring
export class NetworkStatus {
  constructor() {
    this.isOnline = navigator.onLine;
    this.serviceStatus = new Map();
    this.lastChecked = new Map();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.broadcastStatusChange('online');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.broadcastStatusChange('offline');
    });
  }
  
  // Check if we're online
  get online() {
    return this.isOnline;
  }
  
  // Get service status
  getServiceStatus(service) {
    return this.serviceStatus.get(service) || 'unknown';
  }
  
  // Update service status
  setServiceStatus(service, status) {
    this.serviceStatus.set(service, status);
    this.lastChecked.set(service, Date.now());
    this.broadcastStatusChange('service', { service, status });
  }
  
  // Get all service statuses
  getAllServiceStatuses() {
    const statuses = {};
    for (const [service, status] of this.serviceStatus) {
      statuses[service] = {
        status,
        lastChecked: this.lastChecked.get(service)
      };
    }
    return statuses;
  }
  
  // Broadcast status changes
  broadcastStatusChange(type, data = {}) {
    const event = new CustomEvent('networkStatusChange', {
      detail: { type, data, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }
  
  // Health check for specific service
  async checkServiceHealth(service) {
    if (!this.isOnline) {
      this.setServiceStatus(service, 'offline');
      return false;
    }
    
    const config = SERVICE_ENDPOINTS[service];
    if (!config) {
      this.setServiceStatus(service, 'unknown');
      return false;
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for health checks
      
      const response = await fetch(`${config.url}${config.health}`, {
        method: 'GET',
        signal: controller.signal,
        headers: HEADERS_CONFIG.buildHeaders(service)
      });
      
      clearTimeout(timeoutId);
      
      const isHealthy = response.ok;
      this.setServiceStatus(service, isHealthy ? 'healthy' : 'unhealthy');
      return isHealthy;
      
    } catch (error) {
      this.setServiceStatus(service, 'error');
      return false;
    }
  }
  
  // Health check for all services
  async checkAllServices() {
    const checks = Object.keys(SERVICE_ENDPOINTS).map(service => 
      this.checkServiceHealth(service)
    );
    
    const results = await Promise.allSettled(checks);
    const summary = {
      total: results.length,
      healthy: results.filter(r => r.status === 'fulfilled' && r.value).length,
      unhealthy: results.filter(r => r.status === 'fulfilled' && !r.value).length,
      errors: results.filter(r => r.status === 'rejected').length
    };
    
    this.broadcastStatusChange('healthCheck', summary);
    return summary;
  }
}

// Global network status instance
export const networkStatus = new NetworkStatus();

// URL builder utility
export const URLBuilder = {
  // Build full URL for service endpoint
  build: (service, path = '', params = {}) => {
    const config = SERVICE_ENDPOINTS[service];
    if (!config) {
      throw new Error(`Unknown service: ${service}`);
    }
    
    let url = `${config.url}${path}`;
    
    // Add query parameters if provided
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return url;
  },
  
  // Build WebSocket URL
  buildWebSocket: (service, path = '/ws') => {
    const config = SERVICE_ENDPOINTS[service];
    if (!config) {
      throw new Error(`Unknown service for WebSocket: ${service}`);
    }
    
    return config.url.replace(/^http/, 'ws') + path;
  }
};

// Export all configurations
export default {
  ENV_CONFIG,
  SERVICE_ENDPOINTS,
  RETRY_CONFIG,
  TIMEOUT_CONFIG,
  CACHE_CONFIG,
  HEADERS_CONFIG,
  networkStatus,
  URLBuilder
};
