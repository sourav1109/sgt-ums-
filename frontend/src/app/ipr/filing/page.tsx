import React from 'react';
import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import IPRIdeaRequestForm from '@/features/ipr-management/components/IPRIdeaRequestForm';

export default function IPRFilingPage() {
  return (
    <ProtectedRoute>
      <IPRIdeaRequestForm />
    </ProtectedRoute>
  );
}