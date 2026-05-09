import app from './app.js';
import config from './config/index.js';
import { testDbConnection } from './config/database.js';
import logger from './utils/logger.js';

const start = async () => {
  try {
    await testDbConnection();

    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 Server running in ${config.app.env} mode`);
      logger.info(`   API   → http://localhost:${config.app.port}/api/${config.app.apiVersion}`);
      logger.info(`   Docs  → http://localhost:${config.app.port}/api-docs`);
      logger.info(`   Health→ http://localhost:${config.app.port}/api/${config.app.apiVersion}/health`);
    });

    // ─── Graceful Shutdown ───────────────────────────────────────────────────
    const shutdown = (signal) => {
      logger.info(`${signal} received — shutting down gracefully…`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

start();
