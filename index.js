import express from 'express';
import { search } from './controllers/searchController.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Search route for Agoda API
app.get('/api/search', search);

// Server listening
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
}); 
