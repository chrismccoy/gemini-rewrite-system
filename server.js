/**
 * Gemini Rewrite System
 */

const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const config = require('./config/appConfig');

const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session(config.session));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', publicRoutes);
app.use('/', authRoutes);

app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

app.use((req, res, next) => {
    res.status(404).render('public/404', { title: '404 - Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error('[Unhandled App Error]', err);
    res.status(500).send('Internal Server Error. Please check server logs.');
});

app.listen(config.port, () => {
    console.log(`\n==================================================`);
    console.log(`   Unified RSS Curator`);
    console.log(`==================================================`);
    console.log(`   🚀 Server running on port ${config.port}`);
    console.log(``);
    console.log(`   🌍 Public Feed:     http://localhost:${config.port}`);
    console.log(`   🤖 Admin Dashboard: http://localhost:${config.port}/admin/dashboard`);
    console.log(``);
    console.log(`   🔒 Auth User:       ${config.auth.username}`);
    console.log(`==================================================\n`);
});
