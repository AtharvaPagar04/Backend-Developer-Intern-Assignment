// Knex CLI config (used by migrate/seed scripts)
// Must be CommonJS-compatible or use .cjs extension when package.json has "type":"module"

import 'dotenv/config';

/**
 * @type { import("knex").Knex.Config }
 */
const config = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'intern_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'intern_db_test',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './database/migrations',
    },
  },
};

export default config;
