import logger from '../utils/logger.js';
import { getSuggestions } from '../services/agodaService.js';

// Search function - Searches Agoda API for locations
export const search = async (req, res) => {
    const term = req.query.term || req.body.term;

    if (!term || term.trim() === '') {
        return res.json([]);
    }

    try {
        const data = await getSuggestions(term);
        logger.info(`Agoda API Response: ${JSON.stringify(data).substring(0, 500)}...`);
        return res.json(data);
    } catch (error) {
        logger.error(`Exception caught: ${error.message}`);
        return res.status(500).json({
            error: 'Unable to contact Agoda API',
            message: error.message
        });
    }
};

