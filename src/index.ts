import express, {Application} from "express";
import cors from "cors";
import Routes from "./routes";
import morgan from "morgan"
import Database from "./db";
import options from "./middleware/cors";

export default class Server {
    constructor(app: Application) {
        this.config(app);
        this.syncDatabase();
        new Routes(app);
    }

    private config(app: Application): void {
        app.use(cors(options));
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(morgan("common"));
    }

    private syncDatabase(): void {
        const db = new Database();
        db.sequelize?.sync();
    }
}
