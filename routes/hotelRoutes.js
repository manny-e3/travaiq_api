import { Router } from 'express';
import { getHotels, getHotelsPost } from '../controllers/hotelController.js';

const router = Router();

// GET  /api/hotels?location=Paris&checkIn=2026-05-01&checkOut=2026-05-05&budget=medium
router.get('/hotels', getHotels);

// POST /api/hotels  { location, checkIn, checkOut, budget }
router.post('/hotels', getHotelsPost);

export default router;
