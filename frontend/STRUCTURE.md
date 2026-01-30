# Frontend Structure Documentation

> **Last Updated:** January 30, 2026  
> **Build Status:** ✅ Successfully Compiled  
> **TypeScript Errors:** 0

## Overview

The frontend has been restructured into a **feature-based modular architecture** with clear separation of concerns. All code is organized into domain-specific features and shared resources.

---

## 📁 Directory Structure

```
frontend/src/
├── app/                          # Next.js App Router pages
├── features/                     # Feature-based modules (domain-driven)
│   ├── admin-management/        # Admin & policy management
│   ├── dashboard/               # Dashboard & analytics
│   ├── ipr-management/          # IPR (Patents, Copyrights, etc.)
│   ├── progress-tracking/       # Research progress tracking
│   └── research-management/     # Research papers, grants, conferences
├── shared/                       # Shared resources (cross-cutting)
│   ├── api/                     # API client configuration
│   ├── auth/                    # Authentication store & logic
│   ├── components/              # Shared React components
│   ├── constants/               # Global constants & enums
│   ├── hooks/                   # Reusable React hooks
│   ├── layouts/                 # Page layouts (Header, Footer, etc.)
│   ├── providers/               # React context providers
│   ├── services/                # Shared service layer
│   ├── types/                   # TypeScript type definitions
│   ├── ui-components/           # UI component library
│   └── utils/                   # Utility functions
└── styles/                       # Global CSS styles
```

---

## 🎯 Features (Domain Modules)

### 1. **Admin Management** (`features/admin-management/`)
**Purpose:** Admin panel, user management, policy configuration

```
features/admin-management/
├── components/
│   ├── BookChapterPolicyManagement.tsx
│   ├── BookPolicyManagement.tsx
│   ├── ConferencePolicyManagement.tsx
│   ├── GrantIncentivePolicyManagement.tsx
│   ├── PermissionCheckboxGrid.tsx (moved from shared)
│   ├── ResearchPolicyManagement.tsx
│   └── UniversityAnalyticsDashboard.tsx
└── services/
    ├── analytics.service.ts
    ├── conferencePolicy.service.ts
    └── researchPolicy.service.ts
```

**Key Files:**
- **Policy Management:** Book, Book Chapter, Conference, Research, Grant policies
- **Analytics:** University-wide analytics dashboard
- **Permissions:** Permission management grid

---

### 2. **Dashboard** (`features/dashboard/`)
**Purpose:** Main dashboards, quick access modules, statistics

```
features/dashboard/
├── animations/
│   └── AnimatedComponents.tsx        # Dashboard animations
├── components/
│   ├── AnimatedStatsGrid.tsx
│   ├── DrdMainDashboard.tsx         # DRD (Research) main dashboard
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── ModernStaffDashboard.tsx
│   ├── PermissionBasedDashboard.tsx
│   ├── QuickAccessModules.tsx
│   └── widgets/
│       ├── AcademicExcellenceWidget.tsx
│       ├── ContributionWidgets.tsx
│       └── StatisticsWidget.tsx
└── services/
    └── dashboard.service.ts
```

**Key Files:**
- **Main Dashboards:** Permission-based, Staff, DRD dashboards
- **Widgets:** Academic excellence, contributions, statistics
- **Animations:** Fade-in, slide-in, stagger animations

---

### 3. **IPR Management** (`features/ipr-management/`)
**Purpose:** Intellectual Property Rights (Patents, Copyrights, Trademarks)

```
features/ipr-management/
├── components/
│   ├── CollaborativeEditor.tsx
│   ├── CollaborativeReviewModal.tsx
│   ├── DrdIprDashboard.tsx
│   ├── DrdReviewDashboard.tsx
│   ├── IPRIdeaRequestForm.tsx
│   ├── IPRStatusUpdates.tsx
│   ├── IprApplicationDetails.tsx
│   ├── MyIprApplications.tsx
│   └── [12 more IPR form components]
└── services/
    ├── collaborativeEditing.service.ts
    └── ipr.service.ts
```

**Key Files:**
- **Application Forms:** Patent, Copyright, Trademark, Design, etc.
- **Review System:** Collaborative editing, DRD review dashboard
- **Status Tracking:** Application status updates and history

---

### 4. **Progress Tracking** (`features/progress-tracking/`)
**Purpose:** Track research paper progress from writing to publication

```
features/progress-tracking/
├── components/
│   ├── forms/                        # Writing stage forms
│   │   ├── BookChapterWritingForm.tsx
│   │   ├── BookWritingForm.tsx
│   │   ├── ConferencePaperWritingForm.tsx
│   │   └── ResearchPaperWritingForm.tsx
│   ├── status-forms/                 # Status update forms
│   │   ├── BookChapterStatusForm.tsx
│   │   ├── BookStatusForm.tsx
│   │   ├── ConferencePaperStatusForm.tsx
│   │   └── ResearchPaperStatusForm.tsx
│   └── StatusUpdateModal.tsx
└── services/
    (Uses services from research-management)
```

**Key Files:**
- **Writing Forms:** Initial submission forms for different publication types
- **Status Forms:** Update forms for publication progress
- **Tracker:** Progress tracker with status history

---

### 5. **Research Management** (`features/research-management/`)
**Purpose:** Core research module - papers, conferences, books, grants

```
features/research-management/
├── components/
│   ├── GrantApplicationForm.tsx
│   ├── InvestigatorManager.tsx
│   ├── MyContributions.tsx
│   └── ResearchContributionForm.tsx   # Main research form (6200+ lines)
└── services/
    ├── conferencePolicy.service.ts
    ├── grantPolicy.service.ts
    ├── policyService.ts
    ├── progressTracker.service.ts
    ├── research.service.ts
    └── researchPolicy.service.ts
```

**Key Files:**
- **Contribution Form:** Universal form for research papers, books, conferences
- **Grant Application:** Grant submission and management
- **Services:** Research, policy, and grant services

---

## 🔧 Shared Resources

### **API Layer** (`shared/api/`)
```
shared/api/
└── api.ts                   # Axios instance, interceptors, retry logic
```

### **Authentication** (`shared/auth/`)
```
shared/auth/
├── authStore.ts            # Zustand auth store
└── dashboardStore.ts       # Dashboard state management
```

### **Components** (`shared/components/`)
```
shared/components/
├── layout/
│   ├── Header.tsx
│   └── NavigationHeader.tsx
└── ui/
    ├── ConfirmModal.tsx
    └── Toast.tsx
```

### **Constants** (`shared/constants/`)
```
shared/constants/
└── index.ts                # Global constants, enums, configs
```

### **Hooks** (`shared/hooks/`)
```
shared/hooks/
├── useApi.ts              # API request hook
└── usePermissions.ts      # Permission checking hook
```

### **Layouts** (`shared/layouts/`)
```
shared/layouts/
├── Header.tsx
├── NavigationHeader.tsx
└── index.ts
```

### **Providers** (`shared/providers/`)
```
shared/providers/
└── (context providers)
```

### **Services** (`shared/services/`)
```
shared/services/
└── policyService.ts       # Shared policy service
```

### **Types** (`shared/types/`)
```
shared/types/
└── api.types.ts           # Global TypeScript types
```

### **UI Components** (`shared/ui-components/`)
```
shared/ui-components/
├── AnimatedComponents.tsx
├── ConfirmModal.tsx
├── LoadingSpinner.tsx
├── PermissionCheckboxGrid.tsx
└── Toast.tsx
```

### **Utilities** (`shared/utils/`)
```
shared/utils/
├── errorHandler.ts
├── logger.ts
└── validators.ts
```

---

## 📄 App Router Pages (`app/`)

### **Admin Pages**
- `/app/admin/book-chapter-policies/page.tsx`
- `/app/admin/book-policies/page.tsx`
- `/app/admin/conference-policies/page.tsx`
- `/app/admin/research-policies/page.tsx`

### **Dashboard Pages**
- `/app/dashboard/page.tsx` - Main dashboard

### **DRD Pages**
- `/app/drd/page.tsx` - DRD main dashboard
- `/app/drd/ipr/page.tsx` - IPR review dashboard
- `/app/drd/research/review/[id]/page.tsx` - Research review detail
- `/app/drd/research/grant-review/[id]/page.tsx` - Grant review detail

### **Research Pages**
- `/app/research/my-contributions/page.tsx` - My research contributions
- `/app/research/grant/[id]/page.tsx` - Grant detail view
- `/app/research/progress-tracker/page.tsx` - Progress tracker list
- `/app/research/progress-tracker/[id]/page.tsx` - Tracker detail
- `/app/research/progress-tracker/new/page.tsx` - New tracker

### **Other Pages**
- `/app/permissions/page.tsx` - Permission management
- `/app/page.tsx` - Home page
- `/app/layout.tsx` - Root layout

---

## 🔄 Import Path Mappings

All import paths use TypeScript path aliases defined in `tsconfig.json`:

```typescript
{
  "paths": {
    "@/*": ["./src/*"],
    "@/features/*": ["./src/features/*"],
    "@/shared/*": ["./src/shared/*"]
  }
}
```

### Common Import Examples:

```typescript
// Features
import { ResearchContributionForm } from '@/features/research-management/components/ResearchContributionForm';
import { DrdIprDashboard } from '@/features/ipr-management/components/DrdIprDashboard';
import { QuickAccessModules } from '@/features/dashboard/components/QuickAccessModules';

// Shared Resources
import api from '@/shared/api/api';
import { useAuthStore } from '@/shared/auth/authStore';
import { useToast } from '@/shared/ui-components/Toast';
import { logger } from '@/shared/utils/logger';
import type { ApiResponse } from '@/shared/types/api.types';

// Services
import { researchService } from '@/features/research-management/services/research.service';
import { iprService } from '@/features/ipr-management/services/ipr.service';
import progressTrackerService from '@/features/research-management/services/progressTracker.service';
```

---

## 📊 Service Layer Organization

### **Feature-Specific Services:**

| Feature | Services | Location |
|---------|----------|----------|
| Research Management | `research.service.ts`, `progressTracker.service.ts`, `grantPolicy.service.ts`, `researchPolicy.service.ts`, `conferencePolicy.service.ts` | `features/research-management/services/` |
| IPR Management | `ipr.service.ts`, `collaborativeEditing.service.ts` | `features/ipr-management/services/` |
| Admin Management | `analytics.service.ts`, `conferencePolicy.service.ts`, `researchPolicy.service.ts` | `features/admin-management/services/` |
| Dashboard | `dashboard.service.ts` | `features/dashboard/services/` |

### **Shared Services:**
- `policyService.ts` - Located in `shared/services/`

---

## 🎨 Component Organization

### **Feature Components** (Domain-Specific)
- **Location:** `features/[feature-name]/components/`
- **Scope:** Only used within that feature
- **Examples:** `ResearchContributionForm`, `IprApplicationDetails`, `GrantApplicationForm`

### **Shared UI Components** (Reusable)
- **Location:** `shared/ui-components/`
- **Scope:** Used across multiple features
- **Examples:** `Toast`, `ConfirmModal`, `LoadingSpinner`, `AnimatedComponents`

### **Shared Layout Components**
- **Location:** `shared/layouts/` or `shared/components/layout/`
- **Scope:** Page structure components
- **Examples:** `Header`, `NavigationHeader`, `Footer`

---

## 🧪 Build & Development

### **Build Commands:**
```bash
# Development
npm run dev

# Production build
npm run build

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint
```

### **Build Status:**
- ✅ TypeScript: 0 errors
- ⚠️ ESLint: Some warnings (non-blocking)
- ✅ Production Build: Successfully compiled

---

## 🔍 Quick Reference: Where Is What?

| What | Where |
|------|-------|
| Research paper forms | `features/research-management/components/ResearchContributionForm.tsx` |
| IPR application forms | `features/ipr-management/components/` (Patent, Copyright, etc.) |
| Admin policy management | `features/admin-management/components/` |
| Main dashboards | `features/dashboard/components/` |
| Progress tracker | `features/progress-tracking/components/` + uses `features/research-management/services/progressTracker.service.ts` |
| API client | `shared/api/api.ts` |
| Auth store | `shared/auth/authStore.ts` |
| Toast notifications | `shared/ui-components/Toast.tsx` |
| Confirm dialogs | `shared/ui-components/ConfirmModal.tsx` |
| Logger utility | `shared/utils/logger.ts` |
| Type definitions | `shared/types/api.types.ts` |
| Constants & enums | `shared/constants/index.ts` |
| Page routes | `app/` directory |

---

## 📝 Migration Notes

### **Old Structure → New Structure:**

| Old Path | New Path |
|----------|----------|
| `/src/components/dashboard/*` | `/src/features/dashboard/components/*` |
| `/src/components/ipr/*` | `/src/features/ipr-management/components/*` |
| `/src/components/research/*` | `/src/features/research-management/components/*` |
| `/src/components/admin/*` | `/src/features/admin-management/components/*` |
| `/src/components/ui/*` | `/src/shared/ui-components/*` |
| `/src/services/*` | `/src/features/[domain]/services/*` |
| `/src/lib/api.ts` | `/src/shared/api/api.ts` |
| `/src/store/authStore.ts` | `/src/shared/auth/authStore.ts` |
| `/src/utils/*` | `/src/shared/utils/*` |
| `/src/types/*` | `/src/shared/types/*` |
| `/src/constants/*` | `/src/shared/constants/*` |
| `/src/hooks/*` | `/src/shared/hooks/*` |

### **Deleted Directories:**
- ❌ `/src/core/` (duplicate files)
- ❌ `/src/lib/` (moved to `/src/shared/api/`)
- ❌ `/src/components/` (moved to features & shared)
- ❌ `/src/services/` (moved to feature-specific locations)
- ❌ `/src/store/` (moved to `/src/shared/auth/`)

---

## 🎯 Architecture Benefits

### **1. Feature-Based Organization**
- ✅ Clear domain boundaries
- ✅ Self-contained features
- ✅ Easy to find related code

### **2. Shared Resources**
- ✅ Reusable across features
- ✅ Single source of truth
- ✅ Consistent patterns

### **3. Scalability**
- ✅ Easy to add new features
- ✅ Minimal cross-feature dependencies
- ✅ Clear separation of concerns

### **4. Maintainability**
- ✅ Easier code navigation
- ✅ Reduced coupling
- ✅ Better team collaboration

---

## 📚 Additional Resources

- **Architecture Overview:** See `ARCHITECTURE.md` for detailed architecture documentation
- **TypeScript Config:** `tsconfig.json` for path alias configuration
- **ESLint Config:** `.eslintrc.json` for code quality rules
- **Next.js Config:** `next.config.js` for build configuration

---

**Note:** This structure follows enterprise-level best practices for scalable React/Next.js applications with clear separation between domain logic (features) and infrastructure (shared).
