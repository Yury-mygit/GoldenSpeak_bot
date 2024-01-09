import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [
            {
                url: 'http://localhost:4001',
            },
        ],
        tags: [
            { name: 'user' },
        ],
    },
    apis: [
        './src/routes/*.ts',
        './src/user/router/user_routers.ts'
    ],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app: any) {
    app.use('/api.ts-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}