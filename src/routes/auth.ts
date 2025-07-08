/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered, returns JWT token
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already registered
 */
import * as express from 'express';
import type { Request, Response } from 'express';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { SqlUserRepository } from '../repositories/SqlUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = (express as any).Router();

// Pilih repository, default ke memory
// Agar bisa akses method getAll, gunakan tipe aslinya
const userRepository = new InMemoryUserRepository();
// Endpoint untuk melihat semua user di memori (hanya untuk development!)
router.get('/users', (req: Request, res: Response) => {
	const users = userRepository.getAll();
	res.json(users);
});
// Untuk production, gunakan SqlUserRepository
// const userRepository: UserRepository = new SqlUserRepository(pool);

router.post('/register', async (req: Request, res: Response) => {
	/**
	 * @swagger
	 * /api/auth/login:
	 *   post:
	 *     summary: Login user
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - email
	 *               - password
	 *             properties:
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Login success, returns JWT token
	 *       400:
	 *         description: Invalid input
	 *       401:
	 *         description: Email or password incorrect
	 */
	const { name, email, password } = req.body;

	// Validasi sederhana
	if (!name || !email || !password) {
		return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
	}
	if (password.length < 6) {
		return res.status(400).json({ message: 'Password minimal 6 karakter.' });
	}

	// Cek email unik
	const existingUser = await userRepository.findByEmail(email);
	if (existingUser) {
		return res.status(409).json({ message: 'Email sudah terdaftar.' });
	}

	// Hash password
	const passwordHash = await bcrypt.hash(password, 10);

	// Simpan user
	const user = await userRepository.create({ name, email, passwordHash });

	// Generate JWT
	const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
	const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });

	return res.status(201).json({
		message: 'Register berhasil',
		token,
		user: { id: user.id, name: user.name, email: user.email }
	});
});


// Endpoint untuk login user
router.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body;

	// Validasi input
	if (!email || !password) {
		return res.status(400).json({ message: 'Email dan password wajib diisi.' });
	}

	// Cari user berdasarkan email
	const user = await userRepository.findByEmail(email);
	if (!user) {
		return res.status(401).json({ message: 'Email atau password salah.' });
	}

	// Verifikasi password
	const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
	if (!isPasswordValid) {
		return res.status(401).json({ message: 'Email atau password salah.' });
	}

	// Generate JWT
	const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
	const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });

	return res.status(200).json({
		message: 'Login berhasil',
		token,
		user: { id: user.id, name: user.name, email: user.email }
	});
});

export default router;
