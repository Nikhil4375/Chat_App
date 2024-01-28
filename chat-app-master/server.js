const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const http = require("http"); // Import the http module

const users = require("./routes/api/users");
const messages = require("./routes/api/messages");

const app = express();
const port = process.env.PORT || 5000;

// Use the http module to create an HTTP server
const server = http.createServer(app);

const io = require("socket.io")(server); // Use the server object with socket.io

// Body Parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
