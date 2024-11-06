"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.status(401).json({ error: "Invalid token" });
    jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET), (err, payload) => {
        if (err)
            return res.status(401).json({ error: "Invalid token" });
        req.session = payload;
        next();
    });
};
exports.default = authenticateUser;
