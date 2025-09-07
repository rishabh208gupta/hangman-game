const validator = require("validator");

const signUpValidation = (req) => {
    const {email, password} = req.body;
    if(!email) throw new Error("Email is required");
    if(!password) throw new Error("Password is required");

    if(!validator.isEmail(email)) throw new Error(`Email ${email} is not a valid email id`);
    if(!validator.isStrongPassword(password)) throw new Error("Password is not strong enough");
};

const loginValidation = (req) => {
    const {email, password} = req.body;
    if(!email) throw new Error("Email is required");
    if(!password) throw new Error("Password is required");

    if(!validator.isEmail(email)) throw new Error(`Email ${email} is not a valid email id`);
};

const gameValidation = (req) => {
    const {_id, currentWord, lettersGuessed,  attemptsLeft, wordsGuessed, userId, timeRemaining} = req.body;
    if (!_id) throw new Error("Game ID is required");
    if(!currentWord) throw new Error("Word is required");
    if(!lettersGuessed) throw new Error("Letters guessed is required");
    if(!wordsGuessed) throw new Error("Words guessed is required");
    if(!userId) throw new Error("User ID is required");
    if(timeRemaining == null) throw new Error("Time remaining is required");
    if (attemptsLeft == null) throw new Error("Attempts left is required");

    if (attemptsLeft < 0) throw new Error("Attempts left cannot be negative");
    if (timeRemaining < 0) throw new Error("Time remaining cannot be negative");
}
module.exports = {
    signUpValidation,
    loginValidation,
    gameValidation
};