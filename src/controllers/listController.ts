export const deleteList = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		// userId dari JWT (atau dummy jika belum ada auth)
		const userId = (req as any).user?.id || (req as any).userId || "dummy-user-id";
		const existing = await listRepo.findById(id);
		if (!existing || existing.userId !== userId) {
			return res.status(404).json({ message: "List not found" });
		}
		await listRepo.delete(id);
		res.status(200).json({ message: `berhasil melakukan hapus data dengan id ${id}` });
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};
export const updateList = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;
		// userId dari JWT (atau dummy jika belum ada auth)
		const userId = (req as any).user?.id || (req as any).userId || "dummy-user-id";
		const existing = await listRepo.findById(id);
		if (!existing || existing.userId !== userId) {
			return res.status(404).json({ message: "List not found" });
		}
		if (!title) {
			return res.status(400).json({ message: "Title is required" });
		}
		const updated = await listRepo.update({
			...existing,
			title,
			description,
		});
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};
export const getListById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		// userId dari JWT (atau dummy jika belum ada auth)
		const userId = (req as any).user?.id || (req as any).userId || "dummy-user-id";
		const list = await listRepo.findById(id);
		if (!list || list.userId !== userId) {
			return res.status(404).json({ message: "List not found" });
		}
		res.json(list);
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};
import { Request, Response } from "express";
import { InMemoryListRepository } from "../repositories/InMemoryListRepository";
import { List } from "../models/List";


const listRepo = new InMemoryListRepository();

export const getAllLists = async (req: Request, res: Response) => {
	try {
		// userId dari JWT (atau dummy jika belum ada auth)
		const userId = (req as any).user?.id || (req as any).userId || "dummy-user-id";
		const lists = await listRepo.findAllByUser(userId);
		res.json(lists);
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createList = async (req: Request, res: Response) => {
	try {
		const { title, description } = req.body;
		if (!title) {
			return res.status(400).json({ message: "Title is required" });
		}
		// userId dari JWT (diasumsikan sudah di-middleware auth)
		// Untuk development tanpa auth, gunakan dummy userId
		const userId = (req as any).user?.id || (req as any).userId || "dummy-user-id";
		const newList = await listRepo.create({
			userId,
			title,
			description,
		} as any);
		res.status(201).json(newList);
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};
