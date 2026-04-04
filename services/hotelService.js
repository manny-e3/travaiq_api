import logger from '../utils/logger.js';
import * as agodaService from './agodaService.js';

const DEFAULT_IMAGE = 'https://img.freepik.com/premium-photo/hotel-room_1048944-29197645.jpg?w=900';

/**
 * Resolve budget string to min/max daily rate.
 */
function budgetToRange(budget) {
    switch ((budget || '').toLowerCase().trim()) {
        case 'low': return { min: 30, max: 1000 };
        case 'medium': return { min: 100, max: 3000 };
        case 'high': return { min: 200, max: 10000 };
        default: return { min: 30, max: 10000 };
    }
}

/**
 * Step 1 — Get city ID from Agoda's suggestion endpoint.
 * Returns the cityId (number) or null.
 */
async function getCityId(location) {
    try {
        const suggestions = await agodaService.getSuggestions(location);
        logger.info(`[getCityId] raw response: ${JSON.stringify(suggestions).substring(0, 200)}...`);

        if (!Array.isArray(suggestions) || suggestions.length === 0) return null;
        return suggestions[0]?.Value ?? null;
    } catch (error) {
        logger.error(`[getCityId] error: ${error.message}`);
        return null;
    }
}

/**
 * Step 2 — Fetch hotels from Agoda's affiliate API.
 * Returns raw Agoda results array or null.
 */
async function fetchAgodaHotels(cityId, checkInDate, checkOutDate, min, max) {
    const criteria = {
        additional: {
            currency: 'USD',
            dailyRate: { maximum: max, minimum: min },
            discountOnly: false,
            language: 'en-us',
            maxResult: 20,
            minimumReviewScore: 0,
            minimumStarRating: 0,
            occupancy: { numberOfAdult: 2, numberOfChildren: 1 },
            sortBy: 'PriceAsc',
        },
        checkInDate,
        checkOutDate,
        cityId,
    };

    try {
        return await agodaService.getHotels(criteria);
    } catch (error) {
        logger.error(`[fetchAgodaHotels] error: ${error.message}`);
        return null;
    }
}

/**
 * Format raw Agoda hotel objects into the shape Laravel expects.
 */
function formatHotels(rawHotels) {
    return rawHotels.map((hotel) => ({
        name: hotel.hotelName ?? 'Unknown Hotel',
        description: `Hotel in ${hotel.hotelName ?? 'Unknown'}`,
        address: 'Address not available',
        rating: hotel.starRating ?? 0,
        price: hotel.dailyRate ?? 0,
        currency: hotel.currency ?? 'USD',
        image_url: hotel.imageURL || DEFAULT_IMAGE,
        amenities: {
            free_wifi: hotel.freeWifi ?? false,
            breakfast_included: hotel.includeBreakfast ?? false,
        },
        location: {
            latitude: hotel.latitude ?? 0,
            longitude: hotel.longitude ?? 0,
        },
        review_score: hotel.reviewScore ?? 0,
        review_count: hotel.reviewCount ?? 0,
        booking_url: hotel.landingURL ?? null,
    }));
}

/**
 * Main entry point — mirrors HotelRecommendationService::getHotelRecommendations()
 *
 * @param {string} location
 * @param {string} checkInDate   YYYY-MM-DD
 * @param {string} checkOutDate  YYYY-MM-DD
 * @param {string} budget        'low' | 'medium' | 'high'
 * @returns {Promise<Array>}
 */
export async function getHotelRecommendations(location, checkInDate, checkOutDate, budget = null, providedCityId = null) {
    const { min, max } = budgetToRange(budget);

    // Normalize location: Take first part (city), remove special chars for better Agoda matching
    const cleanLocation = (location || '')
        .split(',')[0]
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .trim();

    logger.info(`[hotels] Request for location: ${location} (Cleaned to: ${cleanLocation}), providedCityId: ${providedCityId}`);

    let cityId = providedCityId ? parseInt(providedCityId, 10) : null;

    if (!cityId) {
        cityId = await getCityId(cleanLocation);
        if (cityId) cityId = parseInt(cityId, 10);
    }

    if (!cityId || isNaN(cityId)) {
        logger.warn(`[hotels] No valid cityId found for location: ${location}`);
        return [];
    }

    const rawHotels = await fetchAgodaHotels(cityId, checkInDate, checkOutDate, min, max);
    if (!rawHotels || rawHotels.length === 0) {
        logger.warn(`[hotels] No hotels returned from Agoda for cityId: ${cityId}`);
        return [];
    }

    return formatHotels(rawHotels);
}
