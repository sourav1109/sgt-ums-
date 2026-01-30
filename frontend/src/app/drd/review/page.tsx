import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import DrdReviewDashboard from '@/features/ipr-management/components/DrdReviewDashboard';

export default function DrdReviewPage() {
  return (
    <ProtectedRoute>
      <DrdReviewDashboard />
    </ProtectedRoute>
  );
}
