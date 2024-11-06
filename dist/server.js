"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./src/index"));
require("dotenv/config");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
if (process.env.NODE_ENV == "development") {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env.development") });
}
if (process.env.NODE_ENV == "test") {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env.test") });
}
const app = (0, express_1.default)();
const server = new index_1.default(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
app.listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
})
    .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log("Error: address already in use");
    }
    else {
        console.log(err);
    }
});
exports.default = app;
