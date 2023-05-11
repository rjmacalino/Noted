const User = require('../models/Users');
const Note = require('../models/Notes');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc    Get all users
// @route   GET /users
// @access  Private/Admin

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.status(200).json(users)
})

// @desc create a user
// @route POST /users
// @access Private/Admin

const createNewUser = asyncHandler(async (req, res) => {

    const { username, password, roles } = req.body

    // confirming data
    if (!username || !password || !Array.isArray(roles) || roles.length === 0) {
        return res.status(400).json({ message: 'Please provide all required fields' })
    }

    // checking if user already exists
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'User already exists' })
    }

    // hashing password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 is the salt

    const userObject = {
        username,
        "password": hashedPwd,
        roles
    }

    // creating new user

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created successfully`})
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }


})

// @desc update a user
// @route PATCH /users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {

    
})

// @desc delete a user
// @route DELETE /users/:id
// @access Private/Admin

const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}