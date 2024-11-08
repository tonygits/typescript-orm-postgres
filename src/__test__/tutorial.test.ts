import request from "supertest";
import Tutorial from "../models/tutorial.model";
import app from "../../server";
import Database from "../db";

const db = new Database();
beforeAll(async () => {
    await db.sequelize?.sync();
});

afterEach(async () => {
    try {
        await Tutorial.destroy({ where: {}, force: true });
    } catch (err) {
        console.error("Error during cleanup: ", err);
    }
});

afterAll(async () => {
    await db.sequelize?.close();
});

beforeEach(async () => {
    await db.sequelize?.sync({ force: true });
});

describe("POST /api/tutorial", () => {
    it("should create a new tutorial and return 201 status", async () => {
        const response = await request.agent(app).post("/api/tutorials").send({
            title: "my first tutorial",
            body: "The first tutorial"
        });

        console.log("create tutorial response status", response.status);
        expect(response.status).toBe(201);
        expect(response.body.title).toEqual("my first tutorial");
    });
});