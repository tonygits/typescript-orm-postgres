"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_model_1 = __importDefault(require("../models/user.model"));
const server_1 = __importDefault(require("../../server"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const db = new db_1.default();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield ((_a = db.sequelize) === null || _a === void 0 ? void 0 : _a.sync());
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.destroy({ where: {}, force: true });
    }
    catch (err) {
        console.error("Error during cleanup: ", err);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield ((_a = db.sequelize) === null || _a === void 0 ? void 0 : _a.close());
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield ((_a = db.sequelize) === null || _a === void 0 ? void 0 : _a.sync({ force: true }));
}));
describe("POST /users/register", () => {
    it("should create a new user and return 201 status", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default.agent(server_1.default).post("/api/users/register").send({
            email: "test@gmail.com",
            password: "testpassword",
            username: "test12"
        });
        console.log(response.status);
        expect(response.status).toBe(201);
        expect(response.body.email).toEqual("test@gmail.com");
    }));
});
describe("POST /users/login", () => {
    it("should login an existing user and return a token", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash("testpassword", 10);
        const user = yield user_model_1.default.create({ email: "test@gmail.com", username: "test12", password: hashedPassword });
        const response = yield supertest_1.default.agent(server_1.default).post("/api/users/login").send({
            email: "test@gmail.com",
            password: "testpassword",
        });
        expect(response.status).toBe(200);
        expect(response.body.username).toEqual(user.username);
    }));
});
describe("GET /users/:id/profile", () => {
    it("should return the profile information of the authenticated user", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash("testpassword", 10);
        const user = yield user_model_1.default.create({
            email: "test@gmail.com",
            password: hashedPassword,
            username: "test12",
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, String(process.env.JWT_SECRET), {
            expiresIn: "1w",
        });
        const userId = String(user.id);
        const response = yield supertest_1.default.agent(server_1.default)
            .get(`/api/users/${userId}/profile`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(user.id);
        expect(response.body.email).toEqual(user.email);
    }));
});
