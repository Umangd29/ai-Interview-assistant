const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");


const allowedOrigins = [
"http://localhost:5173",
process.env.FRONTEND_URL
].filter(Boolean);

// CORS configuration
app.use(cors({
origin: allowedOrigins,
credentials: true
}));
 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Interview Assistant API(Backend) is running"
    });
});

// requiring all the routes here
const authRoute = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");

// using all the routes here
app.use("/api/auth", authRoute);
app.use("/api/interview", interviewRouter);

module.exports = app;
