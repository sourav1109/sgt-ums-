import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import FinanceDashboard from '@/features/ipr-management/components/FinanceDashboard';

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <FinanceDashboard />
    </ProtectedRoute>
  );
}
