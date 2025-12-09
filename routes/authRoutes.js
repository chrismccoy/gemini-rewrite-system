/**
 * Routes for Login and Logout
 */

const express = require('express');
const router = express.Router();
const config = require('../config/appConfig');

router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/admin/dashboard');
    res.render('login', { error: null });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === config.auth.username && password === config.auth.password) {
        req.session.user = username;
        return res.redirect('/admin/dashboard');
    }

    res.render('login', { error: 'Invalid credentials.' });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
