'use client';

import { useAuthStore } from '@/shared/auth/authStore';
import ModernStaffDashboard from '@/features/dashboard/components/ModernStaffDashboard';
import LoadingSpinner from '@/shared/ui-components/LoadingSpinner';
import { useEffect } from 'react';
import { logger } from '@/shared/utils/logger';

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    logger.debug('Dashboard - User:', user);
    logger.debug('Dashboard - isLoading:', isLoading);
    logger.debug('Dashboard - userType:', user?.userType);
  }, [user, isLoading]);

  if (isLoading) {
    logger.debug('Dashboard - Showing loading spinner');
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    logger.debug('Dashboard - No user, redirecting...');
    return <LoadingSpinner fullScreen />;
  }

  logger.debug('Dashboard - Rendering for userType:', user.userType);

  // All users (student, faculty, staff, admin) use the same modern dashboard
  return <ModernStaffDashboard />;
}
