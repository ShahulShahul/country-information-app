import { useState, useEffect } from 'react';
import { getCountries, getCountriesByRegion, searchCountries } from '../utils/api';
import { useRouter } from 'next/router';


import Container from '@mui/material/Container';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CountryCard from '../components/CountryCard';
import ErrorMessage from '../components/ErrorMessage';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';

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
}

export default function Home() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);


  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('name');
  const [regionFilter, setRegionFilter] = useState<string>('');

  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [allCountries, setAllCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setAllCountries(data);
        setCountries(data.slice(0, visibleCount));
      } catch (err) {
        setError('Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);


  const loadMoreCountries = () => {
    const nextCount = visibleCount + 12;
    setVisibleCount(nextCount);
    setCountries(allCountries.slice(0, nextCount));
  };

  const handleRegionChange = async (e: SelectChangeEvent<string>) => {
    try {
      setLoading(true);
      const data = await getCountriesByRegion(e.target.value);
      setRegionFilter(e.target.value)
      setAllCountries(data);
      setCountries(data.slice(0, visibleCount));
    } catch (err) {
      setError('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  }

  // Time delay for searching
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const handleSearch = async (value: string) => {
    try {
      if (value === searchTerm) return;
      setLoading(true);
      setSearchTerm(value);
      const data = await searchCountries(value, searchType);
      setAllCountries(data);
      setCountries(data.slice(0, visibleCount));
    } catch (err) {
      setError('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  }

  const debouncedHandleSearch = debounce(handleSearch, 300);

  function getCurrentTimeFromOffset(offset: string): string {
    const utcDate = new Date();
    const sign = offset[3] === '+' ? 1 : -1;
    const [hours, minutes] = offset.slice(4).split(':').map(Number);
    const localDate = new Date(utcDate.getTime() + sign * (hours * 60 + minutes) * 60000);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return localDate.toLocaleTimeString('en-US', options);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchType}
                  label="Search By"
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="capital">Capital</MenuItem>
                  <MenuItem value="region">Region</MenuItem>
                  <MenuItem value="timezone">Timezone</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => router.push({
              pathname: '/compare',
              query: { codes: selectedCountries.join(',') }
            })}
            sx={{ height: '56px' }}
            disabled={selectedCountries.length < 2}
          >
            Compare Countries ({selectedCountries.length})
          </Button>

        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Region</InputLabel>
            <Select
              value={regionFilter}
              label="Filter by Region"
              onChange={(e) => handleRegionChange(e)}
            >
              <MenuItem value="">All Regions</MenuItem>
              <MenuItem value="Africa">Africa</MenuItem>
              <MenuItem value="Americas">Americas</MenuItem>
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="Europe">Europe</MenuItem>
              <MenuItem value="Oceania">Oceania</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading && (
        <Grid container spacing={3}>
          {Array.from(new Array(12)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={140} sx={{ mb: 2 }} />
              <Stack mx={2}>
                <Skeleton width="60%" sx={{ mb: 1 }} height={30} />
                <Skeleton width="20%" sx={{ mb: 1 }} />
                <Skeleton width="60%" sx={{ mb: 2.5 }} />
                <Skeleton width="20%" sx={{ mb: 1 }} />
              </Stack>
            </Grid>
          ))}
        </Grid>
      )}
      {error && <ErrorMessage message={error} />}

      <Grid container spacing={3}>
        {
          countries.length > 0 ?
          countries.map((country) => (
              <Grid item xs={12} sm={6} md={4} key={country.name.common}>
                <CountryCard
                  name={country.name.common}
                  flag={country.flags.png}
                  region={country.region}
                  time={getCurrentTimeFromOffset(country.timezones[0])}
                  code={country.cca2}
                  onSelect={(code, selected) => {
                    setSelectedCountries(prev => 
                      selected 
                        ? [...prev, code]
                        : prev.filter(c => c !== code)
                    );
                  }}
                />

              </Grid>
            ))
            :
            <Grid item xs={12} sm={12} md={12} textAlign="center">
              <Typography>No Countries Found..!</Typography>
            </Grid>
        }
      </Grid>

      {
        countries.length > 0 &&
        <Button variant="contained" onClick={loadMoreCountries} sx={{ mt: 4 }}>
          Load More
        </Button>
      }
    </Container>
  );
}
