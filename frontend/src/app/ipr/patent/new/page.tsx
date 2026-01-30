import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import IPRIdeaRequestForm from '@/features/ipr-management/components/IPRIdeaRequestForm';

export default function PatentFilingPage() {
  return (
    <ProtectedRoute>
      <IPRIdeaRequestForm />
    </ProtectedRoute>
  );
}
