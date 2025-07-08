import { Request, Response } from "express";

// Mock the entire repository module before importing the controller
const mockCreate = jest.fn();
const mockFindAllByUser = jest.fn();
const mockFindById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("../src/repositories/InMemoryListRepository", () => {
	return {
		InMemoryListRepository: jest.fn().mockImplementation(() => ({
			create: mockCreate,
			findAllByUser: mockFindAllByUser,
			findById: mockFindById,
			update: mockUpdate,
			delete: mockDelete
		}))
	};
});

// Import after mocking
import { createList, getAllLists, getListById, updateList, deleteList } from "../src/controllers/listController";

describe("List Controller Error Handling", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			body: {},
			params: {}
		} as any;
		(req as any).user = { id: "test-user-id" };

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};

		// Clear all mocks
		jest.clearAllMocks();
	});

	describe("createList error handling", () => {
		it("should handle repository errors during creation", async () => {
			req.body = { title: "Test List", description: "Test Description" };

			// Mock repository to throw error
			mockCreate.mockRejectedValue(new Error("Database error"));

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle missing user context", async () => {
			req.body = { title: "Test List", description: "Test Description" };
			(req as any).user = undefined; // No user context

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "dummy-user-id",
				title: "Test List",
				description: "Test Description"
			} as any);

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(mockCreate).toHaveBeenCalledWith({
				userId: "dummy-user-id",
				title: "Test List",
				description: "Test Description"
			});
		});

		it("should handle network timeouts and async errors", async () => {
			req.body = { title: "Test List" };

			// Mock a timeout error
			mockCreate.mockRejectedValue(new Error("TIMEOUT"));

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle missing title validation", async () => {
			req.body = {}; // No title

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
		});

		it("should handle empty title validation", async () => {
			req.body = { title: "" }; // Empty title

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
		});

		it("should handle null title validation", async () => {
			req.body = { title: null }; // Null title

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
		});

		it("should handle user with falsy id", async () => {
			req.body = { title: "Test List" };
			(req as any).user = { id: null };

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "dummy-user-id",
				title: "Test List"
			} as any);

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(mockCreate).toHaveBeenCalledWith({
				userId: "dummy-user-id",
				title: "Test List"
			});
		});

		it("should handle userId property fallback", async () => {
			req.body = { title: "Test List" };
			(req as any).user = undefined;
			(req as any).userId = "explicit-user-id";

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "explicit-user-id",
				title: "Test List"
			} as any);

			await createList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(mockCreate).toHaveBeenCalledWith({
				userId: "explicit-user-id",
				title: "Test List"
			});
		});
	});

	describe("getAllLists error handling", () => {
		it("should handle repository errors during fetch", async () => {
			mockFindAllByUser.mockRejectedValue(new Error("Database error"));

			await getAllLists(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle missing user context gracefully", async () => {
			(req as any).user = undefined;

			mockFindAllByUser.mockResolvedValue([]);

			await getAllLists(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith([]);
			expect(mockFindAllByUser).toHaveBeenCalledWith("dummy-user-id");
		});

		it("should handle user with falsy id", async () => {
			(req as any).user = { id: null };

			mockFindAllByUser.mockResolvedValue([]);

			await getAllLists(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith([]);
			expect(mockFindAllByUser).toHaveBeenCalledWith("dummy-user-id");
		});

		it("should handle userId property fallback", async () => {
			(req as any).user = undefined;
			(req as any).userId = "explicit-user-id";

			mockFindAllByUser.mockResolvedValue([]);

			await getAllLists(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith([]);
			expect(mockFindAllByUser).toHaveBeenCalledWith("explicit-user-id");
		});

		it("should handle falsy userId fallback to dummy", async () => {
			(req as any).user = undefined;
			(req as any).userId = "";

			mockFindAllByUser.mockResolvedValue([]);

			await getAllLists(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith([]);
			expect(mockFindAllByUser).toHaveBeenCalledWith("dummy-user-id");
		});
	});

	describe("getListById error handling", () => {
		it("should handle repository errors during fetch", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockRejectedValue(new Error("Database error"));

			await getListById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle missing user context", async () => {
			req.params = { id: "test-id" };
			(req as any).user = undefined;

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test List"
			} as any);

			await getListById(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test List"
			});
		});

		it("should handle user with falsy id", async () => {
			req.params = { id: "test-id" };
			(req as any).user = { id: null };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test List"
			} as any);

			await getListById(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test List"
			});
		});

		it("should handle userId property fallback", async () => {
			req.params = { id: "test-id" };
			(req as any).user = undefined;
			(req as any).userId = "explicit-user-id";

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "explicit-user-id",
				title: "Test List"
			} as any);

			await getListById(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "explicit-user-id",
				title: "Test List"
			});
		});

		it("should handle falsy userId fallback to dummy", async () => {
			req.params = { id: "test-id" };
			(req as any).user = undefined;
			(req as any).userId = "";

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test List"
			} as any);

			await getListById(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test List"
			});
		});

		it("should handle list not found", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockResolvedValue(null);

			await getListById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "List not found" });
		});

		it("should handle list belonging to different user", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "different-user-id",
				title: "Test List"
			} as any);

			await getListById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "List not found" });
		});
	});

	describe("updateList error handling", () => {
		it("should handle repository errors during update", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "test-user-id",
				title: "Original"
			} as any);

			mockUpdate.mockRejectedValue(new Error("Update failed"));

			await updateList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle repository errors during findById", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };

			mockFindById.mockRejectedValue(new Error("Find failed"));

			await updateList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle missing user context", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };
			(req as any).user = undefined;

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Original"
			} as any);

			mockUpdate.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Updated Title"
			} as any);

			await updateList(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Updated Title"
			});
		});

		it("should handle user with falsy id", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };
			(req as any).user = { id: null };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Original"
			} as any);

			mockUpdate.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Updated Title"
			} as any);

			await updateList(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Updated Title"
			});
		});

		it("should handle userId property fallback", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };
			(req as any).user = undefined;
			(req as any).userId = "explicit-user-id";

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "explicit-user-id",
				title: "Original"
			} as any);

			mockUpdate.mockResolvedValue({
				id: "test-id",
				userId: "explicit-user-id",
				title: "Updated Title"
			} as any);

			await updateList(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				id: "test-id",
				userId: "explicit-user-id",
				title: "Updated Title"
			});
		});

		it("should handle missing title validation", async () => {
			req.params = { id: "test-id" };
			req.body = {}; // No title

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "test-user-id",
				title: "Original"
			} as any);

			await updateList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
		});

		it("should handle list not found", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };

			mockFindById.mockResolvedValue(null);

			await updateList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "List not found" });
		});

		it("should handle list belonging to different user", async () => {
			req.params = { id: "test-id" };
			req.body = { title: "Updated Title" };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "different-user-id",
				title: "Original"
			} as any);

			await updateList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "List not found" });
		});
	});

	describe("deleteList error handling", () => {
		it("should handle repository errors during delete", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "test-user-id",
				title: "Test"
			} as any);

			mockDelete.mockRejectedValue(new Error("Delete failed"));

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle repository errors during findById", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockRejectedValue(new Error("Find failed"));

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});

		it("should handle missing user context", async () => {
			req.params = { id: "test-id" };
			(req as any).user = undefined;

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test"
			} as any);

			mockDelete.mockResolvedValue(undefined);

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: "berhasil melakukan hapus data dengan id test-id"
			});
		});

		it("should handle user with falsy id", async () => {
			req.params = { id: "test-id" };
			(req as any).user = { id: null };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "dummy-user-id",
				title: "Test"
			} as any);

			mockDelete.mockResolvedValue(undefined);

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: "berhasil melakukan hapus data dengan id test-id"
			});
		});

		it("should handle userId property fallback", async () => {
			req.params = { id: "test-id" };
			(req as any).user = undefined;
			(req as any).userId = "explicit-user-id";

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "explicit-user-id",
				title: "Test"
			} as any);

			mockDelete.mockResolvedValue(undefined);

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: "berhasil melakukan hapus data dengan id test-id"
			});
		});

		it("should handle list not found", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockResolvedValue(null);

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "List not found" });
		});

		it("should handle list belonging to different user", async () => {
			req.params = { id: "test-id" };

			mockFindById.mockResolvedValue({
				id: "test-id",
				userId: "different-user-id",
				title: "Test"
			} as any);

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "List not found" });
		});

		it("should handle async errors properly", async () => {
			req.params = { id: "test-id" };

			// Mock a promise rejection
			mockFindById.mockImplementation(() => {
				return Promise.reject(new Error("Async error"));
			});

			await deleteList(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
		});
	});

	describe("Edge cases with user identification", () => {
		it("should handle malformed user object", async () => {
			req.body = { title: "Test" };
			(req as any).user = { id: null }; // Malformed user

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "dummy-user-id",
				title: "Test"
			} as any);

			await createList(req as Request, res as Response);

			expect(mockCreate).toHaveBeenCalledWith({
				userId: "dummy-user-id",
				title: "Test"
			});
		});

		it("should handle empty user object", async () => {
			req.body = { title: "Test" };
			(req as any).user = {}; // Empty user object

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "dummy-user-id",
				title: "Test"
			} as any);

			await createList(req as Request, res as Response);

			expect(mockCreate).toHaveBeenCalledWith({
				userId: "dummy-user-id",
				title: "Test"
			});
		});

		it("should handle userId property instead of id", async () => {
			req.body = { title: "Test" };
			(req as any).user = undefined; // Remove user object
			(req as any).userId = "explicit-user-id"; // Direct userId property

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "explicit-user-id",
				title: "Test"
			} as any);

			await createList(req as Request, res as Response);

			expect(mockCreate).toHaveBeenCalledWith({
				userId: "explicit-user-id",
				title: "Test"
			});
		});

		it("should handle falsy userId property", async () => {
			req.body = { title: "Test" };
			(req as any).user = undefined; // Remove user object
			(req as any).userId = null; // Falsy userId property

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "dummy-user-id",
				title: "Test"
			} as any);

			await createList(req as Request, res as Response);

			expect(mockCreate).toHaveBeenCalledWith({
				userId: "dummy-user-id",
				title: "Test"
			});
		});

		it("should handle empty string userId", async () => {
			req.body = { title: "Test" };
			(req as any).user = undefined; // Remove user object
			(req as any).userId = ""; // Empty string userId

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "dummy-user-id",
				title: "Test"
			} as any);

			await createList(req as Request, res as Response);

			expect(mockCreate).toHaveBeenCalledWith({
				userId: "dummy-user-id",
				title: "Test"
			});
		});

		it("should handle user with falsy id but truthy userId property", async () => {
			req.body = { title: "Test" };
			(req as any).user = { id: "" }; // Falsy user id
			(req as any).userId = "fallback-user-id"; // Fallback userId

			mockCreate.mockResolvedValue({
				id: "list-id",
				userId: "fallback-user-id",
				title: "Test"
			} as any);

			await createList(req as Request, res as Response);

			expect(mockCreate).toHaveBeenCalledWith({
				userId: "fallback-user-id",
				title: "Test"
			});
		});
	});
});
