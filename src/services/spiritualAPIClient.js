/**
 * Unified Spiritual API Client for Dashboard
 * 
 * Standardized API client for spiritual-dashboard
 * Compatible with the spiritual-ui unified client
 */

import { handleSpiritualError } from './spiritualErrorHandler';
import { 
  SERVICE_ENDPOINTS, 
  RETRY_CONFIG, 
  TIMEOUT_CONFIG, 
  CACHE_CONFIG, 
  HEADERS_CONFIG,
  networkStatus,
  URLBuilder
} from './networkConfig';

// Service Configuration (imported from networkConfig)
export const SPIRITUAL_SERVICES = {
  SPIRITUAL_API: {
    name: 'spiritual-api',
    baseUrl: SERVICE_ENDPOINTS.SPIRITUAL_API.url,
    endpoints: {
      chat: '/chat',
      models: '/models',
      health: SERVICE_ENDPOINTS.SPIRITUAL_API.health
    }
  },
  TAROT_SERVICE: {
    name: 'tarot-reader',
    baseUrl: SERVICE_ENDPOINTS.TAROT_SERVICE.url,
    endpoints: {
      reading: '/reading',
      spreads: '/spreads',
      cards: '/cards',
      health: SERVICE_ENDPOINTS.TAROT_SERVICE.health
    }
  },
  ASTROLOGY_SERVICE: {
    name: 'astrology-calculator', 
    baseUrl: SERVICE_ENDPOINTS.ASTROLOGY_SERVICE.url,
    endpoints: {
      birthChart: '/birth_chart',
      compatibility: '/compatibility',
      planets: '/planets',
      health: SERVICE_ENDPOINTS.ASTROLOGY_SERVICE.health
    }
  },
  BOOK_CHAT_SERVICE: {
    name: 'book-chat-api',
    baseUrl: SERVICE_ENDPOINTS.BOOK_CHAT_SERVICE.url,
    endpoints: {
      query: '/query',
      books: '/books',
      stats: '/stats',
      health: SERVICE_ENDPOINTS.BOOK_CHAT_SERVICE.health
    }
  },
  GATEWAY_SERVICE: {
    name: 'spiritual-gateway',
    baseUrl: SERVICE_ENDPOINTS.SPIRITUAL_GATEWAY.url,
    endpoints: {
      models: '/api/models/available',
      spiritual: '/api/spiritual',
      tarot: '/api/tarot',
      astrology: '/api/astrology',
      bookChat: '/api/book-chat',
      health: SERVICE_ENDPOINTS.SPIRITUAL_GATEWAY.health
    }
  }
};

// Request Configuration
export const REQUEST_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client': 'spiritual-dashboard',
    'X-Version': '1.0.0'
  }
};

// Enhanced API Response Class
export class SpiritualAPIResponse {
  constructor(data, status, statusText, headers, config) {
    this.data = data;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.config = config;
    this.timestamp = new Date();
  }

  get isSuccess() {
    return this.status >= 200 && this.status < 300;
  }

  get isError() {
    return !this.isSuccess;
  }

  get service() {
    return this.config?.service || 'unknown';
  }
}

// Unified API Client Class
export class SpiritualDashboardAPIClient {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Build full URL for service endpoint
  buildUrl(service, endpoint) {
    const serviceConfig = SPIRITUAL_SERVICES[service];
    if (!serviceConfig) {
      throw new Error(`Unknown service: ${service}`);
    }

    const baseUrl = serviceConfig.baseUrl.replace(/\/$/, '');
    const endpointPath = serviceConfig.endpoints[endpoint] || endpoint;
    
    return `${baseUrl}${endpointPath}`;
  }

  // Apply request interceptors
  async applyRequestInterceptors(config) {
    let finalConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    
    return finalConfig;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let finalResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    
    return finalResponse;
  }

  // Core request method with error handling
  async request(service, endpoint, options = {}) {
    const url = this.buildUrl(service, endpoint);
    
    const config = {
      method: 'GET',
      headers: { ...REQUEST_CONFIG.HEADERS },
      timeout: REQUEST_CONFIG.TIMEOUT,
      service,
      endpoint,
      ...options
    };

    // Apply request interceptors
    const finalConfig = await this.applyRequestInterceptors(config);

    // Check cache for GET requests
    if (config.method === 'GET' && this.shouldUseCache(url)) {
      const cachedResponse = this.getFromCache(url);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout);

      const response = await fetch(url, {
        method: finalConfig.method,
        headers: finalConfig.headers,
        body: finalConfig.body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const spiritualResponse = new SpiritualAPIResponse(
        data,
        response.status,
        response.statusText,
        response.headers,
        finalConfig
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Cache successful GET responses
      if (config.method === 'GET' && this.shouldCache(url)) {
        this.setCache(url, spiritualResponse);
      }

      // Apply response interceptors
      return await this.applyResponseInterceptors(spiritualResponse);

    } catch (error) {
      // Use spiritual error handler
      const errorResponse = await handleSpiritualError(error, {
        component: 'SpiritualDashboardAPIClient',
        operation: 'request',
        service,
        endpoint,
        url,
        config: finalConfig
      });
      throw errorResponse.error;
    }
  }

  // Cache management
  shouldUseCache(url) {
    return url.includes('/models') || url.includes('/health') || url.includes('/spreads');
  }

  shouldCache(url) {
    return this.shouldUseCache(url);
  }

  getFromCache(url) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }
    this.cache.delete(url);
    return null;
  }

  setCache(url, response) {
    this.cache.set(url, {
      response: response,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Service-specific convenience methods

  // Spiritual API methods
  async spiritualChat(message, context = 'spiritual guidance', model = 'dolphin-mistral') {
    return this.request('SPIRITUAL_API', 'chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
        model
      })
    });
  }

  async getAvailableModels() {
    return this.request('SPIRITUAL_API', 'models');
  }

  // Tarot service methods
  async getTarotReading(question, spreadType = 'single_card', deck = 'rider_waite') {
    return this.request('TAROT_SERVICE', 'reading', {
      method: 'POST',
      body: JSON.stringify({
        question,
        spread_type: spreadType,
        deck,
        include_interpretation: true
      })
    });
  }

  async getTarotSpreads() {
    return this.request('TAROT_SERVICE', 'spreads');
  }

  async getTarotCards() {
    return this.request('TAROT_SERVICE', 'cards');
  }

  // Astrology service methods
  async generateBirthChart(birthData) {
    return this.request('ASTROLOGY_SERVICE', 'birthChart', {
      method: 'POST',
      body: JSON.stringify(birthData)
    });
  }

  async getCompatibility(person1, person2) {
    return this.request('ASTROLOGY_SERVICE', 'compatibility', {
      method: 'POST',
      body: JSON.stringify({ person1, person2 })
    });
  }

  async getPlanetaryPositions(date, time) {
    return this.request('ASTROLOGY_SERVICE', 'planets', {
      method: 'GET',
      headers: {
        ...REQUEST_CONFIG.HEADERS,
        'X-Date': date,
        'X-Time': time
      }
    });
  }

  // Book Chat service methods
  async queryBooks(question, category = 'all', model = 'dolphin-mistral') {
    return this.request('BOOK_CHAT_SERVICE', 'query', {
      method: 'POST',
      body: JSON.stringify({
        query: question,
        category,
        model
      })
    });
  }

  async getBookStats() {
    return this.request('BOOK_CHAT_SERVICE', 'stats');
  }

  async getAvailableBooks() {
    return this.request('BOOK_CHAT_SERVICE', 'books');
  }

  // Health check for all services
  async checkServiceHealth(service = null) {
    if (service) {
      return this.request(service, 'health');
    }

    // Check all services
    const healthChecks = await Promise.allSettled(
      Object.keys(SPIRITUAL_SERVICES).map(async (serviceName) => {
        try {
          const response = await this.request(serviceName, 'health');
          return {
            service: serviceName,
            status: 'healthy',
            data: response.data
          };
        } catch (error) {
          return {
            service: serviceName,
            status: 'unhealthy',
            error: error.message
          };
        }
      })
    );

    return healthChecks.map(result => result.value);
  }
}

// Global client instance
export const spiritualDashboardAPIClient = new SpiritualDashboardAPIClient();

// Add default request interceptor for tracking
spiritualDashboardAPIClient.addRequestInterceptor(async (config) => {
  // Add request timestamp and ID for tracking
  config.headers['X-Request-Time'] = new Date().toISOString();
  config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return config;
});

// Add default response interceptor for logging
spiritualDashboardAPIClient.addResponseInterceptor(async (response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Dashboard API Success: ${response.config.service}/${response.config.endpoint}`, {
      status: response.status,
      service: response.service,
      timestamp: response.timestamp
    });
  }

  return response;
});

// Convenience methods for backward compatibility
export const spiritualAPI = {
  chat: (message, context, model) => 
    spiritualDashboardAPIClient.spiritualChat(message, context, model),
  
  models: () => 
    spiritualDashboardAPIClient.getAvailableModels(),
    
  health: () => 
    spiritualDashboardAPIClient.checkServiceHealth()
};

export const tarotAPI = {
  reading: (question, spreadType, deck) => 
    spiritualDashboardAPIClient.getTarotReading(question, spreadType, deck),
    
  spreads: () => 
    spiritualDashboardAPIClient.getTarotSpreads(),
    
  cards: () => 
    spiritualDashboardAPIClient.getTarotCards()
};

export const astrologyAPI = {
  birthChart: (birthData) => 
    spiritualDashboardAPIClient.generateBirthChart(birthData),
    
  compatibility: (person1, person2) => 
    spiritualDashboardAPIClient.getCompatibility(person1, person2),
    
  planets: (date, time) => 
    spiritualDashboardAPIClient.getPlanetaryPositions(date, time)
};

export const bookChatAPI = {
  query: (question, category, model) => 
    spiritualDashboardAPIClient.queryBooks(question, category, model),
    
  stats: () => 
    spiritualDashboardAPIClient.getBookStats(),
    
  books: () => 
    spiritualDashboardAPIClient.getAvailableBooks()
};

export default spiritualDashboardAPIClient;
