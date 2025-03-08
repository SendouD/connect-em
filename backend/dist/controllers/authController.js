"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, username } = req.body;
    try {
        if (!firstName || !lastName || !email || !password || !username) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, 12);
        const newUser = new userModel_1.default({ firstName, lastName, email, password: hashedPassword, username });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ Error: "User not found!" });
            return;
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ Error: "Invalid credentials!" });
            return;
        }
        const token = jwt.sign({ username: user.username, userId: user._id, email: user.email }, 'secret', { expiresIn: '1d' });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24,
        }).status(200).json({ message: 'Success', token });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});
exports.signin = signin;
