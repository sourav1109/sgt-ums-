import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import MyIprApplications from '@/features/ipr-management/components/MyIprApplications';

export default function MyApplicationsPage() {
  return (
    <ProtectedRoute>
      <MyIprApplications />
    </ProtectedRoute>
  );
}
