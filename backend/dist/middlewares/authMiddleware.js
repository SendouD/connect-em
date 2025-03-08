"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const userAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }
    jwt.verify(token, "secret", (err, data) => {
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
        }
        else {
            res.status(400).json({ error: "Invalid Token Data" });
        }
    });
};
exports.default = userAuth;
