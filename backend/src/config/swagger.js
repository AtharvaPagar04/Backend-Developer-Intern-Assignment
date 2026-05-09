import swaggerJSDoc from 'swagger-jsdoc';
import config from './index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Intern Assignment API',
      version: '1.0.0',
      description: 'REST API documentation for the Backend Developer Intern assignment',
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}/api/${config.app.apiVersion}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/modules/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
