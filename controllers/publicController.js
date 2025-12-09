/**
 * Controller for public views.
 */

const db = require('../repositories/databaseRepository');

class PublicController {

    index(req, res) {
        try {
            const items = db.all('SELECT * FROM posts ORDER BY created_at DESC');
            res.render('public/index', { items });
        } catch (error) {
            console.error('[PublicController] Error fetching posts:', error);
            res.render('public/index', { items: [] });
        }
    }
}

module.exports = new PublicController();
