import { Request, Response } from "express";
import User from "../models/userModel";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const signup = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, username } = req.body;

    try {
        if(!firstName || !lastName || !email || !password || !username) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ firstName, lastName, email, password: hashedPassword, username });
        await newUser.save();
        res.status(201).json(newUser);

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ Error: "User not found!" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ Error: "Invalid credentials!" });
            return;
        }

        const token = jwt.sign({ username: user.username, userId: user._id, email: user.email }, 'secret', { expiresIn: '1d' });
        res.cookie('jwt', token, {
            httpOnly:true,
            secure:true,
            sameSite:'none',
            maxAge: 1000 * 60 * 60 * 24,
        }).status(200).json({ message: 'Success', token });
        
        return;
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

export const getMe = async (req: Request, res: Response) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
  
    try {
        const decoded = jwt.verify(token, 'secret');
        res.status(200).json({
            username: decoded.username,
            userId: decoded.userId,
            email: decoded.email
        });
        return;
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
}