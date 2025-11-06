// Tarot service API calls
import { tarotClient, handleApiError } from './api';

export const tarotService = {
  // Get available tarot decks
  async getDecks() {
    try {
      const response = await tarotClient.get('/decks');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get available spread types
  async getSpreadTypes() {
    try {
      const response = await tarotClient.get('/spreads');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Perform a tarot reading
  async performReading(spreadType = 'single', question = '') {
    try {
      const response = await tarotClient.post('/reading', {
        spread_type: spreadType,
        question: question,
        deck: 'rider_waite',
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get card details by ID
  async getCardDetails(cardId) {
    try {
      const response = await tarotClient.get(`/card/${cardId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get card interpretation
  async getCardInterpretation(cardId, position = 'upright', context = '') {
    try {
      const response = await tarotClient.post('/interpretation', {
        card_id: cardId,
        position: position,
        context: context,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Save reading to history
  async saveReading(reading) {
    try {
      const response = await tarotClient.post('/reading/save', reading);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get reading history
  async getReadingHistory(limit = 10, offset = 0) {
    try {
      const response = await tarotClient.get('/reading/history', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get daily card
  async getDailyCard() {
    try {
      const response = await tarotClient.get('/daily-card');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get card meanings by category
  async getCardMeanings(category = 'all') {
    try {
      const response = await tarotClient.get('/meanings', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Search cards by keyword
  async searchCards(keyword) {
    try {
      const response = await tarotClient.get('/search', {
        params: { q: keyword }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query hooks for tarot service
export const useTarotQueries = {
  // Deck list query key
  decks: ['tarot', 'decks'],
  
  // Spread types query key
  spreads: ['tarot', 'spreads'],
  
  // Reading history query key
  history: (limit, offset) => ['tarot', 'history', { limit, offset }],
  
  // Daily card query key
  dailyCard: (date) => ['tarot', 'daily-card', date],
  
  // Card details query key
  card: (cardId) => ['tarot', 'card', cardId],
  
  // Card meanings query key
  meanings: (category) => ['tarot', 'meanings', category],
  
  // Search results query key
  search: (keyword) => ['tarot', 'search', keyword],
};

export default tarotService;
