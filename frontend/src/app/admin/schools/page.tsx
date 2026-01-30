import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import SchoolManagement from '@/features/admin-management/components/SchoolManagement';

export default function SchoolsPage() {
  return (
    <ProtectedRoute>
      <SchoolManagement />
    </ProtectedRoute>
  );
}
