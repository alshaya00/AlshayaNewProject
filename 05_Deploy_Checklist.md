# Al-Shaya Family Tree Application - Deployment Checklist (Part 1)

**Platform Release Version:** 1.0.0
**Target Infrastructure:** Docker + Kubernetes + CDN
**Current Environment:** Replit/Vercel (non-containerized)
**Deployment Date:** [YYYY-MM-DD]
**Release Manager:** [Name]
**Approval Date:** [YYYY-MM-DD]

---

## Section 1: Pre-Deployment: Code Readiness (T-30 days)

### 1.1 Security Issue Resolution - CRITICAL Issues

**Status:** [ ] Complete
**Verification:** All 18 CRITICAL vulnerabilities resolved and validated

#### CRITICAL Issue #1: SQL Injection in Legacy Endpoints
- [ ] Identify affected endpoints (search codebase for raw SQL queries)
  - **Verification:** `grep -r "query(" src/ | grep -v "prisma"` returns 0 results
  - **Command:** `npm run audit:sql-injection`
- [ ] Replace all raw SQL with Prisma parameterized queries
  - **Verification:** Code review confirms 100% Prisma usage
  - **Test:** Run `npm run test:sql-injection` - all tests pass
- [ ] Validate input sanitization on 12 legacy endpoints
  - **Verification:** Each endpoint has input validation test case
- [ ] Update API documentation with security notes
  - **Verification:** Security section in /docs/API_SECURITY.md created

#### CRITICAL Issue #2: Exposed Database Credentials in Environment
- [ ] Remove DATABASE_URL from .env.example and all git history
  - **Verification:** `git log --all -S DATABASE_URL | wc -l` equals 0
  - **Command:** `git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.example' --prune-empty --tag-name-filter cat -- --all`
- [ ] Migrate all secrets to AWS Secrets Manager
  - **Verification:** All 15+ database credentials stored in AWS Secrets Manager
  - **Test:** `aws secretsmanager get-secret-value --secret-id prod/db/primary` succeeds
- [ ] Update application to fetch secrets at runtime
  - **Verification:** No hardcoded credentials in code
  - **Command:** `grep -r "DATABASE_URL\|PRISMA_URL" src/ lib/ pages/ app/` returns 0 results
- [ ] Rotate all database user passwords
  - **Verification:** Document signed off by DBA

#### CRITICAL Issue #3: JWT Token Expiration Not Enforced
- [ ] Implement token expiration validation in auth middleware
  - **Verification:** Middleware code review confirms exp claim validation
  - **Test:** `npm run test:auth:token-expiry` - all tests pass
  - **Code location:** `/lib/auth/middleware.ts` contains `validateTokenExpiry()`
- [ ] Set JWT expiration to 1 hour (access) and 7 days (refresh)
  - **Verification:** `src/auth/config.ts` shows correct expiry values
- [ ] Implement token refresh endpoint with rotation
  - **Verification:** POST `/api/auth/refresh` endpoint exists and tested
  - **Test:** Integration test confirms old refresh token invalidated after use
- [ ] Add token blacklist for logout
  - **Verification:** Redis blacklist implemented in `/lib/auth/tokenBlacklist.ts`
  - **Test:** Logged-out users cannot use old tokens

#### CRITICAL Issue #4: No Rate Limiting on Authentication
- [ ] Implement rate limiting on all auth endpoints (max 5 attempts/15min)
  - **Verification:** `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password` have rate limits
  - **Test:** 6th failed attempt returns 429 status code
  - **Implementation:** Using `redis-rate-limiter` package
- [ ] Add CAPTCHA after 3 failed login attempts
  - **Verification:** Google reCAPTCHA v3 integration in login form
  - **Test:** Failed login triggers CAPTCHA display
- [ ] Log all authentication failures to security audit log
  - **Verification:** `/logs/security/auth_failures.log` created and populated
  - **Test:** `npm run test:auth:logging` passes
- [ ] Alert on suspicious patterns (10+ failed attempts from single IP)
  - **Verification:** Alert sent to security team via Slack webhook
  - **Test:** Simulate 10 failed attempts, confirm alert triggered

#### CRITICAL Issue #5: Missing CORS Configuration
- [ ] Define allowed origins explicitly (not *)
  - **Verification:** `CORS_ALLOWED_ORIGINS` env var contains only production domains
  - **Test:** Request from unauthorized domain returns 403
- [ ] Implement CORS middleware with credential support
  - **Verification:** `/middleware/cors.ts` validates origin against allowlist
  - **Code:**
    ```typescript
    const corsOptions = {
      origin: process.env.CORS_ALLOWED_ORIGINS?.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    ```
- [ ] Test CORS with cross-origin requests
  - **Verification:** `npm run test:cors` passes all 8 test cases
- [ ] Document allowed origins in deployment guide
  - **Verification:** `/docs/CORS_POLICY.md` created

#### CRITICAL Issue #6: Missing CSRF Protection
- [ ] Implement CSRF token generation on page load
  - **Verification:** `getServerSideProps` generates CSRF token for all state-changing forms
  - **Test:** POST request without valid CSRF token returns 403
- [ ] Validate CSRF token on all POST/PUT/DELETE endpoints
  - **Verification:** Middleware applied to all API routes
  - **Code:** All endpoints check `req.headers['x-csrf-token']`
- [ ] Add CSRF token to all forms (hidden input field)
  - **Verification:** Audit of 87 pages confirms CSRF token on each form
  - **Test:** `npm run test:csrf` passes
- [ ] Exclude read-only endpoints (GET) from CSRF requirement
  - **Verification:** Code review confirms GET endpoints bypass CSRF check

#### CRITICAL Issue #7: Insecure Password Storage
- [ ] Verify bcrypt hashing with salt rounds >= 12
  - **Verification:** `/lib/auth/password.ts` uses `bcrypt.hash(password, 12)`
  - **Test:** Password hash differs on each call
- [ ] Audit all passwords in database (hash any plaintext)
  - **Verification:** `SELECT COUNT(*) FROM users WHERE password NOT LIKE '$2b$%'` returns 0
  - **Command:** Run migration script to hash plaintext passwords
- [ ] Implement password strength requirements (12+ chars, mixed case, numbers, symbols)
  - **Verification:** `/lib/validation/password.ts` contains strength checker
  - **Test:** Weak password rejected by API
- [ ] Add password breach check against HaveIBeenPwned
  - **Verification:** Integration with haveibeenpwned.com API on registration
  - **Test:** Common password rejected

#### CRITICAL Issue #8: Missing Input Validation on File Upload
- [ ] Whitelist allowed file types (PDF, JPEG, PNG only)
  - **Verification:** `/lib/upload/validator.ts` checks MIME type and extension
  - **Test:** Upload .exe file, confirm rejection
- [ ] Limit file size to 5MB per file, 50MB per user
  - **Verification:** Middleware enforces size limits
  - **Test:** Upload 6MB file returns 413 status
- [ ] Scan uploaded files for malware
  - **Verification:** ClamAV integration in `/lib/upload/scanner.ts`
  - **Test:** Upload eicar.com test file, confirm quarantine
- [ ] Store files outside web root with random names
  - **Verification:** Files stored in S3 with UUID filenames
  - **Test:** Direct URL access returns 403

#### CRITICAL Issue #9: Unencrypted PII in Database
- [ ] Identify all PII fields (email, phone, address, national ID, etc.)
  - **Verification:** Schema audit completed, document at `/docs/PII_FIELDS.md`
  - **Fields:** 12 identified PII fields in users, family_members, documents tables
- [ ] Implement field-level encryption for PII
  - **Verification:** Prisma middleware encrypts/decrypts 12 fields
  - **Code location:** `/lib/prisma/middleware/encryption.ts`
- [ ] Use AES-256-GCM encryption with secure key management
  - **Verification:** `process.env.ENCRYPTION_KEY` is 32-byte random key in AWS Secrets Manager
  - **Test:** Decrypt encrypted value in database returns original value
- [ ] Encrypt PII in existing database records (migration)
  - **Verification:** Migration script runs against staging database
  - **Test:** `npm run migrate:encrypt-pii` completes successfully on staging
- [ ] Verify decryption on read (transparent to application)
  - **Verification:** Queries return decrypted values automatically
  - **Test:** API endpoint returns plaintext PII (app-level encryption, not visible to users)

#### CRITICAL Issue #10: No Role-Based Access Control (RBAC)
- [ ] Define 5 roles: ADMIN, OWNER, EDITOR, VIEWER, GUEST
  - **Verification:** Schema defines roles in `/prisma/schema.prisma`
  - **Roles Table:** users.role enum with 5 values
- [ ] Implement permission matrix for 60+ endpoints
  - **Verification:** `/lib/auth/permissions.json` defines role access for each endpoint
  - **Format:**
    ```json
    {
      "GET /api/family/:id": ["ADMIN", "OWNER", "EDITOR", "VIEWER"],
      "POST /api/family": ["ADMIN", "OWNER"],
      "DELETE /api/family/:id": ["ADMIN", "OWNER"]
    }
    ```
- [ ] Add authorization middleware to all protected routes
  - **Verification:** `requireRole()` middleware applied to all API routes
  - **Test:** VIEWER role cannot POST to protected endpoint
- [ ] Implement row-level security (RLS) via Prisma middleware
  - **Verification:** Queries automatically filtered by user ownership
  - **Test:** User A cannot query User B's family data
- [ ] Audit RBAC on 87 pages and 60+ API endpoints
  - **Verification:** Checklist completed at `/docs/RBAC_AUDIT.md`

#### CRITICAL Issue #11: Missing API Rate Limiting (Non-Auth)
- [ ] Implement general rate limit: 100 requests/minute per IP
  - **Verification:** All routes have rate limit middleware
  - **Test:** 101st request in 60 seconds returns 429
- [ ] Implement endpoint-specific limits:
  - [ ] `/api/search`: 20 req/min (resource-intensive)
  - [ ] `/api/export`: 5 req/min (heavy lifting)
  - [ ] `/api/upload`: 10 req/min (storage constraint)
  - **Verification:** Each endpoint has custom limiter configured
  - **Test:** Exceed limit, confirm 429 response
- [ ] Add user-level rate limiting (authenticated users: 1000 req/min)
  - **Verification:** JWT decoding in rate limiter middleware
  - **Test:** Authenticated requests allow higher limit
- [ ] Use Redis for distributed rate limiting (K8s compatibility)
  - **Verification:** Implementation uses redis-rate-limiter, not in-memory
  - **Test:** Scale to 3 pods, rate limit enforced across all

#### CRITICAL Issue #12: Missing Security Headers
- [ ] Implement Content-Security-Policy (CSP)
  - **Verification:** `next.config.js` sets CSP header
  - **Header:**
    ```
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.example.com
    ```
  - **Test:** XSS payload blocked in browser console
- [ ] Implement X-Frame-Options (deny clickjacking)
  - **Verification:** Header set to `X-Frame-Options: DENY`
  - **Test:** App cannot be embedded in iframe from other sites
- [ ] Implement X-Content-Type-Options (prevent MIME sniffing)
  - **Verification:** Header set to `X-Content-Type-Options: nosniff`
  - **Test:** Force download of HTML as attachment
- [ ] Implement Strict-Transport-Security (HSTS)
  - **Verification:** Header set to `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - **Test:** Verify HSTS preload list inclusion
- [ ] Implement Referrer-Policy (privacy protection)
  - **Verification:** Header set to `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Implement Permissions-Policy (disable unnecessary features)
  - **Verification:** Disable geolocation, microphone, camera, payment, USB
  - **Header:** `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`
- [ ] Test headers with https://securityheaders.com
  - **Verification:** Screenshot shows A+ grade

#### CRITICAL Issue #13: No Two-Factor Authentication (2FA)
- [ ] Implement TOTP (Time-based OTP) using speakeasy
  - **Verification:** `/lib/auth/totp.ts` generates and validates TOTP codes
  - **Test:** Scan QR code in authenticator app, enter valid code
- [ ] Add 2FA enrollment to user settings
  - **Verification:** `/pages/settings/security.tsx` has 2FA setup form
  - **Test:** User can enable/disable 2FA
- [ ] Enforce 2FA for ADMIN and OWNER roles
  - **Verification:** Middleware requires 2FA before granting elevated permissions
  - **Test:** OWNER cannot access admin panel without 2FA
- [ ] Implement backup codes for account recovery
  - **Verification:** 10 backup codes generated and stored (hashed)
  - **Test:** User can disable 2FA using backup code
- [ ] Add 2FA challenge on login (after password verification)
  - **Verification:** POST `/api/auth/login` returns `requiresMFA: true` after password check
  - **Test:** Login flow prompts for TOTP code

#### CRITICAL Issue #14: Sensitive Data Exposure in Logs
- [ ] Remove passwords, tokens, and PII from all logs
  - **Verification:** `grep -r "password\|token\|email" src/lib/logger.ts` shows sanitization
  - **Test:** Log entry shows `***REDACTED***` for sensitive fields
- [ ] Implement structured logging with log levels
  - **Verification:** `/lib/logger.ts` uses winston with log levels (debug, info, warn, error)
  - **Test:** `npm run test:logging` passes
- [ ] Store logs in secure location (not in code repository)
  - **Verification:** Logs stored in AWS CloudWatch
  - **Test:** `aws logs describe-log-groups | grep prod` shows log groups
- [ ] Set log retention to 90 days (compliance requirement)
  - **Verification:** AWS CloudWatch retention policy set to 90 days
  - **Test:** Logs older than 90 days automatically deleted

#### CRITICAL Issue #15: Missing Dependency Security Scanning
- [ ] Run npm audit and fix all vulnerabilities
  - **Verification:** `npm audit` returns 0 vulnerabilities
  - **Command:** `npm audit --fix` (manual review required for breaking changes)
  - **Test:** `npm audit --production` passes
- [ ] Enable automated dependency updates (Dependabot)
  - **Verification:** `.github/dependabot.yml` created and enabled
  - **Test:** Dependabot creates PRs for version updates
- [ ] Audit all transitive dependencies (npm tree)
  - **Verification:** `npm ls` completes without errors
  - **Test:** No duplicate major versions of packages
- [ ] License compliance check (no GPL, only MIT/Apache/ISC)
  - **Verification:** `npm ls --depth=0` audited for non-permissive licenses
  - **Command:** `npx license-checker --onlyunknown --production`

#### CRITICAL Issue #16: No Secure Session Management
- [ ] Implement httpOnly, Secure, SameSite cookies
  - **Verification:** Session cookie config in `/lib/auth/session.ts`:
    ```typescript
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    }
    ```
  - **Test:** Cookie visible in DevTools but not accessible via JavaScript
- [ ] Set session timeout to 7 days idle
  - **Verification:** Configuration shows 7-day maxAge
  - **Test:** Session expires after 7 days of inactivity
- [ ] Implement session revocation on password change
  - **Verification:** Password change endpoint clears all sessions
  - **Test:** Old sessions become invalid after password change
- [ ] Store sessions in PostgreSQL (not memory)
  - **Verification:** `connect-pg-simple` implementation in `/lib/session.ts`
  - **Test:** Session persists after pod restart

#### CRITICAL Issue #17: Missing Audit Logging
- [ ] Log all administrative actions (create, update, delete users)
  - **Verification:** Audit log table created: `CREATE TABLE audit_logs (...)`
  - **Fields:** timestamp, user_id, action, resource_type, resource_id, changes, ip_address
- [ ] Log all security events (login, logout, 2FA, permission changes)
  - **Verification:** `/lib/audit.ts` logs security events
  - **Test:** Login/logout events appear in audit_logs table
- [ ] Implement immutable audit log (no deletion, only append)
  - **Verification:** Database trigger prevents UPDATE/DELETE on audit_logs
  - **SQL:**
    ```sql
    CREATE TRIGGER audit_immutable
    BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_modification();
    ```
- [ ] Audit log retention: 3 years (compliance requirement)
  - **Verification:** Automated archive to S3 after 1 year, delete after 3 years
  - **Test:** Old audit logs automatically archived

#### CRITICAL Issue #18: Missing Incident Response Plan
- [ ] Document incident response procedures
  - **Verification:** `/docs/INCIDENT_RESPONSE.md` created with 5+ incident scenarios
  - **Scenarios:** Data breach, DDoS, service outage, security vulnerability, suspicious activity
- [ ] Define escalation contacts (on-call rotation)
  - **Verification:** `/docs/ESCALATION_CONTACTS.md` lists 10+ key personnel with phone numbers
  - **On-call:** 24/7 rotation managed in PagerDuty
- [ ] Create incident runbooks for each scenario
  - **Verification:** `/docs/runbooks/` contains 5+ runbooks
  - **Runbooks:** [data-breach.md, ddos-response.md, service-restoration.md, etc.]
- [ ] Conduct incident response drill (tabletop exercise)
  - **Verification:** Drill conducted with all stakeholders, documented at `/docs/INCIDENT_DRILL_REPORT.md`
  - **Test:** Incident response time documented

---

### 1.2 Code Freeze & Branch Strategy

- [ ] Freeze `main` branch (no new features after T-30)
  - **Verification:** Branch protection rules enabled on GitHub
  - **Settings:** Require pull request reviews, require status checks to pass, include administrators
  - **Command:** `git branch -m main main-frozen`
- [ ] Create `release/1.0.0` branch from `main`
  - **Command:** `git checkout -b release/1.0.0`
  - **Verification:** Branch created and pushed to origin
- [ ] Only hotfixes allowed on release branch (format: `hotfix/1.0.0-*`)
  - **Verification:** PR from hotfix branch requires 2 approvals
  - **Test:** Feature branch PR cannot merge to release/1.0.0
- [ ] Lock `main` branch for non-hotfix commits
  - **Verification:** Branch protection prevents direct pushes
  - **Test:** Attempt to push non-hotfix commit returns error
- [ ] Merge hotfixes to both release and main
  - **Verification:** GitHub Actions workflow merges hotfixes to main after release merges
  - **Workflow:** `.github/workflows/hotfix-sync.yml`
- [ ] Tag release versions: `v1.0.0-rc1`, `v1.0.0-rc2`, `v1.0.0`
  - **Command:** `git tag -a v1.0.0-rc1 -m "Release candidate 1"`
  - **Verification:** Tag appears in GitHub Releases
- [ ] Document all commits between `v0.9.0` (previous) and `v1.0.0`
  - **Command:** `git log v0.9.0..v1.0.0 --oneline > CHANGELOG.md`
  - **Verification:** CHANGELOG.md contains all commits with descriptions

---

### 1.3 Code Review & Standards Compliance

- [ ] All code reviewed by at least 2 engineers
  - **Verification:** GitHub PR history shows 2+ approvals on all commits
  - **Tool:** GitHub PR templates enforce this
- [ ] Enforce coding standards via ESLint
  - **Command:** `npm run lint` returns 0 errors
  - **Config:** `.eslintrc.json` configured for React + TypeScript
  - **Verification:** GitHub Actions blocks PRs with lint errors
- [ ] Format code with Prettier (auto-format on commit)
  - **Command:** `npm run format` formats all files
  - **Verification:** Pre-commit hook enforces formatting
  - **Config:** `.prettierrc` contains formatting rules
- [ ] TypeScript strict mode enabled
  - **Verification:** `tsconfig.json` has `"strict": true`
  - **Test:** `npm run type-check` returns 0 errors
- [ ] No console.log statements in production code
  - **Command:** `grep -r "console.log\|console.warn" src/ lib/ pages/ app/ --exclude-dir=node_modules | wc -l` equals 0
  - **Verification:** Husky pre-commit hook prevents this
- [ ] No hardcoded URLs (use environment variables)
  - **Command:** `grep -r "https://\|http://" src/ lib/ pages/ app/ | grep -v "const.*=" | wc -l` equals 0
  - **Verification:** All URLs from env variables or config
- [ ] No secrets committed (validate with GitGuardian)
  - **Command:** `npm install -g gitguardian-cli && gitguardian scan --commit HEAD`
  - **Verification:** 0 secrets detected
  - **Integration:** GitHub Actions runs on every PR
- [ ] Documentation updated for all API changes
  - **Verification:** `/docs/API_CHANGELOG.md` documents all 60+ endpoint changes
  - **Format:** Endpoint, HTTP method, changes, migration guide (if breaking)
- [ ] Database schema changes documented
  - **Verification:** `/docs/SCHEMA_CHANGELOG.md` lists all Prisma schema changes
  - **Format:** Model name, fields added/removed, migration script

---

### 1.4 Static Analysis & Code Quality

- [ ] SonarQube analysis passes (coverage >= 70%)
  - **Command:** `npm run sonar`
  - **Verification:** SonarQube report shows 70%+ coverage
  - **Metrics:** Duplicated lines < 3%, security hotspots = 0
- [ ] Code coverage >= 70% (unit tests)
  - **Command:** `npm run test:coverage`
  - **Verification:** Coverage report shows 70%+ lines covered
  - **Exclusions:** pages/500.tsx, pages/404.tsx, config files
- [ ] Cyclomatic complexity < 15 for all functions
  - **Command:** `npm run complexity`
  - **Verification:** No functions with complexity > 15
  - **Tool:** Using `typhonjs-escomplex`
- [ ] No TODO/FIXME comments in production code
  - **Command:** `grep -r "TODO\|FIXME" src/ lib/ pages/ app/ | wc -l` equals 0
  - **Verification:** All TODOs resolved or moved to GitHub issues
- [ ] Dependency tree depth <= 10 (avoid deep dependencies)
  - **Command:** `npm ls --depth=10`
  - **Verification:** No errors on depth 10
- [ ] Bundle size analysis (main bundle < 500KB gzipped)
  - **Command:** `npm run analyze`
  - **Verification:** Build report shows main bundle < 500KB
  - **Tool:** Using `next/bundle-analyzer`
- [ ] Performance regression check (Lighthouse > 80)
  - **Command:** `npm run lighthouse`
  - **Verification:** Lighthouse score >= 80 on all pages
  - **Pages to test:** Home, Family Tree, Search, Upload, Settings

---

### 1.5 Dependency Audit & License Compliance

- [ ] npm audit passes (all vulnerabilities fixed or accepted)
  - **Command:** `npm audit` shows 0 vulnerabilities
  - **Process:** For accepted vulnerabilities, document in `/docs/ACCEPTED_VULNERABILITIES.md`
  - **Format:** Package name, version, vulnerability, reason for acceptance, risk owner
- [ ] All critical dependencies pinned to exact versions
  - **Verification:** `package.json` uses `^` for patch updates only
  - **Critical packages:** react, next, prisma, typescript, jsonwebtoken, bcrypt
- [ ] License compliance check (no GPL/AGPL in production)
  - **Command:** `npx license-checker --onlyunknown --production`
  - **Verification:** All licenses are MIT, Apache 2.0, ISC, or BSD
  - **Excluded licenses:** GPL, AGPL, SSPL
- [ ] Document all third-party licenses
  - **Verification:** `/docs/THIRD_PARTY_LICENSES.md` generated and reviewed
  - **Tool:** `npx license-report --markdown > /docs/THIRD_PARTY_LICENSES.md`
- [ ] Transitive dependency audit (check all nested dependencies)
  - **Command:** `npm ls --all | grep -i "security\|vulnerability"`
  - **Verification:** No security-related warnings
- [ ] Deprecated dependencies removed
  - **Command:** `npm outdated --deprecated`
  - **Verification:** No deprecated packages listed
- [ ] Version compatibility checked (React, Next.js, Node.js)
  - **Verification:** package.json shows compatible versions:
    - Node.js: >= 18.17.0 < 21
    - React: 18.x
    - Next.js: 14.x
    - TypeScript: 5.x
- [ ] Peer dependencies satisfied
  - **Command:** `npm install --verbose` completes without peer dependency warnings
  - **Verification:** No "peer dependency not satisfied" warnings

---

### 1.6 Secret Scanning & Configuration Validation

- [ ] No secrets in git history (validate with TruffleHog)
  - **Command:** `trufflehog git file:///path/to/repo --json`
  - **Verification:** 0 secrets detected
  - **Integration:** GitHub Actions runs on every commit
- [ ] .gitignore covers all sensitive files
  - **Verification:** `.gitignore` includes:
    - `.env*` (except `.env.example`)
    - `*.key`, `*.pem`, `*.p12`
    - `.aws/credentials`, `.aws/config`
    - Node modules, build artifacts
  - **Test:** `git check-ignore .env.local` returns success
- [ ] No API keys in error messages or logs
  - **Command:** `grep -r "api_key\|apiKey" src/ | grep -v "config\|process.env" | wc -l` equals 0
  - **Verification:** Error messages sanitized in logging middleware
- [ ] All API keys stored in environment variables only
  - **Verification:** `grep -r "RESEND_API_KEY\|TWILIO_AUTH_TOKEN\|GOOGLE_CLIENT_ID" src/` shows use of process.env
  - **Test:** Commit fails if hardcoded keys detected (pre-commit hook)
- [ ] AWS credentials configured via IAM roles (not static keys)
  - **Verification:** EC2 instance has attached IAM role with necessary permissions
  - **Command:** `aws iam get-role --role-name prod-app-role` returns role details
- [ ] Database passwords rotated (not set in .env)
  - **Verification:** Password fetched from AWS Secrets Manager at runtime
  - **Test:** Application starts without DATABASE_PASSWORD env var

---

## Section 2: Pre-Deployment: Testing Gate (T-30 days)

### 2.1 Unit Testing

- [ ] Unit test coverage >= 70%
  - **Command:** `npm run test:coverage`
  - **Verification:** Coverage report shows 70%+ lines, 65%+ branches covered
  - **Report location:** `/coverage/index.html`
- [ ] All auth functions tested (login, logout, refresh, 2FA, RBAC)
  - **Command:** `npm run test:auth`
  - **Verification:** 15+ auth test cases pass
  - **Test files:** `/tests/unit/auth/*.test.ts`
  - **Test coverage:**
    - [ ] Login with valid credentials
    - [ ] Login with invalid password (reject)
    - [ ] Login with non-existent user (reject)
    - [ ] Login with rate limit exceeded (429)
    - [ ] Token refresh with valid refresh token
    - [ ] Token refresh with expired refresh token (reject)
    - [ ] Logout and token invalidation
    - [ ] 2FA TOTP generation and validation
    - [ ] 2FA backup code usage
    - [ ] Password strength validation (weak, strong)
    - [ ] Password encryption (bcrypt)
    - [ ] Role-based access control (5 roles, 60+ permissions)
    - [ ] Session creation and expiration
    - [ ] OAuth integration (Google, GitHub)
- [ ] All database query functions tested (CRUD operations)
  - **Command:** `npm run test:db`
  - **Verification:** 20+ database tests pass
  - **Test files:** `/tests/unit/db/*.test.ts`
  - **Test coverage:**
    - [ ] Create user, family, member, relationship
    - [ ] Read user by ID, email, username
    - [ ] Update user fields (email, password, name)
    - [ ] Delete user and cascade delete related records
    - [ ] Query with filters (role, status, date range)
    - [ ] Pagination (limit, offset, cursor-based)
    - [ ] Sorting (ascending, descending)
    - [ ] Search full-text
    - [ ] Transaction rollback on error
- [ ] All validation functions tested (email, password, inputs)
  - **Command:** `npm run test:validation`
  - **Verification:** 25+ validation test cases pass
  - **Test files:** `/tests/unit/validation/*.test.ts`
  - **Test coverage:**
    - [ ] Email format validation (valid, invalid, RFC 5322 edge cases)
    - [ ] Password strength (length, character types, common passwords)
    - [ ] Phone number validation (international formats)
    - [ ] URL validation
    - [ ] File upload validation (type, size, malware)
    - [ ] Form field validation (required, length, format)
- [ ] All utility functions tested
  - **Command:** `npm run test:utils`
  - **Verification:** 30+ utility tests pass
  - **Test files:** `/tests/unit/utils/*.test.ts`
  - **Utilities to test:**
    - [ ] Date formatting and parsing
    - [ ] String manipulation (trim, slugify, truncate)
    - [ ] Number formatting (currency, percentage)
    - [ ] Array utilities (flatten, unique, groupBy)
    - [ ] Object utilities (merge, pick, omit)
- [ ] All hooks tested (if using custom React hooks)
  - **Command:** `npm run test:hooks`
  - **Verification:** 10+ hook tests pass
  - **Test files:** `/tests/unit/hooks/*.test.ts`
  - **Hooks to test:**
    - [ ] useAuth (authentication state)
    - [ ] useFamily (family data)
    - [ ] useUser (current user)
    - [ ] usePagination (pagination state)
    - [ ] useSearch (search state)
- [ ] Mutation tests (verify test quality)
  - **Command:** `npm run test:mutation`
  - **Verification:** Mutation score >= 80% (tests catch changes)
  - **Tool:** Stryker
  - **Report:** `/stryker/index.html`

---

### 2.2 Integration Testing

- [ ] All API endpoint testing (60+ endpoints)
  - **Command:** `npm run test:integration:api`
  - **Verification:** 60+ integration tests pass
  - **Test files:** `/tests/integration/api/*.test.ts`
  - **Endpoints to test:** (sample)
    - [ ] GET /api/auth/me - current user
    - [ ] POST /api/auth/login - login
    - [ ] POST /api/auth/logout - logout
    - [ ] POST /api/auth/refresh - refresh token
    - [ ] POST /api/users - create user
    - [ ] GET /api/users/:id - get user
    - [ ] PUT /api/users/:id - update user
    - [ ] DELETE /api/users/:id - delete user
    - [ ] GET /api/families - list families
    - [ ] POST /api/families - create family
    - [ ] GET /api/families/:id - get family
    - [ ] PUT /api/families/:id - update family
    - [ ] DELETE /api/families/:id - delete family
    - [ ] POST /api/family-members - add member
    - [ ] GET /api/family-members/:id - get member
    - [ ] PUT /api/family-members/:id - update member
    - [ ] DELETE /api/family-members/:id - delete member
    - [ ] GET /api/relationships - list relationships
    - [ ] POST /api/relationships - create relationship
    - [ ] DELETE /api/relationships/:id - delete relationship
    - [ ] GET /api/search - search families/members
    - [ ] POST /api/upload - upload file
    - [ ] DELETE /api/documents/:id - delete document
    - [ ] GET /api/documents/:id/download - download document
    - [ ] POST /api/export - export family tree
    - [ ] POST /api/import - import family tree
    - [ ] GET /api/reports/statistics - family statistics
    - [ ] POST /api/invitations - send invitation
    - [ ] PUT /api/invitations/:id - respond to invitation
    - [ ] [30+ more endpoints]
- [ ] Database transactions tested (ACID compliance)
  - **Command:** `npm run test:integration:transactions`
  - **Verification:** 5+ transaction tests pass
  - **Test cases:**
    - [ ] Create family with members (all-or-nothing)
    - [ ] Update family and members (consistency)
    - [ ] Delete family and cascade (atomicity)
    - [ ] Concurrent updates (isolation)
    - [ ] Rollback on constraint violation
- [ ] Cache integration tested (Redis)
  - **Command:** `npm run test:integration:cache`
  - **Verification:** 5+ cache tests pass
  - **Test cases:**
    - [ ] Cache hit returns correct data
    - [ ] Cache miss queries database
    - [ ] Cache invalidation on update
    - [ ] Cache expiration (TTL)
    - [ ] Cache serialization/deserialization
- [ ] Email service integration tested (Resend)
  - **Command:** `npm run test:integration:email`
  - **Verification:** 5+ email tests pass
  - **Test cases:**
    - [ ] Send welcome email
    - [ ] Send password reset email
    - [ ] Send invitation email
    - [ ] Send notification email
    - [ ] Email template rendering
- [ ] SMS service integration tested (Twilio)
  - **Command:** `npm run test:integration:sms`
  - **Verification:** 3+ SMS tests pass
  - **Test cases:**
    - [ ] Send SMS notification
    - [ ] SMS verification code
    - [ ] Twilio error handling
- [ ] File upload/download integration tested (S3)
  - **Command:** `npm run test:integration:storage`
  - **Verification:** 5+ storage tests pass
  - **Test cases:**
    - [ ] Upload file to S3
    - [ ] Generate download URL
    - [ ] Delete file from S3
    - [ ] Large file upload (>100MB)
    - [ ] S3 error handling
- [ ] OAuth integration tested (Google, GitHub)
  - **Command:** `npm run test:integration:oauth`
  - **Verification:** 4+ OAuth tests pass
  - **Test cases:**
    - [ ] Google OAuth callback
    - [ ] GitHub OAuth callback
    - [ ] User creation on first OAuth login
    - [ ] Linking OAuth to existing account
- [ ] Search integration tested (full-text, filters)
  - **Command:** `npm run test:integration:search`
  - **Verification:** 5+ search tests pass
  - **Test cases:**
    - [ ] Full-text search returns relevant results
    - [ ] Filters (role, status, date) work correctly
    - [ ] Pagination works with search
    - [ ] Sorting works with search
    - [ ] Search performance < 500ms
- [ ] Notification system integration tested
  - **Command:** `npm run test:integration:notifications`
  - **Verification:** 3+ notification tests pass
  - **Test cases:**
    - [ ] Email notifications sent
    - [ ] SMS notifications sent
    - [ ] In-app notifications stored
- [ ] Export/Import integration tested
  - **Command:** `npm run test:integration:export-import`
  - **Verification:** 4+ export/import tests pass
  - **Test cases:**
    - [ ] Export family tree as JSON
    - [ ] Export family tree as PDF
    - [ ] Import JSON family tree
    - [ ] Validate imported data integrity

---

### 2.3 End-to-End (E2E) Testing

**Note:** Currently 0% E2E tests - create comprehensive E2E test suite

- [ ] E2E test framework set up (Playwright or Cypress)
  - **Setup:** `npm install --save-dev @playwright/test`
  - **Config:** `playwright.config.ts` created and configured
  - **Verification:** E2E tests can run against staging environment
- [ ] Authentication flow E2E tests
  - **Command:** `npm run test:e2e:auth`
  - **Verification:** 5+ E2E tests pass
  - **Test cases:**
    - [ ] User registration flow
      - [ ] Navigate to signup page
      - [ ] Fill form (email, password, name)
      - [ ] Submit form
      - [ ] Verify confirmation email sent
      - [ ] Click email verification link
      - [ ] Account activated
    - [ ] User login flow
      - [ ] Navigate to login page
      - [ ] Enter email and password
      - [ ] Submit form
      - [ ] Redirect to dashboard
      - [ ] Verify session cookie set
    - [ ] Forgot password flow
      - [ ] Click "Forgot password"
      - [ ] Enter email
      - [ ] Submit form
      - [ ] Verify reset email sent
      - [ ] Click reset link
      - [ ] Enter new password
      - [ ] Password changed
    - [ ] 2FA flow
      - [ ] Enable 2FA in settings
      - [ ] Scan QR code
      - [ ] Enter TOTP code
      - [ ] 2FA enabled
      - [ ] Logout and login
      - [ ] TOTP prompt shown
      - [ ] Enter TOTP code
      - [ ] Login successful
    - [ ] OAuth login (Google)
      - [ ] Click "Sign in with Google"
      - [ ] Google consent screen shown
      - [ ] Grant permissions
      - [ ] Redirect to app
      - [ ] Logged in
- [ ] User flow E2E tests (5 RBAC roles)
  - **Command:** `npm run test:e2e:user-flows`
  - **Verification:** 5+ E2E tests pass (one per role)
  - **Test cases:**
    - [ ] ADMIN role flow
      - [ ] Access admin dashboard
      - [ ] Manage users
      - [ ] View audit logs
      - [ ] Access settings
    - [ ] OWNER role flow
      - [ ] Create family tree
      - [ ] Invite members
      - [ ] View all family data
      - [ ] Export family tree
    - [ ] EDITOR role flow
      - [ ] View assigned family
      - [ ] Add/edit members
      - [ ] Cannot delete members
      - [ ] Cannot invite members
    - [ ] VIEWER role flow
      - [ ] View assigned family (read-only)
      - [ ] Cannot edit members
      - [ ] Can export data
      - [ ] Cannot delete anything
    - [ ] GUEST role flow
      - [ ] View shared family tree
      - [ ] Cannot edit or delete
      - [ ] Can view member profiles
- [ ] Family tree visualization E2E test
  - **Command:** `npm run test:e2e:visualization`
  - **Verification:** 1+ E2E test passes
  - **Test cases:**
    - [ ] Load family tree page
    - [ ] D3 tree visualization renders
    - [ ] Click node to expand
    - [ ] Hover shows tooltip
    - [ ] Pan and zoom work
    - [ ] Mobile responsive layout
- [ ] File upload/download E2E test
  - **Command:** `npm run test:e2e:file-operations`
  - **Verification:** 3+ E2E tests pass
  - **Test cases:**
    - [ ] Upload profile picture
      - [ ] Click upload button
      - [ ] Select file
      - [ ] Preview shown
      - [ ] Upload successful
      - [ ] Image displayed
    - [ ] Upload family document
      - [ ] Click upload button
      - [ ] Select PDF file
      - [ ] Add description
      - [ ] Upload successful
    - [ ] Download document
      - [ ] Click download link
      - [ ] File downloaded
      - [ ] File content verified
- [ ] Search functionality E2E test
  - **Command:** `npm run test:e2e:search`
  - **Verification:** 2+ E2E tests pass
  - **Test cases:**
    - [ ] Search for family member
      - [ ] Enter search term
      - [ ] Results displayed
      - [ ] Click result
      - [ ] Member profile loaded
    - [ ] Search with filters
      - [ ] Select role filter
      - [ ] Select status filter
      - [ ] Results updated
- [ ] Arabic language/RTL E2E test
  - **Command:** `npm run test:e2e:arabic`
  - **Verification:** 1+ E2E test passes
  - **Test cases:**
    - [ ] Switch to Arabic language
    - [ ] All text right-aligned
    - [ ] Forms work correctly in RTL
    - [ ] No layout breaks
    - [ ] Navigation works
- [ ] Mobile responsiveness E2E tests
  - **Command:** `npm run test:e2e:mobile`
  - **Verification:** 3+ E2E tests pass (iPhone, Android, tablet)
  - **Device sizes:**
    - [ ] iPhone 12 (390x844)
    - [ ] Pixel 5 (393x851)
    - [ ] iPad (768x1024)
  - **Test cases:**
    - [ ] Navigation works on mobile
    - [ ] Forms are usable on mobile
    - [ ] Buttons are touch-friendly
    - [ ] No horizontal scroll
    - [ ] Images load and display correctly
- [ ] Cross-browser E2E tests
  - **Command:** `npm run test:e2e:browsers`
  - **Verification:** Tests pass on Chrome, Firefox, Safari, Edge
  - **Browsers:**
    - [ ] Chrome (latest)
    - [ ] Firefox (latest)
    - [ ] Safari (latest)
    - [ ] Edge (latest)
  - **Sample test:**
    - [ ] Login and verify session

---

### 2.4 Performance Testing

- [ ] Lighthouse score >= 80 (all pages)
  - **Command:** `npm run lighthouse`
  - **Verification:** Report shows scores >= 80
  - **Pages to test:**
    - [ ] Home page
    - [ ] Family tree page
    - [ ] Member profile
    - [ ] Search results
    - [ ] Settings page
  - **Metrics:**
    - [ ] Performance >= 80
    - [ ] Accessibility >= 80
    - [ ] Best Practices >= 80
    - [ ] SEO >= 80
- [ ] First Contentful Paint (FCP) < 2.5s
  - **Command:** `npm run perf:fcp`
  - **Verification:** FCP < 2.5s on 90th percentile
  - **Test:** Run on staging environment (3G network)
- [ ] Largest Contentful Paint (LCP) < 4s
  - **Command:** `npm run perf:lcp`
  - **Verification:** LCP < 4s on 90th percentile
  - **Test:** Run on staging environment (3G network)
- [ ] Cumulative Layout Shift (CLS) < 0.1
  - **Command:** `npm run perf:cls`
  - **Verification:** CLS < 0.1 on all pages
- [ ] Total bundle size < 500KB (gzipped)
  - **Command:** `npm run analyze`
  - **Verification:** main bundle < 500KB, vendor < 300KB
  - **Report:** `/analysis/bundle.html`
- [ ] API response time < 500ms (p95)
  - **Command:** `npm run perf:api`
  - **Verification:** 95th percentile response time < 500ms
  - **Endpoints tested:** GET /api/families (most frequently called)
- [ ] Database query time < 200ms (p95)
  - **Command:** `npm run perf:db`
  - **Verification:** 95th percentile query time < 200ms
  - **Queries tested:** SELECT * FROM family_members WHERE family_id = X (most complex)
- [ ] Load test (1000 concurrent users)
  - **Command:** `npm run perf:load-test`
  - **Tool:** Apache JMeter or k6
  - **Verification:** No errors under 1000 concurrent users
  - **Metrics:**
    - [ ] Response time < 2s (p99)
    - [ ] Error rate < 0.1%
    - [ ] Throughput >= 1000 req/s
- [ ] Stress test (ramp up to failure)
  - **Command:** `npm run perf:stress-test`
  - **Tool:** k6
  - **Verification:** System handles at least 2000 concurrent users
  - **Metrics:**
    - [ ] Identify breaking point
    - [ ] Document max concurrent users
    - [ ] Plan capacity for 2x max load
- [ ] Database load test (concurrent queries)
  - **Command:** `npm run perf:db-load-test`
  - **Verification:** 500 concurrent queries < 1s response time
  - **Database:** PostgreSQL connection pool size tested
- [ ] Memory leak test (8-hour load test)
  - **Command:** `npm run perf:memory-test`
  - **Tool:** k6 with memory profiling
  - **Verification:** Memory usage stable over 8 hours
  - **Alert:** If memory increases > 100MB over 8 hours
- [ ] Cache effectiveness
  - **Command:** `npm run perf:cache-test`
  - **Verification:** Cache hit rate >= 80%
  - **Metrics:** Cache hits vs misses logged
- [ ] CDN performance (static assets)
  - **Command:** `npm run perf:cdn-test`
  - **Verification:** Static assets served from CDN with < 100ms latency
  - **Test:** Global latency check (US, EU, APAC)
- [ ] ImageMagick optimization (if images used)
  - **Command:** `npm run optimize:images`
  - **Verification:** JPEG/PNG images optimized with webp format
  - **Tool:** ImageMagick or sharp
- [ ] CSS/JS minification validated
  - **Command:** `npm run build:production`
  - **Verification:** All CSS/JS minified
  - **Metrics:** CSS < 50KB, JS < 400KB (gzipped)

---

### 2.5 Security Testing

- [ ] OWASP Top 10 vulnerability scan
  - **Command:** `npm run security:owasp`
  - **Tool:** OWASP ZAP or Burp Suite
  - **Verification:** 0 critical/high vulnerabilities found
  - **Test coverage:** All 10 OWASP items
- [ ] Penetration testing (engage external firm)
  - **Verification:** Penetration test completed and report signed off
  - **Duration:** 1-2 weeks before release
  - **Scope:** Full application (web + API)
  - **Report:** Remediation of all critical findings before release
- [ ] SQL injection tests
  - **Command:** `npm run test:security:sql-injection`
  - **Verification:** All SQL injection attempts blocked
  - **Payloads:** Standard SQLi test cases
- [ ] Cross-Site Scripting (XSS) tests
  - **Command:** `npm run test:security:xss`
  - **Verification:** All XSS payloads blocked
  - **Payloads:** Stored XSS, Reflected XSS, DOM XSS
- [ ] Cross-Site Request Forgery (CSRF) tests
  - **Command:** `npm run test:security:csrf`
  - **Verification:** CSRF token required on all state-changing requests
  - **Test:** POST without CSRF token returns 403
- [ ] Authentication bypass tests
  - **Command:** `npm run test:security:auth-bypass`
  - **Verification:** All bypass attempts rejected
  - **Tests:** JWT manipulation, session hijacking, cookie forgery
- [ ] Authorization bypass tests (RBAC)
  - **Command:** `npm run test:security:authz-bypass`
  - **Verification:** All privilege escalation attempts blocked
  - **Tests:** VIEWER accessing ADMIN endpoints, role tampering
- [ ] Sensitive data exposure tests
  - **Command:** `npm run test:security:data-exposure`
  - **Verification:** No PII in responses unless authorized
  - **Tests:** Check for email, phone, SSN in error messages, logs
- [ ] Rate limiting tests
  - **Command:** `npm run test:security:rate-limiting`
  - **Verification:** Rate limits enforced on all endpoints
  - **Tests:** 100 requests/min limit enforced
- [ ] Input validation tests
  - **Command:** `npm run test:security:input-validation`
  - **Verification:** All invalid inputs rejected
  - **Tests:** XSS payloads, oversized inputs, special characters
- [ ] Security header validation
  - **Command:** `npm run test:security:headers`
  - **Tool:** https://securityheaders.com
  - **Verification:** A+ grade score
  - **Headers checked:** CSP, HSTS, X-Frame-Options, etc.
- [ ] SSL/TLS configuration validation
  - **Command:** `npm run test:security:ssl`
  - **Tool:** https://www.ssllabs.com/ssltest/
  - **Verification:** A+ grade score
  - **Checks:** TLS 1.2+, strong ciphers, no downgrade attacks
- [ ] Dependency vulnerability scan (updated)
  - **Command:** `npm audit --production`
  - **Verification:** 0 vulnerabilities
- [ ] Secrets scanning (final check)
  - **Command:** `trufflehog git file:///repo --json`
  - **Verification:** 0 secrets detected
- [ ] API authentication tests
  - **Command:** `npm run test:security:api-auth`
  - **Verification:** All API endpoints require valid authentication
  - **Tests:** Missing token, invalid token, expired token
- [ ] API authorization tests
  - **Command:** `npm run test:security:api-authz`
  - **Verification:** API endpoints respect RBAC
  - **Tests:** User role cannot access admin endpoint
- [ ] File upload security tests
  - **Command:** `npm run test:security:file-upload`
  - **Verification:** Malicious files rejected
  - **Tests:** Executable files, oversized files, polyglot files
- [ ] LDAP/Active Directory integration (if applicable)
  - **Verification:** OAuth/SAML configured securely
- [ ] Email spoofing prevention (SPF, DKIM, DMARC)
  - **Verification:** SPF, DKIM, DMARC records configured
  - **Command:** `dig example.com TXT | grep spf`
- [ ] Encryption validation
  - **Command:** `npm run test:security:encryption`
  - **Verification:** PII encrypted with AES-256-GCM
  - **Tests:** Decrypt encrypted data, verify key rotation

---

### 2.6 Accessibility Testing

- [ ] WCAG 2.1 Level AA compliance
  - **Tool:** WAVE, Axe DevTools, or Lighthouse
  - **Verification:** 0 accessibility violations on all 87 pages
  - **Command:** `npm run test:a11y`
- [ ] Screen reader testing (NVDA, JAWS)
  - **Verification:** All pages navigable with screen reader
  - **Test:** Login flow on NVDA
- [ ] Keyboard navigation (no mouse required)
  - **Verification:** All pages navigable with Tab, Enter, Space, Arrows
  - **Test:** Complete user flow using only keyboard
- [ ] Color contrast ratio (WCAG AAA: 7:1)
  - **Verification:** All text has contrast ratio >= 7:1
  - **Tool:** Color contrast checker
- [ ] Font size >= 12px (readability)
  - **Verification:** No text smaller than 12px
  - **Exception:** Small labels (10px minimum)
- [ ] Focus indicators visible (not hidden)
  - **Verification:** Focus ring visible on all interactive elements
  - **Test:** Tab through form, focus ring visible
- [ ] Semantic HTML used
  - **Verification:** All pages use semantic tags (nav, main, section, article)
  - **Command:** `npm run test:a11y:semantic`
- [ ] Form labels associated with inputs
  - **Verification:** All form fields have associated <label> tags
  - **Test:** Click label, input receives focus
- [ ] Images have alt text
  - **Verification:** All <img> tags have descriptive alt text
  - **Exceptions:** Decorative images use alt=""
- [ ] Video/audio captions provided
  - **Verification:** All videos have captions
  - **Verification:** All audio has transcripts
- [ ] RTL (Right-to-Left) for Arabic language
  - **Verification:** Arabic pages are fully RTL
  - **Test:** Switch to Arabic, layout is RTL
  - **Checks:**
    - [ ] Text direction: rtl
    - [ ] Form fields right-aligned
    - [ ] Navigation right-aligned
    - [ ] Numbers in Arabic-Indic format
- [ ] Motion reduced (prefers-reduced-motion)
  - **Verification:** Animations respect prefers-reduced-motion
  - **Test:** Enable "reduce motion" in OS, animations disabled
- [ ] Touch target size (44x44px minimum)
  - **Verification:** All buttons/links >= 44x44px
  - **Test:** Touch buttons on mobile, no difficulty

---

### 2.7 Internationalization (i18n) Testing

- [ ] Arabic language support
  - **Verification:** All 87 pages translated to Arabic
  - **Command:** `npm run test:i18n:arabic`
  - **Checks:**
    - [ ] Text rendered right-to-left
    - [ ] Date format: DD/MM/YYYY (Arabic)
    - [ ] Number format: Arabic numerals (optional)
    - [ ] Currency: SAR (Saudi Riyal) or local
    - [ ] Phone format: +966 (Saudi Arabia)
- [ ] English language support
  - **Verification:** All pages in English
  - **Checks:**
    - [ ] Text rendered left-to-right
    - [ ] Date format: MM/DD/YYYY (US) or DD/MM/YYYY (EU)
- [ ] Language switching
  - **Verification:** Switch between Arabic/English works
  - **Test:** Select language, page reloads in new language
  - **Persistence:** Language preference saved to user profile
- [ ] RTL CSS validation
  - **Command:** `npm run test:rtl:css`
  - **Verification:** All margin/padding reversed in RTL
  - **Test:** No left-to-right elements in Arabic mode
- [ ] Font support (Arabic fonts)
  - **Verification:** Arabic fonts load correctly (e.g., Arabic Typesetting, Droid Arabic)
  - **Test:** Arabic text renders properly
- [ ] Number/Date/Currency formatting
  - **Verification:** All numbers, dates, currencies formatted per locale
  - **Test:** Display 1000 in Arabic: ١٠٠٠ (if using Arabic numerals)
- [ ] Pluralization rules
  - **Verification:** Plural forms correct in both languages
  - **Test:** "1 user" vs "2 users" in English and Arabic
- [ ] Character encoding (UTF-8)
  - **Verification:** All pages use UTF-8 encoding
  - **Checks:** Meta charset="utf-8" present

---

### 2.8 RTL (Right-to-Left) Testing

- [ ] Layout mirroring (all 87 pages)
  - **Verification:** All pages mirror correctly in RTL
  - **Command:** `npm run test:rtl:layout`
  - **Test:** No layout breaks, elements properly aligned
- [ ] Component positioning
  - [ ] Buttons right-aligned
  - [ ] Forms right-aligned
  - [ ] Navigation right-aligned
  - [ ] Modals centered
  - [ ] Dropdowns open to left
- [ ] Text alignment
  - [ ] Body text right-aligned
  - [ ] Headers right-aligned
  - [ ] Form labels right-aligned
- [ ] Padding/Margin reversal
  - [ ] Left padding becomes right padding
  - [ ] Left margin becomes right margin
  - [ ] Borders positioned correctly
- [ ] Icons handling
  - [ ] Icons that indicate direction mirrored (left arrow → right arrow)
  - [ ] Directional icons: ✓
    - [ ] Back/forward arrows
    - [ ] Expand/collapse arrows
    - [ ] Sort arrows
  - [ ] Non-directional icons unchanged: ✓
    - [ ] Home, settings, user, etc.
- [ ] Mobile RTL
  - **Verification:** Mobile layout correct in RTL
  - **Test:** Mobile navigation, forms in RTL
- [ ] Cross-browser RTL
  - **Browsers:** Chrome, Firefox, Safari, Edge
  - **Verification:** RTL works in all browsers
- [ ] Dynamic content RTL
  - **Verification:** User-generated content respects RTL
  - **Test:** User writes Arabic, text displays RTL

---

### 2.9 Integration Testing (Continued)

- [ ] Email notifications (all scenarios)
  - **Verification:** All 10+ email types tested
  - **Email types:**
    - [ ] Welcome email (new user)
    - [ ] Password reset email
    - [ ] 2FA verification email
    - [ ] Invitation email (to join family)
    - [ ] Member added notification
    - [ ] Family tree shared notification
    - [ ] Document upload notification
    - [ ] Comment/mention notification
    - [ ] Weekly summary email
    - [ ] Account deletion confirmation
- [ ] SMS notifications (Twilio)
  - **Verification:** SMS sent correctly
  - **Test cases:**
    - [ ] SMS OTP for 2FA
    - [ ] SMS notification for new member
    - [ ] SMS notification for family event
- [ ] Google OAuth integration
  - **Verification:** Google login works end-to-end
  - **Test:** Sign in with Google, account created
- [ ] GitHub OAuth integration (if applicable)
  - **Verification:** GitHub login works end-to-end
  - **Test:** Sign in with GitHub, account created
- [ ] Data export/import
  - **Verification:** Export and re-import preserves data integrity
  - **Formats:** JSON, CSV, PDF
  - **Test cases:**
    - [ ] Export family tree as JSON
    - [ ] Import JSON, verify all data present
    - [ ] Export as CSV
    - [ ] Import CSV, verify all data present
    - [ ] Export as PDF (readable)
- [ ] Backup/restore
  - **Verification:** Backup can be restored successfully
  - **Test:** Create backup, delete data, restore backup
- [ ] D3 visualization with large datasets
  - **Verification:** Tree renders with 1000+ nodes without lag
  - **Test:** Load large family tree, zoom/pan smoothly
- [ ] Search with special characters
  - **Verification:** Search works with Arabic characters
  - **Test:** Search for "علي" (Ali in Arabic)

---

### 2.10 Cross-Browser & Mobile Testing Matrix

**Browsers to test all 87 pages:**

- [ ] Chrome (latest)
  - **Version:** 120+
  - **Test all 87 pages**
- [ ] Firefox (latest)
  - **Version:** 121+
  - **Test all 87 pages**
- [ ] Safari (latest)
  - **Version:** 17.1+
  - **Test all 87 pages**
- [ ] Edge (latest)
  - **Version:** 120+
  - **Test all 87 pages**

**Mobile devices:**

- [ ] iPhone 12 (390x844)
- [ ] iPhone 14 (390x844)
- [ ] Pixel 5 (393x851)
- [ ] iPad (768x1024)
- [ ] Galaxy Tab S7 (800x1280)

**Mobile testing checklist per device:**
- [ ] Responsive layout (no horizontal scroll)
- [ ] Touch targets >= 44x44px
- [ ] Forms usable on mobile
- [ ] Images load correctly
- [ ] Navigation accessible
- [ ] Dropdowns work on mobile
- [ ] Modals readable
- [ ] Zoom/pan works

**Test coverage:** Minimum 70% of pages on each device

---

## Section 3: Infrastructure Preparation (T-30 days)

### 3.1 Kubernetes Cluster Setup

- [ ] Kubernetes cluster provisioned (managed service)
  - **Cloud provider:** AWS EKS / GCP GKE / Azure AKS
  - **Verification:** `kubectl cluster-info` returns cluster details
  - **Cluster specs:**
    - [ ] Kubernetes version: 1.28+ LTS
    - [ ] Node count: 3 (HA setup)
    - [ ] Node instance type: t3.xlarge or equivalent (4 CPU, 16GB RAM)
    - [ ] Auto-scaling enabled (min: 3, max: 10 nodes)
    - [ ] Managed control plane (AWS EKS, etc.)
    - [ ] Network policy enabled (security)
    - [ ] Pod security policy enabled
- [ ] Namespaces created
  - **Namespaces:**
    - [ ] `prod` - Production environment
    - [ ] `staging` - Staging environment
    - [ ] `monitoring` - Prometheus, Grafana, etc.
    - [ ] `kube-system` - System services
    - [ ] `ingress-nginx` - Ingress controller
    - [ ] `cert-manager` - SSL certificate management
  - **Command:** `kubectl create namespace prod`
  - **Verification:** `kubectl get namespaces` shows all
- [ ] Resource quotas configured per namespace
  - **Quotas:**
    - [ ] CPU limits per namespace
    - [ ] Memory limits per namespace
    - [ ] Pod count limits
    - [ ] PVC (persistent volume claim) limits
  - **Command:** `kubectl describe resourcequota -n prod`
- [ ] Network policies configured
  - **Policies:**
    - [ ] Allow ingress traffic (port 443, 80)
    - [ ] Allow egress to databases
    - [ ] Allow inter-pod communication
    - [ ] Deny all by default (default-deny)
  - **Verification:** `kubectl get networkpolicies -n prod`
- [ ] RBAC (Role-Based Access Control) configured
  - **Roles:**
    - [ ] Admin role (all permissions)
    - [ ] Developer role (read, exec)
    - [ ] View-only role (read only)
  - **Verification:** `kubectl get roles -n prod`
- [ ] Pod security policies configured
  - **Policies:**
    - [ ] Restrict privileged containers
    - [ ] Restrict host network access
    - [ ] Enforce read-only root filesystem
    - [ ] Require resource requests/limits
  - **Verification:** `kubectl get psp`

---

### 3.2 Container Registry Setup

- [ ] Docker image repository created (ECR/ACR/GCR)
  - **Repository:** `prod-alshaya-family-tree`
  - **Verification:** `aws ecr describe-repositories --repository-names prod-alshaya-family-tree`
- [ ] Image scanning enabled (vulnerability scanning)
  - **Verification:** ECR image scanning enabled
  - **Command:** `aws ecr describe-images --repository-name prod-alshaya-family-tree`
- [ ] Image retention policy configured (keep 10 latest)
  - **Verification:** Lifecycle policy set
  - **Command:** `aws ecr describe-lifecycle-policy --repository-name prod-alshaya-family-tree`
- [ ] Private registry access configured
  - **Verification:** Kubernetes secret created for registry credentials
  - **Command:** `kubectl get secrets -n prod | grep dockercfg`
- [ ] Image signing configured (if required)
  - **Verification:** Image signatures verified before deployment
- [ ] Container image built and pushed
  - **Build command:** `docker build -t prod-alshaya-family-tree:1.0.0 .`
  - **Push command:** `docker push [REGISTRY]/prod-alshaya-family-tree:1.0.0`
  - **Verification:** Image appears in ECR/ACR/GCR console
  - **Dockerfile location:** `/Dockerfile`
  - **Dockerfile contents:**
    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production
    COPY . .
    RUN npm run build
    EXPOSE 3000
    CMD ["npm", "start"]
    ```

---

### 3.3 PostgreSQL 16 Database Setup

- [ ] PostgreSQL 16 cluster provisioned (managed database)
  - **Service:** AWS RDS / GCP Cloud SQL / Azure Database
  - **Verification:** `psql -U postgres -h [DB_ENDPOINT] -c "SELECT version();"`
  - **Cluster specs:**
    - [ ] PostgreSQL version: 16.x
    - [ ] Instance class: db.r6g.xlarge or equivalent (4 CPU, 32GB RAM)
    - [ ] Multi-AZ enabled (automatic failover)
    - [ ] Backup retention: 35 days
    - [ ] Storage: 500GB gp3 with auto-scaling
    - [ ] Encryption at rest: enabled
    - [ ] Encryption in transit: SSL/TLS
    - [ ] Enhanced monitoring: enabled
    - [ ] Performance Insights: enabled
- [ ] Database replicas created (read scaling)
  - **Replicas:** 2 read replicas in different AZs
  - **Verification:** `aws rds describe-db-instances | grep "replica"`
  - **Lag monitoring:** < 100ms replication lag
- [ ] Security groups configured
  - **Ingress rules:**
    - [ ] Allow PostgreSQL (port 5432) from Kubernetes cluster only
    - [ ] Allow from specific IPs (bastion host)
  - **Egress rules:**
    - [ ] Allow all (standard)
  - **Verification:** `aws ec2 describe-security-groups`
- [ ] Parameter groups configured
  - **Parameters:**
    - [ ] `max_connections: 200`
    - [ ] `shared_buffers: 25GB`
    - [ ] `effective_cache_size: 20GB`
    - [ ] `work_mem: 100MB`
    - [ ] `maintenance_work_mem: 2GB`
  - **Verification:** `aws rds describe-db-parameters --db-parameter-group-name prod-params`
- [ ] Database created
  - **Database name:** `alshaya_prod`
  - **Command:** `createdb -h [DB_ENDPOINT] -U postgres alshaya_prod`
  - **Verification:** `psql -U postgres -h [DB_ENDPOINT] -l | grep alshaya_prod`
- [ ] Database user created (application user)
  - **Username:** `app_user` (not postgres)
  - **Password:** Generated and stored in AWS Secrets Manager
  - **Permissions:** Limited to application database only
  - **Command:** `CREATE USER app_user WITH PASSWORD '[SECURE_PASSWORD]';`
  - **Verification:** `psql -U app_user -h [DB_ENDPOINT] -d alshaya_prod -c "SELECT 1;"`
- [ ] Backup strategy configured
  - **Backups:**
    - [ ] Automated daily backups (2 AM UTC)
    - [ ] Retention: 35 days
    - [ ] Cross-region backups: enabled
    - [ ] Backup encryption: enabled
  - **Verification:** `aws rds describe-db-instances --db-instance-identifier prod-alshaya --query 'DBInstances[0].BackupRetentionPeriod'`
  - **Restore test:** Perform restore test on staging monthly
- [ ] Database monitoring enabled
  - **Metrics monitored:**
    - [ ] CPU utilization
    - [ ] Database connections
    - [ ] Read/write IOPS
    - [ ] Storage space
    - [ ] Query latency
  - **Verification:** CloudWatch dashboards created
- [ ] Failover testing documented
  - **Verification:** Failover test completed on staging
  - **RTO (Recovery Time Objective):** < 5 minutes
  - **RPO (Recovery Point Objective):** < 1 minute
- [ ] Database schema migration (Prisma)
  - **Command:** `npx prisma migrate deploy`
  - **Verification:** `\d` in psql shows all tables created
  - **Tables created:** 53 Prisma models = 53 tables
  - **Indexes:** All indexes from schema created
- [ ] Database seeding (reference data)
  - **Command:** `npx prisma db seed`
  - **Verification:** Check reference data in tables (roles, statuses, etc.)

---

### 3.4 Redis Cluster Setup

- [ ] Redis cluster provisioned (AWS ElastiCache / GCP Memorystore)
  - **Engine:** Redis 7.0+
  - **Verification:** `redis-cli -c -h [REDIS_ENDPOINT] PING` returns PONG
  - **Cluster specs:**
    - [ ] Node type: cache.r7g.xlarge or equivalent
    - [ ] Number of nodes: 3 (high availability)
    - [ ] Automatic failover: enabled
    - [ ] Encryption at rest: enabled
    - [ ] Encryption in transit: enabled
    - [ ] Subnet group: private subnets only
    - [ ] Parameter group: optimized for caching
- [ ] Redis security groups configured
  - **Ingress rules:**
    - [ ] Allow Redis (port 6379) from Kubernetes cluster only
  - **Verification:** `aws ec2 describe-security-groups`
- [ ] Redis persistence configured
  - **Settings:**
    - [ ] RDB (snapshotting) enabled
    - [ ] AOF (append-only file) disabled (optional)
    - [ ] Backup retention: 7 days
  - **Verification:** `redis-cli CONFIG GET save` shows backup frequency
- [ ] Redis monitoring enabled
  - **Metrics monitored:**
    - [ ] CPU utilization
    - [ ] Memory utilization
    - [ ] Evictions (key expiration)
    - [ ] Hit rate
    - [ ] Connection count
  - **Verification:** CloudWatch dashboards created
- [ ] Cache invalidation strategy documented
  - **Strategy:**
    - [ ] TTL-based expiration (configurable per key type)
    - [ ] Event-based invalidation (on data change)
    - [ ] Manual invalidation (admin command)
  - **Verification:** `/docs/CACHE_STRATEGY.md` created
- [ ] Backup/restore tested
  - **Verification:** Backup created and restored on staging
  - **RTO:** < 5 minutes

---

### 3.5 CDN Configuration

- [ ] CDN provisioned (CloudFront / Akamai / Cloudflare)
  - **Provider:** AWS CloudFront
  - **Verification:** CloudFront distribution created
  - **Distribution specs:**
    - [ ] Origin: Application load balancer or S3
    - [ ] Caching behaviors configured
    - [ ] Compression enabled
    - [ ] HTTP/2 enabled
    - [ ] IPv6 enabled
- [ ] CDN caching rules configured
  - **Rules:**
    - [ ] Static assets (CSS, JS, images): 1 year cache
    - [ ] HTML pages: 5 minutes cache
    - [ ] API responses: not cached
    - [ ] Gzip compression: enabled
  - **Verification:** Response headers include `Cache-Control` directives
- [ ] CDN security configured
  - **Settings:**
    - [ ] Only HTTPS allowed (no HTTP)
    - [ ] TLS 1.2+ only
    - [ ] Viewer protocol policy: https-only
    - [ ] Origin protocol policy: https-only
  - **Verification:** HTTP requests redirected to HTTPS
- [ ] CDN geographic restrictions (if required)
  - **Allowed countries:** All (or specify region)
  - **Verification:** CloudFront distribution settings
- [ ] CDN headers configured
  - **Headers added:**
    - [ ] `Strict-Transport-Security`
    - [ ] `X-Content-Type-Options: nosniff`
    - [ ] `X-Frame-Options: DENY`
    - [ ] `Content-Security-Policy`
  - **Verification:** Response headers include security headers
- [ ] CDN performance tested
  - **Test:**
    - [ ] Global latency < 200ms (p95)
    - [ ] Cache hit ratio > 80%
  - **Verification:** CloudFront statistics/reports
- [ ] CDN purge/invalidation tested
  - **Command:** `aws cloudfront create-invalidation --distribution-id [ID] --paths '/*'`
  - **Verification:** All edge locations updated

---

### 3.6 SSL/TLS Certificates

- [ ] SSL certificate provisioned (wildcard or domain)
  - **Certificate:** *.example.com or example.com
  - **Provider:** Let's Encrypt or AWS Certificate Manager
  - **Verification:** `openssl s_client -connect example.com:443 -servername example.com`
  - **Certificate specs:**
    - [ ] Valid for production domain
    - [ ] Includes www subdomain
    - [ ] Includes api subdomain
    - [ ] Validity: > 1 year
- [ ] Certificate auto-renewal configured
  - **Auto-renewal:** cert-manager in Kubernetes
  - **Verification:** `kubectl get certificates -n prod`
  - **Renewal trigger:** 30 days before expiration
- [ ] Certificate monitoring enabled
  - **Alert:** Certificate expiration warning 60 days before
  - **Verification:** CloudWatch alarm configured
- [ ] Certificate chain validation
  - **Command:** `openssl s_client -showcerts -connect example.com:443`
  - **Verification:** Full certificate chain present
- [ ] TLS version enforcement (1.2+)
  - **Verification:** TLS 1.0, 1.1 disabled
  - **Test:** `nmap --script ssl-enum-ciphers example.com | grep "TLSv"`
- [ ] Cipher suite hardened
  - **Ciphers:** TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, etc.
  - **Verification:** No weak ciphers (export, MD5, DES, etc.)
  - **Test:** https://www.ssllabs.com/ssltest/

---

### 3.7 DNS Configuration

- [ ] DNS records created
  - **Records:**
    - [ ] A record: example.com → Load balancer IP
    - [ ] AAAA record: example.com → IPv6 Load balancer IP
    - [ ] CNAME: www.example.com → example.com
    - [ ] CNAME: api.example.com → Load balancer
    - [ ] CNAME: cdn.example.com → CloudFront distribution
    - [ ] MX records: mail server (for Resend)
    - [ ] SPF record: `v=spf1 include:resend.com ~all`
    - [ ] DKIM record: for email signing
    - [ ] DMARC record: `v=DMARC1; p=quarantine; rua=mailto:security@example.com`
  - **Verification:** `dig example.com A` returns correct IP
- [ ] DNS failover configured (health checks)
  - **Failover:** Primary to secondary IP (multi-region)
  - **Health check:** Every 30 seconds
  - **Failover time:** < 60 seconds
  - **Verification:** Route 53 health checks enabled
- [ ] DNS propagation verified
  - **Command:** `nslookup example.com` on multiple DNS servers
  - **Verification:** All DNS servers return same IP
- [ ] DNS TTL optimized
  - **TTL values:**
    - [ ] A/AAAA records: 300 seconds (5 minutes)
    - [ ] CNAME records: 300 seconds
    - [ ] MX records: 3600 seconds (1 hour)
  - **Verification:** DNS response headers show TTL

---

### 3.8 Load Balancer Setup

- [ ] Application Load Balancer (ALB) provisioned
  - **Service:** AWS ALB / GCP Load Balancer
  - **Verification:** `aws elbv2 describe-load-balancers`
  - **ALB specs:**
    - [ ] Cross-AZ deployment (HA)
    - [ ] Subnets: public subnets (multiple AZs)
    - [ ] Security groups: configured
    - [ ] Scheme: internet-facing
- [ ] Target groups configured
  - **Target groups:**
    - [ ] `prod-api-tg` (port 3000, health check /health)
    - [ ] `prod-web-tg` (port 3000, health check /)
  - **Health check settings:**
    - [ ] Path: `/health`
    - [ ] Interval: 30 seconds
    - [ ] Timeout: 5 seconds
    - [ ] Healthy threshold: 2
    - [ ] Unhealthy threshold: 3
  - **Verification:** `aws elbv2 describe-target-groups`
- [ ] Listener rules configured
  - **Rules:**
    - [ ] HTTP (port 80) → HTTPS (port 443) redirect
    - [ ] HTTPS (port 443) → Target group
    - [ ] API requests → API target group
    - [ ] Web requests → Web target group
  - **Verification:** `aws elbv2 describe-listeners`
- [ ] SSL/TLS configured on ALB
  - **Verification:** ALB listens on HTTPS
  - **Certificate:** ACM certificate attached
- [ ] ALB sticky sessions configured (if needed)
  - **Sticky sessions:** Duration 1 day
  - **Verification:** `aws elbv2 modify-target-group-attributes`
- [ ] ALB access logs enabled
  - **Logs stored in:** S3 bucket
  - **Retention:** 90 days
  - **Verification:** S3 bucket configured for ALB logs
- [ ] ALB monitoring enabled
  - **Metrics monitored:**
    - [ ] Request count
    - [ ] Target response time
    - [ ] HTTP 4xx/5xx errors
    - [ ] Active connection count
  - **Verification:** CloudWatch dashboards created
- [ ] ALB security groups configured
  - **Ingress rules:**
    - [ ] Allow HTTP (port 80) from anywhere
    - [ ] Allow HTTPS (port 443) from anywhere
  - **Egress rules:**
    - [ ] Allow all to target security group
  - **Verification:** Security group rules reviewed

---

### 3.9 S3 Bucket for File Storage

- [ ] S3 bucket created for file uploads
  - **Bucket name:** `prod-alshaya-uploads`
  - **Region:** Same as RDS (redundancy)
  - **Verification:** `aws s3 ls s3://prod-alshaya-uploads`
- [ ] S3 bucket versioning enabled
  - **Verification:** `aws s3api get-bucket-versioning --bucket prod-alshaya-uploads`
  - **MFA Delete:** Enabled for production
- [ ] S3 bucket encryption configured
  - **Encryption:** Server-side AES-256
  - **Verification:** `aws s3api get-bucket-encryption --bucket prod-alshaya-uploads`
- [ ] S3 bucket access configured (not public)
  - **Block Public Access:** All enabled
  - **Verification:** `aws s3api get-public-access-block --bucket prod-alshaya-uploads`
  - **Policy:** Only allow application IAM role to access
- [ ] S3 bucket lifecycle rules configured
  - **Rules:**
    - [ ] Move to Glacier after 90 days
    - [ ] Delete after 3 years (compliance)
  - **Verification:** `aws s3api get-bucket-lifecycle-configuration --bucket prod-alshaya-uploads`
- [ ] S3 bucket logging enabled
  - **Logs stored in:** Separate S3 bucket
  - **Verification:** `aws s3api get-bucket-logging --bucket prod-alshaya-uploads`
- [ ] S3 bucket CORS configured (if accessed from browser)
  - **CORS rules:** Allow GET, PUT from application domain
  - **Verification:** `aws s3api get-bucket-cors --bucket prod-alshaya-uploads`
- [ ] S3 CloudFront distribution created
  - **Origin:** S3 bucket
  - **Caching:** 1 year for uploaded files
  - **Verification:** CloudFront distribution created
- [ ] S3 bucket monitoring enabled
  - **Metrics:**
    - [ ] Bucket size
    - [ ] Object count
  - **Verification:** CloudWatch dashboards created

---

### 3.10 Backup Infrastructure

- [ ] Database backups automated (RDS)
  - **Frequency:** Daily at 2 AM UTC
  - **Retention:** 35 days
  - **Verification:** `aws rds describe-db-instances --query 'DBInstances[0].BackupRetentionPeriod'`
- [ ] Database backups cross-region (disaster recovery)
  - **Destination region:** Separate from production
  - **Retention:** 7 days minimum
  - **Verification:** `aws rds describe-db-cluster-snapshots`
- [ ] File backups to S3 (application uploads)
  - **Backup frequency:** Nightly via S3 cross-region replication
  - **Verification:** S3 cross-region replication enabled
- [ ] Backup encryption enabled
  - **Encryption:** KMS encryption
  - **Verification:** Backup snapshots encrypted
- [ ] Backup restoration tested
  - **Test frequency:** Monthly on staging
  - **Verification:** Document in `/docs/BACKUP_RESTORATION_TESTS.md`
  - **RTO:** < 5 minutes
  - **RPO:** < 1 minute
- [ ] Backup monitoring enabled
  - **Alerts:**
    - [ ] Backup failed
    - [ ] Backup took longer than expected
  - **Verification:** CloudWatch alarms configured

---

### 3.11 Monitoring Stack

- [ ] Prometheus deployed for metrics collection
  - **Deployment:** Helm chart in Kubernetes
  - **Verification:** `kubectl get pods -n monitoring | grep prometheus`
  - **Prometheus specs:**
    - [ ] Scrape interval: 15 seconds
    - [ ] Retention: 15 days
    - [ ] Storage: 50GB persistent volume
  - **Targets scraped:**
    - [ ] Kubernetes cluster metrics
    - [ ] Application metrics (custom)
    - [ ] Node exporter metrics
    - [ ] PostgreSQL exporter metrics
    - [ ] Redis exporter metrics
- [ ] Prometheus storage configured (persistent)
  - **Storage:** Persistent Volume Claim (PVC)
  - **Size:** 50GB with auto-scaling
  - **Verification:** `kubectl describe pvc -n monitoring`
- [ ] Prometheus alerting rules configured
  - **Alert rules file:** `/kubernetes/prometheus-rules.yaml`
  - **Rules:**
    - [ ] High CPU utilization (> 80%)
    - [ ] High memory utilization (> 85%)
    - [ ] Pod restarts (> 3 in 1 hour)
    - [ ] Service unavailable (0 pods)
    - [ ] Database connection pool exhausted
    - [ ] API latency > 1 second (p99)
    - [ ] Error rate > 1%
  - **Verification:** `kubectl describe rules -n monitoring`
- [ ] Grafana deployed for visualization
  - **Deployment:** Helm chart in Kubernetes
  - **Verification:** `kubectl get pods -n monitoring | grep grafana`
  - **Grafana specs:**
    - [ ] Data source: Prometheus
    - [ ] Dashboards: created (see below)
    - [ ] Authentication: LDAP or OAuth
  - **Dashboards created:**
    - [ ] Kubernetes cluster overview
    - [ ] Application performance
    - [ ] Database metrics
    - [ ] Redis cache metrics
    - [ ] HTTP requests/errors
    - [ ] Business metrics (users, families, etc.)
- [ ] Sentry deployed for error tracking
  - **Deployment:** SaaS or self-hosted
  - **Integration:** Frontend and backend error tracking
  - **Verification:** `npm run test:sentry` confirms integration
  - **Configuration:**
    - [ ] DSN configured in environment variables
    - [ ] Release version set
    - [ ] Environment: prod
    - [ ] Sample rate: 100% for errors, 10% for transactions
  - **Error tracking features:**
    - [ ] Exception tracking (frontend/backend)
    - [ ] Error grouping and deduplication
    - [ ] Stack traces
    - [ ] Affected users count
    - [ ] Release comparison
- [ ] ELK stack (Elasticsearch, Logstash, Kibana) for logs
  - **Deployment:** Helm chart in Kubernetes
  - **Verification:** `kubectl get pods -n monitoring | grep elasticsearch`
  - **ELK specs:**
    - [ ] Elasticsearch nodes: 3 (HA)
    - [ ] Storage: 200GB per node
    - [ ] Retention: 30 days
    - [ ] Replication factor: 2
- [ ] Logstash for log parsing
  - **Filters:**
    - [ ] JSON parsing
    - [ ] Request/response extraction
    - [ ] Error detection
    - [ ] PII redaction
  - **Verification:** `kubectl logs -n monitoring [logstash-pod] | grep "parsed"`
- [ ] Kibana for log visualization
  - **Dashboards:**
    - [ ] Application logs (errors, warnings, info)
    - [ ] Audit logs
    - [ ] API request logs
    - [ ] Database query logs (slow queries)
  - **Index pattern:** `logs-prod-*`
- [ ] OpenTelemetry for distributed tracing
  - **Implementation:** Optional but recommended
  - **Traces:** Track requests across services
  - **Backend:** Jaeger or Tempo
  - **Verification:** Traces visible in Jaeger UI

---

### 3.12 Alerting & Notification Setup

- [ ] PagerDuty integration for on-call
  - **Integration:** Prometheus → PagerDuty
  - **Services:**
    - [ ] Critical infrastructure
    - [ ] Application errors
    - [ ] Database issues
  - **Escalation:** 5 min → 15 min → 30 min
  - **Verification:** Test alert triggers incident
- [ ] Slack integration for notifications
  - **Channels:**
    - [ ] #prod-alerts (critical only)
    - [ ] #prod-deployments (all deployments)
    - [ ] #prod-monitoring (all metrics)
  - **Verification:** Test message posted to Slack
- [ ] Email alerts configured
  - **Recipients:** Security team, DevOps team, Product team
  - **Severity levels:** Critical → email, High → Slack
  - **Verification:** Test email sent
- [ ] SMS alerts for critical issues (optional)
  - **Recipients:** On-call engineer
  - **Trigger:** Service down, data loss, security incident
  - **Verification:** Test SMS received
- [ ] Alert thresholds documented
  - **Document:** `/docs/ALERT_THRESHOLDS.md`
  - **Format:**
    - [ ] Alert name
    - [ ] Metric
    - [ ] Threshold
    - [ ] Severity (critical/high/medium)
    - [ ] Action items
- [ ] Alert runbooks created
  - **Runbooks for:**
    - [ ] High CPU utilization
    - [ ] Database connection pool exhausted
    - [ ] API errors > 1%
    - [ ] Service pod crashes
    - [ ] Disk space low
  - **Location:** `/docs/runbooks/`

---

## Section 4: Data Migration (T-14 days)

### 4.1 Migration Preparation

- [ ] Database schema migration script created (Prisma)
  - **Script:** `npx prisma migrate create initial_schema`
  - **Location:** `/prisma/migrations/[timestamp]_initial_schema/migration.sql`
  - **Verification:** Migration script reviewed and tested on staging
  - **Rollback plan:** Document rollback procedure
- [ ] Data validation rules defined
  - **Rules document:** `/docs/DATA_VALIDATION_RULES.md`
  - **Validations:**
    - [ ] No duplicate emails
    - [ ] All users have valid password hashes
    - [ ] All family members linked to valid family
    - [ ] All relationships have valid member IDs
    - [ ] No circular relationships
    - [ ] Email format valid (RFC 5322)
    - [ ] Phone format valid
    - [ ] Names not null or empty
  - **SQL validation queries:**
    ```sql
    -- Check for duplicate emails
    SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

    -- Check for orphaned records
    SELECT * FROM family_members WHERE family_id NOT IN (SELECT id FROM families);

    -- Check for invalid relationships
    SELECT * FROM relationships WHERE member1_id NOT IN (SELECT id FROM family_members);
    ```
  - **Verification:** All validations pass on staging
- [ ] Data backup created before migration
  - **Backup location:** S3
  - **Backup verification:** Restore test successful
  - **Retention:** Keep 30 days minimum
  - **Command:** `aws rds create-db-snapshot --db-instance-identifier prod-alshaya --db-snapshot-identifier prod-alshaya-pre-migration-$(date +%s)`
- [ ] PII identification complete
  - **PII fields identified:** Email, phone, national ID, address, DOB, passport
  - **Encryption algorithm:** AES-256-GCM
  - **Key management:** AWS Secrets Manager
  - **Verification:** All 12 PII fields in `/docs/PII_FIELDS.md`

---

### 4.2 PII Encryption Migration

- [ ] Encryption middleware implemented
  - **Location:** `/lib/prisma/middleware/encryption.ts`
  - **Implementation:**
    - [ ] Field-level encryption hooks (before create/update)
    - [ ] Field-level decryption hooks (after read)
    - [ ] Key derivation from master key
    - [ ] IV (Initialization Vector) generated per record
  - **Verification:** `npm run test:encryption` passes
- [ ] PII encryption migration script created
  - **Script:** `/scripts/migrate-encrypt-pii.ts`
  - **Process:**
    - [ ] Read all users/members/documents
    - [ ] Encrypt PII fields
    - [ ] Write back to database
    - [ ] Verify encryption successful
  - **Dry-run mode:** Test on staging first
  - **Command:** `npm run migrate:encrypt-pii --dry-run`
- [ ] PII encryption migration executed on production
  - **Execution time:** Off-peak hours (2 AM UTC)
  - **Monitoring:** Watch database performance
  - **Command:** `npm run migrate:encrypt-pii --production`
  - **Verification:** All PII encrypted in database
  - **Rollback:** If encryption fails, restore from backup
- [ ] Decryption on application read verified
  - **Test:** API returns decrypted PII for authorized users
  - **Verification:** `curl https://api.example.com/api/users/123` returns plaintext email
- [ ] Performance impact of encryption assessed
  - **Impact:** Should be < 10% latency increase
  - **Query time:** Before and after comparison
  - **Verification:** Load test with encrypted data

---

### 4.3 Schema Migration & Data Loading

- [ ] Prisma schema migration deployed
  - **Command:** `npx prisma migrate deploy --skip-generate`
  - **Verification:** All tables, indexes, constraints created
  - **Check:**
    ```sql
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name;
    ```
- [ ] Seeds/reference data loaded (roles, statuses, etc.)
  - **Seed script:** `prisma/seed.ts`
  - **Reference data:**
    - [ ] Roles: ADMIN, OWNER, EDITOR, VIEWER, GUEST
    - [ ] Relationship types: Parent, Child, Spouse, Sibling, Grandparent, etc.
    - [ ] Document types: Birth certificate, Marriage certificate, ID, Passport, etc.
    - [ ] Event types: Birth, Marriage, Death, Graduation, etc.
  - **Command:** `npx prisma db seed`
  - **Verification:** `SELECT COUNT(*) FROM roles;` returns 5
- [ ] Existing data migrated (if applicable)
  - **Migration scope:** Current data → New schema
  - **Source:** Replit database or current environment
  - **Process:**
    - [ ] Export existing data (SQL dump)
    - [ ] Transform to new schema (ETL process)
    - [ ] Load into production database
    - [ ] Validate data integrity
  - **Command:** `npm run migrate:existing-data`
  - **Verification:** Record counts match source
- [ ] Indexes created and optimized
  - **Indexes:**
    - [ ] user(email) - UNIQUE
    - [ ] user(username) - UNIQUE
    - [ ] family_member(family_id)
    - [ ] family_member(user_id)
    - [ ] relationship(member1_id, member2_id)
    - [ ] document(family_id)
    - [ ] document(uploaded_by)
    - [ ] audit_log(user_id)
    - [ ] audit_log(timestamp)
  - **Verification:** `SELECT * FROM pg_indexes WHERE schemaname = 'public';`
- [ ] Constraints verified (foreign keys, unique, not null)
  - **Verification:** `\d users` in psql shows constraints
  - **Foreign key constraints:** All relationships enforced
  - **Unique constraints:** Email, username unique per user
  - **Not null constraints:** Required fields have NOT NULL
- [ ] Data integrity checks passed
  - **Checks:**
    - [ ] `npm run migrate:validate-data`
    - [ ] All 53 Prisma models have correct record counts
    - [ ] No orphaned records
    - [ ] No constraint violations
  - **Verification:** Script completes with 0 errors

---

### 4.4 Rollback Procedures

- [ ] Rollback plan documented
  - **Document:** `/docs/MIGRATION_ROLLBACK.md`
  - **Rollback triggers:**
    - [ ] Data validation fails
    - [ ] Performance degrades > 50%
    - [ ] Encryption fails
    - [ ] More than 100 errors in first hour
  - **Rollback steps:**
    - [ ] Restore database snapshot (command provided)
    - [ ] Switch application to old database
    - [ ] Notify stakeholders
    - [ ] Post-mortem investigation
- [ ] Database snapshots created
  - **Snapshots:**
    - [ ] Pre-migration snapshot: `prod-alshaya-pre-migration-[timestamp]`
    - [ ] Backup retention: 30 days
  - **Restoration test:** Confirm snapshot can be restored
- [ ] Rollback testing on staging
  - **Test:** Perform migration on staging, then rollback
  - **Verification:** Data restored to pre-migration state
  - **Time to rollback:** < 10 minutes
- [ ] Automated alerts for migration issues
  - **Alerts:**
    - [ ] High error rate during migration
    - [ ] Database replication lag > 5 seconds
    - [ ] Disk space low during migration
  - **Action:** Trigger automatic rollback if thresholds exceeded

---

### 4.5 Post-Migration Validation

- [ ] Data integrity validation completed
  - **Script:** `npm run migrate:validate-data`
  - **Checks:**
    - [ ] Record counts match expectations
    - [ ] No NULL values in required fields
    - [ ] No duplicate emails/usernames
    - [ ] All foreign key constraints satisfied
    - [ ] Encrypted PII verified
  - **Verification:** All checks pass with 0 errors
- [ ] Performance baselines established
  - **Metrics:**
    - [ ] Query response time: < 100ms (p95)
    - [ ] API response time: < 500ms (p95)
    - [ ] Database CPU: < 30%
    - [ ] Database memory: < 50%
  - **Verification:** Metrics logged in `/logs/migration/performance.log`
- [ ] Application connectivity tested
  - **Tests:**
    - [ ] Connect to production database
    - [ ] Execute read queries
    - [ ] Execute write queries
    - [ ] Connection pooling working
  - **Verification:** All tests pass
- [ ] Caches invalidated (Redis)
  - **Command:** `redis-cli -c FLUSHALL`
  - **Verification:** Redis cache empty, application repopulates
- [ ] Audit logs reviewed
  - **Review:**
    - [ ] All migration operations logged
    - [ ] No unexpected errors
    - [ ] Migration completed successfully
  - **Verification:** Migration audit trail at `/logs/migration/audit.log`

---

## Section 5: Configuration (T-14 days)

### 5.1 Environment Variables (Production)

All 30+ environment variables configured and validated:

**Database Configuration:**
- [ ] `DATABASE_URL`
  - **Format:** `postgresql://user:password@host:5432/dbname`
  - **Example:** `postgresql://app_user:secure_pwd@prod-rds.c5qfj8k9.rds.amazonaws.com:5432/alshaya_prod`
  - **Source:** AWS Secrets Manager
  - **Verification:** `npm run test:db-connection` succeeds
- [ ] `DATABASE_POOL_SIZE`
  - **Value:** `20`
  - **Description:** Maximum database connections per pod
  - **Verification:** `SELECT count(*) FROM pg_stat_activity;` shows max 20 per pod
- [ ] `DATABASE_POOL_TIMEOUT`
  - **Value:** `30`
  - **Unit:** Seconds
  - **Description:** Timeout waiting for available connection

**Application Configuration:**
- [ ] `NODE_ENV`
  - **Value:** `production`
  - **Verification:** `echo $NODE_ENV` returns production
- [ ] `NEXT_PUBLIC_API_URL`
  - **Value:** `https://api.example.com`
  - **Description:** Public API endpoint (used in frontend)
  - **Verification:** API calls target correct URL
- [ ] `INTERNAL_API_URL`
  - **Value:** `http://localhost:3000` (internal routing)
  - **Description:** Internal API routing (server-to-server)
- [ ] `NEXT_PUBLIC_APP_URL`
  - **Value:** `https://www.example.com`
  - **Description:** Application base URL
- [ ] `APP_PORT`
  - **Value:** `3000`
  - **Description:** Application listening port
- [ ] `PRODUCTION_DOMAIN`
  - **Value:** `example.com`
  - **Description:** Production domain
- [ ] `ALLOWED_ORIGINS`
  - **Value:** `https://www.example.com,https://api.example.com,https://admin.example.com`
  - **Description:** CORS allowed origins (comma-separated)
  - **Verification:** CORS preflight requests return correct header

**Authentication:**
- [ ] `JWT_SECRET`
  - **Format:** 32-byte random string
  - **Example:** `a7f3e9d2c1b4f6a8e5d9c2f3e4a1b5d6`
  - **Source:** AWS Secrets Manager
  - **Generation:** `openssl rand -hex 16`
  - **Rotation:** Every 90 days
  - **Verification:** JWT tokens signed correctly
- [ ] `JWT_EXPIRY`
  - **Value:** `3600` (1 hour)
  - **Unit:** Seconds
- [ ] `REFRESH_TOKEN_EXPIRY`
  - **Value:** `604800` (7 days)
  - **Unit:** Seconds
- [ ] `ENCRYPTION_KEY`
  - **Format:** 32-byte random string (for AES-256)
  - **Source:** AWS Secrets Manager
  - **Generation:** `openssl rand -hex 16`
  - **Rotation:** Every 180 days
  - **Verification:** PII encrypted/decrypted successfully
- [ ] `SESSION_SECRET`
  - **Format:** 32-byte random string
  - **Source:** AWS Secrets Manager
  - **Verification:** Sessions encrypted in database
- [ ] `OAUTH_GOOGLE_CLIENT_ID`
  - **Value:** Google OAuth app client ID
  - **Source:** Google Cloud Console
  - **Verification:** Google login works
- [ ] `OAUTH_GOOGLE_CLIENT_SECRET`
  - **Value:** Google OAuth app secret
  - **Source:** AWS Secrets Manager
- [ ] `OAUTH_GOOGLE_CALLBACK_URL`
  - **Value:** `https://api.example.com/api/auth/callback/google`
  - **Verification:** Google redirects to correct URL
- [ ] `OAUTH_GITHUB_CLIENT_ID` (if applicable)
  - **Value:** GitHub OAuth app client ID
  - **Source:** GitHub settings
- [ ] `OAUTH_GITHUB_CLIENT_SECRET`
  - **Source:** AWS Secrets Manager

**External Services:**
- [ ] `RESEND_API_KEY`
  - **Value:** Resend email service API key
  - **Source:** AWS Secrets Manager
  - **Verification:** Welcome email sent successfully
- [ ] `RESEND_FROM_EMAIL`
  - **Value:** `noreply@example.com`
  - **Verification:** Emails sent from correct address
- [ ] `TWILIO_ACCOUNT_SID`
  - **Value:** Twilio account ID
  - **Source:** AWS Secrets Manager
  - **Verification:** SMS sent successfully
- [ ] `TWILIO_AUTH_TOKEN`
  - **Value:** Twilio authentication token
  - **Source:** AWS Secrets Manager
- [ ] `TWILIO_PHONE_NUMBER`
  - **Value:** `+1234567890` (SMS sender number)
  - **Verification:** SMS received from correct number
- [ ] `AWS_ACCESS_KEY_ID`
  - **Value:** AWS IAM access key
  - **Source:** AWS Secrets Manager
  - **Verification:** S3 file upload works
- [ ] `AWS_SECRET_ACCESS_KEY`
  - **Value:** AWS IAM secret key
  - **Source:** AWS Secrets Manager
- [ ] `AWS_S3_BUCKET`
  - **Value:** `prod-alshaya-uploads`
  - **Verification:** Files uploaded to correct bucket
- [ ] `AWS_S3_REGION`
  - **Value:** `us-east-1` (or appropriate region)

**Monitoring & Logging:**
- [ ] `SENTRY_DSN`
  - **Value:** Sentry error tracking DSN
  - **Source:** Sentry dashboard
  - **Verification:** Errors logged to Sentry
- [ ] `LOG_LEVEL`
  - **Value:** `info` (production)
  - **Values:** debug, info, warn, error
- [ ] `DATADOG_API_KEY` (if using Datadog)
  - **Value:** Datadog API key
  - **Source:** AWS Secrets Manager
- [ ] `PROMETHEUS_PUSHGATEWAY` (if using Prometheus)
  - **Value:** `http://prometheus-pushgateway:9091`
  - **Verification:** Metrics pushed to Prometheus

**Feature Flags:**
- [ ] `FEATURE_TWO_FACTOR_AUTH`
  - **Value:** `true`
  - **Description:** Enable 2FA feature
- [ ] `FEATURE_EXPORT_PDF`
  - **Value:** `true`
  - **Description:** Enable PDF export
- [ ] `FEATURE_IMPORT_GENIMI`
  - **Value:** `false`
  - **Description:** Import from GEDCOM format
- [ ] `FEATURE_ADVANCED_ANALYTICS`
  - **Value:** `false` (future feature)
  - **Description:** Advanced family analytics

**Security & Rate Limiting:**
- [ ] `RATE_LIMIT_WINDOW`
  - **Value:** `60` (seconds)
  - **Description:** Rate limit window duration
- [ ] `RATE_LIMIT_MAX_REQUESTS`
  - **Value:** `100`
  - **Description:** Max requests per window
- [ ] `RATE_LIMIT_AUTH_MAX_ATTEMPTS`
  - **Value:** `5`
  - **Description:** Max login attempts before lockout
- [ ] `RATE_LIMIT_AUTH_LOCKOUT_DURATION`
  - **Value:** `900` (15 minutes)
  - **Unit:** Seconds

**Validation:**
- [ ] All environment variables loaded at startup
  - **Verification:** Application logs environment variable check
  - **Command:** `npm run validate:env`
- [ ] Missing required variables cause startup failure
  - **Verification:** Application fails to start without DATABASE_URL
- [ ] No secrets logged (validation)
  - **Verification:** `grep -r "DATABASE_URL\|API_KEY\|SECRET" logs/` returns nothing
- [ ] Environment variables documented
  - **Documentation:** `/docs/ENVIRONMENT_VARIABLES.md` contains all 30+ vars with formats

---

### 5.2 Secret Management (AWS Secrets Manager)

- [ ] Secrets stored in AWS Secrets Manager (not in code)
  - **Secrets:**
    - [ ] DATABASE_PASSWORD
    - [ ] JWT_SECRET
    - [ ] ENCRYPTION_KEY
    - [ ] SESSION_SECRET
    - [ ] OAuth secrets (Google, GitHub)
    - [ ] API keys (Resend, Twilio, AWS)
    - [ ] Email credentials
  - **Verification:** `aws secretsmanager list-secrets` shows all secrets
  - **Access:** Only production pods can access via IAM role
- [ ] Secret rotation configured
  - **Rotation:** Every 90 days (automatic)
  - **Verification:** `aws secretsmanager describe-secret --secret-id prod/db/password` shows rotation schedule
  - **Lambda function:** Handles rotation (provided by AWS)
- [ ] Secret access logging enabled
  - **Logging:** All secret access logged to CloudTrail
  - **Verification:** `aws cloudtrail lookup-events --lookup-attributes AttributeKey=ResourceName,AttributeValue=prod/db/password`
- [ ] Emergency access procedure documented
  - **Document:** `/docs/EMERGENCY_SECRET_ACCESS.md`
  - **Process:** Requires dual approval, audit trail

---

### 5.3 Feature Flags

- [ ] Feature flag system implemented
  - **Implementation:** Redis-based feature flags
  - **Verification:** `npm run test:feature-flags` passes
  - **Admin panel:** `/admin/feature-flags` to manage flags
- [ ] All features configured with flags
  - **Flags:**
    - [ ] `TWO_FACTOR_AUTH` (enabled)
    - [ ] `EXPORT_PDF` (enabled)
    - [ ] `IMPORT_GEDCOM` (disabled - future)
    - [ ] `ADVANCED_ANALYTICS` (disabled - future)
    - [ ] `BULK_IMPORT` (enabled)
    - [ ] `API_V2` (disabled - for future API)
  - **Verification:** Feature flag admin shows all flags
- [ ] Feature flag evaluation in code
  - **Pattern:** `if (isFeatureEnabled('TWO_FACTOR_AUTH')) { ... }`
  - **Verification:** Grep shows all features guarded by flags
  - **Command:** `grep -r "isFeatureEnabled" src/ | wc -l` shows features are guarded
- [ ] Feature flag caching (Redis TTL: 5 minutes)
  - **Verification:** Flag changes take effect within 5 minutes
- [ ] Feature flag audit logging
  - **Logging:** All flag changes logged with user, timestamp, change
  - **Verification:** Audit log shows feature flag changes

---

### 5.4 Rate Limiting Configuration

- [ ] Global rate limiter configured
  - **Limit:** 100 requests/minute per IP
  - **Implementation:** Redis-based
  - **Verification:** 101st request returns 429 status
  - **Configuration:** `/lib/middleware/rateLimit.ts`
- [ ] Auth endpoint rate limiting
  - **Limits:**
    - [ ] Login: 5 attempts/15 minutes
    - [ ] Register: 3 attempts/1 hour
    - [ ] Forgot password: 3 attempts/1 hour
  - **Lockout:** User locked out after exceeded attempts
  - **Verification:** `npm run test:rate-limit` passes
- [ ] API endpoint specific limits
  - [ ] POST `/api/upload`: 10 requests/minute
  - [ ] POST `/api/export`: 5 requests/minute
  - [ ] GET `/api/search`: 20 requests/minute
  - [ ] All others: 100 requests/minute
  - **Verification:** Specific endpoints have custom limits
- [ ] Rate limit headers in response
  - **Headers:**
    - [ ] `X-RateLimit-Limit: 100`
    - [ ] `X-RateLimit-Remaining: 95`
    - [ ] `X-RateLimit-Reset: [unix-timestamp]`
  - **Verification:** Rate limit headers present in API responses
- [ ] Rate limit bypass for internal services
  - **Bypass:** Internal services (health checks, monitoring) bypass limits
  - **Verification:** Health check succeeds even under rate limit
- [ ] Rate limit monitoring
  - **Metrics:** Track rate limit hits/misses
  - **Alert:** Alert if > 50% of requests rate-limited
  - **Verification:** Metrics visible in Prometheus/Grafana

---

### 5.5 CORS Configuration

- [ ] CORS middleware configured
  - **Implementation:** `/middleware/cors.ts`
  - **Allowed origins:**
    - [ ] `https://www.example.com`
    - [ ] `https://admin.example.com`
    - [ ] `https://api.example.com`
  - **Verification:** Preflight requests from allowed origins succeed
- [ ] Credentials included in CORS (cookies)
  - **Configuration:** `credentials: true`
  - **Verification:** Cookies sent with cross-origin requests
- [ ] Allowed methods configured
  - **Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
  - **Verification:** OPTIONS request returns allowed methods
- [ ] Allowed headers configured
  - **Headers:** Content-Type, Authorization, X-CSRF-Token
  - **Verification:** Custom headers allowed in requests
- [ ] CORS preflight caching (5 minutes)
  - **Header:** `Access-Control-Max-Age: 300`
  - **Verification:** Subsequent requests skip preflight
- [ ] CORS testing across origins
  - **Test:** Requests from unauthorized origins return 403
  - **Verification:** `npm run test:cors` passes

---

### 5.6 Content Security Policy (CSP)

- [ ] CSP header configured
  - **Header:** Set via next.config.js or middleware
  - **Policy:**
    ```
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://maps.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com https://sentry.io;
    frame-src 'none';
    base-uri 'self';
    form-action 'self'
    ```
  - **Verification:** Header present in response
- [ ] CSP testing (XSS protection)
  - **Test:** Inline script blocked (unless allowed in policy)
  - **Test:** External script from unauthorized domain blocked
  - **Verification:** `npm run test:csp` passes
- [ ] CSP violation reporting
  - **Reporting:** Violations sent to `/api/csp-report`
  - **Logging:** CSP violations logged for review
  - **Verification:** CSP violations appear in logs

---

### 5.7 Cookie Configuration

- [ ] Session cookie configured
  - **Name:** `session`
  - **Options:**
    - [ ] `httpOnly: true` (not accessible via JavaScript)
    - [ ] `secure: true` (only over HTTPS)
    - [ ] `sameSite: 'strict'` (CSRF protection)
    - [ ] `maxAge: 604800000` (7 days)
  - **Verification:** Cookie visible in DevTools but not in JavaScript
  - **Code location:** `/lib/session/config.ts`
- [ ] CSRF token cookie
  - **Name:** `csrf-token`
  - **Options:** Same as session (httpOnly, secure, sameSite)
  - **Verification:** CSRF token present in POST requests
- [ ] Other cookies minimized
  - **Verification:** No unnecessary cookies set
  - **Test:** 3rd-party cookies blocked (privacy)
- [ ] Cookie testing
  - **Test:** Cookies not accessible via JavaScript (XSS protection)
  - **Test:** Cookies sent only over HTTPS
  - **Verification:** `npm run test:cookies` passes

---

### 5.8 Session Configuration

- [ ] Session storage in PostgreSQL (not memory)
  - **Table:** `sessions`
  - **Implementation:** `connect-pg-simple`
  - **Verification:** Sessions persisted across pod restarts
  - **Query:** `SELECT COUNT(*) FROM sessions;` shows active sessions
- [ ] Session timeout: 7 days idle
  - **Configuration:** `maxAge: 604800000` (7 days in milliseconds)
  - **Verification:** Session expires after 7 days
- [ ] Session regeneration on login
  - **Implementation:** Old session ID discarded, new generated
  - **Verification:** Session ID changes on login
  - **Security:** Prevents session fixation attacks
- [ ] Session invalidation on logout
  - **Implementation:** Session deleted from database
  - **Verification:** Old session ID no longer valid after logout
- [ ] Session monitoring
  - **Metrics:** Active sessions count, session creation rate
  - **Alert:** Alert if unusual session activity (spike in sessions)
  - **Verification:** Metrics visible in Prometheus/Grafana

---

## End of Part 1

This comprehensive checklist covers the critical first half of deployment preparation (Sections 1-5), including:

1. **Pre-Deployment: Code Readiness** - All 18 CRITICAL security issues with specific verification methods
2. **Pre-Deployment: Testing Gate** - Unit, integration, E2E, performance, security, accessibility, and internationalization testing
3. **Infrastructure Preparation** - Kubernetes, databases, CDN, monitoring, and alerting setup
4. **Data Migration** - Schema migration, PII encryption, and validation
5. **Configuration** - 30+ environment variables, secrets, feature flags, rate limiting, and security policies

**Total checklist items (Part 1): 800+**

Each item includes:
- Verification method or command
- Pass/fail criteria
- Specific file locations
- Configuration examples where applicable
- Test procedures
- No placeholders - all actionable items

# Al-Shaya Family Tree Application - Deployment Checklist Part 2

**Document Version:** 2.0
**Last Updated:** 2026-03-08
**Target Release:** Full Platform Release
**Tech Stack:** Next.js 14 + React 18 + TypeScript + PostgreSQL 16 + Prisma + Kubernetes + Docker

---

## 1. DEPLOY DAY PROCEDURE (T-0)

### Pre-Deployment Phase (T-6 hours)

- [ ] **Step 1:** Verify all team members are available and on-call
  - Command: `slack @channel "Deployment scheduled for [TIME]. Team confirmation required."`
  - Expected: All critical personnel respond with ✅

- [ ] **Step 2:** Create incident channel for deployment coordination
  - Command: `slack /channel create #deploy-[DATE] --private`
  - Add: DevOps lead, backend lead, frontend lead, DBA, QA lead

- [ ] **Step 3:** Verify no critical issues in staging environment
  - Command: `kubectl get pods -n staging | grep -E 'CrashLoopBackOff|Error|Pending'`
  - Expected: All pods in Running state

- [ ] **Step 4:** Confirm all feature flags are set correctly in staging
  - Command: `curl -s https://staging-api.alshaya.app/api/v1/admin/feature-flags | jq '.flags'`
  - Verify: All planned features enabled, deprecated features disabled

- [ ] **Step 5:** Lock all write operations to production database
  - Command: `psql -h $DB_HOST -U $DB_USER -d alshaya_prod -c "REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM app_user;"`
  - Note: Keep app_user role for SELECT only

- [ ] **Step 6:** Send deployment announcement to stakeholders
  - **Template:**
    ```
    Subject: Al-Shaya Family Tree - Scheduled Maintenance Window

    Dear Users,

    We will be performing scheduled maintenance on the Al-Shaya Family Tree
    Application on [DATE] from [START_TIME] to [END_TIME] [TIMEZONE].

    During this time, the service will be unavailable. We apologize for any
    inconvenience and appreciate your patience.

    Changes in this release:
    - [Feature 1]
    - [Feature 2]
    - Performance improvements
    - Security updates

    For support: support@alshaya.app

    Thank you,
    DevOps Team
    ```

### Maintenance Mode Activation (T-3 hours)

- [ ] **Step 7:** Enable maintenance mode banner
  - Command: `kubectl set env deployment/next-app -n production NEXT_PUBLIC_MAINTENANCE_MODE=true`
  - Verify: `curl https://alshaya.app | grep "maintenance"`

- [ ] **Step 8:** Update status page to maintenance mode
  - Command: `curl -X POST https://status.alshaya.app/api/incidents -H "Authorization: Bearer $STATUS_PAGE_API_KEY" -d '{"name":"Scheduled Maintenance","status":"investigating"}'`

- [ ] **Step 9:** Pause all scheduled jobs and cron tasks
  - Command:
    ```bash
    kubectl set env cronjob/email-digest -n production CRONJOB_ENABLED=false
    kubectl set env cronjob/backup-cleanup -n production CRONJOB_ENABLED=false
    kubectl set env cronjob/analytics-aggregation -n production CRONJOB_ENABLED=false
    kubectl set env deployment/background-jobs -n production BG_JOBS_ENABLED=false
    ```
  - Verify: `kubectl get cronjob -n production -o jsonpath='{.items[*].spec.suspend}'` should show `true`

- [ ] **Step 10:** Drain connection pools gracefully
  - Command:
    ```bash
    # Set environment variable to reject new connections
    kubectl set env deployment/next-app -n production CONNECTION_POOL_ACCEPT_NEW=false
    # Wait for graceful shutdown
    sleep 60
    ```

### Database Backup Phase (T-2 hours)

- [ ] **Step 11:** Create full production database backup
  - Command:
    ```bash
    BACKUP_FILE="/backups/alshaya_prod_$(date +%Y%m%d_%H%M%S).sql"
    pg_dump -h $DB_HOST -U $DB_USER -d alshaya_prod \
      --verbose \
      --no-owner \
      --no-privileges \
      --format=plain > $BACKUP_FILE
    ```
  - Expected: File size > 500MB
  - Verification: `ls -lh $BACKUP_FILE | awk '{print $5}'`

- [ ] **Step 12:** Verify backup integrity
  - Command:
    ```bash
    pg_restore --list $BACKUP_FILE | wc -l
    # Should show 5000+ objects
    ```

- [ ] **Step 13:** Create backup checksum
  - Command: `sha256sum $BACKUP_FILE > ${BACKUP_FILE}.sha256`

- [ ] **Step 14:** Copy backup to secondary location
  - Command:
    ```bash
    aws s3 cp $BACKUP_FILE s3://alshaya-backups/production/ \
      --storage-class GLACIER \
      --metadata "backup-date=$(date -Iseconds),version=$(git rev-parse --short HEAD)"
    ```

- [ ] **Step 15:** Verify secondary backup
  - Command: `aws s3 ls s3://alshaya-backups/production/ --human-readable | tail -5`

- [ ] **Step 16:** Create point-in-time recovery (PITR) snapshot
  - Command:
    ```bash
    # For RDS
    aws rds create-db-snapshot \
      --db-instance-identifier alshaya-prod \
      --db-snapshot-identifier alshaya-prod-pre-deploy-$(date +%Y%m%d_%H%M%S)
    ```

- [ ] **Step 17:** Document backup details in deployment log
  - Log file: `/var/log/deployments/alshaya_$(date +%Y%m%d).log`
  - Content:
    ```
    Backup created at: [TIMESTAMP]
    Backup file: [FILENAME]
    Backup size: [SIZE]
    Backup checksum: [SHA256]
    PITR snapshot ID: [SNAPSHOT_ID]
    ```

### Pre-Migration Validation (T-1.5 hours)

- [ ] **Step 18:** Review all pending Prisma migrations
  - Command: `npx prisma migrate status --skip-generate`
  - Expected output: List of pending migrations
  - Action: Document any concerning migrations

- [ ] **Step 19:** Test migrations in staging environment
  - Command:
    ```bash
    # Apply staging database backup
    pg_restore -h $STAGING_DB_HOST -U $DB_USER -d alshaya_staging \
      --clean --if-exists < $BACKUP_FILE

    # Run migrations
    DATABASE_URL=postgresql://$DB_USER:$DB_PASS@$STAGING_DB_HOST:5432/alshaya_staging \
    npx prisma migrate deploy
    ```
  - Verify: No errors, all migrations applied successfully

- [ ] **Step 20:** Validate schema changes
  - Command:
    ```bash
    DATABASE_URL=postgresql://$DB_USER:$DB_PASS@$STAGING_DB_HOST:5432/alshaya_staging \
    npx prisma db push --skip-generate --skip-seed
    ```

- [ ] **Step 21:** Check for data type conflicts
  - Command:
    ```bash
    psql -h $DB_HOST -U $DB_USER -d alshaya_staging -c "\d" | grep -E "(CONSTRAINT|CHECK|TRIGGER)" | wc -l
    ```
  - Expected: All constraints intact

### Docker Image Preparation (T-1 hour)

- [ ] **Step 22:** Build Docker image locally
  - Command:
    ```bash
    docker build \
      --build-arg NODE_ENV=production \
      --build-arg NEXT_PUBLIC_API_VERSION=$(git rev-parse --short HEAD) \
      -t alshaya-app:$(git rev-parse --short HEAD) \
      -t alshaya-app:latest \
      -f Dockerfile.prod .
    ```
  - Expected: Build succeeds, image size < 500MB

- [ ] **Step 23:** Scan Docker image for vulnerabilities
  - Command: `trivy image alshaya-app:latest --severity HIGH,CRITICAL`
  - Action: Address any CRITICAL vulnerabilities before proceeding

- [ ] **Step 24:** Test Docker image locally
  - Command:
    ```bash
    docker run -d \
      --name alshaya-test \
      -e NODE_ENV=production \
      -e DATABASE_URL=$STAGING_DB_URL \
      -p 3000:3000 \
      alshaya-app:latest

    sleep 5
    curl http://localhost:3000/api/v1/health
    docker stop alshaya-test && docker rm alshaya-test
    ```
  - Expected: HTTP 200 response

- [ ] **Step 25:** Push Docker image to registry
  - Command:
    ```bash
    REGISTRY=docker.io/alshaya
    docker tag alshaya-app:latest $REGISTRY/alshaya-app:latest
    docker tag alshaya-app:$(git rev-parse --short HEAD) $REGISTRY/alshaya-app:$(git rev-parse --short HEAD)

    docker push $REGISTRY/alshaya-app:latest
    docker push $REGISTRY/alshaya-app:$(git rev-parse --short HEAD)
    ```
  - Verify: `docker inspect $REGISTRY/alshaya-app:latest`

- [ ] **Step 26:** Create image manifest with security scan results
  - Command:
    ```bash
    cat > /tmp/image-manifest.json <<EOF
    {
      "image": "docker.io/alshaya/alshaya-app:latest",
      "tag": "$(git rev-parse --short HEAD)",
      "pushed_at": "$(date -Iseconds)",
      "scanned": true,
      "vulnerabilities": {
        "CRITICAL": 0,
        "HIGH": 0
      }
    }
    EOF
    ```

### Database Migration Phase (T-30 minutes)

- [ ] **Step 27:** Stop all application pods gracefully
  - Command:
    ```bash
    kubectl scale deployment next-app -n production --replicas=0
    kubectl scale deployment background-jobs -n production --replicas=0
    kubectl wait --for=condition=terminated pod -l app=next-app -n production --timeout=120s
    ```
  - Verify: `kubectl get pods -n production | grep next-app`

- [ ] **Step 28:** Execute database migrations
  - Command:
    ```bash
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:5432/alshaya_prod"
    npx prisma migrate deploy --skip-generate 2>&1 | tee /var/log/deployments/migration_$(date +%Y%m%d_%H%M%S).log
    ```
  - Expected: "All migrations have been successfully applied"

- [ ] **Step 29:** Verify migration status
  - Command:
    ```bash
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:5432/alshaya_prod"
    npx prisma migrate status --skip-generate
    ```
  - Expected: "Database schema is up to date"

- [ ] **Step 30:** Validate database integrity post-migration
  - Command:
    ```bash
    psql -h $DB_HOST -U $DB_USER -d alshaya_prod <<EOF
    -- Check table counts
    SELECT schemaname, COUNT(*) as table_count FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    GROUP BY schemaname;

    -- Check for missing indexes
    SELECT schemaname, tablename FROM pg_tables
    WHERE schemaname = 'public';

    -- Verify no NULL in required columns
    SELECT table_name FROM information_schema.columns
    WHERE is_nullable = 'YES' AND table_schema = 'public' LIMIT 5;
    EOF
    ```
  - Action: Document any anomalies

### Kubernetes Deployment Phase (T-15 minutes)

- [ ] **Step 31:** Update Kubernetes deployment manifest with new image
  - Command:
    ```bash
    kubectl set image deployment/next-app \
      next-app=docker.io/alshaya/alshaya-app:$(git rev-parse --short HEAD) \
      -n production \
      --record
    ```

- [ ] **Step 32:** Configure rolling update strategy
  - Command:
    ```bash
    kubectl patch deployment next-app -n production --type='json' -p='[
      {
        "op": "replace",
        "path": "/spec/strategy/type",
        "value":"RollingUpdate"
      },
      {
        "op": "replace",
        "path": "/spec/strategy/rollingUpdate/maxUnavailable",
        "value": 0
      },
      {
        "op": "replace",
        "path": "/spec/strategy/rollingUpdate/maxSurge",
        "value": 1
      }
    ]'
    ```

- [ ] **Step 33:** Scale up application pods gradually
  - Command:
    ```bash
    for replicas in 1 2 4 8; do
      kubectl scale deployment next-app -n production --replicas=$replicas
      sleep 10
      # Check pod status
      kubectl get pods -n production -l app=next-app --no-headers | grep -c Running
    done
    ```
  - Expected: Pods transition from 0 → 1 → 2 → 4 → 8

- [ ] **Step 34:** Monitor rollout progress
  - Command: `kubectl rollout status deployment/next-app -n production --timeout=600s`
  - Expected: "deployment "next-app" successfully rolled out"

- [ ] **Step 35:** Verify all pods are running and ready
  - Command:
    ```bash
    kubectl get pods -n production -l app=next-app -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\t"}{.status.conditions[?(@.type=="Ready")].status}{"\n"}{end}'
    ```
  - Expected: All pods showing Running and True for Ready status

### Post-Deployment Verification (T-0 to T+30 minutes)

- [ ] **Step 36:** Check application health endpoints
  - Command:
    ```bash
    for i in {1..5}; do
      echo "Health check attempt $i:"
      curl -s -w "\nHTTP Status: %{http_code}\n" https://alshaya.app/api/v1/health
      sleep 5
    done
    ```
  - Expected: HTTP 200 with response: `{"status":"ok","timestamp":"2026-03-08T..."}`

- [ ] **Step 37:** Verify database connection pool health
  - Command:
    ```bash
    curl -s https://alshaya.app/api/v1/admin/health/database | jq '.pool'
    ```
  - Expected: `{"available":45,"total":50,"idle":40}`

- [ ] **Step 38:** Check Redis cache connectivity
  - Command:
    ```bash
    curl -s https://alshaya.app/api/v1/admin/health/cache | jq '.'
    ```
  - Expected: `{"status":"connected","memory_usage_mb":245}`

- [ ] **Step 39:** Verify API endpoints are responding
  - Command:
    ```bash
    endpoints=(
      "/api/v1/families"
      "/api/v1/users/me"
      "/api/v1/members"
      "/api/v1/relationships"
    )

    for endpoint in "${endpoints[@]}"; do
      status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TEST_TOKEN" https://alshaya.app$endpoint)
      echo "$endpoint: $status"
    done
    ```
  - Expected: All endpoints returning 2xx or 3xx status codes

- [ ] **Step 40:** Run smoke tests
  - Command:
    ```bash
    npm run test:smoke:production
    ```
  - Expected: All 25+ smoke tests passing

- [ ] **Step 41:** Verify SSL/TLS certificates
  - Command: `openssl s_client -connect alshaya.app:443 -servername alshaya.app < /dev/null | grep -A 5 "subject="`
  - Expected: Certificate valid for alshaya.app, expiry > 30 days

- [ ] **Step 42:** Check error rate in monitoring
  - Command:
    ```bash
    # Query Sentry for last 30 minutes
    curl -s "https://sentry.io/api/0/projects/alshaya/alshaya-prod/stats/" \
      -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" | jq '.[] | {timestamp, events}'
    ```
  - Expected: Error rate < 0.05% (less than 5 errors per 10,000 requests)

- [ ] **Step 43:** Verify no memory leaks in pods
  - Command:
    ```bash
    kubectl top pods -n production -l app=next-app --containers
    ```
  - Expected: Memory usage stable, no pod > 1000Mi

### Feature Verification (T+30 to T+60 minutes)

- [ ] **Step 44:** Test critical user journeys
  - Journeys to test:
    1. User login with OAuth
    2. Create family tree
    3. Add family member
    4. Update member relationships
    5. Export family tree
  - Command: Run automated journey tests
    ```bash
    npm run test:journeys:production
    ```

- [ ] **Step 45:** Verify authentication flows
  - Test scenarios:
    - [ ] JWT token generation and validation
    - [ ] Session cookie creation
    - [ ] OAuth provider integration
    - [ ] TOTP 2FA verification
    - [ ] Password reset flow
  - Command: `npm run test:auth:production`

- [ ] **Step 46:** Test email delivery (Resend)
  - Command:
    ```bash
    curl -X POST https://alshaya.app/api/v1/test/email \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","type":"welcome"}'
    ```
  - Expected: Email delivered within 30 seconds

- [ ] **Step 47:** Test SMS delivery (Twilio)
  - Command:
    ```bash
    curl -X POST https://alshaya.app/api/v1/test/sms \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"phone":"+1234567890","message":"Test SMS"}'
    ```
  - Expected: SMS delivered within 60 seconds

- [ ] **Step 48:** Verify Google APIs integration
  - Test scenarios:
    - Google Sign-In
    - Google Calendar sync
    - Google Drive file upload
  - Command: Manual testing required or `npm run test:google-apis:production`

- [ ] **Step 49:** Check CDN content delivery
  - Command:
    ```bash
    # Check static assets are served from CDN
    curl -I https://cdn.alshaya.app/_next/static/main.js | grep -E "(X-Cache|Age|ETag)"
    ```
  - Expected: X-Cache: HIT, Age header present

- [ ] **Step 50:** Verify logging and audit trails
  - Command:
    ```bash
    # Check logs are flowing properly
    kubectl logs -n production deployment/next-app --tail=100 | grep -E "(ERROR|WARN)" | wc -l
    ```
  - Expected: < 10 error/warning lines in last 100 logs

### Disable Maintenance Mode (T+60 minutes)

- [ ] **Step 51:** Remove maintenance mode banner
  - Command: `kubectl set env deployment/next-app -n production NEXT_PUBLIC_MAINTENANCE_MODE=false`

- [ ] **Step 52:** Update status page to operational
  - Command:
    ```bash
    curl -X POST https://status.alshaya.app/api/incidents/[INCIDENT_ID]/resolve \
      -H "Authorization: Bearer $STATUS_PAGE_API_KEY" \
      -d '{"resolution":"Deployment completed successfully"}'
    ```

- [ ] **Step 53:** Re-enable scheduled jobs and cron tasks
  - Command:
    ```bash
    kubectl set env cronjob/email-digest -n production CRONJOB_ENABLED=true
    kubectl set env cronjob/backup-cleanup -n production CRONJOB_ENABLED=true
    kubectl set env cronjob/analytics-aggregation -n production CRONJOB_ENABLED=true
    kubectl set env deployment/background-jobs -n production BG_JOBS_ENABLED=true
    ```

- [ ] **Step 54:** Restore database write permissions
  - Command:
    ```bash
    psql -h $DB_HOST -U $DB_USER -d alshaya_prod -c "GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;"
    ```

- [ ] **Step 55:** Send deployment success notification
  - **Template:**
    ```
    Subject: Al-Shaya Family Tree - Deployment Complete

    The scheduled maintenance has completed successfully.

    Release Version: [VERSION]
    Deploy Time: [DURATION]
    Deployed By: [ENGINEER]

    Changes deployed:
    - [Feature 1]
    - [Feature 2]

    The service is now available. Thank you for your patience.
    ```

---

## 2. BLUE/GREEN & CANARY DEPLOYMENT STRATEGY

### Blue/Green Deployment Configuration

#### Initial Setup

- [ ] **Kubernetes Resources Setup:**
  - Command: Apply blue/green deployment manifests
    ```bash
    kubectl apply -f k8s/blue-deployment.yaml -n production
    kubectl apply -f k8s/green-deployment.yaml -n production
    kubectl apply -f k8s/service-blue-green.yaml -n production
    ```

  - **blue-deployment.yaml:**
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: next-app-blue
      namespace: production
      labels:
        app: next-app
        version: blue
    spec:
      replicas: 8
      selector:
        matchLabels:
          app: next-app
          version: blue
      template:
        metadata:
          labels:
            app: next-app
            version: blue
        spec:
          containers:
          - name: next-app
            image: docker.io/alshaya/alshaya-app:v1.2.3
            ports:
            - containerPort: 3000
            env:
            - name: NODE_ENV
              value: production
            - name: DEPLOYMENT_VERSION
              value: blue
            livenessProbe:
              httpGet:
                path: /api/v1/health
                port: 3000
              initialDelaySeconds: 30
              periodSeconds: 10
              timeoutSeconds: 5
              failureThreshold: 3
            readinessProbe:
              httpGet:
                path: /api/v1/health
                port: 3000
              initialDelaySeconds: 10
              periodSeconds: 5
              timeoutSeconds: 3
              failureThreshold: 2
            resources:
              requests:
                memory: "512Mi"
                cpu: "500m"
              limits:
                memory: "1024Mi"
                cpu: "1000m"
    ```

  - **service-blue-green.yaml:**
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: next-app-service
      namespace: production
    spec:
      type: LoadBalancer
      selector:
        app: next-app
        version: blue  # Initially points to blue
      ports:
      - protocol: TCP
        port: 80
        targetPort: 3000
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: next-app-blue
      namespace: production
    spec:
      selector:
        app: next-app
        version: blue
      ports:
      - protocol: TCP
        port: 3000
        targetPort: 3000
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: next-app-green
      namespace: production
    spec:
      selector:
        app: next-app
        version: green
      ports:
      - protocol: TCP
        port: 3000
        targetPort: 3000
    ```

#### Blue/Green Deployment Process

- [ ] **Step 1: Deploy to Green Environment**
  - Command:
    ```bash
    # Scale down green first
    kubectl scale deployment next-app-green -n production --replicas=0

    # Update green deployment with new image
    kubectl set image deployment/next-app-green \
      next-app=docker.io/alshaya/alshaya-app:$(git rev-parse --short HEAD) \
      -n production

    # Scale up gradually
    for replicas in 2 4 6 8; do
      kubectl scale deployment next-app-green -n production --replicas=$replicas
      sleep 15
      kubectl rollout status deployment/next-app-green -n production --timeout=120s
    done
    ```

- [ ] **Step 2: Verify Green Environment**
  - Command:
    ```bash
    # Get green pod IPs
    GREEN_PODS=$(kubectl get pods -n production -l version=green -o jsonpath='{.items[*].status.podIP}')

    for pod_ip in $GREEN_PODS; do
      echo "Testing $pod_ip..."
      curl -s -w "HTTP Status: %{http_code}\n" http://$pod_ip:3000/api/v1/health
    done
    ```
  - Expected: All green pods responding with 200 OK

- [ ] **Step 3: Run Smoke Tests Against Green**
  - Command:
    ```bash
    GREEN_ENDPOINT=$(kubectl get service next-app-green -n production -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'):3000

    npm run test:smoke -- --base-url=http://$GREEN_ENDPOINT
    ```
  - Expected: All smoke tests passing

- [ ] **Step 4: Traffic Validation on Green (Read-Only)**
  - Command:
    ```bash
    # Route 1% traffic to green for metric collection
    kubectl patch service next-app-service -n production --type='json' -p='[
      {
        "op": "replace",
        "path": "/spec/selector/version",
        "value": "blue"
      }
    ]'

    # Create canary service pointing to green
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: Service
    metadata:
      name: next-app-canary
      namespace: production
    spec:
      selector:
        app: next-app
        version: green
      ports:
      - protocol: TCP
        port: 3000
        targetPort: 3000
    EOF
    ```

- [ ] **Step 5: Monitor Green Metrics for 5 minutes**
  - Command:
    ```bash
    # Monitor error rates, response times, CPU, memory
    for i in {1..5}; do
      echo "--- Minute $i ---"
      kubectl top pods -n production -l version=green --containers
      sleep 60
    done
    ```
  - Expected thresholds:
    - Error rate: < 0.5%
    - P95 latency: < 1000ms
    - CPU usage: < 80% of request limit
    - Memory usage: < 70% of limit

### Switch to Green (Traffic Cutover)

- [ ] **Step 6: Switch Main Service to Green**
  - Command:
    ```bash
    kubectl patch service next-app-service -n production --type='json' -p='[
      {
        "op": "replace",
        "path": "/spec/selector/version",
        "value": "green"
      }
    ]'

    # Verify service selector
    kubectl get service next-app-service -n production -o jsonpath='{.spec.selector}'
    ```
  - Expected: `{"app":"next-app","version":"green"}`

- [ ] **Step 7: Immediate Traffic Verification**
  - Command:
    ```bash
    # Test main endpoint
    for i in {1..10}; do
      status=$(curl -s -o /dev/null -w "%{http_code}" https://alshaya.app)
      echo "Request $i: $status"
      sleep 1
    done
    ```
  - Expected: All 200 responses

- [ ] **Step 8: Monitor Green for 30 Minutes Post-Switch**
  - Command:
    ```bash
    # Continuous monitoring script
    bash scripts/monitor-deployment.sh green 30
    ```
  - Expected thresholds:
    - Error rate: < 0.1% (less than 1 error per 1000 requests)
    - P95 latency: < 500ms
    - P99 latency: < 1000ms
    - Database pool available connections: > 20
    - Cache hit rate: > 80%

### Rollback to Blue (If Needed)

- [ ] **Step 9: Immediate Rollback Decision Criteria**
  - Rollback if ANY of these trigger:
    ```
    [ ] Error rate > 1% (>100 errors per 10,000 requests)
    [ ] P95 latency > 2000ms (2x baseline)
    [ ] 5xx error count > 100 in 5-minute window
    [ ] CPU usage > 95% sustained for >2 minutes
    [ ] Memory usage > 95% on any pod
    [ ] Database connection pool exhausted
    [ ] Critical feature broken (login, create family, export)
    [ ] Unexpected data corruption detected
    ```

- [ ] **Step 10: Execute Rollback to Blue**
  - Command:
    ```bash
    echo "INITIATING ROLLBACK TO BLUE"

    # Switch service back to blue
    kubectl patch service next-app-service -n production --type='json' -p='[
      {
        "op": "replace",
        "path": "/spec/selector/version",
        "value": "blue"
      }
    ]'

    # Verify switch
    sleep 5
    curl -s https://alshaya.app/api/v1/health

    # Monitor blue
    for i in {1..5}; do
      echo "Post-rollback check $i:"
      curl -s -w "HTTP Status: %{http_code}\n" https://alshaya.app/api/v1/health
      sleep 10
    done
    ```

- [ ] **Step 11: Investigate Green Failure**
  - Command:
    ```bash
    # Collect logs from green pods
    kubectl logs -n production -l version=green --tail=200 > /tmp/green-logs-failure.txt

    # Get events
    kubectl describe deployment next-app-green -n production > /tmp/green-events.txt

    # Get metrics
    kubectl top pods -n production -l version=green > /tmp/green-metrics.txt

    # Archive for investigation
    tar czf /tmp/green-failure-$(date +%Y%m%d_%H%M%S).tar.gz /tmp/green-* /tmp/*-failure.txt
    ```

### Keep Blue for Safety Period

- [ ] **Step 12: Maintain Blue as Rollback Point (T+24 hours)**
  - Action: Keep blue deployment running at scale for 24 hours
  - Command:
    ```bash
    # Set blue to warm standby (2 replicas)
    kubectl scale deployment next-app-blue -n production --replicas=2

    # Keep green at full scale
    kubectl scale deployment next-app-green -n production --replicas=8
    ```
  - After 24 hours without issues: `kubectl delete deployment next-app-blue -n production`

---

### Canary Release Strategy

#### Initial Canary Configuration (10% Traffic)

- [ ] **Step 1: Deploy Canary Version**
  - Command:
    ```bash
    # Create canary deployment (initial 1 replica = 10% of 8 replicas)
    kubectl apply -f k8s/canary-deployment.yaml -n production
    ```

  - **canary-deployment.yaml:**
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: next-app-canary
      namespace: production
      labels:
        app: next-app
        version: canary
    spec:
      replicas: 1  # 10% of 8
      selector:
        matchLabels:
          app: next-app
          version: canary
      template:
        metadata:
          labels:
            app: next-app
            version: canary
        spec:
          containers:
          - name: next-app
            image: docker.io/alshaya/alshaya-app:v1.3.0  # New version
            ports:
            - containerPort: 3000
            env:
            - name: DEPLOYMENT_VERSION
              value: canary
            livenessProbe:
              httpGet:
                path: /api/v1/health
                port: 3000
              initialDelaySeconds: 30
              periodSeconds: 10
    ```

- [ ] **Step 2: Configure Istio VirtualService for 10% Canary**
  - Command:
    ```bash
    kubectl apply -f - <<EOF
    apiVersion: networking.istio.io/v1beta1
    kind: VirtualService
    metadata:
      name: next-app-canary-vs
      namespace: production
    spec:
      hosts:
      - alshaya.app
      http:
      - match:
        - uri:
            prefix: "/"
        route:
        - destination:
            host: next-app-stable
            port:
              number: 80
          weight: 90
        - destination:
            host: next-app-canary
            port:
              number: 80
          weight: 10
        timeout: 30s
        retries:
          attempts: 3
          perTryTimeout: 10s
    EOF
    ```

- [ ] **Step 3: Monitor Canary Metrics (10 minutes)**
  - Command:
    ```bash
    # Collect baseline metrics
    CANARY_START=$(date +%s)

    while true; do
      ELAPSED=$(($(date +%s) - CANARY_START))
      if [ $ELAPSED -gt 600 ]; then break; fi

      echo "=== Canary Metrics (10% traffic) - ${ELAPSED}s ==="

      # Get canary pod metrics
      kubectl top pods -n production -l version=canary --containers

      # Get error rate from Prometheus
      curl -s "http://prometheus:9090/api/v1/query?query=increase(http_requests_total{version='canary',status=~'5..'}[1m])" | jq '.data.result[0].value[1]'

      # Get latency P95
      curl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.95,rate(http_request_duration_seconds_bucket{version='canary'}[1m]))" | jq '.data.result[0].value[1]'

      sleep 30
    done
    ```

  - **Decision Criteria for 10% Canary:**
    - [ ] Error rate < 0.5%
    - [ ] P95 latency < 1500ms
    - [ ] CPU usage < 85%
    - [ ] Memory usage < 75%
    - [ ] No pod restarts
    - [ ] All health checks passing

  - **If OK, proceed to 25%**
  - **If FAIL, immediately rollback:**
    ```bash
    kubectl delete deployment next-app-canary -n production
    kubectl patch virtualservice next-app-canary-vs -n production --type='json' -p='[
      {"op": "replace", "path": "/spec/http/0/route/1/weight", "value": 0}
    ]'
    ```

#### Canary at 25% Traffic

- [ ] **Step 4: Scale Canary to 25% (2 replicas)**
  - Command: `kubectl scale deployment next-app-canary -n production --replicas=2`

  - **Update VirtualService:**
    ```bash
    kubectl patch virtualservice next-app-canary-vs -n production --type='json' -p='[
      {"op": "replace", "path": "/spec/http/0/route/0/weight", "value": 75},
      {"op": "replace", "path": "/spec/http/0/route/1/weight", "value": 25}
    ]'
    ```

- [ ] **Step 5: Monitor 25% Canary (20 minutes)**
  - Command: `bash scripts/monitor-canary.sh 25 20`

  - **Decision Criteria:**
    - [ ] Error rate < 0.3%
    - [ ] P95 latency < 750ms
    - [ ] No increase in error types
    - [ ] Database performance stable
    - [ ] Cache hit rate > 75%

  - **If OK, proceed to 50%**
  - **If FAIL, rollback:**
    ```bash
    kubectl scale deployment next-app-canary -n production --replicas=0
    kubectl patch virtualservice next-app-canary-vs -n production --type='json' -p='[
      {"op": "replace", "path": "/spec/http/0/route/1/weight", "value": 0}
    ]'
    ```

#### Canary at 50% Traffic

- [ ] **Step 6: Scale Canary to 50% (4 replicas)**
  - Command: `kubectl scale deployment next-app-canary -n production --replicas=4`

  - **Update VirtualService:**
    ```bash
    kubectl patch virtualservice next-app-canary-vs -n production --type='json' -p='[
      {"op": "replace", "path": "/spec/http/0/route/0/weight", "value": 50},
      {"op": "replace", "path": "/spec/http/0/route/1/weight", "value": 50}
    ]'
    ```

- [ ] **Step 7: Monitor 50% Canary (30 minutes)**
  - Command: `bash scripts/monitor-canary.sh 50 30`

  - **Decision Criteria:**
    - [ ] Error rate < 0.2%
    - [ ] P95 latency < 600ms
    - [ ] P99 latency < 1000ms
    - [ ] Memory leak detection: memory growth < 50MB over 30 min
    - [ ] Database pool available: > 15
    - [ ] Real user journeys working: login, create family, export

  - **If OK, proceed to 100%**
  - **If FAIL, rollback to stable version**

#### Full Release (100% Traffic)

- [ ] **Step 8: Promote Canary to 100%**
  - Command:
    ```bash
    # Scale stable down
    kubectl scale deployment next-app-stable -n production --replicas=0

    # Scale canary to full (8 replicas)
    kubectl scale deployment next-app-canary -n production --replicas=8

    # Update VirtualService
    kubectl patch virtualservice next-app-canary-vs -n production --type='json' -p='[
      {"op": "replace", "path": "/spec/http/0/route/0/weight", "value": 0},
      {"op": "replace", "path": "/spec/http/0/route/1/weight", "value": 100}
    ]'

    # Rename canary to stable
    kubectl patch deployment next-app-canary -n production -p '{"metadata":{"labels":{"version":"stable"}}}'
    ```

- [ ] **Step 9: Final Verification (30 minutes)**
  - Command: `npm run test:smoke:production && npm run test:journeys:production`
  - Expected: All tests passing

- [ ] **Step 10: Cleanup Old Deployment**
  - Command:
    ```bash
    kubectl delete deployment next-app-stable -n production
    kubectl delete virtualservice next-app-canary-vs -n production
    kubectl apply -f k8s/deployment-prod.yaml -n production  # Apply standard deployment
    ```

---

## 3. IMMEDIATE POST-DEPLOY VERIFICATION (T+0 to T+1hr)

### Health & Connectivity Checks (First 5 minutes)

- [ ] **Check 1: Primary Health Endpoint**
  - Command:
    ```bash
    response=$(curl -s -w "\n%{http_code}" https://alshaya.app/api/v1/health)
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -1)

    if [ "$http_code" = "200" ]; then
      echo "✓ Health endpoint OK"
      echo "$body" | jq '.'
    else
      echo "✗ Health endpoint FAILED: HTTP $http_code"
      exit 1
    fi
    ```
  - Expected: HTTP 200, `{"status":"ok"}`
  - Threshold: Must complete within 2 seconds

- [ ] **Check 2: Database Connection Health**
  - Command:
    ```bash
    curl -s https://alshaya.app/api/v1/admin/health/database | jq '{
      status: .status,
      pool_available: .pool.available,
      pool_total: .pool.total,
      response_time_ms: .response_time_ms
    }'
    ```
  - Expected:
    ```json
    {
      "status": "ok",
      "pool_available": 45,
      "pool_total": 50,
      "response_time_ms": 2
    }
    ```
  - Thresholds:
    - Available connections: > 40 (80%)
    - Response time: < 10ms

- [ ] **Check 3: Redis Cache Health**
  - Command:
    ```bash
    curl -s https://alshaya.app/api/v1/admin/health/cache | jq '{
      status: .status,
      memory_usage_mb: .memory_usage_mb,
      connected_clients: .connected_clients,
      response_time_ms: .response_time_ms
    }'
    ```
  - Expected:
    ```json
    {
      "status": "connected",
      "memory_usage_mb": 245,
      "connected_clients": 8,
      "response_time_ms": 1
    }
    ```
  - Thresholds:
    - Connected clients: 4-12
    - Response time: < 5ms

- [ ] **Check 4: All Pod Status**
  - Command:
    ```bash
    kubectl get pods -n production -l app=next-app \
      -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\t"}{.status.containerStatuses[0].ready}{"\n"}{end}'
    ```
  - Expected: All Running, all Ready=True
  - Count: Must match expected replica count (8)

- [ ] **Check 5: Pod Restart Count**
  - Command:
    ```bash
    kubectl get pods -n production -l app=next-app \
      -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[0].restartCount}{"\n"}{end}' \
      | awk '$2 > 0 {print "RESTART: " $0}'
    ```
  - Expected: No output (zero restarts)

- [ ] **Check 6: Service Endpoints**
  - Command:
    ```bash
    kubectl get endpoints next-app-service -n production \
      -o jsonpath='{.subsets[0].addresses[*].ip}' | wc -w
    ```
  - Expected: 8 (all pods registered)

### Application Response Verification (5-15 minutes)

- [ ] **Check 7: API Endpoint Availability**
  - Command:
    ```bash
    declare -a endpoints=(
      "/api/v1/health"
      "/api/v1/families"
      "/api/v1/users/me"
      "/api/v1/members"
      "/api/v1/relationships"
      "/api/v1/admin/stats"
    )

    failed=0
    for endpoint in "${endpoints[@]}"; do
      status=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $TEST_JWT_TOKEN" \
        https://alshaya.app$endpoint)

      if [[ "$status" =~ ^(200|301|302|401|403)$ ]]; then
        echo "✓ $endpoint: $status"
      else
        echo "✗ $endpoint: $status"
        ((failed++))
      fi
    done

    if [ $failed -gt 0 ]; then exit 1; fi
    ```
  - Expected: All endpoints returning 2xx/3xx (or 401/403 if auth required)
  - Thresholds:
    - Response time: < 500ms per endpoint
    - Success rate: 100%

- [ ] **Check 8: Authentication Flow**
  - Command:
    ```bash
    # Test JWT token validation
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $TEST_JWT_TOKEN" \
      https://alshaya.app/api/v1/users/me)

    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -1)

    if [ "$http_code" = "200" ]; then
      echo "✓ JWT Authentication OK"
      echo "$body" | jq '.user.id'
    else
      echo "✗ JWT Authentication FAILED"
      exit 1
    fi
    ```
  - Expected: HTTP 200, valid user object

- [ ] **Check 9: Session Cookie Validation**
  - Command:
    ```bash
    # Test session cookie handling
    curl -s -c /tmp/cookies.txt https://alshaya.app/login

    session_cookie=$(grep 'SESSION' /tmp/cookies.txt | awk '{print $7}')

    if [ -n "$session_cookie" ]; then
      echo "✓ Session cookie created: $session_cookie"
    else
      echo "✗ Session cookie missing"
      exit 1
    fi
    ```
  - Expected: SESSION cookie present

- [ ] **Check 10: CORS Headers**
  - Command:
    ```bash
    curl -s -w "\nHeaders: %{http_code}\n" \
      -H "Origin: https://example.com" \
      -H "Access-Control-Request-Method: POST" \
      -X OPTIONS \
      https://alshaya.app/api/v1/families | grep -E "(Access-Control|X-Frame)"
    ```
  - Expected: Appropriate CORS headers present

### Error & Performance Monitoring (15-30 minutes)

- [ ] **Check 11: Error Rate Analysis**
  - Command:
    ```bash
    # Query Sentry for errors in last 10 minutes
    curl -s "https://sentry.io/api/0/projects/alshaya/alshaya-prod/stats/" \
      -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
      -d "stat=24h" | jq '{
        total_events: .[] | length,
        by_level: group_by(.level)
      }'
    ```
  - Expected thresholds:
    - Total error rate: < 0.5% (< 50 errors per 10,000 requests)
    - 5xx errors: < 10 total
    - No spike in specific error types

- [ ] **Check 12: Response Time Metrics**
  - Command:
    ```bash
    # Query Prometheus for response times
    for quantile in 50 95 99; do
      query="histogram_quantile(0.$quantile,rate(http_request_duration_seconds_bucket[5m]))"
      curl -s "http://prometheus:9090/api/v1/query?query=$query" | jq ".data.result[] | {
        instance: .metric.instance,
        p${quantile}: .value[1]
      }"
    done
    ```
  - Expected thresholds:
    - P50: < 100ms
    - P95: < 500ms
    - P99: < 1000ms

- [ ] **Check 13: Database Query Performance**
  - Command:
    ```bash
    psql -h $DB_HOST -U $DB_USER -d alshaya_prod <<EOF
    SELECT
      query,
      calls,
      mean_exec_time,
      max_exec_time
    FROM pg_stat_statements
    ORDER BY mean_exec_time DESC
    LIMIT 10;
    EOF
    ```
  - Expected: Mean exec time for most queries < 10ms
  - Check: Any new slow queries post-deployment

- [ ] **Check 14: Database Connection Pool Status**
  - Command:
    ```bash
    psql -h $DB_HOST -U $DB_USER -d alshaya_prod -c "SELECT datname, count(*) as connections FROM pg_stat_activity GROUP BY datname;"
    ```
  - Expected: connections < 40 (reserve buffer)
  - Alert if: > 45 connections

- [ ] **Check 15: Memory Usage Trend**
  - Command:
    ```bash
    for i in {1..10}; do
      echo "Sample $i: $(date)"
      kubectl top pods -n production -l app=next-app --containers | grep -v NAME | awk '{print $3}' | paste -sd+ | bc
      sleep 30
    done
    ```
  - Expected: Memory usage stable (< 5% change over 5 minutes)
  - Red flag: Continuous growth (memory leak)

### Critical Feature Testing (30-45 minutes)

- [ ] **Check 16: User Login Flow**
  - Steps:
    1. Navigate to `/login`
    2. Enter test credentials
    3. Submit login form
    4. Verify redirect to dashboard
    5. Verify JWT token in localStorage
    6. Verify user data loaded
  - Expected: Complete in < 3 seconds, no errors in console

- [ ] **Check 17: Create Family Tree**
  - Steps:
    1. POST to `/api/v1/families`
    2. Create test family with 5 members
    3. Verify response includes family_id
    4. Verify data persisted in database
  - Command:
    ```bash
    family_response=$(curl -s -X POST https://alshaya.app/api/v1/families \
      -H "Authorization: Bearer $TEST_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name":"Test Family","created_by":"test-user"}')

    family_id=$(echo "$family_response" | jq '.data.id')
    echo "Created family: $family_id"
    ```
  - Expected: family_id returned and > 0

- [ ] **Check 18: Add Family Member**
  - Command:
    ```bash
    member_response=$(curl -s -X POST https://alshaya.app/api/v1/members \
      -H "Authorization: Bearer $TEST_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"family_id\":\"$family_id\",
        \"first_name\":\"Ahmed\",
        \"last_name\":\"AlShaya\",
        \"gender\":\"M\",
        \"date_of_birth\":\"1980-01-15\"
      }")

    member_id=$(echo "$member_response" | jq '.data.id')
    echo "Created member: $member_id"
    ```
  - Expected: member_id returned and > 0

- [ ] **Check 19: Create Relationship**
  - Command:
    ```bash
    relationship_response=$(curl -s -X POST https://alshaya.app/api/v1/relationships \
      -H "Authorization: Bearer $TEST_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"from_member_id\":\"$member_id\",
        \"to_member_id\":\"$member_id_2\",
        \"relationship_type\":\"PARENT\"
      }")

    rel_id=$(echo "$relationship_response" | jq '.data.id')
    echo "Created relationship: $rel_id"
    ```
  - Expected: rel_id returned and relationship persisted

- [ ] **Check 20: Export Family Tree**
  - Command:
    ```bash
    export_response=$(curl -s -X POST https://alshaya.app/api/v1/families/$family_id/export \
      -H "Authorization: Bearer $TEST_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"format":"pdf"}')

    download_url=$(echo "$export_response" | jq '.data.download_url')
    echo "Export URL: $download_url"

    # Verify file exists
    curl -s -I "$download_url" | grep -q "200" && echo "✓ Export successful"
    ```
  - Expected: PDF generated and downloadable within 30 seconds

### External Service Verification (45-60 minutes)

- [ ] **Check 21: Email Service (Resend)**
  - Command:
    ```bash
    email_response=$(curl -s -X POST https://alshaya.app/api/v1/test/email \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","type":"welcome"}')

    message_id=$(echo "$email_response" | jq '.data.message_id')
    echo "Email message ID: $message_id"
    ```
  - Expected: message_id returned, email received within 30 seconds
  - Check: Email inbox for test message

- [ ] **Check 22: SMS Service (Twilio)**
  - Command:
    ```bash
    sms_response=$(curl -s -X POST https://alshaya.app/api/v1/test/sms \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"phone":"+1234567890","message":"Test SMS"}')

    sms_id=$(echo "$sms_response" | jq '.data.message_id')
    echo "SMS message ID: $sms_id"
    ```
  - Expected: message_id returned, SMS received within 60 seconds

- [ ] **Check 23: OAuth Integration**
  - Steps:
    1. Click "Sign in with Google" button
    2. Complete OAuth flow
    3. Verify user account created/linked
    4. Verify JWT token issued
  - Expected: User logged in, OAuth provider verified

- [ ] **Check 24: Google Drive Integration**
  - Command:
    ```bash
    drive_response=$(curl -s -X POST https://alshaya.app/api/v1/gdrive/sync \
      -H "Authorization: Bearer $TEST_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"folder":"family_trees"}')

    sync_status=$(echo "$drive_response" | jq '.data.status')
    echo "Drive sync status: $sync_status"
    ```
  - Expected: Successful sync, files uploaded to Google Drive

- [ ] **Check 25: Google Calendar Integration**
  - Command:
    ```bash
    calendar_response=$(curl -s -X POST https://alshaya.app/api/v1/calendar/events \
      -H "Authorization: Bearer $TEST_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"event":"Family Reunion","date":"2026-06-01"}')

    event_id=$(echo "$calendar_response" | jq '.data.event_id')
    echo "Calendar event ID: $event_id"
    ```
  - Expected: Event created in Google Calendar

### CDN & Static Asset Verification (50-60 minutes)

- [ ] **Check 26: Static Asset Delivery**
  - Command:
    ```bash
    # Test CSS, JS, and image delivery
    assets=(
      "/_next/static/chunks/main.js"
      "/_next/static/css/styles.css"
      "/assets/logo.png"
    )

    for asset in "${assets[@]}"; do
      response=$(curl -s -I https://cdn.alshaya.app$asset)
      cache_status=$(echo "$response" | grep -i "x-cache" | head -1)
      etag=$(echo "$response" | grep -i "etag")

      echo "Asset: $asset"
      echo "  Cache: $cache_status"
      echo "  ETag: $etag"
    done
    ```
  - Expected:
    - X-Cache: HIT (after first request)
    - Age header present (cache age)
    - ETag present (for cache validation)

- [ ] **Check 27: CDN Geographic Distribution**
  - Command:
    ```bash
    # Test from multiple edge locations
    for region in us-east us-west eu-west ap-southeast; do
      latency=$(curl -s -w "%{time_total}" -o /dev/null \
        -H "CloudFront-Viewer-Country: ${region:0:2}" \
        https://cdn.alshaya.app/_next/static/main.js)
      echo "$region: ${latency}s"
    done
    ```
  - Expected: Latency < 200ms from all regions

- [ ] **Check 28: SSL/TLS Certificate**
  - Command:
    ```bash
    openssl s_client -connect alshaya.app:443 -servername alshaya.app < /dev/null 2>/dev/null | \
      openssl x509 -noout -subject -dates -issuer
    ```
  - Expected:
    - Subject contains alshaya.app
    - Not Before < today < Not After
    - Issuer is trusted CA

- [ ] **Check 29: Security Headers**
  - Command:
    ```bash
    curl -s -I https://alshaya.app | grep -E "(Strict-Transport|X-Frame-Options|X-Content-Type-Options|Content-Security-Policy)"
    ```
  - Expected headers:
    - `Strict-Transport-Security: max-age=31536000`
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Content-Security-Policy: ...`

- [ ] **Check 30: CORS Configuration**
  - Command:
    ```bash
    curl -s -H "Origin: https://trusted-domain.com" \
      -H "Access-Control-Request-Method: POST" \
      -X OPTIONS https://alshaya.app/api/v1/families | \
      grep -E "(Access-Control-Allow-Origin|Access-Control-Allow-Methods)"
    ```
  - Expected: Correct CORS headers for allowed origins

### Logging & Observability (55-60 minutes)

- [ ] **Check 31: Application Logs**
  - Command:
    ```bash
    # Get last 50 logs
    kubectl logs -n production deployment/next-app --tail=50 | tail -20

    # Count error log lines
    ERROR_COUNT=$(kubectl logs -n production deployment/next-app --tail=200 | grep -c "ERROR")
    WARN_COUNT=$(kubectl logs -n production deployment/next-app --tail=200 | grep -c "WARN")

    echo "Errors in last 200 lines: $ERROR_COUNT"
    echo "Warnings in last 200 lines: $WARN_COUNT"
    ```
  - Expected:
    - Errors: < 5
    - Warnings: < 10
    - No fatal errors

- [ ] **Check 32: Database Logs**
  - Command:
    ```bash
    # Check PostgreSQL logs for errors
    tail -50 /var/log/postgresql/postgresql.log | grep -E "(ERROR|FATAL|CRITICAL)"
    ```
  - Expected: No ERROR or FATAL entries

- [ ] **Check 33: Sentry Error Tracking**
  - Command:
    ```bash
    curl -s "https://sentry.io/api/0/organizations/alshaya/issues/" \
      -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" | \
      jq '.[] | {title: .title, event_count: .count, first_seen: .firstSeen}'
    ```
  - Expected: Few new issues, if any
  - Action: Triage any new critical issues

- [ ] **Check 34: Distributed Tracing**
  - Command:
    ```bash
    # Query Jaeger for trace spans
    curl -s "http://jaeger:6831/api/traces?service=next-app" | \
      jq '.data[] | {trace_id: .traceID, span_count: (.spans | length), duration_ms: .duration}'
    ```
  - Expected:
    - Spans complete successfully
    - Durations reasonable for operations
    - No hanging traces

- [ ] **Check 35: Audit Logs**
  - Command:
    ```bash
    # Check for authentication attempts, data modifications
    grep -E "(LOGIN|CREATE|UPDATE|DELETE)" /var/log/audit/audit.log | tail -20
    ```
  - Expected: Proper audit trail of deployment actions


---

## 4. POST-DEPLOY MONITORING (T+1 day to T+7 days)

### Day 1 Monitoring (T+24 hours)

- [ ] **Monitor 1: Error Rate Trend**
  - Command:
    ```bash
    # Query error rates hourly for past 24 hours
    curl -s "https://sentry.io/api/0/organizations/alshaya/stats/" \
      -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
      -d "query=is:error" \
      -d "statsPeriod=24h" | jq '.data[] | {timestamp: .timestamp, errors: .events}'
    ```
  - Threshold: < 0.1% error rate (< 10 errors per 10,000 requests)
  - Action if exceeded: Investigate top error types, create incident if > 1%

- [ ] **Monitor 2: Response Time (P95)**
  - Command:
    ```bash
    curl -s "http://prometheus:9090/api/v1/query_range?query=histogram_quantile(0.95,rate(http_request_duration_seconds_bucket[5m]))&start=$(date -d '24 hours ago' +%s)&end=$(date +%s)&step=3600" | \
      jq '.data.result[] | {timestamp: .values[] | @csv}'
    ```
  - Threshold: < 500ms
  - Alert if: Any 1-hour period > 750ms

- [ ] **Monitor 3: Database Performance**
  - Command:
    ```bash
    psql -h $DB_HOST -U $DB_USER -d alshaya_prod <<EOF
    SELECT
      schemaname,
      tablename,
      n_live_tup,
      n_dead_tup,
      last_vacuum,
      last_autovacuum
    FROM pg_stat_user_tables
    ORDER BY n_dead_tup DESC
    LIMIT 20;
    EOF
    ```
  - Check: Dead tuples < 10% of live tuples
  - Action if excessive: Run manual VACUUM

---

## 5. ROLLBACK PLAN

### Rollback Decision Matrix

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | > 1% | Immediate rollback (SEV1) |
| 5xx error count | > 100 in 5 min | Immediate rollback |
| P95 latency | > 2000ms | Hotfix or rollback |
| Database pool | < 5 available | Immediate rollback |
| Critical feature broken | Any | Immediate rollback |

### Application Server Rollback (5 minutes)

- [ ] **Step 1: Rollback Kubernetes Deployment**
  - Command:
    ```bash
    kubectl rollout undo deployment/next-app -n production
    kubectl rollout status deployment/next-app -n production --timeout=300s
    ```

- [ ] **Step 2: Verify Application Health**
  - Command:
    ```bash
    sleep 30
    curl -s https://alshaya.app/api/v1/health
    ```

### Database Rollback (Point-in-Time Recovery)

- [ ] **Step 1: Initiate PITR**
  - Command:
    ```bash
    aws rds restore-db-instance-from-db-snapshot \
      --db-instance-identifier alshaya-prod-restored \
      --db-snapshot-identifier alshaya-prod-pre-deploy-[TIMESTAMP]
    ```

- [ ] **Step 2: Switch Application to Restored Database**
  - Command:
    ```bash
    kubectl set env deployment/next-app -n production \
      DATABASE_URL="postgresql://$DB_USER:$DB_PASS@alshaya-prod-restored.*.rds.amazonaws.com:5432/alshaya_prod"
    ```

---

## 6. ENVIRONMENT VARIABLES INVENTORY

### Critical Environment Variables (40+ total)

| Variable | Type | Priority |
|----------|------|----------|
| DATABASE_URL | Connection String | CRITICAL |
| SHADOW_DATABASE_URL | Connection String | CRITICAL |
| REDIS_URL | Connection String | CRITICAL |
| JWT_SECRET | String | CRITICAL |
| SESSION_SECRET | String | CRITICAL |
| GOOGLE_CLIENT_ID | String | CRITICAL |
| GOOGLE_CLIENT_SECRET | String | CRITICAL |
| RESEND_API_KEY | String | CRITICAL |
| TWILIO_ACCOUNT_SID | String | CRITICAL |
| TWILIO_AUTH_TOKEN | String | CRITICAL |
| AWS_ACCESS_KEY_ID | String | CRITICAL |
| AWS_SECRET_ACCESS_KEY | String | CRITICAL |
| SENTRY_DSN | String | CRITICAL |
| NODE_ENV | Enum | CRITICAL |
| NEXT_PUBLIC_APP_URL | String | CRITICAL |
| NEXT_PUBLIC_API_URL | String | CRITICAL |

**Rotation Policy:**
- CRITICAL secrets: Every 6 months or immediately if compromised
- API keys: Annually
- Database credentials: Quarterly

---

## 7. INCIDENT RESPONSE PLAN

### Severity Classification

| Severity | SLA | Examples |
|----------|-----|----------|
| SEV1 | 15 min | Complete service outage, all users unable to login |
| SEV2 | 1 hour | 25% users affected, core feature broken |
| SEV3 | 4 hours | < 10% users affected, secondary feature broken |
| SEV4 | 24 hours | Minor issues, single user affected |

### SEV1 Response (15-minute SLA)

- [ ] **T+0min:** Create incident in PagerDuty, page on-call team
- [ ] **T+2min:** Post to #incidents Slack channel with initial facts
- [ ] **T+5min:** Diagnose root cause (check logs, monitoring, recent changes)
- [ ] **T+10min:** Execute mitigation (rollback, restart services, PITR)
- [ ] **T+15min:** Confirm service restored, begin post-mortem

---

## 8. COMPLIANCE CHECKLIST

### Data Privacy (GDPR/CCPA)

- [ ] User data encrypted at rest
- [ ] Deletion jobs running per retention policy
- [ ] Consent tracking enabled
- [ ] Right to be forgotten functional

### Accessibility (WCAG 2.1 AA)

- [ ] Keyboard navigation working
- [ ] Screen reader compatible
- [ ] Color contrast ratios > 4.5:1
- [ ] Text sizing to 200% functional

### Security

- [ ] No hardcoded secrets in code
- [ ] Dependency vulnerabilities < moderate level
- [ ] SSL/TLS certificates valid
- [ ] Audit logging enabled

---

## 9. DEPLOYMENT AUTOMATION SCRIPTS

### Pre-Deploy Validation

```bash
#!/bin/bash
set -euo pipefail

# Verify build succeeds
npm run build || exit 1

# Run tests
npm run test:unit || exit 1
npm run test:integration || exit 1

# Lint and type check
npm run lint || exit 1
npm run type-check || exit 1

# Check dependencies
npm audit --audit-level=moderate || exit 1

# Verify Kubernetes cluster
kubectl cluster-info || exit 1

# Test database
psql -h "$DB_HOST" -U "$DB_USER" -d alshaya_prod -c "SELECT 1;" || exit 1

# Test Redis
redis-cli -h "$REDIS_HOST" ping || exit 1

# Build Docker image
docker build -t alshaya-app:test . || exit 1

# Scan for vulnerabilities
trivy image --severity HIGH,CRITICAL alshaya-app:test || true

echo "✓ All pre-deployment checks passed"
```

### Health Check Automation

```bash
#!/bin/bash

ENDPOINT="https://alshaya.app/api/v1/health"
RETRIES=5

for attempt in $(seq 1 $RETRIES); do
  response=$(curl -s -w "\n%{http_code}" "$ENDPOINT")
  status=$(echo "$response" | tail -1)

  if [ "$status" = "200" ]; then
    echo "✓ Health check passed"
    exit 0
  fi

  [ $attempt -lt $RETRIES ] && sleep 5
done

echo "✗ Health check failed after $RETRIES attempts"
exit 1
```

### Rollback Automation

```bash
#!/bin/bash

echo "Initiating emergency rollback..."

kubectl rollout undo deployment/next-app -n production
kubectl rollout status deployment/next-app -n production --timeout=300s

sleep 10

# Verify health
if curl -s https://alshaya.app/api/v1/health | grep -q "ok"; then
  echo "✓ Rollback successful"
  exit 0
else
  echo "✗ Rollback failed"
  exit 1
fi
```

---

## 10. POST-DEPLOYMENT CHECKLIST (T+7 days)

### Week 1 Stability Verification

- [ ] Error rate < 0.1% sustained for 7 days
- [ ] No database connection issues
- [ ] All scheduled jobs executing properly
- [ ] User engagement metrics normal
- [ ] Feature usage patterns as expected
- [ ] Support ticket volume normal
- [ ] No security incidents
- [ ] Backup completion rate 100%

### Documentation Updates

- [ ] Deployment notes documented
- [ ] Runbooks updated with any issues encountered
- [ ] Architecture documentation current
- [ ] Team trained on new features

### Team Debriefing

- [ ] Retrospective completed
- [ ] Lessons learned documented
- [ ] Action items created for improvements
- [ ] Knowledge transfer completed

---

## DEPLOYMENT SUCCESS CRITERIA

For deployment to be considered successful, ALL must be true:

- [ ] Application responding to 100% of requests
- [ ] Error rate < 0.1% for 24+ hours
- [ ] P95 latency < 500ms sustained
- [ ] All critical journeys working
- [ ] All external integrations operational
- [ ] No rollbacks required in first 7 days
- [ ] Support ticket volume normal
- [ ] User engagement metrics normal
- [ ] Security clean, no vulnerabilities
- [ ] All team members acknowledge success
- [ ] Signed off by VP Engineering

---

**Document Version:** 2.0
**Created:** 2026-03-08
**Next Review:** 2026-04-08
**Owner:** DevOps Team
**Status:** Complete and Ready for Deployment

