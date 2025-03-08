import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/formRoutes";
import userAuth from "./middlewares/authMiddleware";
import proposalRoutes from "./routes/proposalRoutes";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};  

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/form", userAuth, userRoutes);
app.use("/api/proposal", proposalRoutes);

app.get("/api/test", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Test route",
        temp: "hello"
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;