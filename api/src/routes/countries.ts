import { getCountries, getCountryByCode, getCountriesByRegion, searchCountries } from '../services/countryService';
import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

// Get all countries
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await getCountries();
    res.json(countries);
  } catch (err) {
    next(err);
  }
});

// Get country by code
router.get('/country/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const country = await getCountryByCode(req.params.code);
    res.json(country);
  } catch (err) {
    next(err);
  }
});

// Get countries by region
router.get('/region/:region', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await getCountriesByRegion(req.params.region);
    res.json(countries);
  } catch (err) {
    next(err);
  }
});

// Search countries
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, capital, region, timezone } = req.query;
    const countries = await searchCountries({
      name: name as string,
      capital: capital as string,
      region: region as string,
      timezone: timezone as string,
    });
    res.json(countries);
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
});

export default router;
