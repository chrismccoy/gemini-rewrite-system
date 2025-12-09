/**
 * Service responsible for all interactions with the Google Gemini API.
 * Handles prompt construction, API requests, and errors.
 */

const axios = require('axios');
const config = require('../config/appConfig');
const db = require('../repositories/databaseRepository');

class GeminiService {
    async rewriteContent(content) {
        const systemPrompt = db.getSetting('system_prompt') || config.defaults.systemPrompt;

        const fullPrompt = `${systemPrompt}\n\n[CONTENT START]\n${content}\n[CONTENT END]`;

        try {
            const response = await axios.post(
                `${config.gemini.endpoint}?key=${config.gemini.apiKey}`,
                {
                    contents: [{ parts: [{ text: fullPrompt }] }]
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: config.gemini.timeout
                }
            );

            const candidate = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!candidate) {
                throw new Error('Received empty response from AI Provider');
            }

            return candidate;
        } catch (error) {
            const apiMessage = error.response?.data?.error?.message;
            throw new Error(`AI Service Failure: ${apiMessage || error.message}`);
        }
    }
}

module.exports = new GeminiService();
