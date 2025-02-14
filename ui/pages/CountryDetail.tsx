import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getCountryByCode } from '../utils/api';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ErrorMessage from '../components/ErrorMessage';
import { IconButton, Skeleton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

interface CountryDetails {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  region: string;
  population: number;
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  languages?: {
    [key: string]: {
      common: string;
      official: string;
    };
  };
  timezones: string[];
}

export default function CountryDetail() {
  const router = useRouter();
  const { code } = router.query;
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        if (code) {
          const countryCode = Array.isArray(code) ? code[0] : code;
          const data = await getCountryByCode(countryCode);
          setCountry(data);
        }
      } catch (err) {
        setError('Failed to fetch country details');
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3} mt={10}>
          <Grid item xs={12} md={6}>
            <Skeleton width="60%" sx={{ mb: 1 }} height={50} />
            <Skeleton variant="rectangular" height={220} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width="40%" sx={{ mb: 1 }} height={50} />
            <Skeleton sx={{ mb: 2 }} height={20} />
            <Skeleton sx={{ mb: 2 }} height={20} />
            <Skeleton sx={{ mb: 2 }} height={20} />
            <Skeleton sx={{ mb: 2 }} height={20} />
            <Skeleton sx={{ mb: 2 }} height={20} />
            <Skeleton sx={{ mb: 2 }} height={20} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!country) {
    return null;
  }

  return (
    !loading && (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <IconButton aria-label="delete" onClick={() => router.push('/')} sx={{ my: 2 }}>
          <HomeIcon />
        </IconButton>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {country.name.common}
              </Typography>
              <img src={country.flags.png} alt={`${country.name.common} flag`} style={{ maxWidth: '100%' }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Country Details
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Official Name:</strong> {country.name.official}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Region:</strong> {country.region}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Population:</strong> {country.population.toLocaleString()}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Currencies:</strong>
                {country.currencies ? Object.values(country.currencies).map(currency => currency.name).join(', ') : 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Languages:</strong>
                {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Timezones:</strong> {country.timezones.join(', ')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    ));
}