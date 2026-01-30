/**
 * Dashboard Components
 * Export all dashboard-related components from this file for easy importing
 */

// Main Dashboard
export { default as PermissionBasedDashboard } from './components/PermissionBasedDashboard';

// Dashboard Modules
export { default as IPRModule } from './modules/IPRModule';
export { default as ResearchModule } from './modules/ResearchModule';
// export { default as GrantsModule } from './modules/GrantsModule'; // Module not yet implemented
export { default as StudentsModule } from './modules/StudentsModule';

// Dashboard Widgets
export { default as StudentsWidget } from './widgets/StudentsWidget';
export { default as FacultyWidget } from './widgets/FacultyWidget';
export { default as ResearchWidget } from './widgets/ResearchWidget';

// Services
export { dashboardService } from './services/dashboard.service';
export { analyticsService } from './services/analytics.service';
