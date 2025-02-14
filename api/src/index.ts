import express from 'express';
import { errorHandler } from './utils/errorHandler';
import countriesRouter from './routes/countries';
import { config } from 'dotenv';
import cors from 'cors';

const app = express();
config()
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors())

// Routes
app.use('/countries', countriesRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
