import swaggerJSDoc from 'swagger-jsdoc';
import config from './index.js';

const options = {
  definition: {
    openapi: '3.0.0',

    // ── Info ───────────────────────────────────────────────────────────────────
    info: {
      title: 'Intern Assignment API',
      version: '1.0.0',
      description: [
        '## Backend Developer Intern Assignment — REST API',
        '',
        'Full-stack API built with **Node.js + Express + PostgreSQL + Knex**.',
        '',
        '### Authentication',
        'All protected endpoints require a **Bearer JWT** token in the',
        '`Authorization` header: `Authorization: Bearer <token>`.',
        '',
        'Obtain a token via `POST /auth/login`.',
        '',
        '### Roles',
        '- **user** — default role; can manage their own tasks.',
        '- **admin** — can view/manage all tasks and access admin endpoints.',
        '',
        '### Soft Deletes',
        'Tasks are soft-deleted (the `deleted_at` timestamp is set).',
        'Soft-deleted records are excluded from all list and lookup responses.',
      ].join('\n'),
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
      },
    },

    // ── Servers ────────────────────────────────────────────────────────────────
    servers: [
      {
        url: `http://localhost:${config.app.port}/api/${config.app.apiVersion}`,
        description: 'Local Development Server',
      },
      {
        url: `http://localhost/api/${config.app.apiVersion}`,
        description: 'Docker Compose Server (port 80)',
      },
    ],

    // ── Tags ───────────────────────────────────────────────────────────────────
    tags: [
      { name: 'Health', description: 'Service liveness and dependency checks' },
      { name: 'Auth',   description: 'Registration, login, and current-user profile' },
      { name: 'Tasks',  description: 'Task CRUD with ownership enforcement and soft-delete' },
      { name: 'Admin',  description: 'Admin-only endpoints (role: admin required)' },
    ],

    // ── Global security default ────────────────────────────────────────────────
    security: [{ BearerAuth: [] }],

    // ── Reusable components ────────────────────────────────────────────────────
    components: {

      // ── Security schemes ────────────────────────────────────────────────────
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtained from `POST /auth/login`. Expires per `JWT_ACCESS_EXPIRES_IN` env var (default 15 min).',
        },
      },

      // ── Reusable schemas ────────────────────────────────────────────────────
      schemas: {

        // ── Domain objects ───────────────────────────────────────────────────
        User: {
          type: 'object',
          description: 'A sanitised user record. The `password` field is never included.',
          properties: {
            id:         { type: 'string', format: 'uuid',      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            name:       { type: 'string',                      example: 'Jane Doe' },
            email:      { type: 'string', format: 'email',     example: 'jane@example.com' },
            role:       { type: 'string', enum: ['user', 'admin'], example: 'user' },
            is_active:  { type: 'boolean',                     example: true },
            created_at: { type: 'string', format: 'date-time', example: '2025-05-09T10:00:00.000Z' },
            updated_at: { type: 'string', format: 'date-time', example: '2025-05-09T10:00:00.000Z' },
          },
        },

        Task: {
          type: 'object',
          description: 'A task record. Soft-deleted tasks (deleted_at set) are excluded from all API responses.',
          properties: {
            id:          { type: 'string', format: 'uuid',      example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890' },
            user_id:     { type: 'string', format: 'uuid',      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the owning user' },
            title:       { type: 'string',                      example: 'Finish API documentation' },
            description: { type: 'string', nullable: true,      example: 'Add Swagger annotations to all routes' },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'archived'],
              example: 'in_progress',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high',
            },
            due_date:    { type: 'string', format: 'date', nullable: true, example: '2025-06-01' },
            created_at:  { type: 'string', format: 'date-time', example: '2025-05-09T10:00:00.000Z' },
            updated_at:  { type: 'string', format: 'date-time', example: '2025-05-09T12:00:00.000Z' },
          },
        },

        Pagination: {
          type: 'object',
          description: 'Pagination metadata included in list responses.',
          properties: {
            total:       { type: 'integer', example: 42,    description: 'Total number of records matching the query' },
            page:        { type: 'integer', example: 1,     description: 'Current page number (1-indexed)' },
            limit:       { type: 'integer', example: 20,    description: 'Maximum records per page' },
            totalPages:  { type: 'integer', example: 3,     description: 'Total number of pages' },
            hasNextPage: { type: 'boolean', example: true,  description: 'Whether a next page exists' },
            hasPrevPage: { type: 'boolean', example: false, description: 'Whether a previous page exists' },
          },
        },

        // ── Request bodies ───────────────────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string', minLength: 2, maxLength: 100, example: 'Jane Doe' },
            email:    { type: 'string', format: 'email',              example: 'jane@example.com' },
            password: { type: 'string', minLength: 8, maxLength: 128, example: 'Str0ng!Pass', description: 'Will be bcrypt-hashed before storage. Never returned in any response.' },
          },
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 1,    example: 'Str0ng!Pass' },
          },
        },

        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title:       { type: 'string', minLength: 1, maxLength: 200, example: 'Write unit tests' },
            description: { type: 'string', maxLength: 5000, nullable: true, example: 'Cover all service layer functions' },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'archived'],
              default: 'pending',
              example: 'pending',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              default: 'medium',
              example: 'medium',
            },
            due_date: { type: 'string', format: 'date', nullable: true, example: '2025-06-01', description: 'ISO 8601 date string (YYYY-MM-DD)' },
          },
        },

        UpdateTaskRequest: {
          type: 'object',
          description: 'All fields are optional. At least one field must be present.',
          minProperties: 1,
          properties: {
            title:       { type: 'string', minLength: 1, maxLength: 200, example: 'Updated title' },
            description: { type: 'string', maxLength: 5000, nullable: true, example: 'Updated description' },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'archived'],
              example: 'completed',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high',
            },
            due_date: { type: 'string', format: 'date', nullable: true, example: '2025-07-15' },
          },
        },

        // ── Success response envelopes ────────────────────────────────────────
        AuthResponse: {
          type: 'object',
          properties: {
            success:  { type: 'boolean', example: true },
            message:  { type: 'string',  example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user:        { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Short-lived JWT access token (HS256). Include as `Authorization: Bearer <token>`.' },
              },
            },
          },
        },

        RegisterResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Account created successfully' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },

        TaskResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Task retrieved' },
            data: {
              type: 'object',
              properties: {
                task: { $ref: '#/components/schemas/Task' },
              },
            },
          },
        },

        PaginatedTasksResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Tasks retrieved' },
            data: {
              type: 'object',
              properties: {
                tasks:      { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                pagination: { $ref: '#/components/schemas/Pagination' },
              },
            },
          },
        },

        UserProfileResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'User profile retrieved' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },

        HealthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Service healthy' },
            data: {
              type: 'object',
              properties: {
                api: { type: 'string', enum: ['ok'],          example: 'ok' },
                db:  { type: 'string', enum: ['ok', 'unreachable'], example: 'ok' },
              },
            },
          },
        },

        // ── Error response envelopes ─────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'An error occurred' },
          },
        },

        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code:    { type: 'string',  example: 'too_small' },
                  path:    { type: 'array',   items: { type: 'string' }, example: ['password'] },
                  message: { type: 'string',  example: 'Password must be at least 8 characters' },
                },
              },
            },
          },
        },

        UnauthorizedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'Authorization header missing or malformed' },
          },
        },

        ForbiddenResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'You do not have permission to access this resource' },
          },
        },

        NotFoundResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'Resource not found' },
          },
        },

        ConflictResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'An account with this email already exists' },
          },
        },
      },

      // ── Reusable parameters ─────────────────────────────────────────────────
      parameters: {
        TaskId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'UUID of the task',
          schema: { type: 'string', format: 'uuid', example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890' },
        },
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number (1-indexed). Defaults to 1.',
          schema: { type: 'integer', minimum: 1, default: 1, example: 1 },
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of records per page. Clamped between 1 and 100. Defaults to 20.',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20, example: 20 },
        },
        StatusFilter: {
          name: 'status',
          in: 'query',
          description: 'Filter tasks by status.',
          schema: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'archived'] },
        },
        PriorityFilter: {
          name: 'priority',
          in: 'query',
          description: 'Filter tasks by priority.',
          schema: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
      },

      // ── Reusable responses ──────────────────────────────────────────────────
      responses: {
        Unauthorized: {
          description: 'Missing, malformed, or expired Bearer token.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
            },
          },
        },
        Forbidden: {
          description: 'Authenticated but insufficient role or not the resource owner.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForbiddenResponse' },
            },
          },
        },
        NotFound: {
          description: 'The requested resource does not exist (or has been soft-deleted).',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotFoundResponse' },
            },
          },
        },
        ValidationError: {
          description: 'Request body or query parameters failed Zod validation.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.js', './src/modules/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

