import { User } from '../models/User';

export interface UserRepository {
	findByEmail(email: string): Promise<User | undefined>;
	findById(id: string): Promise<User | undefined>;
	create(user: Omit<User, 'id'>): Promise<User>;
	// Tambahkan method opsional agar semua implementasi bisa punya getAll
	getAll?(): User[];
}
