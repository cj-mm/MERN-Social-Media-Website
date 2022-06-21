const mongoose = require('mongoose');

const User = mongoose.model("User");

// display posts of user and friends
exports.displayPosts = async (req, res) => {
    try {
        const curUserID = req.body.curUserID;
        let friendLists = []
        let posts = []

        // user's posts first
        await User.findById(curUserID, (err, curUser) => {
            if (!err) { 
                friendLists = curUser.friends;
                posts = curUser.posts;
            }
        })

        // add friends' posts
        await User.find({_id : {$in : friendLists}}, (err, friends) => {
            if (!err) {
                friends.map((friend) => {
                    if (friend.posts.length !== 0) {
                        posts = posts.concat(friend.posts);
                    }
                })

                // sort posts based on timestamp/date
                posts.sort((a, b) => {
                    var dateA = new Date(a.timestamp) , dateB = new Date(b.timestamp)
                    return dateB - dateA;
                });
                
                res.send(posts)
            }
        })

    } catch (error) {
        console.log(error)
    }
}

exports.addPost = (req, res) => {
    User.findByIdAndUpdate(req.body.authorID, {$push: {posts: req.body}}, () => {
        res.send()
    })
}

exports.deletePost = (req, res) => {
    User.findByIdAndUpdate(req.body.authorID, {$pull: {posts: req.body.post}}, () => {
        res.send()
    })
}


exports.editPost = (req, res) => {
    User.updateOne({_id: req.body.authorID, posts: req.body.post}, {$set: { "posts.$.content": req.body.editedContent}}, () => {
        res.send()
    })
}