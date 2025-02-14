import axios from 'axios';
import NodeCache from 'node-cache';

// Cache
const cache = new NodeCache({ stdTTL: 3600 });
const API_URL = 'https://restcountries.com/v3.1';

// Type defnitions
interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  capital: string[];
  region: string;
  population: number;
  flags: {
    png: string;
    svg: string;
  };
  timezones: string[];
  currencies?: {
    name: string
  }[];
  languages?: string[];
}

interface SearchParams {
  name?: string;
  capital?: string;
  region?: string;
  timezone?: string;
}

// Fn to fetch all countries
const fetchAllCountries = async (): Promise<Country[]> => {
  const cachedData = cache.get('allCountries');
  if (cachedData) {
    return cachedData as Country[];
  }

  const response = await axios.get(`${API_URL}/all`);
  const countries = response.data.map(processCountryData);
  cache.set('allCountries', countries);
  return countries;
};

const getCountries = async (): Promise<Country[]> => {
  return await fetchAllCountries();
};

// Fn to fetch country based on country code
const getCountryByCode = async (code: string): Promise<Country> => {
  const response = await axios.get(`${API_URL}/alpha/${code}`);
  const data = processCountryData(response.data[0]);
  return {
    ...data,
    currencies: response.data[0].currencies ?? [],
    languages: response.data[0].languages ?? [],
  };
};

// Fn to fetch country based on region
const getCountriesByRegion = async (region: string): Promise<Country[]> => {
  const allCountries = await fetchAllCountries();
  return allCountries.filter(country => country.region.toLowerCase() === region.toLowerCase());
};

// Fn to search country based on
/**
 * 
 * @param params 
 * name
 * capital
 * region
 * timezone
 * @returns 
 */
const searchCountries = async (params: SearchParams): Promise<Country[]> => {
  const allCountries = await fetchAllCountries();
  
  return allCountries.filter(country => {
    return (
      (!params.name || country.name.common.toLowerCase().includes(params.name.toLowerCase())) &&
      (!params.capital || country.capital.some(c => c.toLowerCase().includes(params.capital!.toLowerCase()))) &&
      (!params.region || country.region.toLowerCase() === params.region.toLowerCase()) &&
      (!params.timezone || country.timezones.includes(params.timezone))
    );
  });
};

// Fn to process fetched country data
const processCountryData = (data: any): Country => {
  return {
    name: {
      common: data.name.common,
      official: data.name.official,
    },
    cca2: data.cca2,
    capital: data.capital || [],
    region: data.region,
    population: data.population,
    flags: {
      png: data.flags.png,
      svg: data.flags.svg,
    },
    timezones: data.timezones,
  };
};

export { getCountries, getCountryByCode, getCountriesByRegion, searchCountries };
