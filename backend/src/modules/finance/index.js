/**
 * Finance Module
 * Handles all finance-related functionality
 */

const express = require('express');
const router = express.Router();

// Finance routes
const financeRoutes = require('./routes/finance.routes');

// Mount finance routes
router.use('/', financeRoutes);

module.exports = router;
