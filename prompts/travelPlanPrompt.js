/**
 * Generates the Gemini prompt for travel plan creation.
 * Ported from Laravel's App\Prompts\TravelPlanPrompt::generate()
 */
export function generateTravelPlanPrompt(location, totalDays, traveler, budget, activities, origin = null, travelDate = null) {
    const originText = origin
        ? `Origin: ${origin}`
        : `Origin: User did not specify (Assume major international hubs)`;

    const dateContext = travelDate
        ? `Travel Date: ${travelDate}`
        : `Travel Date: Not specified (Assume generic seasonal info)`;

    return `
You are a travel planning assistant. Generate a travel plan based on the following specifications and return it ONLY as a valid JSON object. Do not include any other text or explanations.

Location: ${location}
${originText}
${dateContext}
Duration: ${totalDays} days
Travelers: ${traveler}
Budget Level: ${budget}
Preferred Activities: ${activities}

Please ensure:
- Generate a complete itinerary for ALL ${totalDays} days of the trip
- Each day in the itinerary includes at least **4 activities** with descriptions, cost, duration, best times, coordinates (latitude, longitude), addresses, phone numbers, websites, and fees.
- Include landmarks and cultural highlights under \`location_overview\`.
- Prices are in the dollar.
- Include comprehensive security advice specific to the location.
- Include recommended flight options from the **Origin** (if provided) or major hubs to ${location}.

Return a JSON object with these exact keys:
{
    "location_overview": {
        "history_and_culture": "string",
        "local_customs_and_traditions": "string",
        "geographic_features_and_climate": "string",
        "historical_events_and_landmarks": [
            {"name": "string", "description": "string", "image_url": "string"}
        ],
        "cultural_highlights": [
            {"name": "string", "description": "string", "image_url": "string"}
        ],
        "security_advice": {
            "overall_safety_rating": "string",
            "emergency_numbers": "string",
            "areas_to_avoid": "string",
            "common_scams": "string",
            "safety_tips": ["string"],
            "health_precautions": "string",
            "local_emergency_facilities": [
                {"name": "string", "address": "string", "phone": "string"}
            ]
        }
    },
    "itinerary": [
        {
            "day": "integer",
            "activities": [
                {
                    "name": "string",
                    "description": "string",
                    "coordinates": "latitude, longitude",
                    "address": "string",
                    "cost": "string",
                    "duration": "string",
                    "best_time": "string",
                    "phone_number": "string",
                    "website": "string",
                    "fee": "string"
                }
            ]
        }
    ],
    "costs": [
        {
            "transportation": [
                {"type": "string", "cost": "string"}
            ],
            "dining": [
                {"category": "string", "cost_range": "string"}
            ]
        }
    ],
    "additional_information": {
        "local_currency": "string",
        "exchange_rate": "string",
        "timezone": "string",
        "weather_forecast": "string (Strict format: 'Min-Max°C / Min-Max°F, Summary'. NO sentences. Example: '20-25°C / 68-77°F, Warm & Sunny')",
        "transportation_options": "string"
    },
    "flight_recommendations": {
        "best_booking_time": "string (e.g. 3 months in advance)",
        "travel_tips": ["string"],
        "recommended_airports": [
            {"name": "string", "code": "string", "distance_to_city": "string"}
        ],
        "airlines": [
            {"name": "string", "typical_price_range": "string", "flight_duration": "string", "notes": "string"}
        ]
    }
}
`.trim();
}

/**
 * Prompt for alternative activity suggestions.
 */
export function generateAlternativesPrompt(location, currentActivityName) {
    return `
You are a travel planning assistant.
The user wants to swap an activity in their itinerary.

Current Activity: "${currentActivityName}"
Location: "${location}"

Please suggest 3 ALTERNATIVE activities in "${location}" that are different from "${currentActivityName}".
For each alternative, provide the name, a brief description, estimated cost, duration, and best time to visit.

Return the response ONLY as a JSON array of objects. Do not include any other text.

Format:
[
    {
        "name": "Activity Name",
        "description": "Brief description...",
        "cost": "Estimated cost (e.g. $20, Free)",
        "duration": "Duration (e.g. 2 hours)",
        "best_time": "Best time (e.g. Morning, 10:00 AM)",
        "address": "Address or area",
        "fee": "Entry fee if applicable",
        "phone_number": "Phone number if available",
        "website": "Website URL if available"
    }
]
`.trim();
}

/**
 * Prompt for adding new activity suggestions.
 */
export function generateAddSuggestionsPrompt(location) {
    return `
You are a travel planning assistant.
The user wants to ADD a new activity to their itinerary in "${location}".

Please suggest 5 INTERESTING and DIVERSE activities in "${location}".
They can be popular landmarks, hidden gems, or cultural experiences.

Return the response ONLY as a JSON array of objects. Do not include any other text.

Format:
[
    {
        "name": "Activity Name",
        "description": "Brief description...",
        "cost": "Estimated cost (e.g. $20, Free)",
        "duration": "Duration (e.g. 2 hours)",
        "best_time": "Best time (e.g. Morning, 10:00 AM)",
        "address": "Address or area",
        "fee": "Entry fee if applicable",
        "phone_number": "Phone number if available",
        "website": "Website URL if available"
    }
]
`.trim();
}
