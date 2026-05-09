import knex from 'knex';
import config from './index.js';
import logger from '../utils/logger.js';

const db = knex({
  client: 'pg',
  connection:
    process.env.NODE_ENV === 'production'
      ? {
        connectionString: config.db.url,
        ssl: { rejectUnauthorized: false },
      }
      : {
        host: config.db.host,
        port: config.db.port,
        database: config.db.database,
        user: config.db.user,
        password: config.db.password,
      },

  pool: {
    min: config.db.pool.min,
    max: config.db.pool.max,
  },
  migrations: {
    directory: './database/migrations',
    extension: 'js',
  },
  seeds: {
    directory: './database/seeds',
    extension: 'js',
  },
});

export const testDbConnection = async () => {
  try {
    await db.raw('SELECT 1');
    logger.info('✅ Database connection established');
  } catch (err) {
    logger.error('❌ Database connection failed', { error: err.message });
    throw err;
  }
};

export default db;
