
import express from 'express';
import { swaggerUi, swaggerSpec } from './config/swagger';
import authRouter from './routes/auth';
import listRouter from './routes/list';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api', listRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

export default app;
