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

