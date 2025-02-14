import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get contries from server
export const getCountries = async () => {
  try {
    const response = await api.get('/countries');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch countries');
  }
};

// Function to get contry by country code from server
export const getCountryByCode = async (code: string) => {
  try {
    const response = await api.get(`/countries/country/${code}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch country details');
  }
};

// Function to get contry by region from server
export const getCountriesByRegion = async (region: string) => {
  try {
    const response = await api.get(`/countries/region/${region}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch countries by region');
  }
};

// Function to search contires
export const searchCountries = async (query: string, searchType: string) => {
  try {
    const validSearchTypes = ['name', 'capital', 'region', 'timezone'];
    if (!validSearchTypes.includes(searchType)) {
      return
    }
    const response = await api.get('/countries/search', {
      params: { 
        [searchType]: query || undefined
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to search countries');
  }
};
