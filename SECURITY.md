# Security Checklist & Data Retention Policy

This document outlines the security measures and data handling policies for the My Kasbai application.

---

## 1. Security Checklist

### Authentication & Authorization
-   [x] Passwords are not stored in plaintext; they are hashed using `bcrypt`.
-   [x] JWTs are used for stateless authentication with short-lived access tokens.
-   [x] Secure refresh token mechanism is implemented for session persistence.
-   [x] All sensitive API endpoints are protected by an authentication guard.
-   [x] Rate limiting is enabled on all API endpoints, especially auth, to prevent brute-force attacks.
-   [ ] Password strength meter (`zxcvbn`) is implemented on the frontend.
-   [ ] Multi-Factor Authentication (MFA/2FA) could be considered for future implementation.

### Data Protection
-   [x] Communication is encrypted end-to-end via TLS/SSL (handled by Nginx).
-   [x] Sensitive data (like raw statement files) is encrypted at rest (e.g., using filesystem-level encryption or application-level encryption like AES-256).
-   [x] Personally Identifiable Information (PII) is minimized. Card/account numbers are masked in the database (only the last 4 digits are stored).
-   [x] Raw uploaded files are stored in a non-public, access-controlled directory.
-   [x] Regular security audits and penetration tests should be scheduled.

### AI & Privacy
-   [x] User consent is required before sending data to an external AI provider.
-   [x] A "local" AI provider option is available to disable external calls.
-   [x] Data sent to AI providers is anonymized: names, account numbers, and other PII are stripped from transaction descriptions before analysis.
-   [x] The application provides a clear privacy policy to the user.

### Infrastructure & Operations
-   [x] Application services run on a private Docker network, with only necessary ports exposed to the host (`127.0.0.1`).
-   [x] Nginx is configured with security headers (X-Frame-Options, X-XSS-Protection, CSP).
-   [x] `CORS` is restricted to the frontend domain.
-   [x] `helmet` is used in the NestJS API for standard security hardening.
-   [x] Secrets (`.env` file) are not committed to version control.
-   [ ] A robust secret management solution (like HashiCorp Vault or AWS Secrets Manager) should be used for production secrets.
-   [x] Audit logs are generated for key events (login, file upload, analysis request) but do not contain PII.

---

## 2. Data Retention Policy

This policy defines how long user data is stored and how it is deleted.

### Raw Statement Files
-   **What:** The original PDF, CSV, or XLSX file uploaded by the user.
-   **Storage:** Stored in an encrypted, non-public location.
-   **Retention Period:** A maximum of **30 days** for processing and troubleshooting purposes.
-   **Deletion:**
    -   Users can manually trigger an immediate deletion of a raw file from their dashboard.
    -   An automated cron job will hard-delete any raw files older than 30 days.

### Transaction Data
-   **What:** The normalized transaction records stored in the PostgreSQL database.
-   **Retention Period:** Retained as long as the user's account is active and they have provided consent. This data is necessary for the core functionality of the app.
-   **Deletion:**
    -   When a user deletes their account, their transaction data is initially **soft-deleted** (marked for deletion).
    -   After a grace period of **7 days**, an automated process will **hard-delete** the soft-deleted records from the database. This allows for accidental deletion recovery.

### Analysis Reports
-   **What:** The JSON output from the AI analysis.
-   **Retention Period:** Retained along with the transaction data, as it is derived from it.
-   **Deletion:** Deleted along with the user's account data, following the same soft-delete + hard-delete process.

### User Account Data
-   **What:** User's email and hashed password.
-   **Retention Period:** Retained as long as the account is active.
-   **Deletion:** Follows the same 7-day soft-delete/hard-delete process upon user request to ensure all associated data can be purged.
