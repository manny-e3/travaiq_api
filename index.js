import express from 'express';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', searchRoutes);

// Server listening
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
}); 
