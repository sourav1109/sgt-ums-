'use client';

import dynamic from 'next/dynamic';

const BookChapterPolicyManagement = dynamic(
  () => import('@/features/admin-management/components/BookChapterPolicyManagement'),
  { ssr: false }
);

export default function BookChapterPoliciesPage() {
  return <BookChapterPolicyManagement />;
}
