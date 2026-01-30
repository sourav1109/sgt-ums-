# SGT Research Management System - Backend Architecture

> **Version:** 2.0 | **Last Updated:** January 30, 2026  
> **Framework:** Node.js + Express + Prisma ORM + PostgreSQL

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── modules/                    # Feature modules (domain-driven)
│   │   ├── analytics/              # University-wide analytics
│   │   │   ├── controllers/
│   │   │   │   └── analytics.controller.js
│   │   │   ├── routes/
│   │   │   │   └── analytics.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── audit/                  # Audit logging & compliance
│   │   │   ├── controllers/
│   │   │   │   └── audit.controller.js
│   │   │   ├── routes/
│   │   │   │   └── audit.routes.js
│   │   │   ├── services/
│   │   │   │   ├── audit.service.js
│   │   │   │   └── auditScheduler.service.js
│   │   │   └── index.js
│   │   │
│   │   ├── auth/                   # Authentication & authorization
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.js
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── core/                   # Core admin & master data
│   │   │   ├── config/
│   │   │   │   └── permissionDefinitions.js
│   │   │   ├── controllers/
│   │   │   │   ├── bulkUpload.controller.js
│   │   │   │   ├── centralDepartment.controller.js
│   │   │   │   ├── dashboard.controller.js
│   │   │   │   ├── department.controller.js
│   │   │   │   ├── designation.controller.js
│   │   │   │   ├── employee.controller.js
│   │   │   │   ├── permission.controller.js
│   │   │   │   ├── permissionManagement.controller.js
│   │   │   │   ├── program.controller.js
│   │   │   │   ├── school.controller.js
│   │   │   │   ├── student.controller.js
│   │   │   │   └── user.controller.js
│   │   │   ├── routes/
│   │   │   │   ├── index.js           # Central router
│   │   │   │   ├── bulkUpload.routes.js
│   │   │   │   ├── centralDepartment.routes.js
│   │   │   │   ├── dashboard.routes.js
│   │   │   │   ├── department.routes.js
│   │   │   │   ├── designation.routes.js
│   │   │   │   ├── employee.routes.js
│   │   │   │   ├── fileUpload.routes.js
│   │   │   │   ├── permission.routes.js
│   │   │   │   ├── permissionManagement.routes.js
│   │   │   │   ├── program.routes.js
│   │   │   │   ├── school.routes.js
│   │   │   │   ├── student.routes.js
│   │   │   │   └── user.routes.js
│   │   │   ├── services/
│   │   │   │   ├── cachedData.service.js
│   │   │   │   ├── email.service.js
│   │   │   │   ├── excelExport.service.js
│   │   │   │   ├── localFile.service.js
│   │   │   │   └── s3.service.js
│   │   │   └── index.js
│   │   │
│   │   ├── finance/                # Finance review & incentives
│   │   │   ├── controllers/
│   │   │   │   └── finance.controller.js
│   │   │   ├── routes/
│   │   │   │   └── finance.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── grants/                 # Grant applications
│   │   │   ├── controllers/
│   │   │   │   └── grant.controller.js
│   │   │   ├── routes/
│   │   │   │   └── grant.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── ipr/                    # Intellectual Property Rights
│   │   │   ├── controllers/
│   │   │   │   └── ipr.controller.js
│   │   │   ├── routes/
│   │   │   │   ├── ipr.routes.js
│   │   │   │   └── iprManagement.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── notifications/          # User notifications
│   │   │   ├── controllers/
│   │   │   │   └── notification.controller.js
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.js
│   │   │   └── index.js
│   │   │
│   │   └── research/               # Research contributions
│   │       ├── controllers/
│   │       │   ├── collaborativeEditing.controller.js
│   │       │   ├── contribution.controller.js
│   │       │   ├── deanApproval.controller.js
│   │       │   ├── drdReview.controller.js
│   │       │   ├── googleDocs.controller.js
│   │       │   ├── progressTracker.controller.js
│   │       │   ├── review.controller.js
│   │       │   └── policies/
│   │       │       ├── book.policy.controller.js
│   │       │       ├── bookChapter.policy.controller.js
│   │       │       ├── conference.policy.controller.js
│   │       │       ├── grant.policy.controller.js
│   │       │       ├── incentive.policy.controller.js
│   │       │       └── research.policy.controller.js
│   │       ├── routes/
│   │       │   ├── collaborativeEditing.routes.js
│   │       │   ├── contribution.routes.js
│   │       │   ├── deanApproval.routes.js
│   │       │   ├── drdReview.routes.js
│   │       │   ├── googleDocs.routes.js
│   │       │   ├── progressTracker.routes.js
│   │       │   └── policies/
│   │       │       ├── book.routes.js
│   │       │       ├── bookChapter.routes.js
│   │       │       ├── conference.routes.js
│   │       │       ├── grant.routes.js
│   │       │       ├── incentive.routes.js
│   │       │       └── research.routes.js
│   │       └── index.js
│   │
│   ├── shared/                     # Cross-cutting concerns
│   │   ├── config/
│   │   │   ├── app.config.js       # Application configuration
│   │   │   ├── database.js         # Prisma client (singleton)
│   │   │   ├── permissions.config.js
│   │   │   └── redis.js            # Redis/cache configuration
│   │   ├── database/
│   │   │   ├── connection.js       # Legacy pg connection
│   │   │   ├── migrate.js
│   │   │   ├── seed.js
│   │   │   └── seed-ipr.js
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT authentication
│   │   │   ├── audit.middleware.js # Request auditing
│   │   │   └── errorHandler.js     # Global error handler
│   │   └── utils/
│   │       ├── auditLogger.js      # Audit logging utilities
│   │       └── validators.js       # Input validation
│   │
│   └── server.js                   # Application entry point
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
│
├── scripts/                        # Maintenance & utility scripts
│   ├── database/
│   │   └── seeds/                  # Database seed scripts
│   ├── maintenance/
│   │   ├── checks/                 # Health check scripts
│   │   ├── fixes/                  # Data fix scripts
│   │   └── recalculations/         # Recalculation scripts
│   └── tests/                      # Test scripts
│
├── uploads/                        # File uploads directory
├── package.json
└── .env                           # Environment variables
```

---

## 🏗️ Module Architecture

### Module Pattern

Each module follows a consistent structure:

```
module/
├── controllers/     # Request handlers (business logic)
├── routes/          # Express route definitions
├── services/        # Business services (optional)
├── types/           # TypeScript types (if applicable)
└── index.js         # Module export (Express router)
```

### Module Index Pattern

```javascript
// modules/{module}/index.js
const router = require('express').Router();
const routes = require('./routes/{module}.routes');

router.use('/', routes);

module.exports = router;
```

---

## 🔗 API Routes

### Base URL
```
/api/v1
```

### Route Hierarchy

| Module | Path | Description |
|--------|------|-------------|
| Auth | `/auth/*` | Authentication (login, logout, refresh) |
| Dashboard | `/dashboard/*` | User dashboards |
| Users | `/users/*` | User management |
| Schools | `/schools/*` | School/faculty management |
| Departments | `/departments/*` | Department management |
| Employees | `/employees/*` | Employee management |
| Students | `/students/*` | Student management |
| Research | `/research/*` | Research contributions |
| IPR | `/ipr/*` | Intellectual property |
| Grants | `/grants/*` | Grant applications |
| Finance | `/finance/*` | Finance processing |
| Analytics | `/analytics/*` | University analytics |
| Audit | `/audit/*` | Audit logs |
| Notifications | `/notifications/*` | User notifications |

### Backward Compatibility Routes

Legacy routes maintained for frontend compatibility:

```
/research-policies/*    → /research/policies/*
/book-policies/*        → /research/policies/book/*
/conference-policies/*  → /research/policies/conference/*
/drd-review/*           → /research/drd-review/*
/dean-approval/*        → /research/dean-approval/*
/ipr-management/*       → /ipr/management/*
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

```
1. POST /api/v1/auth/login
   → Returns: { accessToken, refreshToken, user }

2. Protected routes require:
   → Header: Authorization: Bearer <accessToken>

3. Token refresh:
   → POST /api/v1/auth/refresh-token
```

### Middleware Stack

```javascript
// Route protection
const { protect, restrictTo, requirePermission } = require('../shared/middleware/auth');

// Usage
router.get('/admin-only', 
  protect,                              // Verify JWT
  restrictTo('admin', 'super_admin'),   // Role check
  requirePermission('view_analytics'),  // Permission check
  controller.method
);
```

### Role Hierarchy

```
super_admin → admin → drd_staff → dean → hod → faculty → student
```

---

## 💾 Database Access

### Prisma Client (Singleton)

```javascript
// shared/config/database.js
const prisma = require('../shared/config/database');

// Usage in controllers
const users = await prisma.user.findMany({
  include: { employee: true }
});
```

### Transaction Support

```javascript
await prisma.$transaction(async (tx) => {
  await tx.contribution.create({ ... });
  await tx.auditLog.create({ ... });
});
```

---

## 📊 Audit Logging

### Automatic Request Auditing

All non-GET requests are automatically logged via middleware:

```javascript
// Logged data
{
  actorId,
  actorEmail,
  action,        // CREATE, UPDATE, DELETE
  module,        // RESEARCH, IPR, AUTH, etc.
  targetTable,
  targetId,
  oldValue,
  newValue,
  ipAddress,
  userAgent
}
```

### Manual Audit Logging

```javascript
const { logAuditAction } = require('../shared/utils/auditLogger');

await logAuditAction(
  req.user.id,
  'CREATE',
  'RESEARCH',
  'ResearchContribution',
  newContribution.id,
  null,
  newContribution,
  req
);
```

---

## 📁 File Uploads

### Storage Options

1. **Local Storage** (default)
   - Path: `/uploads/{type}/{filename}`
   - Service: `localFile.service.js`

2. **AWS S3** (production)
   - Service: `s3.service.js`
   - Requires: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### Upload Routes

```
POST /api/v1/file-upload/upload
GET  /api/v1/file-upload/download/:filename
```

---

## 🔧 Environment Variables

```bash
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Redis (optional)
REDIS_URL=redis://localhost:6379

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Email (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## 🚀 Running the Server

```bash
# Development
cd backend
npm install
npm run dev

# Production
npm start

# Database migrations
npx prisma migrate deploy
npx prisma generate
```

---

## 📐 Code Conventions

### Import Order

```javascript
// 1. External packages
const express = require('express');

// 2. Shared config
const prisma = require('../../../shared/config/database');

// 3. Shared middleware
const { protect } = require('../../../shared/middleware/auth');

// 4. Local imports
const controller = require('../controllers/example.controller');
```

### Controller Pattern

```javascript
const exampleMethod = async (req, res) => {
  try {
    // Business logic
    const result = await prisma.model.findMany();
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exampleMethod };
```

### Route Pattern

```javascript
const router = require('express').Router();
const controller = require('../controllers/example.controller');
const { protect, restrictTo } = require('../../../shared/middleware/auth');

router.get('/', protect, controller.getAll);
router.post('/', protect, restrictTo('admin'), controller.create);

module.exports = router;
```

---

## 📦 Module Summary

| Module | Controllers | Routes | Services | Purpose |
|--------|-------------|--------|----------|---------|
| analytics | 1 | 1 | 0 | University dashboards |
| audit | 1 | 1 | 2 | Compliance & logging |
| auth | 1 | 1 | 0 | JWT authentication |
| core | 12 | 14 | 5 | Admin & master data |
| finance | 1 | 1 | 0 | Incentive processing |
| grants | 1 | 1 | 0 | Grant applications |
| ipr | 1 | 2 | 0 | IP rights management |
| notifications | 1 | 1 | 0 | User notifications |
| research | 8 | 13 | 0 | Research contributions |

**Total: 27 controllers, 35 routes, 7 services**
