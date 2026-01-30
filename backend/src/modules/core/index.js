/**
 * Core Module
 * Handles administrative functions, master data management, and shared services
 * 
 * This module contains:
 * - Dashboard and analytics
 * - User, employee, and student management
 * - School, department, and program management
 * - Permission management
 * - File upload services
 * - Shared business services (email, caching, exports)
 * 
 * @module core
 */
const router = require('express').Router();
const coreRoutes = require('./routes');

router.use('/', coreRoutes);

module.exports = router;
