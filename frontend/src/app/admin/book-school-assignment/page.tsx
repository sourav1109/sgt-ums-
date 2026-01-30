'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import SchoolAssignmentManager, { DRD_BOOK_CONFIG } from '@/features/admin-management/components/SchoolAssignmentManager';

export default function BookSchoolAssignmentPage() {
  return (
    <ProtectedRoute>
      <SchoolAssignmentManager config={DRD_BOOK_CONFIG} />
    </ProtectedRoute>
  );
}
