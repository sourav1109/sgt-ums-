import ProtectedRoute from '@/shared/providers/ProtectedRoute';
import PermissionManagement from '@/features/admin-management/components/PermissionManagement';

export default function PermissionsPage() {
  return (
    <ProtectedRoute>
      <PermissionManagement />
    </ProtectedRoute>
  );
}
