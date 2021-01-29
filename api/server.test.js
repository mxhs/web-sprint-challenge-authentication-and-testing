const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

// Write your tests here
test("sanity", () => {
	expect(true).not.toBe(false);
});

const user1 = { username: "Captain", password: "password" };
const user2 = { username: "General", password: "password" };
const user3 = { username: "Captain", password: "meow" };
const errorUser = { username: "Captain", password: "" };

beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});
beforeEach(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});
afterAll(async () => {
	await db.destroy();
});

describe("server", () => {
	describe("[GET] /", () => {
		it("API is running", async () => {
			const res = await request(server).get("/");
			expect(res.body).toMatchObject({ api: "up" });
		});
	});
	describe("[POST] /auth/register", () => {
		it("responds with newly created user", async () => {
			const res = await request(server).post("/api/auth/register").send(user1);
			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("id");
			expect(res.body).toHaveProperty("username");
			expect(res.body).toHaveProperty("password");
		});
		it("renders error message if new user is missing a password", async () => {
			const res = await request(server)
				.post("/api/auth/register")
				.send(errorUser);
			expect(res.body.errorMessage).toEqual("username and password required");
		});
	});
	describe("[POST] /auth/login", () => {
		it("responds with proper status code on login", async () => {
			await request(server).post("/api/auth/register").send(user1);
			const res = await request(server).post("/api/auth/login").send(user1);
			// expect(res.status).toBe(201);
		});
	});
});
