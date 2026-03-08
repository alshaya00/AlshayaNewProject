# Al-Shaya Family Tree Application: Sprint Planning Document (Part 1)

**Document Version:** 1.0
**Last Updated:** 2026-03-08
**Sprint Period:** Weeks 1-4 (14 days each)
**Project:** Al-Shaya Family Tree Application
**Stack:** Next.js 14 + React 18 + TypeScript + PostgreSQL 16 + Prisma

---

## Table of Contents
1. [Sprint Overview & Capacity Model](#sprint-overview--capacity-model)
2. [Sprint 1: Security Foundation (Weeks 1-2)](#sprint-1-security-foundation-weeks-1-2)
3. [Sprint 2: Encryption & Hardening (Weeks 3-4)](#sprint-2-encryption--hardening-weeks-3-4)
4. [Sprint Board Layout & Ceremonies](#sprint-board-layout--ceremonies)

---

## Sprint Overview & Capacity Model

### Team Composition & Availability
- **Backend Engineers:** 3 engineers (100% capacity)
- **Frontend Engineers:** 2 engineers (100% capacity)
- **Full-Stack Engineer:** 1 engineer (80% capacity - DevOps liaison)
- **QA Engineer:** 1 engineer (100% capacity)
- **DevOps Engineer:** 1 engineer (60% capacity - infrastructure focus)
- **Product Manager:** 1 person (40% capacity - planning/coordination)

**Total Team Size:** 9 people

### Sprint Duration & Calendar
- **Sprint Length:** 2 weeks (10 working days)
- **Daily Standup:** 9:30 AM (15 minutes)
- **Sprint Planning:** Day 1, 10:00 AM - 11:30 AM
- **Sprint Review/Demo:** Day 10, 3:00 PM - 4:00 PM
- **Sprint Retrospective:** Day 10, 4:00 PM - 4:45 PM
- **Backlog Refinement:** Every Thursday, 2:00 PM - 2:45 PM

### Capacity Calculation Model

#### Story Points Definition (Fibonacci Sequence)
- **1 point:** < 2 hours, trivial changes, no testing complexity
- **2 points:** 2-4 hours, simple features, basic testing
- **3 points:** 4-8 hours, moderate complexity, requires unit tests
- **5 points:** 8-16 hours, higher complexity, needs integration testing
- **8 points:** 16-24 hours, significant complexity, multiple components
- **13 points:** 24-40 hours, high complexity, requires architectural decisions

#### Hours per Story Point
- **1 point = 2 hours** (includes development, review, testing)
- **2 points = 4 hours**
- **3 points = 6 hours**
- **5 points = 10 hours**
- **8 points = 16 hours**
- **13 points = 26 hours**

#### Individual Engineer Capacity (per 2-week sprint)

**Available Hours per Engineer:**
- 40 hours/week × 2 weeks = 80 hours
- Minus 15 min daily standup × 10 days = 2.5 hours
- Minus Sprint Planning (1.5 hrs) and Ceremonies (1.75 hrs) = 3.25 hours
- Minus 10% buffer for interruptions/ad-hoc = 8 hours
- **Net Available Hours: ~65 hours per engineer**

**Per Role Capacity Breakdown:**

| Role | Available Hours | Expected Story Points | Buffer for Code Review |
|------|-----------------|----------------------|------------------------|
| Backend Engineer (x3) | 65 hrs each | ~20-22 points | 20% review time |
| Frontend Engineer (x2) | 65 hrs each | ~20-22 points | 20% review time |
| Full-Stack Engineer | 52 hrs (80%) | ~15-17 points | 25% ops/review |
| QA Engineer | 65 hrs | ~18-20 points (test tickets) | 15% test planning |
| DevOps Engineer | 39 hrs (60%) | ~10-12 points | 30% infrastructure |
| PM (Coordinator) | 26 hrs (40%) | ~3-5 points | Planning/coordination |

#### Total Sprint Capacity

**Calculation:**
- Backend: 3 × 21 points = 63 points
- Frontend: 2 × 21 points = 42 points
- Full-Stack: 16 points
- QA: 19 points
- DevOps: 11 points
- PM: 4 points

**Total Sprint Capacity: ~155 story points**

### Velocity & Historical Context

**Assumptions for Sprints 1-2:**
- **Conservative Velocity:** 70% of capacity = ~109 points per sprint
- **Rationale:** Team is addressing critical security issues (new domain), unknown dependencies, potential hotfixes
- **Velocity Trend:** Expect 75-80% capacity by Sprint 3-4 as team stabilizes

**Buffer Allocation:**
- **Critical Security Incidents:** 10% of sprint capacity reserved (11 points)
- **Unplanned Technical Debt:** 5% of sprint capacity reserved (5.5 points)
- **Planned Risk Buffer:** Remaining slack in velocity assumption (20-30% of capacity)

### Commitment Strategy

**Sprint Goals (vs. Stretch Goals):**
- **Sprint Goal:** 85 story points (55% of total capacity)
- **Target Completion:** ≥90% of committed work (≥76 points)
- **Stretch Goal:** 110 points (71% of capacity)
- **Contingency:** Unscheduled work cuts from: Stretch items → Non-critical tickets → Lower-priority features

**Priority Rules for Capacity:**
1. All CRITICAL security fixes (P001-P010) are non-negotiable
2. Dependent work must complete before dependent tasks
3. Code review is mandatory for all changes (included in story point estimate)
4. QA testing included in Definition of Done (DoD)
5. No story points awarded until Definition of Done met

---

## Sprint 1: Security Foundation (Weeks 1-2)

**Sprint Goal:** Eliminate all CRITICAL security vulnerabilities (P001-P010) and establish secure development practices baseline.

**Key Outcomes:**
- X-Frame-Options and Core Security Headers fixed across all endpoints
- Secrets management remediated (no plaintext passwords, tokens, codes)
- Session token and OAuth validations implemented
- Race condition in Member ID generation eliminated
- Comprehensive security test coverage established
- Security code review process formalized

### Sprint 1 Tickets

---

#### ALSH-001: Fix X-Frame-Options Header on All Endpoints (P001)

**Type:** Bug Fix (Security - Critical)
**Story Points:** 3
**Priority:** CRITICAL
**Assigned To:** Full-Stack Engineer (DevOps liaison)
**Sprint:** Sprint 1, Day 1-2
**Dependencies:** None
**Time Estimate:** 6 hours

**Description:**
The application currently has X-Frame-Options set to ALLOWALL on most endpoints, allowing potential clickjacking attacks. This header must be hardened to prevent unauthorized embedding of the application in malicious iframes. The fix includes validating all response headers, testing across all page types, and establishing a security header baseline for future development.

**Acceptance Criteria:**
- X-Frame-Options set to DENY on all endpoints by default
- Exceptions whitelisted for legitimate third-party integrations (document with business reason)
- GET requests on public pages allow SAMEORIGIN (if applicable per business requirements)
- Security header audit completed for all 408 files
- Automated test suite validates headers on every response (10+ test cases)
- All CI/CD pipelines enforce header validation
- Code review checklist includes header validation for future PRs

**Technical Approach:**
1. Implement global Next.js middleware for response header injection
2. Create `lib/security/headers.ts` utility function:
   - Default: `X-Frame-Options: DENY`
   - Configuration object for endpoint exceptions
   - Environment-based overrides for dev/staging/prod
3. Audit all routes in `pages/` and `app/` directories
4. Add response headers verification to test suite
5. Create `.headers` configuration file for Vercel deployment validation
6. Document whitelisting process in SECURITY.md

**Files to Modify:**
- `next.config.js` - Add headers configuration
- `middleware.ts` - Add response header injection
- `lib/security/headers.ts` - Create (NEW)
- `__tests__/security/headers.test.ts` - Create (NEW)
- `SECURITY.md` - Update with header policy

**Code Review Requirements:**
- Security engineer approval required
- Verify no exceptions for user input endpoints
- Cross-reference with OWASP guidelines

---

#### ALSH-002: Implement Secrets Management Solution

**Type:** Infrastructure (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** DevOps Engineer
**Sprint:** Sprint 1, Day 1-3
**Dependencies:** ALSH-001 (parallel, non-blocking)
**Time Estimate:** 10 hours

**Description:**
Current application stores sensitive secrets (admin codes, passwords, tokens) in plaintext in configuration files and environment variables without proper encryption. Implement a secure secrets management solution using industry-standard practices. This ticket covers infrastructure setup, migration of existing secrets, and validation that no new plaintext secrets are introduced.

**Acceptance Criteria:**
- Secrets management solution selected and provisioned (AWS Secrets Manager, HashiCorp Vault, or Doppler)
- All existing plaintext secrets identified and migrated to secure vault
- Development, staging, and production environments configured with separate secret access policies
- Application code updated to retrieve secrets from vault (not direct env vars for sensitive data)
- Audit logging enabled for all secret access attempts
- Documentation created for adding new secrets to vault
- Automated scan in CI/CD prevents plaintext secret commits
- Zero plaintext secrets remaining in Git history or configuration files

**Technical Approach:**
1. Evaluate and select secrets management platform (recommend AWS Secrets Manager for AWS deployments)
2. Create service account with minimal IAM permissions for application access
3. Implement `lib/secrets/client.ts`:
   - Initialize secrets client with appropriate authentication
   - Cache secrets in memory (with TTL for rotation)
   - Log all secret access with timestamp and requester
   - Error handling for failed secret retrieval
4. Create migration script for existing secrets:
   - Export from current config locations
   - Validate each secret value before vault storage
   - Create audit record for each migrated secret
5. Update `.env.example` to remove sensitive values
6. Implement `pre-commit` hook using `detect-secrets` package
7. Run security scan on entire Git history with `truffleHog`

**Files to Modify:**
- `lib/secrets/client.ts` - Create (NEW)
- `middleware.ts` - Add secret initialization
- `.env.example` - Remove sensitive values
- `.env.local` (local dev) - Store vault credentials
- `.gitignore` - Add secrets directories
- `scripts/migrate-secrets.ts` - Create (NEW)
- `DEPLOYMENT.md` - Update with secrets setup instructions

**Infrastructure Changes:**
- AWS Secrets Manager or equivalent service provisioned
- IAM roles configured for application and CI/CD
- Backup and rotation policies established

---

#### ALSH-003: Remove Hardcoded Passwords from Codebase

**Type:** Bug Fix (Security - Critical)
**Story Points:** 3
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 1
**Sprint:** Sprint 1, Day 2-3
**Dependencies:** ALSH-002 (must complete first)
**Time Estimate:** 6 hours

**Description:**
Code audit revealed hardcoded password values embedded in application source code, primarily in authentication modules and database initialization scripts. These passwords must be extracted and moved to secure secrets management. All hardcoded instances must be removed from Git history using git-filter-repo to prevent unauthorized access.

**Acceptance Criteria:**
- All hardcoded passwords identified across all 408 files
- Each hardcoded password extracted to secrets vault (ALSH-002)
- Application code refactored to use ALSH-002 secrets client
- Git history cleaned using git-filter-repo to remove all password traces
- Force push to repository with cleaned history (approved by tech lead)
- Automated scan added to CI/CD to prevent future hardcoded secrets
- QA verification that application functions identically post-refactor
- Security audit checklist confirms no hardcoded credentials remain

**Technical Approach:**
1. Scan entire codebase using `grep` patterns:
   - Search for common patterns: `password=`, `pwd=`, `pass=`
   - Manual review of authentication files
   - Check database initialization and migration files
2. Document each hardcoded password location:
   - File path
   - Variable name
   - Context (dev, test, prod)
   - Where it's used in code
3. Extract passwords to secrets vault:
   - Assign logical secret names
   - Create mapping document for team reference
4. Refactor code to retrieve from secrets:
   - Replace hardcoded string with `await secretsClient.get('secret-name')`
   - Add error handling for missing secrets
5. Clean Git history:
   - Identify commits containing passwords
   - Use `git-filter-repo --path-glob=<patterns> --invert-paths`
   - Test on clean clone before force push
6. Update team documentation with new credential handling process

**Files Affected (Examples):**
- `src/auth/credentials.ts` - Remove hardcoded values
- `src/database/config.ts` - Remove hardcoded values
- `scripts/seed.ts` - Remove hardcoded values
- `__tests__/fixtures/test-credentials.ts` - Use secret placeholders
- `.github/workflows/*.yml` - Reference secrets instead of hardcoded values

---

#### ALSH-004: Fix Admin Codes Plaintext Storage

**Type:** Bug Fix (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 1
**Sprint:** Sprint 1, Day 3-4
**Dependencies:** ALSH-002, ALSH-003 (secrets management ready)
**Time Estimate:** 10 hours

**Description:**
Admin codes are currently stored in plaintext in the database and configuration files, allowing any database-level access to compromise admin functionality. Implement proper hashing and salt-based storage for admin codes. This ticket includes database schema updates, code refactoring, and migration of existing codes.

**Acceptance Criteria:**
- Admin codes hashed using bcrypt (min 12 rounds) before storage
- Each admin code has unique salt generated at creation time
- Database schema updated: admin_codes table redesigned to include hash and salt columns
- Backward compatibility maintained: old plaintext codes migrated during deployment
- Admin code validation refactored to use hash comparison
- All admin operations log the action (not the code) for audit trail
- Test suite includes 15+ test cases for admin code validation and edge cases
- Zero plaintext admin codes remaining in database or backups
- Documentation updated with admin code security practices

**Technical Approach:**
1. Design database migration:
   - Add `code_hash` (VARCHAR(60)) and `code_salt` (VARCHAR(16)) columns
   - Create `code_plaintext_DEPRECATED` column (temp storage during migration)
   - Run migration script to hash all existing codes
   - Drop `code_plaintext_DEPRECATED` column after validation
2. Create admin code hashing module `lib/security/admin-codes.ts`:
   ```typescript
   - async hashAdminCode(code: string): Promise<{hash: string; salt: string}>
   - async validateAdminCode(input: string, storedHash: string): Promise<boolean>
   - generateRandomCode(length: number): string
   ```
3. Update authentication service:
   - Modify admin code validation to use hash comparison
   - Add rate limiting to admin code verification (max 5 attempts/min)
   - Log failed attempts with timestamp (not the submitted code)
4. Create database migration script:
   - Export existing plaintext codes
   - Hash each code with unique salt
   - Create audit record for each migrated code
   - Verify no codes lost in transition
5. Add test cases:
   - Hash generation produces consistent results with same salt
   - Hash comparison fails with incorrect code
   - Timing attack resistance (constant-time comparison)
   - Rate limiting blocks repeated failed attempts
   - Log entries don't contain actual codes or hashes

**Database Schema Changes:**
```sql
ALTER TABLE admin_codes ADD COLUMN code_hash VARCHAR(60);
ALTER TABLE admin_codes ADD COLUMN code_salt VARCHAR(16);
ALTER TABLE admin_codes ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE admin_codes ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX idx_admin_codes_created ON admin_codes(created_at);
```

**Files to Modify:**
- `lib/security/admin-codes.ts` - Create (NEW)
- `src/auth/admin-verification.ts` - Refactor to use hash comparison
- `prisma/schema.prisma` - Update AdminCode model
- `prisma/migrations/[timestamp]_add_admin_code_hashing/migration.sql` - Create (NEW)
- `scripts/migrate-admin-codes.ts` - Create (NEW)
- `__tests__/auth/admin-codes.test.ts` - Create (NEW)

---

#### ALSH-005: Fix Password Synced to Deploy Process

**Type:** Bug Fix (Security - Critical)
**Story Points:** 3
**Priority:** CRITICAL
**Assigned To:** DevOps Engineer
**Sprint:** Sprint 1, Day 2-3
**Dependencies:** ALSH-002 (secrets management)
**Time Estimate:** 6 hours

**Description:**
Current deployment process includes hardcoded passwords in deployment scripts that are synced to production environments, stored in plaintext in CI/CD logs. This creates multiple exposure vectors. Implement secure credential passing during deployment using environment secrets and remove all passwords from deployment code.

**Acceptance Criteria:**
- All hardcoded passwords removed from deployment scripts
- Deployment process uses CI/CD environment secrets (GitHub/GitLab secrets)
- Secrets passed to application via secure methods (env vars encrypted, secrets manager)
- CI/CD logs sanitized to redact credential values (using GitHub Actions masking)
- Deployment script audit performed on all workflows
- Backup processes updated to use encrypted credentials
- Documentation created for secure credential rotation during deployment
- QA verification that deployment succeeds without plaintext credentials
- Automated checks prevent password strings in PR diffs

**Technical Approach:**
1. Audit all CI/CD workflows:
   - `.github/workflows/*.yml` for GitHub Actions
   - CI/CD pipeline files for other systems
   - Search for password patterns in all scripts
2. Refactor deployment scripts:
   - Remove hardcoded credentials
   - Use GitHub Actions secrets for GitHub, equivalent for other systems
   - Add input masking to hide secret values in logs
3. Implement secure credential passing:
   - Database credentials via `--env-file` with strict permissions
   - API keys via environment variables marked as secrets
   - SSH keys via secret management system
4. Update CI/CD workflow files:
   - Use `secrets` context in workflow steps
   - Add `# yamllint disable-line rule:comments-indentation` for secret-related comments
   - Implement log filtering with `::add-mask::` syntax
5. Create credential rotation script for automated updates
6. Document process for team:
   - Adding new secrets to CI/CD
   - Rotating secrets safely
   - Auditing secret access

**Files to Modify:**
- `.github/workflows/deploy.yml` - Refactor credential handling
- `.github/workflows/build.yml` - Remove password references
- `scripts/deploy.sh` - Refactor to use environment secrets
- `scripts/backup.sh` - Refactor to use encrypted credentials
- `DEPLOYMENT.md` - Update with secure credential procedures
- `.github/workflows/lint-secrets.yml` - Create (NEW) for secret detection

---

#### ALSH-006: Session Tokens Hash Implementation

**Type:** Bug Fix (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 2
**Sprint:** Sprint 1, Day 4-5
**Dependencies:** ALSH-002 (secrets management)
**Time Estimate:** 10 hours

**Description:**
Session tokens are currently stored in plaintext in the database, allowing database compromise to leak user sessions. Implement secure token hashing similar to password storage. Tokens are hashed before storage, and token validation uses constant-time comparison. This ticket includes database migration, token generation refactoring, and validation updates.

**Acceptance Criteria:**
- Session tokens hashed using bcrypt before database storage
- Token generation creates cryptographically strong tokens (minimum 32 bytes)
- Token validation uses constant-time comparison (timing attack resistant)
- Database schema updated with token hash and salt columns
- Token TTL (time-to-live) implemented with automatic expiration
- Refresh token mechanism implemented for long-lived sessions
- All existing plaintext tokens invalidated during deployment
- Audit logging for token generation and validation
- Test suite includes 20+ test cases for token security
- Zero plaintext tokens remaining in database
- Concurrent session management implemented (limit active tokens per user)

**Technical Approach:**
1. Design token generation and hashing:
   - Use Node.js `crypto.randomBytes(32)` for token generation
   - Token stored as Buffer in database (more compact than hex string)
   - Hash token with bcrypt before storage
   - Return original token to client (never again accessible)
2. Update database schema:
   - Sessions table: add `token_hash` (VARCHAR(60)), `token_salt` (VARCHAR(16))
   - Add `expires_at` (TIMESTAMP) for automatic cleanup
   - Add `refresh_token_hash` and `refresh_token_expires_at`
   - Add `last_activity_at` (TIMESTAMP) for session timeout tracking
3. Create token module `lib/security/tokens.ts`:
   ```typescript
   - generateSessionToken(): {token: string; expiresAt: Date}
   - hashToken(token: string): {hash: string; salt: string}
   - validateSessionToken(token: string, storedHash: string): Promise<boolean>
   - createRefreshToken(userId: string): Promise<{token: string; expiresAt: Date}>
   - revokeToken(token: string): Promise<void>
   ```
4. Update session management:
   - Create new sessions with hashed tokens
   - Validate incoming tokens using hash comparison
   - Implement token refresh flow
   - Add background job to clean expired tokens
5. Add security tests:
   - Token format validation (32+ bytes)
   - Hash consistency (same token produces same hash)
   - Timing attack resistance (constant-time comparison)
   - Token expiration enforcement
   - Concurrent session limits per user
   - Refresh token rotation security

**Database Schema Changes:**
```sql
ALTER TABLE sessions ADD COLUMN token_hash VARCHAR(60);
ALTER TABLE sessions ADD COLUMN token_salt VARCHAR(16);
ALTER TABLE sessions ADD COLUMN refresh_token_hash VARCHAR(60);
ALTER TABLE sessions ADD COLUMN refresh_token_salt VARCHAR(16);
ALTER TABLE sessions ADD COLUMN expires_at TIMESTAMP NOT NULL;
ALTER TABLE sessions ADD COLUMN refresh_expires_at TIMESTAMP;
ALTER TABLE sessions ADD COLUMN last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE sessions ADD COLUMN is_revoked BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_user_active ON sessions(user_id, is_revoked, expires_at);
```

**Files to Modify:**
- `lib/security/tokens.ts` - Create (NEW)
- `src/auth/session-manager.ts` - Refactor token handling
- `prisma/schema.prisma` - Update Session model
- `prisma/migrations/[timestamp]_add_session_token_hashing/migration.sql` - Create (NEW)
- `scripts/migrate-sessions.ts` - Create (NEW)
- `middleware.ts` - Update session validation
- `__tests__/auth/tokens.test.ts` - Create (NEW)
- `__tests__/integration/session-security.test.ts` - Create (NEW)

---

#### ALSH-007: TOTP Backup Codes Secure Storage

**Type:** Bug Fix (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 2
**Sprint:** Sprint 1, Day 5-6
**Dependencies:** ALSH-002, ALSH-006 (token hashing pattern)
**Time Estimate:** 10 hours

**Description:**
TOTP (Time-based One-Time Password) backup codes are stored in plaintext, allowing account takeover if database is compromised. Implement hashing and salt-based storage for backup codes. Backup codes are single-use, and attempted reuse is logged and prevented. This ticket includes backup code generation, storage, validation, and user rotation flows.

**Acceptance Criteria:**
- TOTP backup codes hashed and salted before database storage
- Backup codes generated as 8 alphanumeric characters, in groups of 4 (format: XXXX-XXXX)
- Each backup code can only be used once (marked as used_at timestamp)
- Failed backup code attempts logged and trigger rate limiting
- User can regenerate backup codes (invalidating previous set)
- Backup codes display only once at generation time (never shown again)
- Audit log tracks all backup code usage and regeneration
- 16+ test cases for backup code security and edge cases
- Zero plaintext backup codes in database
- Database cleanup removes old unused codes after 90 days

**Technical Approach:**
1. Design backup code generation:
   - Generate 10 codes per user (industry standard)
   - Each code: 8 alphanumeric characters in XXXX-XXXX format
   - Hash each code with bcrypt before storage
   - Return only at creation, never again
2. Update database schema:
   - Create `totp_backup_codes` table:
     - `id` (PRIMARY KEY)
     - `user_id` (FOREIGN KEY)
     - `code_hash` (VARCHAR(60))
     - `code_salt` (VARCHAR(16))
     - `used_at` (TIMESTAMP, nullable)
     - `created_at` (TIMESTAMP)
     - `expires_at` (TIMESTAMP - 90 days)
   - Add index on `user_id` and `expires_at`
3. Create backup code module `lib/security/totp-backup-codes.ts`:
   ```typescript
   - generateBackupCodes(): string[] (10 codes)
   - hashBackupCode(code: string): {hash: string; salt: string}
   - validateAndUseBackupCode(userId: string, code: string): Promise<boolean>
   - regenerateBackupCodes(userId: string): Promise<string[]>
   - getUnusedBackupCodeCount(userId: string): Promise<number>
   ```
4. Update TOTP service:
   - Reference backup codes during TOTP validation
   - Fallback to backup code if TOTP fails
   - Mark code as used after successful validation
   - Log usage with user ID and timestamp
5. Implement regeneration flow:
   - Endpoint to regenerate codes (requires TOTP verification)
   - Old codes invalidated
   - New codes generated and returned
   - Audit log entry created
6. Add security tests:
   - Backup code format validation
   - Single-use enforcement
   - Hash consistency
   - Timing attack resistance
   - Rate limiting on failed attempts
   - Expiration enforcement

**Database Schema Changes:**
```sql
CREATE TABLE totp_backup_codes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  code_hash VARCHAR(60) NOT NULL,
  code_salt VARCHAR(16) NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX idx_totp_backup_user ON totp_backup_codes(user_id);
CREATE INDEX idx_totp_backup_expires ON totp_backup_codes(expires_at);
```

**Files to Modify:**
- `lib/security/totp-backup-codes.ts` - Create (NEW)
- `src/auth/totp-service.ts` - Refactor to use hashed codes
- `prisma/schema.prisma` - Add TOTPBackupCode model
- `prisma/migrations/[timestamp]_add_totp_backup_codes/migration.sql` - Create (NEW)
- `scripts/migrate-backup-codes.ts` - Create (NEW)
- `src/pages/api/auth/totp/setup.ts` - Update to return codes once
- `src/pages/api/auth/totp/regenerate.ts` - Create (NEW)
- `__tests__/auth/totp-backup-codes.test.ts` - Create (NEW)

---

#### ALSH-008: TOTP Secret Secure Storage

**Type:** Bug Fix (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 3
**Sprint:** Sprint 1, Day 4-5
**Dependencies:** ALSH-002 (secrets management)
**Time Estimate:** 10 hours

**Description:**
TOTP secrets are stored in plaintext, allowing anyone with database access to forge time-based codes and bypass 2FA. Implement encryption at rest for TOTP secrets using AES-256-GCM. Secrets are encrypted using a master key stored in secure vault, with per-secret IVs for security. This ticket includes encryption implementation, database migration, and decryption during TOTP validation.

**Acceptance Criteria:**
- TOTP secrets encrypted at rest using AES-256-GCM
- Each secret has unique initialization vector (IV) stored with ciphertext
- Master encryption key stored in secrets vault (ALSH-002), never in code
- Secrets decrypted only during TOTP validation, never logged or exposed
- Key rotation mechanism implemented for emergency re-encryption
- Database schema updated to store ciphertext and IV
- Audit logging tracks all encryption/decryption operations (not the secret itself)
- 15+ test cases for encryption security and edge cases
- Zero plaintext TOTP secrets in database or logs
- Database backups include encrypted secrets (not decrypted)

**Technical Approach:**
1. Design encryption architecture:
   - Master key: 32-byte key stored in AWS Secrets Manager (ALSH-002)
   - Per-secret IV: 16-byte random IV generated for each encryption
   - Algorithm: AES-256-GCM (authenticated encryption)
   - Ciphertext format: IV (hex, 32 chars) + Ciphertext (hex, variable length)
2. Create encryption module `lib/security/encryption.ts`:
   ```typescript
   - encryptTOTPSecret(secret: string): Promise<{ciphertext: string; iv: string}>
   - decryptTOTPSecret(ciphertext: string, iv: string): Promise<string>
   - rotateEncryptionKey(oldKey: string, newKey: string): Promise<void>
   ```
3. Update database schema:
   - Rename `totp_secret` to `totp_secret_encrypted`
   - Add `totp_secret_iv` (VARCHAR(32)) for IV storage
   - Add `totp_key_version` (INT) for key rotation tracking
4. Update TOTP flow:
   - On setup: Generate secret, encrypt, store ciphertext + IV
   - On validation: Decrypt secret, validate code, log operation (no secret in log)
   - Never return full secret to client (return only QR code and backup codes)
5. Implement key rotation:
   - Scheduled task to re-encrypt all secrets with new key
   - Separate old and new keys during transition period
   - Audit log entry for each key rotation
   - Verify re-encryption completion before key destruction
6. Add security tests:
   - Encryption deterministic (same plaintext, different IVs = different ciphertexts)
   - Decryption reverses encryption
   - Tampering detection (GCM authentication failure)
   - IV uniqueness verification
   - Key rotation completeness
   - Performance under load (decryption shouldn't slow TOTP validation)

**Database Schema Changes:**
```sql
ALTER TABLE users ADD COLUMN totp_secret_encrypted TEXT;
ALTER TABLE users ADD COLUMN totp_secret_iv VARCHAR(32);
ALTER TABLE users ADD COLUMN totp_key_version INT DEFAULT 1;
-- Migrate existing plaintext secrets:
-- UPDATE users SET totp_secret_encrypted = encrypt(totp_secret) WHERE totp_secret IS NOT NULL;
-- ALTER TABLE users DROP COLUMN totp_secret;
```

**Files to Modify:**
- `lib/security/encryption.ts` - Create (NEW)
- `src/auth/totp-service.ts` - Refactor to use encrypted secrets
- `prisma/schema.prisma` - Update User model (totp_secret_encrypted, totp_secret_iv)
- `prisma/migrations/[timestamp]_encrypt_totp_secrets/migration.sql` - Create (NEW)
- `scripts/encrypt-totp-secrets.ts` - Create (NEW)
- `scripts/rotate-encryption-key.ts` - Create (NEW)
- `src/pages/api/auth/totp/setup.ts` - Encrypt on storage
- `__tests__/security/encryption.test.ts` - Create (NEW)
- `__tests__/auth/totp-encryption.test.ts` - Create (NEW)

---

#### ALSH-009: Fix Member ID Race Condition

**Type:** Bug Fix (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 3
**Sprint:** Sprint 1, Day 6-7
**Dependencies:** None
**Time Estimate:** 10 hours

**Description:**
Member ID generation has a race condition where concurrent requests can generate duplicate IDs, causing data corruption and potential privilege escalation if duplicate IDs are used for access control. Implement atomic ID generation using database sequences or distributed ID generation service. This ticket includes identifying all ID generation locations, atomic refactoring, and comprehensive testing.

**Acceptance Criteria:**
- Member ID generation using database sequences (atomic at DB level)
- All concurrent ID generation requests produce unique IDs
- Load testing confirms no duplicate IDs under 1000+ concurrent requests
- Existing duplicate IDs identified and resolved (data cleanup)
- All member creation endpoints updated to use atomic ID generation
- ID uniqueness constraints enforced at database level
- Audit logging tracks ID generation with timestamp
- 20+ test cases including concurrency and edge cases
- Zero race conditions in ID generation paths
- Documentation updated with safe ID generation patterns

**Technical Approach:**
1. Identify ID generation locations:
   - Search codebase for `memberId`, `id_generation`, `generateId`
   - Audit all member creation endpoints
   - Check for any client-side ID generation
2. Implement atomic ID generation:
   - Option A: PostgreSQL sequences (SERIAL / BIGSERIAL type)
   - Option B: Snowflake-like distributed ID service (if multi-database)
   - Selected approach: Use PostgreSQL BIGSERIAL (simplest, safest)
3. Update schema:
   - Ensure `members.id` is BIGSERIAL PRIMARY KEY
   - Add UNIQUE constraint on any natural ID fields
   - Create migration to fix existing data
4. Refactor ID generation code:
   - Remove any manual ID generation logic
   - Use Prisma's `@default(autoincrement())` pattern
   - Ensure all member creation goes through single entry point
5. Create helper function `lib/ids/generate-member-id.ts`:
   ```typescript
   - async generateMemberId(): Promise<bigint> (delegates to DB sequence)
   - async createMemberWithUniqueId(memberData): Promise<Member>
   ```
6. Identify and resolve duplicate IDs:
   - Query: SELECT id, COUNT(*) FROM members GROUP BY id HAVING COUNT(*) > 1
   - For each duplicate: Reassign secondary IDs, update references
   - Log all changes for audit trail
7. Add concurrency tests:
   - Spawn 1000 concurrent member creation requests
   - Verify all IDs unique
   - Verify no database constraint violations
   - Measure performance impact

**Database Schema Changes:**
```sql
-- Ensure members table uses BIGSERIAL for ID:
ALTER TABLE members ALTER COLUMN id SET DEFAULT nextval('members_id_seq');

-- Fix duplicate IDs (if any exist):
-- Identify duplicates
-- SELECT id FROM members GROUP BY id HAVING COUNT(*) > 1;

-- Add uniqueness constraint:
ALTER TABLE members ADD CONSTRAINT members_id_unique UNIQUE(id);
```

**Files to Modify:**
- `lib/ids/member-id-generator.ts` - Refactor/centralize
- `src/services/member-service.ts` - Use atomic ID generation
- `src/pages/api/members/create.ts` - Use member service
- `prisma/schema.prisma` - Verify autoincrement configuration
- `prisma/migrations/[timestamp]_fix_member_id_race_condition/migration.sql` - Create (NEW)
- `scripts/fix-duplicate-member-ids.ts` - Create (NEW)
- `__tests__/concurrency/member-id-generation.test.ts` - Create (NEW)

---

#### ALSH-010: OAuth State Validation Implementation

**Type:** Bug Fix (Security - Critical)
**Story Points:** 5
**Priority:** CRITICAL
**Assigned To:** Backend Engineer 1
**Sprint:** Sprint 1, Day 6-7
**Dependencies:** ALSH-002 (secrets management for CSRF tokens)
**Time Estimate:** 10 hours

**Description:**
OAuth flow lacks state parameter validation, allowing CSRF attacks where malicious actors can trick users into authorizing the application on attacker-controlled accounts. Implement proper OAuth state generation, storage, and validation. State parameters are cryptographically random, unique per request, and validated before token exchange.

**Acceptance Criteria:**
- OAuth state parameter generated as cryptographically random 32+ byte string
- State stored securely (encrypted in session or signed JWT)
- State validated before exchanging authorization code for token
- Invalid or expired state rejected with clear error message
- State tied to session/user to prevent token fixation
- Separate state values for different OAuth providers (Google, GitHub, etc.)
- Rate limiting on failed state validation attempts
- Audit logging for all OAuth state validations
- 15+ test cases for CSRF protection and edge cases
- Zero unvalidated OAuth flows in codebase

**Technical Approach:**
1. Design state parameter handling:
   - State: 32-byte cryptographically random value (hex encoded)
   - Storage: Encrypted in session cookie (short-lived, 10 minute TTL)
   - Format: JSON containing {state, provider, createdAt, expiresAt}
   - Alternative: Signed JWT for stateless validation
2. Create OAuth state module `lib/security/oauth-state.ts`:
   ```typescript
   - generateOAuthState(): string
   - storeOAuthState(state: string, provider: string, session): Promise<void>
   - validateOAuthState(state: string, provider: string, session): Promise<boolean>
   - cleanupExpiredStates(): Promise<void>
   ```
3. Update OAuth endpoints:
   - `/api/auth/oauth/authorize`: Generate and store state before redirect
   - `/api/auth/oauth/callback`: Validate state before token exchange
   - Add state to OAuth provider request URL
   - Validate state matches provider response
4. Implement state storage:
   - Option A: Session cookie (encrypted, short TTL)
   - Option B: Database table with user_id + state + provider
   - Option C: Signed JWT (stateless, includes state in signature)
   - Selected: Session cookie (simplest, short-lived)
5. Add security tests:
   - State generation produces random values
   - State validation rejects mismatched values
   - State validation rejects expired values
   - State tied to correct user session
   - Multiple providers have independent states
   - Replay attacks prevented (state invalidated after use)
   - Rate limiting on failed validations

**Files to Modify:**
- `lib/security/oauth-state.ts` - Create (NEW)
- `src/pages/api/auth/oauth/authorize.ts` - Add state generation
- `src/pages/api/auth/oauth/callback.ts` - Add state validation
- `src/auth/oauth-service.ts` - Integrate state validation
- `middleware.ts` - Add state validation to OAuth callback handler
- `__tests__/auth/oauth-state.test.ts` - Create (NEW)
- `__tests__/integration/oauth-flow.test.ts` - Create (NEW)

---

#### ALSH-011: Security Code Review Process Formalization

**Type:** Process / Documentation (Security - High)
**Story Points:** 3
**Priority:** HIGH
**Assigned To:** PM (Tech Lead review)
**Sprint:** Sprint 1, Day 1-2
**Dependencies:** None (parallel)
**Time Estimate:** 6 hours

**Description:**
Establish formal security code review process and guidelines to prevent future vulnerabilities. Create security checklist for code reviews, train team on security best practices, and establish approval requirements for sensitive code changes. This ticket includes documentation, checklist creation, and process validation.

**Acceptance Criteria:**
- Security Code Review Checklist created with 30+ items
- Checklist covers: authentication, authorization, secrets, injection, XSS, CSRF, etc.
- All security-critical PRs require dedicated security review approval
- Team training completed (6 engineers) on security checklist
- Security reviewer role assigned (rotate among experienced engineers)
- GitHub/GitLab PR rules configured to require security review
- Process documented in CONTRIBUTING.md and SECURITY.md
- Automated checks integrated (linting, secret scanning, dependency auditing)
- Weekly security syncs scheduled (30 min) to discuss high-risk changes
- Process audit performed on random PRs from previous 2 weeks

**Technical Approach:**
1. Create comprehensive security checklist:
   - Authentication & Authorization (7 items)
   - Secrets & Credentials (8 items)
   - Input Validation & Injection (6 items)
   - Cryptography & Hashing (5 items)
   - Error Handling & Logging (4 items)
   - Dependencies & Libraries (3 items)
   - Infrastructure & Deployment (2 items)
2. Document in SECURITY_REVIEW_CHECKLIST.md with examples for each item
3. Set up GitHub branch protection rules:
   - Require 1 security review approval for files matching `/src/**/*.ts`, `/api/**/*.ts`
   - Dismiss stale reviews on new commits
   - Require review from specific team members (security-trained)
4. Create training materials:
   - OWASP Top 10 summary (1 hour reading)
   - Internal security best practices guide
   - 10 case studies of common vulnerabilities in this codebase
5. Configure automated checks:
   - `npm audit` in CI/CD (fail on critical/high)
   - `truffleHog` or `detect-secrets` for secret scanning
   - TypeScript strict mode enforced
   - Linting rules for security patterns
6. Schedule weekly security sync
   - Review new PRs with security implications
   - Discuss any security concerns
   - Update checklist based on findings

**Files to Create:**
- `SECURITY_REVIEW_CHECKLIST.md` - Comprehensive checklist with examples
- `docs/SECURITY_GUIDELINES.md` - Best practices guide
- `docs/SECURITY_TRAINING.md` - Training materials and resources
- `.github/pull_request_template.md` - Update with security checklist reminder

---

#### ALSH-012: Security Testing Test Suite Creation

**Type:** Testing (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** QA Engineer
**Sprint:** Sprint 1, Day 3-5
**Dependencies:** ALSH-001 through ALSH-010 (security fixes implemented)
**Time Estimate:** 10 hours

**Description:**
Create comprehensive security test suite covering all implemented security fixes in Sprint 1. Tests validate that vulnerabilities are properly fixed and regressions are detected. This includes unit tests for security functions, integration tests for authentication flows, and security-specific edge case testing.

**Acceptance Criteria:**
- Minimum 80% test coverage for all security-related code
- 50+ security-specific test cases across all categories
- Unit tests for: hashing, encryption, token generation, CSRF tokens
- Integration tests for: OAuth flow, session management, TOTP
- Edge case tests: timing attacks, race conditions, concurrent requests
- Load testing validates no security degradation under 1000+ concurrent requests
- Performance benchmarks established for security operations (hashing, encryption)
- All tests pass in CI/CD before deployment
- Test report generated showing coverage metrics
- Documentation created for running and extending security tests

**Technical Approach:**
1. Structure test suite:
   - `__tests__/unit/security/` - Unit tests for security modules
   - `__tests__/integration/auth/` - Authentication flow tests
   - `__tests__/integration/oauth/` - OAuth flow tests
   - `__tests__/concurrency/` - Race condition and concurrent request tests
   - `__tests__/load/` - Load testing with security validation
   - `__tests__/security/edge-cases/` - Timing attacks, injection, etc.

2. Create test categories:

   **Unit Tests (25 tests):**
   - Hash generation and validation (4 tests)
   - Token generation and validation (5 tests)
   - Encryption/decryption (5 tests)
   - CSRF token generation and validation (3 tests)
   - OAuth state generation and validation (3 tests)
   - Admin code hashing (3 tests)
   - TOTP backup codes (2 tests)

   **Integration Tests (15 tests):**
   - Complete OAuth flow (Google, GitHub) (4 tests)
   - Session creation and validation (3 tests)
   - TOTP setup and validation (3 tests)
   - Admin operations with code validation (2 tests)
   - Password reset flow with token validation (2 tests)
   - Logout and token revocation (1 test)

   **Concurrency Tests (8 tests):**
   - 1000 concurrent member creation (unique IDs) (1 test)
   - 100 concurrent session creations (token uniqueness) (1 test)
   - 100 concurrent token refresh (no duplicates) (1 test)
   - Race condition in admin code validation (1 test)
   - Concurrent TOTP backup code usage (single-use enforcement) (1 test)
   - Concurrent session revocation (1 test)
   - Lock contention monitoring (1 test)
   - Deadlock detection (1 test)

   **Edge Case Tests (12 tests):**
   - Timing attack resistance in hash comparison (2 tests)
   - SQL injection in authentication endpoints (2 tests)
   - XSS in error messages (2 tests)
   - CSRF token reuse prevention (2 tests)
   - Token expiration enforcement (1 test)
   - Backup code single-use enforcement (1 test)
   - Invalid state in OAuth callback (1 test)
   - Rate limiting on failed attempts (1 test)

   **Load Testing (2 tests):**
   - 1000 simultaneous TOTP validations (decryption performance) (1 test)
   - 500 concurrent hash comparisons (session validation) (1 test)

3. Implement test infrastructure:
   - Test database setup/teardown fixtures
   - Mock OAuth providers for testing
   - Mock secrets management for local testing
   - Performance benchmarking utilities
4. Add test metrics:
   - Coverage reports with threshold enforcement (≥80%)
   - Performance benchmarks with regression detection
   - Test execution time tracking
   - Flakiness detection for reliability issues
5. Document testing procedures:
   - Running security tests locally
   - Interpreting test results and coverage
   - Adding new security tests
   - Performance baseline and acceptable ranges

**Files to Create:**
- `__tests__/unit/security/hashing.test.ts` - 4 tests
- `__tests__/unit/security/tokens.test.ts` - 5 tests
- `__tests__/unit/security/encryption.test.ts` - 5 tests
- `__tests__/unit/security/csrf.test.ts` - 3 tests
- `__tests__/unit/security/oauth-state.test.ts` - 3 tests
- `__tests__/unit/security/admin-codes.test.ts` - 3 tests
- `__tests__/unit/security/totp-backup.test.ts` - 2 tests
- `__tests__/integration/auth/oauth-flow.test.ts` - 4 tests
- `__tests__/integration/auth/session.test.ts` - 3 tests
- `__tests__/integration/auth/totp.test.ts` - 3 tests
- `__tests__/integration/auth/admin-operations.test.ts` - 2 tests
- `__tests__/integration/auth/password-reset.test.ts` - 2 tests
- `__tests__/integration/auth/logout.test.ts` - 1 test
- `__tests__/concurrency/member-id-generation.test.ts` - 1 test
- `__tests__/concurrency/session-creation.test.ts` - 1 test
- `__tests__/concurrency/token-refresh.test.ts` - 1 test
- `__tests__/concurrency/admin-code-validation.test.ts` - 1 test
- `__tests__/concurrency/totp-backup-usage.test.ts` - 1 test
- `__tests__/concurrency/session-revocation.test.ts` - 1 test
- `__tests__/concurrency/lock-contention.test.ts` - 1 test
- `__tests__/concurrency/deadlock-detection.test.ts` - 1 test
- `__tests__/security/edge-cases/timing-attacks.test.ts` - 2 tests
- `__tests__/security/edge-cases/injection.test.ts` - 2 tests
- `__tests__/security/edge-cases/xss.test.ts` - 2 tests
- `__tests__/security/edge-cases/csrf-reuse.test.ts` - 2 tests
- `__tests__/security/edge-cases/token-expiration.test.ts` - 1 test
- `__tests__/security/edge-cases/backup-code-single-use.test.ts` - 1 test
- `__tests__/security/edge-cases/oauth-state-invalid.test.ts` - 1 test
- `__tests__/security/edge-cases/rate-limiting.test.ts` - 1 test
- `__tests__/load/totp-validation-load.test.ts` - 1 test
- `__tests__/load/session-validation-load.test.ts` - 1 test
- `jest.config.security.js` - Security test configuration

---

#### ALSH-013: Security Documentation and Guidelines

**Type:** Documentation (Security - High)
**Story Points:** 3
**Priority:** HIGH
**Assigned To:** PM
**Sprint:** Sprint 1, Day 7-8
**Dependencies:** ALSH-011 (Code Review Process)
**Time Estimate:** 6 hours

**Description:**
Create comprehensive security documentation covering all fixes, security architecture, and team guidelines. Documentation serves as reference for developers and future maintainers. Includes: security architecture overview, threat model, secure coding guidelines, incident response procedures, and deployment security checklist.

**Acceptance Criteria:**
- SECURITY.md created with overview of all security measures
- Security Architecture document describing design patterns
- Threat Model document with identified threats and mitigations
- Secure Coding Guidelines with 20+ best practices
- Incident Response Procedure for security issues
- Security Deployment Checklist for production deployments
- Secrets Management guide for team members
- OAuth Security guide for integration partners
- All documents reviewed by security-trained engineer
- Documentation linked from README.md
- Documentation includes code examples for each topic

**Technical Approach:**
1. Create `SECURITY.md`:
   - Overview of security posture
   - Summary of P001-P010 fixes
   - Security architecture diagram
   - Contact information for security issues
   - Links to detailed documentation

2. Create `docs/SECURITY_ARCHITECTURE.md`:
   - Authentication flow diagram
   - OAuth integration architecture
   - Secrets management architecture
   - Encryption key management strategy
   - Session management flow
   - Authorization decision flow

3. Create `docs/THREAT_MODEL.md`:
   - STRIDE analysis (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
   - Identified threats for each attack vector
   - Mitigations for each threat
   - Residual risk assessment
   - Trust boundaries diagram

4. Create `docs/SECURE_CODING_GUIDELINES.md`:
   - 20+ guidelines with code examples
   - Common pitfalls and how to avoid them
   - Testing strategies for security
   - Code review focus areas
   - Performance/security tradeoffs

5. Create `docs/INCIDENT_RESPONSE.md`:
   - Incident classification (P0-P3)
   - Reporting procedures
   - Investigation steps
   - Mitigation procedures
   - Post-incident review process
   - Communication templates

6. Create `docs/DEPLOYMENT_SECURITY_CHECKLIST.md`:
   - Pre-deployment checks (15 items)
   - Production deployment steps
   - Post-deployment verification
   - Rollback procedures
   - Security log review checklist

7. Create `docs/SECRETS_MANAGEMENT.md`:
   - Adding new secrets
   - Accessing secrets during development
   - Secret rotation procedures
   - Emergency secret revocation
   - Audit log review

**Files to Create:**
- `SECURITY.md` - Security overview and contact info
- `docs/SECURITY_ARCHITECTURE.md` - Detailed architecture
- `docs/THREAT_MODEL.md` - STRIDE analysis
- `docs/SECURE_CODING_GUIDELINES.md` - 20+ guidelines
- `docs/INCIDENT_RESPONSE.md` - Incident procedures
- `docs/DEPLOYMENT_SECURITY_CHECKLIST.md` - Deployment checklist
- `docs/SECRETS_MANAGEMENT.md` - Secrets handling guide
- `docs/OAUTH_SECURITY.md` - OAuth integration guide
- `docs/security-diagrams.md` - ASCII diagrams of flows

---

#### ALSH-014: Security Metrics and Monitoring Setup

**Type:** Infrastructure (Monitoring - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** DevOps Engineer
**Sprint:** Sprint 1, Day 8-9
**Dependencies:** ALSH-002 (Secrets Management)
**Time Estimate:** 10 hours

**Description:**
Establish security metrics and monitoring to detect anomalies and potential attacks. Implement logging for all security-relevant events (authentication, authorization, token operations, cryptographic operations). Create dashboards and alerts for suspicious activity.

**Acceptance Criteria:**
- All security-relevant events logged (authentication, token ops, encryption, admin operations)
- Log aggregation system configured (CloudWatch, Datadog, or ELK)
- Security dashboards created showing: failed auth attempts, rate limiting triggers, token validations, API errors
- Alerts configured for: unusual failed auth spike, unusual rate limiting, admin operations, encryption errors
- Log retention: 90 days for development, 1 year for production
- Personally Identifiable Information (PII) excluded from logs
- Audit trails immutable and tamper-evident
- Log access controlled and audited
- Performance impact of logging measured and acceptable
- Documentation for log interpretation and troubleshooting

**Technical Approach:**
1. Implement security event logging:
   - Create `lib/logging/security-logger.ts`
   - Log events with: timestamp, user_id, event_type, status, details
   - Never log: passwords, tokens, secrets, backup codes
   - Include: IP address, user agent, request ID for tracing

2. Log security events:
   - Authentication attempts (success/failure)
   - OAuth flows (state validation, code exchange, failures)
   - Token generation and revocation
   - Encryption/decryption operations
   - Hash validation (failures)
   - Admin code validations (failures)
   - Rate limiting triggers
   - Failed attempts (counts by IP/user)
   - Session creation and termination

3. Configure log aggregation:
   - CloudWatch (for AWS deployments) or Datadog
   - Log parsing to extract: event_type, severity, user_id, ip_address
   - Structured logging with JSON format

4. Create security dashboards:
   - Failed authentication attempts (count, by IP, by user)
   - Rate limiting triggers (by endpoint, by IP)
   - Token validation failures (count, trends)
   - Admin operations (user, action, timestamp)
   - Encryption operation performance
   - Error rate by type

5. Configure alerts:
   - Trigger: >5 failed auth in 5 minutes for single user → Email security team
   - Trigger: >20 failed auth in 1 minute for single IP → Block IP, alert team
   - Trigger: Rate limiting threshold exceeded >10 times/hour → Alert team
   - Trigger: Encryption operation errors → Page on-call engineer
   - Trigger: Admin operations →Email admin audit trail
   - Trigger: Session token errors → Alert team
   - Alert throttling: Max 1 alert per 15 minutes per alert type

6. Implement audit trails:
   - Immutable log storage (append-only)
   - Cryptographic verification of log integrity
   - Access control to prevent unauthorized deletion
   - Retention policies enforced by backend

**Files to Create:**
- `lib/logging/security-logger.ts` - Security logging utility
- `lib/logging/audit-trail.ts` - Immutable audit trail
- `monitoring/dashboards.ts` - Dashboard configuration
- `monitoring/alerts.ts` - Alert configuration
- `docs/LOGGING_GUIDE.md` - How to interpret logs
- `.github/workflows/security-monitoring-check.yml` - Log verification job

---

#### ALSH-015: Sprint 1 Security Code Review and Integration Testing

**Type:** Testing & Review (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** QA Engineer, Backend Engineer 1
**Sprint:** Sprint 1, Day 9-10
**Dependencies:** ALSH-001 through ALSH-014 (all fixes completed)
**Time Estimate:** 10 hours

**Description:**
Comprehensive code review and integration testing of all Sprint 1 security fixes to ensure quality before deployment. Review covers: security logic correctness, edge cases, performance impact, and regression potential. Integration testing validates all fixes work together without conflicts.

**Acceptance Criteria:**
- All Sprint 1 code reviewed by security-trained engineer
- Security checklist (ALSH-011) applied to all changes
- No outstanding security reviewer comments
- All integration tests pass (ALSH-012)
- Performance benchmarks within acceptable ranges
- Load testing validates no regressions under production load
- End-to-end scenarios tested: user signup → auth → session → token refresh
- Deployment readiness verified
- Release notes prepared for deployment
- Team sign-off on release (tech lead, PM, security lead)

**Technical Approach:**
1. Conduct comprehensive code review:
   - Schedule review sessions with security-trained engineer
   - Go through each ticket's code changes
   - Verify security checklist items addressed
   - Test fixes locally or in staging
   - Document findings and remediate

2. Run integration test suite:
   - Execute full test suite from ALSH-012
   - Verify all security tests pass
   - Check code coverage remains ≥80%
   - Document any flaky tests

3. Perform load testing:
   - Simulate production load (1000+ concurrent users)
   - Monitor security operation performance
   - Verify no timeouts or errors under load
   - Document baseline metrics

4. Execute end-to-end scenarios:
   - User registration with all security features
   - OAuth login flow
   - TOTP setup and validation
   - Session management (create, refresh, revoke)
   - Password reset with secure tokens
   - Admin code validation
   - Concurrent operations (race conditions)

5. Prepare deployment:
   - Create deployment checklist (from ALSH-013)
   - Document rollback procedures
   - Prepare release notes
   - Schedule deployment window
   - Notify stakeholders

6. Team sign-off:
   - Tech lead sign-off (code quality)
   - QA sign-off (testing complete)
   - Security lead sign-off (security verified)
   - PM sign-off (requirements met)
   - DevOps sign-off (deployment ready)

**Files to Create:**
- `RELEASE_NOTES_SPRINT1.md` - Detailed release notes
- `DEPLOYMENT_CHECKLIST_SPRINT1.md` - Pre-deployment checklist
- `ROLLBACK_PLAN_SPRINT1.md` - Rollback procedures
- `TEST_RESULTS_SPRINT1.md` - Test coverage and results

---

### Sprint 1 Ticket Summary

| ID | Title | Points | Days | Assignee | Status |
|---|---|---|---|---|---|
| ALSH-001 | Fix X-Frame-Options Header | 3 | 1-2 | Full-Stack | Pending |
| ALSH-002 | Implement Secrets Management | 5 | 1-3 | DevOps | Pending |
| ALSH-003 | Remove Hardcoded Passwords | 3 | 2-3 | Backend 1 | Pending |
| ALSH-004 | Fix Admin Codes Plaintext Storage | 5 | 3-4 | Backend 1 | Pending |
| ALSH-005 | Fix Password Synced to Deploy | 3 | 2-3 | DevOps | Pending |
| ALSH-006 | Session Tokens Hash Implementation | 5 | 4-5 | Backend 2 | Pending |
| ALSH-007 | TOTP Backup Codes Secure Storage | 5 | 5-6 | Backend 2 | Pending |
| ALSH-008 | TOTP Secret Secure Storage | 5 | 4-5 | Backend 3 | Pending |
| ALSH-009 | Fix Member ID Race Condition | 5 | 6-7 | Backend 3 | Pending |
| ALSH-010 | OAuth State Validation Implementation | 5 | 6-7 | Backend 1 | Pending |
| ALSH-011 | Security Code Review Process | 3 | 1-2 | PM | Pending |
| ALSH-012 | Security Testing Test Suite | 5 | 3-5 | QA | Pending |
| ALSH-013 | Security Documentation | 3 | 7-8 | PM | Pending |
| ALSH-014 | Security Metrics & Monitoring | 5 | 8-9 | DevOps | Pending |
| ALSH-015 | Sprint 1 Code Review & Testing | 5 | 9-10 | QA/Backend 1 | Pending |

**Sprint 1 Total: 70 Story Points** (target committed capacity: 85 points, reserves 15 points for contingency)

---

## Sprint 2: Encryption & Hardening (Weeks 3-4)

**Sprint Goal:** Implement comprehensive encryption at rest/in transit, harden all input validation, deploy rate limiting and CSRF protection, and establish comprehensive security headers across all endpoints.

**Key Outcomes:**
- Database encryption at rest configured
- TLS/HTTPS enforced across all endpoints
- Input validation hardened across all endpoints (P011-P015 fixes)
- Rate limiting implemented on all APIs (P016-P018 fixes)
- CSRF protection extended to all state-changing operations
- Security headers complete and enforced
- Performance impact of security measures quantified
- Security regression test suite created

### Sprint 2 Tickets

---

#### ALSH-016: Database Encryption at Rest Configuration

**Type:** Infrastructure (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** DevOps Engineer
**Sprint:** Sprint 2, Day 1-3
**Dependencies:** None
**Time Estimate:** 10 hours

**Description:**
Configure encrypted storage for PostgreSQL database to protect data at rest. Implement Transparent Data Encryption (TDE) or equivalent using database-native encryption. Backup files are also encrypted. Key management follows secure practices with separate master keys for different environments.

**Acceptance Criteria:**
- PostgreSQL TDE or equivalent encryption configured
- All data at rest encrypted using AES-256 or stronger
- Master encryption keys stored in secure vault (AWS KMS, Azure Key Vault, etc.)
- Separate master keys for dev/staging/production environments
- Backup files encrypted with same encryption as database
- Key rotation policy established (annual minimum)
- Recovery procedures documented and tested
- Performance impact measured and documented
- Encryption transparent to application code (no changes needed)
- Encryption verified through database status commands

**Technical Approach:**
1. Choose encryption method based on infrastructure:
   - Option A: AWS RDS with AWS KMS encryption (managed, recommended)
   - Option B: PostgreSQL pgcrypto extension (application-level)
   - Option C: Full disk encryption at infrastructure level
   - Selected: AWS RDS with KMS (if AWS) or pgcrypto (if self-hosted)

2. If using AWS RDS KMS:
   - Create KMS keys in AWS KMS (separate for each environment)
   - Enable encryption on RDS cluster
   - Enable backup encryption
   - Enable automated key rotation

3. If using pgcrypto:
   - Enable pgcrypto extension
   - Create master key in secure vault (ALSH-002)
   - Create encryption triggers for sensitive tables
   - Implement key rotation stored procedure

4. Configure backups:
   - Backup encryption enabled
   - Backup stored in encrypted S3/Azure Blob
   - Separate encryption key for backups
   - Backup key rotation scheduled

5. Document recovery procedures:
   - Database recovery with encrypted backups
   - Key recovery procedures
   - Emergency key access procedures
   - Disaster recovery testing plan

6. Measure performance impact:
   - Query performance before/after encryption
   - Encryption/decryption overhead
   - Backup/restore performance
   - Document acceptable performance ranges

**Files to Create:**
- `infrastructure/database-encryption.tf` - Terraform for KMS encryption
- `scripts/enable-database-encryption.sh` - Enable encryption script
- `docs/DATABASE_ENCRYPTION.md` - Encryption documentation
- `docs/KEY_ROTATION_PROCEDURES.md` - Key rotation procedures
- `docs/DISASTER_RECOVERY.md` - Disaster recovery procedures

---

#### ALSH-017: TLS/HTTPS Enforcement Across All Endpoints

**Type:** Infrastructure (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Full-Stack Engineer, DevOps
**Sprint:** Sprint 2, Day 1-3
**Dependencies:** ALSH-001 (Security Headers)
**Time Estimate:** 10 hours

**Description:**
Ensure all traffic is encrypted in transit using TLS 1.2+ (TLS 1.3 preferred). HTTP requests are redirected to HTTPS. SSL/TLS certificates are properly configured with valid domain coverage. Security headers enforce HTTPS-only access.

**Acceptance Criteria:**
- All endpoints enforce HTTPS (no HTTP access)
- HTTP requests redirected to HTTPS with 301 status
- TLS version 1.2 minimum, TLS 1.3 preferred
- Strong cipher suites configured (no deprecated algorithms)
- SSL/TLS certificates valid and cover all domains
- Certificate expiration monitoring set up (alerts 30 days before)
- HSTS (HTTP Strict Transport Security) header configured
- HSTS preload list submission completed
- Mixed content scan performed (no insecure resources)
- Performance impact of TLS negotiation measured
- SSL Labs rating: A or A+ (minimum)

**Technical Approach:**
1. Configure TLS at load balancer or reverse proxy:
   - Update nginx/Apache/CloudFront configuration
   - Set minimum TLS version to 1.2
   - Configure strong cipher suites (from Mozilla recommended)
   - Disable deprecated protocols (SSL 2.0, 3.0, TLS 1.0, 1.1)

2. HTTP to HTTPS redirection:
   - Implement at reverse proxy level (before application)
   - Return 301 (permanent) for SEO
   - Ensure all URLs rewrite correctly

3. SSL/TLS certificate management:
   - Procure certificates for all domains/subdomains
   - Consider wildcard certificates for *.domain.com
   - Use Let's Encrypt (free, automated renewal) if possible
   - Or commercial CA (DigiCert, GlobalSign) for enterprise requirements
   - Certificate pinning considered (optional, adds complexity)

4. Configure HSTS:
   - Add header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
   - Start with 1 day max-age, gradually increase to 1 year
   - Add domain to HSTS preload list (hstspreload.org)

5. Verify HTTPS-only:
   - Scan for mixed content (insecure HTTP resources)
   - Test all endpoints for HTTPS enforcement
   - Verify certificate chain validity
   - Test certificate revocation (OCSP stapling)

6. Monitor certificate expiration:
   - Automated renewal for Let's Encrypt certificates
   - Calendar reminder for commercial certificates
   - Monitoring alert 30 days before expiration
   - Test renewal process before expiration

7. Performance optimization:
   - HTTP/2 enabled on load balancer
   - TLS session resumption enabled
   - OCSP stapling enabled (reduce client verification time)
   - Measure and document TLS handshake times

**Files to Modify:**
- `nginx.conf` / `apache.conf` - Configure TLS settings
- `next.config.js` - Add HSTS headers
- `middleware.ts` - Add HTTP to HTTPS redirect
- `.github/workflows/certificate-check.yml` - Create certificate validation job
- `monitoring/certificate-expiration.ts` - Certificate expiration monitoring

---

#### ALSH-018: Input Validation Hardening - Authentication Endpoints (P011)

**Type:** Bug Fix (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Backend Engineer 1
**Sprint:** Sprint 2, Day 2-4
**Dependencies:** None
**Time Estimate:** 10 hours

**Description:**
Harden input validation on all authentication endpoints. Implement strict validation for email addresses, passwords, usernames, and TOTP codes. Validation occurs at both client and server-side. Invalid inputs are rejected with generic error messages to prevent information leakage.

**Acceptance Criteria:**
- Email validation: RFC 5321 compliant, max 254 characters
- Password validation: min 12 chars, complexity requirements enforced
- Username validation: alphanumeric + underscore, 3-30 chars, uniqueness checked
- TOTP code validation: 6 digits, time-window based acceptance
- Error messages generic (no field-specific hints that reveal valid formats)
- Rate limiting on invalid attempts (max 5 per minute per email)
- SQL injection prevention verified (parameterized queries)
- XSS prevention verified (output encoding)
- Server-side validation enforced (client-side for UX only)
- 20+ test cases for validation edge cases

**Technical Approach:**
1. Create validation module `lib/validation/auth-validation.ts`:
   ```typescript
   - validateEmail(email: string): {valid: boolean; error?: string}
   - validatePassword(password: string): {valid: boolean; strength: number; requirements: string[]}
   - validateUsername(username: string): {valid: boolean; error?: string}
   - validateTOTPCode(code: string): {valid: boolean; withinWindow: boolean}
   - validatePhoneNumber(phone: string): {valid: boolean; format: string}
   ```

2. Update authentication endpoints:
   - `/api/auth/signup` - Validate email, password, username
   - `/api/auth/login` - Validate email, password
   - `/api/auth/totp/verify` - Validate TOTP code
   - `/api/auth/password-reset` - Validate email, new password
   - Add server-side validation before database operations

3. Implement error handling:
   - Return generic error: "Invalid credentials" for login failures
   - Return field-specific errors only for signup (helping user correct input)
   - Log detailed errors server-side for debugging
   - No stack traces in production error responses

4. Add rate limiting:
   - 5 failed attempts per email per 15 minutes → temporary block
   - 10 failed attempts per IP per hour → block IP briefly
   - Exponential backoff: 1s, 2s, 4s, 8s, 16s delays between attempts

5. Validate with regex and libraries:
   - Email: `npm install email-validator` or RFC 5321 regex
   - Password: Custom validation for complexity rules
   - Username: `/^[a-zA-Z0-9_]{3,30}$/`
   - TOTP: `/^[0-9]{6}$/` and time-window check

6. Add validation tests:
   - Valid inputs pass validation
   - Invalid inputs fail with appropriate error
   - Edge cases: empty strings, extremely long inputs, special characters
   - SQL injection attempts rejected
   - XSS injection attempts rejected
   - Rate limiting enforced

**Files to Modify:**
- `lib/validation/auth-validation.ts` - Create (NEW)
- `src/pages/api/auth/signup.ts` - Add validation
- `src/pages/api/auth/login.ts` - Add validation
- `src/pages/api/auth/totp/verify.ts` - Add validation
- `src/pages/api/auth/password-reset.ts` - Add validation
- `__tests__/validation/auth-validation.test.ts` - Create (NEW)

---

#### ALSH-019: Input Validation Hardening - API Endpoints (P012)

**Type:** Bug Fix (Security - High)
**Story Points:** 8
**Priority:** HIGH
**Assigned To:** Backend Engineer 2, Backend Engineer 3
**Sprint:** Sprint 2, Day 2-6
**Dependencies:** ALSH-018 (validation patterns)
**Time Estimate:** 16 hours

**Description:**
Extend hardened input validation to all API endpoints across family tree operations (members, relationships, events, documents). Implement schema validation for all request payloads. Validation prevents injection attacks, ensures data consistency, and provides helpful error messages for clients.

**Acceptance Criteria:**
- Schema validation on all API endpoints (POST, PUT, PATCH)
- Type validation: strings, numbers, dates, booleans, arrays
- Range validation: numeric bounds, string length limits
- Format validation: email, URL, phone, date formats
- Uniqueness validation: duplicate checking before database
- Relationship validation: foreign key references exist
- Permission validation: user can only modify own data
- Error messages helpful but don't leak sensitive information
- Invalid requests return 400 (Bad Request) with error details
- Malformed JSON returns 400 with schema validation error
- 30+ test cases covering all endpoint validations

**Technical Approach:**
1. Select validation library:
   - Zod (TypeScript-first schema validation, recommended)
   - Joi (popular, mature, comprehensive)
   - Yup (lightweight, good for simple validations)
   - Selected: Zod for type safety

2. Create validation schemas for all resources:
   ```typescript
   // lib/validation/schemas.ts
   - CreateMemberSchema
   - UpdateMemberSchema
   - CreateRelationshipSchema
   - CreateEventSchema
   - CreateDocumentSchema
   - etc.
   ```

3. Create validation middleware:
   ```typescript
   // middleware/validate-request.ts
   - validateBody(schema): Middleware
   - validateQuery(schema): Middleware
   - validateParams(schema): Middleware
   ```

4. Apply validation to all endpoints:
   - `/api/members` (POST, GET, PUT, DELETE)
   - `/api/relationships` (POST, GET, PUT, DELETE)
   - `/api/events` (POST, GET, PUT, DELETE)
   - `/api/documents` (POST, GET, PUT, DELETE)
   - All update endpoints validate required vs optional fields
   - All endpoints validate data types and ranges

5. Implement custom validators:
   - Phone number format
   - Date format (ISO 8601)
   - URL format
   - File upload validation (size, type)
   - Image dimensions (if applicable)
   - Enum validation (status, role, etc.)

6. Add comprehensive error handling:
   - Return 400 with field-specific error messages
   - Include validation error details: field, value, issue
   - Server-side logging of validation failures for debugging
   - No stack traces in error responses

7. Add validation tests:
   - Valid payloads accepted
   - Invalid payloads rejected with proper error code
   - Missing required fields rejected
   - Type mismatches rejected
   - Range violations rejected
   - SQL injection attempts in text fields rejected
   - Empty arrays/objects handled correctly

**Files to Create/Modify:**
- `lib/validation/schemas.ts` - All validation schemas
- `middleware/validate-request.ts` - Validation middleware
- `src/pages/api/members/*.ts` - Add validation to all endpoints
- `src/pages/api/relationships/*.ts` - Add validation
- `src/pages/api/events/*.ts` - Add validation
- `src/pages/api/documents/*.ts` - Add validation
- `__tests__/validation/api-validation.test.ts` - 30+ tests

---

#### ALSH-020: Input Validation Hardening - Database Layer (P013)

**Type:** Bug Fix (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Backend Engineer 3
**Sprint:** Sprint 2, Day 4-6
**Dependencies:** ALSH-019 (API validation complete)
**Time Estimate:** 10 hours

**Description:**
Add validation at database level (Prisma schema and database constraints) to ensure data integrity even if API validation is bypassed. Database constraints prevent invalid data from being persisted. This includes: type constraints, length constraints, uniqueness constraints, foreign key constraints, and check constraints.

**Acceptance Criteria:**
- All columns have proper type definitions (TEXT vs VARCHAR with length)
- String columns have max length constraints
- Numeric columns have min/max constraints
- Dates have format validation (ISO 8601)
- Foreign keys enforce referential integrity
- Unique constraints prevent duplicates where needed
- Check constraints validate enum values
- Not null constraints on required fields
- Default values provided for optional fields
- Constraints documented in schema comments
- Migration scripts tested for backward compatibility
- Zero data lost during migration
- Database validation errors clear and helpful

**Technical Approach:**
1. Review all Prisma models in `prisma/schema.prisma`:
   - Identify missing constraints
   - Identify incorrect field types
   - Document changes needed

2. Update Prisma schema:
   ```prisma
   model Member {
     id          BigInt   @id @default(autoincrement())
     name        String   @db.VarChar(255)  // max length
     email       String   @db.VarChar(254)  @unique
     birthDate   DateTime?
     status      String   @db.Enum("active", "inactive", "deceased")
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt

     @@index([email])
     @@index([status])
   }
   ```

3. Create database migrations:
   - Add length constraints: `ALTER TABLE members ALTER COLUMN name TYPE VARCHAR(255)`
   - Add unique constraints: `ALTER TABLE members ADD UNIQUE(email)`
   - Add check constraints: `ALTER TABLE members ADD CHECK(status IN ('active', 'inactive'))`
   - Add foreign keys with cascading rules
   - Add indexes for frequently queried columns

4. Implement database-level validation triggers:
   - Validate dates are reasonable (not 1900, not future)
   - Validate numeric ranges
   - Validate state transitions (e.g., can't go from archived to active)
   - Log validation failures for audit

5. Test migration:
   - Run on development database
   - Verify no data lost
   - Run on staging database
   - Verify constraints work as expected
   - Plan rollback strategy

6. Document constraints:
   - Comment each constraint in schema
   - Document business logic behind constraints
   - Document how to modify constraints in future

**Files to Modify:**
- `prisma/schema.prisma` - Update models with constraints
- `prisma/migrations/[timestamp]_add_database_constraints/migration.sql` - Create (NEW)
- `scripts/test-migration.ts` - Test migration script
- `docs/DATABASE_SCHEMA.md` - Document constraints

---

#### ALSH-021: Rate Limiting Implementation - Authentication APIs (P016)

**Type:** Feature (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Backend Engineer 1
**Sprint:** Sprint 2, Day 5-7
**Dependencies:** ALSH-018 (validation in place)
**Time Estimate:** 10 hours

**Description:**
Implement rate limiting on authentication endpoints to prevent brute force attacks. Rate limits are enforced per user (email), per IP address, and globally. Limits increase after multiple failed attempts (progressive backoff). Rate limit headers inform clients of current status.

**Acceptance Criteria:**
- Rate limiting on: login, signup, password reset, TOTP verification, OAuth callback
- Limits: 5 failed attempts per email per 15 minutes
- Limits: 10 failed attempts per IP per hour
- Global limit: 100 failed attempts per minute system-wide
- Progressive backoff: 1s, 2s, 4s, 8s, 16s delay between attempts
- Rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- Whitelisting for trusted IPs (optional, for internal testing)
- Rate limit state persisted in Redis or similar
- Admin can manually reset limits for locked accounts
- Rate limit bypass for internal health checks
- Monitoring and alerting on rate limit triggers
- 15+ test cases for rate limiting scenarios

**Technical Approach:**
1. Select rate limiting solution:
   - Redis (recommended, fast, distributed)
   - In-memory cache (simple, not distributed)
   - Database queries (slow, not recommended for high-traffic)
   - Selected: Redis with fallback to in-memory for development

2. Create rate limiting module `lib/rate-limiting/rate-limiter.ts`:
   ```typescript
   - getRateLimitKey(identifier: string, type: string): string
   - checkRateLimit(identifier: string, type: string): Promise<{allowed: boolean; remaining: number; resetTime: Date}>
   - recordAttempt(identifier: string, type: string): Promise<void>
   - resetRateLimit(identifier: string, type: string): Promise<void>
   ```

3. Implement rate limit checks:
   - Create middleware: `middleware/rate-limit.ts`
   - Apply to authentication endpoints
   - Extract identifier: email (for login), IP (for signup), email+IP (for TOTP)
   - Check limit before processing request
   - Return 429 (Too Many Requests) if exceeded

4. Implement progressive backoff:
   - Store attempt count in Redis
   - Exponential delay: delay = 1 * 2^(attempt_count - 5)
   - Delay capped at 16 seconds
   - Client retries should include Retry-After header

5. Add rate limit headers:
   ```
   X-RateLimit-Limit: 5
   X-RateLimit-Remaining: 0
   X-RateLimit-Reset: 1234567890
   Retry-After: 120
   ```

6. Implement admin bypass:
   - Admin endpoint to reset rate limits for accounts
   - Requires admin authentication
   - Logs reset action for audit trail

7. Add Redis configuration:
   - Redis connection with connection pooling
   - Key expiration: cleanup old rate limit records
   - Persistence: optional (can lose limits on restart)
   - Replication: for high availability

8. Add tests:
   - Single attempt succeeds
   - Multiple attempts fail after limit
   - Waiting clears attempt count
   - Progressive backoff increases delays
   - Different identifiers have independent limits
   - Admin reset works
   - Headers included in responses

**Files to Create/Modify:**
- `lib/rate-limiting/rate-limiter.ts` - Create (NEW)
- `middleware/rate-limit.ts` - Create (NEW)
- `src/pages/api/auth/login.ts` - Add rate limiting
- `src/pages/api/auth/signup.ts` - Add rate limiting
- `src/pages/api/auth/password-reset.ts` - Add rate limiting
- `src/pages/api/auth/totp/verify.ts` - Add rate limiting
- `src/pages/api/auth/oauth/callback.ts` - Add rate limiting
- `src/pages/api/admin/rate-limits/reset.ts` - Create (NEW)
- `__tests__/rate-limiting/rate-limiter.test.ts` - Create (NEW)
- `redis.conf` / `docker-compose.yml` - Redis configuration

---

#### ALSH-022: Rate Limiting Implementation - API Endpoints (P017)

**Type:** Feature (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Backend Engineer 2
**Sprint:** Sprint 2, Day 5-7
**Dependencies:** ALSH-021 (rate limiting patterns)
**Time Estimate:** 10 hours

**Description:**
Extend rate limiting to all API endpoints (members, relationships, events, documents) to prevent abuse. Implement user-specific limits (per authenticated user) and IP-based limits (for unauthenticated requests). Different endpoints have different limits based on resource intensity.

**Acceptance Criteria:**
- Rate limiting on all CRUD endpoints (GET, POST, PUT, DELETE)
- Authenticated users: 100 requests per minute per endpoint
- Unauthenticated users: 10 requests per minute per endpoint
- Bulk operations: lower limits (e.g., 5 requests per minute)
- Read operations: higher limits (e.g., 1000 per minute)
- Rate limit headers on all responses
- Rate limit bypass for internal services (with API key)
- User education: hints in error messages ("Try again in 30 seconds")
- Monitoring of rate limit usage by endpoint
- Alerting for unusual patterns (DDoS, API scraping)
- 15+ test cases for endpoint rate limiting

**Technical Approach:**
1. Define rate limit tiers:
   ```
   - Read endpoints (GET): 1000 req/min (authenticated), 100 req/min (unauthenticated)
   - Write endpoints (POST, PUT, DELETE): 100 req/min (authenticated), 10 req/min (unauthenticated)
   - Bulk operations (import): 5 req/min
   - Admin endpoints: 50 req/min (special admin rate limit)
   ```

2. Create endpoint rate limit configuration:
   ```typescript
   // lib/rate-limiting/endpoint-limits.ts
   const ENDPOINT_LIMITS = {
     'GET /api/members': {authenticated: 1000, unauthenticated: 100},
     'POST /api/members': {authenticated: 100, unauthenticated: 10},
     'PUT /api/members/:id': {authenticated: 100, unauthenticated: 10},
     'DELETE /api/members/:id': {authenticated: 50, unauthenticated: 5},
     // ... more endpoints
   }
   ```

3. Update rate limiting middleware:
   - Check endpoint in configuration
   - Apply appropriate limit based on auth status
   - Track by user ID (authenticated) or IP (unauthenticated)

4. Implement bypass mechanisms:
   - API key authentication (for internal services)
   - Admin bypass for testing
   - Whitelist for known partners

5. Add monitoring:
   - Track rate limit usage by endpoint
   - Create dashboard showing usage patterns
   - Alert if single user/IP hits limit repeatedly

6. Add tests:
   - Different limits for read vs write
   - Different limits for authenticated vs unauthenticated
   - Bulk operations properly limited
   - Bypass works for API keys

**Files to Modify:**
- `lib/rate-limiting/endpoint-limits.ts` - Create (NEW)
- `middleware/rate-limit.ts` - Extend with endpoint limits
- `src/pages/api/members/*.ts` - Already covered by middleware
- `src/pages/api/relationships/*.ts` - Already covered by middleware
- `src/pages/api/events/*.ts` - Already covered by middleware
- `src/pages/api/documents/*.ts` - Already covered by middleware
- `__tests__/rate-limiting/endpoint-limits.test.ts` - Create (NEW)
- `monitoring/rate-limit-dashboard.ts` - Create (NEW)

---

#### ALSH-023: CSRF Protection Extension to All State-Changing Operations (P018)

**Type:** Bug Fix (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Backend Engineer 1
**Sprint:** Sprint 2, Day 7-9
**Dependencies:** ALSH-010 (CSRF token infrastructure exists)
**Time Estimate:** 10 hours

**Description:**
Extend CSRF protection to all state-changing operations (POST, PUT, PATCH, DELETE requests). Every form submission and API call modifying state includes a CSRF token. Tokens are validated server-side before processing. This prevents cross-site request forgery attacks.

**Acceptance Criteria:**
- CSRF tokens required on all POST, PUT, PATCH, DELETE endpoints
- Tokens generated per session and per form
- Tokens rotate after each use (optional, for high-security)
- Tokens validated with constant-time comparison
- Invalid/expired tokens return 403 (Forbidden)
- GET requests excluded (idempotent, no CSRF risk)
- AJAX requests accept token in header or body
- Form submissions require token in hidden field
- Token error messages don't leak validation details
- 15+ test cases for CSRF validation

**Technical Approach:**
1. Create CSRF token module `lib/security/csrf-tokens.ts`:
   ```typescript
   - generateCSRFToken(): string
   - storeCSRFToken(session, token): void
   - validateCSRFToken(session, token): boolean
   - getCSRFTokenForForm(): string
   ```

2. Create middleware for CSRF validation `middleware/csrf-protection.ts`:
   - Check request method (skip GET, HEAD, OPTIONS)
   - Extract token from request (header, body, cookie)
   - Validate token using module
   - Return 403 if invalid

3. Update all forms:
   - Add hidden CSRF token field: `<input type="hidden" name="_csrf" value={token} />`
   - Server provides token in page render: `getServerSideProps` or API route

4. Update all AJAX requests:
   - Add token to request header: `X-CSRF-Token: {token}`
   - Or add to request body: `{..., _csrf: token}`
   - Fetch configuration with token:
     ```typescript
     fetch('/api/endpoint', {
       method: 'POST',
       headers: {'X-CSRF-Token': token},
       body: JSON.stringify(data)
     })
     ```

5. Implement token generation in layouts:
   - Generate token in server-side page rendering
   - Pass token to client components
   - Components use token in forms/requests

6. Add tests:
   - Valid token accepted
   - Invalid token rejected
   - Missing token rejected
   - Expired token rejected
   - Token rotation works (if implemented)
   - GET requests bypass CSRF check
   - Error response is 403

**Files to Create/Modify:**
- `lib/security/csrf-tokens.ts` - Create/enhance
- `middleware/csrf-protection.ts` - Create (NEW)
- `src/pages/_app.tsx` - Add CSRF token provider
- All form pages - Add CSRF token field
- All API mutation endpoints - Add CSRF validation
- `__tests__/security/csrf-protection.test.ts` - Create (NEW)

---

#### ALSH-024: Security Headers Completion and Enforcement (P019)

**Type:** Feature (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** Full-Stack Engineer
**Sprint:** Sprint 2, Day 7-9
**Dependencies:** ALSH-001 (initial headers), ALSH-017 (TLS)
**Time Estimate:** 10 hours

**Description:**
Complete security header implementation across all endpoints. Add missing headers: Content-Security-Policy, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-XSS-Protection. Headers are configured correctly, tested for effectiveness, and documented.

**Acceptance Criteria:**
- X-Frame-Options: DENY (or SAMEORIGIN where needed)
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricts browser features (camera, microphone, etc.)
- Content-Security-Policy: Comprehensive, prevents XSS
- Strict-Transport-Security: 1 year, includes subdomains
- All headers present on every response
- Header validation automated in CI/CD
- Security audit validates all headers present
- Headers documented with rationale

**Technical Approach:**
1. Create comprehensive headers middleware:
   ```typescript
   // lib/security/response-headers.ts
   const SECURITY_HEADERS = {
     'X-Frame-Options': 'DENY',
     'X-Content-Type-Options': 'nosniff',
     'X-XSS-Protection': '1; mode=block',
     'Referrer-Policy': 'strict-origin-when-cross-origin',
     'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
     'Content-Security-Policy': '...', // detailed below
     'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
   }
   ```

2. Design Content-Security-Policy:
   ```
   default-src 'self';
   script-src 'self' 'nonce-{random}';
   style-src 'self' 'unsafe-inline';
   img-src 'self' data: https:;
   font-src 'self';
   connect-src 'self';
   frame-ancestors 'none';
   base-uri 'self';
   form-action 'self';
   ```

3. Implement nonce generation for inline scripts:
   - Generate random nonce per request
   - Include in CSP header
   - Include in script tags: `<script nonce={nonce}>`
   - Prevents inline XSS

4. Apply headers globally:
   - Update `next.config.js` with headers configuration
   - Or update middleware to add headers to all responses
   - Test headers present on sample endpoints

5. Validate headers:
   - Create test to verify all headers present
   - Verify header values are secure
   - Verify no conflicting headers

6. Document headers:
   - Create `docs/SECURITY_HEADERS.md`
   - Explain purpose of each header
   - Document CSP policy details
   - Document exceptions and rationale

**Files to Modify:**
- `lib/security/response-headers.ts` - Enhance
- `next.config.js` - Update headers configuration
- `middleware.ts` - Add all headers to responses
- `__tests__/security/response-headers.test.ts` - Create (NEW)
- `docs/SECURITY_HEADERS.md` - Create (NEW)

---

#### ALSH-025: Performance Testing and Optimization of Security Features

**Type:** Testing (Performance - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** QA Engineer, Backend Engineer 2
**Sprint:** Sprint 2, Day 8-10
**Dependencies:** ALSH-016 through ALSH-024 (all security features)
**Time Estimate:** 10 hours

**Description:**
Comprehensive performance testing to ensure security features don't degrade user experience. Measure overhead of: encryption, hashing, rate limiting, CSRF validation, input validation, and security headers. Identify and optimize bottlenecks.

**Acceptance Criteria:**
- Load test: 1000 concurrent users, all operations
- Measure response times for all endpoints
- Measure encryption/decryption overhead
- Measure hashing/validation overhead
- Security operations < 5% total request time (target)
- Database query performance with encryption
- No significant increase in error rates
- Memory usage stable under load
- CPU usage acceptable
- Network bandwidth acceptable
- Performance baselines documented
- Optimization recommendations provided
- Performance regression tests in CI/CD

**Technical Approach:**
1. Set up performance testing infrastructure:
   - Load testing tool: Apache JMeter or k6
   - APM tool: New Relic or Datadog
   - Continuous profiling: py-spy or Node.js profiler

2. Establish baseline performance (pre-security):
   - Run load tests on clean database
   - Measure response times by endpoint
   - Measure resource usage
   - Document baseline metrics

3. Run load tests post-security implementation:
   - 1000 concurrent users
   - Mixed workload: reads, writes, auth, TOTP
   - Duration: 10-15 minutes
   - Measure: response time, errors, throughput, resource usage

4. Profile specific operations:
   - Bcrypt hashing time
   - AES-256-GCM encryption/decryption
   - Token validation/comparison
   - Rate limit lookup (Redis)
   - CSRF token validation
   - Input validation

5. Identify bottlenecks:
   - CPU-bound operations: hashing, encryption
   - I/O-bound operations: database, Redis
   - Network: security header transmission

6. Optimize:
   - Caching: hash results, encryption keys
   - Async operations: move blocking ops to background
   - Database: indexes for rate limiting, session lookups
   - Redis: optimize key expiration

7. Document findings:
   - Performance impact of each security feature
   - Optimization recommendations
   - Performance budgets for future development

**Files to Create:**
- `performance/load-test-config.jmeter` or `k6-load-test.js` - Load test scripts
- `performance/benchmark-results.md` - Baseline and results
- `docs/PERFORMANCE_ANALYSIS.md` - Detailed analysis
- `__tests__/performance/security-overhead.bench.ts` - Benchmarks

---

#### ALSH-026: Sprint 2 Security Code Review and UAT

**Type:** Testing & Review (Security - High)
**Story Points:** 5
**Priority:** HIGH
**Assigned To:** QA Engineer, Backend Engineer 1
**Sprint:** Sprint 2, Day 9-10
**Dependencies:** ALSH-016 through ALSH-025 (all features)
**Time Estimate:** 10 hours

**Description:**
Comprehensive code review and user acceptance testing of all Sprint 2 security enhancements. Verify all features work together, no regressions, and security improvements are effective. Final validation before production deployment.

**Acceptance Criteria:**
- All Sprint 2 code reviewed by security engineer
- Security checklist applied to all changes
- No outstanding security review comments
- All integration tests pass
- Performance benchmarks within acceptable ranges
- UAT sign-off from business stakeholders
- Security regression tests created
- Deployment runbook prepared
- Incident response procedures rehearsed
- Team sign-off on readiness for production

**Technical Approach:**
1. Code review process:
   - Security-trained engineer reviews all changes
   - Apply security checklist from ALSH-011
   - Verify encryption implementation correctness
   - Verify rate limiting works as designed
   - Verify headers present and correct
   - Test in staging environment

2. Integration testing:
   - Full end-to-end workflows
   - Cross-feature interactions (encryption + rate limiting)
   - Concurrent user scenarios
   - Edge case handling

3. User acceptance testing (UAT):
   - Business stakeholders test key workflows
   - Verify no usability regressions
   - Verify error messages are helpful
   - Verify performance is acceptable
   - Collect feedback and issues

4. Regression testing:
   - Run full test suite (unit + integration + security)
   - Verify code coverage ≥80%
   - Verify no performance regressions
   - Verify all existing features work

5. Deployment preparation:
   - Create deployment runbook
   - Document rollback procedures
   - Prepare communication templates
   - Schedule deployment window
   - Brief on-call engineer

6. Incident response rehearsal:
   - Walk through incident response procedures
   - Test communication channels
   - Verify escalation paths
   - Document lessons learned

**Files to Create:**
- `DEPLOYMENT_RUNBOOK_SPRINT2.md` - Detailed deployment steps
- `ROLLBACK_PLAN_SPRINT2.md` - Rollback procedures
- `RELEASE_NOTES_SPRINT2.md` - Release notes
- `UAT_CHECKLIST.md` - UAT checklist

---

### Sprint 2 Ticket Summary

| ID | Title | Points | Days | Assignee | Status |
|---|---|---|---|---|---|
| ALSH-016 | Database Encryption at Rest | 5 | 1-3 | DevOps | Pending |
| ALSH-017 | TLS/HTTPS Enforcement | 5 | 1-3 | Full-Stack/DevOps | Pending |
| ALSH-018 | Input Validation - Auth APIs | 5 | 2-4 | Backend 1 | Pending |
| ALSH-019 | Input Validation - API Endpoints | 8 | 2-6 | Backend 2/3 | Pending |
| ALSH-020 | Input Validation - DB Layer | 5 | 4-6 | Backend 3 | Pending |
| ALSH-021 | Rate Limiting - Auth APIs | 5 | 5-7 | Backend 1 | Pending |
| ALSH-022 | Rate Limiting - API Endpoints | 5 | 5-7 | Backend 2 | Pending |
| ALSH-023 | CSRF Protection Extension | 5 | 7-9 | Backend 1 | Pending |
| ALSH-024 | Security Headers Completion | 5 | 7-9 | Full-Stack | Pending |
| ALSH-025 | Performance Testing & Optimization | 5 | 8-10 | QA/Backend 2 | Pending |
| ALSH-026 | Sprint 2 Code Review & UAT | 5 | 9-10 | QA/Backend 1 | Pending |

**Sprint 2 Total: 63 Story Points** (target committed capacity: 85 points)

---

## Sprint Board Layout & Ceremonies

### Sprint 1 & 2: Kanban Board Organization

**Board Columns (Left to Right):**
1. **Backlog** - Not yet started, waiting for sprint
2. **To Do** - Committed to sprint, ready to start
3. **In Progress** - Currently being worked on
4. **Code Review** - Waiting for security review
5. **Testing** - In QA or automated testing
6. **Done** - Completed, verified, tested

**Card Information (per ticket):**
```
┌─────────────────────────────────────────┐
│ ALSH-001: Fix X-Frame-Options           │
│ 3 points | CRITICAL | Day 1-2           │
│                                         │
│ Assignee: Full-Stack Engineer          │
│ Status: In Progress                    │
│ Blocked: None                          │
│ Reviews: Security pending              │
└─────────────────────────────────────────┘
```

**Color Coding:**
- Red: CRITICAL priority (P001-P010)
- Orange: HIGH priority (P011-P019)
- Yellow: MEDIUM priority (documentation, testing)
- Green: Complete
- Blue: Blocked/waiting

### Daily Standup Template

**Time:** 9:30 AM, 15 minutes
**Format:** Synchronous (Zoom/in-person) with Slack updates

**Each Engineer Reports (2 minutes max):**
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers or dependencies?

**Template Responses:**

```
[Engineer Name]
✅ Completed: ALSH-001 (X-Frame-Options) - moved to code review
🔄 Today: ALSH-002 (Secrets Management) - setting up AWS KMS
⚠️  Blocked: Waiting on security review of ALSH-001 before proceeding

[QA Lead]
✅ Completed: Security test suite structure (ALSH-012)
🔄 Today: Writing hashing validation tests
⚠️  Blocked: None

[DevOps Lead]
✅ Completed: Secrets vault provisioned
🔄 Today: Configuring CI/CD to use vault
⚠️  Blocked: None
```

**Standup Host Responsibilities:**
- Track blocker resolution
- Identify dependencies
- Note scope changes
- Update burn-down chart

**Post-Standup Actions:**
- Document decisions in Slack thread
- Update ticket status
- Escalate blockers to tech lead
- Share burn-down chart update

### Sprint Planning Ceremony (Day 1, 10:00-11:30 AM)

**Participants:** All engineers, PM, tech lead, security lead

**Agenda (90 minutes):**
1. **Sprint Goal Discussion** (15 min)
   - Review previous sprint learnings
   - Confirm Sprint Goal for upcoming sprint
   - Discuss risk areas

2. **Story Selection & Breakdown** (45 min)
   - Present prioritized backlog
   - Team selects tickets for sprint
   - Discuss story points and estimates
   - Identify dependencies
   - Assign owners
   - Target: Fill ~85 story points

3. **Acceptance Criteria Walkthrough** (20 min)
   - Product manager clarifies each ticket's acceptance criteria
   - Team asks clarifying questions
   - Document edge cases and exceptions

4. **Dependency & Risk Identification** (10 min)
   - Map dependencies between tickets
   - Identify critical path
   - Discuss mitigation strategies
   - Note external dependencies

**Outputs:**
- Sprint board populated with 85 points of committed work
- Ticket owners assigned
- Dependencies documented
- Sprint goal agreed upon
- Capacity model confirmed

### Sprint Review/Demo (Day 10, 3:00-4:00 PM)

**Participants:** All engineers, PM, tech lead, security lead, optionally: product owner, key stakeholders

**Format:**
1. **Sprint Overview** (5 min)
   - Sprint goal recap
   - Points completed vs. committed

2. **Ticket Demonstrations** (40 min)
   - Each completed ticket: 2-3 min demo
   - Show acceptance criteria met
   - Demonstrate no regressions
   - QA verifies testing completed
   - Security lead confirms security review passed

3. **Metrics & Insights** (10 min)
   - Velocity (points completed)
   - Code coverage metrics
   - Security test coverage
   - Performance metrics

4. **Feedback & Discussion** (5 min)
   - Stakeholder questions
   - Feedback on features
   - Suggestions for next sprint

**Outputs:**
- Completed work verified
- Stakeholder sign-off obtained
- Insights captured for retrospective
- Metrics documented for trend analysis

### Sprint Retrospective (Day 10, 4:00-4:45 PM)

**Participants:** All engineers (facilitator: tech lead or external)

**Format (45 minutes):**

1. **Warm-up** (5 min)
   - Quick team check-in
   - Facilitator sets psychological safety tone

2. **What Went Well** (10 min)
   - Each person: 1-2 things that went well
   - Examples: smooth collaboration, quick decisions, good testing
   - Facilitator writes on board/document

3. **What Could Improve** (10 min)
   - Each person: 1-2 things to improve
   - Examples: blocking dependencies, unclear requirements, slow reviews
   - Facilitator groups similar items

4. **Action Items** (15 min)
   - Select 3-5 most impactful improvement areas
   - Assign owner to each improvement
   - Define concrete action and success metric
   - Track in action item register

5. **Appreciation & Closure** (5 min)
   - Highlight excellent work/collaboration
   - Celebrate completed sprint
   - Preview next sprint challenges

**Sample Retrospective Notes:**

```
WHAT WENT WELL:
- Security testing suite caught several edge cases
- Secrets management setup was smoother than expected
- Team collaboration on cross-functional features excellent
- Code reviews thorough but constructive

WHAT COULD IMPROVE:
- Waiting for code review blocked some progress (slow turnaround)
- Database schema changes needed more upfront planning
- Documentation often lagged implementation
- Parallel work coordination could be better

ACTION ITEMS:
1. Establish PR review SLA: within 24 hours (Owner: Tech Lead)
2. Create database design template/checklist (Owner: Backend 3)
3. Pair documentation with implementation, not after (Owner: All)
4. Async standup during heavy parallel work periods (Owner: PM)
```

**Outputs:**
- Retrospective notes documented
- Action items assigned and tracked
- Improvement initiatives planned for next sprint
- Team feedback captured

### Backlog Refinement (Every Thursday, 2:00-2:45 PM)

**Participants:** PM, tech lead, 1-2 lead engineers (rotating)

**Agenda (45 minutes):**
1. **Upcoming Sprint Backlog Review** (15 min)
   - Review top 5-10 tickets for upcoming sprint
   - Clarify requirements
   - Estimate story points
   - Identify dependencies

2. **Emerging Issues & Risks** (15 min)
   - Review P0/P1 severity issues
   - Assess impact on sprints
   - Discuss mitigation
   - Adjust backlog priority

3. **Organizational & Infrastructure Tasks** (10 min)
   - Discuss any non-feature work needed
   - Team capacity planning
   - Skills development needs

4. **Metrics & Planning** (5 min)
   - Review velocity trend
   - Forecast sprint completion dates
   - Adjust roadmap if needed

**Outputs:**
- Next sprint backlog refined
- Tickets estimated and ready for selection
- Risks identified early
- Roadmap updated

### Code Review Process (Continuous, Every PR)

**Pull Request Flow:**
1. **Engineer opens PR** with description, acceptance criteria checklist
2. **CI/CD checks run** (tests, linting, secret scanning)
3. **Code review assigned** to 1-2 engineers (peers) + security engineer (for security-critical)
4. **Peer review** (functional, quality, patterns)
5. **Security review** (checklist validation)
6. **Approval** (both peer + security required for sensitive code)
7. **Merge and deployment** (automated or manual based on release process)

**Code Review Checklist (from ALSH-011):**
- [ ] Functional requirements met
- [ ] Code follows team standards
- [ ] No hardcoded secrets
- [ ] Error handling complete
- [ ] Logging appropriate (no sensitive data)
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Performance acceptable
- [ ] Security impact assessed
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization correct
- [ ] Rate limiting not bypassed
- [ ] CSRF tokens used where needed
- [ ] Input validation complete

**Review Time SLAs:**
- CRITICAL fixes: Review within 4 hours
- HIGH priority: Review within 12 hours
- MEDIUM/LOW priority: Review within 24 hours
- Weekend: Can wait until Monday unless P0 issue

### Deployment Process (End of Sprint)

**Pre-Deployment (Day 9):**
1. Final code review completed
2. All tests passing in CI/CD
3. Performance benchmarks acceptable
4. Security audit completed
5. Stakeholder sign-off obtained
6. Runbook reviewed by ops team
7. Communication templates prepared

**Deployment Day (Day 10, afternoon):**
1. Create release branch from main
2. Tag version (semver)
3. Generate release notes
4. Notify stakeholders: "Deploying in 15 minutes"
5. Deploy to staging first
6. Smoke test on staging
7. Deploy to production (if using canary/blue-green)
8. Monitor metrics for 30 minutes
9. Verify no alerts or errors
10. Notify stakeholders: "Deployment complete"

**Post-Deployment:**
- Monitor error rates and performance for 24 hours
- Be ready to rollback if critical issues discovered
- Document any incidents and learnings
- Schedule post-deployment retrospective if issues found

---

**Document End: Part 1 Complete**

*Next Section: Part 2 will include detailed release procedures, success metrics, and risk mitigation strategies.*

