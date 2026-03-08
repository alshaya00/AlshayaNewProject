# Al-Shaya Technical Architecture - Quick Reference Guide

**Version:** 3.0 | **Generated:** March 5, 2026

---

## Document Overview

| Document | Type | Size | Sections | Purpose |
|----------|------|------|----------|---------|
| **Technical Architecture v3.0** | DOCX | 22 KB | 17 | System design reference for architects & developers |
| **Information Architecture v3.0** | Markdown | 20 KB | 9 | System structure, navigation & data models |

---

## Quick Navigation

### Technical Architecture Document

1. **System Overview** - Tech stack, versions, risk level
2. **Frontend Architecture** - Next.js, React, components, state management
3. **Backend Architecture** - API routes (60+), request pipeline, middleware
4. **Database Architecture** - 53 Prisma models, schema design, indexes
5. **Authentication & Security** - 3 auth flows, RBAC, 49 total issues
6. **Data Flow** - Request lifecycle, caching, patterns
7. **Arabic/RTL Architecture** - Bilingual, name normalization, RTL CSS
8. **Family Tree Algorithms** - Lineage, generation, orphan detection
9. **Integration Architecture** - Email, SMS, OAuth, backups
10. **Error Handling** - Current state, gaps, recommendations
11. **Testing Architecture** - Coverage (40% unit, 0% E2E), gaps
12. **Performance Architecture** - 6 bottlenecks, optimization plan
13. **Security Architecture** - All 18 CRITICAL + 31 HIGH issues
14. **Deployment Architecture** - Current state, Docker/K8s recommendations
15. **Monitoring & Observability** - Current gaps, recommended stack
16. **Scalability Plan** - Capacity limits, horizontal/vertical scaling
17. **Problem-to-Architecture Mapping** - All 187 issues by layer

### Information Architecture Document

1. **Site Map** - 87 pages complete hierarchy
2. **Navigation Patterns** - Top bar, sidebar, breadcrumbs, tabs
3. **URL Structure** - 60+ API endpoints documented
4. **Content Model** - Member, journal, photo, broadcast records
5. **Search Architecture** - Basic, advanced, fuzzy, autocomplete
6. **Role-Based Access** - 5 roles × 14 resources permission matrix
7. **Data Flow** - Request lifecycle, examples
8. **Metadata Model** - Change history, audit logs, activity
9. **Internationalization** - Arabic + English, RTL/LTR, name normalization

---

## Critical Issues Summary

### Top 10 Critical (P001-P010)

| ID | Issue | File | Fix | Time |
|----|----|------|-----|------|
| P001 | X-Frame-Options: ALLOWALL | next.config.js:56 | Set to DENY | 15 min |
| P002 | Admin codes plaintext | prisma/schema.prisma:430 | Hash with bcrypt | 1 hr |
| P003 | Hardcoded password | scripts/ensure-admin.ts:22 | Use env var | 1 hr |
| P004 | Password synced on deploy | scripts/ensure-admin.ts:37 | Only on creation | 1 hr |
| P005 | PII in change history | src/lib/postgres-db.ts | Encrypt | 4 hrs |
| P006 | Session tokens not hashed | src/lib/auth/session.ts | Hash tokens | 2 hrs |
| P007 | TOTP backup codes plaintext | src/lib/auth/db-store.ts:1515 | Hash codes | 2 hrs |
| P008 | TOTP secret plaintext | src/lib/auth/totp.ts | Encrypt | 2 hrs |
| P009 | Member ID race condition | src/lib/postgres-db.ts:252 | Use sequence | 2 hrs |
| P010 | OAuth state not validated | src/lib/auth/oauth.ts:217 | Validate state | 1 hr |

**Total Estimated Fix Time: 17 hours** (2-3 weeks with other work)

### High Severity Issues (11-41)

- P011-P012: Password/email tokens in URL (3 hrs each)
- P013-P018: Session expiry, TOTP, rate limiting, encryption (2-6 hrs each)
- P019-P041: Auth, permission, testing, documentation gaps (30 min - 4 hrs each)

---

## Architecture at a Glance

### Technology Stack

```
Frontend:      Next.js 14 + React 18 + TypeScript + Tailwind CSS
Backend:       Node.js + Prisma ORM + PostgreSQL 16
Auth:          JWT + Sessions + bcrypt + OAuth
Services:      Resend (email), Twilio (SMS), Google APIs
Visualization: D3.js for tree display
Testing:       Jest + React Testing Library
```

### Data Model

```
Total Models:     53 Prisma models
Total Fields:     1,000+
Key Domains:      Family tree, Auth, Permissions, Content, Admin
Relationships:    20+ documented
Indexes:          40+
Soft Deletes:     Yes (audit trail)
Encryption:       None (critical gap)
RLS:              Not configured
```

### API Endpoints

```
Authentication:   11 routes (login, register, verify, etc.)
Members:          10 routes (CRUD + relations)
Admin:            20+ routes (user, settings, data repair)
Search:           4 routes (basic, advanced, autocomplete, history)
Profile:          6 routes (settings, security, password)
Utility:          5 routes (health, stats, upload, export, import)
Total:            60+ endpoints
```

### Pages (87 total)

```
User Pages:       50+ (dashboard, tree, search, member, gallery, journals, etc.)
Admin Pages:      30+ (dashboard, members-hub, users, settings, reports)
Auth Pages:       5 (login, register, verify, reset, forgot)
Help Pages:       2 (FAQ, documentation)
```

### Security Issues by Category

```
Security:         49 issues (18 CRITICAL, 16 HIGH, 15 MEDIUM)
Performance:      29 issues (6 CRITICAL, bottlenecks)
Database:         22 issues (schema, encryption, indexes)
API/Routes:       18 issues (validation, auth, errors)
Frontend:         15 issues (state, components)
Configuration:    12 issues (environment, settings)
Testing:          8 issues (coverage, gaps)
Other:            34 issues (docs, monitoring, infrastructure)
```

---

## Remediation Timeline

### Week 1: Critical Security (P001-P010)
- [ ] X-Frame-Options header
- [ ] OAuth state validation
- [ ] Member ID race condition fix
- [ ] Admin code hashing
- [ ] Remove hardcoded password

### Week 2: Encryption & Hashing
- [ ] TOTP backup codes
- [ ] TOTP secrets
- [ ] Session tokens
- [ ] Change history snapshots
- [ ] Fix password syncing

### Week 3: Missing Protections
- [ ] Rate limiting
- [ ] Field-level permissions
- [ ] Request ID logging
- [ ] CSRF protection
- [ ] Security headers

### Week 4: Validation & Testing
- [ ] CSV/Excel import validation
- [ ] Password strength checks
- [ ] Security E2E tests
- [ ] Audit review
- [ ] Monitoring setup

### Months 2-3: Infrastructure
- [ ] Database encryption
- [ ] Row-Level Security
- [ ] Redis session storage
- [ ] Monitoring/alerting
- [ ] Docker/K8s deployment

---

## Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Code Audited** | 135,716 lines | Complete |
| **Files Analyzed** | 408 files | Complete |
| **Issues Found** | 187 total | Documented |
| **Critical Issues** | 18 | Urgent |
| **High Issues** | 31 | Important |
| **Test Coverage** | 40% unit / 0% E2E | Low |
| **Security Risk** | MEDIUM-HIGH | Urgent remediation needed |

---

## File Locations

```
/sessions/serene-charming-babbage/mnt/outputs/

PRIMARY DELIVERABLES:
- Alshaya_Technical_Architecture_v3.docx (22 KB)
- Alshaya_Information_Architecture_v3.md (20 KB)

SUPPORTING DOCS:
- Alshaya_Complete_Analysis_v3.md (86 KB)
- MASTER_FINDINGS.md (69 KB)
- DELIVERABLES_README.md

QUICK GUIDES:
- QUICK_REFERENCE.md (this file)
- DELIVERABLES_SUMMARY.txt
```

---

## How to Use This Guide

**For Quick Overview:** Start here, then read Technical Architecture Sections 1-3

**For Deep Dive:** Go straight to Technical Architecture Section 13 (Security) or Section 4 (Database)

**For Planning:** Review Remediation Timeline above and effort estimates in security issues table

**For Implementation:** Use source file paths listed in each issue to find exact code locations

---

## Critical Next Steps

1. **This Week:** Review top 10 critical issues
2. **This Month:** Fix all CRITICAL and HIGH severity issues
3. **This Quarter:** Implement encryption, monitoring, testing
4. **This Year:** Kubernetes deployment, advanced optimization

---

**Generated:** March 5, 2026 | **Status:** COMPLETE
**Questions?** See full documents for comprehensive details
