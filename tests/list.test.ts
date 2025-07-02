import request from "supertest";
import app from "../src/index";

describe("CRUD List Endpoints", () => {
	let createdId: string;
	const dummyUserId = "dummy-user-id";

	it("should create a new list", async () => {
		const res = await request(app)
			.post("/api/lists")
			.send({ title: "Test List", description: "desc", userId: dummyUserId });
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("id");
		createdId = res.body.id;
	});

	it("should get all lists", async () => {
		const res = await request(app).get("/api/lists");
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("should get a single list by id", async () => {
		const res = await request(app).get(`/api/lists/${createdId}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id", createdId);
	});

	it("should update a list", async () => {
		const res = await request(app)
			.put(`/api/lists/${createdId}`)
			.send({ title: "Updated List", description: "desc updated" });
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("title", "Updated List");
	});

	it("should delete a list", async () => {
		const res = await request(app).delete(`/api/lists/${createdId}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toMatch(/berhasil melakukan hapus data/);
	});
});
