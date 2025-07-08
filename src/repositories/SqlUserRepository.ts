import { User } from '../models/User';
import { UserRepository } from './UserRepository';
import { Pool } from 'pg';

export class SqlUserRepository implements UserRepository {
	constructor(private pool: Pool) { }

	async findByEmail(email: string): Promise<User | undefined> {
		const res = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
		return res.rows[0];
	}

	async findById(id: string): Promise<User | undefined> {
		const res = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
		return res.rows[0];
	}

	async create(user: Omit<User, 'id'>): Promise<User> {
		const res = await this.pool.query(
			'INSERT INTO users (name, email, passwordHash) VALUES ($1, $2, $3) RETURNING *',
			[user.name, user.email, user.passwordHash]
		);
		return res.rows[0];
	}
}
