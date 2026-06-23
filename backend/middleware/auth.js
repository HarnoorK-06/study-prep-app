// 1. look at the incoming request and find the JWT token in the header
// 2. check if the token exists => if no then stop here and send 401 
// 3. varify the token is real and not tampered => if fake stop ad send 401 error 
// 4. if valid => decode it and get the userID out attach it to the request so controllers can use it
// 5. call next () let the request continue to the controller


// middleware 
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({error: 'Access denied. No token provided.'});

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch(error) {
        res.status(401).json({error: 'Invalid Token'});
    }
};

module.exports = auth;