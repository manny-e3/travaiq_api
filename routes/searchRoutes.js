import express from 'express';
import { search } from '../controllers/searchController.js';

const router = express.Router();

// Search route for Agoda API
router.post('/search', search);

export default router;
