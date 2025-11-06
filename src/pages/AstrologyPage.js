import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  GlobeAltIcon,
  CalendarIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const AstrologyPage = () => {
  const [selectedChart, setSelectedChart] = useState('natal');
  const [birthData, setBirthData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);

  const chartTypes = [
    {
      id: 'natal',
      name: 'Natal Chart',
      description: 'Your birth chart and personality insights',
      icon: SunIcon,
    },
    {
      id: 'transit',
      name: 'Current Transits',
      description: 'How current planetary movements affect you',
      icon: StarIcon,
    },
    {
      id: 'compatibility',
      name: 'Compatibility',
      description: 'Synastry with another person',
      icon: MoonIcon,
    },
  ];

  const handleInputChange = (e) => {
    setBirthData({
      ...birthData,
      [e.target.name]: e.target.value
    });
  };

  // Real API call for astrology chart
  const generateChart = async () => {
    if (!birthData.name || !birthData.date || !birthData.time || !birthData.location) {
      alert('Please fill in all birth information');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/api/astrology/birth_chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: birthData.name,
          birth_date: birthData.date,
          birth_time: birthData.time,
          birth_place: birthData.location,
          // Add default coordinates for major cities
          latitude: 40.7128, // Default to NYC, should be geocoded in real app
          longitude: -74.0060
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentChart(data);
      setIsGenerating(false);
    } catch (error) {
      console.error('Chart generation error:', error);
      alert('Error generating chart. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="spiritual-card p-8 cosmic-glow text-center"
      >
        <StarIcon className="w-16 h-16 text-cosmic-400 mx-auto mb-4" />
        <h2 className="text-3xl font-mystical font-bold cosmic-text mb-2">
          Astrology Chart
        </h2>
        <p className="text-white/70 text-lg">
          Discover your cosmic blueprint and celestial influences
        </p>
      </motion.div>

      {/* Chart Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="spiritual-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Chart Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chartTypes.map((chart) => {
            const IconComponent = chart.icon;
            return (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedChart === chart.id
                    ? 'border-cosmic-400 bg-cosmic-500/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                } ${chart.id !== 'natal' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={chart.id !== 'natal'}
              >
                <IconComponent className="w-8 h-8 text-cosmic-400 mx-auto mb-3" />
                <div className="text-lg font-medium text-white mb-2">
                  {chart.name}
                </div>
                <div className="text-white/60 text-sm">
                  {chart.description}
                </div>
                {chart.id !== 'natal' && (
                  <div className="text-cosmic-300 text-xs mt-2">Coming Soon</div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Birth Data Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="spiritual-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Birth Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              <span className="flex items-center">
                <span>Full Name</span>
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={birthData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cosmic-400 focus:outline-none"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Birth Date
              </span>
            </label>
            <input
              type="date"
              name="date"
              value={birthData.date}
              onChange={handleInputChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cosmic-400 focus:outline-none"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <span className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                Birth Time
              </span>
            </label>
            <input
              type="time"
              name="time"
              value={birthData.time}
              onChange={handleInputChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cosmic-400 focus:outline-none"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <span className="flex items-center">
                <GlobeAltIcon className="w-4 h-4 mr-2" />
                Birth Location
              </span>
            </label>
            <input
              type="text"
              name="location"
              value={birthData.location}
              onChange={handleInputChange}
              placeholder="City, Country (e.g., New York, USA)"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cosmic-400 focus:outline-none"
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={generateChart}
            disabled={isGenerating || !birthData.name || !birthData.date || !birthData.time || !birthData.location}
            className={`spiritual-button inline-flex items-center space-x-2 ${
              (!birthData.name || !birthData.date || !birthData.time || !birthData.location) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Calculating Chart... (this may take 30 seconds)</span>
              </>
            ) : (
              <>
                <StarIcon className="w-5 h-5" />
                <span>Generate Chart</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Chart Results */}
      {currentChart && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Chart Overview */}
          <div className="spiritual-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Birth Chart for {currentChart.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-cosmic-300 mb-3">Chart Details</h4>
                <div className="space-y-2 text-sm text-white/80">
                  <p><span className="text-cosmic-200">Birth Date:</span> {currentChart.birth_date}</p>
                  <p><span className="text-cosmic-200">Birth Time:</span> {currentChart.birth_time}</p>
                  <p><span className="text-cosmic-200">Location:</span> {currentChart.birth_place}</p>
                  {currentChart.chart_id && <p><span className="text-cosmic-200">Chart ID:</span> {currentChart.chart_id}</p>}
                </div>
              </div>

              {/* Major Placements */}
              {currentChart.major_placements && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-cosmic-300 mb-3">Major Placements</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(currentChart.major_placements).map(([planet, data]) => (
                      <div key={planet} className="flex justify-between">
                        <span className="text-cosmic-200 capitalize">{planet}:</span>
                        <span className="text-white">
                          {data.sign} {data.degree && `${data.degree}°`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Planetary Positions */}
          {currentChart.planets && currentChart.planets.length > 0 && (
            <div className="spiritual-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Planetary Positions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentChart.planets.map((planet, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-cosmic-300 mb-2">{planet.name}</h4>
                    <div className="text-sm text-white/80">
                      <p><span className="text-cosmic-200">Sign:</span> {planet.sign}</p>
                      {planet.degree && <p><span className="text-cosmic-200">Degree:</span> {planet.degree}°</p>}
                      {planet.house && <p><span className="text-cosmic-200">House:</span> {planet.house}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Astrological Analysis */}
          {currentChart.analysis && (
            <div className="spiritual-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Astrological Analysis</h3>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {currentChart.analysis}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chart Insights */}
          {currentChart.insights && currentChart.insights.length > 0 && (
            <div className="spiritual-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChart.insights.map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart Metadata */}
          {currentChart.generated_at && (
            <div className="spiritual-card p-4">
              <div className="text-sm text-white/50 text-center space-y-1">
                <p>Chart generated: {new Date(currentChart.generated_at).toLocaleString()}</p>
                {currentChart.model_used && <p>AI Model: {currentChart.model_used}</p>}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Loading Animation */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="spiritual-card p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Calculating Your Chart...
            </h3>
            <p className="text-white/70">
              The planets are aligning to reveal your cosmic blueprint
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AstrologyPage;
