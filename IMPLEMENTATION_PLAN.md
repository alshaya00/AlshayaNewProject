# Al-Shaya Family Tree App - Implementation Plan

## Current State Summary

### What's DONE (Real Implementation)
- **Auth system** - Login, register, logout, password reset, session management (full Prisma/DB integration)
- **Auth middleware** - requireAuth, requireRole, requireAdmin
- **Member CRUD API** - GET/POST/PUT/DELETE with pagination, filtering, audit trails
- **Search API** - Basic + autocomplete with Arabic text normalization
- **Add Member page** - Fully wired form
- **Auth pages** - Login, register, forgot password (all functional)
- **App layout** - Sidebar, TopNav, protected routes
- **UI component library** - 35 components (20 primitives + 15 composite)
- **Prisma schema** - 53 models fully defined
- **Validation schemas** - Zod schemas for auth + members
- **Utility functions** - Arabic normalization, date formatting, class merging

### What's STUB/PLACEHOLDER
- Dashboard page (stats hardcoded to "0")
- Admin dashboard (empty audit logs, hardcoded stats)
- Member profile page (layout only, no data loading)
- Search page (form exists, not wired to API)
- Family tree visualization (empty, no D3 rendering)

### What's NOT BUILT
- Gallery / Albums pages
- Journals / Stories pages
- Events / Gatherings pages
- Broadcasts / Announcements pages
- User profile & settings pages
- Help / FAQ pages
- Email service integration
- Most admin API routes (users, settings, reports, import/export)
- Admin sub-pages (user management, settings, reports, etc.)

---

## Implementation Plan (Phases)

### Phase 1: Wire Up Existing Pages (Priority: HIGH)

**1.1 Dashboard - Connect to Real Data**
- Create `GET /api/dashboard/stats` - query member count, user count, recent activity
- Update dashboard page to fetch and display real stats
- Add recent activity feed from ActivityLog table

**1.2 Search Page - Wire to API**
- Connect search form to `GET /api/search` endpoint
- Display results using MemberCard component
- Add pagination to results
- Wire gender/status filter dropdowns

**1.3 Member Profile Page - Load Real Data**
- Fetch member data from `GET /api/members/[id]`
- Populate Overview tab (all member fields)
- Populate Relations tab (father, children)
- Add edit functionality linking to edit form
- Wire Photos and Journals tabs (empty state for now)

**1.4 Admin Dashboard - Real Stats**
- Create `GET /api/admin/stats` - total members, users, pending requests, recent audit logs
- Create `GET /api/admin/audit-logs` - paginated audit log list
- Wire admin dashboard to real data

### Phase 2: Core Missing Pages (Priority: HIGH)

**2.1 Member Edit Page** (`/member/[id]/edit`)
- Pre-populated form from member data
- PUT to `/api/members/[id]`
- Change history tracked automatically

**2.2 User Profile Page** (`/profile`)
- Display current user info
- Edit profile form (name, contact)
- Change password form
- Session management (view active sessions)

**2.3 User Settings Page** (`/settings`)
- Language preference (AR/EN)
- Theme preference (dark/light)
- Notification preferences
- Privacy settings

**2.4 Family Tree Visualization** (`/tree`)
- D3.js tree rendering component
- Fetch family members with parent-child relationships
- Create `GET /api/tree` endpoint - returns tree-structured data
- Implement zoom, pan, click-to-view-member
- Support ancestor and descendant views

### Phase 3: Content Features (Priority: MEDIUM)

**3.1 Gallery / Albums**
- `GET/POST /api/albums` - list and create album folders
- `GET/POST /api/albums/[id]/photos` - manage photos in albums
- Gallery page with album grid view
- Photo upload with FileUpload component
- Image approval workflow (PendingImage model)

**3.2 Family Journals**
- `GET/POST /api/journals` - list and create journal entries
- `GET/PUT/DELETE /api/journals/[id]` - manage individual journals
- Journal list page with categories
- Journal editor (rich text or markdown)
- Media attachments support

**3.3 Events / Gatherings**
- `GET/POST /api/events` - list and create gatherings
- `GET /api/events/[id]` - event details with attendees
- `POST /api/events/[id]/rsvp` - RSVP endpoint
- Events list page with calendar view
- Event detail page with RSVP buttons
- Attendance tracking

**3.4 Broadcasts / Announcements**
- `GET/POST /api/broadcasts` - list and create broadcasts
- Broadcasts list page
- Compose broadcast form (admin only)
- Recipient selection

### Phase 4: Admin Features (Priority: MEDIUM)

**4.1 Admin User Management**
- `GET /api/admin/users` - paginated user list
- `PUT /api/admin/users/[id]` - update user role/status
- `DELETE /api/admin/users/[id]` - suspend/deactivate user
- Admin users list page with DataTable
- User edit/detail page

**4.2 Admin Member Tools**
- Bulk member operations (status change, delete)
- Orphan detection page (members without parents)
- Duplicate detection and merge UI
- Data repair tools

**4.3 Admin Settings**
- `GET/PUT /api/admin/settings` - site settings CRUD
- Site settings page (site name, registration policy, etc.)
- Privacy settings management
- Feature flags management

**4.4 Admin Reports**
- Member statistics (by generation, gender, status)
- User activity reports
- Growth trends
- Export to CSV

**4.5 Data Import/Export**
- `POST /api/admin/import` - CSV/Excel member import
- `GET /api/admin/export` - data export
- Import page with file upload and field mapping
- Export page with format/field selection

### Phase 5: Communications (Priority: MEDIUM)

**5.1 Email Service Integration**
- Integrate Resend or similar email provider
- Password reset email sending
- Email verification flow
- Welcome email on registration

**5.2 Notifications System**
- `GET /api/notifications` - user notifications
- `PUT /api/notifications/[id]/read` - mark as read
- Notification bell in TopNav with badge count
- Notification dropdown/page

**5.3 Invitation System**
- `POST /api/invites` - create invitation
- Invitation code generation and redemption
- Invite management page

### Phase 6: Security Hardening (Priority: HIGH but parallel)

**6.1 Critical Fixes**
- Fix X-Frame-Options (set to DENY)
- Hash admin access codes (not plaintext)
- Remove hardcoded default passwords
- Hash session tokens
- Encrypt TOTP secrets and backup codes

**6.2 Rate Limiting**
- Add rate limiting to auth endpoints
- Add rate limiting to search endpoints

**6.3 CSRF Protection**
- Add CSRF token generation and validation
- Include in all form submissions

**6.4 Input Sanitization**
- Sanitize all user inputs against XSS
- Validate file uploads (type, size)

### Phase 7: Testing (Priority: HIGH but parallel)

**7.1 Unit Tests**
- Auth utility functions
- Validation schemas
- Arabic text normalization
- Member ID generation

**7.2 API Integration Tests**
- Auth flow (register → login → access → logout)
- Member CRUD operations
- Search functionality
- Admin operations

**7.3 Component Tests**
- Form components
- Data table
- Navigation components

**7.4 E2E Tests**
- User registration flow
- Member management flow
- Search flow
- Admin workflow

### Phase 8: Polish & Production (Priority: LOW)

- Help/FAQ pages
- Comprehensive error pages (404, 500)
- Loading skeletons for all pages
- Progressive Web App (PWA) support
- Performance optimization (caching, lazy loading)
- Database migrations and seeding
- Docker containerization
- CI/CD pipeline
- Production deployment configuration

---

## Recommended Implementation Order

1. **Phase 1** (Wire existing pages) - Immediate, highest ROI
2. **Phase 6** (Security) - Start in parallel
3. **Phase 2** (Core missing pages) - After Phase 1
4. **Phase 4.1** (Admin user management) - Needed for operations
5. **Phase 3** (Content features) - Core user value
6. **Phase 5** (Communications) - Enables full workflows
7. **Phase 7** (Testing) - Ongoing throughout
8. **Phase 4.2-4.5** (Remaining admin) - As needed
9. **Phase 8** (Polish) - Pre-launch
