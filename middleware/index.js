function checkLoggedIn(req, res, next) {
    if(req.session && req.session.userId) {
        res.redirect('profile');
    }
    return next();
}

module.exports.checkLoggedIn = checkLoggedIn;