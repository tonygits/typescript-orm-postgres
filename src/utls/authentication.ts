import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SessionPayload } from "../models/session.model";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.status(401).json({ error: "Invalid token" });

    jwt.verify(token, String(process.env.JWT_SECRET), (err, payload) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        (req as any).session = payload as SessionPayload;

        next();
    });
};

export default authenticateUser;
