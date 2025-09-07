const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error(`Invalid email address : ${value}`);
        }
    },
    password : {
        type : String,
        required: true,
        minLength: 8
    }
},
{
    timestamps: true
});

userSchema.methods.getJwt = async function () { 
    const token = await jwt.sign({"id" : this.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    return token;
}

userSchema.methods.validatePassword = async function (userProvidedPassword) {
    const isPasswordValid = await bcrypt.compare(userProvidedPassword, this.password);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);