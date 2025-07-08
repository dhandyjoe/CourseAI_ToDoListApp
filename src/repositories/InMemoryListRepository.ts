import { List } from "../models/List";
import { ListRepository } from "./ListRepository";
import { v4 as uuidv4 } from "uuid";

export class InMemoryListRepository implements ListRepository {
	private lists: List[] = [];

	async create(list: Omit<List, "id" | "createdAt" | "updatedAt">): Promise<List> {
		const now = new Date();
		const newList: List = {
			...list,
			id: uuidv4(),
			createdAt: now,
			updatedAt: now,
		};
		this.lists.push(newList);
		return newList;
	}

	async findAllByUser(userId: string): Promise<List[]> {
		return this.lists.filter((l) => l.userId === userId);
	}

	async findById(id: string): Promise<List | null> {
		return this.lists.find((l) => l.id === id) || null;
	}

	async update(list: List): Promise<List> {
		const idx = this.lists.findIndex((l) => l.id === list.id);
		if (idx === -1) throw new Error("List not found");
		this.lists[idx] = { ...list, updatedAt: new Date() };
		return this.lists[idx];
	}

	async delete(id: string): Promise<void> {
		this.lists = this.lists.filter((l) => l.id !== id);
	}
}
