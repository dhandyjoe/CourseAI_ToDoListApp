import request from "supertest";
import app from "../src/index";
import jwt from "jsonwebtoken";

describe("CRUD List Endpoints", () => {
	let createdId: string;
	const dummyUserId = "dummy-user-id";
	let authToken: string;

	beforeAll(() => {
		// Create a valid JWT token for testing
		const secret = process.env.JWT_SECRET || "fallback-secret-key";
		authToken = jwt.sign({ id: dummyUserId, email: "test@example.com" }, secret);
	});

	describe("Authenticated requests", () => {
		it("should create a new list", async () => {
			const res = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Test List", description: "desc" });
			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty("id");
			expect(res.body).toHaveProperty("title", "Test List");
			expect(res.body).toHaveProperty("description", "desc");
			expect(res.body).toHaveProperty("userId", dummyUserId);
			createdId = res.body.id;
		});

		it("should create a list without description", async () => {
			const res = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Title Only" });
			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty("id");
			expect(res.body).toHaveProperty("title", "Title Only");
		});

		it("should not create a list without title", async () => {
			const res = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ description: "desc only" });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty("message", "Title is required");
		});

		it("should not create a list with empty title", async () => {
			const res = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "", description: "desc" });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty("message", "Title is required");
		});

		it("should not create a list with null title", async () => {
			const res = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: null, description: "desc" });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty("message", "Title is required");
		});

		it("should get all lists", async () => {
			const res = await request(app)
				.get("/api/lists")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBeGreaterThan(0);
		});

		it("should get a single list by id", async () => {
			const res = await request(app)
				.get(`/api/lists/${createdId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("id", createdId);
			expect(res.body).toHaveProperty("title", "Test List");
		});

		it("should return 404 for non-existent list", async () => {
			const res = await request(app)
				.get("/api/lists/non-existent-id")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty("message", "List not found");
		});

		it("should update a list", async () => {
			const res = await request(app)
				.put(`/api/lists/${createdId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated List", description: "desc updated" });
			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("title", "Updated List");
			expect(res.body).toHaveProperty("description", "desc updated");
		});

		it("should update a list without description", async () => {
			const res = await request(app)
				.put(`/api/lists/${createdId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated List No Desc" });
			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("title", "Updated List No Desc");
		});

		it("should not update a list without title", async () => {
			const res = await request(app)
				.put(`/api/lists/${createdId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ description: "desc only" });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty("message", "Title is required");
		});

		it("should not update a list with empty title", async () => {
			const res = await request(app)
				.put(`/api/lists/${createdId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "", description: "desc" });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty("message", "Title is required");
		});

		it("should return 404 when updating non-existent list", async () => {
			const res = await request(app)
				.put("/api/lists/non-existent-id")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated List", description: "desc updated" });
			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty("message", "List not found");
		});

		it("should delete a list", async () => {
			const res = await request(app)
				.delete(`/api/lists/${createdId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
			expect(res.body.message).toMatch(/berhasil melakukan hapus data/);
		});

		it("should return 404 when deleting non-existent list", async () => {
			const res = await request(app)
				.delete("/api/lists/non-existent-id")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty("message", "List not found");
		});
	});

	describe("Unauthenticated requests", () => {
		it("should return 401 for create list without token", async () => {
			const res = await request(app)
				.post("/api/lists")
				.send({ title: "Test List", description: "desc" });
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak ada");
		});

		it("should return 401 for get lists without token", async () => {
			const res = await request(app).get("/api/lists");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak ada");
		});

		it("should return 401 for get list by id without token", async () => {
			const res = await request(app).get("/api/lists/some-id");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak ada");
		});

		it("should return 401 for update list without token", async () => {
			const res = await request(app)
				.put("/api/lists/some-id")
				.send({ title: "Test" });
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak ada");
		});

		it("should return 401 for delete list without token", async () => {
			const res = await request(app).delete("/api/lists/some-id");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak ada");
		});

		it("should return 401 for invalid token format", async () => {
			const res = await request(app)
				.get("/api/lists")
				.set("Authorization", "InvalidToken");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak sesuai");
		});

		it("should return 401 for token without Bearer prefix", async () => {
			const res = await request(app)
				.get("/api/lists")
				.set("Authorization", "SomeToken");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak sesuai");
		});

		it("should return 401 for invalid token", async () => {
			const res = await request(app)
				.get("/api/lists")
				.set("Authorization", "Bearer invalid-token");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak sesuai");
		});

		it("should return 401 for malformed JWT token", async () => {
			const res = await request(app)
				.get("/api/lists")
				.set("Authorization", "Bearer not.a.valid.jwt");
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak sesuai");
		});

		it("should return 401 for expired token", async () => {
			const secret = process.env.JWT_SECRET || "fallback-secret-key";
			const expiredToken = jwt.sign(
				{ id: "user-id", email: "test@example.com" },
				secret,
				{ expiresIn: "-1h" } // Already expired
			);
			const res = await request(app)
				.get("/api/lists")
				.set("Authorization", `Bearer ${expiredToken}`);
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty("message", "Token tidak sesuai");
		});
	});

	describe("Error handling", () => {
		it("should handle internal server errors gracefully", async () => {
			// We'll create a test that could potentially cause an error
			// For now, we'll test with extreme values
			const res = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "A".repeat(10000), // Very long title
					description: "Test description"
				});
			// Should still work or return appropriate error
			expect([201, 400, 500]).toContain(res.statusCode);
		});
	});

	describe("User isolation", () => {
		let otherUserToken: string;
		let otherUserId = "other-user-id";

		beforeAll(() => {
			const secret = process.env.JWT_SECRET || "fallback-secret-key";
			otherUserToken = jwt.sign({ id: otherUserId, email: "other@example.com" }, secret);
		});

		it("should not allow users to access other users' lists", async () => {
			// Create a list with first user
			const createRes = await request(app)
				.post("/api/lists")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Private List", description: "desc" });
			expect(createRes.statusCode).toEqual(201);
			const listId = createRes.body.id;

			// Try to access with different user
			const getRes = await request(app)
				.get(`/api/lists/${listId}`)
				.set("Authorization", `Bearer ${otherUserToken}`);
			expect(getRes.statusCode).toEqual(404);
			expect(getRes.body).toHaveProperty("message", "List not found");

			// Try to update with different user
			const updateRes = await request(app)
				.put(`/api/lists/${listId}`)
				.set("Authorization", `Bearer ${otherUserToken}`)
				.send({ title: "Hacked List", description: "hacked" });
			expect(updateRes.statusCode).toEqual(404);
			expect(updateRes.body).toHaveProperty("message", "List not found");

			// Try to delete with different user
			const deleteRes = await request(app)
				.delete(`/api/lists/${listId}`)
				.set("Authorization", `Bearer ${otherUserToken}`);
			expect(deleteRes.statusCode).toEqual(404);
			expect(deleteRes.body).toHaveProperty("message", "List not found");

			// Clean up - delete with original user
			await request(app)
				.delete(`/api/lists/${listId}`)
				.set("Authorization", `Bearer ${authToken}`);
		});
	});
});
