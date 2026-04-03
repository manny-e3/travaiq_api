import { getHotelRecommendations } from '../services/hotelService.js';

/**
 * GET /api/hotels?location=Paris&checkIn=2026-05-01&checkOut=2026-05-05&budget=medium
 */
export async function getHotels(req, res) {
    const { location, checkIn, checkOut, budget } = req.query;

    if (!location || !checkIn || !checkOut) {
        return res.status(422).json({
            error: 'Missing required query params: location, checkIn, checkOut',
        });
    }

    try {
        const hotels = await getHotelRecommendations(location, checkIn, checkOut, budget || null);
        return res.json({ hotels });
    } catch (err) {
        console.error('[getHotels] error:', err.message);
        return res.status(500).json({ error: err.message || 'Failed to fetch hotels' });
    }
}

/**
 * POST /api/hotels
 * Body: { location, checkIn, checkOut, budget? }
 */
export async function getHotelsPost(req, res) {
    const { location, checkIn, checkOut, budget } = req.body;

    if (!location || !checkIn || !checkOut) {
        return res.status(422).json({
            error: 'Missing required fields: location, checkIn, checkOut',
        });
    }

    try {
        const hotels = await getHotelRecommendations(location, checkIn, checkOut, budget || null);
        return res.json({ hotels });
    } catch (err) {
        console.error('[getHotelsPost] error:', err.message);
        return res.status(500).json({ error: err.message || 'Failed to fetch hotels' });
    }
}
