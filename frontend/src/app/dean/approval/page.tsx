import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import DeanApprovalDashboard from '@/features/ipr-management/components/DeanApprovalDashboard';

export default function DeanApprovalPage() {
  return (
    <ProtectedRoute>
      <DeanApprovalDashboard />
    </ProtectedRoute>
  );
}
