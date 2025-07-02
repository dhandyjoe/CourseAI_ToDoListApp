import { List } from "../models/List";

export interface ListRepository {
	create(list: Omit<List, "id" | "createdAt" | "updatedAt">): Promise<List>;
	findAllByUser(userId: string): Promise<List[]>;
	findById(id: string): Promise<List | null>;
	update(list: List): Promise<List>;
	delete(id: string): Promise<void>;
}
