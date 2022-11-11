const User = require('../models/userSchema');
var jwt = require('jsonwebtoken');
const {expressjwt: expressJwt} = require("express-jwt");
const { check, validationResult } = require('express-validator');

// Sign up
exports.signup = (req, res) => {
    console.log("REQ BODY ON SIGNUP", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "Not able to save user in DB"
            });
        }
        return res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

// Sign in
exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User email does not exist"
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }

        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // Put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        // Send response to front end
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    });
};

// Sign out

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
};

// Protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
});

// validate sign up middleware
exports.userSignupValidator = (req, res, next) => {
    console.log("REQ BODY ON VALIDATOR", req.body);
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }
    if (name.length < 3) {
        return res.status(400).json({
            error: "Name must be at least 3 characters long"
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            error: "Password must be at least 6 characters long"
        });
    }
    if (phoneNumber.length < 10) {
        return res.status(400).json({
            error: "Phone number must be at least 10 characters long"
        });
    }
    next();
};

// validate sign in middleware
exports.userSigninValidator = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }
    next();
};


// Custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};


exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not ADMIN, Access denied"
        });
    }
    next();
};


