# Backend Scripts

Organized utility scripts for database maintenance, testing, and one-time operations.

## Folders

| Folder | Purpose | When to Use |
|--------|---------|-------------|
| `database-maintenance/checks/` | Scripts to verify data integrity | Debugging, audits |
| `database-maintenance/fixes/` | Scripts to fix data issues | After identifying problems |
| `data-seeding/` | Scripts to populate test/initial data | Setup, testing |
| `testing-utilities/` | Scripts to test APIs/connections | Development, debugging |
| `recalculations/` | Scripts to recalculate derived data | After policy changes |
| `one-time-migrations/` | One-time data migrations | Specific version upgrades |

## Running Scripts

```bash
# From backend directory
node scripts/database-maintenance/checks/check-contribution.js
node scripts/data-seeding/seed-test-users.js
node scripts/testing-utilities/test-api.js
```

## Naming Convention
- `check-*.js` - Verification scripts (read-only)
- `fix-*.js` - Correction scripts (write operations)
- `seed-*.js` - Data seeding scripts
- `test-*.js` - Testing scripts
- `recalculate-*.js` - Recalculation scripts
