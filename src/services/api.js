// API configuration and base client
import axios from 'axios';

// Dynamic hostname detection for network access
const getHostname = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'localhost';
};

// Create dynamic API URLs based on current hostname
const createDynamicUrl = (defaultUrl, port) => {
  const hostname = getHostname();
  
  // If accessing via localhost, use localhost URLs
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return defaultUrl;
  }
  
  // For network access, use the current hostname with specified port
  return `http://${hostname}:${port}`;
};

// Environment variables with network-aware fallbacks
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || createDynamicUrl('http://localhost:8000', '8000'),
  TAROT_SERVICE_URL: process.env.REACT_APP_TAROT_SERVICE_URL || createDynamicUrl('http://localhost:7870', '7870'),
  ASTROLOGY_SERVICE_URL: process.env.REACT_APP_ASTROLOGY_SERVICE_URL || createDynamicUrl('http://localhost:7871', '7871'),
  EBOOK_SERVICE_URL: process.env.REACT_APP_EBOOK_SERVICE_URL || createDynamicUrl('http://localhost:7872', '7872'),
  BOOK_CHAT_URL: process.env.REACT_APP_BOOK_CHAT_URL || createDynamicUrl('http://localhost:8002', '8002'),
  SPIRITUAL_API_URL: process.env.REACT_APP_SPIRITUAL_API_URL || createDynamicUrl('http://localhost:8001', '8001'),
  WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || `ws://${getHostname()}:8000/ws`,
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000, // Increased to 30 seconds
};

// Create axios instances for different services
const createApiClient = (baseURL, timeout = API_CONFIG.TIMEOUT) => {
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add authentication token if available
      const token = localStorage.getItem('spiritual_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp
      config.headers['X-Request-Time'] = new Date().toISOString();
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // Log successful responses in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error) => {
      // Handle common errors
      if (error.response) {
        const { status, data } = error.response;
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status,
            data,
            message: error.message,
          });
        }

        // Handle specific error cases
        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('spiritual_auth_token');
            window.location.href = '/login';
            break;
          case 403:
            // Forbidden
            throw new Error('Access denied. Please check your permissions.');
          case 404:
            // Not found
            throw new Error('The requested resource was not found.');
          case 422:
            // Validation error - handle both string and object details
            let validationMessage = 'Validation error occurred.';
            if (data?.detail) {
              if (typeof data.detail === 'string') {
                validationMessage = data.detail;
              } else if (Array.isArray(data.detail)) {
                validationMessage = data.detail.map(err => err.msg || err.message || err).join(', ');
              } else if (data.detail.message) {
                validationMessage = data.detail.message;
              }
            }
            throw new Error(validationMessage);
          case 500:
            // Server error
            throw new Error('Server error. Please try again later.');
          case 503:
            // Service unavailable
            throw new Error('Service temporarily unavailable. Please try again.');
          default:
            // Handle generic errors with better object parsing
            let errorMessage = `Request failed with status ${status}`;
            if (data?.detail) {
              if (typeof data.detail === 'string') {
                errorMessage = data.detail;
              } else if (data.detail.message) {
                errorMessage = data.detail.message;
              }
            } else if (data?.message) {
              errorMessage = data.message;
            }
            throw new Error(errorMessage);
        }
      } else if (error.request) {
        // Network error
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Other error
        throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
  );

  return client;
};

// API clients for different services
export const apiClient = createApiClient(API_CONFIG.BASE_URL);
export const tarotClient = createApiClient(API_CONFIG.TAROT_SERVICE_URL);
export const astrologyClient = createApiClient(API_CONFIG.ASTROLOGY_SERVICE_URL);
export const ebookClient = createApiClient(API_CONFIG.EBOOK_SERVICE_URL);

// WebSocket client
export const createWebSocketClient = () => {
  return new WebSocket(API_CONFIG.WEBSOCKET_URL);
};

// Utility functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Return user-friendly error message
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
};

// Health check function
export const checkServiceHealth = async () => {
  try {
    const healthChecks = await Promise.allSettled([
      apiClient.get('/health'),
      tarotClient.get('/health'),
      astrologyClient.get('/health'),
      ebookClient.get('/health'),
    ]);

    return {
      api: healthChecks[0].status === 'fulfilled',
      tarot: healthChecks[1].status === 'fulfilled',
      astrology: healthChecks[2].status === 'fulfilled',
      ebook: healthChecks[3].status === 'fulfilled',
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      api: false,
      tarot: false,
      astrology: false,
      ebook: false,
    };
  }
};

export default API_CONFIG;
