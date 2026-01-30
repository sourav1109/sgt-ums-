/**
 * Grants Module
 * Handles all grant application functionality
 */

const express = require('express');
const router = express.Router();

// Grant routes
const grantRoutes = require('./routes/grant.routes');

// Mount grant routes
router.use('/', grantRoutes);

module.exports = router;
