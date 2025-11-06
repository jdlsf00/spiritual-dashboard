/**
 * Unified Spiritual Error Handler for Dashboard
 * 
 * Spiritual-themed error handling system that provides:
 * - Graceful error recovery with mystical messaging
 * - Intelligent retry logic with exponential backoff
 * - Fallback data generation for offline scenarios
 * - Integration with spiritual notification system
 */

// Error Types for Spiritual Context
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication', 
  VALIDATION: 'validation',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  TIMEOUT: 'timeout',
  RATE_LIMIT: 'rate_limit',
  UNKNOWN: 'unknown'
};

// Error Severity Levels
export const ERROR_SEVERITY = {
  LOW: 'low',      // Minor issues, app continues normally
  MEDIUM: 'medium', // Some functionality affected  
  HIGH: 'high',    // Major functionality broken
  CRITICAL: 'critical' // App unusable
};

// Spiritual Error Class
export class SpiritualError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, context = {}) {
    super(message);
    this.name = 'SpiritualError';
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
    this.retryable = this.isRetryable();
    this.spiritualMessage = this.generateSpiritualMessage();
  }

  isRetryable() {
    const retryableTypes = [
      ERROR_TYPES.NETWORK,
      ERROR_TYPES.SERVICE_UNAVAILABLE, 
      ERROR_TYPES.TIMEOUT,
      ERROR_TYPES.RATE_LIMIT
    ];
    return retryableTypes.includes(this.type);
  }

  generateSpiritualMessage() {
    const messages = {
      [ERROR_TYPES.NETWORK]: [
        "The cosmic connection has been temporarily interrupted. 🌌",
        "The spiritual network needs a moment to realign. ✨",
        "Divine signals are encountering interference. 🔮"
      ],
      [ERROR_TYPES.SERVICE_UNAVAILABLE]: [
        "The spiritual guides are temporarily unavailable. 🕯️",
        "Sacred services are in meditation. Please wait. 🧘",
        "The mystical realm is recharging its energy. ⚡"
      ],
      [ERROR_TYPES.TIMEOUT]: [
        "The universe needs more time to process your request. ⏳", 
        "Cosmic wisdom is taking longer than usual to manifest. 🌙",
        "The spiritual servers are contemplating deeply. 💭"
      ],
      [ERROR_TYPES.AUTHENTICATION]: [
        "Your spiritual credentials need renewal. 🔑",
        "The guardians require proper identification. 👤",
        "Access to the sacred realm has been restricted. 🚪"
      ],
      [ERROR_TYPES.VALIDATION]: [
        "The cosmic forces detected an irregularity in your request. ⚠️",
        "Spiritual validation has revealed an inconsistency. 🔍",
        "The universe requires clarification of your intent. ❓"
      ],
      [ERROR_TYPES.RATE_LIMIT]: [
        "You're channeling spiritual energy too quickly. Please pause. 🛑",
        "The cosmos suggests a moment of meditation between requests. 🧘‍♀️",
        "Divine wisdom has limits - please slow your spiritual seeking. ⏸️"
      ]
    };

    const typeMessages = messages[this.type] || [
      "An unexpected disturbance in the spiritual realm has occurred. 🌪️",
      "Unknown energies are affecting the cosmic balance. ⚖️", 
      "The universe is experiencing mysterious fluctuations. 🌊"
    ];

    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }
}

// Fallback Data Generators for Offline Scenarios
const FALLBACK_DATA = {
  models: {
    models: [
      { name: 'dolphin-mistral:7b', size: '4.1GB', modified_at: new Date().toISOString() },
      { name: 'llama2:7b', size: '3.8GB', modified_at: new Date().toISOString() },
      { name: 'codellama:7b', size: '3.9GB', modified_at: new Date().toISOString() }
    ]
  },
  
  tarotReading: {
    cards: [
      {
        position: "Present Situation",
        card: {
          name: "The Star",
          suit: "Major Arcana",
          keywords: ["hope", "inspiration", "guidance"]
        },
        meaning: "A time of healing and renewed hope is upon you. Trust in divine guidance.",
        reversed: false
      }
    ],
    interpretation: "The Star appears to remind you that even in darkness, there is always light. This is a time for healing, hope, and spiritual renewal. Trust that the universe is guiding you toward your highest good.",
    insights: ["spiritual renewal", "divine guidance", "inner peace"],
    reading_id: "offline_" + Date.now(),
    generated_at: new Date().toISOString()
  },

  astrologyChart: {
    chart_data: {
      sun: { sign: "Leo", degree: 15, house: 5 },
      moon: { sign: "Pisces", degree: 22, house: 11 },
      ascendant: { sign: "Virgo", degree: 8 }
    },
    interpretation: "Your Leo sun brings natural leadership and creativity, while your Pisces moon adds intuition and compassion. Your Virgo ascendant provides practical wisdom to ground your spiritual insights.",
    personality_traits: ["creative", "intuitive", "practical", "compassionate"],
    chart_id: "offline_" + Date.now()
  },

  bookQuery: {
    response: "In times of uncertainty, remember that wisdom comes from within. The ancient texts teach us that every challenge is an opportunity for growth. Trust your inner voice and let love guide your decisions.",
    sources: [
      { title: "The Power of Now", author: "Eckhart Tolle", relevance: 0.9 },
      { title: "The Alchemist", author: "Paulo Coelho", relevance: 0.8 }
    ],
    query_id: "offline_" + Date.now()
  },

  spiritualChat: {
    message: "I sense you're seeking guidance during this moment of disconnection. Remember that true wisdom comes from within. Take this quiet moment to connect with your inner self and trust that all answers you seek already reside in your heart. 🙏✨"
  }
};

// Main Error Handler Function
export const handleSpiritualError = async (error, context = {}) => {
  console.log('🔮 Spiritual Error Handler activated:', { error, context });

  // Determine error type and severity
  let errorType = ERROR_TYPES.UNKNOWN;
  let severity = ERROR_SEVERITY.MEDIUM;
  let retryAfter = null;

  // Analyze error to determine type
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    errorType = ERROR_TYPES.NETWORK;
    severity = ERROR_SEVERITY.HIGH;
  } else if (error.message?.includes('timeout') || error.name === 'AbortError') {
    errorType = ERROR_TYPES.TIMEOUT;
    severity = ERROR_SEVERITY.MEDIUM;
  } else if (error.message?.includes('401') || error.message?.includes('403')) {
    errorType = ERROR_TYPES.AUTHENTICATION;
    severity = ERROR_SEVERITY.HIGH;
  } else if (error.message?.includes('400') || error.message?.includes('422')) {
    errorType = ERROR_TYPES.VALIDATION;
    severity = ERROR_SEVERITY.LOW;
  } else if (error.message?.includes('429')) {
    errorType = ERROR_TYPES.RATE_LIMIT;
    severity = ERROR_SEVERITY.MEDIUM;
    retryAfter = 60000; // 1 minute
  } else if (error.message?.includes('503') || error.message?.includes('502')) {
    errorType = ERROR_TYPES.SERVICE_UNAVAILABLE;
    severity = ERROR_SEVERITY.HIGH;
  }

  // Create spiritual error
  const spiritualError = new SpiritualError(
    error.message || 'Unknown spiritual disturbance occurred',
    errorType,
    severity,
    {
      originalError: error,
      component: context.component,
      operation: context.operation,
      timestamp: new Date(),
      ...context
    }
  );

  // Generate fallback data if appropriate
  let fallbackData = null;
  let fallbackAvailable = false;

  if (context.operation && FALLBACK_DATA[context.operation]) {
    fallbackData = FALLBACK_DATA[context.operation];
    fallbackAvailable = true;
  } else if (context.operation === 'fetchModels') {
    fallbackData = FALLBACK_DATA.models;
    fallbackAvailable = true;
  } else if (context.operation === 'fetchTarotReading') {
    fallbackData = FALLBACK_DATA.tarotReading;
    fallbackAvailable = true;
  } else if (context.operation === 'generateChart') {
    fallbackData = FALLBACK_DATA.astrologyChart;
    fallbackAvailable = true;
  } else if (context.operation === 'queryBooks') {
    fallbackData = FALLBACK_DATA.bookQuery;
    fallbackAvailable = true;
  } else if (context.operation === 'spiritualChat') {
    fallbackData = FALLBACK_DATA.spiritualChat;
    fallbackAvailable = true;
  }

  // Calculate retry delay with exponential backoff
  const attempt = context.attempt || 1;
  const baseDelay = retryAfter || 1000;
  const maxDelay = 30000;
  const jitter = Math.random() * 0.3; // 30% jitter
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) * (1 + jitter), maxDelay);

  // Log spiritual error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('🌙 Spiritual Error Details:', {
      type: spiritualError.type,
      severity: spiritualError.severity,
      message: spiritualError.spiritualMessage,
      retryable: spiritualError.retryable,
      context: spiritualError.context,
      fallbackAvailable
    });
  }

  // Return comprehensive error response
  return {
    error: spiritualError,
    retryable: spiritualError.retryable,
    retryAfter: delay,
    fallbackAvailable,
    fallbackData,
    severity: spiritualError.severity,
    spiritualMessage: spiritualError.spiritualMessage
  };
};

// Retry wrapper with spiritual wisdom
export const withSpiritualRetry = async (operation, maxRetries = 3, context = {}) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      const errorResponse = await handleSpiritualError(error, {
        ...context,
        attempt
      });
      
      // Don't retry if not retryable or last attempt
      if (!errorResponse.retryable || attempt === maxRetries) {
        throw errorResponse.error;
      }
      
      // Wait before retrying with spiritual patience
      console.log(`🧘 Taking a moment of spiritual reflection before retry ${attempt}...`);
      await new Promise(resolve => setTimeout(resolve, errorResponse.retryAfter));
    }
  }
  
  throw lastError;
};

// Analytics integration for error tracking
export const logSpiritualError = async (errorResponse) => {
  try {
    // Could integrate with analytics service here
    const errorLog = {
      timestamp: new Date(),
      type: errorResponse.error.type,
      severity: errorResponse.error.severity,
      component: errorResponse.error.context.component,
      operation: errorResponse.error.context.operation,
      retryable: errorResponse.retryable,
      fallbackUsed: errorResponse.fallbackAvailable
    };
    
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Spiritual Error Analytics:', errorLog);
    }
  } catch (err) {
    console.warn('Unable to log spiritual error to analytics:', err);
  }
};

export default {
  SpiritualError,
  ERROR_TYPES,
  ERROR_SEVERITY,
  handleSpiritualError,
  withSpiritualRetry,
  logSpiritualError
};
