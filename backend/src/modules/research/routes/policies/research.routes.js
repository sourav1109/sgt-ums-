const express = require('express');
const router = express.Router();
const policyController = require('../../controllers/policies/research.policy.controller');
const { protect, restrictTo } = require('../../../../shared/middleware/auth');

// Get all research policies (admin only)
router.get('/', protect, restrictTo('admin'), policyController.getAllPolicies);

// Get applicable policy by publication date (any authenticated user)
router.get('/applicable', protect, policyController.getApplicablePolicyByDate);

// Get active policy by publication type (any authenticated user - for form preview)
router.get('/active/:publicationType', protect, policyController.getPolicyByType);

// Get policy by publication type (any authenticated user)
router.get('/type/:publicationType', protect, policyController.getPolicyByType);

// Create research policy (admin only)
router.post('/', protect, restrictTo('admin'), policyController.createPolicy);

// Update research policy (admin only)
router.put('/:id', protect, restrictTo('admin'), policyController.updatePolicy);

// Delete research policy (admin only)
router.delete('/:id', protect, restrictTo('admin'), policyController.deletePolicy);

module.exports = router;
