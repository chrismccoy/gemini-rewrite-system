/**
 * Controller rendering of Admin pages.
 */

const feedService = require('../services/feedService');
const db = require('../repositories/databaseRepository');
const config = require('../config/appConfig');

class AdminController {

    async dashboard(req, res, next) {
        try {
            const sourceId = req.query.source_id ? parseInt(req.query.source_id) : null;

            const items = await feedService.getAggregatedFeeds(50, sourceId);

            const enrichedItems = items.map(item => ({
                ...item,
                isImported: feedService.isUrlImported(item.permalink)
            }));

            const sources = feedService.getAllFeeds();

            res.render('admin/dashboard', {
                title: 'AI Dashboard',
                items: enrichedItems,
                sources,
                currentFilter: sourceId
            });
        } catch (error) {
            next(error);
        }
    }

    feeds(req, res) {
        const feeds = feedService.getAllFeeds();
        res.render('admin/feeds', { title: 'Manage Feeds', feeds });
    }

    createFeed(req, res) {
        const { url } = req.body;
        if (url) {
            feedService.addFeed(url);
        }
        res.redirect('/admin/feeds');
    }

    deleteFeed(req, res) {
        feedService.deleteFeed(req.params.id);
        res.redirect('/admin/feeds');
    }

    settings(req, res) {
        const prompt = db.getSetting('system_prompt');
        res.render('admin/settings', { title: 'AI Settings', prompt });
    }

    updateSettings(req, res) {
        const { prompt } = req.body;
        if (prompt) {
            db.setSetting('system_prompt', prompt);
        }
        res.redirect('/admin/settings');
    }

    resetSettings(req, res) {
        db.setSetting('system_prompt', config.defaults.systemPrompt);
        res.redirect('/admin/settings');
    }

    drafts(req, res) {
        const drafts = db.all('SELECT * FROM posts ORDER BY created_at DESC');
        res.render('admin/drafts', { title: 'Drafts', drafts });
    }

    deleteDraft(req, res) {
        const id = req.params.id;
        if (id) {
            db.deletePost(id);
        }
        res.redirect('/admin/drafts');
    }
}

module.exports = new AdminController();
