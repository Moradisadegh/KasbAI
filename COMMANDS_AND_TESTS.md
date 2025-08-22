# Commands, Tests, and Health Checks

This document lists key commands for development, production, and testing.

---

## 1. Key Commands

### Development
-   **Install all dependencies:**
    ```bash
    pnpm i
    ```
-   **Run all apps in parallel (API + Web):**
    ```bash
    pnpm -r dev
    ```

### Production (via Docker)
-   **Build and start all services in detached mode:**
    ```bash
    docker compose up -d --build
    ```
-   **Stop all services:**
    ```bash
    docker compose down
    ```
-   **View logs for a specific service:**
    ```bash
    docker compose logs -f api
    ```

### Database (Prisma)
-   **Run migrations in a production environment:**
    ```bash
    pnpm -F apps/api prisma migrate deploy
    ```
-   **Open Prisma Studio to view data:**
    ```bash
    pnpm -F apps/api prisma studio
    ```

---

## 2. Health Checks

-   **Check the Next.js frontend (via Nginx):**
    ```bash
    curl -I https://mykasbai.ir/app/
    # Expect HTTP/2 200
    ```
-   **Check the NestJS API health endpoint (unauthenticated):**
    ```bash
    curl -sS https://mykasbai.ir/app/api/healthz
    # Expect JSON response like {"status":"ok",...}
    ```
-   **Check an authenticated API endpoint (replace `<token>`):**
    ```bash
    curl -sS -H "Authorization: Bearer <token>" https://mykasbai.ir/app/api/statements
    # Expect a JSON array []
    ```

---

## 3. Test Suites

### API Tests (Jest/Supertest)
-   **Location:** `apps/api/test/`
-   **Run command:** `pnpm -F apps/api test` or `pnpm test:e2e`

-   **Example Test (`auth.e2e-spec.ts`):**
    ```typescript
    import * as request from 'supertest';
    import { Test } from '@nestjs/testing';
    import { AppModule } from '../src/app.module';
    import { INestApplication } from '@nestjs/common';

    describe('AuthController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('app/api');
        await app.init();
      });

      it('/app/api/auth/register (POST)', () => {
        return request(app.getHttpServer())
          .post('/app/api/auth/register')
          .send({ email: 'test@example.com', password: 'password123' })
          .expect(201);
      });

      // ... more tests for login, token refresh, etc.
    });
    ```

### Parser Unit Tests
-   **Location:** `packages/parsers/src/implementations/`
-   **Run command:** `pnpm -F parsers test`

-   **Example Test (`generic-csv.parser.spec.ts`):**
    ```typescript
    import { GenericCsvParser } from './generic-csv.parser';
    import * as fs from 'fs';
    import * as path from 'path';

    describe('GenericCsvParser', () => {
      it('should correctly parse a sample CSV file', async () => {
        const parser = new GenericCsvParser();
        const buffer = fs.readFileSync(path.join(__dirname, 'fixtures/sample.csv'));

        const result = await parser.parse(buffer);

        expect(result.bank_name).toBe('Generic CSV Bank');
        expect(result.txns.length).toBeGreaterThan(0);
        expect(result.txns[0].amount).toBe(100.50);
        expect(result.txns[0].type).toBe('debit');
      });
    });
    ```
### E2E Test Flow
- **Scenario**: Register, login, upload a file, see it processed, and get a mock analysis.
- **Tools**: Playwright or Cypress for browser automation, combined with API requests.
- **Steps**:
  1.  Programmatically register and log in via API to get a JWT.
  2.  Use the token to upload a fixture file (e.g., `sample.csv`) to the `/app/api/statements/upload` endpoint.
  3.  Poll the `/app/api/statements` endpoint until the status is `COMPLETED`.
  4.  Trigger the analysis endpoint (`/app/api/analysis`) with the statement ID.
  5.  Assert that the analysis result is returned correctly (using a mocked AI provider).
