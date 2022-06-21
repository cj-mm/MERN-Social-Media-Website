const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model("User");

exports.signUp = (req, res) => {
    const newuser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    console.log("New User: ");
    console.log(newuser);

    newuser.save((err) => {
        if (err) { return res.send( {success: false }); }
        else { return res.send({ success: true }); }
    });
}

exports.login = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;

    User.findOne({ email }, (err, user) => {
        // check if email exists
        if (err || !user ) {
            // Scenario 1: FAIL - User doesn't exist
            console.log("user doesn't exist");
            return res.send({ success: false });
        }

        // check if password is correct
        user.comparePassword(password, (err, isMatch) => {
            if(err || !isMatch) {
                // Scenario 2: FAIL - Wrong password
                console.log("wrong password");
                return res.send({ success: false });
            }

            console.log("Successfully logged in");

            // Scenario 3: SUCCESS - time to create a token
            const tokenPayload = {
                _id: user._id
            }

            const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING"); // secret string is normally a private key only known to the server
            return res.send({ success: true, token, userId: user._id, username: user.firstName+" "+user.lastName});
        });
    });
}

exports.checkIfLoggedIn = (req, res) => {
    // will expect the authToken from the client
    // authToken is stored in the cookie

    if (!req.cookies || !req.cookies.authToken) {
        // Scemario 1: FAIL - no cookies / no authToken cookie sent
        return res.send({ isLoggedIn: false });
    }

    // Token is present. Validate it
    return jwt.verify(
        req.cookies.authToken,
        "THIS_IS_A_SECRET_STRING",
        (err, tokenPayload) => {
            if (err) {
                // Scenario 2: FAIL - Error validating token
                return res.send({success: false});
            }

            const userId = tokenPayload._id;

            // depends on the developer what to do with the tokenPayload (here, just check if user exists)
            return User.findById(userId, (userErr, user) => {
                if (userErr || !user) {
                    // Scenario 3: FAIL - failed to find user based on id inside token payload
                    return res.send( {isLoggedIn: false });
                }

                // Scenario 4: SUCCESS - token and user id are valid
                console.log("user is currently logged in");
                return res.send({ isLoggedIn: true, userId });
            })
        })
}