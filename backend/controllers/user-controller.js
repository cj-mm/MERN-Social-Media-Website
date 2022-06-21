const mongoose = require('mongoose');

const User = mongoose.model("User");

exports.searchResults = (req, res) => { 
    const user = req.query.user;
    const userRegex = new RegExp(user.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");

    // regex - can search by first name, last name, or combination of both
    User.find(
        {$or: [{firstName: userRegex}, 
            {lastName: userRegex},
            {
                $expr: {
                  $regexMatch: {
                    "input": { $concat: ["$firstName", " ", "$lastName"] },
                    "regex": user,
                    "options": "i"
                  }
                }
            }
            ]}, 
        
        (err, result) => {
        if (!err) {res.send(result)}
    })
}

exports.userProfile = (req, res) => {
    if (!req.query.id) { return res.send('No id provided') }

    const curUserid = req.body.userId;

    User.findOne({ _id: req.query.id}, (err, result) => {
        if (!err) { 
            // status of the user in relation to the current user
            if (curUserid == result._id) {
                res.send({result, status: "current_user"})
            } else if (result.friends.includes(curUserid)) {
                res.send({result, status: "friend"})
            } else if (result.friendRequests.includes(curUserid)) {
                res.send({result, status: "sent_request"})
            } else if (result.sentRequest.includes(curUserid)) {
                res.send({result, status: "friend_request"})
            } else {
                res.send({result, status: "none"})
            }
        }
    })
}