/**
 * Auth Module
 * Handles user authentication, JWT tokens, password management
 */
const router = require('express').Router();
const authRoutes = require('./routes/auth.routes');

router.use('/', authRoutes);

module.exports = router;
