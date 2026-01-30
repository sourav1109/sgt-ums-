# Shared Resources

Common utilities, components, and services used across all features.

## Folders

| Folder | Purpose |
|--------|---------|
| `ui-components/` | Reusable UI primitives (Toast, Modal, Buttons, Inputs) |
| `layouts/` | Page layout components (Header, Sidebar, Navigation) |
| `providers/` | React context providers (Auth, Theme) |
| `api/` | API client, interceptors, request utilities |
| `auth/` | Authentication state, auth helpers |
| `hooks/` | Shared custom hooks (useApi, usePermission, useLocalStorage) |
| `utils/` | Utility functions (logger, validators, formatters) |
| `types/` | Shared TypeScript types/interfaces |
| `constants/` | Application-wide constants and enums |

## Usage

Import shared resources using:
```typescript
import { Toast } from '@/shared/ui-components/Toast';
import { usePermission } from '@/shared/hooks/usePermission';
import api from '@/shared/api/client';
```

## Guidelines
- Only add truly reusable code here
- Feature-specific code belongs in `features/`
- Keep dependencies minimal
