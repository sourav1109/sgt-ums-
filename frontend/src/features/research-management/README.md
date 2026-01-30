# Research Management

Handles all research-related functionality including paper submissions, publications tracking, grant applications, and policy-based incentive calculations.

## Components
- Research paper submission forms
- Grant application forms  
- Publication tracking views
- Contribution dashboards

## Services
- `research.service.ts` - Research paper CRUD operations
- `researchPolicy.service.ts` - Policy evaluation and incentive calculations
- `progressTracker.service.ts` - Progress tracking operations
- `grant.service.ts` - Grant management

## Key Flows
1. **Submit Research** - Faculty submits research paper → Policy evaluation → Incentive calculation
2. **Track Progress** - Monthly writing status updates → Progress reports
3. **Apply for Grant** - Grant application → Approval workflow → Funding tracking
