/**
 * Analytics Module
 * Handles university-wide analytics and reporting
 */
const router = require('express').Router();
const analyticsRoutes = require('./routes/analytics.routes');

router.use('/', analyticsRoutes);

module.exports = router;
