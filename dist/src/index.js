"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./db"));
const cors_2 = __importDefault(require("./middleware/cors"));
class Server {
    constructor(app) {
        this.config(app);
        this.syncDatabase();
        new routes_1.default(app);
    }
    config(app) {
        app.use((0, cors_1.default)(cors_2.default));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, morgan_1.default)("common"));
    }
    syncDatabase() {
        var _a;
        const db = new db_1.default();
        (_a = db.sequelize) === null || _a === void 0 ? void 0 : _a.sync();
    }
}
exports.default = Server;
