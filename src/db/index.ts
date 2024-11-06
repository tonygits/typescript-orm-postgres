import {Sequelize} from "sequelize-typescript";
import Tutorial from "../models/tutorial.model";
import User from "../models/user.model";
import path from "path";
import dotenv from "dotenv";

const dialect = "postgres";

if (process.env.NODE_ENV == "test") {
    dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });
}

class Database {
    public sequelize: Sequelize | undefined;

    constructor() {
        this.connectToDatabase();
    }

    private async connectToDatabase() {
        console.log("database", process.env.DB_NAME)
        this.sequelize = new Sequelize({
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(String(process.env.DB_PORT)),
            dialect: dialect,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            models: [Tutorial, User]
        });

        await this.sequelize
            .authenticate()
            .then(() => {
                console.log("Connection has been established successfully.");
            })
            .catch((err) => {
                console.error("Unable to connect to the Database:", err);
            });
    }
}

export default Database;
