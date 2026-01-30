'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import GrantIncentivePolicyManagement from '@/features/admin-management/components/GrantIncentivePolicyManagement';

export default function GrantPoliciesPage() {
  return (
    <ProtectedRoute>
      <GrantIncentivePolicyManagement />
    </ProtectedRoute>
  );
}
