import { InMemoryUserRepository } from "../src/repositories/InMemoryUserRepository";
import { InMemoryListRepository } from "../src/repositories/InMemoryListRepository";

describe("User Repositories", () => {
	describe("InMemoryUserRepository", () => {
		let repo: InMemoryUserRepository;

		beforeEach(() => {
			repo = new InMemoryUserRepository();
		});

		it("should create a user", async () => {
			const userData = { name: "John", email: "john@example.com", passwordHash: "hash123" };
			const user = await repo.create(userData);

			expect(user.id).toBeDefined();
			expect(user.name).toBe("John");
			expect(user.email).toBe("john@example.com");
			expect(user.passwordHash).toBe("hash123");
		});

		it("should find user by email", async () => {
			const userData = { name: "Jane", email: "jane@example.com", passwordHash: "hash456" };
			await repo.create(userData);

			const foundUser = await repo.findByEmail("jane@example.com");
			expect(foundUser).toBeDefined();
			expect(foundUser!.email).toBe("jane@example.com");
		});

		it("should return undefined when user not found by email", async () => {
			const foundUser = await repo.findByEmail("nonexistent@example.com");
			expect(foundUser).toBeUndefined();
		});

		it("should find user by id", async () => {
			const userData = { name: "Bob", email: "bob@example.com", passwordHash: "hash789" };
			const createdUser = await repo.create(userData);

			const foundUser = await repo.findById(createdUser.id);
			expect(foundUser).toBeDefined();
			expect(foundUser!.id).toBe(createdUser.id);
		});

		it("should return undefined when user not found by id", async () => {
			const foundUser = await repo.findById("nonexistent-id");
			expect(foundUser).toBeUndefined();
		});

		it("should return all users", () => {
			const users = repo.getAll();
			expect(Array.isArray(users)).toBe(true);
		});

		it("should handle multiple users", async () => {
			await repo.create({ name: "User1", email: "user1@example.com", passwordHash: "hash1" });
			await repo.create({ name: "User2", email: "user2@example.com", passwordHash: "hash2" });
			await repo.create({ name: "User3", email: "user3@example.com", passwordHash: "hash3" });

			const users = repo.getAll();
			expect(users.length).toBe(3);

			const user1 = await repo.findByEmail("user1@example.com");
			const user2 = await repo.findByEmail("user2@example.com");
			const user3 = await repo.findByEmail("user3@example.com");

			expect(user1).toBeDefined();
			expect(user2).toBeDefined();
			expect(user3).toBeDefined();
		});

		it("should handle empty email search", async () => {
			const foundUser = await repo.findByEmail("");
			expect(foundUser).toBeUndefined();
		});

		it("should handle null email search", async () => {
			const foundUser = await repo.findByEmail(null as any);
			expect(foundUser).toBeUndefined();
		});

		it("should handle undefined email search", async () => {
			const foundUser = await repo.findByEmail(undefined as any);
			expect(foundUser).toBeUndefined();
		});

		it("should handle empty id search", async () => {
			const foundUser = await repo.findById("");
			expect(foundUser).toBeUndefined();
		});

		it("should handle null id search", async () => {
			const foundUser = await repo.findById(null as any);
			expect(foundUser).toBeUndefined();
		});

		it("should handle undefined id search", async () => {
			const foundUser = await repo.findById(undefined as any);
			expect(foundUser).toBeUndefined();
		});

		it("should handle case sensitive email search", async () => {
			await repo.create({ name: "Case Test", email: "case@example.com", passwordHash: "hash" });

			const foundLower = await repo.findByEmail("case@example.com");
			const foundUpper = await repo.findByEmail("CASE@EXAMPLE.COM");

			expect(foundLower).toBeDefined();
			expect(foundUpper).toBeUndefined(); // Case sensitive
		});

		it("should generate unique IDs for each user", async () => {
			const user1 = await repo.create({ name: "User1", email: "u1@example.com", passwordHash: "hash1" });
			const user2 = await repo.create({ name: "User2", email: "u2@example.com", passwordHash: "hash2" });
			const user3 = await repo.create({ name: "User3", email: "u3@example.com", passwordHash: "hash3" });

			expect(user1.id).not.toBe(user2.id);
			expect(user1.id).not.toBe(user3.id);
			expect(user2.id).not.toBe(user3.id);
		});

		it("should preserve all user data when creating", async () => {
			const userData = {
				name: "Complete User",
				email: "complete@example.com",
				passwordHash: "completeHash123"
			};
			const user = await repo.create(userData);

			expect(user.name).toBe(userData.name);
			expect(user.email).toBe(userData.email);
			expect(user.passwordHash).toBe(userData.passwordHash);
		});
	});

	describe("InMemoryListRepository", () => {
		let repo: InMemoryListRepository;
		const testUserId = "test-user-id";

		beforeEach(() => {
			repo = new InMemoryListRepository();
		});

		it("should create a list", async () => {
			const listData = { userId: testUserId, title: "Test List", description: "Test Description" };
			const list = await repo.create(listData as any);

			expect(list.id).toBeDefined();
			expect(list.userId).toBe(testUserId);
			expect(list.title).toBe("Test List");
			expect(list.description).toBe("Test Description");
		});

		it("should find list by id", async () => {
			const listData = { userId: testUserId, title: "Find List", description: "Find Description" };
			const createdList = await repo.create(listData as any);

			const foundList = await repo.findById(createdList.id);
			expect(foundList).toBeDefined();
			expect(foundList!.id).toBe(createdList.id);
		});

		it("should return null when list not found by id", async () => {
			const foundList = await repo.findById("nonexistent-id");
			expect(foundList).toBeNull();
		});

		it("should find all lists by user", async () => {
			await repo.create({ userId: testUserId, title: "List 1", description: "Desc 1" } as any);
			await repo.create({ userId: testUserId, title: "List 2", description: "Desc 2" } as any);
			await repo.create({ userId: "other-user", title: "Other List", description: "Other Desc" } as any);

			const userLists = await repo.findAllByUser(testUserId);
			expect(userLists.length).toBe(2);
			expect(userLists.every(list => list.userId === testUserId)).toBe(true);
		});

		it("should update a list", async () => {
			const listData = { userId: testUserId, title: "Original Title", description: "Original Desc" };
			const createdList = await repo.create(listData as any);

			const updatedData = { ...createdList, title: "Updated Title", description: "Updated Desc" };
			const updatedList = await repo.update(updatedData);

			expect(updatedList.title).toBe("Updated Title");
			expect(updatedList.description).toBe("Updated Desc");
			expect(updatedList.id).toBe(createdList.id);
		});

		it("should delete a list", async () => {
			const listData = { userId: testUserId, title: "Delete Me", description: "Delete Desc" };
			const createdList = await repo.create(listData as any);

			await repo.delete(createdList.id);

			const foundList = await repo.findById(createdList.id);
			expect(foundList).toBeNull();
		});

		it("should handle empty user id search", async () => {
			const userLists = await repo.findAllByUser("");
			expect(userLists).toEqual([]);
		});

		it("should handle null user id search", async () => {
			const userLists = await repo.findAllByUser(null as any);
			expect(userLists).toEqual([]);
		});

		it("should handle undefined user id search", async () => {
			const userLists = await repo.findAllByUser(undefined as any);
			expect(userLists).toEqual([]);
		});

		it("should handle empty id in findById", async () => {
			const foundList = await repo.findById("");
			expect(foundList).toBeNull();
		});

		it("should handle null id in findById", async () => {
			const foundList = await repo.findById(null as any);
			expect(foundList).toBeNull();
		});

		it("should handle undefined id in findById", async () => {
			const foundList = await repo.findById(undefined as any);
			expect(foundList).toBeNull();
		});

		it("should handle update with non-existent id", async () => {
			const fakeList = { id: "fake-id", userId: testUserId, title: "Fake", description: "Fake" };

			// This should throw an error based on implementation
			await expect(repo.update(fakeList as any)).rejects.toThrow("List not found");
		});

		it("should handle delete with non-existent id", async () => {
			// Should not throw error when deleting non-existent list
			await expect(repo.delete("fake-id")).resolves.not.toThrow();
		});

		it("should handle empty string delete", async () => {
			await expect(repo.delete("")).resolves.not.toThrow();
		});

		it("should handle null delete", async () => {
			await expect(repo.delete(null as any)).resolves.not.toThrow();
		});

		it("should handle undefined delete", async () => {
			await expect(repo.delete(undefined as any)).resolves.not.toThrow();
		});

		it("should preserve list order", async () => {
			const list1 = await repo.create({ userId: testUserId, title: "First", description: "1" } as any);
			const list2 = await repo.create({ userId: testUserId, title: "Second", description: "2" } as any);
			const list3 = await repo.create({ userId: testUserId, title: "Third", description: "3" } as any);

			const userLists = await repo.findAllByUser(testUserId);
			expect(userLists[0].title).toBe("First");
			expect(userLists[1].title).toBe("Second");
			expect(userLists[2].title).toBe("Third");
		});

		it("should generate unique IDs for lists", async () => {
			const list1 = await repo.create({ userId: testUserId, title: "List1", description: "1" } as any);
			const list2 = await repo.create({ userId: testUserId, title: "List2", description: "2" } as any);
			const list3 = await repo.create({ userId: testUserId, title: "List3", description: "3" } as any);

			expect(list1.id).not.toBe(list2.id);
			expect(list1.id).not.toBe(list3.id);
			expect(list2.id).not.toBe(list3.id);
		});
	});
});
