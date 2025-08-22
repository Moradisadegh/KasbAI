# My Kasbai - Financial Analysis Web App

This is a monorepo for the My Kasbai project, a web application for securely analyzing personal bank statements.

## Project Structure

- `apps/web`: Next.js 14 frontend (`/app`)
- `apps/api`: NestJS 10 backend (`/app/api`)
- `packages/parsers`: Shared logic for parsing statement files.
- `packages/ui`: Shared React components.
- `infra/`: Infrastructure as Code (Docker, Nginx, Scripts).

## Prerequisites

- `git`
- `pnpm` (version 8.x or higher)
- `docker` and `docker-compose-plugin`

## Development Setup (Local)

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd mykasbai-monorepo
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Setup environment variables:**
    -   You will need a local PostgreSQL instance running.
    -   Copy `apps/api/.env.example` to `apps/api/.env` and configure your local `DATABASE_URL`.
    -   Copy `apps/web/.env.example` to `apps/web/.env.local` and configure it for local development.

4.  **Run database migrations:**
    ```bash
    pnpm -F apps/api prisma migrate dev
    ```

5.  **Run the development servers:**
    This will start the Next.js app and NestJS API in parallel.
    ```bash
    pnpm dev
    ```
    -   Web app will be available at `http://localhost:3000/app`
    -   API will be available at `http://localhost:3001/app/api`

## Production Deployment (Docker)

These steps are for deploying on a production server. See `infra/scripts/bootstrap.sh` for first-time server setup.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url> /opt/mykasbai
    cd /opt/mykasbai
    ```

2.  **Configure Environment:**
    -   Copy `.env.example` to `.env`.
    -   **Crucially, change all default passwords and secrets!**

3.  **Set up Nginx and SSL:**
    -   Copy `infra/nginx/mykasbai.ir.conf` to `/etc/nginx/sites-available/`.
    -   Create a symlink to `/etc/nginx/sites-enabled/`.
    -   Obtain SSL certificates using `certbot`.
    -   Reload Nginx: `sudo systemctl reload nginx`.

4.  **Run the deployment script:**
    This script handles pulling the latest code, building images, and running migrations.
    ```bash
    ./infra/scripts/deploy.sh
    ```

## Running Tests

-   **Run all tests:**
    ```bash
    pnpm test
    ```
-   **Run API E2E tests:**
    ```bash
    pnpm test:e2e
    ```
