import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import CentralDepartmentManagement from '@/features/admin-management/components/CentralDepartmentManagement';

export default function CentralDepartmentsPage() {
  return (
    <ProtectedRoute>
      <CentralDepartmentManagement />
    </ProtectedRoute>
  );
}
