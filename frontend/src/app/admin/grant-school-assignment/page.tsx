'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import SchoolAssignmentManager, { DRD_GRANT_CONFIG } from '@/features/admin-management/components/SchoolAssignmentManager';

export default function GrantSchoolAssignmentPage() {
  return (
    <ProtectedRoute>
      <SchoolAssignmentManager config={DRD_GRANT_CONFIG} />
    </ProtectedRoute>
  );
}
