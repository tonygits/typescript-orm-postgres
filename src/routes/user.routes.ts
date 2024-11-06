import { Router } from "express";
import UserController from "../controllers/user.controller";
import authenticateUser from "../utls/authentication";

class UserRoutes {
    router = Router();
    controller = new UserController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // Create a new Tutorial
        this.router.post("/register", this.controller.registerUser);

        // Retrieve all Tutorials
        this.router.get("/", authenticateUser, this.controller.filterAllUsers);

        // Retrieve all published Tutorials
        this.router.post("/login", this.controller.userLogin);

        // Retrieve a single Tutorial with id
        this.router.get("/:id/profile", authenticateUser, this.controller.getUserByID);

        // Update a Tutorial with id
        this.router.put("/:id", authenticateUser, this.controller.updateUser);

        // Delete a Tutorial with id
        this.router.delete("/:id", authenticateUser, this.controller.deleteUser);
    }
}

export default new UserRoutes().router;
