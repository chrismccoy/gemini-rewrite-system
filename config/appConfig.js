/**
 * Handles environment variable validation
 */

require('dotenv').config();

const requiredEnv = ['GEMINI_API_KEY', 'SESSION_SECRET', 'ADMIN_USER', 'ADMIN_PASS'];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`[CRITICAL] Missing environment variable: ${key}`);
        process.exit(1);
    }
});

const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
        timeout: 45000
    },
    auth: {
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS
    },
    session: {
        secret: process.env.SESSION_SECRET,
        name: 'sid.curator',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        }
    },
    defaults: {
        systemPrompt: "Rewrite the following RSS feed item into a unique, SEO-friendly blog post. Use HTML headers (h2, h3) and paragraph tags. Do not wrap the response in markdown code blocks."
    }
};

module.exports = Object.freeze(config);
