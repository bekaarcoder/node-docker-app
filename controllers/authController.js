const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.signUp = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        user = await User.create({
            username: username,
            password: hashPassword,
        });
        res.status(201).json({
            status: "success",
            data: {
                user: user,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "User not found.",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials.",
            });
        }

        res.status(200).json({
            status: "success",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};
