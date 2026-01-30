# IPR Management

Handles Intellectual Property Rights (IPR) applications, including patents, copyrights, trademarks, and related review workflows.

## Components
- IPR idea request forms
- IPR application forms
- DRD review dashboards
- My IPR applications list
- Collaborative editing interface

## Services
- `ipr.service.ts` - IPR application CRUD operations
- `drdReview.service.ts` - DRD department review workflows
- `collaborativeEditing.service.ts` - Real-time collaborative document editing

## Key Flows
1. **Submit IPR Idea** - Faculty submits idea → DRD review → Approval/Rejection
2. **Full Application** - Approved idea → Complete application → Patent filing
3. **Collaborative Editing** - Multiple authors → Real-time document sync → Version control
