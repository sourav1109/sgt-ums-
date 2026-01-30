/**
 * Audit Module
 * Handles audit logging, compliance reports, and activity tracking
 */
const router = require('express').Router();
const auditRoutes = require('./routes/audit.routes');

router.use('/', auditRoutes);

module.exports = router;
