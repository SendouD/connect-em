import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');

interface AuthenticatedRequest extends Request {
    userId?: string;
    username?: string;
    email?: string;
}

const userAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.jwt;

    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }

    jwt.verify(token, "secret", (err: { name: string; expiredAt: any; }, data: any) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                res.status(401).json({ error: "Token expired", expiredAt: err.expiredAt });
                return;
            }
            res.status(400).json({ error: "Invalid Token" });
            return;
        }

        if (data) {
            req.email = data.email;
            next();
        } else {
            res.status(400).json({ error: "Invalid Token Data" });
        }
    });
};

export default userAuth;
