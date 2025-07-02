import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth';

describe('POST /api/auth/login', () => {
	const app = express();
	app.use(express.json());
	app.use('/api/auth', authRouter);

	beforeAll(async () => {
		// Register a user for login test
		await request(app)
			.post('/api/auth/register')
			.send({ name: 'Test User', email: 'login@example.com', password: 'password123' });
	});

	it('should login successfully with correct credentials', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'login@example.com', password: 'password123' });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('token');
		expect(res.body).toHaveProperty('user');
		expect(res.body.user.email).toBe('login@example.com');
	});

	it('should fail login with wrong password', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'login@example.com', password: 'wrongpass' });
		expect(res.status).toBe(401);
		expect(res.body).not.toHaveProperty('token');
	});

	it('should fail login with unregistered email', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'notfound@example.com', password: 'password123' });
		expect(res.status).toBe(401);
		expect(res.body).not.toHaveProperty('token');
	});

	it('should fail login with missing fields', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: '' });
		expect(res.status).toBe(400);
	});
});
