const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');


// GET /myrecipes
router.get('/myrecipes', (req, res, next) => {
    Recipe
        .find({user: req.session.userId})
        .exec((err, recipes) => {
            if (err) {
                return next(err);
            } else {
                res.status(200).json(recipes);
            }
        });
});

// GET recipes/:id
router.get('/:id', (req, res, next) => {
    Recipe
        .findById(req.params.id)
        .exec((err, recipe) => {
            if(err) {
                return next(err);
            } else {
                res.status(200).json(recipe);
            }
        });
});

// POST /create
router.post('/create', (req, res, next) => {
    const recipeData = {
            user: req.session.userId,
            title: req.body.title,
            description: req.body.description,
            ingredients: req.body.ingredients,
            directions: req.body.directions
        };
    Recipe
        .create(recipeData, (error, recipe) => {
            if (error) {
                return next(error);
            } else {
                return res.status(201).json(recipe);
            }
        });
});

// // PUT recipe/:id
router.put('/:id', (req, res, next) => {
    if (!(req.params.id && req.body.title)) {
        const message = 'A title is required.';
        console.error(message);
        return res.status(400).send(message);
    }

    const updated = {};
    const updateableFields = ['title', 'description', 'ingredients', 'directions'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Recipe
        .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .exec()
        .then(recipe => res.status(201).json(recipe))
        .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

// DELETE recipe/:id
router.delete('/:id', (req, res, next) => {
    Recipe
        .findByIdAndRemove(req.params.id)
        .exec((err, recipe) => {
            if(err) {
                return next(err);
            } else {
                res.status(204).end();
            }
        })
});

// POST /image
router.post('/image/:id', (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let sampleFile = req.files.sampleFile;
    let photoPath = '/user-image/' + req.params.id + '.jpg';

    sampleFile.mv('public' + photoPath, function(err) {
        if (err)
            return res.status(500).send(err);
    });

    Recipe.findByIdAndUpdate(req.params.id, { $set: { photo: photoPath }}, { new: true }, function (err, recipe) {
        if (err) return res.send(err);
        res.send(recipe.photo);
    });
});

module.exports = router;