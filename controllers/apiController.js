/**
 * Controller handling JSON API endpoints, primarily used by AJAX in the frontend.
 */

const geminiService = require('../services/geminiService');
const db = require('../repositories/databaseRepository');

class ApiController {

    async rewriteAndDraft(req, res) {
        const { title, link, source, content } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        try {
            const rewrittenHtml = await geminiService.rewriteContent(content);

            const result = db.run(
                `INSERT INTO posts (title, content, original_link, source_name, status) 
                 VALUES (?, ?, ?, ?, 'draft')`,
                title, rewrittenHtml, link, source
            );

            res.status(201).json({ success: true, id: result.lastInsertRowid });
        } catch (error) {
            console.error('[API] Rewrite Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ApiController();
