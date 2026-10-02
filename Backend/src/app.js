const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

// enabling CORS for all routes
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// requiring all the routes here
const authRoute = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");

// using all the routes here
app.use("/api/auth", authRoute);
app.use("/api/interview", interviewRouter);

module.exports = app;
