const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/**
 * @name registerUserController
 * @description Controller to register a new user
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req,res){

    const {email, username, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }
    const isUserAlreadyExists = await userModel.findOne({$or: [{username}, {email}]});
    if(isUserAlreadyExists){
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username,
        email,
        password : hash
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
    });
    res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Controller to login a user
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req,res){
    const {email, password} = req.body;
    const user = await userModel.findOne({email})
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description Clear the token cookie and add the token to the blacklist
 * @route POST /api/auth/logout
 * @access Public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({
            success: false,
            message: "No token found"
        })
    }
    if(token){
        const Blacklist = require("../models/blacklist.model")
        await Blacklist.create({token})
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description Controller to get the logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
async function getMeController(req, res) {
    // res.status(200).json({
    //     success: true,
    //     User: req.user
    // });

    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {registerUserController, loginUserController, logoutUserController, getMeController}