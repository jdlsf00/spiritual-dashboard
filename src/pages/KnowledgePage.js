import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  TagIcon,
  HeartIcon,
  LightBulbIcon,
  StarIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const KnowledgePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpenIcon, color: 'spiritual' },
    { id: 'meditation', name: 'Meditation', icon: HeartIcon, color: 'mystical' },
    { id: 'astrology', name: 'Astrology', icon: StarIcon, color: 'cosmic' },
    { id: 'tarot', name: 'Tarot', icon: TagIcon, color: 'mystical' },
    { id: 'mysticism', name: 'Mysticism', icon: LightBulbIcon, color: 'spiritual' },
    { id: 'philosophy', name: 'Philosophy', icon: BookOpenIcon, color: 'cosmic' },
  ];

  // Real API call for spiritual knowledge search
  const searchWisdom = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a question to search for wisdom');
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch('http://localhost:8000/api/book-chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: searchQuery,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          model: 'dolphin-mistral:7b',
          conversation_history: conversationHistory.slice(-6).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: searchQuery,
        category: selectedCategory,
        timestamp: new Date()
      };

      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response || data.answer,
        sources: data.sources || data.book_sources || [],
        model: data.model_used,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, userMessage, aiResponse]);
      setSearchResults(aiResponse);
      setSearchQuery('');
      setIsSearching(false);
    } catch (error) {
      console.error('Wisdom search error:', error);
      alert('Error searching for wisdom. Please try again.');
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      searchWisdom();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="spiritual-card p-8 mystical-glow text-center"
      >
        <BookOpenIcon className="w-16 h-16 text-mystical-400 mx-auto mb-4" />
        <h2 className="text-3xl font-mystical font-bold cosmic-text mb-2">
          Search Spiritual Wisdom
        </h2>
        <p className="text-white/70 text-lg">
          Explore wisdom from 80+ spiritual texts and ancient teachings
        </p>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="spiritual-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Choose Knowledge Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-mystical-400 bg-mystical-500/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <IconComponent className="w-6 h-6 text-mystical-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">
                  {category.name}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="spiritual-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Ask the Ancient Wisdom</h3>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What spiritual wisdom are you seeking? Ask about meditation, life purpose, inner peace, or any spiritual topic..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-mystical-400 focus:outline-none resize-none"
              rows="3"
              disabled={isSearching}
            />
            <div className="absolute bottom-3 right-3 text-white/50 text-xs">
              Press Enter to search • {selectedCategory !== 'all' ? `Searching in: ${categories.find(c => c.id === selectedCategory)?.name}` : 'All categories'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Searching in 80+ spiritual texts including Bhagavad Gita, Tao Te Ching, Buddhist scriptures, and more
            </div>
            <button
              onClick={searchWisdom}
              disabled={isSearching || !searchQuery.trim()}
              className={`spiritual-button inline-flex items-center space-x-2 ${
                !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Search Wisdom</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="spiritual-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Wisdom Journey</h3>
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {conversationHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-mystical-500/20 border border-mystical-400/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {message.type === 'user' ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-mystical-300 font-medium">Your Question</span>
                        {message.category && message.category !== 'all' && (
                          <span className="ml-2 px-2 py-1 bg-mystical-400/30 text-mystical-200 text-xs rounded">
                            {categories.find(c => c.id === message.category)?.name}
                          </span>
                        )}
                      </div>
                      <p className="text-white/90">{message.content}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-3">
                        <LightBulbIcon className="w-5 h-5 text-mystical-400 mr-2" />
                        <span className="text-mystical-300 font-medium">Ancient Wisdom</span>
                        {message.model && (
                          <span className="ml-2 px-2 py-1 bg-white/10 text-white/60 text-xs rounded">
                            {message.model}
                          </span>
                        )}
                      </div>
                      <div className="prose prose-invert max-w-none mb-4">
                        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <h5 className="text-mystical-300 font-medium mb-2 text-sm">Sources:</h5>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-mystical-400/20 text-mystical-200 text-xs rounded"
                              >
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-white/40">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current Search Results */}
      {searchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="spiritual-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <LightBulbIcon className="w-6 h-6 text-mystical-400 mr-2" />
            Latest Wisdom
          </h3>
          <div className="bg-white/5 rounded-lg p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {searchResults.content}
              </p>
            </div>

            {/* Sources */}
            {searchResults.sources && searchResults.sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className="text-mystical-300 font-medium mb-3">Referenced Texts:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {searchResults.sources.map((source, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-mystical-400/20 text-mystical-200 text-sm rounded"
                    >
                      {source}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Welcome Message */}
      {conversationHistory.length === 0 && !searchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="spiritual-card p-8 text-center"
        >
          <div className="text-mystical-400 mb-4">
            <BookOpenIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">
            Welcome to the Wisdom Library
          </h3>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Access profound teachings from over 80 spiritual texts. Ask about meditation, enlightenment, 
            life purpose, inner peace, or any spiritual topic. The ancient wisdom awaits your questions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-mystical-300 font-medium mb-2">Sample Questions:</h4>
              <ul className="text-white/60 space-y-1">
                <li>• "How do I find inner peace?"</li>
                <li>• "What is the meaning of life?"</li>
                <li>• "How to overcome suffering?"</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-mystical-300 font-medium mb-2">Available Texts:</h4>
              <ul className="text-white/60 space-y-1">
                <li>• Bhagavad Gita</li>
                <li>• Tao Te Ching</li>
                <li>• Buddhist Sutras</li>
                <li>• And 75+ more...</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading Animation */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="spiritual-card p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mystical-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Searching Ancient Wisdom...
            </h3>
            <p className="text-white/70">
              Consulting 80+ spiritual texts for your answer
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default KnowledgePage;
