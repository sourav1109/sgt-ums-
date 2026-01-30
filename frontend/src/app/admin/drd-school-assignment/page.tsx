'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import SchoolAssignmentManager, { DRD_MEMBER_CONFIG } from '@/features/admin-management/components/SchoolAssignmentManager';

export default function DrdSchoolAssignmentPage() {
  return (
    <ProtectedRoute>
      <SchoolAssignmentManager config={DRD_MEMBER_CONFIG} />
    </ProtectedRoute>
  );
}
