const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies['auth_token'];
        if(!token) return res.status(401).send({error: "Unauthorized access : Token missing"});

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.id) return res.status(401).send({error: "Unauthorized access: Invalid token"});

        const user = await User.findById(decoded.id);
        if(!user) return res.status(401).send({error: "Unauthorized access: User not found"});  
        req.user = user;
        next();
    } catch (error) {
        console.log("Error inside auth middleware", error);
        return res.status(500).send({error: "Something went wrong"});
    }
}

module.exports = authMiddleware;