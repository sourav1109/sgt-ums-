'use client';

import dynamic from 'next/dynamic';

const ResearchPolicyManagement = dynamic(
  () => import('@/features/admin-management/components/ResearchPolicyManagement'),
  { ssr: false }
);

export default function ResearchPoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ResearchPolicyManagement />
    </div>
  );
}
