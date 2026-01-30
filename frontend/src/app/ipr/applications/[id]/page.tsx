import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import IprApplicationDetails from '@/features/ipr-management/components/IprApplicationDetails';

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <IprApplicationDetails applicationId={params.id} />
    </ProtectedRoute>
  );
}