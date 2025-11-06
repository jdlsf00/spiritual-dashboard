// Knowledge/E-book service API calls
import { ebookClient, apiClient, handleApiError } from './api';

export const knowledgeService = {
  // Search spiritual knowledge base
  async searchKnowledge(query, category = 'all', limit = 20, offset = 0) {
    try {
      const response = await ebookClient.get('/search', {
        params: {
          q: query,
          category,
          limit,
          offset,
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get featured articles
  async getFeaturedArticles() {
    try {
      const response = await ebookClient.get('/featured');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get articles by category
  async getArticlesByCategory(category, limit = 20, offset = 0) {
    try {
      const response = await ebookClient.get('/category', {
        params: {
          category,
          limit,
          offset,
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get article content
  async getArticleContent(articleId) {
    try {
      const response = await ebookClient.get(`/article/${articleId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get available categories
  async getCategories() {
    try {
      const response = await ebookClient.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get related articles
  async getRelatedArticles(articleId, limit = 5) {
    try {
      const response = await ebookClient.get(`/article/${articleId}/related`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get popular tags
  async getPopularTags(limit = 20) {
    try {
      const response = await ebookClient.get('/tags', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get articles by tag
  async getArticlesByTag(tag, limit = 20, offset = 0) {
    try {
      const response = await ebookClient.get('/tag', {
        params: {
          tag,
          limit,
          offset,
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Process uploaded e-book
  async processEbook(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      const response = await ebookClient.post('/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get processing status
  async getProcessingStatus(taskId) {
    try {
      const response = await ebookClient.get(`/process/${taskId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get recently added content
  async getRecentContent(days = 7, limit = 10) {
    try {
      const response = await ebookClient.get('/recent', {
        params: {
          days,
          limit,
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Save article to favorites
  async saveToFavorites(articleId) {
    try {
      const response = await apiClient.post('/favorites', {
        article_id: articleId,
        type: 'knowledge',
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Remove from favorites
  async removeFromFavorites(articleId) {
    try {
      const response = await apiClient.delete(`/favorites/${articleId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get user favorites
  async getFavorites() {
    try {
      const response = await apiClient.get('/favorites');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create reading note
  async createNote(articleId, content, isPrivate = true) {
    try {
      const response = await apiClient.post('/notes', {
        article_id: articleId,
        content,
        is_private: isPrivate,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get article notes
  async getArticleNotes(articleId) {
    try {
      const response = await apiClient.get(`/notes/article/${articleId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update reading progress
  async updateReadingProgress(articleId, progress) {
    try {
      const response = await apiClient.post('/reading-progress', {
        article_id: articleId,
        progress: Math.min(100, Math.max(0, progress)), // Ensure 0-100 range
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get reading statistics
  async getReadingStats() {
    try {
      const response = await apiClient.get('/reading-stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get personalized recommendations
  async getRecommendations(limit = 10) {
    try {
      const response = await apiClient.get('/recommendations', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query hooks for knowledge service
export const useKnowledgeQueries = {
  // Search results query key
  search: (query, category, limit, offset) => ['knowledge', 'search', { query, category, limit, offset }],
  
  // Featured articles query key
  featured: ['knowledge', 'featured'],
  
  // Category articles query key
  categoryArticles: (category, limit, offset) => ['knowledge', 'category', { category, limit, offset }],
  
  // Article content query key
  article: (articleId) => ['knowledge', 'article', articleId],
  
  // Categories query key
  categories: ['knowledge', 'categories'],
  
  // Related articles query key
  related: (articleId, limit) => ['knowledge', 'related', { articleId, limit }],
  
  // Popular tags query key
  tags: (limit) => ['knowledge', 'tags', limit],
  
  // Tag articles query key
  tagArticles: (tag, limit, offset) => ['knowledge', 'tag', { tag, limit, offset }],
  
  // Recent content query key
  recent: (days, limit) => ['knowledge', 'recent', { days, limit }],
  
  // Processing status query key
  processing: (taskId) => ['knowledge', 'processing', taskId],
  
  // Favorites query key
  favorites: ['knowledge', 'favorites'],
  
  // Article notes query key
  notes: (articleId) => ['knowledge', 'notes', articleId],
  
  // Reading stats query key
  readingStats: ['knowledge', 'reading-stats'],
  
  // Recommendations query key
  recommendations: (limit) => ['knowledge', 'recommendations', limit],
};

export default knowledgeService;
