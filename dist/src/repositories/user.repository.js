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
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_model_2 = __importDefault(require("../models/user.model"));
class UserRepository {
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.create({
                    username: user.username,
                    email: user.email,
                    password: user.password
                });
            }
            catch (err) {
                throw new Error("Failed to create user");
            }
        });
    }
    filterAll(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let condition = {};
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.username)
                    condition.title = { [sequelize_1.Op.iLike]: `%${searchParams.username}%` };
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.email)
                    condition.title = { [sequelize_1.Op.iLike]: `%${searchParams.email}%` };
                return yield user_model_2.default.findAll({ where: condition });
            }
            catch (error) {
                throw new Error("Failed to retrieve users!");
            }
        });
    }
    findByID(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findByPk(userId);
            }
            catch (error) {
                throw new Error("Failed to retrieve user!");
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findOne({ where: { email: email } });
            }
            catch (error) {
                throw new Error("Failed to retrieve user!");
            }
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findOne({ where: { username: username } });
            }
            catch (error) {
                throw new Error("Failed to retrieve user!");
            }
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, username, email } = user;
            try {
                const affectedRows = yield user_model_1.default.update({ username: username, email: email }, { where: { id: id } });
                return affectedRows[0];
            }
            catch (error) {
                throw new Error("Failed to update User!");
            }
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.destroy({ where: { id: userId } });
            }
            catch (error) {
                throw new Error("Failed to delete User!");
            }
        });
    }
}
exports.default = new UserRepository();
