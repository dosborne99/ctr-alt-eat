const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    fullName: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true} 
});
UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({ email: email })
        .exec(function(error, user){
            if (error) {
                return callback(error);
            } else if ( !user ) {
                const err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare( password, user.password, function(error, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        })
};
UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
})
const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;