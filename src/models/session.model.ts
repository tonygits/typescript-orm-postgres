import { JwtPayload } from "jsonwebtoken";

export interface SessionPayload extends JwtPayload {
    userId: number;
}

export interface RequestWithUser {
    session: SessionPayload;
}
