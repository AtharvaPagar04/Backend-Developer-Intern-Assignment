// Knex CLI config (used by migrate/seed scripts)
// Must be CommonJS-compatible or use .cjs extension when package.json has "type":"module"

import 'dotenv/config';
import appConfig from './src/config/index.js';
/**
 * @type { import("knex").Knex.Config }
 */
const knexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: appConfig.db.host,
      port: appConfig.db.port,
      database: appConfig.db.database,
      user: appConfig.db.user,
      password: appConfig.db.password,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    },
    migrations: {
      directory: './database/migrations',
      loadExtensions: ['.js'],
      extension: 'js',
    },
    seeds: {
      directory: './database/seeds',
      loadExtensions: ['.js'],
      extension: 'js',
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
      loadExtensions: ['.js'],
      extension: 'js',
    },
    seeds: {
      directory: './database/seeds',
      loadExtensions: ['.js'],
      extension: 'js',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './database/migrations',
      loadExtensions: ['.js'],
      extension: 'js',
    },
  },
};

export default knexConfig;
