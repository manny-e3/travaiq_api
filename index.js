import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { search } from './controllers/searchController.js';
import aiRoutes from './routes/aiRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import { requireApiKey } from './middlewares/authMiddleware.js';

const app = express();

// Middleware

// Specific origins (uncomment for production)
// const allowedOrigins = [
//   'http://localhost:5173',  // Vite dev server
//   'http://localhost:3000',  // local front-end
//   'https://your-frontend-domain.com', // production — update this
// ];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`CORS blocked: origin ${origin} not allowed`));
//     }
//   },
//   credentials: true,
// }));

app.use(cors()); // Allow all origins (development)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging via Morgan and Winston
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Routes
app.get('/', (req, res) => {
  res.send('Travaiq API — running');
});

// Location search (Agoda) - OPEN TO BROWSER
app.get('/api/search', search);

// PRIVATE ROUTES - TEMPORARILY DISABLED SECURITY FOR TESTING
// AI travel plan generation (Gemini)
app.use('/api', aiRoutes);

// Agoda hotel recommendations
app.use('/api', hotelRoutes);

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Travaiq API listening on port ${PORT}`);
});
