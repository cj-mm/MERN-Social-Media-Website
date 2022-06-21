const controller = require('../controllers/friend-controller');

module.exports = (app) => {
    app.post("/sendrequest", controller.sendRequest);
    app.post("/postrequests", controller.postRequests);
    app.post("/acceptrequest", controller.acceptRequest);
    app.post("/rejectrequest", controller.rejectRequest);
    app.post("/displayfriends", controller.displayFriends);
}