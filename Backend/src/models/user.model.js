const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username Already Exists"],
        required: true
    },
    email: {
        type: String,
        unique: [true, "Email Already Exists"],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;