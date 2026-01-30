'use client';

import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import DrdIprDashboard from '@/features/ipr-management/components/DrdIprDashboard';

export default function DrdIprPage() {
  return (
    <ProtectedRoute>
      <DrdIprDashboard />
    </ProtectedRoute>
  );
}