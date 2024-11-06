import request from "supertest";
import User from "../models/user.model";
import app from "../../server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Database from "../db";

const db = new Database();
beforeAll(async () => {
  await db.sequelize?.sync();
});

afterEach(async () => {
  try {
    await User.destroy({ where: {}, force: true });
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

describe("POST /users/register", () => {
  it("should create a new user and return 201 status", async () => {
    const response = await request.agent(app).post("/api/users/register").send({
      email: "test@gmail.com",
      password: "testpassword",
      username: "test12"
    });

    console.log(response.status)
    expect(response.status).toBe(201);
    expect(response.body.email).toEqual("test@gmail.com");
  });
});

describe("POST /users/login", () => {
  it("should login an existing user and return a token", async () => {
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    const user = await User.create({ email: "test@gmail.com", username: "test12", password: hashedPassword });
    const response = await request.agent(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.username).toEqual(user.username);
  });
});

describe("GET /users/:id/profile", () => {
  it("should return the profile information of the authenticated user", async () => {
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    const user = await User.create({
      email: "test@gmail.com",
      password: hashedPassword,
      username: "test12",
    });

    const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET), {
      expiresIn: "1w",
    });

    const userId = String(user.id);

    const response = await request.agent(app)
      .get(`/api/users/${userId}/profile`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(user.id);
    expect(response.body.email).toEqual(user.email);
  });
});


