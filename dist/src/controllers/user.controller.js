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
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class UserController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email || !req.body.username || !req.body.password) {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
                return;
            }
            try {
                const { email, username, password } = req.body;
                let userExists = yield user_repository_1.default.findByEmail(email);
                if (userExists) {
                    return res
                        .status(400)
                        .json({ error: "User with this email already exists" });
                }
                userExists = yield user_repository_1.default.findByUsername(username);
                if (userExists) {
                    return res
                        .status(400)
                        .json({ error: "User with this username already exists" });
                }
                // generate password hash
                const hashedPassword = yield bcrypt_1.default.hash(password, 12);
                //save user
                const user = new user_model_1.default({
                    email: email,
                    username: username,
                    password: hashedPassword
                });
                const savedUser = yield user_repository_1.default.save(user);
                res.status(201).send({
                    id: savedUser.id,
                    email: savedUser.email,
                    username: savedUser.username,
                    createdAt: savedUser.createdAt,
                    updatedAt: savedUser.updatedAt,
                });
            }
            catch (err) {
                res.status(500).send({
                    error: "Some error occurred while retrieving Users."
                });
            }
        });
    }
    filterAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = typeof req.query.username === "string" ? req.query.username : "";
            const email = typeof req.query.email === "string" ? req.query.email : "";
            try {
                const users = yield user_repository_1.default.filterAll({ username: username, email: email });
                let userArr = [];
                users.forEach((user) => {
                    userArr.push({
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    });
                });
                res.status(200).send(userArr);
            }
            catch (err) {
                res.status(500).send({
                    error: "Some error occurred while retrieving users."
                });
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield user_repository_1.default.findByEmail(email);
                if (!user) {
                    return res.status(404).json({ error: "Invalid email or password." });
                }
                const validPassword = yield bcrypt_1.default.compare(password, user.password || "");
                if (!validPassword) {
                    return res.status(401).json({ error: "Invalid email or password." });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.dataValues.id }, process.env.JWT_SECRET, {
                    expiresIn: "1w", // token will be valid for 1 week
                });
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('token', token);
                if (user)
                    res.status(200).send({
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    });
            }
            catch (err) {
                res.status(500).send({
                    message: `Error retrieving user with id=${email}.`
                });
            }
        });
    }
    getUserByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const user = yield user_repository_1.default.findByID(id);
                if (user)
                    res.status(200).send({
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    });
                else
                    res.status(404).send({
                        message: `Cannot find user with id=${id}.`
                    });
            }
            catch (err) {
                res.status(500).send({
                    message: `Error retrieving user with id=${id}.`
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { username, email } = req.body;
            const id = parseInt(req.params.id);
            try {
                let user = yield user_repository_1.default.findByID(id);
                if (!user) {
                    return res.status(404).json({ error: `user with ${id} not found` });
                }
                user.username = username;
                user.email = email;
                const num = yield user_repository_1.default.update(user);
                if (num == 0) {
                    return res.status(400).json({ error: "failed to update user" });
                }
                //get  the update user
                user = yield user_repository_1.default.findByID(id);
                if (user) {
                    res.status(200).send({
                        id: user === null || user === void 0 ? void 0 : user.id,
                        email: user === null || user === void 0 ? void 0 : user.email,
                        username: user === null || user === void 0 ? void 0 : user.username,
                        createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
                        updatedAt: user === null || user === void 0 ? void 0 : user.updatedAt,
                    });
                }
                else {
                    res.send({
                        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                    });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Error updating User with id=${id}.`
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                let user = yield user_repository_1.default.findByID(id);
                if (!user) {
                    return res.status(404).json({ error: `user with ${id} not found` });
                }
                const num = yield user_repository_1.default.delete(id);
                if (num == 1) {
                    res.send({
                        message: "User was deleted successfully!"
                    });
                }
                else {
                    res.send({
                        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                    });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Could not delete User with id==${id}.`
                });
            }
        });
    }
}
exports.default = UserController;
