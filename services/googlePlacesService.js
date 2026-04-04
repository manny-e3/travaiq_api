import axios from 'axios';
import logger from '../utils/logger.js';

export const getPlacePhotoUrl = async (locationName, maxWidth = 800) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        logger.error('Google Maps API key not found in environment variables');
        throw new Error('API key not provided.');
    }

    try {
        // Step 1: Get place_id from place name
        const findResponse = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
            params: {
                input: locationName,
                inputtype: 'textquery',
                fields: 'place_id',
                key: apiKey,
            }
        });

        if (!findResponse.data.candidates || findResponse.data.candidates.length === 0) {
            logger.warn(`No place_id found for location: ${locationName}`);
            return null;
        }

        const placeId = findResponse.data.candidates[0].place_id;

        // Step 2: Use place_id to get photo_reference
        const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                fields: 'photos',
                key: apiKey,
            }
        });

        if (!detailsResponse.data.result || !detailsResponse.data.result.photos || detailsResponse.data.result.photos.length === 0) {
            logger.warn(`No photo_reference found for place_id: ${placeId} (${locationName})`);
            return null;
        }

        const photoReference = detailsResponse.data.result.photos[0].photo_reference;

        // Step 3: Construct photo URL
        // Note: This URL requires the API key to be appended by the caller or we can return the signed URL
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

        logger.info(`Successfully generated photo URL for ${locationName}`);
        return photoUrl;

    } catch (error) {
        logger.error(`Error in getPlacePhotoUrl for ${locationName}: ${error.message}`);
        throw error;
    }
};
