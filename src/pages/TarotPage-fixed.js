import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  ArrowPathIcon,
  BookOpenIcon,
  HeartIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

const TarotPage = () => {
  const [selectedSpread, setSelectedSpread] = useState('single');
  const [isReading, setIsReading] = useState(false);
  const [currentReading, setCurrentReading] = useState(null);
  const [question, setQuestion] = useState('');

  const spreadTypes = [
    {
      id: 'single',
      name: 'Single Card',
      description: 'Quick daily guidance',
      cards: 1,
    },
    {
      id: 'three',
      name: 'Three Card Spread',
      description: 'Past, Present, Future',
      cards: 3,
    },
    {
      id: 'celtic',
      name: 'Celtic Cross',
      description: 'Comprehensive life reading',
      cards: 10,
    },
  ];

  // Real API call for tarot reading
  const fetchTarotReading = async (spreadType, question = "Please provide spiritual guidance") => {
    setIsReading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/tarot/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          spread_type: spreadType === 'single' ? 'single_card' : 
                      spreadType === 'three' ? 'three_card' : 'celtic_cross',
          model: 'dolphin-mistral:7b'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsReading(false);
      
      return {
        spread: spreadType,
        cards: data.cards || [],
        interpretation: data.interpretation || '',
        insights: data.insights || [],
        reading_id: data.reading_id,
        timestamp: data.generated_at || new Date().toISOString(),
        model_used: data.model_used
      };
    } catch (error) {
      console.error('Tarot reading error:', error);
      setIsReading(false);
      throw error;
    }
  };

  const handleNewReading = async () => {
    if (!question.trim()) {
      alert('Please enter a question for your reading');
      return;
    }
    
    try {
      const reading = await fetchTarotReading(selectedSpread, question);
      setCurrentReading(reading);
    } catch (error) {
      console.error('Error fetching reading:', error);
      alert('Error getting reading. Please try again.');
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
        <SparklesIcon className="w-16 h-16 text-spiritual-400 mx-auto mb-4" />
        <h2 className="text-3xl font-mystical font-bold cosmic-text mb-2">
          Tarot Reading
        </h2>
        <p className="text-white/70 text-lg">
          Seek guidance from the ancient wisdom of the cards
        </p>
      </motion.div>

      {/* Spread Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="spiritual-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Choose Your Spread</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spreadTypes.map((spread) => (
            <button
              key={spread.id}
              onClick={() => setSelectedSpread(spread.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedSpread === spread.id
                  ? 'border-spiritual-400 bg-spiritual-500/20'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
            >
              <div className="text-lg font-medium text-white mb-2">
                {spread.name}
              </div>
              <div className="text-white/60 text-sm mb-3">
                {spread.description}
              </div>
              <div className="flex items-center justify-center space-x-1">
                {Array.from({ length: spread.cards }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-8 bg-spiritual-400/30 rounded border border-spiritual-400/50"
                  />
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Question Input */}
        <div className="mt-6">
          <label htmlFor="question" className="block text-white font-medium mb-2">
            What question would you like guidance on?
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about love, career, spiritual growth, or any aspect of your life..."
            className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-spiritual-400 focus:outline-none resize-none"
            rows="3"
            disabled={isReading}
          />
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleNewReading}
            disabled={isReading || !question.trim()}
            className={`spiritual-button inline-flex items-center space-x-2 ${
              !question.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isReading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Consulting the Cards... (this may take 30 seconds)</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>Draw Cards</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Reading Results */}
      <AnimatePresence>
        {currentReading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Cards Display */}
            <div className="spiritual-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Your Reading
              </h3>
              <div className={`grid gap-6 ${
                currentReading.cards.length === 1 ? 'grid-cols-1 justify-items-center max-w-sm mx-auto' :
                currentReading.cards.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                'grid-cols-2 md:grid-cols-5'
              }`}>
                {currentReading.cards.map((cardData, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.3, duration: 0.6 }}
                    className="bg-gradient-to-br from-spiritual-500/20 to-mystical-500/20 rounded-xl p-6 border border-white/20 text-center hover-lift"
                  >
                    <div className="text-center mb-3">
                      <h5 className="font-semibold text-spiritual-300">{cardData.position}</h5>
                      <p className="text-sm text-white/60">{cardData.card.suit}</p>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {cardData.card.name} {cardData.reversed ? '(Reversed)' : ''}
                    </h4>
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                      {cardData.card.keywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-spiritual-400/30 text-spiritual-200 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="text-spiritual-300 text-sm">
                      {cardData.meaning}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Interpretation */}
            <div className="spiritual-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <LightBulbIcon className="w-6 h-6 text-cosmic-400 mr-2" />
                Spiritual Guidance
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/5 rounded-lg p-6"
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {currentReading.interpretation}
                  </p>
                </div>
                
                {/* Insights */}
                {currentReading.insights && currentReading.insights.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-spiritual-300 mb-3">Key Insights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentReading.insights.map((insight, index) => (
                        <span key={index} className="px-3 py-1 bg-cosmic-500/20 text-cosmic-200 rounded-full text-sm">
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reading Info */}
                <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/50">
                  <p>Reading ID: {currentReading.reading_id}</p>
                  <p>Generated: {new Date(currentReading.timestamp).toLocaleString()}</p>
                  {currentReading.model_used && <p>AI Model: {currentReading.model_used}</p>}
                </div>
              </motion.div>
            </div>

            {/* Save/Share Actions */}
            <div className="spiritual-card p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white">
                  <HeartIcon className="w-5 h-5" />
                  <span>Save Reading</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white">
                  <BookOpenIcon className="w-5 h-5" />
                  <span>Journal Entry</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Animation */}
      <AnimatePresence>
        {isReading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="spiritual-card p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-spiritual-400 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Consulting the Cards...
              </h3>
              <p className="text-white/70">
                The universe is aligning to provide your guidance (up to 30 seconds)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TarotPage;
