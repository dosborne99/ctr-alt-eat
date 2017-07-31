function checkLoggedIn(req, res, next) {
    if(req.session && req.session.userId) {
        return res.redirect('myrecipes');
    }
    return next();
}

function isAth(req, res, next) {
    if(!req.session || !req.session.userId) {
        return res.redirect('login');
    }
    return next();
}

function isAthData(req, res, next) {
    if(!req.session || !req.session.userId) {
        var err = new Error('You need to log-in');
        return res.status(401).send(err);
    }
    return next();
}


module.exports.isAth = isAth,
module.exports.checkLoggedIn = checkLoggedIn;