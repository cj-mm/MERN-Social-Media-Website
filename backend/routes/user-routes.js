const controller = require('../controllers/user-controller');

module.exports = (app) => {
    app.get("/search", controller.searchResults);
    app.post("/profile", controller.userProfile);
}