'use client';

import AuthenticatedLayout from '@/shared/layouts/AuthenticatedLayout';

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
