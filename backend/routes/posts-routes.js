const controller = require('../controllers/posts-controller');

module.exports = (app) => {
    app.post("/displayposts", controller.displayPosts);
    app.post("/addpost", controller.addPost);
    app.post("/deletepost", controller.deletePost);
    app.post("/editpost", controller.editPost);
}