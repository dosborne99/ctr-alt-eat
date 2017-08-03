const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /login
router.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, (error, user) => {
            if (error || !user) {
                const err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                res.status(200).json(user);
            }
        });
    } else {
        const err = new Error('Email and password are required.');
        err.status = 401;
        return next(err);
    }
});

// POST /register
router.post('/register', (req, res, next) => {
    if (req.body.fullName &&
        req.body.email &&
        req.body.password &&
        req.body.confirmPassword) {

        if ( req.body.password !== req.body.confirmPassword ){
            const err = new Error('Passwords did not match.');
            err.status = 400;
            return next(err);
        }

        const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        };

        User.create(userData, (error, user) => {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.json(user);
            }
        });

    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;