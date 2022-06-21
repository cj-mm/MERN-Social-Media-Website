const controller = require('../controllers/auth-controller');

module.exports = (app) => {
    app.post("/signup", controller.signUp);
    app.post("/login", controller.login);
    app.post("/checkifloggedin", controller.checkIfLoggedIn);
}