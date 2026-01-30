/**
 * IPR Module
 * Handles all Intellectual Property Rights functionality
 */

const express = require('express');
const router = express.Router();

// IPR routes
const iprRoutes = require('./routes/ipr.routes');
const iprManagementRoutes = require('./routes/iprManagement.routes');

// Mount IPR routes
router.use('/', iprRoutes);
router.use('/management', iprManagementRoutes);

module.exports = router;
