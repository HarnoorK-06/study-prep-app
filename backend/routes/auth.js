const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Sign up
router.post('/signup', async(req, res) => {
    try {
        // step 1: get name , email, password from req.body
        const {name, email, password} = req.body;
        
        // step 2: check all the fields exist
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // step 3: check email not already taken 
        const userexists = await User.findOne({email});
        if (userexists) {
            return res.status(400).json({
                success: false,
                message: 'Email is already in use.'
            });
        }
        
        // step 4: check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }
        
        // step 5: hash the password with bcrypt 
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);

        // step 6: save new user to database
        const newuser = new User({
            name, 
            email, 
            password: hashpass,
        });
        await newuser.save();

        // step 7: create JWT token 
        const token = jwt.sign({
            userId: newuser._id
        }, 
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
        );
        
        // step 8: send back token + user info 
        return res.status(201).json({
            success: true,
            message: 'Signup successful!',
            token, 
            user: {
                id: newuser._id, 
                name, 
                email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});   


// Login
router.post('/login', async(req, res) => {
    try{
        // step 1: get email , password from req.body
        const {email, password} = req.body;
        
        // step 2: check all fields exist
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }
        
        // step 3: find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // step 4: compare password with hashed password
        const passisamatch = await bcrypt.compare(password, user.password);
        if (!passisamatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // step 5: create jwt token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        // step 6: send token back
        return res.status(200).json({
            success: true,
            message: 'Login successful!', 
            token: token, 
            user: {
                id: user._id, 
                email: user.email
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error during login.',
            error: error.message
        });
    }
});

module.exports = router;
