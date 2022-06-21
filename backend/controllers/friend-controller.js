const mongoose = require('mongoose');

const User = mongoose.model("User");

exports.sendRequest = async (req, res, next) => {
    try {
        const curUserID = req.body.curUserId; // current user
        const profileID = req.body.profileId; // user to be added
        
        await User.findByIdAndUpdate(curUserID, {$push: {sentRequest: profileID }})
        await User.findByIdAndUpdate(profileID, {$push: {friendRequests: curUserID }})
        res.send()
    } catch(err) {
        console.log(err)
    }   
}

// display the friend requests
exports.postRequests = async (req, res) => {
    try {
        const curUserID = req.body.curUserId;
        let requests = []

        // get first the array of strings (id)
        await User.findById(curUserID, (err, result) => {
            if (!err) { 
                requests = result.friendRequests;
            }
        })

        // send all the users found in the requests array
        await User.find({_id : {$in : requests}}, (err, reqs) => {
            if (!err) {
                res.send(reqs)
            }
        })

    } catch (error) {
        console.log(error)
    }
}


exports.acceptRequest = async (req, res) => {
    try {
        const curUserID = req.body.curUserID; // current user
        const profileID = req.body.userID; // user to be accepted
        
        await User.findByIdAndUpdate(curUserID, {$push: {friends: profileID }, $pull: {friendRequests: profileID}})
        await User.findByIdAndUpdate(profileID, {$push: {friends: curUserID }, $pull: {sentRequest: curUserID}})

        res.send()
    } catch (error) {
        console.log(error)
    }
}


exports.rejectRequest = async (req, res) => {
    try {
        const curUserID = req.body.curUserID;
        const profileID = req.body.userID;
        
        await User.findByIdAndUpdate(curUserID, {$pull: {friendRequests: profileID}})
        await User.findByIdAndUpdate(profileID, {$pull: {sentRequest: curUserID}})

        res.send()
    } catch (error) {
        console.log(error)
    }
}


exports.displayFriends = async (req, res) => {
    try {
        const curUserID = req.body.curUserID;
        let friendLists = []

        await User.findById(curUserID, (err, curUser) => {
            if (!err) { 
                friendLists = curUser.friends;
            }
        })

        await User.find({_id : {$in : friendLists}}, (err, friends) => {
            if (!err) {
                res.send(friends)
            }
        })

    } catch (error) {
        console.log(error)
    }
}