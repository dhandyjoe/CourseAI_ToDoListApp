
import { User } from '../models/User';
import { UserRepository } from './UserRepository';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryUserRepository implements UserRepository {
	private users: User[] = [];

	async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find(user => user.email === email);
	}

	async findById(id: string): Promise<User | undefined> {
		return this.users.find(user => user.id === id);
	}

	async create(user: Omit<User, 'id'>): Promise<User> {
		const newUser: User = { ...user, id: uuidv4() };
		this.users.push(newUser);
		return newUser;
	}

	// Tambahkan method untuk mendapatkan semua user
	getAll(): User[] {
		return this.users;
	}
}
