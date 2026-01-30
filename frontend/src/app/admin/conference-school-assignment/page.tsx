'use client';

import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import SchoolAssignmentManager, { DRD_CONFERENCE_CONFIG } from '@/features/admin-management/components/SchoolAssignmentManager';

export default function ConferenceSchoolAssignmentPage() {
  return (
    <ProtectedRoute>
      <SchoolAssignmentManager config={DRD_CONFERENCE_CONFIG} />
    </ProtectedRoute>
  );
}
