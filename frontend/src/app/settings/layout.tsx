'use client';

import AuthenticatedLayout from '@/shared/layouts/AuthenticatedLayout';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
