'use client';

import AuthenticatedLayout from '@/shared/layouts/AuthenticatedLayout';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
