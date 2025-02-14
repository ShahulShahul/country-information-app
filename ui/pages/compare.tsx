import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Stack, IconButton } from '@mui/material';
import { getCountryByCode } from '../utils/api';
import { Country } from '../types';
import HomeIcon from '@mui/icons-material/Home';

export default function ComparePage() {
  const router = useRouter();
  const { codes } = router.query;
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codes) {
      const fetchCountries = async () => {
        try {
          const countryCodes = (codes as string).split(',');
          const countryPromises = countryCodes.map(code => getCountryByCode(code));
          
          const countriesData = await Promise.all(countryPromises);
          setCountries(countriesData);
        } catch (error) {
          console.error('Failed to fetch countries:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchCountries();
    }
  }, [codes]);


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Compare Countries
      </Typography>
      <IconButton aria-label="delete" onClick={() => router.push('/')} sx={{ my: 2 }}>
        <HomeIcon />
      </IconButton>
      {loading ? (
        <Stack spacing={-2} sx={{ width: "100%" }}>
          {countries.map((item) => (
            <Skeleton key={item.cca2} animation="wave" sx={{ height: 70 }} />
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Flag</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Capital</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Population</TableCell>
                <TableCell>Timezones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.cca2}>
                  <TableCell>
                    <img 
                      src={country.flags.png} 
                      alt={`${country.name.common} flag`} 
                      style={{ width: '50px' }}
                    />
                  </TableCell>
                  <TableCell>{country.name.common}</TableCell>
                  <TableCell>{country.capital?.join(', ') || 'N/A'}</TableCell>
                  <TableCell>{country.region}</TableCell>
                  <TableCell>{country.population.toLocaleString()}</TableCell>
                  <TableCell>{country.timezones.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </Container>
  );
}
