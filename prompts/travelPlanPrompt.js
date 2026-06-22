/**
 * Generates the Gemini prompt for travel plan creation.
 * Ported from Laravel's App\Prompts\TravelPlanPrompt::generate()
 */
export function generateTravelPlanPrompt(location, totalDays, traveler, budget, activities, origin = null, travelDate = null, currency = 'local currency', language = 'English') {
    const originText = origin
        ? `Origin: ${origin}`
        : `Origin: User did not specify (Assume major international hubs)`;

    const dateContext = travelDate
        ? `Travel Date: ${travelDate}`
        : `Travel Date: Not specified (Assume generic seasonal info)`;

    return `
You are a travel planning assistant. Generate a professional and exciting travel plan in ${language} based on the following specifications.
Return the result ONLY as a valid JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`). Do not include any other text or explanations.

Location: ${location}
${originText}
${dateContext}
Duration: ${totalDays} days
Travelers: ${traveler}
Budget Level: ${budget}
Preferred Activities: ${activities}
Preferred Currency: ${currency}

Please ensure:
- Generate a complete itinerary for ALL ${totalDays} days of the trip.
- Each day includes at least **4 activities** (Morning, Afternoon, Evening, Night).
- Prices MUST be in ${currency}. If "${currency}" is "local currency", use the official currency of ${location}.
- If a specific piece of information (like a phone number or website) is unknown, return \`null\` instead of a placeholder string.
- Provide descriptive \`image_search_keywords\` instead of \`image_url\`.
- Prices should be formatted as strings including the currency symbol (e.g., "$50" or "€40").
- Include recommended flight options from the **Origin** (if provided) or major hubs to ${location}.
- For **visa_requirements**: if Origin and Location are in the **same country**, set \`required: false\` and \`visa_type: "Not Required - Domestic"\`. If they are in **different countries**, provide accurate visa requirements for travellers from the origin country visiting ${location}.

Return a JSON object with these exact keys:
{
    "location_overview": {
        "history_and_culture": "string",
        "security_advice": {
            "overall_safety_rating": "string (1-10 scale and description)",
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
                    "time_of_day": "Morning | Afternoon | Evening | Night",
                    "name": "string",
                    "description": "string",
                    "coordinates": { "lat": "number", "lng": "number" },
                    "address": "string",
                    "cost": "string",
                    "duration": "string",
                    "best_time": "string",
                    "phone_number": "string | null",
                    "website": "string | null",
                    "fee": "string | null"
                }
            ]
        }
    ],
    "costs": {
        "transportation": [
            {"type": "string", "estimated_cost": "string"}
        ],
        "dining": [
            {"category": "string", "estimated_cost_range": "string"}
        ]
    },
    "additional_information": {
        "local_currency_code": "string (ISO 4217, e.g. USD, EUR, NGN)",
        "exchange_rate_to_usd": "string",
        "timezone": "string",
        "weather_forecast": "string (Format: 'Min-Max°C / Min-Max°F, Summary')",
        "transportation_options": "string"
    },
    "flight_recommendations": {
        "best_booking_time": "string",
        "travel_tips": ["string"],
        "recommended_airports": [
            {"name": "string", "code": "string", "distance_to_city": "string"}
        ],
        "airlines": [
            {"name": "string", "typical_price_range": "string", "flight_duration": "string", "notes": "string"}
        ]
    },
    "visa_requirements": {
        "required": "boolean (true if a visa or entry permit is needed from the origin country, false if visa-free)",
        "visa_type": "string (e.g. 'Visa Free', 'Visa on Arrival', 'e-Visa', 'Tourist Visa', 'Not Required - Domestic')",
        "validity": "string (e.g. '30 days', '90 days', 'N/A')",
        "cost": "string (e.g. 'Free', '$50 USD', 'Varies by nationality')",
        "processing_time": "string (e.g. '3-5 business days', 'On arrival', 'Instant online')",
        "where_to_apply": "string (e.g. 'Apply at https://evisa.gov / Nigerian Embassy', 'No application needed')",
        "documents_required": ["string (e.g. 'Valid passport (6+ months validity)', 'Return ticket', 'Hotel booking proof', 'Bank statement')"],
        "important_notes": "string (key warnings or requirements specific to travellers from the origin country)"
    }
}
`.trim();
}

/**
 * Prompt for alternative activity suggestions.
 */
export function generateAlternativesPrompt(location, currentActivityName, currency = 'local currency', language = 'English') {
    return `
You are a travel planning assistant.
The user wants to swap an activity in their itinerary.

Current Activity: "${currentActivityName}"
Location: "${location}"
Language: ${language}
Currency: ${currency}

Please suggest 3 ALTERNATIVE activities in "${location}" that are different from "${currentActivityName}".
For each alternative, provide the name, a brief description, estimated cost, duration, and best time to visit.

Return the response ONLY as a JSON array of objects wrapped in a markdown code block.

Format:
[
    {
        "name": "Activity Name",
        "description": "Brief description...",
        "cost": "Estimated cost in ${currency}",
        "duration": "Duration (e.g. 2 hours)",
        "best_time": "Best time (e.g. Morning)",
        "address": "Address or area",
        "fee": "Entry fee if applicable",
        "phone_number": "Phone number or null",
        "website": "Website URL or null"
    }
]
`.trim();
}

/**
 * Prompt for adding new activity suggestions.
 */
export function generateAddSuggestionsPrompt(location, currency = 'local currency', language = 'English') {
    return `
You are a travel planning assistant.
The user wants to ADD a new activity to their itinerary in "${location}".
Language: ${language}
Currency: ${currency}

Please suggest 5 INTERESTING and DIVERSE activities in "${location}".
They can be popular landmarks, hidden gems, or cultural experiences.

Return the response ONLY as a JSON array of objects wrapped in a markdown code block.

Format:
[
    {
        "name": "Activity Name",
        "description": "Brief description...",
        "cost": "Estimated cost in ${currency}",
        "duration": "Duration (e.g. 2 hours)",
        "best_time": "Best time (e.g. Morning)",
        "address": "Address or area",
        "fee": "Entry fee if applicable",
        "phone_number": "Phone number or null",
        "website": "Website URL or null"
    }
]
`.trim();
}

