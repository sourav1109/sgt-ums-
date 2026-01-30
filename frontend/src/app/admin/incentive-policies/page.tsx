'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import IncentivePolicyManagement from '@/features/admin-management/components/IncentivePolicyManagement';

export default function IncentivePoliciesPage() {
  return (
    <ProtectedRoute>
      <IncentivePolicyManagement />
    </ProtectedRoute>
  );
}
