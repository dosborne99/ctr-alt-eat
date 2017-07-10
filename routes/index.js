const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Recipe = require('../models/recipe');
const mid = require('../middleware');

// GET
router.get('/', mid.checkLoggedIn, (req, res) => {
    res.render('index');
});

// GET /profile
router.get('/profile', (req, res) => {
    User.findById(req.session.userId)
        .exec((err, user) => {
            if (err) {
                return next(err);
            } else {

                Recipe.find({user: user})
                      .then(recipe => {
                         console.log(recipe);
                         res.json(recipe);
                }
            // return res.render('profile', {name: user.fullName});
        );
               
            } 
        });
    console.log(req.session.userId);
    var x = req.session.userId;

});

// GET /register
router.get('/register', mid.checkLoggedIn, (req, res) => {
    res.render('register');
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
                return res.redirect('/');
            }
        });

    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

// GET /login
router.get('/login', mid.checkLoggedIn, (req, res) => {
    res.render('login');
});

// POST /login
router.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, (error, user) => {
            if (error || !user) {
                const err = new Error('Wrong username or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        const err = new Error('Email and password are required.');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;