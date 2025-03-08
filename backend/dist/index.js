"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const formRoutes_1 = __importDefault(require("./routes/formRoutes"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const proposalRoutes_1 = __importDefault(require("./routes/proposalRoutes"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URI || "");
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/form", authMiddleware_1.default, formRoutes_1.default);
app.use("/api/proposal", proposalRoutes_1.default);
app.get("/api/test", (req, res) => {
    res.status(200).json({
        message: "Test route",
        temp: "hello"
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = app;
