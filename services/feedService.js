/**
 * Service responsible for RSS feed aggregation, caching, and parsing.
 */

const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const db = require('../repositories/databaseRepository');

class FeedService {
    constructor() {
        this.parser = new Parser();
        this.cache = new NodeCache({ stdTTL: 900 });
        this.CACHE_KEY = 'feeds_aggregate';
    }

    async getAggregatedFeeds(limit = 50, sourceId = null) {
        const cacheKey = sourceId ? `${this.CACHE_KEY}_${sourceId}` : this.CACHE_KEY;

        const cached = this.cache.get(cacheKey);
        if (cached) {
            return cached.slice(0, limit);
        }

        const sourcesSql = sourceId
            ? 'SELECT * FROM feeds WHERE id = ?'
            : 'SELECT * FROM feeds';
        const sources = sourceId ? db.all(sourcesSql, sourceId) : db.all(sourcesSql);

        if (!sources.length) return [];

        const aggregated = [];

        await Promise.all(sources.map(async (src) => {
            try {
                const feed = await this.parser.parseURL(src.url);

                const items = feed.items.slice(0, 10).map(item => ({
                    title: item.title,
                    permalink: item.link,
                    date: new Date(item.pubDate || item.isoDate).getTime() / 1000,
                    content: item.content || item.contentSnippet || '',
                    source: src.title || feed.title
                }));

                aggregated.push(...items);
            } catch (err) {
                console.warn(`[FeedService] Failed to fetch ${src.url}: ${err.message}`);
            }
        }));

        aggregated.sort((a, b) => b.date - a.date);

        this.cache.set(cacheKey, aggregated);

        return aggregated.slice(0, limit);
    }

    isUrlImported(url) {
        const result = db.get('SELECT 1 FROM posts WHERE original_link = ?', url);
        return !!result;
    }

    addFeed(url) {
        const title = new URL(url).hostname;
        db.run('INSERT INTO feeds (title, url) VALUES (?, ?)', title, url);
        this.cache.del(this.CACHE_KEY);
    }

    getAllFeeds() {
        return db.all('SELECT * FROM feeds');
    }

    deleteFeed(id) {
        db.run('DELETE FROM feeds WHERE id = ?', id);
        this.cache.del(this.CACHE_KEY);
    }
}

module.exports = new FeedService();
