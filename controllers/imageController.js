import { getPlacePhotoUrl } from '../services/googlePlacesService.js';
import logger from '../utils/logger.js';

export const getImageUrl = async (req, res) => {
    const location = req.query.location || req.body.location;

    if (!location) {
        return res.status(400).json({ error: 'Location required' });
    }

    try {
        const url = await getPlacePhotoUrl(location);

        if (!url) {
            return res.status(404).json({ error: 'No photo found for this location' });
        }

        return res.json({ url });
    } catch (error) {
        logger.error(`[getImageUrl] Exception: ${error.message}`);
        return res.status(500).json({
            error: 'Failed to retrieve image',
            details: error.message
        });
    }
};
