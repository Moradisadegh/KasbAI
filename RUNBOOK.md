# My Kasbai - Operations Runbook

This document provides standard operating procedures (SOPs) for maintaining the My Kasbai application in production.

## 1. Deployment

**Objective:** Deploy the latest version of the application from the `main` branch.
**Prerequisites:** SSH access to the production server, `sudo` privileges.

**Steps:**
1.  SSH into the production server: `ssh user@mykasbai.ir`
2.  Navigate to the application directory: `cd /opt/mykasbai`
3.  Execute the deployment script:
    ```bash
    ./infra/scripts/deploy.sh
    ```
4.  **Verification:**
    -   Check the script output for any errors.
    -   Run health checks manually (see Section 5).
    -   Visit `https://mykasbai.ir/app` to ensure the frontend loads.
    -   Log in and test a core feature (e.g., view past statements).

## 2. Rollback

**Objective:** Revert to a previous stable version of the application.
**Trigger:** A critical bug is discovered in the latest deployment.

**Steps:**
1.  SSH into the production server.
2.  Navigate to the application directory: `cd /opt/mykasbai`
3.  Check out the previous commit/tag:
    ```bash
    git checkout <previous_commit_hash_or_tag>
    ```
4.  Re-run the deployment script. The script will use the code at the checked-out commit to build the images.
    ```bash
    ./infra/scripts/deploy.sh
    ```
5.  **Verification:** Confirm that the application is running the old version and the critical bug is no longer present.

## 3. Secret Rotation (e.g., JWT_SECRET)

**Objective:** Update an application secret with zero or minimal downtime.

**Steps:**
1.  Generate a new secret. For `JWT_SECRET`, use `openssl rand -hex 32`.
2.  SSH into the production server.
3.  Edit the `.env` file: `nano /opt/mykasbai/.env`
4.  Update the `JWT_SECRET` value with the new secret.
5.  Re-run the deployment script to restart the `api` service with the new environment variable:
    ```bash
    ./infra/scripts/deploy.sh
    ```
    *Note: This will invalidate all existing user sessions.*

## 4. Backup and Restore

### 4.1. Database Backup (PostgreSQL)

**Objective:** Create a logical backup of the PostgreSQL database.

**Command:**
```bash
docker compose exec -T postgres pg_dump -U kasbai_user -d mykasbai > backup_$(date +%F).sql
```
*This command should be run via a `cron` job daily.*

### 4.2. Database Restore

**Objective:** Restore the database from a backup file.
**WARNING: This is a destructive operation.**

**Steps:**
1.  Copy the backup file to the server.
2.  Stop the application: `docker compose down`
3.  Wipe the existing data volume (optional but recommended for a clean restore):
    ```bash
    docker volume rm mykasbai-monorepo_postgres_data
    ```
4.  Restart the database service to re-initialize the volume:
    ```bash
    docker compose up -d postgres
    ```
5.  Execute the restore command:
    ```bash
    cat backup_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U kasbai_user -d mykasbai
    ```
6.  Restart all services: `docker compose up -d --force-recreate`

## 5. Health Checks

**Objective:** Verify the status of application services.

-   **Nginx Status:** `sudo systemctl status nginx`
-   **Docker Containers:** `docker compose ps`
-   **Web App (via Nginx):** `curl -I https://mykasbai.ir/app/` (Expect a 200 OK)
-   **API Health Endpoint:** `curl https://mykasbai.ir/app/api/healthz` (Expect `{"status":"ok", ...}`)
-   **API Authenticated Endpoint:** `curl -H "Authorization: Bearer <token>" https://mykasbai.ir/app/api/statements` (Expect a JSON array)
