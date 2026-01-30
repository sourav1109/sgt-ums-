/**
 * Notifications Module
 * Handles user notifications, alerts, and messaging
 */
const router = require('express').Router();
const notificationRoutes = require('./routes/notification.routes');

router.use('/', notificationRoutes);

module.exports = router;
