# Admin Management

System administration functionality including user management, permission assignments, school/department configuration, and bulk operations.

## Components
- Permission management interface
- School/Department/Program management
- User management
- Bulk upload utilities
- Policy configuration

## Services
- `permission.service.ts` - User permission CRUD
- `school.service.ts` - School management
- `department.service.ts` - Department management
- `program.service.ts` - Academic program management
- `bulkUpload.service.ts` - Bulk data import operations

## Key Flows
1. **Assign Permissions** - Select user → Choose department → Grant permissions
2. **Manage Schools** - Create/edit schools → Add departments → Configure programs
3. **Bulk Upload** - Upload CSV/Excel → Validate data → Create records
