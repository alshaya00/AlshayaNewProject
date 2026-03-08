# Al-Shaya Information Architecture v3.0

**Generated:** March 5, 2026
**Project:** آل شايع - Al-Shaya Family Tree Database Application
**Audit Scope:** 408 Files | 135,716 Lines of Code | 187 Issues

---

## TABLE OF CONTENTS

1. Site Map
2. Navigation Patterns
3. URL Structure
4. Content Model
5. Search Architecture
6. Role-Based Information Access
7. Data Flow
8. Metadata Model
9. Internationalization Architecture

---

## 1. SITE MAP

### Complete Page Hierarchy (87 Pages Total)

```
/ (Root)
├── /login
├── /register
├── /forgot-password
├── /reset-password/[token]
├── /verify-email/[token]
├── /dashboard
│   ├── /overview
│   ├── /statistics
│   ├── /recent-activity
│   └── /quick-actions
├── /tree
│   ├── /view (Default: circular)
│   ├── /view/linear
│   ├── /view/ancestor
│   ├── /view/descendant
│   └── /settings
├── /search
│   ├── /advanced
│   ├── /results
│   └── /saved-searches
├── /member
│   ├── /[id]
│   │   ├── /profile
│   │   ├── /relations
│   │   ├── /photos
│   │   ├── /journals
│   │   ├── /edit
│   │   └── /delete-confirm
│   ├── /add
│   └── /bulk-import
├── /gallery
│   ├── /albums
│   ├── /[albumId]
│   └── /[albumId]/[photoId]
├── /journals
│   ├── /list
│   ├── /[journalId]
│   ├── /[journalId]/edit
│   └── /add
├── /events
│   ├── /gatherings
│   ├── /[eventId]
│   ├── /[eventId]/rsvp
│   └── /add
├── /broadcasts
│   ├── /announcements
│   ├── /[broadcastId]
│   └── /[broadcastId]/rsvp
├── /profile
│   ├── /my-profile
│   ├── /edit
│   ├── /settings
│   ├── /security
│   │   ├── /2fa
│   │   ├── /sessions
│   │   ├── /backup-codes
│   │   └── /change-password
│   ├── /privacy
│   └── /notifications
├── /admin (Protected: ADMIN+ only)
│   ├── /dashboard
│   │   ├── /overview
│   │   ├── /audit-logs
│   │   └── /system-health
│   ├── /members-hub
│   │   ├── /all
│   │   ├── /orphans
│   │   ├── /duplicates
│   │   ├── /recent-changes
│   │   └── /bulk-actions
│   ├── /users
│   │   ├── /list
│   │   ├── /[userId]
│   │   ├── /[userId]/edit
│   │   ├── /roles
│   │   └── /permissions
│   ├── /pending
│   │   ├── /members
│   │   ├── /images
│   │   ├── /access-requests
│   │   └── /duplicates-merge
│   ├── /settings
│   │   ├── /general
│   │   ├── /privacy
│   │   ├── /feature-flags
│   │   ├── /api-config
│   │   ├── /email-templates
│   │   └── /backup
│   ├── /data-management
│   │   ├── /import
│   │   ├── /export
│   │   ├── /repairs
│   │   │   ├── /orphans
│   │   │   ├── /broken-links
│   │   │   └── /integrity-check
│   │   └── /cleanup
│   ├── /broadcasts
│   │   ├── /create
│   │   ├── /[broadcastId]/recipients
│   │   └── /scheduled
│   ├── /reports
│   │   ├── /member-statistics
│   │   ├── /activity
│   │   ├── /performance
│   │   └── /security
│   └── /integrations
│       ├── /email
│       ├── /sms
│       ├── /oauth
│       ├── /github-backup
│       └── /google-drive-backup
└── /help
    ├── /faq
    ├── /getting-started
    ├── /family-tree-guide
    ├── /feature-guide
    ├── /contact-support
    └── /privacy-policy

```

---

## 2. NAVIGATION PATTERNS

### Global Navigation (Top Bar)
- Logo/Home link
- Search bar (global)
- Language toggle (AR/EN)
- User menu (dropdown)
- Theme toggle (light/dark)
- Notifications bell

### Authenticated User Navigation

#### Primary Sidebar
- Dashboard (home icon)
- Family Tree (tree icon)
- Search (search icon)
- Members (people icon)
- Gallery (photos icon)
- Journals (book icon)
- Events (calendar icon)
- Broadcasts (megaphone icon)
- My Profile (user icon)
- Settings (gear icon)
- Help & Support (question icon)
- Logout

#### Secondary Sidebar (Admin)
- Admin Dashboard
- Members Hub
- User Management
- Pending Items
- Settings
- Data Management
- Reports
- Integrations

### Breadcrumb Navigation
Pattern: `Home > Section > Subsection > Page`

Examples:
- Home > Admin > Members Hub > Orphans > [Details]
- Home > Member > [Name] > Edit Profile
- Home > Gallery > Albums > [Album Name] > [Photo]

### Contextual Tabs (Per Page)
**Member Profile:**
- Overview
- Relations (ancestors, descendants)
- Photos
- Journals
- Edit
- Delete

**Admin Members Hub:**
- All Members
- Orphans
- Duplicates
- Recent Changes
- Bulk Actions

**Admin Users:**
- List
- Details [by user]
- Roles & Permissions

---

## 3. URL STRUCTURE

### Pattern: RESTful + Feature-Based Routes

#### Authentication Routes
```
POST   /api/auth/login                        (email + password login)
POST   /api/auth/login/phone                  (OTP login)
POST   /api/auth/verify-otp                   (OTP code verification)
POST   /api/auth/register                     (new user registration)
POST   /api/auth/verify-email                 (email verification)
POST   /api/auth/password-reset               (initiate password reset)
POST   /api/auth/reset-password               (reset password with token)
POST   /api/auth/logout                       (session termination)
POST   /api/auth/refresh-token                (token refresh)
GET    /api/auth/oauth/google                 (Google OAuth redirect)
GET    /api/auth/oauth/callback               (OAuth callback handler)
```

#### Member Routes
```
GET    /api/members                           (list all members)
POST   /api/members                           (create member)
GET    /api/members/[id]                      (get member detail)
PUT    /api/members/[id]                      (update member)
DELETE /api/members/[id]                      (soft delete member)
GET    /api/members/[id]/relations            (family relations)
GET    /api/members/[id]/ancestors            (ancestor chain)
GET    /api/members/[id]/descendants          (descendant tree)
GET    /api/members/[id]/photos               (member photos)
POST   /api/members/[id]/photos               (add photo)
DELETE /api/members/[id]/photos/[photoId]    (delete photo)
```

#### Search Routes
```
GET    /api/search                            (search with filters)
GET    /api/search/autocomplete               (typeahead suggestions)
GET    /api/search/advanced                   (advanced search)
GET    /api/search/history                    (user search history)
```

#### Admin Routes
```
GET    /api/admin/dashboard                   (admin dashboard stats)
GET    /api/admin/members/orphans             (orphaned members)
GET    /api/admin/members/duplicates          (duplicate detection)
GET    /api/admin/members/recent-changes      (change audit trail)
POST   /api/admin/members/repair              (data repair job)
GET    /api/admin/users                       (list users)
PUT    /api/admin/users/[userId]/role         (change user role)
DELETE /api/admin/users/[userId]              (delete user)
GET    /api/admin/settings                    (get site settings)
PUT    /api/admin/settings                    (update site settings)
POST   /api/admin/broadcasts                  (create announcement)
GET    /api/admin/broadcasts/[id]/recipients  (broadcast recipients)
POST   /api/admin/backups/export              (export data)
POST   /api/admin/backups/import              (import data)
GET    /api/admin/audit-logs                  (audit trail)
```

#### Profile Routes
```
GET    /api/profile                           (current user profile)
PUT    /api/profile                           (update profile)
POST   /api/profile/change-password           (password change)
GET    /api/profile/sessions                  (active sessions)
DELETE /api/profile/sessions/[sessionId]      (revoke session)
POST   /api/profile/2fa/enable                (enable 2FA)
POST   /api/profile/2fa/disable               (disable 2FA)
GET    /api/profile/2fa/backup-codes          (get backup codes)
```

#### Utility Routes
```
GET    /api/health                            (health check)
GET    /api/stats                             (family statistics)
POST   /api/upload/image                      (image upload)
GET    /api/export/members                    (export members)
POST   /api/import/members                    (import members)
```

---

## 4. CONTENT MODEL

### Core Content Types

#### Family Member Record
**Fields:**
- Genealogical: firstName, fatherName, grandfatherName, familyName
- Bilingual: fullNameAr, fullNameEn
- Demographics: gender (Male/Female), birthYear, deathYear, status (Living/Deceased)
- Contact: phone, email
- Structural: fatherId (parent link), generation (1-20)
- Media: photos[], journals[]
- Metadata: createdAt, updatedAt, deletedAt

**Privacy Levels:**
- Public: Name, generation, status
- Private: Phone, email, birth year
- Admin Only: Deletion history, merged records

#### Family Journal
**Fields:**
- Bilingual: titleAr, titleEn, contentAr, contentEn
- Media: pdfUrl, embedded images
- Metadata: category, viewCount, status (Draft/Published/Archived)
- Moderation: approvedBy, publishedAt
- Author tracking: createdBy, updatedBy

#### Photo Record
**Fields:**
- mediaUrl, thumbnail, originalFilename
- Metadata: uploadedAt, uploadedBy
- Categorization: category, isProfilePhoto
- Privacy: isPublic (boolean)
- Album: albumId, displayOrder

#### Broadcast/Announcement
**Fields:**
- Bilingual: titleAr, titleEn, descriptionAr, descriptionEn
- Event info: meetingDate, meetingLocation, meetingUrl
- RSVP tracking: status (Pending/Sent/Failed), rsvpDeadline
- Metadata: createdBy, publishedAt

#### User Record
**Fields:**
- Identity: email, phone, fullName
- Authentication: passwordHash (bcrypt)
- Status: emailVerified, phoneVerified, status (Active/Inactive)
- Roles & Permissions: role, permissionOverrides[]
- Activity: lastLoginAt, lastLoginIp
- Security: accountLockedUntil, twoFactorEnabled

---

## 5. SEARCH ARCHITECTURE

### Search Types

#### Basic Search
- Full-text search on member names
- Supports Arabic diacritics normalization
- Returns name + generation + father

#### Advanced Search
- Filter by generation range
- Filter by status (living/deceased)
- Filter by gender
- Filter by date range (birth/death)
- Combination of filters

#### Fuzzy Matching
- Bigram-based similarity scoring
- Handles spelling variations
- Arabic name variants (hamza variations)
- Minimum similarity threshold: 0.75
- Results ranked by score

#### Autocomplete/Typeahead
- Prefix matching on names
- Real-time suggestions (debounced)
- Max 10 suggestions per query
- Returns: name, generation, ID

### Indexing Strategy

**Current Indexes:**
- fatherId (genealogy traversal)
- generation (level-based queries)
- status (living/deceased filtering)
- createdAt (recent additions)

**Missing Indexes:**
- fullNameAr (Arabic name search)
- fullNameEn (English name search)
- gender (gender filtering)

### Search Result Ranking

1. Exact name match (score 1.0)
2. First name match (score 0.9)
3. Fuzzy match + generation (score 0.75-0.89)
4. Partial name match (score 0.6-0.74)

### Search Analytics

Tracked in SearchHistory model:
- query (search terms)
- resultCount (number of results)
- clickCount (which results clicked)
- timestamp (when searched)

---

## 6. ROLE-BASED INFORMATION ACCESS

### Permission Matrix (5 Roles)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED ACCESS CONTROL                     │
├──────────────┬──────────┬──────────┬───────────┬──────────────┤
│ Resource     │ MEMBER   │ LEADER   │ ADMIN     │ SUPER_ADMIN  │
├──────────────┼──────────┼──────────┼───────────┼──────────────┤
│ View Profile │ Own only │ Branch   │ All       │ All          │
│ Edit Profile │ Own only │ Branch   │ All       │ All          │
│ Delete Memb  │ No       │ No       │ Yes(soft) │ Yes(hard)    │
│ View Photos  │ Public   │ All      │ All       │ All          │
│ Upload Photo │ Own      │ Branch   │ All       │ All          │
│ View Journal │ Publi... │ All      │ All       │ All          │
│ Write Journal│ Yes      │ Yes      │ Yes       │ Yes          │
│ Approve Jour │ No       │ Branch   │ Yes       │ Yes          │
│ Manage Users │ No       │ No       │ Limited   │ Yes          │
│ Change Roles │ No       │ No       │ No        │ Yes          │
│ View Audit   │ No       │ Branch   │ Yes       │ Yes          │
│ Settings     │ No       │ No       │ Limited   │ Yes          │
│ Backups      │ No       │ No       │ Yes       │ Yes          │
│ Feature Flag │ No       │ No       │ No        │ Yes          │
└──────────────┴──────────┴──────────┴───────────┴──────────────┘
```

### Field-Level Access Control

#### Member Profile Fields
- **Public Fields** (visible to all):
  - Name, gender, generation, status

- **Authenticated Only** (visible to logged-in users):
  - Photos, journals, relationships

- **Private Fields** (configurable per privacy settings):
  - Phone, email, birth year

- **Admin Only** (visible to admins):
  - Change history, deletion records, audit logs

#### Configuration via PrivacySettings
- showPhoneToRoles: [ADMIN] (default)
- showEmailToRoles: [ADMIN] (default)
- showBirthYearToRoles: [ADMIN] (default)
- profileVisibility: PUBLIC/AUTHENTICATED/PRIVATE

---

## 7. DATA FLOW

### High-Level Data Architecture

```
Client (React)
    ↓
Next.js API Routes
    ↓
Authentication Check → Unauthorized (401)
    ↓
Authorization Check → Forbidden (403)
    ↓
Input Validation → Bad Request (400)
    ↓
Business Logic
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
ChangeHistory Log
    ↓
Response Serialization
    ↓
React Component Update
    ↓
UI Re-render
```

### Request Flow Example: View Member Profile

```
1. User clicks member card
2. React calls GET /api/members/[id]
3. API extracts token from Authorization header
4. Server verifies token validity
5. User role loaded from Session/User table
6. Authorization check: Is member public OR user is authenticated?
7. If denied → return 403 Forbidden
8. Prisma queries FamilyMember + related photos/journals
9. Field filtering applied based on user role
10. Response formatted to JSON
11. React Query cache updated
12. Member profile component renders
```

### Member Record Creation Flow

```
1. Admin submits new member form
2. POST /api/members with data
3. Bearer token validated → User loaded
4. Role check: Is user ADMIN+? If not → 403
5. Zod validation: All required fields present?
6. If invalid → 400 Bad Request
7. Generate next member ID (P0001-P9999)
8. Create FamilyMember record
9. Create ChangeHistory record (for audit)
10. Notification sent if applicable
11. Return created member data
12. UI updates member list
13. Toast confirmation shown
```

### Search Flow

```
1. User types in search box (debounced 300ms)
2. GET /api/search/autocomplete?q=name
3. Name normalization (remove diacritics)
4. Database query on fullNameAr/fullNameEn
5. Fuzzy matching applied
6. Top 10 results returned
7. Typeahead dropdown renders
8. User selects a result
9. Navigate to /member/[id]
10. Member detail page loads
```

---

## 8. METADATA MODEL

### Audit & Versioning

**ChangeHistory Model:**
- memberId: Which record changed
- changedBy: User who made change
- changedAt: When change occurred
- fieldName: Which field changed
- oldValue: Previous value
- newValue: New value
- fullSnapshot: Complete JSON before change
- ipAddress: Source IP of change
- batchId: For bulk operations

**AuditLog Model:**
- userId: User performing action
- action: What action (CREATE, UPDATE, DELETE)
- resource: What resource (MEMBER, USER, SETTING)
- previousState: Before state (JSON)
- newState: After state (JSON)
- timestamp: When occurred
- severity: INFO/WARN/ERROR/CRITICAL

### Activity Tracking

**ActivityLog Model:**
- userId: Who
- activity: What (LOGIN, LOGOUT, MEMBER_VIEW, etc.)
- resourceId: What resource
- timestamp: When
- ipAddress: Source IP

---

## 9. INTERNATIONALIZATION ARCHITECTURE

### Language Support: Arabic (AR) + English (EN)

### Content Bilingualization

**Bilingual Fields in Models:**
- FamilyMember: fullNameAr, fullNameEn
- FamilyJournal: titleAr/contentAr, titleEn/contentEn
- Notification: titleAr/messageAr, titleEn/messageEn
- Permission: labelAr, labelEn
- SiteSettings: siteNameAr, siteNameEn

### UI Direction (RTL/LTR)

- **Arabic (AR):** Right-to-Left direction
- **English (EN):** Left-to-Right direction

**CSS Variables for Direction:**
```css
--text-align-start: start; (becomes "right" in AR, "left" in EN)
--text-align-end: end;
--margin-start: 1rem; (becomes "margin-right" in AR)
--margin-end: 0;
--flex-direction: row; (no change needed, Flexbox handles)
```

### Component RTL Support

**Tailwind CSS RTL:**
- Automatic flex-direction reversal
- Padding/margin direction swapping
- Text alignment reversing
- Icon mirroring (for directional icons)

**Manual RTL Handling:**
- Use Tailwind's `dir` variant
- Example: `pr-4 rtl:pl-4 rtl:pr-0` (padding-right in LTR, padding-left in RTL)

### Name Normalization & Matching

**Arabic Name Processing:**
- Remove diacritics (شكل / TASHKEEL)
- Normalize hamza variants: ء → ا/أ/إ
- Remove extra whitespace
- Standardize character encoding (UTF-8)

**Matching Algorithm:**
1. Normalize both names
2. Split into words/bigrams
3. Compare bigrams for similarity
4. Score from 0-1
5. Return matches > 0.75 threshold

### Translation Management

**Hardcoded Translations:**
- Stored in models (labelAr/labelEn)
- Fetch from database on app startup
- Cache in context

**UI Text:**
- Translation keys in components
- Lookup from translation object
- Fallback to English if not found

### Date Formatting

- **Arabic:** Day name + date + month name + year
- **English:** Standard format (MM/DD/YYYY)
- **Islamic Calendar:** Optional feature for Arabic view

---

## Appendix: Future Enhancements

1. **Multi-language Support:** Add French, Urdu, etc.
2. **Regional Settings:** Currency, date formats per region
3. **Advanced Permissions:** Field-level encryption per role
4. **Dynamic Content:** Load translations from external service
5. **Progressive Web App:** Offline support for search/browse

---

**End of Information Architecture v3.0**
