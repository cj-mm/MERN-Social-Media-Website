const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    firstName: {type: String, required: true },
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    friends:  [String],
    friendRequests: [String],
    sentRequest: [String],
    posts: [{authorID: String, authorName: String, timestamp: Date, content: String}]
});

UserSchema.pre("save", function(next) {
    const user = this;

    if (!user.isModified("password")) return next();

    // returns a modified document with a hashed password -- this will be the version of the document that will be saved
    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            user.password = hash;
            return next();
        })
    })
})

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model("User", UserSchema);