/**
 * IPR-related Type Definitions
 */

import type { Nullable } from './api.types';
import type { User, Employee, Student } from './user.types';

// IPR Types
export type IprType = 
  | 'patent'
  | 'copyright'
  | 'trademark'
  | 'design'
  | 'geographical_indication';

// Filing Types
export type FilingType = 'idea_submission' | 'complete_filing';

// Project Types
export type ProjectType = 'research' | 'teaching' | 'consulting' | 'industry';

// IPR Status
export type IprStatus = 
  | 'draft'
  | 'submitted'
  | 'under_mentor_review'
  | 'mentor_approved'
  | 'mentor_rejected'
  | 'under_drd_review'
  | 'drd_approved'
  | 'drd_rejected'
  | 'under_dean_review'
  | 'dean_approved'
  | 'dean_rejected'
  | 'under_finance_review'
  | 'finance_approved'
  | 'finance_rejected'
  | 'completed';

// IPR Application
export interface IprApplication {
  id: string;
  applicationNumber: string;
  title: string;
  description: Nullable<string>;
  iprType: IprType;
  filingType: FilingType;
  projectType: Nullable<ProjectType>;
  status: IprStatus;
  
  // Applicant Info
  applicantUserId: string;
  applicantType: 'faculty' | 'staff' | 'student';
  applicant?: Employee | Student;
  
  // Mentor Info
  mentorUserId: Nullable<string>;
  mentor?: Employee;
  
  // Co-Inventors
  coInventors?: IprCoInventor[];
  
  // SDG Goals
  selectedSdgs?: string[];
  
  // File Paths
  annexureFilePath: Nullable<string>;
  prototypeFilePath: Nullable<string>;
  supportingDocsFilePaths: Nullable<string[]>;
  
  // Incentive Calculation
  calculatedIncentiveAmount: Nullable<number>;
  calculatedPoints: Nullable<number>;
  
  // Patent-specific fields
  patentApplicationNumber: Nullable<string>;
  patentFilingDate: Nullable<string>;
  patentGrantDate: Nullable<string>;
  patentStatus: Nullable<string>;
  
  // Copyright-specific fields
  copyrightRegistrationNumber: Nullable<string>;
  copyrightFilingDate: Nullable<string>;
  
  // Review Info
  reviews?: IprReview[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// IPR Co-Inventor
export interface IprCoInventor {
  id: string;
  applicationId: string;
  userId: Nullable<string>;
  name: string;
  email: Nullable<string>;
  affiliation: Nullable<string>;
  contributionPercentage: Nullable<number>;
  isInternal: boolean;
  user?: User;
}

// IPR Review
export interface IprReview {
  id: string;
  applicationId: string;
  reviewerId: string;
  reviewerRole: 'mentor' | 'drd_member' | 'drd_dean' | 'finance';
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  comments: Nullable<string>;
  reviewedAt: Nullable<string>;
  reviewer?: Employee;
  suggestedChanges?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// IPR Policy
export interface IprIncentivePolicy {
  id: string;
  policyName: string;
  iprType: IprType;
  isActive: boolean;
  
  // Base Amounts
  baseIncentiveAmount: number;
  basePoints: number;
  
  // Filing Type Multipliers
  filingTypeMultipliers?: Record<FilingType, number>;
  
  // Project Type Bonuses
  projectTypeBonuses?: Record<ProjectType, number>;
  
  // Validity
  effectiveFrom: string;
  effectiveTo: Nullable<string>;
  
  createdAt: string;
  updatedAt: string;
}

// Status Update
export interface IprStatusUpdate {
  id: string;
  applicationId: string;
  previousStatus: IprStatus;
  newStatus: IprStatus;
  changedBy: string;
  changedByUser?: Employee;
  reason: Nullable<string>;
  createdAt: string;
}

// IPR Analytics
export interface IprAnalytics {
  totalApplications: number;
  byType: Record<IprType, number>;
  byStatus: Record<IprStatus, number>;
  byMonth: Array<{
    month: string;
    count: number;
  }>;
  pendingReviews: number;
  approvedThisMonth: number;
  averageProcessingDays: number;
}

// Form data types
export interface IprApplicationFormData {
  title: string;
  description?: string;
  iprType: IprType;
  filingType: FilingType;
  projectType?: ProjectType;
  mentorUserId?: string;
  selectedSdgs?: string[];
  coInventors: IprCoInventorFormData[];
}

export interface IprCoInventorFormData {
  userId?: string;
  name: string;
  email?: string;
  affiliation?: string;
  contributionPercentage?: number;
}

// SDG Goal
export interface SdgGoal {
  id: string;
  number: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

// UN Sustainable Development Goals
export const SDG_GOALS: SdgGoal[] = [
  { id: 'sdg1', number: 1, name: 'No Poverty', description: 'End poverty in all its forms everywhere', color: '#E5243B' },
  { id: 'sdg2', number: 2, name: 'Zero Hunger', description: 'End hunger, achieve food security', color: '#DDA63A' },
  { id: 'sdg3', number: 3, name: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being', color: '#4C9F38' },
  { id: 'sdg4', number: 4, name: 'Quality Education', description: 'Ensure inclusive and equitable quality education', color: '#C5192D' },
  { id: 'sdg5', number: 5, name: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls', color: '#FF3A21' },
  { id: 'sdg6', number: 6, name: 'Clean Water and Sanitation', description: 'Ensure availability of water and sanitation', color: '#26BDE2' },
  { id: 'sdg7', number: 7, name: 'Affordable and Clean Energy', description: 'Ensure access to affordable, reliable energy', color: '#FCC30B' },
  { id: 'sdg8', number: 8, name: 'Decent Work and Economic Growth', description: 'Promote sustained, inclusive economic growth', color: '#A21942' },
  { id: 'sdg9', number: 9, name: 'Industry, Innovation and Infrastructure', description: 'Build resilient infrastructure', color: '#FD6925' },
  { id: 'sdg10', number: 10, name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries', color: '#DD1367' },
  { id: 'sdg11', number: 11, name: 'Sustainable Cities and Communities', description: 'Make cities inclusive, safe, resilient', color: '#FD9D24' },
  { id: 'sdg12', number: 12, name: 'Responsible Consumption and Production', description: 'Ensure sustainable consumption patterns', color: '#BF8B2E' },
  { id: 'sdg13', number: 13, name: 'Climate Action', description: 'Take urgent action to combat climate change', color: '#3F7E44' },
  { id: 'sdg14', number: 14, name: 'Life Below Water', description: 'Conserve and sustainably use the oceans', color: '#0A97D9' },
  { id: 'sdg15', number: 15, name: 'Life on Land', description: 'Protect, restore and promote sustainable use of ecosystems', color: '#56C02B' },
  { id: 'sdg16', number: 16, name: 'Peace, Justice and Strong Institutions', description: 'Promote peaceful and inclusive societies', color: '#00689D' },
  { id: 'sdg17', number: 17, name: 'Partnerships for the Goals', description: 'Strengthen the means of implementation', color: '#19486A' },
];
