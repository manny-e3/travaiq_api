import logger from '../utils/logger.js';
import { callGemini } from '../services/geminiService.js';
import {
    generateTravelPlanPrompt,
    generateAlternativesPrompt,
    generateAddSuggestionsPrompt,
} from '../prompts/travelPlanPrompt.js';

/**
 * Validate the AI-generated travel plan.
 * Mirrors the logic in Laravel's TravelController::validateTravelPlan()
 */
function validateTravelPlan(plan, totalDays) {
    const errors = [];

    if (!plan.itinerary || plan.itinerary.length < totalDays) {
        errors.push(
            `Incomplete itinerary: expected ${totalDays} days but received ${plan.itinerary?.length ?? 0} days.`
        );
    }

    (plan.itinerary || []).forEach((dayPlan) => {
        const count = dayPlan.activities?.length ?? 0;
        if (count < 3) {
            errors.push(`Day ${dayPlan.day} has only ${count} activities (minimum 3 required).`);
        }
    });

    const required = ['location_overview', 'costs', 'additional_information'];
    required.forEach((section) => {
        if (!plan[section]) {
            errors.push(`Missing required section: ${section}`);
        }
    });

    if (errors.length > 0) {
        const err = new Error('Travel plan validation failed');
        err.validationErrors = errors;
        throw err;
    }
}

/**
 * POST /api/generate-plan
 * Body: { location, origin?, duration, traveler, budget, activities, travel_date? }
 */
export async function generatePlan(req, res) {
    const { location, origin, duration, traveler, budget, activities, travel_date } = req.body;

    // Basic validation
    if (!location || !duration || !traveler || !budget || !activities) {
        return res.status(422).json({
            error: 'Missing required fields: location, duration, traveler, budget, activities',
        });
    }

    const totalDays = parseInt(duration, 10);
    if (isNaN(totalDays) || totalDays < 1) {
        return res.status(422).json({ error: 'duration must be a positive integer' });
    }

    try {
        const prompt = generateTravelPlanPrompt(
            location,
            totalDays,
            traveler,
            budget,
            activities,
            origin || null,
            travel_date || null
        );

        const plan = await callGemini(prompt);
        validateTravelPlan(plan, totalDays);

        return res.json({ plan });
    } catch (err) {
        if (err.validationErrors) {
            return res.status(422).json({
                error: 'AI plan validation failed',
                details: err.validationErrors,
            });
        }

        logger.error(`[generatePlan] error: ${err.message}`);
        return res.status(500).json({ error: err.message || 'Failed to generate travel plan' });
    }
}

/**
 * POST /api/alternative-activities
 * Body: { location, current_activity }
 */
export async function getAlternativeActivities(req, res) {
    const { location, current_activity } = req.body;

    if (!location || !current_activity) {
        return res.status(422).json({ error: 'Missing required fields: location, current_activity' });
    }

    try {
        const prompt = generateAlternativesPrompt(location, current_activity);
        const alternatives = await callGemini(prompt);
        return res.json({ alternatives });
    } catch (err) {
        logger.error(`[getAlternativeActivities] error: ${err.message}`);
        return res.status(500).json({ error: err.message || 'Failed to get alternatives' });
    }
}

/**
 * GET /api/add-activity-suggestions?location=Paris
 */
export async function getAddActivitySuggestions(req, res) {
    const { location } = req.query;

    if (!location) {
        return res.status(422).json({ error: 'Missing required query param: location' });
    }

    try {
        const prompt = generateAddSuggestionsPrompt(location);
        const suggestions = await callGemini(prompt);
        return res.json({ suggestions });
    } catch (err) {
        logger.error(`[getAddActivitySuggestions] error: ${err.message}`);
        return res.status(500).json({ error: err.message || 'Failed to get suggestions' });
    }
}
