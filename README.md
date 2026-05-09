# Intern Assignment — Full-Stack Monorepo

A production-oriented full-stack monorepo built for the **Backend Developer Intern** assignment.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js · Express |
| Database | PostgreSQL |
| Query Builder | Knex |
| Frontend | React · Vite · TailwindCSS |
| Validation | Zod |
| Auth | JWT |
| API Docs | Swagger / OpenAPI 3.0 |
| Testing | Jest · Supertest |
| Containers | Docker · Docker Compose |

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # App config, DB client, Swagger spec
│   │   ├── modules/
│   │   │   ├── auth/        # Auth feature (register, login, tokens)
│   │   │   ├── users/       # Users CRUD
│   │   │   ├── tasks/       # Tasks CRUD
│   │   │   └── admin/       # Admin-only routes
│   │   ├── middleware/      # errorHandler, notFound, validate
│   │   ├── services/        # Business logic layer
│   │   ├── repositories/    # DB access layer (Knex)
│   │   ├── routes/          # Route aggregator + /health
│   │   ├── utils/           # logger, apiResponse, asyncHandler, errors
│   │   ├── shared/          # Cross-cutting DTOs / constants
│   │   ├── app.js           # Express app factory
│   │   └── server.js        # Process entry-point
│   ├── database/
│   │   ├── migrations/      # Knex migration files
│   │   └── seeds/           # Knex seed files
│   ├── tests/               # Jest + Supertest test suites
│   ├── docs/                # Additional API / design docs
│   ├── knexfile.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client + per-resource hooks
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Route-level page components
│   │   ├── utils/           # Helper functions
│   │   └── assets/          # Static assets
│   ├── vite.config.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 15 (or use Docker)
- npm ≥ 9

### Local Development (without Docker)

#### 1. Backend

```bash
cd backend
cp .env.example .env        # fill in DB credentials & JWT secret
npm install
npm run migrate             # run Knex migrations
npm run dev                 # starts on http://localhost:5000
```

#### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # starts on http://localhost:5173
```

### Docker (all services)

```bash
# Copy env files first
cp backend/.env.example backend/.env

docker compose up --build
```

| Service | URL |
|---|---|
| Backend API | http://localhost:5000/api/v1 |
| Swagger Docs | http://localhost:5000/api-docs |
| Health Check | http://localhost:5000/api/v1/health |
| Frontend | http://localhost (port 80) |

---

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload (nodemon) |
| `npm test` | Run all Jest tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run migrate` | Run pending Knex migrations |
| `npm run migrate:rollback` | Roll back last migration batch |
| `npm run seed` | Run Knex seed files |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | API + DB health check |
| — | `/api-docs` | Swagger UI |

> Additional endpoints will be documented here as they are implemented.

---

## Environment Variables

See [`backend/.env.example`](./backend/.env.example) and [`frontend/.env.example`](./frontend/.env.example) for all required variables.

---

## Contributing

1. Branch off `main` → `feature/<name>`
2. Run `npm run lint && npm test` before pushing
3. Open a PR with a descriptive title
