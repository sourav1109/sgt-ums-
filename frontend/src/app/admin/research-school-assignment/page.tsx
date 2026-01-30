'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import SchoolAssignmentManager, { DRD_RESEARCH_CONFIG } from '@/features/admin-management/components/SchoolAssignmentManager';

export default function ResearchSchoolAssignmentPage() {
  return (
    <ProtectedRoute>
      <SchoolAssignmentManager config={DRD_RESEARCH_CONFIG} />
    </ProtectedRoute>
  );
}
