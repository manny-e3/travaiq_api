import axios from 'axios';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Send a prompt to Gemini and get back a parsed JSON object.
 * Strips any markdown code fences the model may add.
 *
 * @param {string} prompt
 * @returns {Promise<object>}
 */
export async function callGemini(prompt) {
    const apiKey = process.env.GOOGLE_GEN_AI_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_GEN_AI_API_KEY is not set in environment variables.');
    }

    const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await axios.post(
        url,
        {
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
        },
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: 120_000, // 2 minutes — Gemini can be slow for large plans
        }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
        throw new Error('Gemini returned an empty response.');
    }

    // Strip ``` json ``` fences that the model sometimes adds
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        throw new Error(`Failed to parse Gemini response as JSON.\nRaw response:\n${cleaned}`);
    }
}
