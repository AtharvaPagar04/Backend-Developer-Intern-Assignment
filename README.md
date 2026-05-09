# TaskFlow — Backend Developer Intern Assignment

<p>
  <a href="https://github.com/AtharvaPagar04/Backend-Developer-Intern-Assignment">
    <img src="https://img.shields.io/badge/GitHub-Backend--Developer--Intern--Assignment-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
  &nbsp;
  <a href="https://portfolio-kappa-nine-4tzfdgmj5g.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-Atharva%20Pagar-6366F1?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
</p>

A full-stack task management system built as a Backend Developer Intern assignment. The project demonstrates production-oriented architecture patterns: layered separation of concerns, JWT-based authentication with RBAC, ownership-enforced CRUD, OpenAPI documentation, and containerised deployment via Docker Compose.

---

## Features

### Backend
- **JWT authentication** — HS256 signed tokens, configurable expiry, timing-safe login
- **Password security** — bcrypt hashing (cost 12), plaintext never stored or returned
- **Role-based access control** — `user` and `admin` roles enforced at the middleware layer
- **Ownership enforcement** — users can only read/modify their own tasks; admins have full visibility
- **Task CRUD** — create, list, get, update, and soft-delete tasks
- **Pagination & filtering** — page/limit (1–100), status and priority filters on list endpoint
- **Soft deletes** — `deleted_at` timestamp; records are never physically removed
- **Centralized error handling** — typed `AppError` hierarchy, consistent JSON error envelope
- **Input validation** — Zod schemas on all request bodies and query strings
- **Rate limiting** — configurable via environment variables
- **API documentation** — auto-generated Swagger UI at `/api-docs`
- **Structured logging** — Winston with configurable log levels

### Frontend
- **Login & Register pages** — form validation, inline error messages, auto-login after registration
- **Protected dashboard** — redirect to login for unauthenticated users; session restored on refresh
- **Task management UI** — create, update status, and soft-delete tasks directly from the dashboard
- **Pagination & filters** — status and priority filter dropdowns, previous/next page controls
- **Loading states** — skeleton cards while fetching, inline "Refreshing…" indicator
- **Error states** — API error messages surfaced inline, never swallowed silently
- **Responsive layout** — works on mobile and desktop

### Testing
- **42 integration tests** across 4 suites (auth, RBAC, tasks, health)
- Tests run against a real PostgreSQL instance — no mocking of the DB layer
- Each suite manages its own fixtures and tears down after completion

---

## Architecture

```
Browser (React + Vite)
        │
        ▼
   Nginx (port 80)          ← serves static frontend build
        │                   ← proxies /api/* to backend
        ▼
  Express API (port 5000)   ← REST API, JWT auth, business logic
        │
        ▼
  PostgreSQL (port 5432)    ← data persistence, uuid primary keys
```

**Request lifecycle:**

```
Route → validate middleware (Zod) → authenticate middleware (JWT)
      → authorizeRoles middleware (RBAC) → Controller
      → Service (business logic + ownership check)
      → Repository (Knex query builder)
      → PostgreSQL
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (ESM) |
| Framework | Express 4 |
| Database | PostgreSQL 16 |
| Query builder | Knex |
| Validation | Zod |
| Authentication | jsonwebtoken + bcryptjs |
| API docs | swagger-jsdoc + swagger-ui-express |
| Logging | Winston |
| Frontend | React 19 + Vite 8 |
| Routing | React Router v7 |
| Data fetching | TanStack React Query v5 |
| Styling | TailwindCSS v4 |
| HTTP client | Axios |
| Testing | Jest + Supertest |
| Containerisation | Docker + Docker Compose |
| Reverse proxy | Nginx |

---

## Folder Structure

```
.
├── backend/
│   ├── database/
│   │   ├── migrations/         # Knex migration files (users, tasks, refresh_tokens)
│   │   └── seeds/
│   ├── src/
│   │   ├── config/             # Environment config, database connection, Swagger setup
│   │   ├── middleware/         # authenticate, authorizeRoles, validate, validateQuery, errorHandler
│   │   ├── modules/
│   │   │   ├── auth/           # auth.schema, auth.repository, auth.service, auth.controller, auth.routes
│   │   │   ├── tasks/          # task.schema, task.repository, task.service, task.controller, task.routes
│   │   │   └── admin/          # admin.routes (ping endpoint, RBAC protected)
│   │   ├── routes/             # Root router + health check
│   │   └── utils/              # AppError hierarchy, asyncHandler, jwt, apiResponse, ownership
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── rbac.test.js
│   │   ├── tasks.test.js
│   │   └── health.test.js
│   ├── .env.example
│   ├── knexfile.js
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios client + authApi/tasksApi modules
│   │   ├── context/            # AuthContext (session restore, login, logout)
│   │   ├── hooks/              # useTasks, useCreateTask, useUpdateTask, useDeleteTask
│   │   ├── components/         # Button, FormField, Badge, Navbar, TaskCard, CreateTaskForm, ProtectedRoute
│   │   └── pages/              # LoginPage, RegisterPage, DashboardPage
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## API Documentation

When the backend is running, interactive API documentation is available at:

```
http://localhost:5000/api-docs
```

The Swagger UI documents all endpoints with:
- Request body schemas and validation rules
- Response schemas for success and error cases
- Reusable component schemas (User, Task, Pagination, error envelopes)
- Security requirements per endpoint
- Role restrictions and ownership rules in endpoint descriptions

---

## Authentication & Security

| Mechanism | Detail |
|---|---|
| Token format | HS256 JWT, signed with `JWT_SECRET` |
| Token delivery | `Authorization: Bearer <token>` header |
| Token expiry | Configurable via `JWT_ACCESS_EXPIRES_IN` (default `15m`) |
| Password storage | bcrypt, cost factor 12 |
| User enumeration | Timing-safe login — bcrypt always runs even for unknown emails |
| Soft-deleted accounts | Cannot authenticate or re-register with the same email |
| Role enforcement | Middleware rejects insufficient roles before reaching controller |
| Ownership enforcement | Service layer asserts `task.user_id === req.user.userId` (admin bypasses) |
| Algorithm pinning | JWT sign and verify both specify `HS256` explicitly |
| Rate limiting | Configurable via `RATE_LIMIT_WINDOW_MS` + `RATE_LIMIT_MAX` |

---

## Database Design

Three tables managed via Knex migrations:

**`users`**
- `id` UUID PK, `name`, `email` (unique), `password` (hashed), `role` enum(`user`,`admin`), `is_active`, timestamps, `deleted_at`

**`tasks`**
- `id` UUID PK, `user_id` FK→users (CASCADE), `title`, `description`, `status` enum, `priority` enum, `due_date`, timestamps, `deleted_at`

**`refresh_tokens`**
- `id` UUID PK, `user_id` FK→users (CASCADE), `token`, `expires_at`, timestamps (scaffolded for future rotation)

All tables use native PostgreSQL UUID generation and enum types. Soft deletes are implemented via `deleted_at IS NULL` filters in all repository queries.

---

## Frontend Features

| Feature | Implementation |
|---|---|
| Session persistence | `AuthContext` calls `GET /auth/me` on mount using stored token |
| Global 401 handling | Axios interceptor dispatches `auth:logout` event → AuthContext clears state |
| Protected routes | `ProtectedRoute` redirects to `/login` with the intended destination saved in router state |
| Public-only routes | `PublicOnlyRoute` redirects authenticated users back to `/dashboard` |
| Optimistic cache invalidation | All task mutations call `invalidateQueries([TASKS_KEY])` |
| Stale-while-revalidate | `placeholderData` keeps previous results visible during filter refetches |
| Admin visibility | Admins see all tasks with an "All Tasks" heading; role badge shown in navbar |

---

## Environment Separation

The project uses **two separate env files** to prevent local tools from accidentally connecting to Docker hostnames.

| File | Used by | DB_HOST | DB_PORT |
|---|---|---|---|
| `backend/.env` | Local dev (`npm run dev`) and Jest (`npm test`) | `localhost` | `5433` |
| `backend/.env.docker` | Docker Compose containers | `db` (Docker network) | `5432` |

> **Why two files?** Inside Docker, the database is reachable at the hostname `db` (the service name).
> Outside Docker, the same database is exposed on the host machine at `localhost:5433`.
> Mixing these up causes the `getaddrinfo ENOTFOUND db` error in local Jest runs.

---

## Docker Deployment

### Prerequisites

- Docker Engine ≥ 24
- Docker Compose v2

### Steps

**1. Configure the Docker environment file:**

```bash
cp backend/.env.example backend/.env.docker
# Edit backend/.env.docker:
#   DB_HOST=db          ← Docker service name, do not change
#   DB_PORT=5432        ← Internal Docker port, do not change
#   JWT_SECRET=<long random string>
#   DB_PASSWORD=<secure password>
```

**2. Build and start all services:**

```bash
docker compose up --build -d
```

**3. Run database migrations inside the backend container:**

```bash
docker compose exec backend npm run migrate
```

**4. Access the application:**

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost/api/v1 |
| Swagger UI | http://localhost:5000/api-docs |
| Health check | http://localhost/api/v1/health |

**Stop and remove containers:**

```bash
docker compose down
# To also remove the database volume:
docker compose down -v
```

---

## Local Development Setup

### Prerequisites

- Node.js ≥ 20
- PostgreSQL 16 running locally (or via Docker — see below)

### 1. Start a local PostgreSQL instance

If you don't have PostgreSQL installed locally, run it in Docker:

```bash
docker run -d \
  --name intern_db \
  -e POSTGRES_DB=intern_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  postgres:16-alpine
```

### 2. Configure the local environment file

```bash
cp backend/.env.example backend/.env
```

Verify (or set) the following values in `backend/.env`:

```env
DB_HOST=localhost   # must be localhost, NOT db
DB_PORT=5433        # must match the -p flag above
DB_NAME=intern_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=<at least 64 random characters>
```

> **Note:** Never set `DB_HOST=db` in `backend/.env`. That hostname only resolves inside the Docker network.

### 3. Install dependencies and run migrations

```bash
cd backend
npm install
npm run migrate
```

### 4. Start the backend dev server

```bash
npm run dev        # starts on http://localhost:5000
```

### 5. Start the frontend dev server

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so no extra CORS configuration is needed during local development.

---

## Environment Variables

### Backend (`.env` / `.env.docker`)

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `5000` | HTTP server port |
| `API_VERSION` | `v1` | API path prefix |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `intern_db` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_POOL_MIN` | `2` | Knex connection pool minimum |
| `DB_POOL_MAX` | `10` | Knex connection pool maximum |
| `JWT_SECRET` | — | **Required.** Minimum 64 characters |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token lifetime |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window per IP |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `LOG_LEVEL` | `debug` | Winston log level |

### Frontend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api/v1` | Backend API base URL (optional; defaults to Vite proxy) |

---

## Running Tests

Tests require a running PostgreSQL instance. Set the database credentials in `backend/.env` before running.

```bash
cd backend

# Run all test suites
npm test

# Run a specific suite
npm test -- --testPathPattern="auth"
npm test -- --testPathPattern="tasks"
npm test -- --testPathPattern="rbac"

# Run with coverage
npm run test:coverage
```

**Test coverage by suite:**

| Suite | Tests | Covers |
|---|---|---|
| `health.test.js` | 2 | DB reachability, response format |
| `auth.test.js` | 11 | Register, login, `/auth/me`, validation, duplicates |
| `rbac.test.js` | 5 | Admin-only access, 403 on insufficient role, 401 scenarios |
| `tasks.test.js` | 24 | Full CRUD, ownership enforcement, filters, pagination, soft-delete |
| **Total** | **42** | |

---

## Scalability Notes

The architecture is structured to grow without major rewrites:

- **Modular routing** — each domain (auth, tasks, admin) is an isolated module; adding a new feature means adding a new folder, not modifying existing files.
- **Repository pattern** — all database access is behind a repository interface; switching query strategies or adding caching requires changes in one place.
- **Connection pooling** — Knex is configured with min/max pool settings via environment variables.
- **Environment-driven config** — secrets, limits, and infrastructure settings are all externalised; no hardcoded values in application code.
- **Soft deletes** — data is retained for potential recovery or audit purposes without additional infrastructure.

---

## Future Improvements

- **Refresh token rotation** — the `refresh_tokens` table is already migrated; endpoint implementation is the remaining step.
- **Admin moderation endpoints** — list all users, activate/deactivate accounts, view any task.
- **Task assignment** — allow admins to assign tasks to specific users.
- **Email notifications** — task due-date reminders via a background job queue (e.g., BullMQ).
- **Containerised test runner** — run Jest against a dedicated test DB container in CI.
- **OpenID Connect / OAuth** — social login as an alternative authentication path.

---

## Screenshots

> _Run the project locally or via Docker to see the live UI._

| Page | Description |
|---|---|
| `/login` | Centred card with email/password fields and "Create one" link |
| `/register` | Three-field registration form; auto-logs in on success |
| `/dashboard` | Task list with status/priority filters, pagination, inline create form, and per-card edit/delete |

---

## Author

Built as a Backend Developer Intern assignment.

- **Stack:** Node.js · Express · PostgreSQL · React · Docker
- **Tests:** 42 passing integration tests
- **Docs:** Swagger/OpenAPI at `/api-docs`
