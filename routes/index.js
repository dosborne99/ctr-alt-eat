const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const Recipe = require('../models/recipe');
const mid = require('../middleware');


// DELETE /recipe
router.delete('/recipe/:id', (req, res) => {
    Recipe.findByIdAndRemove(req.params.id)
          .exec()
          .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
          });
    res.status(200).end();
});

module.exports = router;