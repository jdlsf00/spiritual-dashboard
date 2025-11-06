// Astrology service API calls
import { astrologyClient, handleApiError } from './api';

export const astrologyService = {
  // Generate natal chart
  async generateNatalChart(birthData) {
    try {
      const response = await astrologyClient.post('/natal-chart', {
        birth_date: birthData.date,
        birth_time: birthData.time,
        birth_location: birthData.location,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get current planetary transits
  async getCurrentTransits(natalChart = null) {
    try {
      const response = await astrologyClient.post('/transits', {
        natal_chart: natalChart,
        date: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get daily horoscope
  async getDailyHoroscope(sign, date = null) {
    try {
      const response = await astrologyClient.get('/horoscope/daily', {
        params: {
          sign: sign.toLowerCase(),
          date: date || new Date().toISOString().split('T')[0],
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get planetary positions
  async getPlanetaryPositions(date = null, location = null) {
    try {
      const response = await astrologyClient.post('/planetary-positions', {
        date: date || new Date().toISOString(),
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get house information
  async getHouseInfo(natalChart) {
    try {
      const response = await astrologyClient.post('/houses', {
        natal_chart: natalChart,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get aspect analysis
  async getAspectAnalysis(natalChart) {
    try {
      const response = await astrologyClient.post('/aspects', {
        natal_chart: natalChart,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get compatibility analysis (synastry)
  async getCompatibilityAnalysis(person1Chart, person2Chart) {
    try {
      const response = await astrologyClient.post('/compatibility', {
        person1: person1Chart,
        person2: person2Chart,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get lunar phase information
  async getLunarPhase(date = null) {
    try {
      const response = await astrologyClient.get('/lunar-phase', {
        params: {
          date: date || new Date().toISOString().split('T')[0],
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get retrograde planets
  async getRetrogradePlanets(date = null) {
    try {
      const response = await astrologyClient.get('/retrograde', {
        params: {
          date: date || new Date().toISOString().split('T')[0],
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Geocode location (convert address to coordinates)
  async geocodeLocation(address) {
    try {
      const response = await astrologyClient.get('/geocode', {
        params: { address }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get zodiac sign information
  async getZodiacSignInfo(sign) {
    try {
      const response = await astrologyClient.get(`/zodiac/${sign.toLowerCase()}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get planet information
  async getPlanetInfo(planet) {
    try {
      const response = await astrologyClient.get(`/planet/${planet.toLowerCase()}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Save chart to user profile
  async saveChart(chartData, name = 'My Chart') {
    try {
      const response = await astrologyClient.post('/chart/save', {
        ...chartData,
        name: name,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get saved charts
  async getSavedCharts() {
    try {
      const response = await astrologyClient.get('/chart/saved');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query hooks for astrology service
export const useAstrologyQueries = {
  // Natal chart query key
  natalChart: (birthData) => ['astrology', 'natal-chart', birthData],
  
  // Transits query key
  transits: (date, natalChart) => ['astrology', 'transits', { date, natalChart }],
  
  // Daily horoscope query key
  dailyHoroscope: (sign, date) => ['astrology', 'horoscope', sign, date],
  
  // Planetary positions query key
  planetaryPositions: (date, location) => ['astrology', 'planetary-positions', { date, location }],
  
  // Houses query key
  houses: (natalChart) => ['astrology', 'houses', natalChart],
  
  // Aspects query key
  aspects: (natalChart) => ['astrology', 'aspects', natalChart],
  
  // Compatibility query key
  compatibility: (chart1, chart2) => ['astrology', 'compatibility', { chart1, chart2 }],
  
  // Lunar phase query key
  lunarPhase: (date) => ['astrology', 'lunar-phase', date],
  
  // Retrograde planets query key
  retrograde: (date) => ['astrology', 'retrograde', date],
  
  // Zodiac sign info query key
  zodiacSign: (sign) => ['astrology', 'zodiac', sign],
  
  // Planet info query key
  planet: (planet) => ['astrology', 'planet', planet],
  
  // Saved charts query key
  savedCharts: ['astrology', 'saved-charts'],
};

export default astrologyService;
