import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import apiRouter from './routes/index.js';
import notFoundHandler from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

// ─── Security & Transport ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(compression());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── HTTP Request Logging ─────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: () => config.app.env === 'test',
  }),
);

// ─── API Docs ─────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use(`/api/${config.app.apiVersion}`, apiRouter);

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
