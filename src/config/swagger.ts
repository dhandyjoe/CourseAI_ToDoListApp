import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'ToDo List API',
			version: '1.0.0',
			description: 'API documentation for ToDo List App',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [{ bearerAuth: [] }],
		servers: [
			{
				url: 'http://localhost:3000',
			},
		],
	},
	apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
