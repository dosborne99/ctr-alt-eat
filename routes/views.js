const express = require('express');
const router = express.Router();
const mid = require('../middleware');
const Recipe = require('../models/recipe');

// GET
router.get('/', mid.checkLoggedIn, (req, res) => {
    res.render('index');
});

// GET /login
router.get('/login', mid.checkLoggedIn, (req, res) => {
    res.render('login');
});

// GET /create
router.get('/create', (req, res) => {
    res.render('createRecipe');
});

// GET /logout
router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }    
});

// GET /fullview
router.get('/fullview/:id', (req, res, next) => {
    Recipe.findById(req.params.id)
          .exec((err, recipe) => {
            if (err) {
                return next(err);
            } else {
                res.render('fullView', {recipe});
            }   
          });
});

// GET /myrecipes -Edit
router.get('/myrecipes/:id', mid.isAth, (req, res) => {
    Recipe.findById(req.params.id)
      .exec((err, recipe) => {
        if (err) {
            return next(err);
        } else {
            res.render('editRecipe', {recipe});
        }   
      });
})

// GET /register -VIEW
router.get('/register', mid.checkLoggedIn, (req, res) => {
    res.render('register');
});

// GET /myrecipes -VIEW
router.get('/myrecipes', mid.isAth, (req, res) => {
    res.render('recipeList');
})



module.exports = router;