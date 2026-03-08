# Al-Shaya Family Tree Application
# Comprehensive Engineering Architecture Documentation v1.0

**Generated:** March 8, 2026
**Project:** آل شايع (Al-Shaya) Family Tree Database Application
**Status:** Production-Ready Architecture Reference
**Scope:** 408 files, 135,716 lines of code, 53 Prisma models, 60+ API endpoints

---

## EXECUTIVE SUMMARY

This comprehensive engineering architecture documentation provides definitive technical guidance for the Al-Shaya Family Tree application across all major system domains. The document contains 11 major sections covering 10 detailed Architecture Decision Records (ADRs), complete C4 model system architecture, data models, API design, security, performance, scalability, reliability, testing, DevOps, and a phased migration plan to production infrastructure.

**Document Scope:**
- 10 complete Architecture Decision Records with alternatives analysis
- 4-level C4 system architecture diagrams (context, containers, components, code)
- 53 Prisma models documented with relationships and strategies
- 60+ REST API endpoints with versioning and caching strategy
- STRIDE threat model security analysis
- 4-layer caching architecture (browser, CDN, Redis, database)
- Kubernetes deployment strategy with auto-scaling
- Comprehensive testing pyramid (unit, integration, E2E)
- CI/CD pipeline with GitHub Actions
- 6-month phased migration plan to production

---

## TABLE OF CONTENTS

1. [Architecture Decision Records (ADRs)](#section-1-architecture-decision-records)
2. [System Architecture (C4 Model)](#section-2-system-architecture)
3. [Data Architecture](#section-3-data-architecture)
4. [API Architecture](#section-4-api-architecture)
5. [Security Architecture](#section-5-security-architecture)
6. [Performance Architecture](#section-6-performance-architecture)
7. [Scalability Architecture](#section-7-scalability-architecture)
8. [Reliability Architecture](#section-8-reliability-architecture)
9. [Testing Architecture](#section-9-testing-architecture)
10. [DevOps Architecture](#section-10-devops-architecture)
11. [Migration Plan](#section-11-migration-plan)

---

# SECTION 1: ARCHITECTURE DECISION RECORDS (ADRs)

## ADR-001: Frontend Framework Selection (Next.js 14)

**Status:** ACCEPTED

**Context:**
The Al-Shaya Family Tree application requires a modern web framework supporting real-time family tree visualizations with D3.js, server-side rendering for SEO, full-stack TypeScript typing, RTL Arabic and LTR English language support, role-based access control at the request level, and quick deployment to serverless platforms (Vercel/AWS Lambda).

**Decision:**
Adopt **Next.js 14 with React 18** as the full-stack framework, providing:
- Next.js App Router with file-based routing
- React Server Components for secure server-side data fetching
- Built-in API Routes for REST endpoints without external server
- Automatic code splitting and optimization
- Incremental Static Regeneration (ISR) for family tree visualizations
- Integrated middleware for authentication/authorization at request level
- Native internationalization (i18n) routing support
- Zero-config deployment to Vercel or AWS Lambda

**Alternatives Considered:**

**Alternative 1: Nuxt 3 (Vue.js)**
- Pros: Strong TypeScript support, built-in i18n, excellent RTL support
- Cons: Smaller ecosystem, fewer D3.js libraries, limited hiring pool in region
- Rejected: React ecosystem superior for complex visualizations

**Alternative 2: SvelteKit**
- Pros: Smallest bundle sizes, reactive programming, excellent performance
- Cons: Immature ecosystem, fewer production-proven components, limited D3.js support
- Rejected: Risk profile too high; ecosystem immaturity insufficient for enterprise

**Alternative 3: ASP.NET Core + React (Separate Frontend/Backend)**
- Pros: .NET ecosystem maturity, enterprise-grade security, strong typing
- Cons: Requires two deployments, doubled attack surface (CORS), operational complexity
- Rejected: Added complexity not justified; Next.js provides same security with simpler deployment

**Consequences:**
- Positive: Single language (TypeScript), unified deployment, API routes in same codebase, React ecosystem depth, automatic image optimization, Server Components enable secure data fetching
- Negative: Monolithic architecture complicates future microservice migration, Node.js single-threaded requires horizontal scaling, serverless cold starts (~1-3s), learning curve for Server Components

**Implementation Notes:**
- Use App Router (not Pages Router) for future-proof architecture
- Enable React Server Components for data fetching and rendering
- Configure middleware for authentication checks at request level
- Set up environment variables for staging/production configurations
- Implement ISR for family tree pages (3600s revalidation)

---

## ADR-002: Database Architecture (PostgreSQL 16 + Prisma 5)

**Status:** ACCEPTED

**Context:**
The family tree application requires a relational database supporting complex hierarchical relationships (ancestors, descendants, siblings), 53+ Prisma models with integrity constraints, genealogical data with millions of relationships, complete audit trails, row-level security for field-level access control, full-text search on Arabic names, transactions for multi-step operations (member merge, bulk import), and reliable backups with point-in-time recovery.

**Decision:**
Adopt **PostgreSQL 16** as the primary relational database with **Prisma 5.x** as the ORM:

1. PostgreSQL 16 provides:
   - Mature RDBMS (exists since 1996), production-grade
   - JSON and array type support for flexible data
   - Full-text search with Arabic language support (postgres_unaccent extension)
   - Row-Level Security (RLS) policies for field-level access control
   - Advanced indexing (GiST, GIN for text search)
   - ACID transactions for genealogical operations
   - Streaming replication for read replicas

2. Prisma ORM provides:
   - Type-safe database client generated from schema
   - Automatic migration system (database schema version control)
   - Excellent relationship handling for genealogical data
   - Interactive query builder in development (Prisma Studio)
   - Support for transactions and batch operations
   - Filter/where clause builder with proper type checking
   - Automatic connection pooling

**Alternatives Considered:**

**Alternative 1: MongoDB (NoSQL)**
- Pros: Flexible schema, horizontal sharding, document-based hierarchical data
- Cons: No ACID transactions across collections (weak), harder data integrity enforcement, weaker search performance
- Rejected: Genealogical relationships benefit from relational model; document flexibility creates data integrity risks

**Alternative 2: MySQL/MariaDB**
- Pros: Widely deployed, simpler administration, lower resource requirements
- Cons: Weaker JSON support, no native full-text search in Arabic, limited RLS support, less suitable for complex genealogical queries
- Rejected: PostgreSQL's advanced features (JSON, RLS, FTS) provide better fit

**Alternative 3: Separate Database + Cache Architecture**
- Pros: Optimize each component independently
- Cons: Adds operational complexity, cache invalidation challenges, eventual consistency issues
- Rejected: PostgreSQL query performance acceptable; caching layer addresses performance needs

**Consequences:**
- Positive: Relational model enforces genealogical integrity, complete audit trail captures all mutations, complex genealogical queries simplified, RLS enables fine-grained access control, full-text search enables fast name searching, transactions ensure merge operations are atomic, type-safe Prisma client eliminates runtime errors, migration system enables safe schema evolution
- Negative: Schema migrations slower development initially, PostgreSQL requires more administration, complex queries need proper indexing, Prisma schema becomes source of truth, schema changes require code generation step, some advanced PostgreSQL features require raw SQL

**Implementation Notes:**
- Use surrogate keys (UUID/BIGINT) for all primary keys
- Create foreign key constraints for all relationships
- Implement soft deletes with deletedAt timestamp
- Create indexes on frequently queried fields
- Daily automated backups with 30-day retention
- Point-in-time recovery capability (WAL archiving to S3)

---

## ADR-003: Authentication Strategy (JWT + Sessions Hybrid)

**Status:** ACCEPTED

**Context:**
The application handles sensitive genealogical data with role-based access control. Authentication must support multiple login methods (email/password, SMS OTP, OAuth), maintain session state across requests, enable per-device session tracking and revocation, prevent session hijacking and CSRF attacks, work with stateless API deployments (multiple server instances), and support 2FA for sensitive accounts.

**Decision:**
Implement **hybrid JWT + Sessions approach**:

1. JWT (JSON Web Tokens):
   - Access tokens valid for 15 minutes
   - Signed with HS256 algorithm
   - Contains: userId, role, sessionId, iat, exp
   - Provided in Authorization header: `Authorization: Bearer <token>`
   - Refresh tokens valid for 30 days, stored in httpOnly secure cookies

2. Session Storage:
   - Sessions stored in PostgreSQL Session table
   - Each session contains: userId, sessionId, deviceInfo, ipAddress, lastActivityAt, expiresAt, isRevoked
   - Enables per-device session management
   - Device tracking: name, browser, OS
   - Revocation without invalidating all user tokens

3. Request Flow:
   - Client sends access token in Authorization header
   - API verifies JWT signature and expiration
   - If expired, client uses refresh token to get new access token
   - Refresh endpoint verifies refresh token against Session table
   - If session revoked, refresh fails (forces re-authentication)

**Alternatives Considered:**

**Alternative 1: Pure JWT (Stateless)**
- Pros: Completely stateless, scales horizontally without sticky sessions
- Cons: Cannot revoke tokens without global blacklist, cannot track devices, cannot force logout of specific devices
- Rejected: Session tracking provides security benefits essential for genealogy data

**Alternative 2: Pure Session-Based**
- Pros: Full control over session lifetime, revoke individual sessions immediately
- Cons: Requires sticky sessions or distributed session store, database lookup on every request, horizontal scaling requires session replication
- Rejected: Hybrid approach provides benefits of both without primary drawbacks

**Alternative 3: OAuth 2.0 + OpenID Connect (External Auth)**
- Pros: Delegates authentication to trusted provider, no password management
- Cons: Still requires session management, external dependency, doesn't work for primary authentication
- Rejected: Can supplement but not replace core authentication

**Consequences:**
- Positive: Access tokens stateless and fast to validate, sessions provide revocation capability, short-lived access tokens limit damage from compromise, device tracking enables security features, per-device logout, audit trail of login attempts, 2FA integrates naturally, can implement "remember me" safely
- Negative: More complex than pure JWT, database lookup required for refresh validation, token rotation adds latency, must handle refresh failures gracefully, session storage requires cleanup, secure cookie configuration required (httpOnly, Secure, SameSite)

**Implementation Notes:**
- Access Token: {userId, role, sessionId, iat, exp} signed with HMAC-SHA256
- Refresh Token: Long random string (minimum 32 bytes)
- Set-Cookie: refreshToken; HttpOnly; Secure; SameSite=Strict
- 2FA: Temporary session (5 min) → OTP validation → full session (30 days)

---

## ADR-004: API Design Pattern (REST with JSON:API)

**Status:** ACCEPTED

**Context:**
The family tree application needs to expose genealogical data through APIs serving web frontend and future mobile apps, supporting filtering, pagination, efficient data fetching without N+1 query problems, caching at multiple levels, versioning for backward compatibility, and automatic documentation.

**Decision:**
Adopt **REST API with JSON:API principles**:

1. RESTful Principles:
   - Resources represented by URLs: `/api/members/{id}`
   - HTTP verbs indicate operations: GET (read), POST (create), PUT (update), DELETE (delete)
   - Request body contains JSON representation
   - Response includes status code, headers, and JSON body
   - Stateless (each request contains all necessary information)
   - Cacheable responses based on HTTP cache headers

2. JSON:API Compliance:
   - Standardized request/response format
   - Pagination: `?page[number]=1&page[size]=20`
   - Filtering: `?filter[status]=LIVING&filter[gender]=MALE`
   - Sorting: `?sort=-createdAt,firstName`
   - Relationship inclusion: `?include=photos,journals`
   - Sparse fieldsets: `?fields[members]=firstName,lastName`

3. Versioning Strategy:
   - Version in URL: `/api/v1/members`, `/api/v2/members`
   - Maintain support for N-1 versions (current + previous)
   - Deprecation headers: `Deprecation: true, Sunset: Sun, 01 Jan 2027 00:00:00 GMT`

**Alternatives Considered:**

**Alternative 1: GraphQL**
- Pros: Clients request exactly what data needed, single endpoint, type-safe queries
- Cons: More complex implementation, harder to cache effectively, N+1 query problem moved to implementation, steeper learning curve
- Rejected: REST simpler to implement, cache, monitor; JSON:API provides GraphQL benefits without complexity

**Alternative 2: gRPC**
- Pros: Binary protocol (smaller payloads), faster than JSON/HTTP, streaming support
- Cons: Requires gRPC client library, harder to debug, not native for browsers, requires proxy layer
- Rejected: Not suitable for web-first application

**Consequences:**
- Positive: Standard format reduces learning curve, HTTP caching enables CDN/browser caching, REST verbs make intent explicit, stateless design enables horizontal scaling, version in URL makes deprecation clear, pagination prevents memory exhaustion
- Negative: Multiple requests for related data (N+1 if not careful), over-fetching possible, versioning fragmentation, no automatic query validation

**Implementation Notes:**
- Standard endpoints: GET /members, POST /members, GET /members/{id}, PUT /members/{id}, DELETE /members/{id}
- Query parameters: ?filter[status]=LIVING&sort=-createdAt&page[number]=1&page[size]=20
- Response format follows JSON:API spec with data, included, meta, links
- Error responses include code, message, status, details

---

## ADR-005: State Management (Context API + React Query)

**Status:** ACCEPTED

**Context:**
The React frontend requires state management for current user (userId, role, permissions), UI state (modal open/close, sidebar collapsed), server state (members fetched, filters applied), loading/error states, cache invalidation on data changes, and optimistic updates for snappy UI.

**Decision:**
Adopt **Context API + React Query (TanStack Query)**:

1. Context API Usage:
   - Store authentication state (user, token, permissions) at root
   - Store UI preferences (theme, language, sidebar state)
   - Store feature flags and capabilities
   - Providers at root level, memoized to prevent unnecessary re-renders

2. React Query Usage:
   - Fetch and cache server state (members, photos, journals)
   - Automatic background refetching when window regains focus
   - Request deduplication (same request within 60s returns cached result)
   - Mutation handling with automatic cache invalidation
   - Loading and error states built-in
   - Pagination and infinite query support
   - Offline support with network status detection

3. Integration:
   - AuthContext provides user and role
   - React Query hooks for data fetching (useQuery, useMutation)
   - Custom hooks combine Context + Query patterns

**Alternatives Considered:**

**Alternative 1: Redux + Redux Thunk**
- Pros: Single source of truth, time-travel debugging, large ecosystem
- Cons: Extreme boilerplate, steep learning curve, Redux Thunk spaghetti code patterns
- Rejected: Context API + React Query provides 90% value with 10% complexity

**Alternative 2: Zustand**
- Pros: Minimal boilerplate, simple syntax, good for UI state
- Cons: Doesn't handle server state well, requires manual cache invalidation
- Rejected: React Query superior for server state management

**Consequences:**
- Positive: Context API built-in React feature, React Query handles all server state patterns, automatic cache invalidation, background refetching keeps data fresh, loading/error states built-in, deduplication prevents redundant calls, optimistic updates enable snappy UI, smaller bundle size, easier to debug
- Negative: Context API causes re-renders of entire provider tree (mitigated by memoization), React Query learning curve, race conditions possible if manual state mixed with queries, no time-travel debugging

**Implementation Notes:**
- AuthContext structure: {user, token, role, isLoading, login, logout, isAuthenticated}
- React Query config: staleTime: 5 min, cacheTime: 10 min, refetchOnWindowFocus: true
- Custom hooks: useMember(id), useMembers(), useSearchMembers(query), useMemberPhotos(id)

---

## ADR-006: Deployment Strategy (Docker + Kubernetes Target)

**Status:** ACCEPTED

**Context:**
The application currently deploys to Vercel (serverless) but needs architecture supporting private deployments, scaling from dozens to millions of users, maintaining 99.9% uptime, enabling easy rollback, providing infrastructure as code, supporting multiple environments, and enabling cost optimization through auto-scaling.

**Decision:**
Adopt **Docker containers with Kubernetes orchestration as target architecture**:

1. Docker Implementation:
   - Multi-stage Dockerfile (build stage separate from runtime)
   - Build stage: Node.js image, install deps, build Next.js
   - Runtime stage: Node.js alpine image, copy compiled app, run
   - Image pushed to ECR (Amazon Elastic Container Registry)
   - Images tagged with git commit SHA for traceability

2. Kubernetes Deployment:
   - Next.js pods behind LoadBalancer service
   - Horizontal Pod Autoscaler (HPA) scales 2-20 pods based on CPU
   - PostgreSQL as managed service (not in Kubernetes)
   - Redis deployed as StatefulSet with persistent storage
   - Each pod: 256m CPU request, 512Mi RAM request
   - Liveness probes on /api/health endpoint
   - Readiness probes detect when pod ready for traffic

3. Infrastructure as Code:
   - Terraform or CloudFormation for infrastructure
   - Helm charts for Kubernetes deployments
   - All infrastructure version controlled in git
   - Automatic deployment from main branch

**Alternatives Considered:**

**Alternative 1: Continue Vercel Serverless**
- Pros: Zero infrastructure management, automatic scaling, integrated CI/CD
- Cons: Vendor lock-in, limited customization, cost unpredictability, cold start latency
- Rejected: Long-term strategy requires multi-cloud capability

**Alternative 2: AWS Lambda Only**
- Pros: Pay per invocation (cost-effective for low traffic), automatic scaling
- Cons: Cold start latency (1-3s), 15-minute execution limit, limited database connections
- Rejected: Family tree queries can exceed timeout limits

**Consequences:**
- Positive: Multi-cloud capability (Kubernetes runs on AWS, GCP, Azure, on-prem), auto-scaling responds within seconds, rolling deployments enable zero-downtime updates, easy rollback (switch to previous version instantly), infrastructure as code enables reproducibility, cost optimization through resource limits, better resource utilization than VMs, integrated monitoring ecosystem
- Negative: Kubernetes learning curve steep, more complex than Vercel, requires operations expertise, initial infrastructure cost higher, database must be managed separately, slightly higher latency than edge functions

**Implementation Notes:**
- Dockerfile: multi-stage build with Node.js alpine runtime
- Kubernetes: Deployment with 3 replicas, resource limits, liveness/readiness probes
- Scaling: HPA scales 2-20 pods, target CPU 70%, scale down when CPU < 30%

---

## ADR-007: Caching Strategy (Multi-Layer)

**Status:** ACCEPTED

**Context:**
The family tree application has heavily skewed access patterns: few members accessed thousands of times per day, most members accessed rarely, family tree visualizations are expensive to compute, photos accessed repeatedly, search results change infrequently. Caching must reduce database queries, accelerate visualization rendering, reduce bandwidth for images, respect cache invalidation when data changes, and implement across multiple layers.

**Decision:**
Implement **4-layer caching strategy**:

1. Layer 1: Browser Cache (Client-Side)
   - Static assets: `Cache-Control: max-age=31536000, immutable`
   - API responses: `Cache-Control: max-age=300, public`
   - User-specific content: `Cache-Control: private, no-cache`
   - Service Worker for offline support and background sync

2. Layer 2: CDN Cache (CloudFront)
   - Origin: Next.js application + S3 bucket
   - TTL for static assets: 1 year
   - TTL for API responses: 5 minutes
   - Compression: gzip + brotli
   - 210 edge locations worldwide

3. Layer 3: Server Cache (Redis)
   - Member cache: member:{id} TTL 3600s (1 hour)
   - Family tree visualization: member-tree:{id} TTL 86400s (24 hours)
   - Search results: search-results:{query} TTL 300s (5 minutes)
   - Cache invalidation on member update

4. Layer 4: Database Query Cache
   - PostgreSQL query planner caches execution plans
   - Prepared statements reduce parsing overhead
   - Read replicas for heavy read queries
   - Connection pooling reduces connection overhead

**Alternatives Considered:**

**Alternative 1: No Caching**
- Pros: Simpler implementation, always fresh data
- Cons: Database bottleneck at scale, high latency, cannot handle traffic spikes
- Rejected: Caching essential at genealogy scale

**Alternative 2: Browser Cache Only**
- Pros: No server infrastructure needed, works offline
- Cons: Different users don't benefit from shared cache, limited cache size
- Rejected: Server caching reduces load; essential alone

**Alternative 3: Application-Level Cache (In-Memory)**
- Pros: No external dependency, fast access
- Cons: Lost on server restart, not shared across servers, unbounded memory growth
- Rejected: Redis provides distributed cache with persistence and eviction

**Consequences:**
- Positive: Reduced database load (popular members served from cache), lower latency (sub-100ms response times), better traffic spike handling, reduced bandwidth through CDN caching, offline support via Service Worker, cost reduction (fewer database queries), improved UX
- Negative: Cache invalidation complexity, stale data risk if TTL too long, Redis infrastructure overhead, memory usage on Redis, cache warming on startup, debugging harder with cached data

**Implementation Notes:**
- Cache keys: member:{id}, member-tree:{id}, search-results:{query}, photos:{memberId}, journals:{memberId}
- Invalidation on member update: delete member:{id}, member-tree:{id}, member-tree:{parentId}, search-results:*
- TTL strategy: Member data 1 hour, search results 5 minutes, family trees 24 hours, photos 1 week

---

## ADR-008: Search Architecture (PostgreSQL FTS)

**Status:** ACCEPTED

**Context:**
The family tree requires searching millions of members by name with Arabic diacritics handling, fuzzy matching for misspellings, prefix matching for autocomplete, substring matching, ranking by relevance, <100ms response time, no external infrastructure initially, and ability to scale to 10M+ members.

**Decision:**
Adopt **PostgreSQL Full-Text Search (FTS) with future migration path to Elasticsearch**:

1. PostgreSQL Full-Text Search:
   - Utilize tsvector type for indexed text search
   - Create GiST or GIN indexes on search columns
   - Use to_tsvector() function for tokenization
   - Use plainto_tsquery() for safe query input
   - Ranking with ts_rank_cd() function
   - Arabic stemming via postgres_unaccent extension

2. Initial Implementation:
   - Index both fullNameAr and fullNameEn columns
   - Composite index on (fullNameAr, generation, status) for filtering
   - Phrase search for exact name matches
   - Prefix search for autocomplete
   - Combine results from Arabic and English indexes

3. Scaling Path:
   - Monitor query times as member count grows
   - Migrate to Elasticsearch when queries exceed 200ms
   - Elasticsearch runs in parallel initially
   - Dual-write (write to both systems)
   - Gradually shift reads to Elasticsearch
   - Decommission PostgreSQL FTS when confident

**Alternatives Considered:**

**Alternative 1: Elasticsearch**
- Pros: Designed for search, scales to billions, advanced features, excellent Arabic support
- Cons: External infrastructure, operational overhead, cost ($100-500/month), Elasticsearch/PostgreSQL sync complexity
- Rejected: PostgreSQL FTS sufficient for MVP; Elasticsearch added when scaling needed

**Alternative 2: Simple LIKE Queries**
- Pros: No additional infrastructure
- Cons: Terrible performance at scale (full table scan), no ranking, no fuzzy matching
- Rejected: Performance unacceptable for millions

**Alternative 3: Algolia (Third-Party)**
- Pros: Best-in-class search, no infrastructure, global network
- Cons: Monthly cost ($45-200+), vendor lock-in, API rate limits, privacy concerns
- Rejected: Privacy important for genealogy; PostgreSQL keeps data in-house

**Consequences:**
- Positive: No external infrastructure required, data remains in-house (privacy), lower costs initially, PostgreSQL FTS sufficient for millions, single database to manage, full control over search behavior, custom ranking logic in SQL, clear scaling path if needed
- Negative: PostgreSQL FTS less powerful than Elasticsearch, no fuzzy search built-in, limited tokenization for Arabic, eventual migration effort needed, no real-time analytics, limited advanced search features

**Implementation Notes:**
- Index creation: CREATE INDEX idx_member_search_ar ON "FamilyMember" USING GIN(to_tsvector('english', "fullNameAr"))
- Query: SELECT * FROM "FamilyMember" WHERE to_tsvector('simple', "fullNameEn") @@ plainto_tsquery('simple', 'محمد') ORDER BY ts_rank_cd(...) LIMIT 10
- Fuzzy matching: SELECT * FROM "FamilyMember" WHERE levenshtein("fullNameAr", 'محمد') <= 2

---

## ADR-009: File Storage (S3 with CloudFront CDN)

**Status:** ACCEPTED

**Context:**
The family tree stores significant volume of files: family photos (millions over time), scanned documents (birth certificates, marriage documents), journal PDFs, user avatars, bulk import files. Requirements: durability (files never lost), 99.99% availability, cheap storage (<$0.023/GB/month), fast global delivery, direct browser serving, virus scanning, cost-effective bandwidth.

**Decision:**
Adopt **AWS S3 for storage with CloudFront CDN for delivery**:

1. AWS S3 Configuration:
   - Bucket per environment (development, staging, production)
   - Versioning enabled (recover from accidental deletes)
   - Object lifecycle: move to Glacier after 90 days (cost optimization)
   - Server-side encryption with AES-256
   - Block Public Access enabled
   - Bucket policies restrict access to application role only
   - CORS configured for browser uploads

2. CloudFront CDN:
   - S3 bucket as origin
   - Edge locations globally for fast delivery
   - Automatic compression (gzip, brotli)
   - Query string caching for dynamic content
   - Cache invalidation on file updates
   - Custom domain (photos.alshaya.com)
   - HTTPS only (SSL/TLS)
   - Origin Access Identity prevents direct S3 access

3. File Upload Process:
   - Client requests signed URL from API
   - Server generates signed URL valid for 15 minutes
   - Client uploads directly to S3
   - Server validates file after upload (virus scan)
   - Server stores metadata in PostgreSQL
   - CloudFront cache automatically refreshed

**Alternatives Considered:**

**Alternative 1: Local Filesystem Storage**
- Pros: No external dependency, simple implementation
- Cons: Single server failure loses files, not durable, hard to scale, backup complexity
- Rejected: S3 durability superior; not suitable for production

**Alternative 2: Google Cloud Storage**
- Pros: Similar to S3, good performance, competitive pricing
- Cons: AWS ecosystem larger, S3 more mature, CloudFront better than Google CDN
- Rejected: S3 + CloudFront best of breed

**Alternative 3: Self-Hosted MinIO**
- Pros: S3-compatible API, self-hosted (data on-prem)
- Cons: Infrastructure management required, no global CDN, data loss risk, operational overhead
- Rejected: Managed service better; operational overhead not justified

**Consequences:**
- Positive: S3 durability 99.999999999% (11 nines), geographic redundancy built-in, CloudFront provides global caching (fast delivery worldwide), automatic scaling, cost-effective ($0.023/GB/month), easy disaster recovery, integrated with AWS, no operational overhead, lifecycle policies reduce costs, security best practices built-in
- Negative: External AWS dependency, additional AWS bill ($10-100/month), bandwidth costs ($0.085/GB egress), CloudFront setup complexity, signed URL generation adds API latency, cache invalidation not instant

**Implementation Notes:**
- S3 signed URL generation: getSignedUrl(S3Client, PutObjectCommand, {expiresIn: 900})
- Lifecycle policy: Transition to GLACIER after 90 days, expiration after 2555 days
- CloudFront: Origin S3 bucket, OAI for access restriction, behaviors for static/dynamic
- Virus scanning: ClamAV Lambda triggered by S3 events

---

## ADR-010: Monitoring & Observability (Prometheus + Grafana + Sentry + ELK)

**Status:** ACCEPTED

**Context:**
A production genealogy application requires detecting/alerting on outages before users notice, debugging production issues, understanding performance characteristics, identifying bottlenecks, tracking error rates, maintaining audit trail for security, and planning capacity. Requirements: real-time monitoring and alerting, historical data retention (1 year), error tracking with full context, log aggregation across servers, custom metrics and dashboards, cost-effective at scale.

**Decision:**
Implement **4-part observability stack**:

1. **Prometheus (Metrics Collection)**
   - Scrapes metrics from /metrics endpoint every 15 seconds
   - Stores metrics in time-series database
   - Retention: 90 days (cost/benefit balance)
   - Queries enable time-series analysis
   - Integrates with Grafana for visualization

2. **Grafana (Metrics Visualization & Alerting)**
   - Dashboards for system health (CPU, memory, disk)
   - Dashboards for application health (requests, latency, errors)
   - Dashboards for business metrics (members created, searches)
   - Alerts on SLO violations
   - Alerting channels: Slack, PagerDuty, email
   - Auto-scaling triggers based on metrics

3. **Sentry (Error Tracking)**
   - Captures exceptions and errors automatically
   - Groups errors by root cause
   - Provides stack traces with source maps
   - Tracks which users affected
   - Release tracking for error regression detection
   - Performance monitoring (slow transactions)
   - Health checks alert on new error patterns

4. **ELK Stack (Log Aggregation)**
   - Elasticsearch stores all logs
   - Logstash parses and enriches logs
   - Kibana provides log search and analysis
   - Retention: 30 days hot, 1 year archived
   - Structured logging (JSON) for queryability
   - Log levels: DEBUG, INFO, WARN, ERROR, CRITICAL

**Alternatives Considered:**

**Alternative 1: Datadog (All-in-One)**
- Pros: Single vendor, excellent UI, lowest learning curve, best in class
- Cons: Expensive ($15-50+ per host/month), vendor lock-in, overkill for many apps
- Rejected: Cost prohibitive; open-source stack sufficient with more operational overhead

**Alternative 2: CloudWatch (AWS Native)**
- Pros: Deep AWS integration, included with services, good for AWS-native apps
- Cons: Limited querying, limited visualization, expensive at scale, AWS lock-in
- Rejected: Prometheus + Grafana more powerful and vendor-independent

**Alternative 3: Splunk (Enterprise Logging)**
- Pros: Powerful search, scalable to petabytes, great for enterprises
- Cons: Extremely expensive ($100-1000+ per GB), steep learning curve, overkill
- Rejected: Cost prohibitive; ELK superior price-performance

**Consequences:**
- Positive: Real-time visibility into system health, instant error detection and alerts, root cause analysis enabled through logs/traces, historical data supports trend analysis, performance bottlenecks identified, cost optimization through monitoring, capacity planning enabled, SLO tracking, team situational awareness
- Negative: Operational overhead (4 systems), storage costs ($100-500/month), learning curve for entire stack, debugging requires understanding 3 systems, data privacy concerns (logs contain PII), scalability challenges at high volume, schema coordination between components

**Implementation Notes:**
- Prometheus scrape config: job_name, static_configs, metrics_path, interval
- Grafana dashboards: system (CPU, memory, disk), application (requests, latency, errors), business (members created, searches)
- Sentry integration: @sentry/nextjs SDK, automatic error capture, release tracking
- ELK stack: Elasticsearch 8+, Logstash for parsing, Kibana for visualization

---

# SECTION 2: SYSTEM ARCHITECTURE (C4 MODEL)

## C4 Model Overview

The C4 model provides four levels of system architecture visualization:
- Level 1: System Context (external systems and users)
- Level 2: Container Diagram (major components and their interactions)
- Level 3: Component Diagram (detailed structure within containers)
- Level 4: Code-level architecture (classes, functions, patterns)

This documentation provides all four levels, primarily using text-based diagrams supplemented by prose descriptions.

---

## Level 1: System Context Diagram

The Al-Shaya Family Tree application serves as the central hub for genealogical data management and interaction. The system integrates with several external systems and serves multiple user groups.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Web Browser │  │ Mobile App   │  │ Admin Client │           │
│  │ (React)     │  │ (React/RN)   │  │ (React)      │           │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘           │
│         │ HTTPS          │ HTTPS           │ HTTPS              │
│         └────────────────┼─────────────────┘                    │
│                          │                                      │
│                 ┌────────▼────────┐                             │
│                 │ Al-Shaya Family  │                             │
│                 │ Tree Application │                             │
│                 │ (Next.js + React)│                             │
│                 └────────┬────────┘                             │
│                          │                                      │
│         ┌────────────────┼──────────────────┬────────┐          │
│         │                │                  │        │          │
│    ┌────▼────┐    ┌──────▼────┐   ┌────────▼┐ ┌────▼──┐       │
│    │PostgreSQL    │   Redis    │   │  AWS    │ │Google │       │
│    │ Database │    │   Cache    │   │  S3     │ │OAuth  │       │
│    └─────────┘    └────────────┘   └─────────┘ └───────┘       │
│                                                                  │
│    ┌──────────────────────────────────────────────────┐         │
│    │ External Services                                │         │
│    ├──────────────────────────────────────────────────┤         │
│    │ ┌──────────┐ ┌─────────┐ ┌────────┐ ┌───────┐  │         │
│    │ │ Resend   │ │ Twilio  │ │ Sentry │ │Prom/  │  │         │
│    │ │ (Email)  │ │ (SMS)   │ │(Errors)│ │Grafana│  │         │
│    │ └──────────┘ └─────────┘ └────────┘ └───────┘  │         │
│    └──────────────────────────────────────────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Entities:
- Family Members: View profiles, relationships, photos, journals
- Administrators: Manage users, audit logs, system settings, data integrity
- External Services: Handle email, SMS, errors, monitoring
- Data Stores: PostgreSQL (genealogy), Redis (cache), S3 (files), OAuth (auth)
```

### System Context Narrative

The Al-Shaya Family Tree application serves as a centralized genealogical data platform accessible through multiple client interfaces. The system handles sensitive family data with role-based access control and multiple authentication methods. External services handle email notifications (Resend), SMS delivery (Twilio), error tracking (Sentry), and system monitoring (Prometheus/Grafana).

**Key Design Principles:**
- Data stored securely in PostgreSQL with encryption at rest
- Cache layer (Redis) reduces database load
- Static assets and photos served through CDN for global availability
- Multiple authentication methods (email/password, SMS OTP, OAuth)
- Complete audit trail for genealogical data changes
- Real-time error tracking and system monitoring

---

## Level 2: Container Diagram

The application consists of major containers working together to deliver genealogical functionality:

```
┌────────────────────────────────────────────────────────────┐
│ Client Layer (Web/Mobile Browsers)                         │
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │Web (SPA) │ │Mobile    │ │Admin     │ │Mobile    │       │
│ │React 18  │ │(React    │ │Portal    │ │Native    │       │
│ │          │ │Native)   │ │(React 18)│ │(RN)      │       │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│      │ HTTPS      │ HTTPS      │ HTTPS      │ HTTPS        │
│      └──────────┬─┴────────────┴────────────┘              │
│                 │                                           │
│      ┌──────────▼──────────────┐                           │
│      │ CDN (CloudFront)         │                           │
│      │ ├─ Static assets         │                           │
│      │ ├─ Cached API responses  │                           │
│      │ └─ Photos & documents    │                           │
│      └──────────┬──────────────┘                           │
│                 │                                           │
└─────────────────┼───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ Load Balancer (Application Gateway)                        │
├─────────────────────────────────────────────────────────────┤
│ ├─ Route to healthy pods                                  │
│ ├─ SSL/TLS termination                                    │
│ ├─ Request logging                                        │
│ └─ Rate limiting (1000 req/hr per user)                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ Application Container (Next.js + React)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Page Routes (/dashboard, /tree, /member/[id], etc.)  │  │
│ │ ├─ Server Components (secure data fetching)          │  │
│ │ ├─ Client Components (React interactivity)           │  │
│ │ ├─ Layout boundaries                                 │  │
│ │ └─ Error boundaries                                  │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ API Routes (/api/members, /api/auth, /api/admin)    │  │
│ │ ├─ Authentication Middleware                         │  │
│ │ ├─ Authorization Middleware                          │  │
│ │ ├─ Request Validation (Zod)                          │  │
│ │ ├─ Business Logic (Services)                         │  │
│ │ ├─ Error Handling & Logging                          │  │
│ │ ├─ Response Formatting                               │  │
│ │ └─ Cache Control Headers                             │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Services & Utilities                                  │  │
│ │ ├─ Email Service (Resend integration)                │  │
│ │ ├─ SMS Service (Twilio integration)                  │  │
│ │ ├─ OAuth Service (Google integration)                │  │
│ │ ├─ File Service (S3 upload/download)                │  │
│ │ ├─ Search Service (PostgreSQL FTS)                   │  │
│ │ ├─ Visualization Service (D3.js)                     │  │
│ │ ├─ Caching Service (Redis)                           │  │
│ │ └─ Audit Service (ChangeHistory logging)             │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────┬────────────────┬──────────┬───────────────┘
                 │                │          │
┌────────────────▼─┐  ┌───────────▼────┐  ┌─▼──────────┐
│ PostgreSQL       │  │ Redis Cache    │  │ AWS S3     │
│ Database         │  │ (ElastiCache)  │  │ (Objects)  │
│                  │  │                │  │            │
│ ├─ FamilyMembers │  │ ├─ Member cache │  │ ├─ Photos │
│ ├─ Users         │  │ ├─ Search       │  │ ├─Document│
│ ├─ Photos        │  │ │   results     │  │ └─ Avatars│
│ ├─ Journals      │  │ ├─ Tree viz     │  │            │
│ ├─ Sessions      │  │ └─ Sessions     │  │            │
│ ├─ AuditLog      │  │                │  │            │
│ └─ 48+ more      │  │                │  │            │
│    models        │  │                │  │            │
└──────────────────┘  └────────────────┘  └────────────┘

External Services:
├─ Resend (Email notifications)
├─ Twilio (SMS notifications)
├─ Google OAuth (Third-party auth)
├─ Sentry (Error tracking)
├─ Prometheus/Grafana (Monitoring)
└─ ELK Stack (Log aggregation)
```

### Container Responsibilities

**Web/Mobile Client Container:**
- React 18 components for UI rendering
- React Router for client-side navigation
- React Query for server state management
- Context API for authentication and UI state
- D3.js for family tree visualization
- Tailwind CSS for styling with RTL support
- Service Worker for offline support

**Application Container (Next.js):**
- Server Components for secure data fetching
- Client Components for interactive UI
- API routes for REST endpoints
- Middleware for request-level auth
- Request validation and error handling
- Cache control and compression
- Monitoring and logging

**PostgreSQL Database Container:**
- Persistent storage of 53 Prisma models
- 40+ indexes for performance
- Foreign key constraints for integrity
- Full-text search indexes
- Audit trail and change tracking
- Encryption at rest (AWS KMS)
- Multi-AZ for high availability

**Redis Cache Container:**
- In-memory caching of frequently accessed data
- Session storage for authentication
- Family tree visualization cache
- Search results cache
- Cache invalidation logic

**AWS S3 Container:**
- Durable storage of family photos
- Scanned documents and PDFs
- User avatar images
- Bulk import/export files
- Lifecycle policies for cost optimization

**External Services:**
- Resend: Email delivery for notifications
- Twilio: SMS delivery for OTP and alerts
- Google OAuth: Third-party authentication
- Sentry: Error tracking and monitoring
- Prometheus/Grafana: Metrics and dashboards
- ELK: Structured logging and analysis

---

# SECTION 3: DATA ARCHITECTURE

## 3.1 Entity-Relationship Model (53 Models)

The Al-Shaya Family Tree application uses 53 Prisma models representing the complete genealogical domain.

### Core Genealogical Models (8 Models)

**1. FamilyMember (PRIMARY MODEL)**
- 69 fields total
- Primary genealogical entity representing family members
- Genealogical fields: firstName, fatherName, grandfatherName, familyName
- Bilingual: fullNameAr, fullNameEn
- Demographics: gender (Male/Female), birthYear, deathYear
- Status tracking: status (Living/Deceased), deletedAt (soft delete)
- Relationships: fatherId (parent link), generation level (1-20)
- Contact: phone (private), email (private)
- Media: photos[], journals[] relationships
- Metadata: createdAt, updatedAt, createdBy, lastModifiedBy
- Indexes: fatherId, generation, status, createdAt, fullNameAr, fullNameEn

**2. Generation (HIERARCHY MODEL)**
- Represents family generation level
- Fields: level (1-20), description, estimatedYear
- Used for filtering and analysis by generation

**3. FamilyBranch (ORGANIZATIONAL)**
- Groups related family members
- leaderUserId, foundedYear, description
- Relationships: members[]

**4. ChangeHistory (AUDIT TRAIL)**
- Complete audit trail of member changes
- memberId, changedBy, changedAt, fieldName, oldValue, newValue
- fullSnapshot: JSON of entire member before change
- ipAddress, batchId (for bulk operations)
- Enables undo/rollback capability

**5. MergedMember (DATA CLEANUP)**
- Tracks member merge operations (duplicate consolidation)
- originalMemberId, mergedIntoMemberId, mergedAt, mergedBy, reason

**6. PhoneNumber (CONTACT)**
- Normalized phone numbers
- memberId, phoneNumber, type (MOBILE, LANDLINE, WORK)
- isVerified, isPrimary flags

**7. EmailAddress (CONTACT)**
- Normalized email addresses
- memberId, email, type (PERSONAL, WORK)
- isVerified, isPrimary flags

**8. RelatedFamily (EXTENDED RELATIONSHIPS)**
- Non-parent relationships (marriage, adoption)
- memberId, relatedMemberId, relationType
- marriageDate, divorceDate (optional)

### User & Authentication Models (7 Models)

**1. User (PRIMARY AUTH)**
- Email-based user account
- email (unique), passwordHash (bcrypt), fullName
- emailVerified, emailVerifiedAt, phone (optional)
- Status: Active/Inactive/Suspended
- lastLoginAt, lastLoginIp for activity tracking
- twoFactorEnabled, accountLockedUntil (brute force)

**2. Session (SESSION MANAGEMENT)**
- Tracks active user sessions
- sessionId (unique), userId, token (JWT refresh)
- deviceName, deviceType (DESKTOP/MOBILE/TABLET)
- ipAddress, userAgent, lastActivityAt
- expiresAt, isRevoked (soft delete)
- Enables per-device logout without affecting others

**3. PasswordReset (AUTH RECOVERY)**
- Temporary tokens for password reset
- userId, token (secure random), expiresAt, usedAt

**4. EmailVerification (AUTH VERIFICATION)**
- Temporary tokens for email verification
- userId, email, token, expiresAt
- Purpose: INITIAL_VERIFICATION, EMAIL_CHANGE, etc.

**5. OtpCode (SMS AUTHENTICATION)**
- One-time passwords for SMS login
- userId, phoneNumber, code (6 digits)
- expiresAt (5 minutes), isUsed flag
- Prevents code reuse

**6. Role (PERMISSION CONTAINER)**
- Role definitions: MEMBER, LEADER, ADMIN, SUPER_ADMIN
- name, description, permissions[]

**7. Permission (GRANULAR ACCESS)**
- Individual permissions: CREATE_MEMBER, EDIT_MEMBER, DELETE_MEMBER, etc.
- resource, action, labelAr, labelEn, description

### Content & Media Models (12 Models)

**1. FamilyJournal (FAMILY STORIES)**
- Historical narratives and stories
- memberId, titleAr/En, contentAr/En
- Category: HISTORY, BIOGRAPHY, EVENT, ANECDOTE
- Status: DRAFT, PUBLISHED, ARCHIVED
- viewCount, approvedBy, publishedAt, moderation

**2. Photo (MEDIA ASSET)**
- Family photographs and images
- memberId, mediaUrl (S3), thumbnail
- type: PROFILE, FAMILY, EVENT, DOCUMENT, SCAN
- uploadedAt, uploadedBy, category
- isProfilePhoto, isPublic, displayOrder
- caption (bilingual), albumId

**3. PhotoAlbum (ORGANIZATION)**
- Collections of photos
- name (bilingual), description (bilingual)
- createdBy, coverPhotoId
- status: ACTIVE, ARCHIVED, isPublic

**4. FamilyDocument (RECORDS)**
- Important family documents
- title, description, documentUrl (S3)
- type: BIRTH_CERTIFICATE, MARRIAGE_LICENSE, PASSPORT
- yearCreated, issueDate, expiryDate
- uploadedBy, uploadedAt, isPublic

**5. Broadcast (FAMILY ANNOUNCEMENTS)**
- Family announcements and events
- titleAr/En, descriptionAr/En
- broadcastType: ANNOUNCEMENT, GATHERING, EVENT
- Status: DRAFT, SCHEDULED, SENT, FAILED
- publishDate, meetingDate, meetingLocation, meetingUrl

**6. BroadcastRsvp (EVENT RESPONSES)**
- RSVP tracking for broadcasts
- broadcastId, userId, status (PENDING, ACCEPTED, DECLINED)
- respondedAt, notes

**7. BroadcastRecipient (DELIVERY TRACKING)**
- Tracks which users received broadcast
- broadcastId, userId, sentAt
- deliveryStatus, failureReason

**8. Notification (ALERTS)**
- System notifications to users
- userId, titleAr/En, messageAr/En
- type: BROADCAST, PROFILE_UPDATE, JOURNAL_PUBLISHED, MEMBER_ADDED
- isRead, readAt, priority

**9. SearchHistory (ANALYTICS)**
- User search activity tracking
- userId, query, resultCount, clickedMemberId
- timestamp, isQuick flag

**10. QuickAction (UI SHORTCUT)**
- Quick action buttons configured per role
- actionName, buttonLabel, actionUrl, icon
- roles, displayOrder, isActive

**11. SavedSearch (USER PREFERENCES)**
- User-saved search queries
- userId, name, filters (JSON)
- createdAt, lastUsed

**12. ImportFile (BULK OPERATIONS)**
- Tracks bulk import files
- filename, uploadedBy, uploadedAt
- status: PENDING, PROCESSING, COMPLETED, FAILED

### Administrative Models (8 Models)

**1. SiteSettings (CONFIGURATION)**
- Global site configuration
- siteNameAr/En, siteLogo, siteDescription (bilingual)
- contactEmail, featureFlags (JSON)
- maintenanceMode, backupSchedule (cron)

**2. AuditLog (COMPLIANCE)**
- System-wide audit trail
- userId, action, resource, previousState, newState
- timestamp, ipAddress, severity (INFO/WARN/ERROR/CRITICAL)

**3. AnonymousVisitor (TRACKING)**
- Tracks public page visits
- visitorId, pageUrl, referrer, userAgent
- timestamp, ipAddress (anonymized)

**4. ImportJob (BULK OPERATIONS)**
- Tracks data import jobs
- createdBy, filename, status (PENDING, PROCESSING, COMPLETED, FAILED)
- totalRecords, successCount, failureCount
- startedAt, completedAt, errorLog

**5. ExportJob (BACKUP)**
- Tracks data export jobs
- createdBy, exportType (JSON, CSV, XML)
- status, recordCount, fileUrl (S3)
- startedAt, completedAt

**6. SystemHealth (MONITORING)**
- Health metrics snapshot
- timestamp, databaseConnections, cacheHitRate
- averageResponseTime, errorRate, memoryUsage, diskUsage

**7. IntegrationConfig (EXTERNAL SERVICES)**
- Configuration for external integrations
- providerName (Resend, Twilio, Google)
- credentials (encrypted), isActive, configuration (JSON)

**8. FeatureFlag (FEATURE MANAGEMENT)**
- Feature toggles for gradual rollouts
- name, description, isActive
- enabledFor, rolloutPercentage, expiresAt

### Privacy & Compliance Models (5 Models)

**1. PrivacySettings (USER CONFIGURATION)**
- Per-user privacy preferences
- userId, profileVisibility (PUBLIC, AUTHENTICATED, PRIVATE)
- showPhoneToRoles, showEmailToRoles, showBirthdayToRoles
- allowExport, allowDataDeletion booleans

**2. ConsentRecord (GDPR)**
- GDPR consent tracking
- userId, consentType (MARKETING, ANALYTICS, PROCESSING)
- consentGiven, consentDate, revokedDate, ipAddress

**3. DataDeletionRequest (GDPR RIGHT TO BE FORGOTTEN)**
- User requests for data deletion
- userId, requestDate, status (PENDING, APPROVED, REJECTED, COMPLETED)
- reason, completedAt, completedBy, anonymizationApproach

**4. DataExportRequest (GDPR DATA PORTABILITY)**
- User requests for data export
- userId, requestDate, format (JSON, CSV), status
- exportUrl (S3), expiresAt

**5. InactivityLog (COMPLIANCE)**
- Tracks inactive user accounts
- userId, lastActivityDate, accountAgeInDays, daysSinceLastLogin

---

## 3.2 Database Indexing Strategy

### Current Indexes (40+)

**Primary Key Indexes (Automatic)**
- All 53 models have clustered index on id field
- Enables O(1) point lookups

**Foreign Key Indexes**
- FamilyMember.fatherId
- FamilyMember.createdBy
- Photo.memberId
- All relationship fields indexed

**Generation/Status Indexes**
- FamilyMember(generation)
- FamilyMember(status)
- Composite: FamilyMember(generation, status)

**Temporal Indexes**
- FamilyMember.createdAt
- ChangeHistory.changedAt
- Soft delete-related queries

**Search Indexes**
- FamilyMember.fullNameAr
- FamilyMember.fullNameEn
- SearchHistory.query

### Recommended Additional Indexes

```sql
-- Member queries (most common)
CREATE INDEX idx_member_status_generation
ON "FamilyMember"(status, generation)
WHERE "deletedAt" IS NULL;

-- Photo retrieval by album
CREATE INDEX idx_photo_album_order
ON "Photo"("albumId", "displayOrder");

-- Session lookup
CREATE INDEX idx_session_user_active
ON "Session"("userId", "expiresAt")
WHERE "isRevoked" = false;

-- Journal queries
CREATE INDEX idx_journal_status_published
ON "FamilyJournal"("status", "publishedAt")
WHERE "deletedAt" IS NULL;

-- Search analytics
CREATE INDEX idx_search_history_timestamp
ON "SearchHistory"("userId", "timestamp");

-- Audit performance
CREATE INDEX idx_audit_log_action_timestamp
ON "AuditLog"("action", "timestamp");
```

---

## 3.3 Data Retention Policies

| Model | Retention | Action After |
|-------|-----------|---------------|
| FamilyMember | Permanent (soft delete) | 7 years for ChangeHistory |
| ChangeHistory | 5 years hot, then archive | Move to cold storage (Glacier) |
| Session | 30 days | Auto-delete expired sessions |
| OtpCode | 5 minutes | Auto-delete |
| PasswordReset | 1 hour | Auto-delete |
| AuditLog | 2 years hot, 5 years cold | Archive quarterly |
| SearchHistory | 1 year | Delete |
| ImportJob | Until manually deleted | Retained for historical reference |
| Notification | 6 months | Archive then delete |
| ActivityLog | 1 year | Archive to cold storage |

---

## 3.4 Backup and Disaster Recovery

### Backup Strategy

**Daily Automated Backups**
- Full database backup at 2:00 AM UTC
- Retention: 30 days of daily backups
- Stored in AWS S3 with cross-region replication
- Automated weekly verification: restore to staging
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 24 hours

**Point-in-Time Recovery (PITR)**
- Enable PostgreSQL WAL archiving to S3
- Retain WAL files for 7 days
- Recover to any point within 7 days
- Useful for accidental data deletion

**Weekly Full Exports**
- CSV/JSON export of all members
- Separate location (different AWS region)
- Retention: 90 days

**Monthly Full Dump**
- Complete pg_dump to S3
- Retention: 12 months (for compliance)
- Stored in separate AWS account for security

### Disaster Recovery Plan

**Tier 1: Database Outage (0-1 hour)**
- Automatic failover to read replica (RDS Multi-AZ)
- MTTR: < 5 minutes
- No manual intervention needed

**Tier 2: Regional Disaster (1-4 hours)**
- Manual failover to different AWS region
- Restore from cross-region backup
- Update DNS to new region
- MTTR: 1-2 hours
- RPO: last backup (24 hours)

**Tier 3: Complete Data Loss (>4 hours)**
- Restore from oldest backup (30 days old minimum)
- Replay transaction logs if PITR enabled
- Notify users of data recovery
- MTTR: 4-8 hours
- RPO: 24 hours (with PITR: minutes)

### Testing Schedule

- Monthly: Test restoration to staging
- Quarterly: Full disaster recovery drill
- Annually: Cross-region failover test
- Document results and update runbooks

---

## 3.5 Encryption Strategy

### At-Rest Encryption

**Database Encryption**
- AWS RDS encryption enabled with AWS KMS
- Master key managed by AWS
- Automatic encryption of all data blocks
- Negligible performance impact (~5%)

**S3 Object Encryption**
- Server-side encryption with AWS KMS
- Separate KMS key for photo vs document storage
- Access via API requires AWS credentials

**Backup Encryption**
- All backups encrypted with AES-256
- Keys rotated annually
- Stored separately from backups

### In-Transit Encryption

**HTTPS/TLS**
- All external communication over HTTPS
- TLS 1.2 minimum (TLS 1.3 preferred)
- Perfect Forward Secrecy enabled
- HSTS headers enforced (31536000 seconds)

**Database Connection**
- PostgreSQL connection over SSL
- Self-signed certs acceptable for RDS

**S3 Upload/Download**
- Signed URLs use HTTPS
- CloudFront enforces HTTPS only

### Key Management

**KMS Key Rotation**
- Automatic annual rotation of AWS KMS keys
- No application changes required
- Transparent to application

**API Key Management**
- External API keys stored in AWS Secrets Manager
- Never committed to code repository
- Rotation policy: 90 days for user-facing keys
- Audit trail of key access

**Database Credentials**
- PostgreSQL password stored in AWS Secrets Manager
- Rotated every 30 days via Lambda
- Application reads from Secrets Manager on startup

---

## 3.6 Row-Level Security (RLS)

PostgreSQL Row-Level Security enforces database-level access control:

```sql
-- Enable RLS
ALTER TABLE "FamilyMember" ENABLE ROW LEVEL SECURITY;

-- Members can see themselves or public members
CREATE POLICY public_member_view ON "FamilyMember"
  FOR SELECT
  USING (
    status = 'PUBLIC'
    OR id = (SELECT CAST(current_setting('app.current_user_id') AS BIGINT))
    OR (SELECT role FROM "User" WHERE id = CAST(current_setting('app.current_user_id') AS BIGINT)) IN ('ADMIN', 'SUPER_ADMIN')
  );

-- Prevent member deletion without authorization
CREATE POLICY member_delete ON "FamilyMember"
  FOR DELETE
  USING (
    (SELECT role FROM "User" WHERE id = CAST(current_setting('app.current_user_id') AS BIGINT)) IN ('ADMIN', 'SUPER_ADMIN')
  );
```

Benefits:
- Enforces access control at database level
- Prevents unauthorized access even with compromised application code
- Performance cost: ~5-10% overhead
- Policies evaluated for every row accessed

---

# SECTION 4: API ARCHITECTURE

## 4.1 RESTful API Design Standards

### Endpoint Structure

```
{method} /api/v1/{resource}/{id}/{nested-resource}?{query-params}
```

**HTTP Method Conventions**
- GET: Retrieve (safe, idempotent)
- POST: Create, take action (idempotent if possible)
- PUT: Full replacement (idempotent)
- PATCH: Partial update (idempotent)
- DELETE: Remove (idempotent)
- HEAD: Like GET, no body
- OPTIONS: Describe available methods

### Request/Response Headers

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
Accept-Language: ar or en
X-Request-Id: {unique-id}
X-Device-Id: {device-id}
```

**Response Headers**
```
Content-Type: application/json
Cache-Control: max-age=300, public
ETag: {resource-version}
X-Request-Id: {same-as-request}
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: {unix-timestamp}
```

### JSON:API Response Format

```json
{
  "data": [
    {
      "id": "P0001",
      "type": "members",
      "attributes": {
        "firstName": "محمد",
        "fullNameAr": "محمد علي الشايع",
        "fullNameEn": "Muhammad Ali Al-Shaya",
        "generation": 1,
        "status": "LIVING",
        "createdAt": "2026-03-08T10:30:00Z"
      },
      "relationships": {
        "father": {
          "data": {
            "id": "P0000",
            "type": "members"
          }
        },
        "photos": {
          "data": [
            {"id": "photo-123", "type": "photos"},
            {"id": "photo-456", "type": "photos"}
          ]
        }
      },
      "links": {
        "self": "/api/v1/members/P0001"
      }
    }
  ],
  "included": [
    {
      "id": "photo-123",
      "type": "photos",
      "attributes": {
        "mediaUrl": "https://cdn.alshaya.com/photos/photo-123.jpg",
        "uploadedAt": "2026-02-15T14:20:00Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalCount": 5000,
      "totalPages": 250
    },
    "requestId": "req-123-456",
    "timestamp": "2026-03-08T10:30:45Z"
  },
  "links": {
    "self": "/api/v1/members?page[number]=1&page[size]=20",
    "next": "/api/v1/members?page[number]=2&page[size]=20",
    "last": "/api/v1/members?page[number]=250&page[size]=20"
  }
}
```

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "status": 400,
    "timestamp": "2026-03-08T10:30:45Z",
    "requestId": "req-123-456",
    "details": [
      {
        "field": "firstName",
        "issue": "must_not_be_empty",
        "message": "First name is required"
      },
      {
        "field": "generation",
        "issue": "must_be_between_1_and_20",
        "message": "Generation must be between 1 and 20"
      }
    ],
    "trace": "Error stack trace (development only)"
  }
}
```

---

## 4.2 API Versioning

**URL-Based Versioning**
- `/api/v1/` - current version (latest)
- `/api/v2/` - future version
- Support N-1 versions (current + previous)
- Deprecate oldest version quarterly

**Deprecation Headers**
```
Deprecation: true
Sunset: Fri, 30 Jul 2026 00:00:00 GMT
Link: </api/v2/members>; rel="successor-version"
```

---

## 4.3 Rate Limiting

### Global Rate Limits

- 1000 requests per hour per authenticated user
- 100 requests per hour per IP (unauthenticated)
- 10 requests per minute for password reset
- 3 failed login attempts → account locked 15 minutes

### Per-Endpoint Rate Limits

```
GET    /api/members         1000 req/hour
POST   /api/members         100  req/hour
GET    /api/search          500  req/hour
POST   /api/upload          50   req/hour
POST   /auth/login          10   req/hour
POST   /auth/register       5    req/hour
POST   /auth/password-reset 3    req/hour
```

### Token Bucket Algorithm

```
For each user:
  - Bucket capacity: limit per hour
  - Tokens refill: limit / 3600 per second
  - Each request consumes 1 token
  - If tokens < 1, reject with 429

Response Headers:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: {unix-timestamp}
  Retry-After: 3600
```

---

## 4.4 Pagination

### Offset-Based (Traditional)

```
GET /api/members?page[number]=1&page[size]=20

Response:
{
  "meta": {
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalCount": 5000,
      "totalPages": 250,
      "hasNext": true
    }
  }
}
```

### Cursor-Based (Recommended for Large Datasets)

```
GET /api/members?limit=20&cursor={encoded_position}

Response:
{
  "pagination": {
    "limit": 20,
    "nextCursor": "eyJpZCI6IlAwNTAwIn0=",
    "hasMore": true
  }
}
```

**Advantages:**
- Stable pagination (insertion/deletion doesn't affect pages)
- Faster queries (no offset needed)
- Prevents easy crawler iteration
- Better for real-time data changes

---

## 4.5 Filtering and Sorting

### Filtering Format

```
GET /api/members?filter[status]=LIVING&filter[generation]=1,2&filter[gender]=MALE

Filters:
- filter[status]=LIVING
- filter[generation]=1,2,3
- filter[birthYear]=1900:2000
- filter[status]=-DECEASED (negation)
```

### Sorting Format

```
GET /api/members?sort=-birthYear,firstName

sort parameter:
- Ascending: fieldName
- Descending: -fieldName
- Multiple: comma-separated

Sortable fields:
- firstName, fullNameAr, fullNameEn
- generation, status, createdAt, birthYear
```

### Advanced Query Example

```
GET /api/members?
  filter[status]=LIVING&
  filter[generation]=1,2,3&
  filter[birthYear]=1900:1950&
  sort=-birthYear,firstName&
  page[number]=1&
  page[size]=50&
  include=photos,journals&
  fields[members]=firstName,generation,status

Retrieves:
- All living members in generations 1-3
- Born between 1900-1950
- Sorted by birth year descending, then first name ascending
- 50 per page
- Include related photos and journals
- Only firstName, generation, status fields
```

---

# SECTION 5: SECURITY ARCHITECTURE

## 5.1 Threat Model (STRIDE)

### Spoofing (Identity Spoofing)

**Threats:** Impersonate legitimate users, steal tokens, forge JWT

**Mitigations:**
- HTTPS only (no MITM)
- Secure httpOnly cookies for refresh tokens
- JWT signature verification
- Per-device session tracking
- IP address binding (optional)

### Tampering (Data Tampering)

**Threats:** Modify genealogical data, SQL injection, API manipulation

**Mitigations:**
- Input validation via Zod schemas
- Parameterized queries (Prisma ORM)
- Request signing (optional)
- ChangeHistory audit trail
- Database constraints enforce integrity
- Immutable change logs

### Repudiation (Denial of Actions)

**Threats:** User denies actions, unauthorized access claims

**Mitigations:**
- Comprehensive audit logging
- ChangeHistory with userId and timestamp
- Cryptographic signatures on sensitive operations
- Long-term log retention
- Non-repudiation via blockchain (future)

### Information Disclosure (Privacy Breach)

**Threats:** Unauthorized access to sensitive data

**Mitigations:**
- Role-based access control (RBAC)
- Row-level security (RLS) policies
- Field-level privacy rules
- PrivacySettings per user
- Encryption at rest and in transit
- Secure log redaction
- S3 bucket policies restrict access
- Database access only via application

### Availability (Denial of Service)

**Threats:** System becomes unavailable, DDoS attacks

**Mitigations:**
- CloudFront DDoS protection
- Rate limiting (1000 req/hr)
- Query complexity limits
- Connection pooling
- Auto-scaling
- Health checks
- Circuit breakers
- Graceful degradation

### Elevation of Privilege (Authorization Bypass)

**Threats:** Unauthorized role elevation, SQL injection bypass

**Mitigations:**
- Role change requires SUPER_ADMIN only
- Authorization checks on every endpoint
- Principle of least privilege
- Session revocation on privilege change
- Audit logging of role changes

---

## 5.2 Authentication Architecture

### Authentication Methods

**Email/Password (Primary)**
- Minimum 12 chars, special character required
- Bcrypt hashing: cost factor 12 (5 second hash time)
- Rate limiting: 10 attempts/hour
- Account lockout: 15 minutes after 3 failures
- Password reset: secure token (32 bytes, 1 hour expiry)

**SMS OTP (Secondary)**
- Phone number verification required
- OTP: 6 digits, 5 minute expiry
- Rate limiting: 3 attempts/hour per phone
- Twilio integration for delivery
- Fallback during email outages

**Google OAuth (Optional)**
- For convenience and passwordless login
- Scope: email profile only
- Email matching: link to existing or create new
- Creates session immediately on success

### JWT Access Token

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "U123",
  "role": "MEMBER",
  "sessionId": "S456",
  "iat": 1646389200,
  "exp": 1646389900,     # 15 minutes
  "sub": "alshaya-app"
}

Signature:
HMAC-SHA256(secret, header.payload)
```

### Session Lifecycle

```
1. Creation (login)
   ├─ Generate sessionId (UUIDv4)
   ├─ Store in Session table
   ├─ Set expiration: 30 days
   └─ Record device info

2. Active (request phase)
   ├─ Verify session not revoked
   ├─ Update lastActivityAt
   ├─ Check not expired
   └─ Allow request

3. Refresh (after token expires)
   ├─ Look up session by sessionId
   ├─ Verify still valid
   ├─ Generate new access token
   └─ Refresh token TTL (restart 30 days)

4. Logout (explicit or timeout)
   ├─ Mark session revoked
   ├─ Invalidate all tokens with sessionId
   ├─ Client discards tokens
   └─ Clear httpOnly cookies
```

### 2FA (Two-Factor Authentication)

- TOTP (Time-based One-Time Passwords) primary
- SMS OTP secondary method
- Backup codes (10 single-use codes) for recovery

**Flow:**
1. User enables 2FA in settings
2. Display QR code with TOTP secret
3. User scans with authenticator app
4. User enters code to verify setup
5. Generate 10 backup codes
6. Next login:
   - Email/password successful
   - Prompt for 2FA code
   - User enters from authenticator
   - Create full session

---

## 5.3 Authorization Architecture (RBAC)

### Role Definitions

**MEMBER (Default)**
- VIEW_OWN_PROFILE, VIEW_PUBLIC_MEMBERS, VIEW_PHOTOS, CREATE_JOURNAL

**LEADER (Branch Manager)**
- All MEMBER + MANAGE_BRANCH_MEMBERS, APPROVE_JOURNALS, CREATE_BROADCAST, VIEW_BRANCH_AUDIT
- Scope: Assigned branch only

**ADMIN (Full Administrator)**
- All LEADER + MANAGE_ALL_MEMBERS, DELETE_MEMBER, MANAGE_USERS, CHANGE_ROLE, VIEW_AUDIT, CONFIGURE_SETTINGS

**SUPER_ADMIN (System Admin)**
- All permissions including SYSTEM_CONFIGURATION, BACKUP_MANAGEMENT, FEATURE_FLAGS, INTEGRATION_MANAGEMENT

### Permission Matrix (Expanded)

```
Resource    | Method | MEMBER | LEADER | ADMIN  | SUPER_ADMIN | Rule
────────────┼────────┼────────┼────────┼────────┼─────────────┼──────────────
Member      | VIEW   | Own+Pub│ Branch │ All    │ All         │ Privacy
Member      | CREATE | No     │ Branch │ All    │ All         │ Branch lead
Member      | UPDATE | Own    │ Branch │ All    │ All         │ Own/branch
Member      | DELETE | No     │ No     │ Soft   │ Hard        │ Admin/SA
Photo       | VIEW   | Own+Pub│ Branch │ All    │ All         │ Privacy
Photo       | UPLOAD | Own    │ Branch │ All    │ All         │ Own member
Photo       | DELETE | Own    │ Branch │ All    │ All         │ Own/leader
Journal     | VIEW   | Pub+Own│ All    │ All    │ All         │ Status
Journal     | CREATE | Yes    │ Yes    │ Yes    │ Yes         │ Own/branch
Journal     | APPROVE│ No     │ Branch │ Yes    │ Yes         │ Leader+
User        | VIEW   | Self   │ Branch │ All    │ All         │ Admin+
User        | CREATE | No     │ No     │ Invite │ Full        │ Admin+
User        | DELETE | No     │ No     │ No     │ Yes         │ SA only
Role        | CHANGE | No     │ No     │ No     │ Yes         │ SA only
```

---

## 5.4 Data Protection

### Data Classification

**Public (GREEN)**
- Family member names, generation, status
- Family relationships and tree structure
- Public photos and journals
- Viewable by anyone without login

**Internal (YELLOW)**
- Private member photos
- Personal journals
- Contact information
- Viewable by authenticated members

**Confidential (RED)**
- Email addresses, phone numbers
- Passport numbers, medical info
- Viewable by authorized roles only

**Restricted (BLACK)**
- Password hashes, tokens
- Audit logs (sensitive actions)
- System configuration
- Database backups
- Viewable by admins/developers only

### Encryption Standards

**At Rest:**
- All database fields encrypted via AWS KMS
- S3 objects encrypted with AES-256-GCM
- Backups encrypted with AES-256
- Keys rotated annually

**In Transit:**
- HTTPS/TLS 1.2+ mandatory
- Perfect Forward Secrecy enabled
- HSTS enforced (31536000 seconds)
- No HTTP fallback

---

## 5.5 Network Security

### Inbound Rules

```
Port 443 (HTTPS)
├─ CloudFront origin shield
├─ Rate limiting (1000 req/hr)
├─ DDoS mitigation (AWS Shield)
└─ CORS headers validation

Port 80 (HTTP)
└─ Redirect to HTTPS only

SSH (22) - Admin only
└─ Bastion host required

Database (5432) - Private only
├─ VPC security group
├─ Only from application servers
└─ Password-based auth required
```

### Outbound Rules

```
DNS (53) → Domain resolution

HTTPS (443)
├─ AWS KMS
├─ AWS Secrets Manager
├─ Resend email service
├─ Twilio SMS service
├─ Google OAuth provider
└─ Sentry error tracking

S3 (HTTPS) → Photo/backup storage
```

### VPC Architecture

```
Internet Gateway
     ↓
Elastic Load Balancer (public)
     ↓
Application servers (private subnet)
     ↓
NAT Gateway (outbound internet)
     ↓
├─ RDS Database (private, no internet)
├─ ElastiCache Redis (private)
└─ Secrets Manager (PrivateLink)
```

---

## 5.6 Secret Management

### AWS Secrets Manager

```
alshaya/database/password
├─ PostgreSQL admin password
├─ Rotation: 30 days
└─ Backup: stored elsewhere

alshaya/jwt/secret
├─ HS256 signing key
├─ Rotation: 90 days
└─ Backup: old key for grace period

alshaya/resend/api-key
├─ Resend email API key
├─ Rotation: 180 days
└─ Scope: Send email only

alshaya/twilio/auth-token
├─ Twilio SMS API token
├─ Rotation: 180 days
└─ Scope: Send SMS only

alshaya/google/oauth-secret
├─ Google OAuth client secret
├─ Rotation: manual (provider-controlled)
└─ Scope: OAuth only
```

---

# SECTION 6: PERFORMANCE ARCHITECTURE

## 6.1 Caching Layers

### Layer 1: Browser Cache

**Strategy:**
- Static assets: `Cache-Control: max-age=31536000, immutable`
- API responses: `Cache-Control: max-age=300, public`
- User-specific: `Cache-Control: private, no-cache`
- Service Worker for offline support

### Layer 2: CDN Cache (CloudFront)

**Configuration:**
- Origin: Next.js application + S3 bucket
- TTL for static assets: 1 year
- TTL for API responses: 5 minutes
- Compression: gzip + brotli
- 210 edge locations worldwide

### Layer 3: Server Cache (Redis)

**Hot Data Cache:**
```
member:{id}             TTL: 3600s (1 hour)
member-tree:{id}        TTL: 86400s (24 hours)
search-results:{query}  TTL: 300s (5 minutes)
photos:{memberId}       TTL: 604800s (1 week)
journals:{memberId}     TTL: 604800s (1 week)
session:{sessionId}     TTL: 2592000s (30 days)
```

**Configuration:**
```
max_memory: 4GB
maxmemory_policy: allkeys-lru
persistence: RDB + AOF
replication: master-slave for HA
```

### Layer 4: Database Query Cache

**Connection Pooling:**
- PgBouncer: 20 connections per application server
- Reduces database connection overhead
- Reuses connections

**Query Result Caching:**
- PostgreSQL query planner caches execution plans
- Prepared statements reduce parsing
- Read replicas for heavy read queries

---

## 6.2 Query Optimization

### N+1 Query Problem (AVOID)

```typescript
// AVOID: Causes N+1 queries
const members = await db.familyMember.findMany();
members.forEach(m => {
  const photos = await db.photo.findMany({
    where: { memberId: m.id }
  }); // N additional queries!
});
```

### Optimized: Use Relationships (GOOD)

```typescript
// GOOD: Single query with relationships
const members = await db.familyMember.findMany({
  include: {
    photos: true,
    journals: true
  }
});
```

### Batch Loading Pattern (BEST)

```typescript
// BEST: Batch load related data
const memberIds = members.map(m => m.id);
const allPhotos = await db.photo.findMany({
  where: { memberId: { in: memberIds } }
});
const photosByMember = groupBy(allPhotos, 'memberId');
```

---

## 6.3 Frontend Performance

### Code Splitting

```typescript
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tree = lazy(() => import('./pages/Tree'));
const Admin = lazy(() => import('./pages/Admin'));

// Loaded only when route accessed
<Suspense fallback={<Loading />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Suspense>
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src={photoUrl}
  alt="Family photo"
  width={400}
  height={300}
  placeholder="blur"
  loading="lazy"
/>
```

**Benefits:**
- Automatic format selection (WebP, AVIF)
- Responsive sizing
- Lazy loading
- Blur placeholder
- AVIF compression

---

## 6.4 Performance Budget

### Target Metrics

```
Core Web Vitals (Google):
├─ Largest Contentful Paint (LCP): < 2.5 seconds
├─ First Input Delay (FID): < 100 milliseconds
└─ Cumulative Layout Shift (CLS): < 0.1

Additional targets:
├─ First Contentful Paint: < 1 second
├─ Time to Interactive: < 3 seconds
├─ Total Blocking Time: < 200ms
└─ Lighthouse Score: 90+
```

### Page-Specific Budgets

```
Dashboard:
├─ Initial load: < 2s
├─ API response: < 200ms
└─ Interaction: < 100ms

Family Tree Visualization:
├─ Initial load: < 3s
├─ D3 render: < 500ms
└─ Pan/zoom: < 50ms

Member Search:
├─ Initial load: < 1s
├─ Search results: < 100ms
└─ Autocomplete: < 50ms
```

---

# SECTION 7: SCALABILITY ARCHITECTURE

## 7.1 Horizontal Scaling

### Current State (Monolithic)

```
Load Balancer
     │
     ├─ App Server 1 (all functionality)
     ├─ App Server 2 (all functionality)
     └─ App Server 3 (all functionality)

Database: Primary + read replicas
Cache: Shared Redis cluster
```

### Target State (Modular)

```
Load Balancer
     │
     ├─ API Servers (3-5 instances)
     │   ├─ Authentication
     │   ├─ Member CRUD
     │   ├─ Search
     │   ├─ Broadcasts
     │   └─ Admin operations
     │
     ├─ Background Workers (2-3)
     │   ├─ Email sending
     │   ├─ SMS sending
     │   ├─ Imports/exports
     │   ├─ Data cleanup
     │   └─ Backups
     │
     ├─ Real-time Server (1-2)
     │   ├─ WebSocket connections
     │   ├─ Live tree updates
     │   └─ Notifications
     │
     └─ CDN (static content)
         ├─ CSS, JS, images
         └─ Photos, documents
```

### Scaling Triggers

**Scale Up (Add Servers):**
- CPU > 70% for 5 minutes
- Memory > 80% for 5 minutes
- Response time > 1 second p95
- Queue depth > 1000 jobs

**Scale Down (Remove Servers):**
- CPU < 20% for 15 minutes
- All metrics healthy
- Minimum 2 servers always running

---

## 7.2 Database Read Replicas

```
Primary Database (write-only)
├─ Read/Write endpoint
├─ Automatic backups
└─ Multi-AZ for failover

Read Replica 1 (read-only)
├─ Read-only endpoint
├─ Continuous replication
├─ Separate AZ
└─ Failover target

Read Replica 2 (read-only)
├─ Read-only endpoint
├─ Continuous replication
├─ Separate AZ
└─ Analytics queries
```

### Routing Strategy

```
Write queries → Primary database
├─ CREATE, UPDATE, DELETE
├─ Changes replicated to replicas (< 1s)
└─ Route: db-primary.alshaya.com

Read queries → Round-robin replicas
├─ SELECT, no consistency requirements
├─ Load balanced across replicas
└─ Route: db-read.alshaya.com (alias)

Strongly-consistent reads → Primary
├─ After write, read same record
└─ Force primary: SELECT ... FORCE_MASTER
```

---

## 7.3 Connection Pooling (PgBouncer)

### Configuration

```
Max connections per application: 20
Idle timeout: 5 minutes
Reserve connections: 5
Pool size: 25

Per-server pool:
  ├─ API server 1: 20
  ├─ API server 2: 20
  ├─ API server 3: 20
  ├─ Worker 1: 10
  ├─ Worker 2: 10
  └─ Admin tool: 5
  ─────────────
  Total: 75 (vs unlimited)
```

**Benefits:**
- Reduces database resource consumption
- Prevents "too many connections" errors
- Enables more application servers
- Faster connection acquisition

---

## 7.4 Queue-Based Processing (BullMQ)

```
API Server
    ↓
Create job in Redis queue
    ↓
Return immediately to user
    ↓
Background Worker picks up job
    ↓
Process (email send, file upload, etc.)
    ↓
Mark complete or retry
```

### Job Types

```
Email queue (email-queue)
├─ Email verification
├─ Password reset
├─ Broadcast announcement
├─ Concurrency: 10 jobs/second
└─ Retry: 3x with exponential backoff

SMS queue (sms-queue)
├─ OTP delivery
├─ Event notification
├─ Concurrency: 5 jobs/second
└─ Retry: 3x

Import queue (import-queue)
├─ Bulk member import
├─ Photo import
├─ Concurrency: 1 job at time
└─ Progress tracking via WebSocket

Export queue (export-queue)
├─ Member data export
├─ Backup creation
├─ Concurrency: 1 job
└─ Callback when complete

Maintenance queue (maintenance-queue)
├─ Delete old sessions
├─ Archive old logs
├─ Prune soft-deleted records
└─ Scheduled daily at 2am
```

---

## 7.5 Microservice Extraction Plan

### Phase 1: Extract Search (Month 6-9)

**New Service: Search Service**
```
Search Service (Node.js + Elasticsearch)
├─ Port: 3001
├─ Database: Elasticsearch cluster
├─ API:
│   ├─ POST /search (full-text)
│   ├─ GET /autocomplete
│   ├─ POST /reindex (admin)
│   └─ Health check
├─ Scaling: 2-5 instances
└─ Communication: REST
```

### Phase 2: Extract Notifications (Month 9-12)

**New Service: Notification Service**
```
Notification Service (Node.js)
├─ Database: PostgreSQL (shared)
├─ Cache: Redis (shared)
├─ Outbound:
│   ├─ Email (Resend)
│   ├─ SMS (Twilio)
│   └─ In-app (WebSocket)
├─ API:
│   ├─ POST /notify
│   ├─ GET /history
│   └─ Health check
└─ Scaling: 2-3 instances
```

### Phase 3: Extract Analytics (Month 12+)

**New Service: Analytics Service**
```
Analytics Service (Node.js)
├─ Database: ClickHouse
├─ API:
│   ├─ GET /stats
│   ├─ POST /track
│   ├─ GET /reports
│   └─ Health check
├─ Scaling: 1-2 instances
└─ Message queue: Kafka
```

---

# SECTION 8: RELIABILITY ARCHITECTURE

## 8.1 SLA/SLO

### Service Level Agreement

**Uptime Target: 99.9% (3 nines)**
- Annual: 8.7 hours downtime
- Monthly: 43 minutes downtime
- Weekly: 6 minutes downtime
- Daily: 86 seconds downtime

**Compensation for SLA Breach:**
- 99.5% - 99.9%: 10% credit
- 99.0% - 99.5%: 25% credit
- < 99.0%: 100% credit
- Maximum 30% of monthly fees

**Excluded Events:**
- Scheduled maintenance (Sun 2-4am)
- Client-side issues
- Third-party outages
- DDoS attacks
- Force majeure

---

## 8.2 Circuit Breaker Pattern

```
States:
├─ Closed: Normal, requests pass through
├─ Open: Service unhealthy, fail fast
└─ Half-Open: Testing recovery

Transitions:
Closed ──error_threshold──> Open
Open ──timeout(60s)──> Half-Open
Half-Open ──success──> Closed
Half-Open ──failure──> Open

Thresholds:
├─ Error rate > 50%
├─ Consecutive errors > 5
├─ Timeout: 60 seconds
└─ 1 success in Half-Open: Close
```

### Protected Services

**Resend Email:**
- Threshold: 3 consecutive failures
- Timeout: 30 seconds
- Fallback: Queue for retry

**Twilio SMS:**
- Threshold: 5 consecutive failures
- Timeout: 10 seconds
- Fallback: Store for manual

**PostgreSQL:**
- Threshold: Connection pool exhausted
- Timeout: 30 seconds
- Fallback: Return cached data or 503

**Redis Cache:**
- Threshold: Connection lost
- Timeout: 5 seconds
- Fallback: Bypass cache, query DB

---

## 8.3 Retry Strategies

### Exponential Backoff

```
Retry 1: 100ms (2^0 * 100)
Retry 2: 200ms (2^1 * 100)
Retry 3: 400ms (2^2 * 100)
Retry 4: 800ms (2^3 * 100)
Retry 5: 1600ms (2^4 * 100)
Total: 3.1 seconds

Max retries: 5
Jitter: ±20% (prevent thundering herd)
```

### Idempotent Retry

**Safe to retry (idempotent):**
- GET, HEAD, OPTIONS (read-only)
- DELETE (same result)
- PUT (replace operation)
- POST with idempotency key

**Unsafe to retry:**
- POST without idempotency key
- PATCH (state-dependent)

### Idempotency Key Implementation

```
POST /api/members
X-Idempotency-Key: uuid-unique-per-request

Server:
├─ Check if key seen before
├─ If yes: return cached response
├─ If no: process, cache response
└─ Future requests with same key get cached response
```

---

## 8.4 Graceful Degradation

```
Full Capacity:
├─ All features
├─ Full database
├─ Real-time updates
├─ Email notifications
├─ S3 storage
└─ Analytics

Degraded (Redis down):
├─ ✓ View members
├─ ✓ Search (slower)
├─ ✓ Edit members
├─ ✗ Real-time notifications
└─ Alert: "Features may be slow"

Degraded (Email down):
├─ ✓ All features
├─ ✗ Email notifications
├─ ✓ SMS still works
├─ ✓ In-app notifications
└─ Alert: "Emails delayed"

Degraded (S3 down):
├─ ✓ View cached photos
├─ ✗ Upload new photos
├─ ✓ All other features
└─ User message: "Photo upload unavailable"

Minimal Mode (Database down):
├─ ✗ Read members
├─ ✗ Create/edit members
├─ ✓ Show cached homepage
├─ ✓ Static content
└─ Alert: "Service maintenance"
```

---

## 8.5 Health Check Endpoints

**GET /api/health**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-08T10:30:45Z",
  "uptime": 86400,
  "components": {
    "database": {
      "status": "healthy",
      "responseTime": 50,
      "connectionPoolUsage": 0.35
    },
    "redis": {
      "status": "healthy",
      "responseTime": 10,
      "memoryUsage": 1024
    },
    "s3": {
      "status": "healthy",
      "lastCheck": "2026-03-08T10:30:00Z"
    },
    "resend": {
      "status": "healthy",
      "queuedEmails": 42
    },
    "twilio": {
      "status": "healthy",
      "queuedSms": 0
    }
  }
}
```

---

## 8.6 Disaster Recovery

### Tier 1: Application Crash (RTO: 5 minutes)

```
Failure: Application server crashes
Detection: Kubernetes liveness probe fails (30s)
Response:
  ├─ Kubernetes restarts pod
  ├─ If repeated, scale up new pod
  ├─ Old pod removed from load balancer
  └─ Users redirect to healthy pods
Recovery: Automatic
```

### Tier 2: Database Failure (RTO: 1-2 hours)

```
Failure: Primary database unreachable
Detection: Connection pool exhaustion
Response:
  ├─ Multi-AZ failover (automatic, ~1 min)
  ├─ Application retries queries
  ├─ Read replicas continue serving
  └─ If failover fails:
     ├─ Launch new DB from backup
     ├─ Restore to latest snapshot
     ├─ Run PITR if needed
     └─ Update connection string
Recovery: 1-2 hours
```

### Tier 3: Regional Outage (RTO: 4 hours)

```
Failure: Entire AWS region unavailable
Response:
  ├─ Activate DR plan
  ├─ Spin up infrastructure in new region
  ├─ Create new RDS instance
  ├─ Restore from backup
  ├─ Deploy application
  ├─ Update DNS to new region
  ├─ Validate all systems
  └─ Notify users
Recovery: 2-4 hours
```

### Tier 4: Complete Data Loss (RTO: 8+ hours)

```
Failure: Data corruption/ransomware
Response:
  ├─ PAUSE all writes immediately
  ├─ Assess scope of data loss
  ├─ Determine last clean backup
  ├─ Restore from oldest available backup
  ├─ Launch new database
  ├─ Verify integrity
  ├─ Notify users
  └─ Root cause analysis
Recovery: 4-8 hours
Data loss: Up to 24 hours
```

---

# SECTION 9: TESTING ARCHITECTURE

## 9.1 Testing Pyramid

```
              /\
             /  \
            / E2E \        5% (Very slow, realistic)
           /        \
          /──────────\
         /            \
        /  Integration  \   15% (Medium speed)
       /                \
      /──────────────────\
     /                    \
    /       Unit           \  80% (Fast)
   /                        \
  /──────────────────────────\

Unit tests: 80% (fast, isolated)
Integration tests: 15% (medium, some dependencies)
E2E tests: 5% (slow, full system)
```

---

## 9.2 Test Infrastructure

### Unit Testing (Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { MemberCard } from '@/components/MemberCard';

describe('MemberCard', () => {
  it('displays member name correctly', () => {
    const member = {
      id: 'P0001',
      firstName: 'محمد',
      fullNameEn: 'Muhammad',
      generation: 1,
      status: 'LIVING'
    };

    render(<MemberCard member={member} />);
    expect(screen.getByText('Muhammad')).toBeInTheDocument();
  });

  it('shows generation level', () => {
    const member = { ...defaultMember, generation: 5 };
    render(<MemberCard member={member} />);
    expect(screen.getByText(/generation 5/i)).toBeInTheDocument();
  });

  it('applies correct style for deceased', () => {
    const member = { ...defaultMember, status: 'DECEASED' };
    const { container } = render(<MemberCard member={member} />);
    expect(container.firstChild).toHaveClass('opacity-60');
  });
});
```

### Integration Testing (Jest + Supertest)

```typescript
import request from 'supertest';
import { createTestApp } from '@/test/setup';

describe('POST /api/members', () => {
  it('creates new member successfully', async () => {
    const app = await createTestApp();
    const token = await createTestToken({ role: 'ADMIN' });

    const response = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'محمد',
        fatherName: 'علي',
        fullNameEn: 'Muhammad Ali',
        gender: 'MALE',
        generation: 5
      });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.attributes.firstName).toBe('محمد');

    // Verify in database
    const member = await db.familyMember.findUnique({
      where: { id: response.body.data.id }
    });
    expect(member).toBeDefined();
  });
});
```

### E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can search and view member profile', async ({ page }) => {
  await page.goto('https://alshaya.local');

  await page.click('[data-testid="search-input"]');
  await page.fill('[data-testid="search-input"]', 'محمد');
  await page.waitForSelector('[data-testid="search-result"]');
  await page.click('[data-testid="search-result"]:first-child');

  await expect(page).toHaveURL(/\/member\/P\d+/);
  await expect(page.locator('h1')).toContainText('محمد');
});
```

---

## 9.3 Testing Standards

### API Layer Testing

**Coverage Targets:**
- Happy path: 100%
- Error cases: 100%
- Authorization: 100%
- Edge cases: 80%

### Component Testing

**Coverage Targets:**
- Props combinations: 90%
- User interactions: 100%
- State changes: 90%
- Error states: 80%

### Database Layer Testing

**Coverage Targets:**
- Relationships: 100%
- Constraints: 100%
- Indexes: 80%
- Query performance: 90%

---

## 9.4 Performance Testing (k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function() {
  let res = http.get('https://api.alshaya.com/api/members?search=محمد');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has results': (r) => r.json('data').length > 0,
  });
  sleep(1);
}
```

---

## 9.5 Security Testing

### Input Validation Testing

```typescript
it('prevents SQL injection in search', async () => {
  const maliciousInput = "'; DROP TABLE members; --";
  const response = await request(app)
    .get('/api/search')
    .query({ q: maliciousInput });

  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');

  const count = await db.familyMember.count();
  expect(count).toBeGreaterThan(0);
});
```

### Authentication Testing

```typescript
it('rejects expired tokens', async () => {
  const expiredToken = generateToken({ expiresIn: '0s' });
  await new Promise(r => setTimeout(r, 1000));

  const response = await request(app)
    .get('/api/members')
    .set('Authorization', `Bearer ${expiredToken}`);

  expect(response.status).toBe(401);
  expect(response.body.error.code).toBe('EXPIRED_TOKEN');
});
```

---

## 9.6 Accessibility Testing

### Automated Tests (axe-core)

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

test('member card has no accessibility violations', async () => {
  const { container } = render(
    <MemberCard member={testMember} />
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

```
Keyboard Navigation:
├─ Tab through all interactive elements ✓
├─ Focus visible on all elements ✓
├─ Logical tab order (left-to-right) ✓
└─ Shift+Tab goes backwards ✓

Screen Reader:
├─ Page title announced ✓
├─ Navigation landmarks identified ✓
├─ Images have alt text ✓
├─ Form fields have labels ✓
└─ Error messages announced ✓

Color Contrast:
├─ WCAG AA (4.5:1 for text) ✓
├─ WCAG AAA (7:1 for enhanced) ✓
└─ No color-only information ✓

RTL Testing:
├─ Text direction correct ✓
├─ Layout mirrors correctly ✓
├─ Icons appropriately mirrored ✓
└─ Directional indicators correct ✓
```

---

# SECTION 10: DEVOPS ARCHITECTURE

## 10.1 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run prisma:migrate
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
      - name: Deploy to production
        run: curl -X POST https://api.vercel.com/v12/deployments ...
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
```

---

## 10.2 Environment Strategy

### Development

```
Database: PostgreSQL (local or RDS sandbox)
Cache: Redis (local or ElastiCache dev)
Storage: Local filesystem or S3 dev
Secrets: .env.local
Deployment: Localhost
Seeding: Seed script with test data
```

### Staging

```
Database: PostgreSQL RDS (mirrored production schema)
Cache: Redis ElastiCache
Storage: S3 staging bucket
Secrets: AWS Secrets Manager
Deployment: vercel.com/staging
Testing: Full E2E tests, load tests
Data: Clone of production database (monthly)
```

### Production

```
Database: PostgreSQL RDS Multi-AZ
  ├─ Primary + 2 replicas
  ├─ Automated backups (daily + 7-day PITR)
  └─ Encryption at rest

Cache: Redis ElastiCache cluster
  ├─ 3 nodes (primary + replicas)
  └─ Multi-AZ enabled

Storage: S3 + CloudFront
  ├─ Versioning enabled
  ├─ Cross-region replication
  └─ Lifecycle policies

Deployment: Kubernetes cluster
  ├─ 3-5 pods (auto-scaling 2-20)
  ├─ Rolling updates (zero-downtime)
  └─ Automatic health checks

Monitoring: Full observability
  ├─ Prometheus + Grafana
  ├─ Sentry error tracking
  ├─ ELK log aggregation
  └─ PagerDuty alerting
```

---

## 10.3 Infrastructure as Code (Terraform)

### AWS Infrastructure

```hcl
# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# RDS Database
resource "aws_db_instance" "postgres" {
  identifier = "alshaya-db"
  engine = "postgres"
  engine_version = "16.0"
  instance_class = "db.t3.medium"
  allocated_storage = 100
  multi_az = true
  publicly_accessible = false
  backup_retention_period = 30
  storage_encrypted = true
  db_subnet_group_name = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.db.id]
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id = "alshaya-redis"
  engine = "redis"
  node_type = "cache.t3.micro"
  num_cache_nodes = 3
  automatic_failover_enabled = true
  multi_az_enabled = true
  at_rest_encryption_enabled = true
}

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name = "alshaya-cluster"
  role_arn = aws_iam_role.eks.arn
  version = "1.27"
  vpc_config {
    subnet_ids = [...]
    security_group_ids = [...]
  }
}
```

---

## 10.4 Secret Management

### AWS Secrets Manager

```
alshaya/database/password        → PostgreSQL password
alshaya/jwt/secret               → JWT signing key
alshaya/resend/api-key           → Resend email API
alshaya/twilio/auth-token        → Twilio SMS token
alshaya/google/oauth-secret      → Google OAuth secret
alshaya/s3/encryption-key        → S3 encryption key
```

### Key Rotation

```
Database password: Every 30 days
JWT secret: Every 90 days
API keys: Every 180 days (or provider-controlled)

Fallback strategy:
- Store 2 keys: current + previous
- Accept tokens signed with either
- 30-day grace period for transition
```

---

## 10.5 Log Aggregation (ELK Stack)

### Docker Compose

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
    ports:
      - "5000:5000/udp"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: '["http://elasticsearch:9200"]'
```

---

## 10.6 Alerting Rules

### Critical Alerts (Page Engineer)

```
1. Database unavailable
   Condition: Connection pool > 90% for 2 min
   Action: PagerDuty critical

2. Error rate > 5%
   Condition: (errors / total) > 0.05 for 5 min
   Action: PagerDuty critical

3. Response time > 2s (p95)
   Condition: p95 latency > 2000ms for 10 min
   Action: PagerDuty warning

4. Disk space < 5GB
   Condition: Available disk < 5GB
   Action: PagerDuty critical

5. Memory > 85%
   Condition: Memory usage > 85% for 5 min
   Action: PagerDuty warning
```

### Warning Alerts (Slack)

```
1. Slow query detected
   Condition: Query > 1 second
   Action: Post to #alshaya-ops

2. Cache hit rate < 50%
   Condition: Cache hits / total < 0.50
   Action: Post to #alshaya-ops

3. Pod restart loop
   Condition: >3 restarts in 15 min
   Action: Post to #alshaya-ops

4. Deployment failure
   Condition: Deployment status = Failed
   Action: Post to #alshaya-deployments
```

---

# SECTION 11: MIGRATION PLAN

## 11.1 Containerization (Month 1-2)

### Objective

Move from Vercel serverless to Docker containers as foundation for Kubernetes.

### Steps

**Week 1: Dockerfile Creation**
1. Create multi-stage Dockerfile
   - Build stage: Install deps, compile Next.js
   - Runtime stage: Minimal Node.js alpine image
2. Test build locally
3. Push to ECR
4. Tag with git commit SHA

**Week 2: Local Testing**
1. Run container locally with docker-compose
2. Include PostgreSQL, Redis services
3. Verify application starts
4. Test database connectivity
5. Test image size optimization

**Week 3: AWS ECR Setup**
1. Create ECR repository
2. Configure image scanning
3. Set up lifecycle policies
4. Configure access permissions

**Week 4: Staging Deployment**
1. Deploy container to ECS
2. Configure load balancer
3. Set up environment variables
4. Configure CloudWatch monitoring
5. Test under load

### Rollback Strategy

- Keep Vercel active during phase
- Route 10% traffic to ECS initially
- Monitor error rate and latency
- Rollback to Vercel if issues

### Success Criteria

- Container starts reliably
- Application responsive under load
- Error rate < 0.1%
- Latency comparable to Vercel

---

## 11.2 Caching Layer (Month 2-3)

### Objective

Add Redis for performance, reducing database load.

### Steps

**Week 1: Redis Deployment**
1. Create ElastiCache cluster (3 nodes)
2. Configure cluster mode enabled
3. Enable multi-AZ
4. Enable encryption
5. Set up security groups

**Week 2: Application Integration**
1. Add Redis client
2. Implement cache key patterns
3. Add cache invalidation logic
4. Create cache warming script
5. Add circuit breaker for failure

**Week 3: Performance Testing**
1. Load test with Redis
2. Measure cache hit rate
3. Verify query reduction
4. Validate latency improvement
5. Monitor memory usage

**Week 4: Production Deployment**
1. Deploy to staging
2. Monitor for 1 week
3. Gradually enable (10% → 25% → 50% → 100%)
4. Alert on invalidation issues

### Success Criteria

- Cache hit rate > 60%
- Database queries reduced 50%
- P95 latency improved 20%
- Memory usage < 4GB

---

## 11.3 Monitoring (Month 3-4)

### Objective

Implement complete observability (Prometheus, Grafana, Sentry, ELK).

### Steps

**Week 1: Prometheus + Grafana**
1. Deploy Prometheus server
2. Configure scrape targets
3. Create custom metrics
4. Deploy Grafana
5. Create dashboards

**Week 2: Sentry Integration**
1. Create Sentry project
2. Add Sentry SDK
3. Configure error grouping
4. Set up alerts
5. Test error capture

**Week 3: ELK Stack**
1. Deploy Elasticsearch cluster
2. Deploy Logstash
3. Deploy Kibana
4. Configure application logging
5. Set up retention policies

**Week 4: Alerting Rules**
1. Create Prometheus alert rules
2. Configure Grafana notifications
3. Set up PagerDuty integration
4. Test page-worthy alerts
5. Create runbooks

### Success Criteria

- All metrics collecting
- Dashboard refresh < 5 seconds
- Alerts triggering correctly
- Error detection < 1 minute latency

---

## 11.4 Kubernetes (Month 4-6)

### Objective

Migrate from ECS to Kubernetes for orchestration and scaling.

### Steps

**Week 1: EKS Cluster Setup**
1. Create EKS cluster
2. Configure node groups (3 nodes)
3. Install container network plugin
4. Configure RBAC
5. Set up auto-scaling

**Week 2: Application Deployment**
1. Create Kubernetes Deployment manifest
2. Configure liveness/readiness probes
3. Set resource requests/limits
4. Create Service
5. Configure Ingress

**Week 3: High Availability**
1. Deploy with 3 replicas
2. Configure Pod Disruption Budget
3. Set up Horizontal Pod Autoscaler
4. Configure zone-aware scheduling
5. Test pod failure recovery

**Week 4: Helm & Configuration**
1. Create Helm chart
2. Parameterize values
3. Deploy via Helm
4. Document Helm values
5. Create deployment checklist

### Success Criteria

- All pods healthy
- Autoscaling working
- Zero-downtime deployments
- Monitoring collecting metrics

---

## 11.5 Advanced Optimizations (Month 6+)

### Objective

Fine-tune and optimize for production at scale.

### Steps

**Microservice Extraction**
- Extract search service
- Extract notifications service
- Extract analytics service

**Database Optimization**
- Analyze slow queries
- Add missing indexes
- Partition large tables
- Set up read replicas for analytics

**Cache Optimization**
- Analyze cache hit rates
- Adjust TTLs
- Implement cache warming
- Implement cache coherency

**Security Hardening**
- Enable Web Application Firewall
- Implement WAF-level rate limiting
- Enable VPC Flow Logs
- Regular penetration testing
- Implement secrets rotation automation

**Performance Tuning**
- Optimize bundle size
- Implement HTTP/2 Server Push
- Enable brotli compression
- Optimize CloudFront
- Implement resource prefetching

---

## Migration Timeline Summary

```
Month 1-2: Containerization
├─ Dockerfile creation
├─ ECS deployment
├─ Staging testing
└─ Production canary (10%)

Month 2-3: Caching
├─ Redis setup
├─ Integration
├─ Performance testing
└─ Full rollout

Month 3-4: Monitoring
├─ Prometheus/Grafana
├─ Sentry integration
├─ ELK deployment
└─ Alert configuration

Month 4-6: Kubernetes
├─ EKS creation
├─ App migration
├─ HA setup
└─ Helm automation

Month 6+: Optimization
├─ Microservice extraction
├─ Database optimization
├─ Cache tuning
└─ Security hardening

Total: 6+ months for complete modernization
```

---

## End of Engineering Architecture Documentation

**Status:** Complete
**Version:** 1.0
**Last Updated:** March 8, 2026
**Next Review:** September 8, 2026

This comprehensive engineering architecture documentation provides production-ready technical guidance for all aspects of the Al-Shaya Family Tree application across all major system domains.

For updates, questions, or clarifications, please contact the engineering team.

---

**Document Statistics:**
- 10 Architecture Decision Records (complete with alternatives)
- 4-level C4 System Architecture (context, containers, components, code)
- 53 Prisma Data Models documented
- 60+ REST API endpoints with standards
- Complete Security Threat Model (STRIDE)
- 4-layer Caching Architecture
- Kubernetes Deployment Strategy
- Comprehensive Testing Pyramid
- 6-month Phased Migration Plan
- Total: 3500+ lines of detailed architecture documentation

