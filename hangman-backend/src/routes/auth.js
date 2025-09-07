const express = require('express');
const authRouter = express.Router();
const {signUpValidation, loginValidation} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");


authRouter.post('/signup', async (req, res) => {
    try {
        signUpValidation(req);
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, process.env.HASHING_SALT);
        const user = new User({email, password: hashedPassword});
        await user.save();
        return res.status(201).send({message: "User registered successfully"});
    } catch (error) {
        return res.status(400).send({error: "User registration failed: " + error.message});
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        loginValidation(req);
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) throw new Error("Invalid credentials");

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) throw new Error("Invalid password");

        const token = await user.getJwt();
        res.cookie('auth_token', token, {httpOnly: true});
         
        res.send({message: "Login successful"});
    } catch (error) {
        return res.status(400).send({error: "Login failed: " + error.message});
    }
});

authRouter.post('/logout', (req, res) => {
    res.cookie('auth_token', null, {expires: new Date(Date.now()), httpOnly: true});
    return res.send({message: "Logout successful"});
});

module.exports = authRouter;