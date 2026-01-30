'use client';

import AuthenticatedLayout from '@/shared/layouts/AuthenticatedLayout';

export default function MentorApprovalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
