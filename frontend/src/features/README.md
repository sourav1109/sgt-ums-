# Features

This directory contains self-contained feature modules. Each feature has its own:
- `components/` - React components specific to this feature
- `services/` - API service functions for this feature
- `types/` - TypeScript types/interfaces
- `hooks/` - Custom React hooks

## Available Features

| Feature | Description |
|---------|-------------|
| `research-management/` | Research paper submissions, publications, grants, policy calculations |
| `ipr-management/` | Intellectual Property Rights applications, DRD reviews, collaborative editing |
| `admin-management/` | System administration, user permissions, school/department management |
| `progress-tracking/` | Research progress tracking, monthly reports, writing status |
| `grants-management/` | Grant applications, funding tracking |
| `dashboard/` | User dashboards, widgets, analytics modules |

## Naming Conventions

- Folders: `kebab-case` (e.g., `research-management`)
- Components: `PascalCase.tsx` (e.g., `ResearchForm.tsx`)
- Services: `camelCase.service.ts` (e.g., `research.service.ts`)
- Types: `feature.types.ts` (e.g., `research.types.ts`)
- Hooks: `use*.ts` (e.g., `useResearch.ts`)
