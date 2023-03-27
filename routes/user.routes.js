const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//registration
userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body;
    try {
        //check if user already exists
        const userExists = await UserModel.findOne({ email })
        if (userExists) {
            return res.status(400).send({ "msg": "User already exist, please login" })
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                const user = new UserModel({ name, email, gender, password: hash, age, city, is_married })
                await user.save();
                res.status(200).send({ "msg": "Registration Successful" })
            })
        }
    } catch (err) {
        res.status(400).send({ "msg": err.message });
    }

})

//login
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).send({ "msg": "Login Successful", "token": jwt.sign({ "userID": user._id }, "masai") })
                } else {
                    res.status(400).send({ "msg": err.message })
                }
            })
        } else {
            res.send("login Failed!");
        }
    } catch (err) {
        res.status(400).send({ "msg": err.message });
    }
})

module.exports = {
    userRouter
}