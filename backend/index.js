const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/EXER10', 
    { useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) { console.log(err); }
        else { console.log("Successfully connected to mongo DB."); }
    }
);

// register User model with mongoose
require("./models/user");

// initialize the server
const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// allow CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, Accept, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// declare routes
require("./routes/auth-routes")(app); // pass server(app) so that the route files can use it
require("./routes/friend-routes")(app);
require("./routes/posts-routes")(app);
require("./routes/user-routes")(app);

const PORT = 3001;

// start server 
app.listen(PORT, (err) => {
    if(err) { console.log(err); }
    else {console.log("Server running at PORT", PORT); }
});