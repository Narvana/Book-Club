// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // Use OpenAPI 3.0
  info: {
    title: 'StorageJini API Documentation',
    version: '1.0.0',
    description: 'API documentation for the StorageJini Web App',
    contact: {
      name: 'MMR Solutions',
      url: 'http://mmrsolutions.co.in',
      email: 'contact@mmrsolutions.co.in',
    },
  },
  servers: [
    {
      url: 'http://localhost:1000', // Local server
    },
    {
      url: 'https://book-club-1-xca8.onrender.com', // Live server
    },
  ],
  components: { // Use components for security schemes in OpenAPI 3.0
    securitySchemes: {
      bearerAuth: {
        type: 'http', // Type should be http for bearer token
        scheme: 'bearer', // The scheme
        bearerFormat: 'JWT', // Optional, if using JWT
        description: 'Enter your Bearer token (JWT) here.'
      },
    },
  },
};

// Define options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./route/*.js'], // Path to the API docs (point to your route files)
};

// Generate swagger spec
const swaggerSpec = swaggerJSDoc(options);

// Export the middleware for use in your application
module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
