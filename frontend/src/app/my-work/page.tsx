'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Lightbulb, 
  Copyright, 
  Palette, 
  Briefcase,
  BookOpen, 
  Presentation, 
  DollarSign,
  Plus, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  UserCheck,
  TrendingUp,
  Award,
  Coins,
  Calendar,
} from 'lucide-react';
import { iprService } from '@/features/ipr-management/services/ipr.service';
import { researchService, ResearchContribution } from '@/features/research-management/services/research.service';
import { useAuthStore } from '@/shared/auth/authStore';
import { logger } from '@/shared/utils/logger';

const IPR_TYPES = [
  { type: 'patent', label: 'Patent', icon: Lightbulb, color: 'bg-blue-500', description: 'Protect your inventions', href: '/ipr/apply?type=patent' },
  { type: 'copyright', label: 'Copyright', icon: Copyright, color: 'bg-green-500', description: 'Protect creative works', href: '/ipr/apply?type=copyright' },
  { type: 'design', label: 'Design', icon: Palette, color: 'bg-purple-500', description: 'Protect visual designs', href: '/ipr/apply?type=design' },
  { type: 'entrepreneurship', label: 'Entrepreneurship', icon: Briefcase, color: 'bg-orange-500', description: 'Business ideas', href: '/ipr/apply?type=entrepreneurship' },
];

const RESEARCH_TYPES = [
  { type: 'research_paper', label: 'Research Paper', icon: FileText, color: 'bg-blue-500', description: 'Journal articles', href: '/research/apply?type=research_paper' },
  { type: 'book', label: 'Book / Chapter', icon: BookOpen, color: 'bg-green-500', description: 'Books and chapters', href: '/research/apply?type=book' },
  { type: 'conference_paper', label: 'Conference', icon: Presentation, color: 'bg-purple-500', description: 'Conference papers', href: '/research/apply?type=conference_paper' },
  { type: 'grant_proposal', label: 'Grant / Funding', icon: DollarSign, color: 'bg-orange-500', description: 'Research grants', href: '/research/apply-grant' },
];

const IPR_STATUS_CONFIG = {
  draft: { label: 'Draft', icon: Edit, color: 'text-gray-600 bg-gray-100' },
  pending_mentor_approval: { label: 'Pending Mentor', icon: UserCheck, color: 'text-orange-600 bg-orange-100' },
  submitted: { label: 'Submitted', icon: Clock, color: 'text-blue-600 bg-blue-100' },
  under_drd_review: { label: 'DRD Review', icon: Eye, color: 'text-yellow-600 bg-yellow-100' },
  drd_approved: { label: 'DRD Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  under_dean_review: { label: 'Dean Review', icon: Eye, color: 'text-purple-600 bg-purple-100' },
  dean_approved: { label: 'Dean Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  published: { label: 'Published', icon: CheckCircle, color: 'text-indigo-600 bg-indigo-100' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' },
};

const RESEARCH_STATUS_CONFIG = {
  draft: { label: 'Draft', icon: FileText, color: 'text-gray-600 bg-gray-100' },
  pending_mentor_approval: { label: 'Pending Mentor', icon: UserCheck, color: 'text-orange-600 bg-orange-100' },
  submitted: { label: 'Submitted', icon: Clock, color: 'text-blue-600 bg-blue-100' },
  under_review: { label: 'Under Review', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  changes_required: { label: 'Changes Required', icon: AlertCircle, color: 'text-orange-600 bg-orange-100' },
  resubmitted: { label: 'Resubmitted', icon: Clock, color: 'text-blue-600 bg-blue-100' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-indigo-600 bg-indigo-100' },
};

export default function MyWorkDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ipr' | 'research'>('ipr');
  const [iprApplications, setIprApplications] = useState<any[]>([]);
  const [researchContributions, setResearchContributions] = useState<ResearchContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingMentorCount, setPendingMentorCount] = useState(0);
  
  const [iprStats, setIprStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalIncentives: 0,
    totalPoints: 0,
  });
  
  const [researchStats, setResearchStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalIncentives: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch IPR data
      const iprData = await iprService.getMyApplications().catch(() => ({ data: [] }));
      const validIprApps = (iprData.data || iprData || []).filter((app: any) => app && app.id);
      setIprApplications(validIprApps);
      
      // Fetch Research data
      const [myContribRes, contributedRes] = await Promise.all([
        researchService.getMyContributions().catch(() => ({ success: false, data: { contributions: [] } })),
        researchService.getContributedResearch().catch(() => ({ success: false, data: [] }))
      ]);
      
      logger.debug('My Contributions Response:', myContribRes);
      logger.debug('Contributed Response:', contributedRes);
      
      // Handle API response format: { success: true, data: { contributions: [...] } }
      const myContributions = myContribRes?.data?.contributions || myContribRes?.data?.myContributions || [];
      const contributed = contributedRes?.data?.contributions || contributedRes?.data || [];
      
      logger.debug('Processed myContributions:', myContributions);
      logger.debug('Processed contributed:', contributed);
      
      setResearchContributions(Array.isArray(myContributions) ? myContributions : []);
      
      // Fetch mentor pending count
      try {
        const mentorData = await iprService.getPendingMentorApprovals();
        setPendingMentorCount(mentorData?.length || 0);
      } catch (error) {
        // Not a mentor
      }
      
      // Calculate IPR stats
      const iprCompletedStatuses = ['drd_approved', 'dean_approved', 'published', 'completed'];
      const iprCompletedApps = validIprApps.filter((app: any) => iprCompletedStatuses.includes(app.status));
      
      setIprStats({
        total: validIprApps.length,
        pending: validIprApps.filter((app: any) => 
          ['submitted', 'under_drd_review', 'under_dean_review', 'pending_mentor_approval'].includes(app.status)
        ).length,
        approved: iprCompletedApps.length,
        totalIncentives: iprCompletedApps.reduce((sum: number, app: any) => sum + (Number(app.incentiveAmount) || 0), 0),
        totalPoints: iprCompletedApps.reduce((sum: number, app: any) => sum + (Number(app.pointsAwarded) || 0), 0),
      });
      
      // Calculate Research stats
      const allContribs = [...myContributions, ...contributed.filter(
        (c: ResearchContribution) => !myContributions.some((m: ResearchContribution) => m.id === c.id)
      )];
      
      const researchCompletedStatuses = ['approved', 'completed'];
      const researchCompletedContribs = allContribs.filter((c: ResearchContribution) => 
        researchCompletedStatuses.includes(c.status)
      );
      
      setResearchStats({
        total: myContributions.length,
        pending: myContributions.filter((c: ResearchContribution) => 
          ['submitted', 'under_review', 'resubmitted', 'changes_required', 'pending_mentor_approval'].includes(c.status)
        ).length,
        approved: myContributions.filter((c: ResearchContribution) => 
          researchCompletedStatuses.includes(c.status)
        ).length,
        totalIncentives: researchCompletedContribs.reduce((sum: number, c: ResearchContribution) => 
          sum + (Number(c.incentiveAmount) || 0), 0
        ),
        totalPoints: researchCompletedContribs.reduce((sum: number, c: ResearchContribution) => 
          sum + (Number(c.pointsAwarded) || 0), 0
        ),
      });
      
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIprApplications = iprApplications.filter(app => 
    app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResearchContributions = researchContributions.filter(contrib => 
    contrib.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contrib.journalName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIprStatusInfo = (status: string) => {
    return IPR_STATUS_CONFIG[status as keyof typeof IPR_STATUS_CONFIG] || IPR_STATUS_CONFIG.draft;
  };

  const getResearchStatusInfo = (status: string) => {
    return RESEARCH_STATUS_CONFIG[status as keyof typeof RESEARCH_STATUS_CONFIG] || RESEARCH_STATUS_CONFIG.draft;
  };

  const combinedStats = {
    total: iprStats.total + researchStats.total,
    pending: iprStats.pending + researchStats.pending,
    approved: iprStats.approved + researchStats.approved,
    totalIncentives: iprStats.totalIncentives + researchStats.totalIncentives,
    totalPoints: iprStats.totalPoints + researchStats.totalPoints,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white pt-20 pb-12 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50/80 via-purple-50/50 to-transparent dark:from-blue-950/20 dark:via-[#0f172a]/50 dark:to-[#0f172a]"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-400/20 dark:bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-cyan-300/20 dark:bg-cyan-900/10 rounded-full blur-[80px] animate-pulse delay-500 hidden md:block"></div>

        {/* Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-40 dark:opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Futuristic Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/80 dark:bg-blue-500/10 rounded-2xl border border-indigo-100 dark:border-blue-500/20 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
                <Briefcase className="w-7 h-7 text-indigo-600 dark:text-blue-400" />
              </div>
              <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-white dark:via-blue-100 dark:to-blue-200 py-2">
                My Work
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              Your centralized hub for <span className="text-indigo-600 dark:text-indigo-400 font-bold">Innovation</span> & <span className="text-purple-600 dark:text-purple-400 font-bold">Research</span> impact.
            </p>
          </div>
          
          <div className="flex gap-4">
            {user?.userType === 'faculty' && pendingMentorCount > 0 && (
              <Link 
                href="/mentor-approvals"
                className="group relative px-6 py-3 bg-white dark:bg-red-500/10 border border-red-100 dark:border-red-500/30 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-lg shadow-red-500/5 hover:shadow-red-500/20 hover:-translate-y-0.5"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <UserCheck className="w-5 h-5 text-red-500 dark:text-red-400 relative z-10" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping z-20"></span>
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-[10px] text-red-600 dark:text-red-300 font-bold uppercase tracking-wider">Action Required</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-red-100 group-hover:text-red-600 dark:group-hover:text-red-50">{pendingMentorCount} Pending approvals</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Vibrant Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {[
            { label: 'Submissions', value: combinedStats.total, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/60 dark:bg-white/5', border: 'border-blue-100 dark:border-blue-500/20', shadow: 'shadow-blue-500/10' },
            { label: 'Pending', value: combinedStats.pending, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/60 dark:bg-white/5', border: 'border-amber-100 dark:border-amber-500/20', shadow: 'shadow-amber-500/10' },
            { label: 'Approved', value: combinedStats.approved, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/60 dark:bg-white/5', border: 'border-emerald-100 dark:border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
            { label: 'Incentives', value: `₹${combinedStats.totalIncentives.toLocaleString()}`, icon: Coins, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50/60 dark:bg-white/5', border: 'border-cyan-100 dark:border-cyan-500/20', shadow: 'shadow-cyan-500/10' },
            { label: 'Points', value: combinedStats.totalPoints, icon: Award, color: 'text-fuchsia-600 dark:text-violet-400', bg: 'bg-fuchsia-50/60 dark:bg-white/5', border: 'border-fuchsia-100 dark:border-violet-500/20', shadow: 'shadow-fuchsia-500/10' },
          ].map((stat, dx) => (
            <div key={dx} className={`relative overflow-hidden ${stat.bg} backdrop-blur-xl border ${stat.border} rounded-2xl p-5 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 group shadow-lg ${stat.shadow} hover:-translate-y-1`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <stat.icon className={`w-16 h-16 ${stat.color}`} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <div className={`p-1.5 rounded-lg bg-white dark:bg-white/10 shadow-sm ${stat.color.replace('text-', 'bg-').replace('-600', '-50').replace('dark:text-', 'dark:bg-').replace('-400', '-500/20')}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Interface Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none">
              <button
                onClick={() => setActiveTab('ipr')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  activeTab === 'ipr' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeTab === 'ipr' ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10 group-hover:bg-white group-hover:shadow-sm'}`}>
                  <Lightbulb className={`w-5 h-5 ${activeTab === 'ipr' ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600'}`} />
                </div>
                <div className="flex-1 text-left font-bold">IPR</div>
                <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${activeTab === 'ipr' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>{iprStats.total}</span>
              </button>
              
              <button
                onClick={() => setActiveTab('research')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 mt-2 group ${
                  activeTab === 'research' 
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeTab === 'research' ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10 group-hover:bg-white group-hover:shadow-sm'}`}>
                  <FileText className={`w-5 h-5 ${activeTab === 'research' ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-purple-600'}`} />
                </div>
                <div className="flex-1 text-left font-bold">Research</div>
                <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${activeTab === 'research' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>{researchStats.total}</span>
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus className="w-3 h-3" /> Quick Create
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(activeTab === 'ipr' ? IPR_TYPES : RESEARCH_TYPES).slice(0, 4).map((type) => (
                  <Link
                    key={type.type}
                    href={type.href}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-indigo-200 dark:hover:border-white/20 hover:shadow-md transition-all text-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`relative p-2.5 rounded-xl ${type.color.replace('bg-', 'bg-opacity-10 text-').replace('text-', 'text-opacity-100')} mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <span className="relative text-[10px] font-bold text-slate-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-white line-clamp-1">{type.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main List Area */}
          <div className="flex-1">
             {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors relative z-10" />
                <input
                  type="text"
                  placeholder="Search by title, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="relative z-10 w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
                />
              </div>
              <Link
                href={activeTab === 'ipr' ? '/ipr/apply' : '/research/apply'}
                className="relative overflow-hidden px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:shadow-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white">
                  <Plus className="w-5 h-5" />
                  New Filing
                </span>
              </Link>
            </div>

            {/* Scrollable list content */}
            <div className="space-y-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center text-slate-400 dark:text-gray-400">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-100 dark:border-white/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="mt-4 font-medium animate-pulse">Loading your portfolio...</p>
                </div>
              ) : (activeTab === 'ipr' ? filteredIprApplications : filteredResearchContributions).length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center bg-white/60 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl group hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
                  <div className="w-24 h-24 bg-indigo-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-12 h-12 border-2 border-indigo-200 dark:border-gray-600 rounded-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">It's quiet here</h3>
                  <p className="text-slate-500 dark:text-gray-400 max-w-sm text-center leading-relaxed">
                    Ready to make an impact? Start your journey by creating your first <span className="text-indigo-600 dark:text-indigo-400 font-medium">{activeTab === 'ipr' ? 'IPR application' : 'research contribution'}</span>.
                  </p>
                </div>
              ) : (
                (activeTab === 'ipr' ? filteredIprApplications : filteredResearchContributions).map((item: any) => {
                  const isIPR = activeTab === 'ipr';
                  const types = isIPR ? IPR_TYPES : RESEARCH_TYPES;
                  const statusConfig = isIPR ? getIprStatusInfo(item.status) : getResearchStatusInfo(item.status);
                  const typeInfo = types.find(t => t.type === (item.iprType || item.publicationType));
                  const Icon = typeInfo?.icon || (isIPR ? Lightbulb : FileText);
                  
                  return (
                    <Link
                      key={item.id}
                      href={isIPR ? `/ipr/applications/${item.id}` : `/research/contribution/${item.id}`}
                      className="group relative block bg-white dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-100 dark:border-white/5 hover:border-indigo-100 dark:hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${typeInfo?.color.replace('bg-', 'from-').replace('-500', isIPR ? '-50' : '-50').replace('text-', '')} to-white dark:to-white/5 border border-slate-100 dark:border-white/10 shadow-inner group-hover:scale-105 transition-transform`}>
                          <Icon className={`w-8 h-8 ${typeInfo?.color.replace('bg-', 'text-').replace('-500', '-600')}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1">{item.title}</h4>
                              <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1 line-clamp-1 flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md ${typeInfo?.color.replace('bg-', 'bg-').replace('-500', '-50')} text-slate-700 dark:bg-white/10 dark:text-gray-300 text-xs uppercase tracking-wide`}>{typeInfo?.label}</span>
                                <span className="text-slate-300 dark:text-gray-600">•</span>
                                {item.applicationNumber && <span className="font-mono text-slate-500 dark:text-gray-500">#{item.applicationNumber}</span>}
                                {item.applicationNumber && <span className="text-slate-300 dark:text-gray-600">•</span>}
                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              </p>
                            </div>

                            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 backdrop-blur-md shadow-sm ${statusConfig.color.replace('bg-', 'bg-opacity-10 dark:bg-opacity-10 border-').replace('text-', 'text-opacity-100 dark:text-opacity-90 border-opacity-20 text-')}`}>
                              <statusConfig.icon className="w-3.5 h-3.5" />
                              {statusConfig.label}
                            </div>
                          </div>
                          
                          <p className="text-base text-slate-600 dark:text-gray-500 mt-3 line-clamp-2 font-normal leading-relaxed">{item.description || item.abstract || 'No description provided.'}</p>
                          
                          {(item.status === 'completed' || item.status === 'published' || item.status === 'approved') && (
                            <div className="mt-5 flex items-center gap-4">
                              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-green-500/10 border border-emerald-100 dark:border-green-500/20 text-xs font-bold text-emerald-700 dark:text-green-400 shadow-sm">
                                <Coins className="w-3.5 h-3.5" />
                                ₹ {Number(item.incentiveAmount || 0).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-50 dark:bg-purple-500/10 border border-fuchsia-100 dark:border-purple-500/20 text-xs font-bold text-fuchsia-700 dark:text-purple-400 shadow-sm">
                                <Award className="w-3.5 h-3.5" />
                                {item.pointsAwarded || 0} Points
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
