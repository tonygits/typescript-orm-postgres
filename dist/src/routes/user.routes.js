"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authentication_1 = __importDefault(require("../utls/authentication"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new user_controller_1.default();
        this.intializeRoutes();
    }
    intializeRoutes() {
        // Create a new Tutorial
        this.router.post("/register", this.controller.registerUser);
        // Retrieve all Tutorials
        this.router.get("/", authentication_1.default, this.controller.filterAllUsers);
        // Retrieve all published Tutorials
        this.router.post("/login", this.controller.userLogin);
        // Retrieve a single Tutorial with id
        this.router.get("/:id/profile", authentication_1.default, this.controller.getUserByID);
        // Update a Tutorial with id
        this.router.put("/:id", authentication_1.default, this.controller.updateUser);
        // Delete a Tutorial with id
        this.router.delete("/:id", authentication_1.default, this.controller.deleteUser);
    }
}
exports.default = new UserRoutes().router;
