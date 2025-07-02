import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth';

describe('POST /api/auth/register', () => {
	const app = express();
	app.use(express.json());
	app.use('/api/auth', authRouter);

	it('should register a new user and return token', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('token');
		expect(res.body.user).toMatchObject({ name: 'Test User', email: 'testuser@example.com' });
	});

	it('should not register with existing email', async () => {
		await request(app)
			.post('/api/auth/register')
			.send({ name: 'Test User', email: 'dupe@example.com', password: 'password123' });
		const res = await request(app)
			.post('/api/auth/register')
			.send({ name: 'Test User', email: 'dupe@example.com', password: 'password123' });
		expect(res.status).toBe(409);
		expect(res.body.message).toMatch(/Email sudah terdaftar/);
	});

	it('should not register with invalid data', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({ name: '', email: '', password: '' });
		expect(res.status).toBe(400);
	});
});
