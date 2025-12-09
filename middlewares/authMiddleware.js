/**
 * Enforce authentication on protected routes.
 */

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }

    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    res.redirect('/login');
};

module.exports = { isAuthenticated };
