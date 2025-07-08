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

	describe('Validation tests', () => {
		it('should not register without name', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ email: 'noname@example.com', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register without email', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register without password', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: 'nopass@example.com' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with empty name', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: '', email: 'emptyname@example.com', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with empty email', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: '', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with empty password', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: 'emptypass@example.com', password: '' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with password less than 6 characters', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: 'shortpass@example.com', password: '12345' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Password minimal 6 karakter/);
		});

		it('should register with password exactly 6 characters', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: 'sixpass@example.com', password: '123456' });
			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('token');
		});

		it('should not register with null name', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: null, email: 'nullname@example.com', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with null email', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: null, password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with null password', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: 'nullpass@example.com', password: null });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});

		it('should not register with undefined fields', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: undefined, email: undefined, password: undefined });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Nama, email, dan password wajib diisi/);
		});
	});

	describe('Edge cases', () => {
		it('should handle very long name', async () => {
			const longName = 'A'.repeat(1000);
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: longName, email: 'longname@example.com', password: 'password123' });
			expect(res.status).toBe(201);
			expect(res.body.user.name).toBe(longName);
		});

		it('should handle very long email', async () => {
			const longEmail = 'a'.repeat(100) + '@example.com';
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: longEmail, password: 'password123' });
			expect(res.status).toBe(201);
			expect(res.body.user.email).toBe(longEmail);
		});

		it('should handle very long password', async () => {
			const longPassword = 'a'.repeat(1000);
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'Test User', email: 'longpass@example.com', password: longPassword });
			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('token');
		});

		it('should handle special characters in name', async () => {
			const specialName = 'Test@#$%^&*()User';
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: specialName, email: 'special@example.com', password: 'password123' });
			expect(res.status).toBe(201);
			expect(res.body.user.name).toBe(specialName);
		});

		it('should handle whitespace in name', async () => {
			const whitespaceName = '  Test User  ';
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: whitespaceName, email: 'whitespace@example.com', password: 'password123' });
			expect(res.status).toBe(201);
			expect(res.body.user.name).toBe(whitespaceName);
		});
	});

	describe('JWT token tests', () => {
		it('should generate valid JWT token', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'JWT Test', email: 'jwt@example.com', password: 'password123' });
			expect(res.status).toBe(201);

			const token = res.body.token;
			expect(token).toBeDefined();
			expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
		});

		it('should include user info in response', async () => {
			const res = await request(app)
				.post('/api/auth/register')
				.send({ name: 'User Info Test', email: 'userinfo@example.com', password: 'password123' });
			expect(res.status).toBe(201);

			expect(res.body.user).toHaveProperty('id');
			expect(res.body.user).toHaveProperty('name', 'User Info Test');
			expect(res.body.user).toHaveProperty('email', 'userinfo@example.com');
			expect(res.body.user).not.toHaveProperty('passwordHash');
		});
	});
});
