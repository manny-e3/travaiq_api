import { Router } from 'express';
import {
    generatePlan,
    getAlternativeActivities,
    getAddActivitySuggestions,
} from '../controllers/aiController.js';

const router = Router();

// Generate a full travel plan via Gemini
router.post('/generate-plan', generatePlan);

// Get alternative activities for a specific activity in an itinerary
router.post('/alternative-activities', getAlternativeActivities);

// Suggest new activities to add to an itinerary
router.get('/add-activity-suggestions', getAddActivitySuggestions);

export default router;
