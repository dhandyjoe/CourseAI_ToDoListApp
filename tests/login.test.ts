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

	describe('Validation tests', () => {
		it('should fail login without email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login without password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login with empty email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: '', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login with empty password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: '' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login with null email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: null, password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login with null password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: null });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login with undefined email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: undefined, password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail login with undefined password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: undefined });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});
	});

	describe('Authentication failure tests', () => {
		it('should fail with wrong email case sensitivity', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'LOGIN@EXAMPLE.COM', password: 'password123' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});

		it('should fail with correct email but wrong password case', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: 'PASSWORD123' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});

		it('should fail with extra characters in password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: 'password123extra' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});

		it('should fail with missing characters in password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: 'password12' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});

		it('should fail with completely wrong email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'wrongemail@example.com', password: 'password123' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});

		it('should fail with empty string email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: '', password: 'password123' });
			expect(res.status).toBe(400);
			expect(res.body.message).toMatch(/Email dan password wajib diisi/);
		});

		it('should fail with whitespace only email', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: '   ', password: 'password123' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});

		it('should fail with whitespace only password', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'login@example.com', password: '   ' });
			expect(res.status).toBe(401);
			expect(res.body.message).toMatch(/Email atau password salah/);
		});
	});

	describe('Success scenarios', () => {
		beforeAll(async () => {
			// Register additional test users
			await request(app)
				.post('/api/auth/register')
				.send({ name: 'Success Test', email: 'success@example.com', password: 'testpass123' });
		});

		it('should return valid JWT token on successful login', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'success@example.com', password: 'testpass123' });

			expect(res.status).toBe(200);
			expect(res.body.token).toBeDefined();
			expect(res.body.token.split('.')).toHaveLength(3); // JWT format
		});

		it('should return user info without password on successful login', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'success@example.com', password: 'testpass123' });

			expect(res.status).toBe(200);
			expect(res.body.user).toHaveProperty('id');
			expect(res.body.user).toHaveProperty('name', 'Success Test');
			expect(res.body.user).toHaveProperty('email', 'success@example.com');
			expect(res.body.user).not.toHaveProperty('passwordHash');
			expect(res.body.user).not.toHaveProperty('password');
		});

		it('should return success message on login', async () => {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'success@example.com', password: 'testpass123' });

			expect(res.status).toBe(200);
			expect(res.body.message).toBe('Login berhasil');
		});
	});

	describe('GET /api/auth/users endpoint', () => {
		it('should return all users in development mode', async () => {
			const res = await request(app).get('/api/auth/users');

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBeGreaterThan(0);
		});

		it('should return users with correct structure', async () => {
			const res = await request(app).get('/api/auth/users');

			expect(res.status).toBe(200);
			if (res.body.length > 0) {
				const user = res.body[0];
				expect(user).toHaveProperty('id');
				expect(user).toHaveProperty('name');
				expect(user).toHaveProperty('email');
				expect(user).toHaveProperty('passwordHash');
			}
		});
	});
});
